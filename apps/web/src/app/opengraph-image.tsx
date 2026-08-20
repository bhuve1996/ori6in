import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '../lib/site';

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1510 55%, #3d3220 100%)',
          color: '#f7f3ec',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          ORI<span style={{ color: '#c2a772', fontStyle: 'italic', fontFamily: "Didot, 'Bodoni MT', Georgia, serif", fontWeight: 400 }}>6</span>IN
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 900 }}>
          <div style={{ fontSize: 52, fontWeight: 650, lineHeight: 1.15 }}>
            Everything starts here.
          </div>
          <div style={{ fontSize: 28, opacity: 0.88, lineHeight: 1.35, color: '#d4b87a' }}>
            {SITE_TAGLINE}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
