"use client";

import { useState, useTransition } from "react";
import { MessageCircle, X } from "lucide-react";
import { submitLead } from "@/app/[locale]/lead-actions";

export default function FloatingContactClient({ whatsappNumber }: { whatsappNumber: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function openWhatsapp(message: string) {
    const digits = whatsappNumber.replace(/\D/g, "");
    window.open(
      `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {open && (
        <div className="mb-4 w-72 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-zinc-900 dark:text-white">¿Hablamos?</h4>
            <button onClick={() => setOpen(false)} aria-label="Cerrar">
              <X className="h-5 w-5 text-zinc-400" />
            </button>
          </div>
          <form
            action={(formData) => {
              const name = String(formData.get("name") ?? "");
              const message = String(formData.get("message") ?? "");
              startTransition(async () => {
                await submitLead("CONTACT", formData);
                openWhatsapp(
                  `Hola, soy ${name || "un visitante de la web"}. ${message}`.trim()
                );
                setOpen(false);
              });
            }}
            className="space-y-2"
          >
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
            <input
              type="text"
              name="contact"
              placeholder="Email o teléfono"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
            <textarea
              name="message"
              rows={2}
              placeholder="Mensaje"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              Continuar en WhatsApp
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Contactar por WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
}
