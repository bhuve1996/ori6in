import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from './cn';

type Props = PropsWithChildren<{
  title?: string;
  lead?: ReactNode;
  wide?: boolean;
  className?: string;
}>;

/** Uses shared `@utility page` / `page-after-banner` / `page-wide` from web styles. */
export function PageShell({ title, lead, wide, className, children }: Props) {
  return (
    <main
      id="main-content"
      className={cn('page page-after-banner', wide && 'page-wide', className)}
      tabIndex={-1}
    >
      {title ? <h1>{title}</h1> : null}
      {lead ? <p className="type-lead mb-5">{lead}</p> : null}
      {children}
    </main>
  );
}
