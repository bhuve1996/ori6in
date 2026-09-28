import { DestinationsView } from '../../../components/public/DestinationsView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Destinations',
  description: 'Eight study-abroad countries with current post-study work rules and tests.',
  path: '/destinations',
});

export default function DestinationsPage() {
  return <DestinationsView />;
}
