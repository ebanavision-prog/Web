"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordResetAction } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-2 text-xl font-semibold text-white">Recuperar contraseña</h1>

        {state?.sent ? (
          <p className="mb-6 text-sm text-zinc-300">
            Si ese email tiene una cuenta de administrador, te hemos enviado un enlace para
            restablecer la contraseña. Revisa tu bandeja de entrada.
          </p>
        ) : (
          <>
            <p className="mb-6 text-sm text-zinc-400">
              Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
            </p>
            <form action={formAction}>
              <label className="mb-1 block text-sm text-zinc-400" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-red-600"
              />

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-red-600 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>
          </>
        )}

        <Link href="/admin/login" className="mt-6 block text-center text-sm text-zinc-400 hover:text-white">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
