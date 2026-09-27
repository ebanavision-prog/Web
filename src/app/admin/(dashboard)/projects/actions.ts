"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { localizedField, slugify } from "@/lib/form-utils";
import type { Category } from "@prisma/client";

function parseProjectForm(formData: FormData) {
  return {
    title: localizedField(formData, "title"),
    description: localizedField(formData, "description"),
    client: String(formData.get("client") ?? "") || null,
    category: String(formData.get("category")) as Category,
    videoUrlRaw: String(formData.get("videoUrlRaw") ?? "") || null,
    image: String(formData.get("image") ?? ""),
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

  await db.project.create({ data: { ...data, slug } });
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: number, formData: FormData) {
  await requireSession();
  const data = parseProjectForm(formData);
  await db.project.update({ where: { id }, data });
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: number) {
  await requireSession();
  await db.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
}
