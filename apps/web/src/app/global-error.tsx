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
          background: '#f7f3ec',
          color: '#0c0c0c',
        }}
      >
        <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <p style={{ letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8b6240' }}>
            ORI6IN
          </p>
          <h1 style={{ fontSize: '1.75rem', margin: '0.5rem 0 0.75rem' }}>Something went wrong</h1>
          <p style={{ color: '#3d3832', lineHeight: 1.5 }}>
            A critical error stopped this page from rendering. Retry, or refresh the browser.
          </p>
          {error.digest ? (
            <p style={{ color: '#6e655a', fontSize: '0.9rem' }}>Ref: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.95rem',
              border: '1px solid #c2a772',
              background: '#c2a772',
              color: '#0c0c0c',
              fontWeight: 650,
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
