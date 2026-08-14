'use client';

import { useCallback, useState } from 'react';

type Runner = () => Promise<void>;

/**
 * Shared busy/error wrapper for portal form actions and mutations.
 */
export function useAsyncAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(async (fn: Runner) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return { busy, error, setError, clearError, run };
}
