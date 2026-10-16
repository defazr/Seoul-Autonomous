import Link from 'next/link';
import '../styles/v2/tokens.css';
import '../styles/v2/base.css';

/** 로케일 밖(/, /xx 등) 전역 404 — 루트 레이아웃이 html 을 그리지 않으므로 여기서 직접 그린다. 로케일 안 404 는 app/[locale]/not-found.tsx. */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="v2-main">
          <section className="v2-wrap" style={{ padding: '64px 0 96px' }}>
            <p className="v2-eyebrow">404</p>
            <h1 style={{ fontSize: 'clamp(26px, 5vw, 40px)', lineHeight: 1.1, margin: '8px 0 12px' }}>Page not found · 페이지를 찾을 수 없습니다</h1>
            <p style={{ color: 'var(--fg-2)', maxWidth: '60ch' }}>This address does not exist. 주소가 없거나 바뀌었습니다.</p>
            <p style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/en" style={{ color: 'var(--accent)', fontWeight: 600 }}>English home →</Link>
              <Link href="/ko" style={{ color: 'var(--accent)', fontWeight: 600 }}>한국어 홈 →</Link>
              <Link href="/ko/night-bus-map" style={{ color: 'var(--accent)', fontWeight: 600 }}>올빼미버스 노선도 →</Link>
            </p>
          </section>
        </main>
      </body>
    </html>
  );
}
