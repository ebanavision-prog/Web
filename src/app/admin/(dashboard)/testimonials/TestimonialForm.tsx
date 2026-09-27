"use client";

import type { Testimonial } from "@prisma/client";
import LocaleTabsField from "@/components/admin/LocaleTabsField";
import ImageUploadField from "@/components/admin/ImageUploadField";

type LocalizedText = { es?: string; en?: string; fr?: string };

export default function TestimonialForm({
  testimonial,
  action,
}: {
  testimonial?: Testimonial;
  action: (formData: FormData) => void;
}) {
  const role = (testimonial?.role as LocalizedText) ?? {};
  const quote = (testimonial?.quote as LocalizedText) ?? {};

  return (
    <form action={action} className="max-w-2xl">
      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Nombre</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={testimonial?.name ?? ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <LocaleTabsField label="Cargo" name="role" defaultValues={role} />
      <LocaleTabsField label="Testimonio" name="quote" defaultValues={quote} multiline />

      <ImageUploadField name="image" label="Foto" defaultValue={testimonial?.image} />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Orden</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={testimonial?.sortOrder ?? 0}
          className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <label className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          name="published"
          defaultChecked={testimonial?.published ?? true}
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
