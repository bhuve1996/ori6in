import { NextResponse, type NextRequest } from 'next/server';
import {
  COMING_SOON_COOKIE,
  COMING_SOON_PARAM,
  resolveComingSoon,
} from './lib/coming-soon';
import { DEPLOY_COOKIE, getDeployId } from './lib/deploy';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days
const DEPLOY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function isPassthrough(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/favicon.ico' ||
    pathname === '/favicon.svg' ||
    // Next.js metadata routes (no file extension — must not hit coming-soon redirect)
    pathname === '/icon' ||
    pathname.startsWith('/icon/') ||
    pathname === '/apple-icon' ||
    pathname.startsWith('/apple-icon/') ||
    pathname === '/opengraph-image' ||
    pathname.startsWith('/opengraph-image/') ||
    pathname === '/twitter-image' ||
    pathname.startsWith('/twitter-image/') ||
    /\.(?:png|jpe?g|gif|svg|webp|ico|mp4|webm|woff2?|ttf|txt|xml)$/i.test(pathname)
  );
}

function applyDeployReset(res: NextResponse, request: NextRequest, deployId: string) {
  const seen = request.cookies.get(DEPLOY_COOKIE)?.value;
  if (!deployId || deployId === 'dev') return res;

  if (seen === deployId) return res;

  // New deploy — drop soft-launch override so env flag wins again.
  res.cookies.delete(COMING_SOON_COOKIE);
  res.cookies.set(DEPLOY_COOKIE, deployId, {
    path: '/',
    maxAge: DEPLOY_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });

  // Ask the browser to drop HTTP cache for this origin (storage cleared client-side).
  if (seen) {
    res.headers.set('Clear-Site-Data', '"cache"');
  }

  return res;
}

function nextWithSoftLaunch(request: NextRequest, active: boolean) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-ori6in-soft-launch', active ? '1' : '0');
  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  // Avoid sticky HTML for soft-launch / redirects.
  res.headers.set('Cache-Control', 'no-store, must-revalidate');
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const param = searchParams.get(COMING_SOON_PARAM);
  const deployId = getDeployId();

  if (param === '1' || param === '0' || param === 'clear') {
    const url = request.nextUrl.clone();
    url.searchParams.delete(COMING_SOON_PARAM);
    const res = NextResponse.redirect(url);

    if (param === 'clear') {
      res.cookies.delete(COMING_SOON_COOKIE);
    } else {
      res.cookies.set(COMING_SOON_COOKIE, param, {
        path: '/',
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax',
      });
    }
    res.headers.set('Cache-Control', 'no-store, must-revalidate');
    return applyDeployReset(res, request, deployId);
  }

  const active = resolveComingSoon(request.cookies.get(COMING_SOON_COOKIE)?.value);

  if (isPassthrough(pathname)) {
    const res = nextWithSoftLaunch(request, active);
    // Don't Clear-Site-Data on asset requests — only document navigations below.
    return res;
  }

  if (active && pathname !== '/coming-soon') {
    const url = request.nextUrl.clone();
    url.pathname = '/coming-soon';
    url.search = '';
    const res = NextResponse.redirect(url);
    res.headers.set('Cache-Control', 'no-store, must-revalidate');
    return applyDeployReset(res, request, deployId);
  }

  if (!active && pathname === '/coming-soon') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    const res = NextResponse.redirect(url);
    res.headers.set('Cache-Control', 'no-store, must-revalidate');
    return applyDeployReset(res, request, deployId);
  }

  return applyDeployReset(nextWithSoftLaunch(request, active), request, deployId);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
