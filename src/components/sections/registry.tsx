import type { ComponentType } from "react";
import TrustMarquee from "./TrustMarquee";
import Portfolio from "./Portfolio";
import Services from "./Services";
import ProcessSection from "./ProcessSection";
import About from "./About";
import Testimonials from "./Testimonials";
import Blog from "./Blog";
import FAQSection from "./FAQSection";

export const SECTION_REGISTRY: Record<string, ComponentType> = {
  trustMarquee: TrustMarquee,
  portfolio: Portfolio,
  services: Services,
  process: ProcessSection,
  about: About,
  testimonials: Testimonials,
  blog: Blog,
  faq: FAQSection,
};
