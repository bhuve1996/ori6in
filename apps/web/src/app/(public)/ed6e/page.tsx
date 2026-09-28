import { Ed6eView } from '../../../components/public/Ed6eView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'ED6E',
  description: 'ED6E by ORI6IN — profile building for Class 8–12. Excellence, Direction, Growth, Exposure.',
  path: '/ed6e',
});

export default function Ed6ePage() {
  return <Ed6eView />;
}
