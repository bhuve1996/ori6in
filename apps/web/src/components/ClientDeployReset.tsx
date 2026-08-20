'use client';

import { useEffect } from 'react';
import {
  APP_COOKIES_TO_CLEAR,
  DEPLOY_STORAGE_KEY,
  getDeployId,
} from '../lib/deploy';

function clearAppCookies() {
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
  for (const name of APP_COOKIES_TO_CLEAR) {
    document.cookie = `${name}=; Path=/; Expires=${expires}; SameSite=Lax`;
    document.cookie = `${name}=; Path=/; Expires=${expires}; Max-Age=0; SameSite=Lax`;
  }
}

/**
 * After each deploy, wipe stale cookies / storage once so soft-launch
 * overrides and cached client state don't stick around.
 */
export function ClientDeployReset() {
  useEffect(() => {
    const deployId = getDeployId();
    if (!deployId || deployId === 'dev') return;

    let previous: string | null = null;
    try {
      previous = localStorage.getItem(DEPLOY_STORAGE_KEY);
    } catch {
      previous = null;
    }

    if (previous === deployId) return;

    // First visit on this browser for this build — just stamp and continue.
    if (!previous) {
      try {
        localStorage.setItem(DEPLOY_STORAGE_KEY, deployId);
      } catch {
        /* private mode */
      }
      return;
    }

    // Deploy changed since last visit — clear client state and reload once.
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
    clearAppCookies();

    try {
      localStorage.setItem(DEPLOY_STORAGE_KEY, deployId);
      sessionStorage.setItem('ori6in_deploy_reset', '1');
    } catch {
      /* ignore */
    }

    // Hard navigation so HTML/CSS aren't served from a stale bfcache entry.
    window.location.replace(window.location.pathname + window.location.search);
  }, []);

  return null;
}
