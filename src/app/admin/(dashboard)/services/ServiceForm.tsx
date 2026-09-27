"use client";

import type { Service } from "@prisma/client";
import LocaleTabsField from "@/components/admin/LocaleTabsField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { ALL_CATEGORIES, categoryLabel } from "@/lib/categories";

const ICONS = ["camera", "video", "pen-tool", "printer", "target", "award"] as const;

type LocalizedText = { es?: string; en?: string; fr?: string };
type LocalizedList = { es?: string[]; en?: string[]; fr?: string[] };

export default function ServiceForm({
  service,
  action,
}: {
  service?: Service;
  action: (formData: FormData) => void;
}) {
  const title = (service?.title as LocalizedText) ?? {};
  const description = (service?.description as LocalizedText) ?? {};
  const ctaText = (service?.ctaText as LocalizedText) ?? {};
  const details = (service?.details as LocalizedList) ?? {};

  const detailsToText = (list?: string[]) => (list ?? []).join("\n");

  return (
    <form action={action} className="max-w-2xl">
      <LocaleTabsField label="Título" name="title" defaultValues={title} required />
      <LocaleTabsField
        label="Descripción corta"
        name="description"
        defaultValues={description}
        multiline
      />
      <LocaleTabsField
        label="Detalles (una viñeta por línea)"
        name="details"
        defaultValues={{
          es: detailsToText(details.es),
          en: detailsToText(details.en),
          fr: detailsToText(details.fr),
        }}
        multiline
      />
      <LocaleTabsField
        label="Texto del botón (CTA)"
        name="ctaText"
        defaultValues={ctaText}
      />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Categoría</label>
        <select
          name="category"
          defaultValue={service?.category ?? ALL_CATEGORIES[0]}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        >
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabel(cat, "es")}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Icono</label>
        <select
          name="icon"
          defaultValue={service?.icon ?? ICONS[0]}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        >
          {ICONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </div>

      <ImageUploadField name="image" label="Imagen" defaultValue={service?.image} />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Orden</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={service?.sortOrder ?? 0}
          className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <label className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          name="published"
          defaultChecked={service?.published ?? true}
        />
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
