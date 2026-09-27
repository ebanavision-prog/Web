"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="mb-6 text-xl font-semibold text-white">Panel de administración</h1>

        <label className="mb-1 block text-sm text-zinc-400" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-red-600"
        />

        <label className="mb-1 block text-sm text-zinc-400" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
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
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
