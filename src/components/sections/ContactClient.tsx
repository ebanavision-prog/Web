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
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <h2 className="mb-1 font-serif text-2xl font-bold italic text-zinc-900 dark:text-white">
        {t("heading")}
      </h2>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{t("subheading")}</p>

      <div className="mb-5 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-brand-red" />
          {address}
        </p>
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-brand-red" />
          {contactEmail}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-brand-red" />
          +{whatsappNumber}
          {alternativePhone && <> / {alternativePhone}</>}
        </p>
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
        className="space-y-3"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <input
              type="text"
              name="name"
              placeholder={t("name")}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-red dark:border-zinc-700 dark:bg-zinc-800"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="contact"
              placeholder={t("email")}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-red dark:border-zinc-700 dark:bg-zinc-800"
            />
            {fieldErrors.contact && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.contact}</p>
            )}
          </div>
        </div>

        <input
          type="text"
          name="service"
          placeholder={t("service")}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-red dark:border-zinc-700 dark:bg-zinc-800"
        />

        <div>
          <textarea
            name="message"
            rows={3}
            placeholder={t("message")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-red dark:border-zinc-700 dark:bg-zinc-800"
          />
          {fieldErrors.message && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-brand-red px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {isPending ? "..." : t("submit")}
        </button>

        {status === "success" && (
          <p className="text-xs text-green-600">{t("success")}</p>
        )}
        {status === "error" && <p className="text-xs text-red-600">{t("error")}</p>}
      </form>
    </div>
  );
}
