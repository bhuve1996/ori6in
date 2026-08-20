/** Soft-launch gate: NEXT_PUBLIC_COMING_SOON + optional ?comingSoon= cookie override */

export const COMING_SOON_COOKIE = 'ori6in_coming_soon';
export const COMING_SOON_PARAM = 'comingSoon';

export function comingSoonEnvEnabled() {
  return process.env.NEXT_PUBLIC_COMING_SOON === 'true';
}

/** Cookie `1` / `0` overrides env; missing cookie → env. */
export function resolveComingSoon(cookieValue: string | undefined | null) {
  if (cookieValue === '1') return true;
  if (cookieValue === '0') return false;
  return comingSoonEnvEnabled();
}

/** UI toggle. Default: on in non-production. */
export function comingSoonToggleVisible() {
  const flag = process.env.NEXT_PUBLIC_COMING_SOON_TOGGLE;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}
