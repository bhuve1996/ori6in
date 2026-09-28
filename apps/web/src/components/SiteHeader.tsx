'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const [tone, setTone] = useState<'light' | 'dark'>('light');
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
    const mq = window.matchMedia('(max-width: 820px)');
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
    document.body.classList.toggle('nav-open', open && compactNav);
    return () => document.body.classList.remove('nav-open');
  }, [open, compactNav]);

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
      <a
        className={extraClass}
        href={link.href === '#logout' ? '/' : link.href}
        onClick={(e) => onNavClick(e, link.href)}
        aria-current={current ? 'page' : undefined}
      >
        {goldSixNodes(link.label)}
      </a>
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
          onClick={toggleNav}
        >
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>
        <nav
          id="site-nav"
          aria-label="Primary"
          data-open={open ? 'true' : 'false'}
          {...(navInert ? { inert: true } : {})}
        >
          {chrome.map((link) => renderLink(link))}
        </nav>
        <div className="site-header__actions">
          {actions.map((link) => renderLink(link, 'site-header__signin'))}
          {showDiscovery ? (
            <button
              type="button"
              className="btn btn-accent site-header__book"
              onClick={() => {
                setOpen(false);
                openLead({ kind: 'discovery' });
              }}
            >
              <span className="site-header__book-long">Book a free Discovery Session</span>
              <span className="site-header__book-short">Book a session</span>
            </button>
          ) : null}
        </div>
      </header>
    </div>
  );
}
