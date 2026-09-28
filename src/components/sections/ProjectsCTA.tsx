"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { submitLead } from "@/app/[locale]/lead-actions";

export default function ProjectsCTA({ freeResourceUrl }: { freeResourceUrl: string | null }) {
  const t = useTranslations("leadMagnet");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!freeResourceUrl) return null;

  if (submitted) {
    return (
      <div className="rounded-[2.5rem] bg-zinc-900 p-10 text-center text-white">
        <h3 className="mb-4 heading text-2xl">{t("title")}</h3>
        <a
          href={freeResourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-brand-red px-6 py-3 font-medium"
        >
          {t("cta")}
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-[2.5rem] bg-zinc-900 p-10 text-white">
      <h3 className="mb-2 heading text-2xl">{t("title")}</h3>
      <p className="mb-6 text-zinc-400">{t("description")}</p>
      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await submitLead("LEAD_MAGNET", formData);
            if (result.success) setSubmitted(true);
          });
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          name="contact"
          required
          placeholder="Email"
          className="flex-1 rounded-full border border-zinc-700 bg-zinc-800 px-5 py-3 text-white outline-none focus:border-brand-red"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-brand-red px-6 py-3 font-medium disabled:opacity-60"
        >
          {t("formCta")}
        </button>
      </form>
    </div>
  );
}
