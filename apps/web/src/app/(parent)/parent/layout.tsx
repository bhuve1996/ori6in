'use client';

import { PortalAuthProvider } from '../../../hooks/PortalAuth';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <PortalAuthProvider roles={['parent']}>{children}</PortalAuthProvider>;
}
