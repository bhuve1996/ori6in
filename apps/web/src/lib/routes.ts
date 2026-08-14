import { portalPathForRole } from './auth';

/** Marketing / public routes — always reachable without login. */
export const PUBLIC_PREFIXES = [
  '/',
  '/programs',
  '/mentors',
  '/blog',
  '/pricing',
  '/about',
  '/how-it-works',
  '/path',
  '/internships',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/demo-login',
] as const;

/** True for `/mentor` and `/mentor/...`, but not `/mentors`. */
export function isPortalSection(pathname: string, section: string) {
  const p = pathname.split('?')[0] ?? pathname;
  return p === section || p.startsWith(`${section}/`);
}

export function loginUrlFor(path: string) {
  const safe = sanitizeNext(path) ?? '/';
  if (safe === '/' || safe.startsWith('/login')) return '/login';
  return `/login?next=${encodeURIComponent(safe)}`;
}

/** Only allow same-origin relative paths (block //evil.com). */
export function sanitizeNext(next: string | null | undefined): string | null {
  if (!next) return null;
  if (!next.startsWith('/')) return null;
  if (next.startsWith('//')) return null;
  if (next.includes('://')) return null;
  return next;
}

export function canRoleAccessPath(role: string, path: string): boolean {
  const p = path.split('?')[0] ?? path;
  if (isPortalSection(p, '/checkout')) return true;
  if (isPortalSection(p, '/student')) return role === 'student';
  // Must use exact section match so /mentors stays public
  if (isPortalSection(p, '/mentor')) return role === 'mentor';
  if (isPortalSection(p, '/admin')) return role === 'admin' || role === 'super_admin';
  if (isPortalSection(p, '/parent')) return role === 'parent';
  if (isPortalSection(p, '/company')) return role === 'company';
  return true;
}

/** After login: honor next only if this role may open it; otherwise role hub. */
export function resolvePostLoginPath(role: string, next: string | null | undefined) {
  const safe = sanitizeNext(next);
  if (safe && canRoleAccessPath(role, safe)) return safe;
  return portalPathForRole(role);
}

export type NavLink = { href: string; label: string };

/** Shared marketing links — always visible on public/auth surfaces. */
export const MARKETING_LINKS: NavLink[] = [
  { href: '/programs', label: 'Programs' },
  { href: '/mentors', label: 'Mentors' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

function dashboardLabel(role: string) {
  if (role === 'mentor') return 'Mentor hub';
  if (role === 'admin' || role === 'super_admin') return 'Admin';
  if (role === 'parent') return 'Parent hub';
  if (role === 'company') return 'Company hub';
  return 'Dashboard';
}

export function marketingNavLinks(opts: {
  loggedIn: boolean;
  role?: string | null;
}): NavLink[] {
  const links = [...MARKETING_LINKS];
  if (opts.loggedIn && opts.role) {
    links.push({ href: portalPathForRole(opts.role), label: dashboardLabel(opts.role) });
    links.push({ href: '#logout', label: 'Log out' });
  } else {
    links.push({ href: '/login', label: 'Login' });
    links.push({ href: '/register', label: 'Register' });
  }
  return links;
}

export function portalNavLinks(role: string): NavLink[] {
  if (role === 'mentor') {
    return [
      { href: '/mentor', label: 'Hub' },
      { href: '/mentor/students', label: 'Students' },
      { href: '/mentor/reviews', label: 'Reviews' },
      { href: '/mentors', label: 'Directory' },
      { href: '/programs', label: 'Programs' },
      { href: '/', label: 'Home' },
      { href: '#logout', label: 'Log out' },
    ];
  }
  if (role === 'admin' || role === 'super_admin') {
    return [
      { href: '/admin', label: 'Hub' },
      { href: '/admin/users', label: 'Users' },
      { href: '/admin/catalog', label: 'Catalog' },
      { href: '/admin/cms', label: 'CMS' },
      { href: '/programs', label: 'Programs' },
      { href: '/', label: 'Home' },
      { href: '#logout', label: 'Log out' },
    ];
  }
  if (role === 'parent') {
    return [
      { href: '/parent', label: 'Hub' },
      { href: '/parent/progress', label: 'Progress' },
      { href: '/parent/payments', label: 'Payments' },
      { href: '/parent/messaging', label: 'Messages' },
      { href: '/parent/approvals', label: 'Approvals' },
      { href: '/programs', label: 'Programs' },
      { href: '/', label: 'Home' },
      { href: '#logout', label: 'Log out' },
    ];
  }
  if (role === 'company') {
    return [
      { href: '/company', label: 'Hub' },
      { href: '/company/internships', label: 'Roles' },
      { href: '/company/applicants', label: 'Applicants' },
      { href: '/company/interviews', label: 'Interviews' },
      { href: '/programs', label: 'Programs' },
      { href: '/', label: 'Home' },
      { href: '#logout', label: 'Log out' },
    ];
  }
  // student
  return [
    { href: '/student', label: 'Hub' },
    { href: '/student/courses', label: 'Courses' },
    { href: '/student/internships', label: 'Internships' },
    { href: '/student/profile', label: 'Profile' },
    { href: '/student/notifications', label: 'Alerts' },
    { href: '/student/ai', label: 'AI' },
    { href: '/programs', label: 'Programs' },
    { href: '/mentors', label: 'Mentors' },
    { href: '/', label: 'Home' },
    { href: '#logout', label: 'Log out' },
  ];
}

/**
 * Header nav for the current path.
 * - Portal sections use portal links for that role
 * - Public + auth pages always show the full marketing nav (no sparse auth-only strip)
 */
export function navLinksForPath(pathname: string, role: string | null): NavLink[] {
  if (isPortalSection(pathname, '/student')) {
    return portalNavLinks('student');
  }
  if (isPortalSection(pathname, '/mentor')) {
    return portalNavLinks('mentor');
  }
  if (isPortalSection(pathname, '/admin')) {
    return portalNavLinks(role === 'super_admin' ? 'super_admin' : 'admin');
  }
  if (isPortalSection(pathname, '/parent')) {
    return portalNavLinks('parent');
  }
  if (isPortalSection(pathname, '/company')) {
    return portalNavLinks('company');
  }

  return marketingNavLinks({
    loggedIn: Boolean(role),
    role,
  });
}
