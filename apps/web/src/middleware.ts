import { NextResponse, type NextRequest } from 'next/server';
import {
  COMING_SOON_COOKIE,
  COMING_SOON_PARAM,
  resolveComingSoon,
} from './lib/coming-soon';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

function isPassthrough(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.(?:png|jpe?g|gif|svg|webp|ico|mp4|webm|woff2?|ttf|txt|xml)$/i.test(pathname)
  );
}

function nextWithSoftLaunch(request: NextRequest, active: boolean) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-ori6in-soft-launch', active ? '1' : '0');
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const param = searchParams.get(COMING_SOON_PARAM);

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
    return res;
  }

  const active = resolveComingSoon(request.cookies.get(COMING_SOON_COOKIE)?.value);

  if (isPassthrough(pathname)) {
    return nextWithSoftLaunch(request, active);
  }

  if (active && pathname !== '/coming-soon') {
    const url = request.nextUrl.clone();
    url.pathname = '/coming-soon';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (!active && pathname === '/coming-soon') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return nextWithSoftLaunch(request, active);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
