import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { routing, type AppLocale } from "@/i18n/routing";
import { getProjects } from "@/lib/content";
import { pickText } from "@/lib/localized";
import { categoryLabel } from "@/lib/categories";
import { normalizeVideoEmbedUrl } from "@/lib/video";
import Navbar from "@/components/layout/Navbar";
import Contact from "@/components/sections/Contact";
import ProjectGallery from "@/components/sections/ProjectGallery";
import RelatedProjectsCarousel from "@/components/sections/RelatedProjectsCarousel";
import VideoFacade from "@/components/ui/VideoFacade";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import BackToTop from "@/components/layout/BackToTop";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ebanavision.com";

// Content comes from the database and is edited live from /admin — force
// dynamic rendering so those edits show immediately, same reasoning as
// src/app/[locale]/layout.tsx.
export const dynamic = "force-dynamic";

async function findProject(slug: string) {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const appLocale = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as AppLocale;
  const project = await findProject(slug);

  if (!project) {
    return { title: "Ebana Visión" };
  }

  const title = `${pickText(project.title, appLocale)} | Ebana Visión`;
  const description = pickText(project.description, appLocale);
  const url = `${SITE_URL}/${appLocale}/proyectos/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es/proyectos/${slug}`,
        en: `${SITE_URL}/en/proyectos/${slug}`,
        fr: `${SITE_URL}/fr/proyectos/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      images: project.image ? [project.image] : undefined,
      siteName: "Ebana Visión",
      locale: appLocale,
      type: "website",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;

  const project = await findProject(slug);
  if (!project) {
    notFound();
  }

  const t = await getTranslations("projectPage");
  const allProjects = await getProjects();
  const related = allProjects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 8);

  const title = pickText(project.title, appLocale);
  const description = pickText(project.description, appLocale);
  const embedUrl = normalizeVideoEmbedUrl(project.videoUrlRaw);
  const gallery = Array.isArray(project.gallery) ? (project.gallery as string[]) : [];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-zinc-950">
          {embedUrl ? (
            <VideoFacade
              embedUrl={embedUrl}
              thumbnailUrl={project.image}
              title={title}
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : project.image ? (
            <Image
              src={project.image}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
          )}
          {!embedUrl && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          )}
          <div className="pointer-events-none relative mx-auto w-full max-w-6xl px-4 pb-16 pt-36">
            <Link
              href={`/${appLocale}#portafolio`}
              className="pointer-events-auto mb-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToPortfolio")}
            </Link>
            <p className="mb-2 text-xs uppercase tracking-wide text-brand-red">
              {categoryLabel(project.category, appLocale)}
            </p>
            <h1 className="heading max-w-3xl text-4xl leading-tight text-white md:text-6xl">
              {title}
            </h1>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-zinc-950">
          <div className="mx-auto max-w-3xl px-4">
            {project.client && (
              <p className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
                {project.client}
              </p>
            )}
            {description && (
              <p className="whitespace-pre-line text-lg text-zinc-600 dark:text-zinc-300">
                {description}
              </p>
            )}
            <a
              href="#contacto"
              className="mt-8 inline-block rounded-full bg-brand-red px-6 py-3 font-medium text-white"
            >
              {t("heroCta")}
            </a>
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
            <div className="mx-auto max-w-5xl px-4">
              <h2 className="mb-8 heading text-2xl text-zinc-900 md:text-3xl dark:text-white">
                {t("galleryHeading")}
              </h2>
              <ProjectGallery images={gallery} alt={title} />
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="bg-white py-16 dark:bg-zinc-950">
            <div className="mx-auto max-w-6xl px-4">
              <h2 className="mb-8 heading text-2xl text-zinc-900 md:text-3xl dark:text-white">
                {t("moreWorkHeading")}
              </h2>
              <RelatedProjectsCarousel projects={related} locale={appLocale} />
            </div>
          </section>
        )}

        <section id="contacto" className="bg-zinc-50 py-20 dark:bg-zinc-900">
          <div className="mx-auto max-w-3xl px-4">
            <Contact defaultService={title} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
      <BackToTop />
    </>
  );
}
