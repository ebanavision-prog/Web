import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
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
        <h2 className="mb-12 text-center font-serif text-3xl font-bold italic text-zinc-900 md:text-4xl dark:text-white">
          {t("heading")}
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800"
            >
              {post.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image}
                    alt={pickText(post.title, locale)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                {post.category && (
                  <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wide text-brand-red">
                    {post.category}
                  </span>
                )}
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  {pickText(post.title, locale)}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {pickText(post.excerpt, locale)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
