import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

/** The social card shared by the home page and every chapter: black, hairline rules, one accent. */
export function ogImage({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: '#000',
        color: '#eaf0f4',
        backgroundImage: 'radial-gradient(circle at 82% 38%, rgba(92,200,255,0.22), rgba(0,0,0,0) 46%)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: 7, color: '#7f8c95' }}>
        <span>SCROLLCRAFT</span>
        <span>FREE TUTORIAL</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, letterSpacing: 6, color: '#5cc8ff' }}>
          <div style={{ width: 36, height: 2, background: '#5cc8ff' }} />
          <span>{kicker.toUpperCase()}</span>
        </div>
        <div style={{ fontSize: 92, lineHeight: 1, letterSpacing: -3, maxWidth: 980 }}>{title}</div>
        <div style={{ fontSize: 30, color: '#7f8c95', maxWidth: 900, lineHeight: 1.3 }}>{sub}</div>
      </div>
      <div style={{ height: 1, background: 'rgba(234,240,244,0.14)' }} />
    </div>,
    OG_SIZE,
  );
}
