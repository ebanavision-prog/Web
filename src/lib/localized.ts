import type { AppLocale } from "@/i18n/routing";

type LocalizedText = Partial<Record<AppLocale, string>>;
type LocalizedList = Partial<Record<AppLocale, string[]>>;

export function pickText(value: unknown, locale: AppLocale): string {
  const text = value as LocalizedText | null | undefined;
  return text?.[locale] || text?.es || "";
}

export function pickList(value: unknown, locale: AppLocale): string[] {
  const list = value as LocalizedList | null | undefined;
  return list?.[locale]?.length ? list[locale]! : list?.es ?? [];
}
