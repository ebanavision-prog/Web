import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { getTestimonials } from "@/lib/content";
import { pickText } from "@/lib/localized";
import type { AppLocale } from "@/i18n/routing";

export default async function Testimonials() {
  const t = await getTranslations("testimonials");
  const locale = (await getLocale()) as AppLocale;
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonios" className="bg-zinc-50 py-24 dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 font-serif text-3xl font-bold italic text-zinc-900 md:text-4xl dark:text-white">
            {t("heading")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">{t("subheading")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="rounded-[2.5rem] bg-white p-8 shadow-sm dark:bg-zinc-800"
            >
              <blockquote className="mb-4 text-zinc-700 dark:text-zinc-300">
                &ldquo;{pickText(testimonial.quote, locale)}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {testimonial.image && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-zinc-500">{pickText(testimonial.role, locale)}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
