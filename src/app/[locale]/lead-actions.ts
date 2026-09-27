"use server";

import { createLead } from "@/lib/leads";
import type { LeadType } from "@prisma/client";

export async function submitLead(
  type: LeadType,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const contact = String(formData.get("contact") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim() || undefined;
  const message = String(formData.get("message") ?? "").trim() || undefined;
  const service = String(formData.get("service") ?? "").trim() || undefined;

  if (!contact) {
    return { success: false, error: "missing_contact" };
  }

  const result = await createLead(type, { name, contact, message, service });
  return { success: result.success };
}
