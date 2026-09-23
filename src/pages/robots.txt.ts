import type { APIRoute } from 'astro';
import { isPagesPreview } from '../lib/url';

export const GET: APIRoute = () => {
  const body = isPagesPreview()
    ? 'User-agent: *\nDisallow: /\n'
    : 'User-agent: *\nAllow: /\n\nSitemap: https://www.academiageorgetown.com/sitemap-index.xml\n';
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
