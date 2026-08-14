'use client';

import { useRouter } from 'next/navigation';
import { clearSession } from '../../lib/auth';
import { useToast } from '../Toast';

export function SignOutButton({ className = 'btn btn-secondary' }: { className?: string }) {
  const router = useRouter();
  const toast = useToast();

  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        clearSession();
        toast.info('Signed out');
        router.push('/login');
      }}
    >
      Sign out
    </button>
  );
}
