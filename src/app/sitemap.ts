import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProjects, getBlogPosts } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ebanavision.com";

// This now queries the DB (for project detail pages), so it can't be
// statically generated at build time — the CI build (see DEPLOYMENT.md)
// deliberately runs with an unreachable placeholder DATABASE_URL and would
// fail otherwise, same reasoning as the `force-dynamic` on
// src/app/[locale]/layout.tsx.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
  }));

  const projects = await getProjects();
  const projectEntries: MetadataRoute.Sitemap = projects.flatMap((project) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/proyectos/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const blogEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const posts = await getBlogPosts();
  const blogPostEntries: MetadataRoute.Sitemap = posts.flatMap((post) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  return [...homeEntries, ...projectEntries, ...blogEntries, ...blogPostEntries];
}
