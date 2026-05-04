# Round 7A — Route Detail / RouteDiagram Pre-Audit

**Date:** 2026-05-02

---

## 1. App Route Detail Screen Structure

**File:** `app/route/[id].tsx` (430 lines)

### Component order (top to bottom)

| # | Section | Component/Pattern | Locale? |
|---|---------|-------------------|---------|
| 1 | TopBar | Inline: back button (40x40 circle) + code badge (mono) + type badge (BUS) + VERIFIED Pill | No (always English badges) |
| 2 | Title | Heading (Bold 32px) + KrLine subname + operator row (if not Unknown) + lastChecked date + disclaimer | Yes — name/subName swap, Pretendard for Ko, formatDate locale |
| 3 | RouteDiagram | RouteDiagram component (SVG) | Yes — outbound/inbound labels i18n, start/end/turn names locale |
| 4 | Info Cards 2x2 | Eyebrow + 2 rows x 2 InfoCardItems | Yes — labels via i18n, formatDays locale, formatDate locale |
| 5 | How to Ride mini | Eyebrow + 3 numbered steps + "Read more" button | Yes — step text via i18n, Pretendard for Ko |
| 6 | Stops List | Eyebrow + StopsList (expand/collapse) | Partial — uses nameEn fallback to nameKo, toggle text i18n |
| 7 | Footer | SensorIcon + date-stamped note | Yes — footer text via i18n with date |
| 8 | Sticky bottom | MapLinkButtons (Kakao Map CTA) | Yes — button label via i18n |

### Section spacing
- `section`: `paddingHorizontal: 20px`, `marginBottom: 32px`
- Eyebrow before each major section
- Divider: none (spacing only)

### Locale handling
- Page level: `isKo = i18n.language === 'ko'`
- Most locale work is page-level data transformation (name swap, formatDate, formatDays)
- InfoCardItem receives `isKo` prop (font switching only)
- StopsList uses `useTranslation()` internally for toggle labels

---

## 2. RouteDiagram Component

**File:** `components/ui/RouteDiagram.tsx` (134 lines)

### Implementation

```
react-native-svg elements used:
- Svg (container with dynamic width/viewBox)
- Line (horizontal route line)
- Circle (stop markers along line)
```

### Props
```typescript
type RouteDiagramProps = {
  stops: Stop[];
  startName: string;
  endName: string;
  turnaroundName: string;
  outboundLabel: string;    // i18n: "청계광장 → 회차점"
  inboundLabel: string;     // i18n: "회차점 → 종점"
};
```

### Structure
- **2-section card** (outbound + divider + inbound)
- Each section: label text (outside SVG) + SVG line with dots + count text (outside SVG)
- **DiagramLine sub-component:** draws a horizontal line with evenly-spaced circle markers

### DiagramLine logic
```typescript
function DiagramLine({ count, width }: { count: number; width: number }) {
  const dotCount = Math.min(Math.max(count, 3), 10); // clamp 3-10
  const spacing = width / (dotCount + 1);
  // Line: x1=0, y1=10, x2=width, y2=10 (horizontal)
  // Circles: evenly spaced along line at cy=10, r=3
}
```

### SVG elements detail
| Element | RN SVG | Web SVG | Mapping |
|---------|--------|---------|---------|
| `<Svg>` | `react-native-svg` Svg | `<svg>` | 1:1, just change tag |
| `<Line>` | x1, y1, x2, y2, stroke, strokeWidth, opacity | Same | 1:1 identical attributes |
| `<Circle>` | cx, cy, r, fill, stroke, strokeWidth | Same | 1:1 identical attributes |

### Coordinate calculation
- **Fixed width:** `width={200}` (hardcoded in app)
- **Fixed height:** `height={20}`, viewBox `0 0 200 20`
- Dot spacing: `width / (dotCount + 1)` — evenly distributed
- **No RN viewport dependency** — all coordinates are within the SVG viewBox

