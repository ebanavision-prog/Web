import { getTranslations, getLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/content";
import { pickText } from "@/lib/localized";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import VideoFacade from "@/components/ui/VideoFacade";

export default async function Hero() {
  const t = await getTranslations("hero");
  const locale = (await getLocale()) as AppLocale;
  const settings = await getSiteSettings();

  const title1 = pickText(settings?.heroTitle1, locale) || "Capturamos";
  const title2 = pickText(settings?.heroTitle2, locale) || "lo que otros";
  const title3 = pickText(settings?.heroTitle3, locale) || "no ven.";
  const description = pickText(settings?.heroDescription, locale);
  const youtubeId = settings?.heroVideoYoutubeId;

  return (
    <section id="inicio" className="bg-white pb-16 pt-32 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <h1 className="mb-6 font-serif text-4xl font-bold italic leading-tight text-zinc-900 md:text-6xl dark:text-white">
            {title1}
            <br />
            <span className="text-brand-red">{title2}</span>
            <br />
            {title3}
          </h1>
          {description && (
            <p className="mb-8 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/#servicios"
              className="rounded-full bg-brand-red px-6 py-3 font-medium text-white"
            >
              {t("ctaServices")}
            </Link>
            <Link
              href="/#portafolio"
              className="rounded-full border border-zinc-300 px-6 py-3 font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {t("ctaPortfolio")}
            </Link>
          </div>
        </div>

        {youtubeId && (
          <div className="relative hidden aspect-video overflow-hidden rounded-[3rem] lg:block">
            <VideoFacade
              embedUrl={`https://www.youtube.com/embed/${youtubeId}`}
              title="Ebana Visión"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        )}
      </div>
    </section>
  );
}
