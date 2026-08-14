/** Canonical site settings for SEO, sitemap, and social cards. */

export const SITE_NAME = 'ORI6IN';
export const SITE_TAGLINE = 'Everything starts here.';
export const SITE_DESCRIPTION =
  'Learn with mentors, build real work, and step into internships. ORI6IN connects programs, mentorship, and career pathways — everything starts here.';

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
