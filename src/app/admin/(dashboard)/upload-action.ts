"use server";

import { requireSession } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/upload";

export async function uploadImageAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No se seleccionó ningún archivo" };
  }

  try {
    const url = await saveUploadedImage(file);
    return { url };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al subir la imagen" };
  }
}
