"use client";

import type { AboutStat } from "@prisma/client";
import LocaleTabsField from "@/components/admin/LocaleTabsField";
import AdminForm from "@/components/admin/AdminForm";

type LocalizedText = { es?: string; en?: string; fr?: string };

export default function AboutStatForm({
  stat,
  action,
}: {
  stat?: AboutStat;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}) {
  return (
    <AdminForm action={action} redirectTo="/admin/about-stats" className="max-w-2xl">
      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">
          Número (ej. 250+, 7+, 100%, 24/7)
        </label>
        <input
          type="text"
          name="value"
          required
          defaultValue={stat?.value ?? ""}
          className="w-full max-w-xs rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <LocaleTabsField
        label="Etiqueta"
        name="label"
        defaultValues={(stat?.label as LocalizedText) ?? {}}
        required
      />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Orden</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={stat?.sortOrder ?? 0}
          className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <label className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <input type="checkbox" name="published" defaultChecked={stat?.published ?? true} />
        Publicado
      </label>
    </AdminForm>
  );
}
