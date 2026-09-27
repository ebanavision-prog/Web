import "server-only";
import { db } from "./db";
import { getSiteSettings } from "./content";
import type { LeadType } from "@prisma/client";

type LeadInput = {
  name?: string;
  contact: string;
  message?: string;
  service?: string;
};

async function sendLeadEmail(type: LeadType, data: LeadInput) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("[leads] EmailJS not configured, skipping email notification");
    return false;
  }

  const settings = await getSiteSettings();
  const recipientEmail = settings?.contactEmail || "ebanavision@gmail.com";

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          from_name: data.name ?? "",
          from_contact: data.contact,
          lead_type: type,
          service: data.service ?? "",
          message: data.message ?? "",
          to_email: recipientEmail,
          reply_to: data.contact,
        },
      }),
    });
    return response.ok;
  } catch (err) {
    console.error("[leads] EmailJS error:", err);
    return false;
  }
}

export async function createLead(type: LeadType, data: LeadInput) {
  let dbSuccess = false;
  try {
    await db.lead.create({
      data: {
        type,
        name: data.name,
        contact: data.contact,
        message: data.message,
        service: data.service,
      },
    });
    dbSuccess = true;
  } catch (err) {
    console.error("[leads] Failed to persist lead:", err);
  }

  const emailSuccess = await sendLeadEmail(type, data);

  return { success: dbSuccess || emailSuccess, dbSuccess, emailSuccess };
}
