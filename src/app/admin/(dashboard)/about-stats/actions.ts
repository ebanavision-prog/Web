"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { localizedField } from "@/lib/form-utils";

function parseForm(formData: FormData) {
  return {
    value: String(formData.get("value") ?? ""),
    label: localizedField(formData, "label"),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: formData.get("published") === "on",
  };
}

export async function createAboutStat(formData: FormData) {
  await requireSession();
  try {
    await db.aboutStat.create({ data: parseForm(formData) });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error al guardar" };
  }
  revalidatePath("/admin/about-stats");
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function updateAboutStat(id: number, formData: FormData) {
  await requireSession();
  try {
    await db.aboutStat.update({ where: { id }, data: parseForm(formData) });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error al guardar" };
  }
  revalidatePath("/admin/about-stats");
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function deleteAboutStat(id: number) {
  await requireSession();
  await db.aboutStat.delete({ where: { id } });
  revalidatePath("/admin/about-stats");
  revalidatePath("/[locale]", "page");
}
