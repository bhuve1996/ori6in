'use client';

import { ErrorFallback } from './ErrorFallback';

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="This portal view failed"
      homeHref="/demo-login"
    />
  );
}
