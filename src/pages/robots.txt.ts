import type { APIRoute } from 'astro';

/**
 * Generated instead of a static file so the sitemap URL carries the Astro
 * base: the dev environment is served from /_dev/ and its robots.txt must not
 * point at the production sitemap.
 */
export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL, site ?? 'http://localhost');
  const sitemap = new URL('sitemap-index.xml', base).href;

  const body = `User-agent: *
Allow: /

# Draft project pages are noindex and are excluded from the sitemap.

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
