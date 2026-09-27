import { getProjects, getSiteSettings } from "@/lib/content";
import PortfolioClient from "./PortfolioClient";

export default async function Portfolio() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  if (projects.length === 0) return null;
  return <PortfolioClient projects={projects} freeResourceUrl={settings?.freeResourceUrl ?? null} />;
}
