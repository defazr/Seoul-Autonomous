import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import { routing } from '../../i18n/routing';
import { SITE_URL } from '../../lib/seo/config';
import { geistSans, geistMono, pretendard } from '../../lib/fonts';
import { GlobalHeader } from '../../components/common/GlobalHeader';
import { BackToTopButton } from '../../components/common/BackToTopButton';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(SITE_URL),
    verification: {
      google: 'XVe25p6uT1qMSLHgXPUlsGdXvp3vOZYbzJWVdebe2IE',
      other: {
        'naver-site-verification': 'e76930efabe656cabb6d52a1245c8cf96b150e53',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalHeader />
          {children}
          <BackToTopButton />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-ND7JGQ62QX" />
    </html>
  );
}
