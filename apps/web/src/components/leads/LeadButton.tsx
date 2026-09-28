'use client';

import { useLead } from './LeadContext';

export function LeadButton({
  kind,
  programmeId,
  interest,
  className = 'btn btn-accent',
  children,
}: {
  kind: 'discovery' | 'brochure' | 'quote' | 'contact';
  programmeId?: string;
  interest?: string;
  className?: string;
  children: string;
}) {
  const { openLead } = useLead();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openLead({ kind, programmeId, interest })}
    >
      {children}
    </button>
  );
}
