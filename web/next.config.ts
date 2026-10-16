import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import legacyRedirects from './data/legacy-redirects.json';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  // 검증용 별도 출력 폴더(NEXT_DIST_DIR=.next-check next build) — 운영 중인 standalone 을 건드리지 않고 두 번째 빌드를 검사할 때만 쓴다. 기본은 .next
  distDir: process.env.NEXT_DIST_DIR || '.next',
  turbopack: {
    root: __dirname,
  },
  devIndicators: false,
  // 옛 URL 영구 이동(R3b) — 표는 data/legacy-redirects.json. 미들웨어(언어 감지)보다 먼저 평가되어 /ko·/en 경로가 한 번에 이동한다.
  async redirects() {
    return legacyRedirects.redirects.map((r) => ({
      source: `/:locale(ko|en)${r.from}`,
      destination: `/:locale${r.to}`,
      permanent: true,
    }));
  },
};

export default withNextIntl(nextConfig);
