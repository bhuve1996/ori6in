'use client';

import { PortalAuthProvider } from '../../../hooks/PortalAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalAuthProvider roles={['admin', 'super_admin']}>{children}</PortalAuthProvider>
  );
}
