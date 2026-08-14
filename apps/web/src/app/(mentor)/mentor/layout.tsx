'use client';

import { PortalAuthProvider } from '../../../hooks/PortalAuth';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return <PortalAuthProvider roles={['mentor']}>{children}</PortalAuthProvider>;
}
