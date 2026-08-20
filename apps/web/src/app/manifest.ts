import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '../lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f3ec',
    theme_color: '#0c0c0c',
    icons: [
      {
        src: '/favicon.svg?v=gold6',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon-32.png?v=gold6',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png?v=gold6',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
