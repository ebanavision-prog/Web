"use server";

import { createPasswordResetToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/password-reset-email";

export async function requestPasswordResetAction(
  _prevState: { sent?: boolean } | undefined,
  formData: FormData
): Promise<{ sent: boolean }> {
  const email = String(formData.get("email") ?? "").trim();

  if (email) {
    const token = await createPasswordResetToken(email);
    if (token) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ebanavision.com";
      const resetLink = `${siteUrl}/admin/reset-password/${token}`;
      await sendPasswordResetEmail(email, resetLink);
    }
  }

  // Always report success — never reveal whether the address matched an account.
  return { sent: true };
}
