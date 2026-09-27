"use client";

import type { BlogPost } from "@prisma/client";
import LocaleTabsField from "@/components/admin/LocaleTabsField";
import ImageUploadField from "@/components/admin/ImageUploadField";

type LocalizedText = { es?: string; en?: string; fr?: string };

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export default function BlogForm({
  post,
  action,
}: {
  post?: BlogPost;
  action: (formData: FormData) => void;
}) {
  const title = (post?.title as LocalizedText) ?? {};
  const excerpt = (post?.excerpt as LocalizedText) ?? {};
  const content = (post?.content as LocalizedText) ?? {};

  return (
    <form action={action} className="max-w-2xl">
      <LocaleTabsField label="Título" name="title" defaultValues={title} required />
      <LocaleTabsField label="Extracto" name="excerpt" defaultValues={excerpt} multiline />
      <LocaleTabsField
        label="Contenido"
        name="content"
        defaultValues={content}
        multiline
        hint="Puedes usar HTML simple (párrafos, negritas, enlaces)"
      />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Categoría</label>
        <input
          type="text"
          name="category"
          defaultValue={post?.category ?? ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <ImageUploadField name="image" label="Imagen destacada" defaultValue={post?.image} />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Fecha de publicación</label>
        <input
          type="date"
          name="publishedAt"
          defaultValue={toDateInputValue(post?.publishedAt)}
          className="w-48 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <label className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? true} />
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
