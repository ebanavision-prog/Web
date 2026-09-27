/**
 * One-off migration: pulls content from the old WordPress headless CMS
 * (cms.ebanavision.com) and loads it into the new MySQL/Prisma schema.
 *
 * Usage: npx tsx scripts/migrate-from-wordpress.ts
 *
 * Safe to re-run: upserts by slug (services/projects/blog) or name (brands).
 * EN/FR translations are left blank — fill them in from /admin afterward.
 */
import { PrismaClient, type Category } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";

const db = new PrismaClient();
const WP_DOMAIN = (process.env.WP_API_URL ?? "https://cms.ebanavision.com").replace(/\/$/, "");

type WPCustomPost<T> = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: T;
  _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> };
};

type ServiceACF = {
  descripcion?: string;
  categoria?: string;
  icono?: string;
  detalles?: string;
  texto_cta?: string;
};
type ProjectACF = { cliente?: string; categoria?: string; video_url?: string };
type TestimonialACF = { cargo?: string; cita?: string };
type GlobalConfigACF = {
  hero_titulo_1?: string;
  hero_titulo_2?: string;
  hero_titulo_3?: string;
  hero_descripcion?: string;
  hero_video_youtube_id?: string;
  logo_url?: string | number;
  whatsapp_numero?: string;
  telefono_alternativo?: string;
  email_contacto?: string;
  direccion?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  meta_descripcion?: string;
  url_recurso_gratis?: string;
};

const CATEGORY_MAP: Record<string, Category> = {
  Estudio: "ESTUDIO",
  Productora: "PRODUCTORA",
  "Diseño": "DISENO",
  Imprenta: "IMPRENTA",
  Marketing: "MARKETING",
  "Consultoría": "CONSULTORIA",
};

function mapCategory(raw?: string): Category {
  return CATEGORY_MAP[raw ?? ""] ?? "ESTUDIO";
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
};

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&(\w+);/g, (match, name) => NAMED_ENTITIES[name] ?? match);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchAll<T>(endpoint: string): Promise<T[]> {
  const res = await fetch(`${WP_DOMAIN}/wp-json/wp/v2/${endpoint}&_embed&per_page=100`);
  if (!res.ok) {
    console.warn(`[migrate] ${endpoint} responded ${res.status}, skipping`);
    return [];
  }
  return res.json();
}

async function fetchOne<T>(endpoint: string): Promise<T | null> {
  const res = await fetch(`${WP_DOMAIN}/wp-json/wp/v2/${endpoint}`);
  if (!res.ok) return null;
  const list = await res.json();
  return Array.isArray(list) ? (list[0] ?? null) : list;
}

async function resolveMediaUrl(idOrUrl?: string | number): Promise<string | undefined> {
  if (!idOrUrl) return undefined;
  if (typeof idOrUrl === "string" && !/^\d+$/.test(idOrUrl)) return idOrUrl;
  const res = await fetch(`${WP_DOMAIN}/wp-json/wp/v2/media/${idOrUrl}`);
  if (!res.ok) return undefined;
  const media = await res.json();
  return media.source_url as string | undefined;
}

function featuredImage(post: WPCustomPost<unknown>): string {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
}

