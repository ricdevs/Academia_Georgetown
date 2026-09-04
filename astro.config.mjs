// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
};
for (const path of legacyHome) {
  redirects[path] = '/';
}

export default defineConfig({
  site: 'https://www.academiageorgetown.com',
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap()],
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
