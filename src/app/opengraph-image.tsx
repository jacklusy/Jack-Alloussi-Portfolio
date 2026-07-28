import { ImageResponse } from 'next/og';

export const alt = 'Jack Alloussi — Software Engineer';
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
          background: '#0B0D10',
          color: '#F4F6F8',
          padding: 64,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#3D82E6',
            fontSize: 22,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Portfolio
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Jack Alloussi
          </div>
          <div style={{ fontSize: 32, color: '#9AA3AF', maxWidth: 900 }}>
            Software Engineer — TypeScript · NestJS · React · React Native
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7B8494', fontSize: 22 }}>
          <span>Amman, Jordan · EU Blue Card eligible</span>
          <span>Graduating Oct 2026</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
