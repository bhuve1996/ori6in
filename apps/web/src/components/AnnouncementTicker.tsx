'use client';

import { COMPANY, TICKER_ITEMS } from '@ori6in/shared';
import { goldSixNodes } from './public/GoldSix';

export function AnnouncementTicker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="announcement-ticker" role="marquee" aria-label="Announcements">
      <div className="announcement-ticker__track">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="announcement-ticker__item">
            {item.includes(COMPANY.phoneDisplay) ? (
              <a href={`tel:${COMPANY.phoneTel}`}>{goldSixNodes(item)}</a>
            ) : (
              goldSixNodes(item)
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
