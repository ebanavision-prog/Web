import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { pickText } from "@/lib/localized";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ebanavision.com";

const TITLES: Record<AppLocale, string> = {
  es: "Ebana Visión | Producción Audiovisual de Élite en Malabo",
  en: "Ebana Visión | Elite Audiovisual Production in Malabo",
  fr: "Ebana Visión | Production Audiovisuelle d'Élite à Malabo",
};

const FALLBACK_DESCRIPTIONS: Record<AppLocale, string> = {
  es: "Estudio creativo líder en Malabo. Fotografía profesional, video marketing, diseño gráfico e impresión de alta calidad.",
  en: "Leading creative studio in Malabo. Professional photography, video marketing, graphic design and high-quality printing.",
  fr: "Studio créatif de premier plan à Malabo. Photographie professionnelle, vidéo marketing, design graphique et impression.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as AppLocale;
  const settings = await getSiteSettings();

  const description =
    pickText(settings?.metaDescription, appLocale) || FALLBACK_DESCRIPTIONS[appLocale];
  const title = TITLES[appLocale];
  const url = `${SITE_URL}/${appLocale}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
        fr: `${SITE_URL}/fr`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ebana Visión",
      locale: appLocale,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const settings = await getSiteSettings();
  const fontPairing = settings?.fontPairing === "bold" ? "bold" : "editorial";
  const headingFontVar = fontPairing === "bold" ? "var(--font-poppins)" : "var(--font-playfair)";

  return (
    <NextIntlClientProvider>
      <div
        data-font-pairing={fontPairing}
        style={{ "--font-heading": headingFontVar } as React.CSSProperties}
        className="flex min-h-full flex-1 flex-col"
      >
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
