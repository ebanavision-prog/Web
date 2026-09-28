"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Music2, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { submitLead } from "@/app/[locale]/lead-actions";

export default function FooterClient({
  contactEmail,
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  youtubeUrl,
}: {
  contactEmail: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
}) {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const [isPending, startTransition] = useTransition();
  const [subscribed, setSubscribed] = useState(false);

  const socials = [
    { href: instagramUrl, icon: InstagramIcon, label: "Instagram" },
    { href: facebookUrl, icon: FacebookIcon, label: "Facebook" },
    { href: tiktokUrl, icon: Music2, label: "TikTok" },
    { href: youtubeUrl, icon: YoutubeIcon, label: "YouTube" },
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-3 heading text-xl text-white">
              Ebana Visión
            </h3>
            <p className="text-sm">Producción audiovisual, diseño e impresión en Malabo.</p>
            <div className="mt-4 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full bg-zinc-900 p-2 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-white">{nav("home")}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#servicios" className="hover:text-white">{nav("services")}</a></li>
              <li><a href="#portafolio" className="hover:text-white">{nav("portfolio")}</a></li>
              <li><a href="#contacto" className="hover:text-white">{nav("contact")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-white">{t("connect")}</h4>
            <a
              href={`mailto:${contactEmail}`}
              className="mb-4 flex items-center gap-2 text-sm hover:text-white"
            >
              <Mail className="h-4 w-4" /> {contactEmail}
            </a>

            {subscribed ? (
              <p className="text-sm text-green-500">{t("newsletterSubmit")} ✓</p>
            ) : (
              <form
                action={(formData) => {
                  startTransition(async () => {
                    const result = await submitLead("NEWSLETTER", formData);
                    if (result.success) setSubscribed(true);
                  });
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  name="contact"
                  required
                  placeholder={t("newsletterPlaceholder")}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="shrink-0 rounded-lg bg-brand-red px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {t("newsletterSubmit")}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-6 text-xs sm:flex-row">
          <p>
            © {new Date().getFullYear()} Ebana Visión. {t("rights")}.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">{t("privacy")}</a>
            <a href="#" className="hover:text-white">{t("cookies")}</a>
            <a href="#" className="hover:text-white">{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
