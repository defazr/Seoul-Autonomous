# Round 10 — GSC 등록 전 배포 사이트 Audit

> **Date**: 2026-05-10
> **Target**: https://seoulautonomous.com
> **Scope**: SEO 메타데이터 / 버튼·링크 동작 / 내부 링크 구조
> **Rule**: 코드 수정 없음. 결함 목록 고정만.

---

## A. SEO 메타데이터

### A-1. sitemap.xml ✅

- 48 URLs (24 EN + 24 KO)
- 모든 URL이 `https://seoulautonomous.com` 기준
- 11개 정적 페이지 + 11개 노선 상세 + 2개 업데이트 상세 = 24 per locale
- `lastmod` ISO 형식 정상
- `xhtml:link rel="alternate"` hreflang en/ko 양쪽 포함
- `changefreq` + `priority` 정상 설정

**참고**: MEMORY에 "55 정적 페이지"로 기록되어 있으나, 실제 빌드/sitemap 기준 48개. 수치 차이 확인 필요 (가능 원인: 이전 카운트 방식 차이 또는 미빌드 페이지 포함).

### A-2. robots.txt ✅

```
User-Agent: *
Allow: /
Disallow: /design-preview
Sitemap: https://seoulautonomous.com/sitemap.xml
```

정상.

### A-3. canonical ❌

**모든 페이지에 `<link rel="canonical">` 없음.**

- `/en`, `/en/routes`, `/en/routes/cheonggye-a01` 등 모두 canonical 미출력
- 원인: `layout.tsx`의 `generateMetadata`에 `alternates.canonical` 미설정. 하위 페이지도 미설정.
- Next.js App Router는 `metadataBase` 설정만으로 canonical을 자동 생성하지 않음. 명시적 설정 필요.

**코드 위치**: `web/app/[locale]/layout.tsx:20-36`

**권고**: 각 페이지 또는 layout에서 `alternates.canonical` 추가.

**분류**: 즉시 핫픽스 가능

### A-4. hreflang ⚠️

**HTML `<head>` 내 hreflang이 모든 페이지에서 루트 URL만 가리킴.**

현재 출력 (예: `/en/routes/cheonggye-a01`):
```html
<link rel="alternate" hrefLang="en" href="https://seoulautonomous.com/en" />
<link rel="alternate" hrefLang="ko" href="https://seoulautonomous.com/ko" />
```

기대 출력:
```html
<link rel="alternate" hrefLang="en" href="https://seoulautonomous.com/en/routes/cheonggye-a01" />
<link rel="alternate" hrefLang="ko" href="https://seoulautonomous.com/ko/routes/cheonggye-a01" />
<link rel="alternate" hrefLang="x-default" href="https://seoulautonomous.com/en/routes/cheonggye-a01" />
```

- 원인: `layout.tsx`에서 `alternates.languages`를 `/en`, `/ko`로 하드코딩. 하위 페이지가 이를 오버라이드하지 않아 상속됨.
- `x-default` 미포함.
- **sitemap.xml의 hreflang은 정상** (페이지별 올바른 URL). HTML `<head>` 내 hreflang만 문제.

**코드 위치**: `web/app/[locale]/layout.tsx:30-34`

**권고**: 각 페이지의 `generateMetadata`에서 `alternates.languages`를 해당 페이지 URL로 설정하거나, layout에서 동적으로 현재 경로 기반 생성.

**분류**: 즉시 핫픽스 가능

### A-5. OG / Twitter ⚠️

| 항목 | 상태 | 비고 |
|------|------|------|
| og:title | ✅ | 페이지별 고유 |
| og:description | ✅ | 페이지별 고유 |
| og:site_name | ✅ | "Seoul Autonomous" |
| og:locale | ✅ | en_US / ko_KR |
| og:type | ✅ | "website" |
| og:url | ❌ | 미설정 |
| og:image | ❌ | 미설정 |
| twitter:card | ✅ | "summary" |
| twitter:title | ✅ | |
| twitter:description | ✅ | |
| twitter:image | ❌ | 미설정 |

- `og:url` 미설정 → 공유 시 URL 정규화 불가
- `og:image` 미설정 → SNS 공유 시 썸네일 없음

**권고**: og:url은 canonical과 동일값. og:image는 기본 OG 이미지 1200x630 제작 후 설정.

