import { list, put } from "@vercel/blob";
import crypto from "crypto";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";
const client = new ElevenLabsClient({
  apiKey: import.meta.env.ELEVENLABS_API_KEY,
});

/** Genera un hash para el contenido de summaryAi */
function generateHash(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex");
}

/** Convierte un Readable Stream en un Buffer */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    const uint8Chunk = Buffer.isBuffer(chunk)
      ? new Uint8Array(chunk)
      : new Uint8Array(Buffer.from(chunk));
    chunks.push(uint8Chunk);
  }
  return Buffer.concat(chunks);
}

/** Genera o reutiliza el audio del resumen del post */
export async function generateAudioIfNecessary(
  postSlug: string,
  summary: string
): Promise<string> {
  const voice = "dlGxemPxFMTY7iXagmOj";
  const summaryHash = generateHash(summary);
  const audioFileName = `audios/${postSlug}-${voice}-${summaryHash}.mp3`;
  try {
    // Verificar si el archivo ya existe en Vercel Blob usando list
    const existingBlobs = await list({
      prefix: `audios/`,
      mode: "expanded",
      token: import.meta.env.BLOB_READ_WRITE_TOKEN,
    });
    const existingBlob = existingBlobs.blobs.find(
      (blob) =>
        blob.pathname === audioFileName ||
        blob.pathname.startsWith(audioFileName)
    );
    if (existingBlob) {
      console.log("Audio ya existente y actualizado en Vercel Blob.");
      return existingBlob.url; // Retorna la URL del blob existente
    }
  } catch (e) {
    console.error(e);
    console.log("No existe un audio actualizado en Vercel Blob. Generando...");
  }
  // Genera el audio con ElevenLabs
  const mp3Stream = await client.generate({
    text: summary,
    voice: voice,
    model_id: "eleven_turbo_v2_5",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    },
  });

  // Convierte el Readable Stream en un Buffer
  const buffer = await streamToBuffer(mp3Stream);

  // Subir el archivo de audio a Vercel Blob usando `put`
  const { url } = await put(audioFileName, buffer, {
    access: "public",
    contentType: "audio/mpeg",
    cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 año,
    token: import.meta.env.BLOB_READ_WRITE_TOKEN,
  });

  return url;
}
