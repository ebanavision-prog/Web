import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "fr"],
  defaultLocale: "es",
  // Always start visitors on Spanish instead of guessing from the browser's
  // Accept-Language header — this business is Spanish-first in Malabo, and
  // visitors can still switch languages explicitly via the locale switcher.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
