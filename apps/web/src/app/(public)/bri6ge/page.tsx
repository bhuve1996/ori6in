import { Bri6geView } from '../../../components/public/Bri6geView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'BRI6GE',
  description: 'BRI6GE — college-years programme for UG students in India targeting a master’s abroad.',
  path: '/bri6ge',
});

export default function Bri6gePage() {
  return <Bri6geView />;
}
