"use client";

import { useState } from "react";

const LOCALES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

export default function LocaleTabsField({
  label,
  name,
  defaultValues,
  multiline = false,
  hint,
  required = false,
}: {
  label: string;
  name: string;
  defaultValues?: Partial<Record<LocaleCode, string>>;
  multiline?: boolean;
  hint?: string;
  required?: boolean;
}) {
  const [active, setActive] = useState<LocaleCode>("es");

  return (
    <div className="mb-5">
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm text-zinc-400">{label}</label>
        <div className="flex gap-1">
          {LOCALES.map((locale) => (
            <button
              key={locale.code}
              type="button"
              onClick={() => setActive(locale.code)}
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                active === locale.code
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {locale.label}
            </button>
          ))}
        </div>
      </div>

      {hint && <p className="mb-1 text-xs text-zinc-500">{hint}</p>}

      {LOCALES.map((locale) => {
        const fieldName = `${name}_${locale.code}`;
        const value = defaultValues?.[locale.code] ?? "";
        const isVisible = active === locale.code;
        const commonProps = {
          name: fieldName,
          defaultValue: value,
          required: required && locale.code === "es",
          className: `w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-red-600 ${
            isVisible ? "" : "hidden"
          }`,
        };

        return multiline ? (
          <textarea key={locale.code} rows={4} {...commonProps} />
        ) : (
          <input key={locale.code} type="text" {...commonProps} />
        );
      })}
    </div>
  );
}
