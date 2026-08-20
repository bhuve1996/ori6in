import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Source_Sans_3 } from 'next/font/google';
import { headers } from 'next/headers';
import { AppProviders } from '../components/AppProviders';
import { ComingSoonToggle } from '../components/ComingSoonToggle';
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

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f3ec' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0c' },
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
    'mentorship',
    'internships',
    'career programs',
    'student learning',
    'education platform',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/brand/owl-icon.png', sizes: '256x256', type: 'image/png' },
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
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
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
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
              <SiteHeader />
              <div className="site-shell__content">{children}</div>
              <SiteFooter />
              {showPreviewToggle ? <ComingSoonToggle floating /> : null}
            </div>
          )}
        </AppProviders>
      </body>
    </html>
  );
}
