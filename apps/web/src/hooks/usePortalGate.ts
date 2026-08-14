'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  clearSession,
  fetchMe,
  getToken,
  portalPathForRole,
  type AuthUser,
} from '../lib/auth';
import { loginUrlFor } from '../lib/routes';

/**
 * Gate a portal section: anonymous → login?next=, wrong role → their hub (keep session).
 */
export function usePortalGate(allowedRoles: string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const rolesKey = allowedRoles.join(',');

  useEffect(() => {
    let cancelled = false;
    const nextLogin = loginUrlFor(pathname);
    const roles = rolesKey.split(',').filter(Boolean);

    if (!getToken()) {
      router.replace(nextLogin);
      return;
    }

    void (async () => {
      const me = await fetchMe();
      if (cancelled) return;
      if (!me) {
        clearSession();
        router.replace(nextLogin);
        return;
      }
      if (!roles.includes(me.role)) {
        router.replace(portalPathForRole(me.role));
        return;
      }
      setUser(me);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, pathname, rolesKey]);

  return { user, ready };
}
