import { Role } from './kernel.js';

/** Shared password for all temporary demo accounts. Documented in docs/demo-logins.md */
export const DEMO_PASSWORD = 'DemoPass123!';

export const DEMO_EMAIL_DOMAIN = 'demo.ori6in.test';

export type DemoAccount = {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  portalPath: string;
};

/**
 * Temporary bypass accounts for product walkthroughs.
 * Disable with ENABLE_DEMO_LOGINS=false (API will reject these emails).
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: `student@${DEMO_EMAIL_DOMAIN}`,
    password: DEMO_PASSWORD,
    fullName: 'Demo Student',
    role: Role.Student,
    portalPath: '/student',
  },
  {
    email: `mentor@${DEMO_EMAIL_DOMAIN}`,
    password: DEMO_PASSWORD,
    fullName: 'Demo Mentor',
    role: Role.Mentor,
    portalPath: '/mentor',
  },
  {
    email: `parent@${DEMO_EMAIL_DOMAIN}`,
    password: DEMO_PASSWORD,
    fullName: 'Demo Parent',
    role: Role.Parent,
    portalPath: '/parent',
  },
  {
    email: `company@${DEMO_EMAIL_DOMAIN}`,
    password: DEMO_PASSWORD,
    fullName: 'Demo Company',
    role: Role.Company,
    portalPath: '/company',
  },
  {
    email: `admin@${DEMO_EMAIL_DOMAIN}`,
    password: DEMO_PASSWORD,
    fullName: 'Demo Admin',
    role: Role.Admin,
    portalPath: '/admin',
  },
  {
    email: `superadmin@${DEMO_EMAIL_DOMAIN}`,
    password: DEMO_PASSWORD,
    fullName: 'Demo Super Admin',
    role: Role.SuperAdmin,
    portalPath: '/admin',
  },
];

export function isDemoEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${DEMO_EMAIL_DOMAIN}`);
}
