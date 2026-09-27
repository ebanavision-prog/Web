"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { es: "ES", en: "EN", fr: "FR" };

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-1 text-sm">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          className={`rounded px-2 py-1 font-medium ${
            l === locale
              ? "text-brand-red"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
