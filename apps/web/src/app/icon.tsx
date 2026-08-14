import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** Gold mark on ink — matches logo “6” / owl glasses. */
export default function Icon() {
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
          fontSize: 22,
          fontWeight: 700,
          fontStyle: 'italic',
          fontFamily: 'Georgia, serif',
        }}
      >
        6
      </div>
    ),
    { ...size },
  );
}
