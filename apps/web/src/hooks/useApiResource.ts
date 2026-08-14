'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../lib/auth';
import { useToast } from '../components/Toast';

type Options = {
  /** Shown in toast + error state when the request fails. */
  errorMessage?: string;
  /** Skip fetch when false (default true). */
  enabled?: boolean;
  /** When true, failures set error state but do not toast. */
  silent?: boolean;
};

/**
 * Load a JSON API resource once (and on reload).
 * Toast on failure (unless silent); returns loading / error / data.
 */
export function useApiResource<T>(path: string, options: Options = {}) {
  const toast = useToast();
  const { errorMessage = 'Failed to load', enabled = true, silent = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(enabled);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void (async () => {
      const { ok, data: payload } = await apiFetch<T>(path);
      if (cancelled) return;
      if (!ok) {
        setError(errorMessage);
        if (!silent) toast.error(errorMessage);
        setLoading(false);
        return;
      }
      setData(payload);
      setError('');
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [path, enabled, errorMessage, silent, nonce, toast]);

  return { data, error, loading, reload };
}
