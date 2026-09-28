import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <section id="nosotros" className="bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 heading text-3xl text-zinc-900 md:text-4xl dark:text-white">
          {t("heading")}
        </h2>
        <p className="mb-12 text-xl text-zinc-600 dark:text-zinc-400">{t("quote")}</p>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="heading text-3xl text-brand-red md:text-4xl">
                {stat.value}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
