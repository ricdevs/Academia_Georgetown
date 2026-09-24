import type { APIRoute } from 'astro';
import { isSeoPreview } from '../lib/url';

export const GET: APIRoute = () => {
  const body = isSeoPreview()
    ? 'User-agent: *\nDisallow: /\n'
    : 'User-agent: *\nAllow: /\n\nSitemap: https://www.academiageorgetown.com/sitemap-index.xml\n';
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
