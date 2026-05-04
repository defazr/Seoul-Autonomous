# Round 7B — Route Detail Page Implementation

> Date: 2026-05-04 (session date)
> Status: Complete

## Summary

Route Detail page fully implemented. v1 core 3 pages (Home, Routes, Route Detail) are now complete.

## Files Created

- `web/app/[locale]/routes/[id]/page.tsx` — Route detail page with generateStaticParams
- `web/app/[locale]/routes/[id]/page.module.css` — Page styles
- `web/components/route-detail/RouteDiagram.tsx` — SVG route diagram (outbound/inbound)
- `web/components/route-detail/RouteDiagram.module.css`
- `web/components/route-detail/StopsList.tsx` — Collapsible stops timeline
- `web/components/route-detail/StopsList.module.css`
- `web/components/route-detail/MapLinkButton.tsx` — Kakao Map external link
- `web/components/route-detail/MapLinkButton.module.css`

## Files Modified

- `web/messages/en.json` — Added routeDetail.* and metadata.routeDetail* keys
- `web/messages/ko.json` — Same
- `web/components/ui/RouteCard.tsx` — Changed href from `/route/{id}` to `/{locale}/routes/{id}`

## Key Decisions

### Kakao Map URL Generation
Same as app: `https://map.kakao.com/?q={encodeURIComponent(displayNameKo)}`
Source: `components/ui/MapLinkButtons.tsx` line 14.
No `sourceUrls.kakaoMap` field exists per route — app uses search URL with Korean display name.

### RouteDiagram
- Ported from app's `components/ui/RouteDiagram.tsx`
- react-native-svg (Line/Circle) → standard SVG elements (initial)
- Dot count: min(max(count, 3), 10) — same as app
- Start dot (8px solid) and turnaround dot (10px with accent-hi border) differentiated

### RouteDiagram — 후속 수정 (dot 타원 버그 + 크기 조정)

**1차 버그: dot이 타원으로 렌더됨**
- 원인: `preserveAspectRatio="none"` + SVG `<circle>`. viewBox 200x20이 실제 렌더 폭에 맞춰 스트레치되면서 circle이 가로로 늘어남. 양 끝 dot은 CSS div라 정상, 중간 dot만 SVG 안이라 찌그러짐.
- 수정: SVG 제거, CSS div 기반으로 변경 (bgLine div + midDot div with percentage positioning)
- 사양 변경: 지시서 §2 및 7A audit은 "SVG Line+Circle"을 명시했으나, preserveAspectRatio 값 변경이나 viewBox 동적 계산 같은 SVG 내 해결책을 먼저 검토하지 않고 CSS div로 교체함. 결과적으로 렌더 버그는 해결���었으나 사양에서 벗어난 변경. 다음부터 사양 내 해결책을 먼저 검토하고, 벗어나는 경우 사전 보고.

**2차 조정: 중간 dot 크기**
- Audit 비교:

| 요소 | 앱 | 웹 (수정 전) | 웹 (수정 후) |
|------|-----|-------------|-------------|
| 양 끝 dot | 8px fill | 8px fill | 8px fill (동일) |
| 회차 starDot | 10px fill+border | 10px fill+border | 10px fill+border (동일) |
| 중간 dot | r=3 → 지름 6px outline | 6px outline | **8px outline** |

- 판단: 앱과 수치 동일(6px)이지만, 웹에서는 line이 화면 폭까지 늘어나는데 dot은 6px 고정이라 상대적으로 작아 거의 안 보임. 지시서 §2 기준 "모바일 가독성 우선"에 따라 중간 dot을 8px로 키워 양 끝 dot과 동일 크기로 균형 맞춤.
- 근거: 앱은 width=200 고정이라 6px dot이 적절하지만, 웹은 flex:1로 수백px까지 늘어나므로 동일 6px로는 가독성 부족.

### Polish candidates for future round
- StopsList: animate expand/collapse transition
- RouteDiagram labels: could show station names at endpoints outside SVG

### StopsList
- Collapsed: shows first, turnaround, and last stops (same as app)
- Expanded: shows all stops
- Timeline: CSS vertical line + dots (turnaround uses accent color)
- Stop display: nameEn fallback to nameKo (currently all nameEn are null → Korean shown)

### RouteCard Link
- Minimal change: only href path updated from `/route/{id}` to `/{locale}/routes/{id}`
- No RouteCard refactoring

## generateStaticParams

11 fixed routes x 2 locales = 22 route detail pages.
Total build: 31 static pages.

Routes included:
- saebyeok-a160, saebyeok-a741, saebyeok-a148, simya-a21
- cheonggye-a01, dongjak-a01, dongdaemun-a01, seodaemun-a01
- sangam-a21, cheongwadae-a01, saebyeok-a504

Excluded: gangnam-robotaxi (official_pending), sangam-a01/a02/yeouido-a01 (not in fixedRoutes)

## Verification Results

### Initial verification
| Check | Result |
|-------|--------|
| /en/routes/cheonggye-a01 | 200, "Cheonggye A01" |
| /ko/routes/cheonggye-a01 | 200, "청계A01" |
| /en/routes/INVALID-ID | 404 |
| Kakao Map link | `https://map.kakao.com/?q=청계A01` (encoded) |
| npm run build | Success, 31 pages |
| App files changed | 0 |

### Post-fix verification (dot bug + size adjust)
| Check | Result |
|-------|--------|
| /en/routes/cheonggye-a01 (12 stops) | 200, dot 원형 |
| /ko/routes/cheonggye-a01 | 200 |
| /en/routes/saebyeok-a160 (43 stops) | 200 |
| /ko/routes/saebyeok-a160 | 200 |
| LangToggle | 렌더됨 (EN/KO buttons, next-intl useRouter replace) |
| npm run build | Success |
| App files changed | 0 |

## i18n Keys Added

### routeDetail.*
- back, openInKakaoMap, stopsCount, expandStops, collapseStops, stopsSection
- info.hours, info.days, info.stops, info.verified
- days.weekday, days.weekend, days.daily, days.unknown
- diagram.outbound, diagram.inbound
- disclaimer, footer

### metadata.*
- routeDetailTitle, routeDetailDescription
