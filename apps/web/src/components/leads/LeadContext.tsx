'use client';

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { LeadKind } from '@ori6in/shared';
import { FloatingDiscoveryPill } from './FloatingDiscoveryPill';
import { LeadModal } from './LeadModal';

export type LeadOpenOpts = {
  kind: LeadKind;
  programmeId?: string;
  programmeLabel?: string;
  interest?: string;
};

type LeadContextValue = {
  openLead: (opts: LeadOpenOpts) => void;
  closeLead: () => void;
};

const LEAD_KINDS = new Set<LeadKind>(['discovery', 'brochure', 'quote', 'contact', 'eligibility']);

const LeadContext = createContext<LeadContextValue | null>(null);

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) {
    throw new Error('useLead must be used within LeadProvider');
  }
  return ctx;
}

function LeadQueryOpener() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openLead } = useLead();

  useEffect(() => {
    const raw = params.get('lead');
    if (!raw || !LEAD_KINDS.has(raw as LeadKind)) return;
    const programme = params.get('programme') ?? params.get('program') ?? undefined;
    openLead({ kind: raw as LeadKind, programmeId: programme ?? undefined });
    const next = new URLSearchParams(params.toString());
    next.delete('lead');
    next.delete('programme');
    next.delete('program');
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [params, openLead, pathname, router]);

  return null;
}

export function LeadProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<LeadOpenOpts>({ kind: 'discovery' });

  const openLead = useCallback((next: LeadOpenOpts) => {
    setOpts(next);
    setOpen(true);
  }, []);

  const closeLead = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openLead, closeLead }), [openLead, closeLead]);

  return (
    <LeadContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        <LeadQueryOpener />
      </Suspense>
      <FloatingDiscoveryPill />
      {open ? <LeadModal opts={opts} onClose={closeLead} /> : null}
    </LeadContext.Provider>
  );
}
