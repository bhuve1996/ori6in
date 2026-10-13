'use client';

import { useLead } from './LeadContext';
import { usePathname } from 'next/navigation';
import { isPortalChromePath } from '../../lib/routes';
import { useMounted } from '../../hooks/useMounted';
import { useState } from 'react';

export function FloatingDiscoveryPill() {
  const mounted = useMounted();
  const { openLead } = useLead();
  const pathname = usePathname();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  if (!mounted) return null;
  // Don't show inside logged-in portals (student, mentor, admin, checkout)
  if (isPortalChromePath(pathname)) return null;

  const handleClick = () => {
    // If mobile and not expanded, expand it first (with quick open on second tap),
    // or if already expanded / on desktop, open the lead modal immediately.
    if (window.innerWidth <= 640 && !mobileExpanded) {
      setMobileExpanded(true);
      return;
    }
    openLead({ kind: 'discovery' });
    setMobileExpanded(false);
  };

  return (
    <div className={`floating-discovery-wrapper ${mobileExpanded ? 'is-expanded' : ''}`}>
      <button
        type="button"
        className="floating-discovery-btn"
        onClick={handleClick}
        aria-label="Book a free Profile Discovery Session"
        title="Book Free Discovery Session"
      >
        <span className="floating-discovery-btn__icon" aria-hidden="true">
          ✦
        </span>
        <span className="floating-discovery-btn__text-long">
          Book Free Discovery Session
        </span>
        <span className="floating-discovery-btn__text-short">
          Book Discovery
        </span>
      </button>

      {mobileExpanded ? (
        <button
          type="button"
          className="floating-discovery-close"
          onClick={() => setMobileExpanded(false)}
          aria-label="Collapse discovery pill"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
