"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

function parseBrandForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    logoUrl: String(formData.get("logoUrl") ?? ""),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: formData.get("published") === "on",
  };
}

export async function createBrand(formData: FormData) {
  await requireSession();
  try {
    await db.brand.create({ data: parseBrandForm(formData) });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error al guardar" };
  }
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function updateBrand(id: number, formData: FormData) {
  await requireSession();
  try {
    await db.brand.update({ where: { id }, data: parseBrandForm(formData) });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error al guardar" };
  }
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function deleteBrand(id: number) {
  await requireSession();
  await db.brand.delete({ where: { id } });
  revalidatePath("/admin/brands");
}
