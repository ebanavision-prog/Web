"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { LeadStatus } from "@prisma/client";

export async function updateLeadStatus(id: number, status: LeadStatus) {
  await db.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

export async function deleteLead(id: number) {
  await db.lead.delete({ where: { id } });
  revalidatePath("/admin");
}
