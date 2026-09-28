"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  await db.aboutStat.create({ data: parseForm(formData) });
  revalidatePath("/admin/about-stats");
  revalidatePath("/[locale]", "page");
  redirect("/admin/about-stats");
}

export async function updateAboutStat(id: number, formData: FormData) {
  await requireSession();
  await db.aboutStat.update({ where: { id }, data: parseForm(formData) });
  revalidatePath("/admin/about-stats");
  revalidatePath("/[locale]", "page");
  redirect("/admin/about-stats");
}

export async function deleteAboutStat(id: number) {
  await requireSession();
  await db.aboutStat.delete({ where: { id } });
  revalidatePath("/admin/about-stats");
  revalidatePath("/[locale]", "page");
}
