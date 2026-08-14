'use client';

import { usePathname } from 'next/navigation';
import { BRAND } from '../lib/media';
import { MARKETING_LINKS } from '../lib/routes';

/** Shared footer for non-home routes — matches header marketing links. */
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  // Portal areas keep a light footer; full marketing links still available
  const hideAuthCtas =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/demo-login');

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <a href="/" className="site-footer__brand" aria-label="ORI6IN home">
          <img src={BRAND.owl} alt="" width={44} height={44} className="site-footer__owl" />
          <span>
            ORI<span className="brand__six">6</span>IN
            <small>{BRAND.tagline}</small>
          </span>
        </a>
        <nav className="site-footer__nav" aria-label="Footer">
          {MARKETING_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {!hideAuthCtas ? (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          ) : (
            <a href="/demo-login">Demo</a>
          )}
        </nav>
      </div>
    </footer>
  );
}
