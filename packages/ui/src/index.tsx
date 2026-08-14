import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Button({
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      style={{
        padding: '0.6rem 1rem',
        borderRadius: 6,
        border: '1px solid #1a1a1a',
        background: '#1a1a1a',
        color: '#fff',
        cursor: 'pointer',
        ...((props.style as object) ?? {}),
      }}
    >
      {children}
    </button>
  );
}

export function PageShell({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', marginBottom: '1rem' }}>{title}</h1>
      {children}
    </main>
  );
}
