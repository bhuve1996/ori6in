'use client';

import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  homeHref?: string;
};

/**
 * Keep this dependency-light. Error boundaries must still render if Motion /
 * design-system chunks fail to load during HMR.
 */
export function ErrorFallback({
  error,
  reset,
  title = 'Something went wrong',
  homeHref = '/',
}: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="page error-fallback" tabIndex={-1}>
      <p className="error-fallback__kicker">Error</p>
      <h1 className="error-fallback__title">{title}</h1>
      <p className="error-fallback__lead">
        The page hit an unexpected problem. You can retry, or head back and continue from somewhere
        stable.
      </p>
      {error.digest ? <p className="meta">Ref: {error.digest}</p> : null}
      <div className="cta-row">
        <button type="button" className="btn btn-accent" onClick={reset}>
          Try again
        </button>
        <a className="btn btn-secondary" href={homeHref}>
          Back home
        </a>
      </div>
    </main>
  );
}
