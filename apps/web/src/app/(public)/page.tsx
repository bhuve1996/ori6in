import type { Metadata } from 'next';
import { publicFetch, type Program } from '../../lib/api';
import { HomeExperience } from '../../components/home/HomeExperience';
import type { HomeMentor } from '../../components/home/HomeMentors';
import { JsonLd } from '../../components/JsonLd';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
} from '../../lib/site';

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

export default async function HomePage() {
  const [programs, mentors] = await Promise.all([
    publicFetch<Program[]>('/programs'),
    publicFetch<HomeMentor[]>('/mentors'),
  ]);

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
      <HomeExperience programs={programs ?? []} mentors={mentors ?? []} />
    </>
  );
}
