import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getBlogPosts } from "@/lib/content";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import BackToTop from "@/components/layout/BackToTop";
import BlogIndexClient from "@/components/sections/BlogIndexClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ebanavision.com";

// Content comes from the database and is edited live from /admin — force
// dynamic rendering so those edits show immediately, same reasoning as
// src/app/[locale]/layout.tsx.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const url = `${SITE_URL}/${locale}/blog`;

  return {
    title: `${t("heading")} | Ebana Visión`,
    description: t("subheading"),
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es/blog`,
        en: `${SITE_URL}/en/blog`,
        fr: `${SITE_URL}/fr/blog`,
      },
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const posts = await getBlogPosts();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32">
        <section className="bg-white py-16 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h1 className="mb-2 heading text-3xl text-zinc-900 md:text-4xl dark:text-white">
                {t("heading")}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">{t("subheading")}</p>
            </div>

            <BlogIndexClient posts={posts} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
      <BackToTop />
    </>
  );
}
