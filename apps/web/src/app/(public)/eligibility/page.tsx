import { EligibilityView } from '../../../components/public/EligibilityView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Eligibility check',
  description: 'Six questions. A counsellor sends the full read.',
  path: '/eligibility',
});

export default function EligibilityPage() {
  return <EligibilityView />;
}
