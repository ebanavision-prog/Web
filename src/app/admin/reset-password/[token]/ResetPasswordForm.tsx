"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "./actions";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/login?reset=success");
    }
  }, [state?.success, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />

      <label className="mb-1 block text-sm text-zinc-400" htmlFor="password">
        Nueva contraseña
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-red-600"
      />

      <label className="mb-1 block text-sm text-zinc-400" htmlFor="confirmPassword">
        Confirmar contraseña
      </label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-red-600"
      />

      {state?.error && (
        <p className="mb-4 text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-red-600 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {isPending ? "Guardando..." : "Guardar nueva contraseña"}
      </button>
    </form>
  );
}
