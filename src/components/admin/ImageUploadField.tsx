"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadImageAction } from "@/app/admin/(dashboard)/upload-action";

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
          const formData = new FormData();
          formData.set("file", file);
          startTransition(async () => {
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
