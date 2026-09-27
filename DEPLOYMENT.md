# Despliegue a producción (cPanel Node.js Selector)

Este proyecto se despliega como una app Node persistente en el hosting de Namecheap,
usando la herramienta **Setup Node.js App** de cPanel (confirmada disponible en el
cPanel real: `.../frontend/jupiter/lveversion/nodejs-selector.html`).

Es un despliegue **manual por lotes**: se construye y verifica todo en local, y solo
se sube cuando se decide explícitamente publicar. No hay CI/CD automático.

## Requisitos previos (una sola vez)

1. **Base de datos MySQL** en cPanel → "MySQL Databases": crear una base y un usuario
   dedicado con todos los privilegios sobre esa base (igual que se hizo en local con
   el usuario `ebanavision`).
2. **App de Node.js** en cPanel → "Setup Node.js App":
   - Node.js version: 20 o superior.
   - Application root: la carpeta donde subirás `.next/standalone` (ver abajo).
   - Application startup file: `server.js`.
   - Application mode: Production.
3. Variables de entorno (se configuran en el mismo panel de "Setup Node.js App", o en
   un archivo `.env` junto a `server.js` — ver `.env.example` en la raíz del repo):
   - `DATABASE_URL` — cadena de conexión a la base MySQL de producción.
   - `AUTH_SECRET` — generar con `openssl rand -base64 32` (uno distinto al de desarrollo).
   - `NEXT_PUBLIC_SITE_URL=https://ebanavision.com`
   - `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`.
   - `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` — generar una vez y mantenerla estable entre
     despliegues (si cambia, las acciones del servidor en curso fallan hasta recargar).

## Cada vez que se publica una actualización

Desde esta máquina, dentro de la carpeta del proyecto:

```bash
npm run build
```

Esto genera `.next/standalone/` (el servidor autocontenido) y `.next/static/` (los
assets). Antes de subir, hay que ensamblar la carpeta final exactamente así:

```bash
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
```

El contenido de `.next/standalone/` es lo único que se sube al servidor (reemplazando
lo que hubiera antes) — no se sube el resto del repo. `.env` en el servidor **no** se
sobrescribe con el de local, ya tiene sus propias variables de producción.

## Primera vez / cambios de esquema

Si el schema de Prisma cambió, correr la migración contra la base de **producción**
antes de reiniciar la app:

```bash
DATABASE_URL="<url de producción>" npx prisma migrate deploy
```

Para crear el primer usuario admin en producción:

```bash
DATABASE_URL="<url de producción>" SEED_ADMIN_PASSWORD="<contraseña>" npx tsx prisma/seed.ts
```

## Reiniciar la app

Después de subir los archivos nuevos, en cPanel → "Setup Node.js App" → botón
**Restart** sobre la aplicación. Passenger se encarga del proceso; no hace falta PM2
ni un reverse proxy aparte.

## Migración de contenido desde WordPress (una sola vez)

`npm run migrate:wp` trae servicios, proyectos, marcas, testimonios y ajustes desde
`cms.ebanavision.com` a la base de datos indicada por `DATABASE_URL`. Es re-ejecutable
sin duplicar contenido. Deja los campos en inglés y francés vacíos — se completan
después desde `/admin`. Ya se ejecutó una vez contra producción durante el desarrollo;
volver a correrlo antes del lanzamiento si el contenido en WordPress cambió mientras
tanto.

## Verificación post-despliegue

- `https://ebanavision.com/es`, `/en`, `/fr` cargan y muestran contenido real.
- `https://ebanavision.com/admin/login` funciona con las credenciales de producción.
- Enviar un lead de prueba desde el formulario de contacto y confirmar que aparece
  en `/admin` y llega el email (si EmailJS está configurado).
- `https://ebanavision.com/sitemap.xml` y `/robots.txt` responden.

## Cuándo retirar WordPress

Solo después de confirmar en producción que todo el contenido migrado se ve bien y
las traducciones EN/FR están completas. `cms.ebanavision.com` y el proyecto Firebase
original quedan como referencia hasta entonces — no se apagan como parte de este
despliegue.
