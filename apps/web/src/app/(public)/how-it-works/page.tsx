import { HowItWorksView } from '../../../components/public/HowItWorksView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'How it works',
  description: 'Six steps. One counsellor. No guesswork — from a complimentary Discovery Session to admission.',
  path: '/how-it-works',
});

export default function HowItWorksPage() {
  return <HowItWorksView />;
}
