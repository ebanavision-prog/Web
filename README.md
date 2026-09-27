# Ebana Visión — sitio web

Reconstrucción del sitio de Ebana Visión (ebanavision.com) en Next.js, con CMS propio
integrado (panel `/admin`), multi-idioma (ES/EN/FR), secciones activables desde el
admin, y base de datos MySQL vía Prisma.

## Desarrollo local

```bash
npm install
cp .env.example .env   # completar DATABASE_URL, AUTH_SECRET, etc.
npx prisma migrate dev
SEED_ADMIN_PASSWORD="tu-contraseña" npx tsx prisma/seed.ts
npm run dev
```

Sitio público: [http://localhost:3000/es](http://localhost:3000/es)
Panel de admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Migrar contenido desde WordPress

```bash
npm run migrate:wp
```

Trae servicios, proyectos, marcas, testimonios y ajustes desde `cms.ebanavision.com`.
Ver comentarios en `scripts/migrate-from-wordpress.ts`.

## Despliegue a producción

Ver [`DEPLOYMENT.md`](./DEPLOYMENT.md) — despliegue manual a cPanel (Node.js Selector),
sin CI/CD automático.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma + MySQL · next-intl ·
sesiones propias (jose + bcryptjs) · sharp para compresión de imágenes.