async function main() {
  console.log(`[migrate] Fetching from ${WP_DOMAIN} ...`);

  const [services, projects, brands, testimonials, config] = await Promise.all([
    fetchAll<WPCustomPost<ServiceACF>>("servicio?"),
    fetchAll<WPCustomPost<ProjectACF>>("proyecto?"),
    fetchAll<WPCustomPost<Record<string, never>>>("marca?"),
    fetchAll<WPCustomPost<TestimonialACF>>("testimonio?"),
    fetchOne<WPCustomPost<GlobalConfigACF>>("config_global?per_page=1"),
  ]);

  await writeFile(
    path.join(process.cwd(), `migration-backup-${Date.now()}.json`),
    JSON.stringify({ services, projects, brands, testimonials, config }, null, 2)
  );
  console.log("[migrate] Raw backup written.");

  for (const s of services) {
    const acf = s.acf;
    const baseSlug = slugify(decodeHtmlEntities(s.title.rendered) || "servicio");
    await db.service.upsert({
      where: { slug: baseSlug },
      update: {},
      create: {
        slug: baseSlug,
        title: { es: decodeHtmlEntities(s.title.rendered), en: "", fr: "" },
        description: { es: acf.descripcion ?? "", en: "", fr: "" },
        category: mapCategory(acf.categoria),
        icon: acf.icono ?? "camera",
        details: {
          es: (acf.detalles ?? "").split("\n").map((l) => l.trim()).filter(Boolean),
          en: [],
          fr: [],
        },
        ctaText: { es: acf.texto_cta ?? "", en: "", fr: "" },
        image: featuredImage(s),
      },
    });
  }
  console.log(`[migrate] Services: ${services.length}`);

  for (const p of projects) {
    const acf = p.acf;
    const baseSlug = slugify(decodeHtmlEntities(p.title.rendered) || "proyecto");
    await db.project.upsert({
      where: { slug: baseSlug },
      update: {},
      create: {
        slug: baseSlug,
        title: { es: decodeHtmlEntities(p.title.rendered), en: "", fr: "" },
        description: { es: "", en: "", fr: "" },
        client: acf.cliente ?? null,
        category: mapCategory(acf.categoria),
        videoUrlRaw: acf.video_url ?? null,
        image: featuredImage(p),
      },
    });
  }
  console.log(`[migrate] Projects: ${projects.length}`);

  for (const b of brands) {
    const existing = await db.brand.findFirst({ where: { name: decodeHtmlEntities(b.title.rendered) } });
    if (!existing) {
      await db.brand.create({ data: { name: decodeHtmlEntities(b.title.rendered), logoUrl: featuredImage(b) } });
    }
  }
  console.log(`[migrate] Brands: ${brands.length}`);

  for (const t of testimonials) {
    const existing = await db.testimonial.findFirst({ where: { name: decodeHtmlEntities(t.title.rendered) } });
    if (!existing) {
      await db.testimonial.create({
        data: {
          name: decodeHtmlEntities(t.title.rendered),
          role: { es: t.acf.cargo ?? "", en: "", fr: "" },
          quote: { es: t.acf.cita ?? "", en: "", fr: "" },
          image: featuredImage(t) || null,
        },
      });
    }
  }
  console.log(`[migrate] Testimonials: ${testimonials.length}`);

  if (config) {
    const acf = config.acf;
    const logoUrl = await resolveMediaUrl(acf.logo_url);
    const settingsData = {
      whatsappNumber: acf.whatsapp_numero ?? null,
      alternativePhone: acf.telefono_alternativo ?? null,
      contactEmail: acf.email_contacto ?? null,
      address: acf.direccion ?? null,
      instagramUrl: acf.instagram_url ?? null,
      facebookUrl: acf.facebook_url ?? null,
      tiktokUrl: acf.tiktok_url ?? null,
      youtubeUrl: acf.youtube_url ?? null,
      heroVideoYoutubeId: acf.hero_video_youtube_id ?? null,
      logoUrl: logoUrl ?? null,
      freeResourceUrl: acf.url_recurso_gratis ?? null,
      metaDescription: { es: decodeHtmlEntities(acf.meta_descripcion ?? ""), en: "", fr: "" },
      heroTitle1: { es: decodeHtmlEntities(acf.hero_titulo_1 ?? ""), en: "", fr: "" },
      heroTitle2: { es: decodeHtmlEntities(acf.hero_titulo_2 ?? ""), en: "", fr: "" },
      heroTitle3: { es: decodeHtmlEntities(acf.hero_titulo_3 ?? ""), en: "", fr: "" },
      heroDescription: { es: decodeHtmlEntities(acf.hero_descripcion ?? ""), en: "", fr: "" },
    };
    await db.siteSetting.upsert({
      where: { id: 1 },
      update: settingsData,
      create: { id: 1, ...settingsData },
    });
    console.log("[migrate] Site settings migrated.");
  }

  console.log("[migrate] Done. Fill in EN/FR translations from /admin.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
