import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { routing } from '../../i18n/routing';
import { SITE_URL } from '../../lib/seo/config';
import { fontClassName } from '../../lib/v2/fonts';
import { Header } from '../../components/v2/shell/Header';
import { Footer } from '../../components/v2/shell/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE_URL),
    verification: {
      google: 'XVe25p6uT1qMSLHgXPUlsGdXvp3vOZYbzJWVdebe2IE',
      other: { 'naver-site-verification': 'e76930efabe656cabb6d52a1245c8cf96b150e53' },
    },
  };
}

/** v2 루트 셸 (R3A §12 V2) — 헤더 · 본문 · 푸터. 전 페이지가 이 한 틀을 받는다.
 *  루트 app/layout.tsx 는 children 만 돌려주고 html/body 는 여기서 그린다(next-intl 구조). 전역 404 는 app/not-found.tsx 가 자기 html 을 그린다. */
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  if (!hasLocale(routing.locales, locale)) notFound();
  // V7 성능: 전체 messages(ko 38KB·en 33KB)를 모든 페이지 HTML 에 직렬화하지 않는다. 서버 부품은 getTranslations 로 읽고,
  // 클라이언트 부품이 있는 페이지(홈·노선 목록·정류장)만 자기 네임스페이스로 NextIntlClientProvider 를 한 번 더 감싼다 (lib/v2/client-messages.ts).
  return (
    <html lang={locale} className={fontClassName}>
      <body>
        <NextIntlClientProvider locale={locale} messages={{}}>
          <Header />
          <main className="v2-main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7976139023602789" crossOrigin="anonymous" />
      <GoogleAnalytics gaId="G-ND7JGQ62QX" />
    </html>
  );
}
