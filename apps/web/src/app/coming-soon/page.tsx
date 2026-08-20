import type { Metadata } from 'next';
import { ComingSoonView } from '../../components/ComingSoonView';
import { SITE_NAME } from '../../lib/site';

export const metadata: Metadata = {
  title: `Coming soon · ${SITE_NAME}`,
  description: 'ORI6IN is launching soon. Register to get notified when we open.',
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return <ComingSoonView />;
}
