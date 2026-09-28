import { StudyAbroadView } from '../../../components/public/StudyAbroadView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: '6LOBAL — Study Abroad',
  description: '6LOBAL by Edumillenia — UG, Master’s, MBA and PhD counselling with one counsellor.',
  path: '/study-abroad',
});

export default function StudyAbroadPage() {
  return <StudyAbroadView />;
}
