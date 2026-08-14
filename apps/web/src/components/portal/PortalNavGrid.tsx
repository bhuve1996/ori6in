'use client';

import { memo } from 'react';

type Link = { href: string; label: string };

function PortalNavGridInner({ links }: { links: Link[] }) {
  return (
    <div className="portal-grid">
      {links.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </div>
  );
}

export const PortalNavGrid = memo(PortalNavGridInner);
