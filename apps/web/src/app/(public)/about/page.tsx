import { AboutView } from '../../../components/public/AboutView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'About',
  description: 'ORI6IN Education Private Limited — Bengaluru. Everything starts here.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutView />;
}
