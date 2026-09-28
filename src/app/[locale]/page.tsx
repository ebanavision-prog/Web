import { setRequestLocale } from "next-intl/server";
import { getEnabledSections } from "@/lib/content";
import { SECTION_REGISTRY } from "@/components/sections/registry";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import FAQSection from "@/components/sections/FAQSection";
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
  const faqEnabled = sections.some((s) => s.key === "faq");
  const otherSections = sections.filter((s) => s.key !== "faq");

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <Hero />
        {otherSections.map((section) => {
          const SectionComponent = SECTION_REGISTRY[section.key];
          if (!SectionComponent) return null;
          return <SectionComponent key={section.key} />;
        })}
        <section
          id="contacto"
          className="bg-zinc-50 py-20 dark:bg-zinc-900"
        >
          <div
            className={`mx-auto max-w-6xl px-4 grid gap-6 ${
              faqEnabled ? "md:grid-cols-2" : "md:max-w-3xl"
            }`}
          >
            {faqEnabled && <FAQSection />}
            <Contact />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
      <BackToTop />
    </>
  );
}
