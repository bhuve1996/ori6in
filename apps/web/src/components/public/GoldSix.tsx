import type { ReactNode } from 'react';

const BRAND_NAMES = ['BRI6GE', 'ORI6IN', '6LOBAL', '6RANT', '6RAND', 'ED6E', '6RIP'] as const;

/** Gold upright 6 in brand names. Longer tokens first so BRI6GE is matched whole. */
export function goldSixNodes(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    let hit: { name: string; at: number } | null = null;
    for (const name of BRAND_NAMES) {
      const at = rest.indexOf(name);
      if (at === -1) continue;
      if (!hit || at < hit.at) hit = { name, at };
    }
    if (!hit) {
      nodes.push(rest);
      break;
    }
    if (hit.at > 0) nodes.push(rest.slice(0, hit.at));
    const [before, ...after] = hit.name.split('6');
    nodes.push(
      <span key={`g${key++}`}>
        {before}
        <span className="brand__six">6</span>
        {after.join('6')}
      </span>,
    );
    rest = rest.slice(hit.at + hit.name.length);
  }
  return nodes;
}

export function Kicker({ children }: { children: string }) {
  return <p className="type-kicker">{goldSixNodes(children)}</p>;
}
