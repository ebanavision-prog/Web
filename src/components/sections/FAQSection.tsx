"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { question: string; answer: string }[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-zinc-50 py-24 dark:bg-zinc-900">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold italic text-zinc-900 md:text-4xl dark:text-white">
          {t("heading")}
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-800"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-medium text-zinc-900 dark:text-white"
                >
                  {item.question}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-4 text-zinc-600 dark:text-zinc-400">{item.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
