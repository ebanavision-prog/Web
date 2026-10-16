"use client";

import type { Brand } from "@prisma/client";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AdminForm from "@/components/admin/AdminForm";

export default function BrandForm({
  brand,
  action,
}: {
  brand?: Brand;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}) {
  return (
    <AdminForm action={action} redirectTo="/admin/brands" className="max-w-2xl">
      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Nombre</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={brand?.name ?? ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <ImageUploadField name="logoUrl" label="Logo" defaultValue={brand?.logoUrl} />

      <div className="mb-5">
        <label className="mb-1 block text-sm text-zinc-400">Orden</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={brand?.sortOrder ?? 0}
          className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
        />
      </div>

      <label className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <input type="checkbox" name="published" defaultChecked={brand?.published ?? true} />
        Publicado
      </label>
    </AdminForm>
  );
}
