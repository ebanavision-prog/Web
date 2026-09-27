"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function toggleSection(id: number, enabled: boolean) {
  await requireSession();
  await db.section.update({ where: { id }, data: { enabled } });
  revalidatePath("/admin/sections");
  revalidatePath("/[locale]", "page");
}

export async function reorderSections(orderedIds: number[]) {
  await requireSession();
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.section.update({ where: { id }, data: { sortOrder: index } })
    )
  );
  revalidatePath("/admin/sections");
  revalidatePath("/[locale]", "page");
}
