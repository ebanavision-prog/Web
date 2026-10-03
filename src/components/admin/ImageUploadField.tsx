"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadImageAction } from "@/app/admin/(dashboard)/upload-action";

const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.82;

// Real photos from phones/cameras routinely come in at 5-15 MB. Resizing and
// re-encoding client-side before upload keeps the request body small (the
// production host enforces a size limit well under that, independent of
// Next's own configurable Server Action body limit) and is good practice
// regardless — nothing here needs more than ~2000px on the long edge.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  if (!blob || blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}

export default function ImageUploadField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-5">
      <label className="mb-1 block text-sm text-zinc-400">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="relative mb-2 h-32 w-32 overflow-hidden rounded-lg border border-zinc-700">
          <Image src={url} alt="" fill className="object-cover" unoptimized />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={isPending}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setError(null);
          startTransition(async () => {
            const compressed = await compressImage(file);
            const formData = new FormData();
            formData.set("file", compressed);
            const result = await uploadImageAction(formData);
            if (result.error) {
              setError(result.error);
            } else if (result.url) {
              setUrl(result.url);
            }
          });
        }}
        className="block text-sm text-zinc-400 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-white"
      />

      {isPending && <p className="mt-1 text-xs text-zinc-500">Subiendo...</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
