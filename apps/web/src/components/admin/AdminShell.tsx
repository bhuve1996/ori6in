'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { PageBanner } from '../PageBanner';
import { BANNERS } from '../../lib/media';

export const ADMIN_NAV = [
  { href: '/admin', label: 'Hub', exact: true },
  { href: '/admin/catalog', label: 'Catalog' },
  { href: '/admin/cms', label: 'CMS' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/approvals', label: 'Approvals' },
  { href: '/admin/certificates', label: 'Certificates' },
  { href: '/admin/coming-soon', label: 'Waitlist' },
] as const;

type Stat = { value: ReactNode; label: string };

type Props = {
  title: string;
  lead?: string;
  kicker?: string;
  loading?: boolean;
  error?: string;
  message?: string;
  stats?: Stat[];
  actions?: ReactNode;
  /** Full-bleed content for tables (catalog, users, waitlist). */
  layout?: 'default' | 'full';
  children: ReactNode;
};

function pathActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  title,
  lead,
  kicker = 'Admin',
  loading,
  error,
  message,
  stats,
  actions,
  layout = 'default',
  children,
}: Props) {
  const pathname = usePathname() || '/admin';
  const full = layout === 'full';

  return (
    <>
      <PageBanner image={BANNERS.admin} kicker={kicker} title={title} lead={lead} />
      <nav className={`admin-subnav${full ? ' admin-subnav--full' : ''}`} aria-label="Admin sections">
        <div className="admin-subnav__inner">
          {ADMIN_NAV.map((link) => {
            const active = pathActive(pathname, link.href, 'exact' in link ? link.exact : false);
            return (
              <a
                key={link.href}
                href={link.href}
                className="admin-subnav__link"
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </nav>
      <main
        id="main-content"
        className={`page page-after-banner admin-page${full ? ' admin-page--full' : ' page-wide'}`}
        tabIndex={-1}
      >
        {(stats && stats.length > 0) || actions ? (
          <div className="admin-toolbar">
            {stats && stats.length > 0 ? (
              <div className="admin-stats" role="group" aria-label="Summary">
                {stats.map((s) => (
                  <div key={s.label} className="admin-stat">
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div />
            )}
            {actions ? <div className="admin-toolbar__actions">{actions}</div> : null}
          </div>
        ) : null}

        {error ? <p className="admin-alert admin-alert--error">{error}</p> : null}
        {message ? <p className="admin-alert admin-alert--ok">{message}</p> : null}
        {loading ? <p className="meta">Loading…</p> : children}
      </main>
    </>
  );
}

export function AdminStatusPill({
  tone = 'neutral',
  children,
}: {
  tone?: 'ok' | 'warn' | 'neutral' | 'danger';
  children: ReactNode;
}) {
  return <span className={`admin-pill admin-pill--${tone}`}>{children}</span>;
}
