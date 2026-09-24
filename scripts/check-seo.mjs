import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const SITE = 'https://www.academiageorgetown.com';

function decode(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function meta(html, name) {
  const a = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i'));
  const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, 'i'));
  return decode((a || b)?.[1] || '');
}

function prop(html, property) {
  const a = html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`, 'i'));
  return decode(a?.[1] || '');
}

function tag(html, name) {
  const m = html.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return decode((m?.[1] || '').replace(/<[^>]+>/g, '').trim());
}

function canonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return m?.[1] || '';
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_astro' || entry.name === 'images') continue;
      files.push(...(await walk(full)));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function routeFromFile(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  if (rel === '404.html') return '/404/';
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/index\.html$/, '')}`;
}

const errors = [];
const files = await walk(DIST);
const titles = new Map();
const descriptions = new Map();
const indexable = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = routeFromFile(file);
  const robots = meta(html, 'robots').toLowerCase();
  const title = tag(html, 'title');
  const description = meta(html, 'description');
  const canon = canonical(html);
  const noindex = robots.includes('noindex');

  if (route === '/404/' && !noindex) errors.push('404 is missing noindex');
  if (noindex) continue;
  if (!title) errors.push(`${route} missing title`);
  if (!description) errors.push(`${route} missing description`);
  if (!canon) errors.push(`${route} missing canonical`);
  if (canon && !canon.startsWith(SITE) && !canon.includes('github.io')) {
    errors.push(`${route} canonical is not the production host: ${canon}`);
  }
  if (!html.includes('application/ld+json')) errors.push(`${route} missing JSON-LD`);
  if (!prop(html, 'og:image:alt')) errors.push(`${route} missing og:image:alt`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const block of blocks) {
    try {
      JSON.parse(block[1]);
    } catch {
      errors.push(`${route} has invalid JSON-LD`);
    }
  }
  indexable.push({ route, title, description, html });
  if (titles.has(title)) errors.push(`duplicate title "${title}" on ${titles.get(title)} and ${route}`);
  else titles.set(title, route);
  if (descriptions.has(description)) {
    errors.push(`duplicate description on ${descriptions.get(description)} and ${route}`);
  } else descriptions.set(description, route);
}

const money = [
  '/',
  '/academia-de-ingles-en-pamplona/',
  '/curso-de-ingles-en-pamplona/',
  '/certificado-de-ingles-en-pamplona/',
  '/b2-first-certificate/',
  '/toefl-ibt/',
  '/ingles-para-estudiantes/',
  '/prueba-de-nivel/',
  '/contacto/',
];
const indexableRoutes = new Set(indexable.map((item) => item.route));
for (const route of money) {
  if (!indexableRoutes.has(route)) errors.push(`money URL is not indexable: ${route}`);
}

const home = indexable.find((item) => item.route === '/');
if (home && !home.html.includes('LanguageSchool')) errors.push('home JSON-LD missing LanguageSchool');
if (home && !home.html.includes('academiageorgetown')) errors.push('home JSON-LD missing Instagram sameAs');
if (home && !home.html.includes('ItemList')) errors.push('home JSON-LD missing ItemList');

const landingIntros = [];
for (const route of [
  '/academia-de-ingles-en-pamplona/',
  '/curso-de-ingles-en-pamplona/',
  '/certificado-de-ingles-en-pamplona/',
  '/sacarse-el-b1-de-ingles-en-pamplona/',
  '/sacarse-el-b2-de-ingles-en-pamplona/',
  '/sacarse-el-c1-de-ingles-en-pamplona/',
]) {
  const page = indexable.find((item) => item.route === route);
  const intro = page?.html.match(/<article[^>]*>[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/)?.[1] || '';
  const text = intro.replace(/<[^>]+>/g, '').trim();
  if (!text) errors.push(`${route} missing unique intro`);
  if (landingIntros.includes(text)) errors.push(`${route} reuses another landing intro`);
  landingIntros.push(text);
  if (/cambridge\.org|ets\.org|britishcouncil|ielts\.org|toefl\.org/i.test(page?.html || '')) {
    errors.push(`${route} links to an official exam site`);
  }
}

const faqPages = ['/', '/ingles-para-estudiantes/', '/ingles-profesional/', '/ingles-para-jovenes/'];
for (const route of faqPages) {
  const page = indexable.find((item) => item.route === route);
  if (page && !page.html.includes('FAQPage')) errors.push(`${route} missing FAQPage schema`);
}

const coursePages = ['/b2-first-certificate/', '/c1-advanced/', '/toefl-ibt/', '/aptis-general/'];
for (const route of coursePages) {
  const page = indexable.find((item) => item.route === route);
  if (page && !page.html.includes('"@type":"Course"') && !page.html.includes('"@type": "Course"')) {
    errors.push(`${route} missing Course schema`);
  }
}

let sitemap = '';
try {
  sitemap = await readFile(path.join(DIST, 'sitemap-0.xml'), 'utf8');
} catch {
  try {
    sitemap = await readFile(path.join(DIST, 'sitemap-index.xml'), 'utf8');
  } catch {
    errors.push('sitemap is missing from dist');
  }
}
if (sitemap.includes('/flyer-law/') || sitemap.includes('/flyer-medicine/')) {
  errors.push('sitemap includes noindex specialty flyers');
}
if (sitemap.includes('/formulario-subvencionados/')) {
  errors.push('sitemap includes formulario-subvencionados');
}
if (!sitemap.includes('/curso-de-ingles-en-pamplona/') && sitemap.includes('<url>')) {
  errors.push('sitemap is missing curso-de-ingles-en-pamplona');
}

const banned = [/637\s*81\s*21\s*63/i, /\bPASS\b/, /Zoom-only/i, /clases por zoom/i];
for (const page of indexable) {
  for (const pattern of banned) {
    if (pattern.test(page.html)) errors.push(`${page.route} still contains ${pattern}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`SEO gate ok. ${indexable.length} indexable pages, ${files.length} HTML files.`);
