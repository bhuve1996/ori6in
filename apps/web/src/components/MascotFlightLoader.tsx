'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { BRAND } from '../lib/media';

export function MascotFlightLoader() {
  const pathname = usePathname();
  const [flying, setFlying] = useState(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Check if path actually changed (not initial mount or hash change)
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setFlying(true);

      const timer = setTimeout(() => {
        setFlying(false);
      }, 1350); // Slower, graceful 1.3s mascot flight transition across screen

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!flying) return null;

  return (
    <aside
      className="mascot-flight-overlay"
      aria-hidden="true"
      role="presentation"
    >
      <div className="mascot-flight-track">
        {/* Golden energy trail following the owl */}
        <div className="mascot-flight-trail" />

        {/* Flying mascot avatar */}
        <div className="mascot-flight-entity">
          <div className="mascot-flight-avatar">
            <img
              src={BRAND.owl}
              alt=""
              width={56}
              height={56}
              className="mascot-flight-img"
            />
          </div>
          <span className="mascot-flight-sparkle">✦</span>
        </div>
      </div>
    </aside>
  );
}
