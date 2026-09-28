import { useTranslations } from "next-intl";

export default function ProcessSection() {
  const t = useTranslations("process");

  const steps = [
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <section className="bg-zinc-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center heading text-3xl md:text-4xl">
          {t("heading")}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-[2.5rem] border border-zinc-800 bg-zinc-900 p-8"
            >
              <span className="mb-4 block heading text-4xl text-brand-red">
                0{i + 1}
              </span>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
