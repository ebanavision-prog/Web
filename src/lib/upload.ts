import "server-only";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_WIDTH = 1920;

export async function saveUploadedImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen");
  }

  await mkdir(UPLOADS_DIR, { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const outputPath = path.join(UPLOADS_DIR, filename);

  await sharp(inputBuffer)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputPath);

  return `/uploads/${filename}`;
}
