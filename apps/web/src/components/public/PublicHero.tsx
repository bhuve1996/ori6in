import type { ReactNode } from 'react';
import { goldSixNodes, Kicker } from './GoldSix';

export function PublicHero({
  kicker,
  title,
  lead,
  image,
  children,
}: {
  kicker: string;
  title: string;
  lead: string;
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="pub-hero">
      <div className="pub-hero__copy">
        <Kicker>{kicker}</Kicker>
        <h1 className="type-display-lg">{goldSixNodes(title)}</h1>
        <p className="type-lead">{goldSixNodes(lead)}</p>
        {children}
      </div>
      <div className="pub-hero__media">
        <img src={image} alt="" />
      </div>
    </section>
  );
}
