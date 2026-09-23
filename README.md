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

The live site is the Static Web App `academiageorgetown` in resource group `AcademiaGeorgetown` (West Europe), subscription `pec`:

https://ambitious-sky-01938c103.6.azurestaticapps.net

That group also holds Communication Services `academiageorgetown-acs` and Email `academiageorgetown-email`. The Function reads `CONTACT_TO`, `MAIL_FROM`, and `AZURE_COMMUNICATION_CONNECTION_STRING` from the Static Web App application settings. `MAIL_FROM` is the Azure-managed sender `DoNotReply@9895f60a-83d8-4bdb-ad60-7e3225f391fd.azurecomm.net`. Add `RECAPTCHA_SECRET` and `CLIENTIFY_WEBHOOK_URL` there when those values are available.

GitHub Actions (`.github/workflows/azure-static-web-apps.yml`) deploys only after the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN` is set to this app's deployment token. Custom domain `www.academiageorgetown.com` is not attached yet.

### GitHub Pages (preview para comparaciones)

Publica una copia estática en `https://ricdevs.github.io/Academia_Georgetown/` (noindex) para comparar con producción.

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
- Programas de inglés técnico: `src/data/pec-programs.json`
- Certificados y copy extraído: `src/data/extracted-pages.json`
- Blog: `src/content/blog/*.md`
- Preguntas de nivel: `src/data/level-test.json`
