"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ActionResult = { success: boolean; error?: string };

// Server Actions that call redirect() after a mutation trigger Next's
// redirect-replay self-fetch (the server fetching its own new page over an
// internal HTTP request) to update the client router cache. That internal
// self-fetch is unreliable on this Passenger host — the same root cause as
// the admin login POST flakiness — so a "Guardar" click looks frozen with
// no confirmation. Avoiding redirect() server-side and navigating from the
// client instead (a normal browser-initiated request, not a server
// self-fetch) sidesteps it entirely.
export default function AdminForm({
  action,
  redirectTo,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  redirectTo: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(result.error ?? "No se pudo guardar. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}

      {error && (
        <p className="mb-4 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-60"
      >
        {isPending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
