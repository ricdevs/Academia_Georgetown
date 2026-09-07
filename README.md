# Academia Georgetown

Sitio público de [Academia Georgetown](https://www.academiageorgetown.com) reconstruido en **Astro** (HTML estático) para sustituir WordPress + Divi. No hay login ni registro.

## Stack

- Astro 7 + TypeScript + Tailwind CSS 4
- Contenido en Markdown/JSON (`src/content/blog`, `src/data`)
- Formularios: Azure Functions (`api/submit`) o PHP SiteGround (`public/api/submit.php`)
- Analytics: GTM / GA4 / Clientify tras consentimiento de cookies

## Desarrollo

Requiere Node 22.12+.

```bash
cp .env.example .env
npm install
npm run dev
```

`npm run build` genera `dist/` listo para SiteGround o Azure Static Web Apps.

`npm run build:pages` genera el mismo sitio con `base` `/Academia_Georgetown/` para GitHub Pages.

## Hosting

### SiteGround

1. `npm run build`
2. Sube el contenido de `dist/` a `public_html`
3. El archivo `.htaccess` redirige `/login/`, `/register/` y resto LMS a `/`, y `/api/submit` a `api/submit.php`
4. Define `CONTACT_TO`, `RECAPTCHA_SECRET` y `CLIENTIFY_WEBHOOK_URL` en el entorno PHP (o SiteGround “environment variables”)

### Azure Static Web Apps

1. Crea un Static Web App y conecta este repositorio
2. Añade el secreto `AZURE_STATIC_WEB_APPS_API_TOKEN`
3. Configura las variables de la Function: `CONTACT_TO`, `RECAPTCHA_SECRET`, `CLIENTIFY_WEBHOOK_URL`, y opcionalmente Azure Communication Services (`AZURE_COMMUNICATION_CONNECTION_STRING`, `MAIL_FROM`)
4. Apunta `www.academiageorgetown.com` con CNAME al host de SWA
5. El flujo de GitHub Actions está en `.github/workflows/azure-static-web-apps.yml`

### GitHub Pages (preview para comparaciones)

Publica una copia estática en `https://rloria.github.io/Academia_Georgetown/` (noindex) para comparar con producción.

1. En GitHub: **Settings → Pages → Source: GitHub Actions**
2. El flujo `.github/workflows/github-pages.yml` construye con `npm run build:pages` y despliega `dist/`
3. También puedes lanzarlo a mano: **Actions → Deploy GitHub Pages → Run workflow**

Vista previa local del build de Pages:

```bash
npm run build:pages
npm run preview:pages
```

El build de producción (`npm run build`) sigue usando `site` `https://www.academiageorgetown.com` y `base` `/`.

El mismo `dist/` de producción sirve en SiteGround y Azure (`output: 'static'`).

## Cutover DNS

Mantén WordPress como respaldo hasta verificar:

- Formularios (contacto y prueba de nivel de 40 preguntas)
- Redirecciones 301 de `/login/`, `/register/`, `/courses/`, etc.
- GTM, Ads y Clientify
- URLs con barra final y `sitemap-index.xml`

## Contenido

- Páginas peculiares: `src/pages/`
- Programas PEC: `src/data/pec-programs.json`
- Certificados y copy extraído: `src/data/extracted-pages.json`
- Blog: `src/content/blog/*.md`
- Preguntas de nivel: `src/data/level-test.json`
