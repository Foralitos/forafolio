# CLAUDE.md

Guía para Claude Code al trabajar en este repo.

## Qué es

Portafolio personal de Fora: landing con tema día/noche según la hora de la Ciudad de México, blog y un admin propio. Corre en **Next.js 16 (App Router) + JavaScript**, sobre el esqueleto del boilerplate ShipFast.

Migrado desde Remix v2 en agosto 2026. El código viejo vive en la rama `remix-legacy` — útil para comparar cuando algo se ve distinto.

## Comandos

```bash
yarn dev            # servidor de desarrollo
yarn build          # build de producción
yarn start          # sirve el build
yarn lint           # eslint (flat config)
yarn seed           # siembra los proyectos iniciales en Mongo (solo si está vacía)
```

**Siempre yarn, nunca npm.**

## Stack

- Next 16 App Router, React 19, **JavaScript** (nada de TypeScript — el paquete `typescript` está solo porque `eslint-config-next` lo exige)
- **Tailwind 3.4** a propósito, no 4: la config de fuentes y animaciones pixel vive en `tailwind.config.js` y migrarla a CSS arriesga el diseño. Sin DaisyUI.
- MongoDB con Mongoose (`libs/mongoose.js`) para los datos; driver nativo (`libs/mongo.js`) solo para el adapter de NextAuth
- NextAuth v5 con Google, un solo usuario permitido
- Cloudinary para las imágenes que se suben desde el admin
- Deploy en Vercel, dominio `forafolio.vercel.app`

## Estructura

```
app/
  page.js                    landing (RSC)
  layout.js  fonts.js        shell + next/font
  globals.css                Tailwind + .prose-blog
  blog/                      /blog y /blog/[slug]
  login/                     login con Google
  admin/                     dashboard, projects/, blog/  (+ actions.js por sección)
  api/auth/[...nextauth]/    handler de NextAuth
  robots.js  sitemap.js
components/
  common/   Navbar, Footer, ScrollDownIndicator, CDMXTimeProvider
  landing/  Hero, About, NPCDialogBox, Projects, Contact
  ui/       PrimaryButton, SecondaryButton (hoy sin uso)
hooks/      useCDMXTime.js   (solo el context; el cálculo está en libs/)
libs/       auth, mongo, mongoose, cloudinary, markdown, seo, resend, cdmxTime
models/     Project.js, Post.js
```

## Decisiones que hay que respetar

### La hora CDMX se calcula en el servidor
`libs/cdmxTime.js` es puro y sin directiva a propósito: lo llama tanto `app/page.js` (Server Component) como `CDMXTimeProvider` (cliente). El servidor manda la hora ya resuelta al provider, así que el primer HTML ya trae el fondo, los colores y el reloj correctos. En Remix cada componente corría su propio `setInterval` arrancando en blanco, y el sitio parpadeaba de día a noche al hidratar.

Si mueves `calcularCDMXTime` a un archivo `"use client"`, el servidor deja de poder ejecutarlo y vuelve el parpadeo.

### El tema día/noche es hora de CDMX, no del visitante
A propósito: refleja el ciclo real de Fora, no el de quien visita. `isDaytime` es 6am–6pm.

### Los colores día/noche son strings de clase condicionales
`Projects`, `Contact` y `Footer` arman ~20 variables de clase cada uno a partir de `isDaytime`. Se portaron literal desde Remix. Refactorizarlos a CSS variables o `data-theme` es mejora pendiente, no urgencia.

### Las Server Actions revalidan su propia sesión
El guard de `app/admin/layout.js` NO cubre las actions: son endpoints POST propios a los que se puede pegar directo. Cada función en `app/admin/*/actions.js` llama `auth()` antes de tocar Mongo. No quites esa comprobación por parecer redundante.

### Tope de subida: 4 MB
Vercel corta cualquier request body en 4.5 MB, así que el límite real es menor a los 5 MB que tenía Remix. Está declarado en `next.config.mjs` (`serverActions.bodySizeLimit`) y validado en `libs/cloudinary.js`. Si algún día estorba, la salida es subir directo a Cloudinary desde el cliente con un unsigned preset.

### `revalidatePath` después de cada mutación
El sitio público y el admin leen la misma data. Publicar un post también revalida `/sitemap.xml`, que se prerenderiza en build.

### Los `<img>` son deliberados
Los fondos (`ForaDay.png` y compañía) pesan 2–3 MB y se cargan como `background-image` con `ReactDOM.preload`. ESLint avisa que use `next/image`; se dejó así para que la migración fuera 1:1 y cualquier diferencia visual delatara un bug. **Convertirlos a `next/image` + WebP/AVIF es la mejora de performance más grande disponible** — pero es un cambio de diseño, no de migración.

### `imageRendering: 'pixelated'`
Todas las imágenes del landing lo llevan. Es la estética, no un descuido.

## Estilos

- Tailwind utility-first; evita CSS propio
- Framer Motion para todas las animaciones. Patrón `initial`/`animate`, `AnimatePresence` para salidas, duraciones de 0.5–0.8s
- Fuentes: PP Neue Bit (títulos), PP Mondwest (cuerpo), Press Start 2P (pixel). Se cargan con `next/font` desde `app/fonts.js` y se exponen como CSS variables — no agregues `@font-face` a mano
- Glassmorphism: `bg-white/10 backdrop-blur-md border-white/20`
- Alias de imports: `@/` a la raíz del repo

## Patrones comunes

### Agregar una sección al landing
1. Componente nuevo en `components/landing/` con `"use client"` si usa Framer Motion o listeners
2. Renderízalo en `app/page.js` dentro del `CDMXTimeProvider`
3. Ponle un `id` de sección
4. Agrégalo a `navItems` y al array `sections` del scroll handler en `Navbar.jsx`

### Navegación
El navbar hace scroll-to-anchor con `window.scrollTo` y offset de 80px, y detecta la sección activa con un listener contra un umbral de 100px. Los links a otras rutas (`/blog`) sí usan `<Link>` de Next.

## Variables de entorno

`MONGODB_URI`, `GOOGLE_ID`, `GOOGLE_SECRET`, `ALLOWED_EMAIL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Ver `.env.example`.

El redirect URI de Google es `/api/auth/callback/google` (NextAuth), no el `/auth/google/callback` que usaba Remix.
