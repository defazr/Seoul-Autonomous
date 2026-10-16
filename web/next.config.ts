import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  // 검증용 별도 출력 폴더(NEXT_DIST_DIR=.next-check next build) — 운영 중인 standalone 을 건드리지 않고 두 번째 빌드를 검사할 때만 쓴다. 기본은 .next
  distDir: process.env.NEXT_DIST_DIR || '.next',
  turbopack: {
    root: __dirname,
  },
  devIndicators: false,
};

export default withNextIntl(nextConfig);
