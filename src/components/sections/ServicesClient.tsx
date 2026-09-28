"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import type { Service } from "@prisma/client";
import { X } from "lucide-react";
import { ALL_CATEGORIES, categoryLabel } from "@/lib/categories";
import { getIcon } from "@/lib/icon-map";
import { pickText, pickList } from "@/lib/localized";
import type { AppLocale } from "@/i18n/routing";

export default function ServicesClient({ services }: { services: Service[] }) {
  const t = useTranslations("services");
  const locale = useLocale() as AppLocale;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selected, setSelected] = useState<Service | null>(null);

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section id="servicios" className="bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 heading text-3xl text-zinc-900 md:text-4xl dark:text-white">
            {t("heading")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">{t("subheading")}</p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              activeCategory === "all"
                ? "bg-brand-red text-white"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {t("all")}
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeCategory === cat
                  ? "bg-brand-red text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {categoryLabel(cat, locale)}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <button
                key={service.id}
                onClick={() => setSelected(service)}
                className="rounded-[2.5rem] border border-zinc-200 p-8 text-left transition hover:border-brand-red dark:border-zinc-800"
              >
                <Icon className="mb-4 h-8 w-8 text-brand-red" />
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  {pickText(service.title, locale)}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {pickText(service.description, locale)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-8 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="heading text-2xl text-zinc-900 dark:text-white">
                {pickText(selected.title, locale)}
              </h3>
              <button onClick={() => setSelected(null)} aria-label="Cerrar">
                <X className="h-6 w-6 text-zinc-400" />
              </button>
            </div>
            {selected.image && (
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl">
                <Image
                  src={selected.image}
                  alt={pickText(selected.title, locale)}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              {pickText(selected.description, locale)}
            </p>
            <ul className="mb-6 space-y-2">
              {pickList(selected.details, locale).map((detail) => (
                <li key={detail} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                  {detail}
                </li>
              ))}
            </ul>
            <a
              href="#contacto"
              onClick={() => setSelected(null)}
              className="inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-medium text-white"
            >
              {pickText(selected.ctaText, locale) || t("detailsCta")}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
