"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { localizedField } from "@/lib/form-utils";

export async function updateSettings(formData: FormData) {
  await requireSession();

  const data = {
    whatsappNumber: String(formData.get("whatsappNumber") ?? "") || null,
    alternativePhone: String(formData.get("alternativePhone") ?? "") || null,
    contactEmail: String(formData.get("contactEmail") ?? "") || null,
    address: String(formData.get("address") ?? "") || null,
    instagramUrl: String(formData.get("instagramUrl") ?? "") || null,
    facebookUrl: String(formData.get("facebookUrl") ?? "") || null,
    tiktokUrl: String(formData.get("tiktokUrl") ?? "") || null,
    youtubeUrl: String(formData.get("youtubeUrl") ?? "") || null,
    heroVideoYoutubeId: String(formData.get("heroVideoYoutubeId") ?? "") || null,
    logoUrl: String(formData.get("logoUrl") ?? "") || null,
    freeResourceUrl: String(formData.get("freeResourceUrl") ?? "") || null,
    fontPairing: String(formData.get("fontPairing") ?? "bold") === "editorial" ? "editorial" : "bold",
    metaDescription: localizedField(formData, "metaDescription"),
    heroTitle1: localizedField(formData, "heroTitle1"),
    heroTitle2: localizedField(formData, "heroTitle2"),
    heroTitle3: localizedField(formData, "heroTitle3"),
    heroDescription: localizedField(formData, "heroDescription"),
  };

  await db.siteSetting.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "page");
}
