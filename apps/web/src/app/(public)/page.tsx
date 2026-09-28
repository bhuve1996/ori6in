import type { Metadata } from 'next';
import { JsonLd } from '../../components/JsonLd';
import { PublicHome } from '../../components/public/PublicHome';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, absoluteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: absoluteUrl('/'),
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: absoluteUrl('/'),
            description: SITE_DESCRIPTION,
            logo: absoluteUrl('/icon'),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: absoluteUrl('/'),
            description: SITE_DESCRIPTION,
          },
        ]}
      />
      <PublicHome />
    </>
  );
}
