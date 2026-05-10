# Round 11 — SEO 메타 + OG/Twitter Card + favicon

> **Date**: 2026-05-10
> **Build**: 56/56 통과

## 변경 파일 목록

### 신규
- `web/lib/seo/metadata.ts` — buildPageMetadata 헬퍼
- `web/app/icon.png` — favicon (512x512, 12KB)
- `web/public/og/seoul-autonomous-og.png` — OG image (1200x630, 964KB)

### 수정
- `web/app/[locale]/layout.tsx` — 하드코딩 alternates/OG/twitter 제거, metadataBase만 유지
- `web/app/[locale]/page.tsx` — generateMetadata 추가 (홈)
- `web/app/[locale]/routes/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/routes/[id]/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/routes/early-morning/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/routes/late-night/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/how-to-ride/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/updates/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/updates/[slug]/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/faq/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/data-source/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/about/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/privacy/page.tsx` — buildPageMetadata 적용
- `web/app/[locale]/terms/page.tsx` — buildPageMetadata 적용
- `web/messages/en.json` — homeTitle, homeDescription 추가
- `web/messages/ko.json` — homeTitle, homeDescription 추가

## 이미지 파일 배치

| 파일 | 경로 | 크기 |
|------|------|------|
| favicon | web/app/icon.png | 12KB (512x512) |
| OG image | web/public/og/seoul-autonomous-og.png | 964KB (1200x630) |

## 페이지별 검증 결과

### /en (홈)
- canonical: `https://seoulautonomous.com/en` ✅
- hreflang en/ko/x-default: ✅
- og:title: "Seoul Autonomous" ✅
- og:description: "Guide to autonomous transportation..." ✅
- og:url: `https://seoulautonomous.com/en` ✅
- og:image + secure_url + width(1200) + height(630) + alt: ✅
- twitter:card: summary_large_image ✅
- twitter:image + alt: ✅

### /ko (홈)
- canonical: `https://seoulautonomous.com/ko` ✅
- hreflang en/ko/x-default: ✅
- og:locale: ko_KR ✅
- og:description: "외국인 관광객을 위한 서울 자율주행 교통 노선 안내" ✅
- 기타 전항목: ✅

### /en/routes
- canonical: `https://seoulautonomous.com/en/routes` ✅
- hreflang: en→/en/routes, ko→/ko/routes, x-default→/en/routes ✅
- og:title: "Routes — Seoul Autonomous" ✅
- 기타 전항목: ✅

### /en/routes/cheonggye-a01 (동적)
- canonical: `https://seoulautonomous.com/en/routes/cheonggye-a01` ✅
- hreflang: en→/en/routes/cheonggye-a01, ko→/ko/routes/cheonggye-a01 ✅
- og:title: "Cheonggye A01 — Seoul Autonomous" ✅
- og:description: "Autonomous bus route Cheonggye A01..." ✅
- 기타 전항목: ✅

### /en/updates/a504-early-morning-start (동적)
- canonical: `https://seoulautonomous.com/en/updates/a504-early-morning-start` ✅
- hreflang: 정상 매칭 ✅
- og:title: "Saebyeok A504 early morning service launched" ✅
- 기타 전항목: ✅

## 이미지 curl 결과

| URL | Status | Content-Type | Size |
|-----|--------|-------------|------|
| /icon.png | 200 | image/png | 12KB |
| /og/seoul-autonomous-og.png | 200 | image/png | 964KB |
| /favicon.ico | 200 | image/x-icon | 26KB |

## 빌드 결과

56/56 정적 페이지 생성 (기존 55 + icon.png 1개)
