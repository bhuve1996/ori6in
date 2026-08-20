'use client';

import { comingSoonEnvEnabled, comingSoonToggleVisible } from '../lib/coming-soon';

type Props = {
  /** When true, render as a floating control on the full site */
  floating?: boolean;
};

/**
 * Flip between coming-soon and full site via the `comingSoon` query param
 * (middleware sets a cookie). Env default: NEXT_PUBLIC_COMING_SOON.
 */
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
        <span className="coming-soon-toggle__hint">Env on · use ?comingSoon=0 to bypass</span>
      ) : (
        <span className="coming-soon-toggle__hint">Preview · ?comingSoon=1 enables this</span>
      )}
    </div>
  );
}
