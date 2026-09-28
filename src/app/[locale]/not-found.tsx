import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const locale = await getLocale();
  const messages: Record<string, { title: string; body: string; cta: string }> = {
    es: {
      title: "Página no encontrada",
      body: "La página que buscas no existe o fue movida.",
      cta: "Volver al inicio",
    },
    en: {
      title: "Page not found",
      body: "The page you're looking for doesn't exist or was moved.",
      cta: "Back to home",
    },
    fr: {
      title: "Page introuvable",
      body: "La page que vous cherchez n'existe pas ou a été déplacée.",
      cta: "Retour à l'accueil",
    },
  };
  const t = messages[locale] ?? messages.es;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center text-white">
      <p className="mb-2 heading text-6xl text-brand-red">404</p>
      <h1 className="mb-2 text-2xl font-semibold">{t.title}</h1>
      <p className="mb-6 text-zinc-400">{t.body}</p>
      <Link href="/" className="rounded-full bg-brand-red px-6 py-3 font-medium">
        {t.cta}
      </Link>
    </div>
  );
}