### Colors
- Line: `colors.accent.DEFAULT` (#00D4FF) at opacity 0.4
- Dot fill: `colors.bg[0]` (#000000)
- Dot stroke: `colors.accent.DEFAULT` (#00D4FF)
- All from tokens — no hardcoded colors

### Visual markers
- Start/end dots: 8x8 circles, solid accent color (outside SVG, plain View)
- Turnaround star dot: 10x10 circle, accent fill + accent.hi border (outside SVG)
- Label text and count text: outside SVG, plain Text elements

### Text handling
- All text is **outside** the SVG (React Native Text components, not SVG text)
- No font rendering inside SVG

---

## 3. Web SVG Migration Difficulty

### Difficulty: **LOW**

### Rationale

1. **SVG elements used:** Only `Line` and `Circle` — the simplest SVG primitives. No `Path`, `LinearGradient`, `Text`, `ClipPath`, or complex shapes.

2. **1:1 RN → Web mapping:** `react-native-svg` `<Line>` and `<Circle>` use identical attributes as standard web `<svg>` children. Just change `<Svg>` to `<svg>`, `<Line>` to `<line>`, `<Circle>` to `<circle>`.

3. **No viewport dependency:** Coordinates are fixed within a 200x20 viewBox. No Dimensions API, no useWindowDimensions, no LayoutAnimation.

4. **No text inside SVG:** All labels/counts are plain HTML elements, not SVG text. No font rendering complexity.

5. **Responsive concern:** The 200px width is hardcoded. On web, the SVG container uses `flex: 1` so the parent dictates width. For web, change to `width="100%"` + percentage-based viewBox, or use a container div with CSS and keep viewBox fixed. Either approach is trivial.

6. **No gradients, no animations, no interactivity.**

### Only change needed
- `width={200}` → make responsive (100% of container)
- Can use `preserveAspectRatio="none"` or calculate viewBox dynamically

---

## 4. InfoCard Locale (Round 5.5 Residual)

### App InfoCardItem locale logic
- Accepts `isKo?: boolean` prop
- **Font only:** `isKo && styles.valueKo` → switches to `Pretendard-SemiBold`
- Label and value text come from parent (page-level i18n)
- No data switching inside the component

### Web InfoCard current state
- No `isKo` prop — uses CSS font-family fallback
- CSS fallback (`--font-sans` includes Pretendard) handles Korean glyphs automatically
- **Impact: minimal.** Korean text already renders in Pretendard via CSS fallback. Explicit font-weight switching to Pretendard-SemiBold is a polish item, not a functional gap.

### What to fix in Round 7B
- Label values come from i18n → page provides them in correct language
- formatDays, formatHours, formatDate already localized at page level
- No InfoCard component modification strictly needed — labels/values are already strings passed in

### i18n keys needed (from app)
- `routeDetail.info.hours` → "Hours" / "운영 시간"
- `routeDetail.info.days` → "Days" / "운영 요일"
- `routeDetail.info.stops` → "Stops" / "정류장"
- `routeDetail.info.verified` → "Verified" / "검증일"
- `routeDetail.days.weekday` → "Mon–Fri" / "월–금"
- `routeDetail.days.weekend` → "Sat–Sun" / "토–일"
- `routeDetail.days.daily` → "Daily" / "매일"
- `routeDetail.days.unknown` → "—" / "—"
- `routeDetail.stops.count` → "{count} stops" / "{count}개 정류장"

---

## 5. StopsList Component

**File:** `components/ui/StopsList.tsx` (164 lines)

### Props
```typescript
type StopsListProps = {
  stops: Stop[];
};
```

### State management
- `useState(false)` for expanded/collapsed
- Collapsed: shows 3 stops (first, turnaround, last)
- Expanded: shows all stops

### Stop display
- Seq number: 2-digit padded ("01", "02", ...)
- Name: `stop.nameEn || stop.nameKo` (English preferred, Korean fallback)
- Korean sub-name: shown only if `stop.nameEn` exists (currently all `nameEn` are null → only Korean names display)
- **v1 reality:** All stops show Korean-only since `nameEn` is null across all 307 stops

### Visual pattern
- Timeline: vertical line (1px border.2) with dots (10x10 circles)
- Turnaround dot: 12x12, accent border, accent.faint fill
- First/last: hidden top/bottom line segments
- Toggle button: "Show all 28 stops" / "Show fewer stops"

### i18n
- Uses `useTranslation()` internally
- `routeDetail.stops.showAll` → "Show all {count} stops"
- `routeDetail.stops.hide` → "Show fewer stops"

### Web migration notes
- Replace Pressable → button
- Replace View/Text → div/span
- StyleSheet → CSS Module
- useState works identically in React web
- Timeline can be pure CSS (border-left + pseudo-elements for dots)

---

## 6. Kakao Map Link

### URL pattern
```
https://map.kakao.com/?q={encodeURIComponent(displayNameKo)}
```

### Data source
- Uses `route.displayNameKo` as search query
- No coordinates, no route ID, no deep link — just a text search
- Same URL for both en and ko pages (always Korean search query for Kakao Map)

### Button
- Primary accent button (cyan bg, black text, glow shadow)
- Sticky at bottom of scroll (outside ScrollView)
- Label: `t('routeDetail.maps.kakao')` → "Open in Kakao Map" / "카카오맵에서 보기"
- Icon: IconNav (navigation arrow)

### Web implementation
- `<a href={url} target="_blank" rel="noopener noreferrer">` — standard link
- Can reuse Button component with `variant="primary"`
- Sticky: `position: sticky; bottom: 0;` CSS
- No Linking API needed — just `<a>` tag

---

## 7. /[locale]/routes/[id] Routing

### generateStaticParams
```typescript
export function generateStaticParams() {
  const routes = getVerifiedRoutes(); // 11 routes
  const locales = ['en', 'ko'];
  return locales.flatMap(locale =>
    routes.map(route => ({ locale, id: route.id }))
  );
}
// = 22 static pages (11 routes x 2 locales)
```

### Robotaxi exclusion
- `gangnam-robotaxi` is `official_pending` → no detail page
- Only `fixedRoutes` get detail pages
- `getVerifiedRoutes()` already filters correctly

### Invalid id
- `notFound()` if route not found by id

### Metadata
```typescript
export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'routeDetail' });
  const route = getRouteById(id);
  return {
    title: `${route.displayName} — Seoul Autonomous`,
    description: t('metaDescription', { name: route.displayName }),
  };
}
```

---

## Round Split Recommendation

### **Option A: Single Round (Round 7B only)** — RECOMMENDED

### Rationale

1. **RouteDiagram difficulty: LOW**
   - Only 2 SVG primitives (Line, Circle)
   - No viewport calculations, no gradients, no animations
   - Fixed coordinates within viewBox
   - All text outside SVG
   - Estimated effort: ~30 minutes

2. **StopsList: straightforward**
   - Pure CSS timeline (no SVG needed)
   - useState expand/collapse identical to React web
   - Estimated effort: ~30 minutes

3. **MapLinkButtons: trivial**
   - `<a>` tag with Button component styling
   - Sticky bottom with CSS
   - Estimated effort: ~15 minutes

4. **InfoCard: no component change needed**
   - Labels/values are i18n strings from page
   - CSS font fallback handles Korean
   - Just need i18n message keys

5. **Page-level work**
   - TopBar (back button + badges) — inline, no shared component needed
   - Title section — standard HTML
   - How to Ride mini section — numbered list, similar to existing patterns
   - formatDate helper — copy from app
   - Estimated effort: ~45 minutes

6. **Total estimated scope:** ~2 hours for a single round
   - Within normal round capacity
   - No high-risk items
   - All patterns already established in Rounds 4-6

### Risk factors
- None identified. All components use simple patterns with established precedents.

### Verification points
- 11 route pages render in both en/ko (22 total)
- RouteDiagram SVG renders correctly (line + dots)
- StopsList expand/collapse works
- Kakao Map link opens correctly
- InfoCard 2x2 grid with localized labels
- Invalid route ID → 404
- Mobile + desktop responsive

### Why NOT Option B (split)?
- RouteDiagram is too simple to warrant its own round
- Splitting would add overhead (new audit, new worklog) for ~30 minutes of work
- No complex state management, no external dependencies, no API calls
