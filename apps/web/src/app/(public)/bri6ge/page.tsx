import { Bri6geView } from '../../../components/public/Bri6geView';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'BRID6E',
  description: 'BRID6E — college-years programme for UG students in India targeting a master’s abroad.',
  path: '/bri6ge',
});

export default function Bri6gePage() {
  return <Bri6geView />;
}
