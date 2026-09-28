"use client";

import type { ProcessStep } from "@prisma/client";
import LocaleTabsField from "@/components/admin/LocaleTabsField";

type LocalizedText = { es?: string; en?: string; fr?: string };

export default function ProcessStepForm({
  step,
  action,
}: {
  step?: ProcessStep;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-2xl">
      <LocaleTabsField
        label="Título"
        name="title"
        defaultValues={(step?.title as LocalizedText) ?? {}}
        required
      />
      <LocaleTabsField
        label="Descripción"
        name="description"
        defaultValues={(step?.description as LocalizedText) ?? {}}
        multiline
      />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Orden</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={step?.sortOrder ?? 0}
          className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <label className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <input type="checkbox" name="published" defaultChecked={step?.published ?? true} />
        Publicado
      </label>

      <button
        type="submit"
        className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700"
      >
        Guardar
      </button>
    </form>
  );
}
