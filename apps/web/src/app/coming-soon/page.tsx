import type { Metadata } from 'next';
import { ComingSoonView } from '../../components/ComingSoonView';
import { SITE_NAME } from '../../lib/site';

export const metadata: Metadata = {
  title: `Coming soon · ${SITE_NAME}`,
  description: 'Launching soon. Register to get notified when we open.',
  robots: { index: true, follow: true },
};

export default function ComingSoonPage() {
  return <ComingSoonView />;
}
