# Round 8B — How to Ride Page Implementation

> Date: 2026-05-04
> Status: Complete

## Summary

How to Ride page fully implemented. v1 core 4 pages (Home, Routes, Route Detail, How to Ride) are now complete.

## Files Created

### Page
- `web/app/[locale]/how-to-ride/page.tsx` — Main page with Korean SEO H2 structure
- `web/app/[locale]/how-to-ride/page.module.css` — Page styles
- `web/app/[locale]/how-to-ride/HowToRideClient.tsx` — Client component for SegmentedControl (EN page)

### Components (web/components/how-to-ride/)
- `HeroCard.tsx` + `.module.css` — "Start here" intro card with 3 bullets and icons
- `FAQItem.tsx` + `.module.css` — Accordion Q&A (useState open/close)
- `StepCard.tsx` + `.module.css` — 4-step visual guide card with step-specific icons
- `KakaoCard.tsx` + `.module.css` — Kakao T robotaxi guide (4 steps + note)
- `BulletRow.tsx` + `.module.css` — Check icon + text row

## Files Modified

- `web/messages/en.json` — Added howToRide.* (62 keys + webTitle), metadata.howToRideTitle/Description
- `web/messages/ko.json` — Same
- `web/components/home/CTASection.tsx` — Activated How to Ride link (Button → Link-wrapped Button)

## Key Decisions

### 1. Component Props & Dependencies
| Component | Props | State | Dependencies |
|-----------|-------|-------|-------------|
| HeroCard | title, description, bullets | None | — |
| FAQItem | question, answer[] | useState (open) | 'use client' |
| StepCard | step, title, description | None | — |
| KakaoCard | title, titleKr?, steps[], note, isKo? | None | — |
| BulletRow | text | None | — |

All 5 components placed in `web/components/how-to-ride/` per audit §3 recommendation.
Eyebrow not created as separate component — CSS class used instead.

### 2. i18n Keys
- 62 keys copied from app's `lib/i18n/en.json` and `ko.json` (howToRide.* namespace)
- No interpolation variables in howToRide keys — no i18next→next-intl conversion needed
- New key: `howToRide.webTitle`
  - en: "How to ride" (same as app title)
  - ko: "서울 자율주행버스 타는 법" (SEO optimized)
- New metadata keys: `metadata.howToRideTitle`, `metadata.howToRideDescription`

### 3. Korean H1/H2 Structure
- H1: "서울 자율주행버스 타는 법" (howToRide.webTitle)
- H2 structure (6개):
  1. 자율주행버스와 무인버스, 같은 의미로 검색되는 경우가 많습니다
  2. 서울 자율주행버스 이용 전 확인할 것
  3. 정류장 찾는 방법
  4. 탑승 방법
  5. 카카오T 로보택시 이용 방법
  6. 자주 묻는 질문
- "무인버스" keyword absorbed in H2 #1 and intro text
- HeroCard internal title rendered as `<div>` (not h2) to avoid extra H2

### 4. English Page
- H1: "How to ride" (app howToRide.title as-is)
- Uses SegmentedControl (BUS/TAXI tabs) — same as app
- TAXI tab shows KakaoCard section
- No SEO-specific treatment (per instruction: 영문 SEO 별도 라운드)

### 5. Architecture: Server/Client Split
- Page is Server Component (async, getTranslations)
- SegmentedControl requires useState → extracted to `HowToRideClient.tsx` ('use client')
- Korean page doesn't use SegmentedControl — all content rendered server-side with H2 SEO structure
- Server-rendered sections passed as ReactNode props to client component

## Verification Results

| Check | Result |
|-------|--------|
| /en/how-to-ride | 200, H1: "How to ride" |
| /ko/how-to-ride | 200, H1: "서울 자율주행버스 타는 법" |
| Korean H2 count | 6 (all 6 SEO H2s rendered) |
| LangToggle | Rendered (EN/KO buttons) |
| /en (Home) | 200, unaffected |
| /en/routes | 200, unaffected |
| /en/routes/cheonggye-a01 | 200, unaffected |
| CTASection link | Activated → /[locale]/how-to-ride |
| npm run build | Success, **33 static pages** (31→33) |
| App files changed | 0 |

## 4 Viewport 시각 검증 (375/768/1280/1920)

CSS 구조 분석 기반:

| Viewport | 레이아웃 깨짐 | 가로 스크롤 | 카드 겹침 | CTA/FAQ |
|----------|-------------|-----------|---------|---------|
| 375px | X | X | X | 정상 (FAQ full-width button, toggle flex-shrink:0) |
| 768px | X | X | X | 정상 |
| 1280px | X | X | X | 정상 |
| 1920px | X | X | X | 정상 (max-width 1200px로 동일) |

- StepCard: `flex: 1 1 calc(50% - 5px)`, `min-width: 140px` → 모든 viewport에서 2열 유지
- H1/H2: `@media (max-width: 640px)` 반응형 적용
- 고정 width 요소 없어 오버플로 없음

**Polish 후보:** 데스크탑(1200px+)에서 StepCard 4열(1x4) 배치가 더 적절할 수 있으나, 앱과 동일 패턴(2x2)이므로 현재 유지.

## 마감 전 확인 3건 (포그린 요청)

### metadata 2키 추가 사유
- `metadata.howToRideTitle` / `metadata.howToRideDescription` 추가
- 기존 패턴(routesTitle, routeDetailTitle)과 일관성 위해 추가
- meta title = H1 + " — Seoul Autonomous" suffix → H1과 분리 아닌 suffix 추가. 분리 금지 원칙 준수
- 사전 합의 외 추가였으므로 먼저 보고했어야 함

### HowToRideClient.tsx 신규 파일 사유
- 영어 페이지 SegmentedControl(BUS/TAXI)에 useState 필요 → 'use client' 분리
- page.tsx는 Server Component(async + getTranslations)이므로 클라이언트 상태 불가
- 기존 페이지 영향 없음 (how-to-ride 내부에서만 사용, 한국어 페이지는 미사용)
- 지시서 산출물 목록에 없는 파일이므로 먼저 보고했어야 함

## Static Page Count Change

- Before: 31 pages
- After: 33 pages (+2: /en/how-to-ride, /ko/how-to-ride)

## 네이버 검색 대응용 페이지 확장 후보

- 작업 X
- 확정 X
- 기록만
- 다음 우선순위 후보로 유지

후보:
- /ko/guides/seoul-autonomous-bus — 서울 자율주행버스란?
- /ko/guides/seoul-driverless-bus — 서울 무인버스와 자율주행버스 차이
- /ko/areas/cheonggye — 청계천 자율주행버스 노선
- /ko/areas/gangnam — 강남 자율주행 택시 이용 안내
