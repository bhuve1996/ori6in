'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { AuthUser } from '../lib/auth';
import { usePortalGate } from './usePortalGate';

const PortalUserContext = createContext<AuthUser | null>(null);

/** Wraps a portal segment: gates access and exposes the signed-in user. */
export function PortalAuthProvider({
  roles,
  children,
}: {
  roles: string[];
  children: ReactNode;
}) {
  const { user, ready } = usePortalGate(roles);

  if (!ready || !user) {
    return (
      <main className="page">
        <p className="meta">Checking access…</p>
      </main>
    );
  }

  return <PortalUserContext.Provider value={user}>{children}</PortalUserContext.Provider>;
}

export function usePortalUser(): AuthUser {
  const user = useContext(PortalUserContext);
  if (!user) {
    throw new Error('usePortalUser must be used inside PortalAuthProvider');
  }
  return user;
}
