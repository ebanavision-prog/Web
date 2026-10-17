"use client";

import type { Project } from "@prisma/client";
import LocaleTabsField from "@/components/admin/LocaleTabsField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import GalleryUploadField from "@/components/admin/GalleryUploadField";
import AdminForm from "@/components/admin/AdminForm";
import { ALL_CATEGORIES, categoryLabel } from "@/lib/categories";

type LocalizedText = { es?: string; en?: string; fr?: string };

export default function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}) {
  const title = (project?.title as LocalizedText) ?? {};
  const description = (project?.description as LocalizedText) ?? {};

  return (
    <AdminForm action={action} redirectTo="/admin/projects" className="max-w-2xl">
      <LocaleTabsField label="Título" name="title" defaultValues={title} required />
      <LocaleTabsField
        label="Descripción"
        name="description"
        defaultValues={description}
        multiline
      />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Cliente</label>
        <input
          type="text"
          name="client"
          defaultValue={project?.client ?? ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Categoría</label>
        <select
          name="category"
          defaultValue={project?.category ?? ALL_CATEGORIES[0]}
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
        <label className="mb-1 block text-sm text-zinc-400">
          Video (YouTube o Vimeo, pega el link tal cual)
        </label>
        <input
          type="text"
          name="videoUrlRaw"
          defaultValue={project?.videoUrlRaw ?? ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <ImageUploadField name="image" label="Imagen de portada" defaultValue={project?.image} />

      <GalleryUploadField
        name="gallery"
        label="Galería (más fotos de este proyecto, para la página de detalle)"
        defaultValue={project?.gallery}
      />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Orden</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={project?.sortOrder ?? 0}
          className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <label className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? true}
        />
        Publicado
      </label>
    </AdminForm>
  );
}
