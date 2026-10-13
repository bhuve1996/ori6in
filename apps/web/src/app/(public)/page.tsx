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
            '@type': ['EducationalOrganization', 'Organization'],
            name: SITE_NAME,
            legalName: 'ORI6IN Education Private Limited',
            url: absoluteUrl('/'),
            description: SITE_DESCRIPTION,
            logo: {
              '@type': 'ImageObject',
              url: absoluteUrl('/brand/owl.png'),
              caption: 'ORI6IN Owl Mascot',
            },
            image: [
              absoluteUrl('/opengraph-image'),
              absoluteUrl('/brand/owl.png'),
              absoluteUrl('/brand/owl-mascot.png'),
            ],
            sameAs: [
              'https://www.instagram.com/ori6ineducation/',
              'https://www.linkedin.com/company/ori6in-education',
              'https://www.youtube.com/@ori6ineducation',
              'https://x.com/ori6ineducation',
            ],
            address: {
              '@type': 'PostalAddress',
              streetAddress: '1315, 25th Main Rd, Kottapalya, Jayanagara 9th Block',
              addressLocality: 'Bengaluru',
              addressRegion: 'Karnataka',
              postalCode: '560041',
              addressCountry: 'IN',
            },
            telephone: '+91 91130 88519',
            email: 'info@ori6ineducation.com',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: absoluteUrl('/'),
            description: SITE_DESCRIPTION,
            image: absoluteUrl('/opengraph-image'),
          },
        ]}
      />
      <PublicHome />
    </>
  );
}
