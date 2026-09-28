import type { ReactNode } from 'react';
import { BANNERS } from '../../lib/media';
import { PublicHero } from './PublicHero';

export function AuthFrame({
  kicker = 'Accounts',
  title,
  lead,
  children,
}: {
  kicker?: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <main id="main-content" className="pub">
      <PublicHero kicker={kicker} title={title} lead={lead} image={BANNERS.auth} />
      <section className="pub-section pub-auth">{children}</section>
    </main>
  );
}
