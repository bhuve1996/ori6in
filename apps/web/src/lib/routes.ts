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
  if (p.startsWith('/checkout')) return true;
  if (p.startsWith('/student')) return role === 'student';
  if (p.startsWith('/mentor')) return role === 'mentor';
  if (p.startsWith('/admin')) return role === 'admin' || role === 'super_admin';
  if (p.startsWith('/parent')) return role === 'parent';
  if (p.startsWith('/company')) return role === 'company';
  return true;
}

/** After login: honor next only if this role may open it; otherwise role hub. */
export function resolvePostLoginPath(role: string, next: string | null | undefined) {
  const safe = sanitizeNext(next);
  if (safe && canRoleAccessPath(role, safe)) return safe;
  return portalPathForRole(role);
}

export type NavLink = { href: string; label: string };

export function marketingNavLinks(opts: {
  loggedIn: boolean;
  portalHref?: string;
}): NavLink[] {
  const links: NavLink[] = [
    { href: '/programs', label: 'Programs' },
    { href: '/mentors', label: 'Mentors' },
    { href: '/how-it-works', label: 'How it works' },
    { href: '/blog', label: 'Blog' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];
  if (opts.loggedIn && opts.portalHref) {
    links.push({ href: opts.portalHref, label: 'Portal' });
    links.push({ href: '#logout', label: 'Log out' });
  } else {
    links.push({ href: '/login', label: 'Login' });
  }
  return links;
}

export function portalNavLinks(role: string): NavLink[] {
  if (role === 'mentor') {
    return [
      { href: '/mentor', label: 'Hub' },
      { href: '/mentor/students', label: 'Students' },
      { href: '/mentor/reviews', label: 'Reviews' },
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
  // student default
  return [
    { href: '/student', label: 'Hub' },
    { href: '/student/courses', label: 'Courses' },
    { href: '/student/internships', label: 'Internships' },
    { href: '/student/profile', label: 'Profile' },
    { href: '/student/notifications', label: 'Alerts' },
    { href: '/programs', label: 'Programs' },
    { href: '/', label: 'Home' },
    { href: '#logout', label: 'Log out' },
  ];
}

export function navLinksForPath(pathname: string, role: string | null): NavLink[] {
  const loggedIn = Boolean(role);
  if (pathname.startsWith('/student')) return portalNavLinks('student');
  if (pathname.startsWith('/mentor')) return portalNavLinks('mentor');
  if (pathname.startsWith('/admin')) return portalNavLinks(role ?? 'admin');
  if (pathname.startsWith('/parent')) return portalNavLinks('parent');
  if (pathname.startsWith('/company')) return portalNavLinks('company');
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot') ||
    pathname.startsWith('/reset') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/demo-login')
  ) {
    return [
      { href: '/programs', label: 'Programs' },
      { href: '/login', label: 'Login' },
      { href: '/register', label: 'Register' },
      { href: '/demo-login', label: 'Demo' },
    ];
  }
  return marketingNavLinks({
    loggedIn,
    portalHref: role ? portalPathForRole(role) : undefined,
  });
}
