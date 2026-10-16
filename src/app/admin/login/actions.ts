"use server";

import { login } from "@/lib/auth";

// Deliberately does not redirect() server-side — that triggers Next's
// redirect-replay self-fetch, which is unreliable on this Passenger host and
// leaves the login button looking frozen with no confirmation. The client
// navigates instead once this resolves successfully (see login/page.tsx).
export async function loginAction(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Introduce tu email y contraseña" };
  }

  const result = await login(email, password);
  if (!result.success) {
    return { error: result.error ?? "Credenciales inválidas" };
  }

  return { success: true };
}
