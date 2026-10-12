import type { ReactNode } from 'react';

const PATH_RE = /(^|[\s(])(\/[a-z0-9][a-z0-9/-]*)/g;

/** Turns site paths written in copy (e.g. "/contact") into links. */
export function linkifyPaths(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(PATH_RE)) {
    const start = (m.index ?? 0) + m[1].length;
    const path = m[2].replace(/[/-]+$/, '');
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <a key={`${start}-${path}`} href={path}>
        {path}
      </a>,
    );
    last = start + path.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
