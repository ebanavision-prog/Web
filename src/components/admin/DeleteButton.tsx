"use client";

import { useState, useTransition } from "react";

export default function DeleteButton({ action }: { action: () => Promise<void> | void }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          disabled={isPending}
          onClick={() => startTransition(async () => { await action(); })}
          className="font-medium text-red-500 hover:text-red-400"
        >
          Confirmar
        </button>
        <button onClick={() => setConfirming(false)} className="text-zinc-500 hover:text-zinc-300">
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-red-500 hover:text-red-400">
      Eliminar
    </button>
  );
}
