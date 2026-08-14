import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

/**
 * Structural card shell. Visual chrome comes from product CSS
 * (e.g. `.mkt-program-card`, `.home-program-card`) via `className`.
 */
type CardProps = {
  href?: string;
  as?: 'div' | 'figure';
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>;

export function Card({ href, as = 'div', className, children, ...rest }: CardProps) {
  if (href) {
    const { style, ...linkRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={cn('group', className)} style={style} {...linkRest}>
        {children}
      </a>
    );
  }

  const Tag = as;
  return (
    <Tag className={cn(Tag === 'figure' && 'm-0', className)} {...rest}>
      {children}
    </Tag>
  );
}

export function CardMedia({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  as: Tag = 'h2',
  className,
  children,
  ...props
}: {
  as?: 'h2' | 'h3';
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Tag className={cn(className)} {...props}>
      {children}
    </Tag>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
