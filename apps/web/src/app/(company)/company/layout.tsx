'use client';

import { PortalAuthProvider } from '../../../hooks/PortalAuth';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return <PortalAuthProvider roles={['company']}>{children}</PortalAuthProvider>;
}
