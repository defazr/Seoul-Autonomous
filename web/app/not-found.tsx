import Link from 'next/link';
import en from '../messages/en.json';
import { FooterView } from '../components/v2/shell/Footer';
import { NIGHT_BUS_GUIDE_PATH } from '../lib/nav';
import { fontClassName } from '../lib/v2/fonts';
import '../styles/v2/tokens.css';
import '../styles/v2/base.css';
import shell from '../components/v2/shell/Shell.module.css';
import styles from './[locale]/not-found.module.css';

/**
 * 전역 404 — 빌드 때 `/_not-found` 로 한 번 그려져 모든 없는 주소에 그대로 나간다 (R3b-4 · 2026-10-18 · 배포 전 점검 10-16 BLOCK 3).
 * 없는 주소가 여기에 닿도록 [locale] 레이아웃과 로케일 한정 페이지에 dynamicParams=false 를 두고 catch-all 은 쓰지 않는다
 * (요청 시점에 notFound() 를 던지면 Next 16 은 빈 __next_error__ 문서를 내보낸다).
 *
 * ⚠ 이 컴포넌트는 모든 페이지 렌더에 함께 실행된다(루트 not-found 경계). 그래서 getLocale()·getTranslations()·setRequestLocale()·
 * NextIntlClientProvider(서버 쪽이 headers() 를 읽음)를 쓰면 전 페이지가 동적(ƒ)이 되거나 로케일이 en 으로 바뀐다 — 10-18 빌드로 둘 다 실측.
 * 문구는 en 메시지 JSON 을 직접 읽고, 헤더는 클라이언트 부품 없이 링크만 그린다. 광고·GA 스크립트는 싣지 않는다.
 */
const t = (key: string) => key.split('.').reduce<unknown>((o, p) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[p] : undefined), en.shell) as string;

export default function GlobalNotFound() {
  const nav = [
    { href: `/en${NIGHT_BUS_GUIDE_PATH}`, label: t('nav.map') },
    { href: '/en/routes', label: t('nav.routes') },
    { href: '/en/how-to-ride', label: t('nav.howToRide') },
    { href: '/en/faq', label: t('nav.faq') },
    { href: '/en/updates', label: t('nav.updates') },
  ];
  return (
    <html lang="en" className={fontClassName}>
      <head>
        <title>Page not found — Seoul Autonomous</title>
      </head>
      <body>
        <header className={shell.header}>
          <a href="#main" className="v2-skip">{t('skip')}</a>
          <div className={`v2-wrap ${shell.bar}`}>
            <Link href="/en" className={shell.brand} aria-label={`Seoul Autonomous — ${t('tagline')}`}>
              <span className={shell.mark} aria-hidden="true" />
              <span>Seoul Autonomous</span>
              <span className={shell.tagline}>{t('tagline')}</span>
            </Link>
            <nav className={shell.nav} aria-label={t('navLabel')}>
              {nav.map((it) => <Link key={it.href} href={it.href} className={shell.navLink}>{it.label}</Link>)}
            </nav>
            <div className={shell.actions}>
              <div className={shell.lang} role="group" aria-label={t('language')}>
                <Link href="/ko" className={shell.langBtn} lang="ko">KO</Link>
                <Link href="/en" className={shell.langBtn} aria-current="true">EN</Link>
              </div>
            </div>
          </div>
        </header>
        <main id="main" className="v2-main">
          <section className={`v2-wrap ${styles.wrap}`} aria-labelledby="nf-title">
            <p className="v2-eyebrow">404</p>
            <h1 id="nf-title" className={styles.title}>Page not found <span lang="ko">· 페이지를 찾을 수 없습니다</span></h1>
            <p className={styles.lead}>This address has moved or does not exist. Continue from one of these pages.</p>
            <p className={styles.lead} lang="ko">주소가 바뀌었거나 없는 페이지입니다. 아래에서 이어서 찾아보세요.</p>
            <ul className={styles.links}>
              <li><Link href="/en">English home →</Link></li>
              <li><Link href="/ko" lang="ko">한국어 홈 →</Link></li>
              <li><Link href={`/ko${NIGHT_BUS_GUIDE_PATH}`} lang="ko">올빼미버스 노선도 →</Link></li>
              <li><Link href="/en/routes">Autonomous routes →</Link></li>
            </ul>
          </section>
        </main>
        <FooterView locale="en" t={t} />
      </body>
    </html>
  );
}
