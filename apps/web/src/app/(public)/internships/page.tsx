'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredRole, getToken, portalPathForRole } from '../../../lib/auth';
import { loginUrlFor } from '../../../lib/routes';

/**
 * Internships board is student-only.
 * Anonymous → homepage teaser (not 404).
 * Logged-in student → portal board.
 * Other roles → their hub.
 */
export default function InternshipsAliasPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      window.location.replace('/#internships');
      return;
    }
    const role = getStoredRole();
    if (role === 'student') {
      router.replace('/student/internships');
      return;
    }
    if (role) {
      router.replace(portalPathForRole(role));
      return;
    }
    router.replace(loginUrlFor('/student/internships'));
  }, [router]);

  return (
    <main id="main-content" className="page">
      <p className="meta">Opening internships…</p>
    </main>
  );
}