**분류**: Round 11에서 수정 (이미지 제작 필요)

### A-6. 봇 접근성 ✅

| Bot | URL | Status |
|-----|-----|--------|
| Googlebot/2.1 | /en | 200 |
| Yeti/1.1 | /en | 200 |
| bingbot/2.0 | /en/routes | 200 |
| Googlebot/2.1 | /ko/how-to-ride | 200 |

모든 봇 UA에 대해 200 + 정상 HTML 응답.

---

## B. 버튼 / 링크 / 내부 이동 동작

### B-1. "View all routes" 진단 ❌

**증상**: 홈(`/en`) Hero 섹션의 "View all routes" 버튼 클릭 시 아무 동작 없음.

**원인**: `<Button>` 컴포넌트가 `<Link>` 없이, `onClick` 없이 단독 렌더링.

```tsx
// web/components/home/Hero.tsx:42-45
<div className={styles.ctaRow}>
  <Button variant="primary" size="md" icon={<ArrowRight />}>
    {t('cta')}  // "View all routes"
  </Button>
</div>
```

`Button` 컴포넌트는 `<button type="button">` 렌더링. href 기능 없음.

**KO 동일 여부**: 동일 컴포넌트 사용. `/ko`에서도 동일 증상.

**수정안**: `<Link href={/${locale}/routes}>` 로 감싸기 (CTASection과 동일 패턴).

**분류**: 즉시 핫픽스 가능 (1줄 변경)

### B-2. 동종 패턴 검색

`<Button>` without Link wrapper 패턴 검색 결과:

| 위치 | 상태 | 설명 |
|------|------|------|
| Hero.tsx:43 | ❌ | 네비게이션 의도인데 Link 없음 |
| FeaturedRoutes.tsx:16 | ⚠️ | `<span>` "See all" — 링크여야 하지만 span 렌더링 |
| design-preview/page.tsx | ✅ | 디자인 프리뷰 (비공개), 의도적 |
| CTASection.tsx:14,19 | ✅ | Link로 감싸져 있음 |

**동종 케이스 2개 발견:**
1. **Hero CTA** — dead button (critical)
2. **FeaturedRoutes "See all"** — dead span (medium)

**분류**:
- Hero CTA → 즉시 핫픽스 가능
- FeaturedRoutes "See all" → 즉시 핫픽스 가능

### B-3. 핵심 진입 CTA 동작 확인

| 위치 | 요소 | 동작 | 판정 |
|------|------|------|------|
| Home Hero | "View all routes" Button | 클릭 무반응 | ❌ |
| Home FeaturedRoutes | "See all" span | 클릭 무반응 | ⚠️ |
| Home CTASection | "View all routes" Button+Link | `/${locale}/routes` | ✅ |
| Home CTASection | "How to ride →" Button+Link | `/${locale}/how-to-ride` | ✅ |
| Header desktop nav | Routes / Updates / How to ride / FAQ | `<a>` proper hrefs | ✅ |
| Header logo | Seoul Autonomous | `<a href="/${locale}">` | ✅ |
| Mobile Drawer | 전체 링크 9개 | `<a>` proper hrefs + onClick close | ✅ |
| Footer nav | 7 links + 2 legal | `<a>` proper hrefs | ✅ |
| Back to Top | button | `window.scrollTo(top)` | ✅ |
| /routes 카드 | RouteCard → route detail | `<Link href="/${locale}/routes/${id}">` | ✅ |
| Route detail | "Open in Kakao Map" | `target="_blank" rel="noopener noreferrer"` | ✅ |
| Route detail | "← View all routes" | `<Link href="/routes">` (i18n) | ✅ |
| Early-morning | "View all routes →" | `<Link href="/routes">` (i18n) | ✅ |
| Late-night | "View all routes →" | `<Link href="/routes">` (i18n) | ✅ |

---

## C. 내부 링크 구조

### 링크 그래프 요약 (curl 기반 추출)

