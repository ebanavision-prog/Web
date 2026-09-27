"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { localizedField } from "@/lib/form-utils";

function parseTestimonialForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    role: localizedField(formData, "role"),
    quote: localizedField(formData, "quote"),
    image: String(formData.get("image") ?? "") || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: formData.get("published") === "on",
  };
}

export async function createTestimonial(formData: FormData) {
  await requireSession();
  await db.testimonial.create({ data: parseTestimonialForm(formData) });
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: number, formData: FormData) {
  await requireSession();
  await db.testimonial.update({ where: { id }, data: parseTestimonialForm(formData) });
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: number) {
  await requireSession();
  await db.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
}
