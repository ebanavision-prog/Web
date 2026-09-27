"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import { submitLead } from "@/app/[locale]/lead-actions";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactClient({
  whatsappNumber,
  alternativePhone,
  contactEmail,
  address,
}: {
  whatsappNumber: string;
  alternativePhone: string | null;
  contactEmail: string;
  address: string;
}) {
  const t = useTranslations("contact");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(formData: FormData) {
    const errors: Record<string, string> = {};
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("contact") ?? "");
    const message = String(formData.get("message") ?? "");

    if (name.trim().length < 3) errors.name = t("validationName");
    if (!EMAIL_REGEX.test(email)) errors.contact = t("validationEmail");
    if (message.trim().length < 10) errors.message = t("validationMessage");

    return errors;
  }

  return (
    <section id="contacto" className="bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-serif text-3xl font-bold italic text-zinc-900 md:text-4xl dark:text-white">
            {t("heading")}
          </h2>
          <p className="mb-8 text-zinc-500 dark:text-zinc-400">{t("subheading")}</p>

          <div className="space-y-4 text-zinc-600 dark:text-zinc-300">
            <p className="flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-brand-red" />
              {address}
            </p>
            <p className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-brand-red" />
              {contactEmail}
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-brand-red" />
              +{whatsappNumber}
              {alternativePhone && <> / {alternativePhone}</>}
            </p>
          </div>
        </div>

        <form
          action={(formData) => {
            const errors = validate(formData);
            setFieldErrors(errors);
            if (Object.keys(errors).length > 0) return;

            startTransition(async () => {
              const result = await submitLead("CONTACT", formData);
              setStatus(result.success ? "success" : "error");
            });
          }}
          className="space-y-4"
        >
          <div>
            <input
              type="text"
              name="name"
              placeholder={t("name")}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-brand-red dark:border-zinc-700 dark:bg-zinc-900"
            />
            {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="contact"
              placeholder={t("email")}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-brand-red dark:border-zinc-700 dark:bg-zinc-900"
            />
            {fieldErrors.contact && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.contact}</p>
            )}
          </div>

          <input type="text" name="service" placeholder={t("service")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-brand-red dark:border-zinc-700 dark:bg-zinc-900" />

          <div>
            <textarea
              name="message"
              rows={4}
              placeholder={t("message")}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-brand-red dark:border-zinc-700 dark:bg-zinc-900"
            />
            {fieldErrors.message && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-brand-red px-6 py-3 font-medium text-white disabled:opacity-60"
          >
            {isPending ? "..." : t("submit")}
          </button>

          {status === "success" && (
            <p className="text-sm text-green-600">{t("success")}</p>
          )}
          {status === "error" && <p className="text-sm text-red-600">{t("error")}</p>}
        </form>
      </div>
    </section>
  );
}
