import { cache } from "react";
import { db } from "./db";

export const getSiteSettings = cache(async () => {
  return db.siteSetting.findUnique({ where: { id: 1 } });
});

export const getEnabledSections = cache(async () => {
  return db.section.findMany({ where: { enabled: true }, orderBy: { sortOrder: "asc" } });
});

export const getServices = cache(async () => {
  return db.service.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
});

export const getProjects = cache(async () => {
  return db.project.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
});

export const getBrands = cache(async () => {
  return db.brand.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
});

export const getTestimonials = cache(async () => {
  return db.testimonial.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
});

export const getBlogPosts = cache(async () => {
  return db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
});

export const getProcessSteps = cache(async () => {
  return db.processStep.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
});

export const getAboutStats = cache(async () => {
  return db.aboutStat.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
});
