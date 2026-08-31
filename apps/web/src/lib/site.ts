/** Canonical site settings for SEO, sitemap, and social cards. */

export const SITE_NAME = 'ORI6IN';
export const SITE_TAGLINE = 'Dream. Apply. Fly.';
export const SITE_DESCRIPTION =
  'ORI6IN Education helps students study abroad — counselling, test prep, university applications, scholarships, visas, and pre-departure. Dream. Apply. Fly.';

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    'http://localhost:3000';
  const withProtocol = raw.startsWith('http') ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, '');
}

export function absoluteUrl(path = '/') {
  const base = getSiteUrl();
  if (!path || path === '/') return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
