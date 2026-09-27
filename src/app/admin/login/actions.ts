"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/auth";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Introduce tu email y contraseña" };
  }

  const result = await login(email, password);
  if (!result.success) {
    return { error: result.error ?? "Credenciales inválidas" };
  }

  redirect("/admin");
}
