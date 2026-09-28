'use client';

import { useEffect, useRef } from 'react';
import { LeadForm } from './LeadForm';
import type { LeadOpenOpts } from './LeadContext';

export function LeadModal({ opts, onClose }: { opts: LeadOpenOpts; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (!el.open) el.showModal();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="lead-modal"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <button type="button" className="lead-modal__close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <LeadForm
        kind={opts.kind}
        programmeId={opts.programmeId}
        programmeLabel={opts.programmeLabel}
        interest={opts.interest}
      />
    </dialog>
  );
}
