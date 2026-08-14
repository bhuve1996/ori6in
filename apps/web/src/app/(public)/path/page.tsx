'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Alias for /how-it-works (old /path bookmarks). */
export default function PathAliasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/how-it-works');
  }, [router]);

  return (
    <main id="main-content" className="page">
      <p className="meta">Taking you to How it works…</p>
    </main>
  );
}
