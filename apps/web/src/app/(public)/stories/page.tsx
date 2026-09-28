import { StoriesView } from '../../../components/public/StoriesView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Success stories',
  description: 'Verified admits and family testimonials.',
  path: '/stories',
});

export default function StoriesPage() {
  return <StoriesView />;
}
