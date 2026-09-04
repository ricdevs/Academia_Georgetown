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
          server.middlewares.use('/api/submit', (req, res, next) => {
            if (req.method !== 'POST') return next();
            const chunks = [];
            req.on('data', (c) => chunks.push(c));
            req.on('end', () => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, dev: true }));
            });
          });
        },
      },
    ],
  },
});
