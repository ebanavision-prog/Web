import type { Category } from "@prisma/client";

export const CATEGORY_LABELS: Record<Category, { es: string; en: string; fr: string }> = {
  ESTUDIO: { es: "Estudio", en: "Studio", fr: "Studio" },
  PRODUCTORA: { es: "Productora", en: "Production", fr: "Production" },
  DISENO: { es: "Diseño", en: "Design", fr: "Design" },
  IMPRENTA: { es: "Imprenta", en: "Printing", fr: "Impression" },
  MARKETING: { es: "Marketing", en: "Marketing", fr: "Marketing" },
  CONSULTORIA: { es: "Consultoría", en: "Consulting", fr: "Conseil" },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function categoryLabel(category: Category, locale: "es" | "en" | "fr"): string {
  return CATEGORY_LABELS[category][locale];
}
