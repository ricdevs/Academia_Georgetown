// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import pec from './src/data/pec-programs.json';

const legacyHome = [
  '/login/',
  '/register/',
  '/lp-profile/',
  '/lp-checkout/',
  '/courses/',
  '/set-own-courses/',
  '/instructors/',
  '/instructor/',
  '/become_a_teacher/',
];

/** @type {Record<string, string>} */
const redirects = {
  '/term_conditions/': '/terminos/',
  '/a2-key/': '/a2-ket/',
  '/cambridge/': '/certificado-de-ingles-en-pamplona/',
  '/aptis/': '/aptis-advanced/',
  '/ielts/': '/certificado-de-ingles-en-pamplona/',
  '/examen-ielts/': '/certificado-de-ingles-en-pamplona/',
  '/pass/': '/',
  '/pec/': '/ingles-profesional/',
  '/empresas/': '/ingles-profesional/',
  '/sobre-nosotros/': '/academia-de-ingles-en-pamplona/',
  '/metodo-georgetown/': '/',
  '/intensivos/': '/curso-de-ingles-en-pamplona/',
  '/altea/': '/',
};
for (const path of legacyHome) {
  redirects[path] = '/';
}

const noindexSitemap = new Set([
  '/formulario-subvencionados/',
  ...pec.map((program) => `/${program.slug}/`),
]);

function sitemapPath(page) {
  const url = new URL(page);
  let pathname = url.pathname;
  if (pathname.startsWith('/Academia_Georgetown/')) {
    pathname = pathname.slice('/Academia_Georgetown'.length) || '/';
  }
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

const githubPages = process.env.GITHUB_PAGES === 'true';
const githubRepo = process.env.GITHUB_REPOSITORY || 'ricdevs/Academia_Georgetown';
const [githubOwner, githubName] = githubRepo.split('/');

export default defineConfig({
  site: githubPages ? `https://${githubOwner}.github.io` : 'https://www.academiageorgetown.com',
  base: githubPages ? `/${githubName}/` : '/',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = sitemapPath(page);
        if (pathname.includes('404')) return false;
        return !noindexSitemap.has(pathname);
      },
    }),
  ],
  redirects,
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'dev-form-api',
        configureServer(server) {
          const handler = (req, res, next) => {
            const [path] = (req.url || '').split('?');
            if (path !== '/api/submit' && path !== '/api/submit/') return next();
            if (req.method === 'OPTIONS') {
              res.statusCode = 204;
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
              res.end();
              return;
            }
            if (req.method !== 'POST') return next();
            const chunks = [];
            req.on('data', (c) => chunks.push(c));
            req.on('end', () => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, dev: true }));
            });
          };
          // Run before Astro's routing/trailingSlash middleware so a POST to
          // /api/submit (no trailing slash) is handled instead of 404'd in dev.
          return () => {
            server.middlewares.stack.unshift({ route: '', handle: handler });
          };
        },
      },
    ],
  },
});
