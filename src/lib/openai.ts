import crypto from "crypto";
import { promises as fs } from "fs";
import OpenAI from "openai";
import path from "path";

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
  const voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" =
    "nova";
  const summaryHash = generateHash(summary);
  const audioFilePath = path.resolve(
    `./public/audios/${postSlug}-${summaryHash}-${voice}.mp3`
  );
  try {
    await fs.access(audioFilePath);
    console.log("Audio ya existente y actualizado. No se generará de nuevo.");
    return `/audios/${postSlug}-${summaryHash}-${voice}.mp3`;
  } catch (e) {
    console.log("No existe un audio actualizado. Generando...");
  }

  // Genera el audio con OpenAI
  const mp3 = await client.audio.speech.create({
    model: "tts-1",
    speed: 1.05,
    input: summary,
    voice: voice,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());

  await fs.mkdir(path.dirname(audioFilePath), { recursive: true });
  await fs.writeFile(audioFilePath, new Uint8Array(buffer));

  return `/audios/${postSlug}-${summaryHash}-${voice}.mp3`;
}
