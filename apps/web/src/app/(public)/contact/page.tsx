import { ContactView } from '../../../components/public/ContactView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Contact',
  description: 'One line, one inbox — call, WhatsApp, or write to ORI6IN Education.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactView />;
}
