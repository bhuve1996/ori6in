'use client';

import { useEffect } from 'react';

/** Alias for /how-it-works and old bookmarks. */
export default function PathAliasPage() {
  useEffect(() => {
    window.location.replace('/#path');
  }, []);

  return (
    <main id="main-content" className="page">
      <p className="meta">Taking you to How it works…</p>
    </main>
  );
}
