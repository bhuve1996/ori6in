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
    pathname === '/favicon.svg' ||
    pathname === '/favicon.ico' ||
    pathname === '/apple-icon' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.(?:png|jpe?g|gif|svg|webp|ico|mp4|webm|woff2?|ttf|txt|xml)$/i.test(pathname)
  );
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

  if (isPassthrough(pathname)) {
    return NextResponse.next();
  }

  const active = resolveComingSoon(request.cookies.get(COMING_SOON_COOKIE)?.value);

  if (active && pathname !== '/coming-soon') {
    const url = request.nextUrl.clone();
    url.pathname = '/coming-soon';
    url.search = '';
    return NextResponse.rewrite(url);
  }

  if (!active && pathname === '/coming-soon') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
