import '../styles/v2/tokens.css';
import '../styles/v2/base.css';

/** 루트 레이아웃 — html/body 는 로케일 레이아웃(app/[locale]/layout.tsx)이 그린다. 전역 404(app/not-found.tsx)는 자기 html 을 직접 그린다 (next-intl 권장 구조). */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
