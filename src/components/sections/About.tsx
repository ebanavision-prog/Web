import { getTranslations, getLocale } from "next-intl/server";
import { getAboutStats } from "@/lib/content";
import { pickText } from "@/lib/localized";
import type { AppLocale } from "@/i18n/routing";

export default async function About() {
  const t = await getTranslations("about");
  const locale = (await getLocale()) as AppLocale;
  const stats = await getAboutStats();

  return (
    <section id="nosotros" className="bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 heading text-3xl text-zinc-900 md:text-4xl dark:text-white">
          {t("heading")}
        </h2>
        <p className="mb-12 text-xl text-zinc-600 dark:text-zinc-400">{t("quote")}</p>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id}>
                <p className="heading text-3xl text-brand-red md:text-4xl">{stat.value}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {pickText(stat.label, locale)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
