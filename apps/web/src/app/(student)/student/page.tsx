'use client';

import { useState } from 'react';
import { apiFetch } from '../../../lib/auth';
import { useApiResource } from '../../../hooks/useApiResource';
import { usePortalUser } from '../../../hooks/PortalAuth';
import { PersonHeader } from '../../../components/portal/PersonHeader';
import { PortalNavGrid } from '../../../components/portal/PortalNavGrid';
import { PortalShell } from '../../../components/portal/PortalShell';
import { SignOutButton } from '../../../components/portal/SignOutButton';
import { useToast } from '../../../components/Toast';
import { Tooltip } from '../../../components/Tooltip';
import { BANNERS } from '../../../lib/media';

export default function StudentPortalPage() {
  const user = usePortalUser();
  const toast = useToast();
  const [error, setError] = useState('');
  const [verifyHint, setVerifyHint] = useState('');
  const { data: unreadData } = useApiResource<{ count: number }>(
    '/notifications/unread-count',
    { silent: true },
  );
  const unread = unreadData?.count ?? 0;

  async function requestVerification() {
    setError('');
    setVerifyHint('');
    const { ok, data } = await apiFetch<{
      message?: string;
      devVerifyToken?: string;
      emailVerified?: boolean;
    }>('/auth/request-verification', { method: 'POST' });
    if (!ok) {
      const msg = typeof data.message === 'string' ? data.message : 'Request failed';
      setError(msg);
      toast.error(msg);
      return;
    }
    if (data.emailVerified) {
      setVerifyHint('Already verified.');
      toast.info('Email already verified');
      return;
    }
    setVerifyHint(
      data.devVerifyToken
        ? `Dev verify link ready — open /verify-email?token=${data.devVerifyToken}`
        : 'Verification email queued.',
    );
    toast.success('Verification email queued');
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: 'Student Portal',
        lead: 'Courses, internships, profile, and progress in one place.',
      }}
    >
      <PersonHeader name={user.fullName} seed={user.id} kind="student">
        <p className="page-lead" style={{ margin: 0 }}>
          Signed in as {user.fullName} ({user.email})
          {user.emailVerified ? ' · verified' : ' · email not verified'}
        </p>
      </PersonHeader>

      {!user.emailVerified && (
        <p>
          <Tooltip label="Sends a verification email (or a local dev link)">
            <button
              className="btn secondary"
              type="button"
              onClick={() => void requestVerification()}
            >
              Resend verification
            </button>
          </Tooltip>
        </p>
      )}
      {error && <p className="text-error">{error}</p>}
      {verifyHint && <p className="notice">{verifyHint}</p>}

      <PortalNavGrid
        links={[
          { href: '/programs', label: 'Browse programs' },
          { href: '/student/orders', label: 'My orders' },
          { href: '/student/courses', label: 'Courses' },
          { href: '/student/profile', label: 'Profile' },
          {
            href: '/student/notifications',
            label: `Notifications${unread > 0 ? ` (${unread})` : ''}`,
          },
          { href: '/student/internships', label: 'Internships' },
          { href: '/student/parent-links', label: 'Parent links' },
          { href: '/student/ai', label: 'AI Chat' },
        ]}
      />

      <div className="cta-row">
        <SignOutButton />
      </div>
    </PortalShell>
  );
}
