import { getTranslations, getLocale } from "next-intl/server";
import { getProcessSteps } from "@/lib/content";
import { pickText } from "@/lib/localized";
import type { AppLocale } from "@/i18n/routing";

export default async function ProcessSection() {
  const t = await getTranslations("process");
  const locale = (await getLocale()) as AppLocale;
  const steps = await getProcessSteps();

  if (steps.length === 0) return null;

  return (
    <section className="bg-zinc-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center heading text-3xl md:text-4xl">
          {t("heading")}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="rounded-[2.5rem] border border-zinc-800 bg-zinc-900 p-8"
            >
              <span className="mb-4 block heading text-4xl text-brand-red">
                0{i + 1}
              </span>
              <h3 className="mb-2 text-xl font-semibold">{pickText(step.title, locale)}</h3>
              <p className="text-zinc-400">{pickText(step.description, locale)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
