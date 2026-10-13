'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100svh',
          display: 'grid',
          placeItems: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          background: '#F4F0E8',
          color: '#17304D',
        }}
      >
        <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <p style={{ letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A361', fontWeight: 700 }}>
            ORI6IN EDUCATION
          </p>
          <h1 style={{ fontSize: '1.85rem', margin: '0.5rem 0 0.75rem', color: '#17304D' }}>Something went wrong</h1>
          <p style={{ color: '#5A554C', lineHeight: 1.6 }}>
            A critical error stopped this page from rendering. Retry, or refresh the browser.
          </p>
          {error.digest ? (
            <p style={{ color: '#888080', fontSize: '0.9rem' }}>Ref: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1.45rem',
              borderRadius: '0.95rem',
              border: '1px solid #17304D',
              background: '#17304D',
              color: '#FFFFFF',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
