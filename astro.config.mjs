// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';

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

const githubPages = process.env.GITHUB_PAGES === 'true';
const githubRepo = process.env.GITHUB_REPOSITORY || 'ricdevs/Academia_Georgetown';
const [githubOwner, githubName] = githubRepo.split('/');

export default defineConfig({
  site: githubPages ? `https://${githubOwner}.github.io` : 'https://www.academiageorgetown.com',
  base: githubPages ? `/${githubName}/` : '/',
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
      // #region agent log
      {
        name: 'agent-debug-log',
        configureServer(server) {
          server.middlewares.use('/__agent_debug_log', (req, res, next) => {
            if (req.method !== 'POST') return next();
            const chunks = [];
            req.on('data', (c) => chunks.push(c));
            req.on('end', () => {
              try {
                const raw = Buffer.concat(chunks).toString('utf8');
                const parsed = JSON.parse(raw);
                const lines = Array.isArray(parsed) ? parsed : [parsed];
                for (const line of lines) {
                  fs.appendFileSync('/opt/cursor/logs/debug.log', JSON.stringify(line) + '\n');
                }
              } catch {}
              res.statusCode = 204;
              res.end();
            });
          });
        },
      },
      // #endregion
    ],
  },
});
