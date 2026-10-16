"use server";

import { revalidatePath } from "next/cache";
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
  try {
    await db.testimonial.create({ data: parseTestimonialForm(formData) });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error al guardar" };
  }
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function updateTestimonial(id: number, formData: FormData) {
  await requireSession();
  try {
    await db.testimonial.update({ where: { id }, data: parseTestimonialForm(formData) });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error al guardar" };
  }
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: number) {
  await requireSession();
  await db.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
}
