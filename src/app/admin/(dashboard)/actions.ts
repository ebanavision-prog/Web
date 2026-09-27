"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import type { LeadStatus } from "@prisma/client";

export async function updateLeadStatus(id: number, status: LeadStatus) {
  await requireSession();
  await db.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

export async function deleteLead(id: number) {
  await requireSession();
  await db.lead.delete({ where: { id } });
  revalidatePath("/admin");
}
