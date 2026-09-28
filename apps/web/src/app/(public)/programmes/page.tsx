import { ProgrammesView } from '../../../components/public/ProgrammesView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Programmes',
  description: 'ED6E, BRI6GE, 6LOBAL and 6RIP — quoted per family, never listed as public fees.',
  path: '/programmes',
});

export default function ProgrammesPage() {
  return <ProgrammesView />;
}
