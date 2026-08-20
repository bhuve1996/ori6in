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
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon-48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/brand/owl-icon.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  };
}
