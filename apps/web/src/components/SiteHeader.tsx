'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { clearSession, getStoredRole, getToken } from '../lib/auth';
import { BRAND } from '../lib/media';
import { isPortalChromePath, navLinksForPath, splitPublicNav } from '../lib/routes';
import { AnnouncementTicker } from './AnnouncementTicker';
import { useLead } from './leads/LeadContext';
import { goldSixNodes } from './public/GoldSix';
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
  const { openLead } = useLead();
  const [open, setOpen] = useState(false);
  const [compactNav, setCompactNav] = useState(false);
  const [tone, setTone] = useState<'light' | 'dark'>('dark');
  const [role, setRole] = useState<string | null>(null);
  const links = useMemo(() => navLinksForPath(pathname, role), [pathname, role]);
  const portal = isPortalChromePath(pathname);
  const showTicker = !portal;
  const showDiscovery = showTicker;
  const { chrome, actions } = useMemo(() => {
    if (portal) return { chrome: links, actions: [] as typeof links };
    return splitPublicNav(links);
  }, [links, portal]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const sync = () => {
      setCompactNav(mq.matches);
      if (!mq.matches) setOpen(false);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

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
    if (open && compactNav) {
      document.body.classList.add('nav-open');
      document.documentElement.classList.add('nav-open');
      // Store current scroll position to prevent jumps on iOS
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.classList.remove('nav-open');
        document.documentElement.classList.remove('nav-open');
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    } else {
      document.body.classList.remove('nav-open');
      document.documentElement.classList.remove('nav-open');
    }
  }, [open, compactNav]);

  useEffect(() => {
    setTone('dark');
  }, [pathname]);

  const onNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href !== '#logout') return;
      e.preventDefault();
      clearSession();
      setRole(null);
      toast.info('Signed out');
      router.push('/');
    },
    [router, toast],
  );

  const toggleNav = useCallback(() => setOpen((v) => !v), []);
  const navInert = compactNav && !open;

  function renderLink(link: (typeof links)[number], extraClass?: string) {
    const tip =
      link.href === '#logout'
        ? 'End your session'
        : link.label === 'Alerts'
          ? 'Notifications'
          : link.label === 'AI'
            ? 'Career coach chat'
            : null;
    const current = pathMatches(pathname, link.href);
    const anchor = (
      <Link
        className={extraClass}
        href={link.href === '#logout' ? '/' : link.href}
        onClick={(e) => onNavClick(e, link.href)}
        aria-current={current ? 'page' : undefined}
      >
        {goldSixNodes(link.label)}
      </Link>
    );
    return tip ? (
      <Tooltip key={`${link.href}-${link.label}`} label={tip} side="bottom">
        {anchor}
      </Tooltip>
    ) : (
      <span key={`${link.href}-${link.label}`}>{anchor}</span>
    );
  }

  return (
    <div className="site-chrome" data-ticker={showTicker ? 'true' : undefined} data-tone={tone}>
      {showTicker ? <AnnouncementTicker /> : null}
      <header className="site-header" data-tone={tone}>
        <Link href="/" className="brand" aria-label="ORI6IN home">
          <img src={BRAND.owl} alt="" className="brand__mark" width={40} height={40} />
          <img
            src={tone === 'dark' ? BRAND.logoDark : BRAND.logo}
            alt="ORI6IN"
            className="brand__logo"
            width={160}
            height={55}
          />
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={toggleNav}
        >
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>

        {/* Mobile Backdrop Overlay */}
        <div
          className={`site-nav-backdrop ${open ? 'is-visible' : ''}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        <nav
          id="site-nav"
          aria-label="Primary"
          data-open={open ? 'true' : 'false'}
          {...(navInert ? { inert: true } : {})}
        >
          <div className="site-nav__drawer-header">
            <div className="site-nav__drawer-brand">
              <img src={BRAND.owl} alt="" width={32} height={32} className="brand__mark" />
              <img
                src={tone === 'dark' ? BRAND.logoDark : BRAND.logo}
                alt="ORI6IN"
                className="brand__logo"
                width={120}
                height={40}
              />
            </div>
            <button
              type="button"
              className="site-nav__close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="site-nav__links">
            {chrome.map((link) => renderLink(link))}
          </div>
          <div className="site-nav__mobile-actions">
            {actions.map((link) => renderLink(link, 'site-nav__mobile-signin'))}
          </div>
        </nav>
        <div className="site-header__actions">
          {actions.map((link) => renderLink(link, 'site-header__signin'))}
        </div>
      </header>
    </div>
  );
}
