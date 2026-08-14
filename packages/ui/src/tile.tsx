import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

export function TileMeta({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p className={cn('tile-meta', className)} {...props}>
      {children}
    </p>
  );
}

export function TileSub({
  className,
  children,
  lines = 3,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode; lines?: 2 | 3 }) {
  return (
    <p className={cn('tile-sub', lines === 2 && 'tile-sub--2', className)} {...props}>
      {children}
    </p>
  );
}

export function TileCta({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <span className={cn('tile-cta', className)} {...props}>
      {children}
    </span>
  );
}
