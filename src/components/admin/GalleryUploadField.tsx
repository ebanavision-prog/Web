"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { uploadImageAction } from "@/app/admin/(dashboard)/upload-action";
import { compressImage } from "@/lib/image-compress";

export default function GalleryUploadField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: unknown;
}) {
  const initial = Array.isArray(defaultValue) ? (defaultValue as string[]) : [];
  const [urls, setUrls] = useState<string[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    startTransition(async () => {
      for (const file of Array.from(files)) {
        const compressed = await compressImage(file);
        const formData = new FormData();
        formData.set("file", compressed);
        const result = await uploadImageAction(formData);
        if (result.error) {
          setError(result.error);
        } else if (result.url) {
          setUrls((prev) => [...prev, result.url!]);
        }
      }
    });
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="mb-5">
      <label className="mb-1 block text-sm text-zinc-400">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      {urls.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {urls.map((url, index) => (
            <div
              key={url + index}
              className="group relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-700"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Quitar foto"
                className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 opacity-0 transition group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        disabled={isPending}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        className="block text-sm text-zinc-400 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-white"
      />

      {isPending && <p className="mt-1 text-xs text-zinc-500">Subiendo...</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
