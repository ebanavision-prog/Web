"use server";

import { redirect } from "next/navigation";
import { resetPasswordWithToken } from "@/lib/auth";

export async function resetPasswordAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: "Enlace inválido." };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres" };
  }

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden" };
  }

  const result = await resetPasswordWithToken(token, password);
  if (!result.success) {
    return { error: result.error ?? "No se pudo restablecer la contraseña" };
  }

  redirect("/admin/login?reset=success");
}
