"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@prisma/client";
import { pickText } from "@/lib/localized";
import { categoryLabel } from "@/lib/categories";
import type { AppLocale } from "@/i18n/routing";

export default function RelatedProjectsCarousel({
  projects,
  locale,
}: {
  projects: Project[];
  locale: AppLocale;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/${locale}/proyectos/${project.slug}`}
            className="group relative aspect-[4/5] w-56 shrink-0 snap-start overflow-hidden rounded-[2rem] sm:w-64"
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={pickText(project.title, locale)}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="256px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
            )}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-5">
              <p className="text-xs uppercase tracking-wide text-brand-red">
                {categoryLabel(project.category, locale)}
              </p>
              <h3 className="heading text-base text-white">{pickText(project.title, locale)}</h3>
            </div>
          </Link>
        ))}
      </div>

      {projects.length > 2 && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => scrollBy(-280)}
            aria-label="Anterior"
            className="rounded-full border border-zinc-300 p-2 text-zinc-600 hover:border-brand-red hover:text-brand-red dark:border-zinc-700 dark:text-zinc-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollBy(280)}
            aria-label="Siguiente"
            className="rounded-full border border-zinc-300 p-2 text-zinc-600 hover:border-brand-red hover:text-brand-red dark:border-zinc-700 dark:text-zinc-300"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
