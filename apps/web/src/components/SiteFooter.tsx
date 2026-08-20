'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getToken } from '../lib/auth';
import { BRAND } from '../lib/media';
import { MARKETING_LINKS } from '../lib/routes';

/** Shared site footer — always at the end of the page shell. */
export function SiteFooter() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const sync = () => setSignedIn(Boolean(getToken()));
    sync();
    window.addEventListener('ori6in-auth', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('ori6in-auth', sync);
      window.removeEventListener('storage', sync);
    };
  }, [pathname]);

  const year = new Date().getFullYear();
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/demo-login');

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <img src={BRAND.owl} alt="" width={40} height={40} className="site-footer__owl" />
          <div>
            <p className="site-footer__name">
              <img
                className="site-footer__logo"
                src={BRAND.logoDark}
                alt="ORI6IN"
                width={140}
                height={56}
              />
            </p>
            <p className="site-footer__copy">
              © {year} · {BRAND.tagline}
            </p>
          </div>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          {MARKETING_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {isAuthPage ? (
            <a href="/demo-login">Demo</a>
          ) : signedIn ? null : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
