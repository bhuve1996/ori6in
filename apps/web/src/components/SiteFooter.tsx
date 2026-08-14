'use client';

import { usePathname } from 'next/navigation';
import { BRAND } from '../lib/media';

/** Shared footer for non-home routes — matches black/gold brand. */
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === '/') return null;

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
          <a href="/programs">Programs</a>
          <a href="/mentors">Mentors</a>
          <a href="/how-it-works">How it works</a>
          <a href="/pricing">Pricing</a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
          <a href="/login">Login</a>
        </nav>
      </div>
    </footer>
  );
}
