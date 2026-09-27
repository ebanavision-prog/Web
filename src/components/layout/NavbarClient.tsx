"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";

export default function NavbarClient({ logoUrl }: { logoUrl: string | null }) {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/#inicio", label: t("home") },
    { href: "/#nosotros", label: t("about") },
    { href: "/#servicios", label: t("services") },
    { href: "/#portafolio", label: t("portfolio") },
    { href: "/#testimonios", label: t("testimonials") },
    { href: "/#blog", label: t("blog") },
    { href: "/#contacto", label: t("contact") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <div className="relative h-8 w-8">
              <Image src={logoUrl} alt="Ebana Visión" fill className="object-contain" />
            </div>
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">
              EV
            </span>
          )}
          <span className="font-serif text-lg font-bold italic text-zinc-900 dark:text-white">
            Ebana Visión
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-600 hover:text-brand-red dark:text-zinc-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <a
            href="#contacto"
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-medium text-white"
          >
            {t("cta")}
          </a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6 text-zinc-700 dark:text-white" />
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-6 dark:bg-zinc-950 md:hidden">
          <div className="mb-8 flex justify-end">
            <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
              <X className="h-6 w-6 text-zinc-700 dark:text-white" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-lg">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-zinc-900 dark:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 flex items-center gap-4">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
