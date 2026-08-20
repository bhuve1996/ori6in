'use client';

import { comingSoonEnvEnabled, comingSoonToggleVisible } from '../lib/coming-soon';

type Props = {
  floating?: boolean;
};

/** Flip via ?comingSoon=1|0 (cookie). Default from NEXT_PUBLIC_COMING_SOON. */
export function ComingSoonToggle({ floating = false }: Props) {
  if (!comingSoonToggleVisible()) return null;

  const envOn = comingSoonEnvEnabled();

  if (floating) {
    return (
      <a
        className="coming-soon-toggle coming-soon-toggle--float"
        href="/?comingSoon=1"
        title="Show coming soon page"
      >
        Coming soon view
      </a>
    );
  }

  return (
    <div className="coming-soon-toggle">
      <a className="coming-soon-toggle__link" href="/?comingSoon=0">
        Preview full site
      </a>
      {envOn ? (
        <span className="coming-soon-toggle__hint">Env on · ?comingSoon=0 to bypass</span>
      ) : (
        <span className="coming-soon-toggle__hint">Preview · ?comingSoon=1 enables this</span>
      )}
    </div>
  );
}
