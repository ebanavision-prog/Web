"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@prisma/client";
import { Play } from "lucide-react";
import { categoryLabel, CASE_STUDY_CATEGORIES } from "@/lib/categories";
import { pickText } from "@/lib/localized";
import type { AppLocale } from "@/i18n/routing";
import ProjectsCTA from "./ProjectsCTA";

const PAGE_SIZE = 6;

// Default ("Todos") view round-robins across categories instead of DB
// insertion order, so the first page represents every business unit
// instead of being dominated by whichever category has the most rows.
function interleaveByCategory(items: Project[]): Project[] {
  const buckets = new Map<string, Project[]>();
  for (const item of items) {
    const bucket = buckets.get(item.category);
    if (bucket) bucket.push(item);
    else buckets.set(item.category, [item]);
  }
  const bucketList = Array.from(buckets.values());
  const result: Project[] = [];
  for (let i = 0; result.length < items.length; i++) {
    for (const bucket of bucketList) {
      if (i < bucket.length) result.push(bucket[i]);
    }
  }
  return result;
}

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

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [projects]
  );

  const filtered =
    activeCategory === "all"
      ? interleaveByCategory(projects)
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
          {visible.map((project) => {
            const isCaseStudy = CASE_STUDY_CATEGORIES.has(project.category);
            const hasVideo = Boolean(project.videoUrlRaw);
            const href = `/${locale}/proyectos/${project.slug}`;

            if (isCaseStudy) {
              return (
                <Link
                  key={project.id}
                  href={href}
                  className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-red to-zinc-950 p-6 text-left"
                >
                  <p className="text-xs uppercase tracking-wide text-white/70">
                    {categoryLabel(project.category, locale)}
                  </p>
                  <div>
                    <h3 className="heading mb-2 text-lg text-white">
                      {pickText(project.title, locale)}
                    </h3>
                    <p className="line-clamp-4 text-sm text-white/80">
                      {pickText(project.description, locale)}
                    </p>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={project.id}
                href={href}
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
                {hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 transition group-hover:scale-110">
                      <Play className="ml-1 h-6 w-6 fill-black text-black" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-6">
                  <p className="text-xs uppercase tracking-wide text-brand-red">
                    {categoryLabel(project.category, locale)}
                  </p>
                  <h3 className="heading text-lg text-white">
                    {pickText(project.title, locale)}
                  </h3>
                </div>
              </Link>
            );
          })}
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
    </section>
  );
}
