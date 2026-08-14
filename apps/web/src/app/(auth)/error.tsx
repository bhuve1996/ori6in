'use client';

import { ErrorFallback } from '../../components/ErrorFallback';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback error={error} reset={reset} title="Sign-in hit a snag" homeHref="/login" />;
}
