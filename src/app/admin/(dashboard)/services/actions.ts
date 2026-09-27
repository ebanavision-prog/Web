"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { localizedField, localizedListField, slugify } from "@/lib/form-utils";
import type { Category } from "@prisma/client";

function parseServiceForm(formData: FormData) {
  return {
    title: localizedField(formData, "title"),
    description: localizedField(formData, "description"),
    ctaText: localizedField(formData, "ctaText"),
    details: localizedListField(formData, "details"),
    category: String(formData.get("category")) as Category,
    icon: String(formData.get("icon")),
    image: String(formData.get("image") ?? ""),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: formData.get("published") === "on",
  };
}

export async function createService(formData: FormData) {
  await requireSession();
  const data = parseServiceForm(formData);
  const baseSlug = slugify(data.title.es || "servicio");
  let slug = baseSlug;
  let suffix = 1;
  while (await db.service.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  await db.service.create({ data: { ...data, slug } });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(id: number, formData: FormData) {
  await requireSession();
  const data = parseServiceForm(formData);
  await db.service.update({ where: { id }, data });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(id: number) {
  await requireSession();
  await db.service.delete({ where: { id } });
  revalidatePath("/admin/services");
}
