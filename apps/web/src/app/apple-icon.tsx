import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c0c0c',
          color: '#c2a772',
          fontSize: 110,
          fontWeight: 700,
          fontStyle: 'italic',
          fontFamily: 'Georgia, serif',
          borderRadius: 36,
        }}
      >
        6
      </div>
    ),
    { ...size },
  );
}
