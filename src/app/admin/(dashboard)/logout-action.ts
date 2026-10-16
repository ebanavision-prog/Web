"use server";

import { logout } from "@/lib/auth";

// Deliberately does not redirect() server-side — see login/actions.ts for why.
export async function logoutAction() {
  await logout();
}
