import { list, put } from "@vercel/blob";
import crypto from "crypto";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

/** Genera un hash para el contenido de summaryAi */
function generateHash(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex");
}

/** Genera o reutiliza el audio del resumen del post */
export async function generateAudioIfNecessary(
  postSlug: string,
  summary: string
): Promise<string> {
  const summaryHash = generateHash(summary);
  const audioFileName = `audios/${postSlug}-${summaryHash}.mp3`;
  console.log("audioFileName", audioFileName);

  try {
    // Verificar si el archivo ya existe en Vercel Blob usando list
    const existingBlobs = await list({ prefix: `audios/`, mode: "expanded" });

    console.log("existingBlobs", existingBlobs);
    console.log("existingBlobsBlobs", existingBlobs.blobs);
    const existingBlob = existingBlobs.blobs.find(
      (blob) =>
        blob.pathname === audioFileName ||
        blob.pathname.startsWith(audioFileName)
    );
    console.log("existingBlob", existingBlob);
    if (existingBlob) {
      console.log("Audio ya existente y actualizado en Vercel Blob.");
      return existingBlob.url; // Retorna la URL del blob existente
    }
  } catch (e) {
    console.log("No existe un audio actualizado en Vercel Blob. Generando...");
  }

  // Genera el audio con OpenAI
  const mp3 = await client.audio.speech.create({
    model: "tts-1",
    input: summary,
    voice: "nova",
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  console.log("audioFileNameFinal", audioFileName);

  // Subir el archivo de audio a Vercel Blob usando `put`
  const { url } = await put(audioFileName, buffer, {
    access: "public",
    contentType: "audio/mpeg",
    cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 año
  });
  console.log("audioFileNameFinalUrl", url);

  return url;
}
