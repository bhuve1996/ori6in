import type { ReactNode } from 'react';
import { PublicHero } from './PublicHero';

export function PublicToolFrame({
  title,
  lead,
  image,
  children,
}: {
  title: string;
  lead: string;
  image: string;
  children: ReactNode;
}) {
  return (
    <main id="main-content" className="pub">
      <PublicHero kicker="Tools" title={title} lead={lead} image={image} />
      <section className="pub-section">
        <p className="tools-back">
          <a href="/tools">← All tools</a>
        </p>
        {children}
      </section>
    </main>
  );
}
