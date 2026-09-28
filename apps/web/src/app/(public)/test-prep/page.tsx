import { TestPrepView } from '../../../components/public/TestPrepView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: '6RIP — Test Preparation',
  description: 'IELTS, TOEFL, GRE, GMAT Focus, SAT, German and dMAT — small-batch and one-to-one.',
  path: '/test-prep',
});

export default function TestPrepPage() {
  return <TestPrepView />;
}
