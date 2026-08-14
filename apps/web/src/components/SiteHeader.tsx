'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getStoredRole, getToken } from '../lib/auth';
import { BRAND } from '../lib/media';
import { navLinksForPath } from '../lib/routes';
import { useToast } from './Toast';
import { Tooltip } from './Tooltip';

const DARK_THEMES = new Set(['hero', 'mentors', 'closing']);

function pathMatches(pathname: string, href: string) {
  if (href === '#logout' || href.startsWith('#')) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<'light' | 'dark'>('light');
  const [role, setRole] = useState<string | null>(null);
  const links = navLinksForPath(pathname, role);

  useEffect(() => {
    const syncRole = () => {
      setRole(getToken() ? getStoredRole() : null);
    };
    syncRole();
    window.addEventListener('ori6in-auth', syncRole);
    window.addEventListener('storage', syncRole);
    return () => {
      window.removeEventListener('ori6in-auth', syncRole);
      window.removeEventListener('storage', syncRole);
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (pathname !== '/') {
      setTone('light');
      return;
    }

    const sync = () => {
      const theme = document.body.dataset.homeTheme ?? 'hero';
      setTone(DARK_THEMES.has(theme) ? 'dark' : 'light');
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-home-theme'],
    });
    return () => observer.disconnect();
  }, [pathname]);

  function onNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href !== '#logout') return;
    e.preventDefault();
    clearSession();
    setRole(null);
    toast.info('Signed out');
    router.push('/');
  }

  return (
    <header className="site-header" data-tone={tone}>
      <a href="/" className="brand" aria-label="ORI6IN home">
        <img src={BRAND.owl} alt="" className="brand__mark" width={40} height={40} />
        <img
          src={tone === 'dark' ? BRAND.logoDark : BRAND.logo}
          alt="ORI6IN"
          className="brand__logo"
          width={160}
          height={55}
        />
      </a>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle-bars" aria-hidden="true" />
      </button>
      <nav id="site-nav" aria-label="Primary" data-open={open ? 'true' : 'false'}>
        {links.map((link) => {
          const tip =
            link.label === 'Alerts'
              ? 'Notifications'
              : link.label === 'How it works'
                ? 'Student → mentor → role'
                : link.label === 'AI'
                  ? 'Career coach chat'
                  : link.href === '#logout'
                    ? 'End your session'
                    : null;
          const current = pathMatches(pathname, link.href);
          const anchor = (
            <a
              href={link.href === '#logout' ? '/' : link.href}
              onClick={(e) => onNavClick(e, link.href)}
              aria-current={current ? 'page' : undefined}
            >
              {link.label}
            </a>
          );
          return tip ? (
            <Tooltip key={`${link.href}-${link.label}`} label={tip} side="bottom">
              {anchor}
            </Tooltip>
          ) : (
            <span key={`${link.href}-${link.label}`}>{anchor}</span>
          );
        })}
      </nav>
    </header>
  );
}
