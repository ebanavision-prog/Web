import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { getBlogPosts } from "@/lib/content";
import { pickText } from "@/lib/localized";
import type { AppLocale } from "@/i18n/routing";

export default async function Blog() {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as AppLocale;
  const posts = await getBlogPosts();

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 heading text-3xl text-zinc-900 md:text-4xl dark:text-white">
            {t("heading")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">{t("subheading")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="group overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800"
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
                {post.category && (
                  <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wide text-brand-red">
                    {post.category}
                  </span>
                )}
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  {pickText(post.title, locale)}
                </h3>
                <p className="line-clamp-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {pickText(post.excerpt, locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/blog`}
            className="inline-block rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 hover:border-brand-red hover:text-brand-red dark:border-zinc-700 dark:text-zinc-300"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
