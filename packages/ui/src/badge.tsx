import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function Badge({ className, children, ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-ink/12 bg-[color-mix(in_srgb,var(--theme-b)_40%,#fff)] px-2 py-[0.22rem] text-[0.75rem] font-semibold text-ink-soft',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
