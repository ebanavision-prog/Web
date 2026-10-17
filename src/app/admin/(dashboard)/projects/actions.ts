"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { localizedField, slugify } from "@/lib/form-utils";
import type { Category } from "@prisma/client";

function parseGallery(formData: FormData): string[] {
  const raw = String(formData.get("gallery") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((url) => typeof url === "string") : [];
  } catch {
    return [];
  }
}

function parseProjectForm(formData: FormData) {
  return {
    title: localizedField(formData, "title"),
    description: localizedField(formData, "description"),
    client: String(formData.get("client") ?? "") || null,
    category: String(formData.get("category")) as Category,
    videoUrlRaw: String(formData.get("videoUrlRaw") ?? "") || null,
    image: String(formData.get("image") ?? ""),
    gallery: parseGallery(formData),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: formData.get("published") === "on",
  };
}

export async function createProject(formData: FormData) {
  await requireSession();
  const data = parseProjectForm(formData);
  const baseSlug = slugify(data.title.es || "proyecto");
  let slug = baseSlug;
  let suffix = 1;
  while (await db.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  try {
    await db.project.create({ data: { ...data, slug } });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error al guardar" };
  }
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProject(id: number, formData: FormData) {
  await requireSession();
  const data = parseProjectForm(formData);
  try {
    await db.project.update({ where: { id }, data });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error al guardar" };
  }
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: number) {
  await requireSession();
  await db.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
}
