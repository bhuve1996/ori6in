'use client';

import { PortalAuthProvider } from '../../../hooks/PortalAuth';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <PortalAuthProvider roles={['student']}>{children}</PortalAuthProvider>;
}
