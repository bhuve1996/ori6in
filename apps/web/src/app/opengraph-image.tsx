import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_NAME, SITE_TAGLINE } from '../lib/site';

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  let owlBase64 = '';
  try {
    const owlPath = join(process.cwd(), 'public', 'brand', 'owl-icon.png');
    const owlBuffer = readFileSync(owlPath);
    owlBase64 = `data:image/png;base64,${owlBuffer.toString('base64')}`;
  } catch {
    try {
      const fallbackPath = join(process.cwd(), 'apps', 'web', 'public', 'brand', 'owl-icon.png');
      const fallbackBuffer = readFileSync(fallbackPath);
      owlBase64 = `data:image/png;base64,${fallbackBuffer.toString('base64')}`;
    } catch {
      // Fallback cleanly if asset cannot be read synchronously
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(145deg, #FDFBF7 0%, #F4F0E8 55%, #ECE6DA 100%)',
          color: '#17304D',
          position: 'relative',
        }}
      >
        {/* Subtle decorative inner hairline border */}
        <div
          style={{
            position: 'absolute',
            inset: 24,
            border: '1.5px solid #D9D2C2',
            borderRadius: 16,
            pointerEvents: 'none',
          }}
        />

        {/* Top Header: Brand Wordmark + Owl Mascot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#17304D',
                fontFamily: "'Cinzel', Georgia, serif",
              }}
            >
              ORI<span style={{ color: '#D3A150', fontWeight: 700 }}>6</span>IN
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.28em',
                color: '#C9A361',
                fontFamily: "'Cinzel', Georgia, serif",
              }}
            >
              EDUCATION
            </div>
          </div>

          {owlBase64 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '2px solid #D9D2C2',
                boxShadow: '0 4px 16px rgba(23, 48, 77, 0.08)',
              }}
            >
              <img
                src={owlBase64}
                alt="ORI6IN Owl"
                width="72"
                height="72"
                style={{ objectFit: 'contain' }}
              />
            </div>
          ) : null}
        </div>

        {/* Main Pitch / Tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 960 }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#17304D',
              letterSpacing: '-0.02em',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Find what you’re capable of. Then build on it.
          </div>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.4,
              color: '#5A554C',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            ED6E · BRI6GE · 6LOBAL · 6RIP — Profile building platform from Class 8
          </div>
        </div>

        {/* Footer Accent Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #D9D2C2',
            paddingTop: 20,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: '#17304D',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <span>Everything starts here.</span>
          <span style={{ color: '#D3A150' }}>ori6in.education</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
