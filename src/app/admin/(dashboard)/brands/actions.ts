"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  await db.brand.create({ data: parseBrandForm(formData) });
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function updateBrand(id: number, formData: FormData) {
  await requireSession();
  await db.brand.update({ where: { id }, data: parseBrandForm(formData) });
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function deleteBrand(id: number) {
  await requireSession();
  await db.brand.delete({ where: { id } });
  revalidatePath("/admin/brands");
}
