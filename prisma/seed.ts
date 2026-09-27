import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const OPTIONAL_SECTIONS = [
  { key: "trustMarquee", sortOrder: 0 },
  { key: "portfolio", sortOrder: 1 },
  { key: "services", sortOrder: 2 },
  { key: "process", sortOrder: 3 },
  { key: "about", sortOrder: 4 },
  { key: "testimonials", sortOrder: 5 },
  { key: "blog", sortOrder: 6 },
  { key: "faq", sortOrder: 7 },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "ebanavision@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      "SEED_ADMIN_PASSWORD environment variable is required to seed the admin user"
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  for (const section of OPTIONAL_SECTIONS) {
    await db.section.upsert({
      where: { key: section.key },
      update: {},
      create: { key: section.key, enabled: true, sortOrder: section.sortOrder },
    });
  }
  console.log(`Seeded ${OPTIONAL_SECTIONS.length} sections`);

  await db.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      metaDescription: {
        es: "Estudio creativo líder en Malabo. Fotografía profesional, video marketing, diseño gráfico e impresión de alta calidad.",
        en: "Leading creative studio in Malabo. Professional photography, video marketing, graphic design and high-quality printing.",
        fr: "Studio créatif de premier plan à Malabo. Photographie professionnelle, vidéo marketing, design graphique et impression de haute qualité.",
      },
      heroTitle1: { es: "Capturamos", en: "We capture", fr: "Nous capturons" },
      heroTitle2: { es: "lo que otros", en: "what others", fr: "ce que les autres" },
      heroTitle3: { es: "no ven.", en: "don't see.", fr: "ne voient pas." },
      heroDescription: {
        es: "",
        en: "",
        fr: "",
      },
    },
  });
  console.log("Seeded default site settings");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
