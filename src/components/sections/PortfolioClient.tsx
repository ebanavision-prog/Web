"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import type { Project } from "@prisma/client";
import { X } from "lucide-react";
import { categoryLabel } from "@/lib/categories";
import { pickText } from "@/lib/localized";
import { normalizeVideoEmbedUrl } from "@/lib/video";
import type { AppLocale } from "@/i18n/routing";
import VideoFacade from "@/components/ui/VideoFacade";
import ProjectsCTA from "./ProjectsCTA";

const PAGE_SIZE = 6;

export default function PortfolioClient({
  projects,
  freeResourceUrl,
}: {
  projects: Project[];
  freeResourceUrl: string | null;
}) {
  const t = useTranslations("portfolio");
  const locale = useLocale() as AppLocale;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Project | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [projects]
  );

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);

  return (
    <section id="portafolio" className="bg-zinc-50 py-24 dark:bg-zinc-900">
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
                : "bg-white text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {t("all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeCategory === cat
                  ? "bg-brand-red text-white"
                  : "bg-white text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {categoryLabel(cat, locale)}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelected(project)}
              className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] text-left"
            >
              {project.image ? (
                <Image
                  src={project.image}
                  alt={pickText(project.title, locale)}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-6">
                <p className="text-xs uppercase tracking-wide text-brand-red">
                  {categoryLabel(project.category, locale)}
                </p>
                <h3 className="heading text-lg text-white">
                  {pickText(project.title, locale)}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 hover:border-brand-red hover:text-brand-red dark:border-zinc-700 dark:text-zinc-300"
            >
              {t("loadMore")}
            </button>
          </div>
        )}

        <div className="mt-16">
          <ProjectsCTA freeResourceUrl={freeResourceUrl} />
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-black">
              {(() => {
                const embedUrl = normalizeVideoEmbedUrl(selected.videoUrlRaw);
                return embedUrl ? (
                  <VideoFacade
                    embedUrl={embedUrl}
                    thumbnailUrl={selected.image}
                    title={pickText(selected.title, locale)}
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : selected.image ? (
                  <Image
                    src={selected.image}
                    alt={pickText(selected.title, locale)}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
                );
              })()}
            </div>
            <div className="flex items-start justify-between p-6">
              <div>
                <h3 className="heading text-xl text-zinc-900 dark:text-white">
                  {pickText(selected.title, locale)}
                </h3>
                {selected.client && (
                  <p className="text-sm text-zinc-500">{selected.client}</p>
                )}
              </div>
              <button onClick={() => setSelected(null)} aria-label="Cerrar">
                <X className="h-6 w-6 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
