import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getBrands } from "@/lib/content";

export default async function TrustMarquee() {
  const t = await getTranslations("trustMarquee");
  const allBrands = await getBrands();
  const brands = allBrands.filter((b) => b.logoUrl);
  if (brands.length === 0) return null;

  const doubled = [...brands, ...brands];

  return (
    <section className="border-y border-zinc-200 bg-white py-10 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-zinc-400">
        {t("heading")}
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] items-center gap-16">
          {doubled.map((brand, i) => (
            <div key={`${brand.id}-${i}`} className="relative h-10 w-28 shrink-0 opacity-70">
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                className="object-contain grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
