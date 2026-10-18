"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@prisma/client";
import { FileText } from "lucide-react";
import { pickText } from "@/lib/localized";
import type { AppLocale } from "@/i18n/routing";

const PAGE_SIZE = 9;

function formatDate(date: Date | null, locale: AppLocale) {
  if (!date) return null;
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("blog");
  const locale = useLocale() as AppLocale;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))),
    [posts]
  );

  const filtered =
    activeCategory === "all" ? posts : posts.filter((p) => p.category === activeCategory);
  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      {categories.length > 0 && (
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
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <Link
            key={post.id}
            href={`/${locale}/blog/${post.slug}`}
            className="group overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-zinc-800"
          >
            <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-900">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={pickText(post.title, locale)}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
              )}
              {post.fileUrl && (
                <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow">
                  <FileText className="h-4 w-4 text-brand-red" />
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-brand-red">
                {post.category && <span>{post.category}</span>}
                {post.category && post.publishedAt && <span className="text-zinc-300">·</span>}
                {post.publishedAt && (
                  <span className="text-zinc-400">{formatDate(post.publishedAt, locale)}</span>
                )}
              </div>
              <h3 className="mb-2 heading text-lg text-zinc-900 dark:text-white">
                {pickText(post.title, locale)}
              </h3>
              <p className="line-clamp-3 text-sm text-zinc-500 dark:text-zinc-400">
                {pickText(post.excerpt, locale)}
              </p>
            </div>
          </Link>
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
    </>
  );
}
