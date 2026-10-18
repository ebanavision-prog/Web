import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { routing, type AppLocale } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/content";
import { pickText } from "@/lib/localized";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import BackToTop from "@/components/layout/BackToTop";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ebanavision.com";

// Content comes from the database and is edited live from /admin — force
// dynamic rendering so those edits show immediately, same reasoning as
// src/app/[locale]/layout.tsx.
export const dynamic = "force-dynamic";

async function findPost(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

function formatDate(date: Date | null, locale: AppLocale) {
  if (!date) return null;
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const appLocale = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as AppLocale;
  const post = await findPost(slug);

  if (!post) {
    return { title: "Ebana Visión" };
  }

  const title = `${pickText(post.title, appLocale)} | Ebana Visión`;
  const description = pickText(post.excerpt, appLocale);
  const url = `${SITE_URL}/${appLocale}/blog/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es/blog/${slug}`,
        en: `${SITE_URL}/en/blog/${slug}`,
        fr: `${SITE_URL}/fr/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      images: post.image ? [post.image] : undefined,
      siteName: "Ebana Visión",
      locale: appLocale,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;

  const post = await findPost(slug);
  if (!post) {
    notFound();
  }

  const t = await getTranslations("blog");
  const title = pickText(post.title, appLocale);
  const content = pickText(post.content, appLocale);
  const date = formatDate(post.publishedAt, appLocale);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32">
        <article className="mx-auto max-w-3xl px-4 pb-20">
          <Link
            href={`/${appLocale}/blog`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-brand-red dark:text-zinc-400"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>

          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wide text-brand-red">
            {post.category && <span>{post.category}</span>}
            {post.category && date && <span className="text-zinc-300">·</span>}
            {date && <span className="text-zinc-400">{date}</span>}
          </div>

          <h1 className="heading mb-6 text-3xl text-zinc-900 md:text-5xl dark:text-white">
            {title}
          </h1>

          {post.image && (
            <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-[2rem]">
              <Image src={post.image} alt={title} fill className="object-cover" priority />
            </div>
          )}

          {post.fileUrl && (
            <a
              href={post.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-10 flex items-center gap-3 rounded-2xl border border-brand-red/30 bg-brand-red/5 px-5 py-4 font-medium text-brand-red hover:bg-brand-red/10"
            >
              <FileText className="h-5 w-5 shrink-0" />
              {t("downloadPdf")}
            </a>
          )}

          {content && (
            <div
              className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 [&_a]:text-brand-red [&_a]:underline [&_h2]:heading [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:text-zinc-900 [&_h2]:dark:text-white [&_h3]:heading [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:text-zinc-900 [&_h3]:dark:text-white [&_p]:mb-5 [&_strong]:font-semibold [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </article>
      </main>
      <Footer />
      <FloatingContact />
      <BackToTop />
    </>
  );
}