```
Home ──→ /routes (via CTASection, FeaturedRoutes cards)
     ──→ /how-to-ride (via CTASection)
     ──→ 4 featured routes (cheonggye-a01, cheongwadae-a01, sangam-a21, simya-a21)
     ──✗ Hero CTA dead

/routes ──→ 11 route detail pages
        ──→ /routes/early-morning
        ──→ /routes/late-night

Route detail ──→ /routes (back link)
             ──✗ 다른 노선으로 가는 링크 없음

/routes/early-morning ──→ 4 새벽 노선 상세 (a148, a160, a504, a741)
                      ──→ /routes
                      ──→ /how-to-ride

/routes/late-night ──→ (동일 패턴, 심야 노선)

/updates ──→ 2 update detail pages

Update detail (a504) ──→ /routes/saebyeok-a504 (관련 노선)

/how-to-ride ──✗ 본문에서 /routes 또는 특정 노선 링크 없음

전역 (Header/Footer): Home, Routes, Updates, How to ride, FAQ, Data source, About, Privacy, Terms
```

### 점검 질문 답변

| 질문 | 답변 | 판정 |
|------|------|------|
| 노선 상세 → 다른 노선 가는 길? | 없음. /routes 복귀만 가능 | ⚠️ |
| 새벽/심야 그룹 ↔ 노선 상세 양방향? | 그룹→상세 ✅, 상세→그룹 ❌ | ⚠️ |
| Updates → 관련 노선 링크? | ✅ (a504 글 → saebyeok-a504) | ✅ |
| How to Ride → 실제 노선 진입? | ❌ 본문에 노선 링크 없음 (header/footer만) | ⚠️ |
| "← Routes로 돌아가기" 컨텍스트 링크? | Route detail에만 있음 ✅ | ✅ |

### Orphan 후보

모든 페이지가 Header/Footer에서 도달 가능하므로 **hard orphan은 없음**. 단, 다음 페이지는 본문 내 contextual link가 빈약:

- **Route detail** — 관련 노선/그룹 cross-link 없음
- **How to Ride** — 노선 페이지로의 contextual 진입점 없음

**분류**: 보류 가능 (SEO 향상 목적이지만 기능적 결함 아님)

---

## 종합 이슈 목록

| # | 섹션 | 심각도 | 이슈 | 분류 |
|---|------|--------|------|------|
| 1 | A-3 | ❌ High | 모든 페이지 canonical 미설정 | 즉시 핫픽스 가능 |
| 2 | A-4 | ⚠️ High | HTML hreflang이 루트 URL만 가리킴 + x-default 없음 | 즉시 핫픽스 가능 |
| 3 | A-5 | ⚠️ Med | og:url / og:image / twitter:image 미설정 | Round 11에서 수정 |
| 4 | B-1 | ❌ Critical | Hero "View all routes" 버튼 dead (Link 없음) | 즉시 핫픽스 가능 |
| 5 | B-2 | ⚠️ Med | FeaturedRoutes "See all" span dead | 즉시 핫픽스 가능 |
| 6 | C | ⚠️ Low | Route detail → 관련 노선/그룹 cross-link 없음 | 보류 가능 |
| 7 | C | ⚠️ Low | How to Ride → 노선 진입 링크 없음 | 보류 가능 |

---

## 권고 수정 순서

### 핫픽스 (포그린 승인 시 즉시 가능)

1. **Hero CTA**: `Hero.tsx` — Button을 Link로 감싸기 (1줄)
2. **FeaturedRoutes "See all"**: span → `<Link href="/${locale}/routes">` (1줄)
3. **canonical 추가**: layout.tsx 또는 각 page의 generateMetadata에 `alternates.canonical` 설정
4. **hreflang 수정**: layout의 하드코딩 제거, 각 page에서 해당 URL 기준 alternates 설정 + x-default 추가

### Round 11

5. **og:url**: canonical과 동일값 설정
6. **og:image / twitter:image**: 1200x630 OG 이미지 제작 + 메타 설정

### 보류 가능

7. Route detail cross-link (디자인 라운드 수반)
8. How to Ride 본문 노선 링크 (콘텐츠 기획 수반)

---

## 기타 참고

- **sitemap.xml hreflang**: 정상 (페이지별 올바른 URL). HTML head만 문제.
- **robots.txt**: 정상.
- **봇 접근성**: Googlebot/Yeti/bingbot 모두 200.
- **페이지 수 불일치**: MEMORY "55페이지" vs 실제 48페이지. 확인 후 MEMORY 수정 필요.
- **`\` 접미사**: curl 추출 시 일부 URL에 `\` 붙음 — HTML 소스 내 이스케이프 잔여물로 추정. 실제 href 동작에는 영향 없음 (브라우저가 처리).
