'use client';

import type { ReactNode } from 'react';
import { PageBanner } from '../PageBanner';

type Banner = {
  image: string;
  title: string;
  lead?: string;
  kicker?: string;
};

type Props = {
  banner: Banner;
  back?: { href: string; label: string };
  loading?: boolean;
  error?: string;
  children: ReactNode;
};

/** Banner + main chrome shared by portal (and similar) pages. */
export function PortalShell({ banner, back, loading, error, children }: Props) {
  return (
    <>
      <PageBanner
        image={banner.image}
        title={banner.title}
        lead={banner.lead}
        kicker={banner.kicker}
      />
      <main id="main-content" className="page page-after-banner" tabIndex={-1}>
        {back ? (
          <a className="back-link" href={back.href}>
            ← {back.label}
          </a>
        ) : null}
        {error ? <p className="text-error">{error}</p> : null}
        {loading ? <p className="meta">Loading…</p> : children}
      </main>
    </>
  );
}
