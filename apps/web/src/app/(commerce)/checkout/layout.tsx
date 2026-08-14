'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getToken } from '../../../lib/auth';
import { loginUrlFor } from '../../../lib/routes';

/** Checkout requires a session — send guests to login with return URL. */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      const qs = window.location.search;
      router.replace(loginUrlFor(`${pathname}${qs}`));
      return;
    }
    setOk(true);
  }, [router, pathname]);

  if (!ok) {
    return (
      <main id="main-content" className="page">
        <p className="meta">Redirecting to login…</p>
      </main>
    );
  }

  return children;
}
