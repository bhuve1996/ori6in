import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { AppProviders } from '../components/AppProviders';
import { ComingSoonToggle } from '../components/ComingSoonToggle';
import { LeadProvider } from '../components/leads/LeadContext';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { comingSoonEnvEnabled, comingSoonToggleVisible } from '../lib/coming-soon';
import { isComingSoonActive } from '../lib/coming-soon-server';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  getSiteUrl,
} from '../lib/site';
import './globals.css';

const ori6inDisplay = localFont({
  src: [
    { path: '../fonts/ORI6INDisplay-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ORI6INDisplay-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/ORI6INDisplay-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-brand',
  display: 'swap',
  fallback: ['Cinzel', 'Georgia', 'serif'],
});

const ori6inSans = localFont({
  src: [
    { path: '../fonts/ORI6INSans-Light.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/ORI6INSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ORI6INSans-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/ORI6INSans-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/ORI6INSans-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['Outfit', 'system-ui', 'sans-serif'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F0E8' },
    { media: '(prefers-color-scheme: dark)', color: '#17304D' },
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  keywords: [
    'ORI6IN',
    'ORI6IN Education',
    'ED6E',
    'BRI6GE',
    '6LOBAL',
    '6RIP',
    'study abroad',
    'IELTS',
    'Bengaluru',
  ],
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: absoluteUrl('/'),
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl('/opengraph-image'),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Owl Mascot — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl('/opengraph-image')],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    // PNG/ICO first — Cursor’s embedded Chromium often skips SVG tab icons.
    icon: [
      { url: '/favicon-32.png?v=gold6b', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico?v=gold6b', sizes: '48x48' },
      { url: '/favicon.svg?v=gold6b', type: 'image/svg+xml' },
    ],
    shortcut: [{ url: '/favicon-32.png?v=gold6b', type: 'image/png' }],
    apple: [
      { url: '/apple-touch-icon.png?v=gold6b', sizes: '180x180', type: 'image/png' },
    ],
  },
  category: 'education',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const softLaunchHeader = headerStore.get('x-ori6in-soft-launch') === '1';
  const comingSoon = softLaunchHeader || (await isComingSoonActive());
  const showPreviewToggle =
    !comingSoon && comingSoonEnvEnabled() && comingSoonToggleVisible();

  return (
    <html lang="en" className={`${ori6inDisplay.variable} ${ori6inSans.variable}`} suppressHydrationWarning>
      <body className={comingSoon ? 'is-coming-soon' : undefined} suppressHydrationWarning>
        {!comingSoon ? (
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
        ) : null}
        <AppProviders softLaunch={comingSoon}>
          {comingSoon ? (
            children
          ) : (
            <div className="site-shell">
              <LeadProvider>
                <SiteHeader />
                <div className="site-shell__content">{children}</div>
                <SiteFooter />
              </LeadProvider>
            </div>
          )}
        </AppProviders>
      </body>
    </html>
  );
}
