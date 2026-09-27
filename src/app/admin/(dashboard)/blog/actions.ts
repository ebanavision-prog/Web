"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { localizedField, slugify } from "@/lib/form-utils";

function parseBlogForm(formData: FormData) {
  const publishedAtRaw = String(formData.get("publishedAt") ?? "");
  return {
    title: localizedField(formData, "title"),
    excerpt: localizedField(formData, "excerpt"),
    content: localizedField(formData, "content"),
    category: String(formData.get("category") ?? "") || null,
    image: String(formData.get("image") ?? "") || null,
    publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : null,
    published: formData.get("published") === "on",
  };
}

export async function createBlogPost(formData: FormData) {
  await requireSession();
  const data = parseBlogForm(formData);
  const baseSlug = slugify(data.title.es || "post");
  let slug = baseSlug;
  let suffix = 1;
  while (await db.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  await db.blogPost.create({ data: { ...data, slug } });
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: number, formData: FormData) {
  await requireSession();
  const data = parseBlogForm(formData);
  await db.blogPost.update({ where: { id }, data });
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: number) {
  await requireSession();
  await db.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
}
