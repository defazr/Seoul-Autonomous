# Round 6 — Routes List Page + RobotaxiCard Locale Fix

**Date:** 2026-05-02

---

## RobotaxiCard Locale Fix

### Changes
- Added `locale?: string` prop (default `'en'`)
- Added `labels?: { appRequired, checkBeforeRiding }` prop for i18n labels
- Data switching: `name`, `subName`, `area` swap based on locale (matches app pattern)
- Labels: "Kakao T (Korean app) required" → "Kakao T 필요" in ko; "CHECK BEFORE RIDING" → "탑승 전 확인 필요" in ko
- Labels sourced from app's `lib/i18n/ko.json`

### Verification
- `/ko/routes`: 강남 로보택시 (primary), Gangnam Robotaxi (sub), 강남구 서초구 (area), "Kakao T 필요", "탑승 전 확인 필요"
- `/en/routes`: Gangnam Robotaxi (primary), 강남 로보택시 (sub), Gangnam Station area

---

## Routes Page

### Route: `/[locale]/routes`

### Components
- **SearchBar** (`components/routes/SearchBar.tsx`) — text input with search icon, dark themed, focus border transition
- **RoutesList** (`components/routes/RoutesList.tsx`) — client component with state management for filter + search

### Search Logic
Matches app's `matchQuery` function:
- **FixedRoute fields:** displayName, displayNameKo, startPoint, startPointKo, endPoint, endPointKo
- **OnDemandService fields:** displayName, displayNameKo, serviceArea, serviceAreaKo
- Case-insensitive, whitespace-normalized
- AND with filter (search + segment filter both applied)

### Filter
- SegmentedControl reused from Round 4
- Options: All (both), Bus (fixedRoutes only), Robotaxi (onDemandServices only)
- Labels from i18n: "All"/"전체", "Bus"/"버스", "Robotaxi"/"로보택시"

### Count Ribbon
- StatusDot + "{count} services matching" / "{count}개 노선"
- Dynamic count reflecting search + filter

### Section Labels
- "Verified routes" / "검증된 노선" with zero-padded count
- "Robotaxi services" / "로보택시 서비스"

### Empty State
- Search match: "No routes match" / "검색 결과가 없습니다"
- Filter match: "No services match this filter." / "조건에 맞는 노선이 없습니다."

### Responsive Layout
- Mobile (< 768px): 1-column card list, padding 20px
- Tablet+ (768px): 2-column CSS grid, padding 32px
- Desktop (1280px+): padding 48px
- Container max-width: 1200px

---

## Home CTA Link Activation

- "View All Routes" button now links to `/{locale}/routes`
- Locale preserved: `/en` → `/en/routes`, `/ko` → `/ko/routes`
- "How to Ride" button remains placeholder (no target page yet)

---

## i18n Messages Added

Keys added to both `en.json` and `ko.json`:
- `routes.title`, `routes.count`
- `routes.search.placeholder`, `routes.search.empty`
- `routes.filter.all`, `.bus`, `.robotaxi`
- `routes.section.verified`, `.robotaxi`
- `routes.empty`
- `routes.robotaxi.appRequired`, `.checkBeforeRiding`
- `common.footer`
- `metadata.routesTitle`, `.routesDescription`

---

## Build Result

```
▲ Next.js 16.2.4 (Turbopack)
✓ Compiled successfully in 1395ms
✓ TypeScript passed
✓ Static pages generated (9/9)

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /[locale]
├ ƒ /[locale]/routes
└ ○ /design-preview
```

## Verification

| Test | /en/routes | /ko/routes |
|------|-----------|-----------|
| Page title | Routes | 노선 |
| Search placeholder | Search routes, places | 노선, 지역 검색 |
| RouteCard locale | English primary | Korean primary |
| RobotaxiCard locale | English primary, "Kakao T (Korean app) required" | Korean primary, "Kakao T 필요" |
| Search "cheong"/"청" | Cheonggye, Cheongwadae | 청계, 청와대 |
| Filter Bus | 11 routes | 11 routes |
| Filter Robotaxi | 1 service | 1 service |
| Home CTA → Routes | /en/routes | /ko/routes |

## Files Created/Modified

**New:**
- `components/routes/SearchBar.tsx` + `.module.css`
- `components/routes/RoutesList.tsx` + `.module.css`
- `app/[locale]/routes/page.tsx`

**Modified:**
- `components/ui/RobotaxiCard.tsx` — locale + labels props
- `components/home/CTASection.tsx` — View All Routes link activated
- `messages/en.json`, `messages/ko.json` — routes, common, metadata keys

**App project files modified: 0**
