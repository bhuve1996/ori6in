import { COMPANY, SITE_PUBLIC_DESCRIPTION, SITE_PUBLIC_NAME } from '@ori6in/shared';

/** Canonical site settings for SEO, sitemap, and social cards. */

export const SITE_NAME = SITE_PUBLIC_NAME;
export const SITE_TAGLINE = COMPANY.tagline;
export const SITE_DESCRIPTION = SITE_PUBLIC_DESCRIPTION;
export const SITE_LEGAL_NAME = COMPANY.legalName;
export const SITE_PHONE = COMPANY.phoneDisplay;
export const SITE_EMAIL = COMPANY.email;

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
