"use client";

import { useState, useTransition } from "react";
import { FileText, X } from "lucide-react";
import { uploadPdfAction } from "@/app/admin/(dashboard)/upload-action";

function filenameFromUrl(url: string) {
  return decodeURIComponent(url.split("/").pop() ?? url);
}

export default function PdfUploadField({
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

  return (
    <div className="mb-5">
      <label className="mb-1 block text-sm text-zinc-400">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-300">
          <FileText className="h-4 w-4 shrink-0 text-brand-red" />
          <span className="truncate">{filenameFromUrl(url)}</span>
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Quitar PDF"
            className="ml-auto shrink-0 text-zinc-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        type="file"
        accept="application/pdf"
        disabled={isPending}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setError(null);
          startTransition(async () => {
            const formData = new FormData();
            formData.set("file", file);
            const result = await uploadPdfAction(formData);
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
