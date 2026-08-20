import type { Metadata } from 'next';
import { ComingSoonView } from '../../components/ComingSoonView';
import { SITE_NAME } from '../../lib/site';

export const metadata: Metadata = {
  title: `Coming soon · ${SITE_NAME}`,
  description: 'Launching soon. Register to get notified when we open.',
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.svg?v=gold6', type: 'image/svg+xml' },
      { url: '/favicon-32.png?v=gold6', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png?v=gold6', sizes: '180x180', type: 'image/png' }],
  },
};

export default function ComingSoonPage() {
  return <ComingSoonView />;
}
