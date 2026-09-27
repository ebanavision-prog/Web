import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("common");
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-950 text-white">
      <p className="text-lg">{t("placeholder")}</p>
    </main>
  );
}
