"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { localizedField } from "@/lib/form-utils";

function parseForm(formData: FormData) {
  return {
    title: localizedField(formData, "title"),
    description: localizedField(formData, "description"),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: formData.get("published") === "on",
  };
}

export async function createProcessStep(formData: FormData) {
  await requireSession();
  await db.processStep.create({ data: parseForm(formData) });
  revalidatePath("/admin/process");
  revalidatePath("/[locale]", "page");
  redirect("/admin/process");
}

export async function updateProcessStep(id: number, formData: FormData) {
  await requireSession();
  await db.processStep.update({ where: { id }, data: parseForm(formData) });
  revalidatePath("/admin/process");
  revalidatePath("/[locale]", "page");
  redirect("/admin/process");
}

export async function deleteProcessStep(id: number) {
  await requireSession();
  await db.processStep.delete({ where: { id } });
  revalidatePath("/admin/process");
  revalidatePath("/[locale]", "page");
}
