import { setRequestLocale } from "next-intl/server";
import { getEnabledSections } from "@/lib/content";
import { SECTION_REGISTRY } from "@/components/sections/registry";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import BackToTop from "@/components/layout/BackToTop";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sections = await getEnabledSections();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <Hero />
        {sections.map((section) => {
          const SectionComponent = SECTION_REGISTRY[section.key];
          if (!SectionComponent) return null;
          return <SectionComponent key={section.key} />;
        })}
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
      <BackToTop />
    </>
  );
}
