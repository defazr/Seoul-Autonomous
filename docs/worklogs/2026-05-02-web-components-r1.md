# Round 4 — Pretendard + 6 Core Components

**Date:** 2026-05-02

---

## Pretendard Font Decision

### Source
- App files: `assets/fonts/Pretendard-Regular.otf`, `-Medium.otf`, `-SemiBold.otf`
- Format: OpenType (.otf), ~1.5MB each
- License: SIL Open Font License 1.1 (LICENSE file included at `web/public/fonts/LICENSE`)

### Approach
- **next/font/local** with .otf files directly
- Files placed at `web/public/fonts/Pretendard-*.otf`
- CSS variable: `--font-pretendard`
- Applied to `<html>` alongside Geist variables

### Why not .woff2
- Conversion requires external tooling (fonttools/woff2)
- .otf works correctly with next/font/local
- Performance difference is minimal for 3 weights (~1.5MB vs ~500KB per weight)
- Can convert in a future optimization round if needed

### Font-family strategy
- `--font-sans`: Geist first, Pretendard fallback (Korean glyphs auto-fall to Pretendard since Geist has no Korean glyphs)
- `--font-kr`: Pretendard first (for explicit Korean-only usage)
- No language detection needed — CSS font fallback handles it automatically

---

## Components Created (6/6)

### Pill + StatusDot (`components/ui/Pill.tsx`)
- Variants: default, accent, success, warning
- StatusDot: inline span with color/size props
- Children rendered directly (no Text wrapper)
- CSS Module: `Pill.module.css`

### Button (`components/ui/Button.tsx`)
- Variants: primary (cyan bg, black text, glow shadow), secondary (bg.3, fg.1), ghost (transparent, fg.2)
- Sizes: sm (32px), md (44px), lg (52px)
- Web additions: hover opacity, focus-visible outline, disabled state, cursor
- CSS Module: `Button.module.css`

### RouteCard (`components/ui/RouteCard.tsx`)
- Props: `{ route: FixedRoute }`
- Wrapped in `next/link` to `/route/[id]`
- Inline SVG icons (BusIcon, ChevronRight)
- Shows: displayName, displayNameKo, startPoint -> endPoint, hours, headway
- StatusPill for verification level (OFFICIAL / VERIFIED)
- Hover: border-color and bg transition
- CSS Module: `RouteCard.module.css`

### RobotaxiCard (`components/ui/RobotaxiCard.tsx`)
- Props: `{ service: OnDemandService }`
- No navigation (official_pending, no link)
- ROBOTAXI type label (mono, accent color)
- Conditional Pill: CHECK BEFORE RIDING (pending) or OFFICIAL
- App tag: "Kakao T (Korean app) required"
- Inline SVG TaxiIcon
- CSS Module: `RobotaxiCard.module.css`

### InfoCard (`components/ui/InfoCard.tsx`)
- Props: `{ label, value, accent? }`
- Unknown values displayed as em dash "—"
- Accent variant: cyan color for value
- Designed for 2x2 grid layout (flex: 1)
- CSS Module: `InfoCard.module.css`

### SegmentedControl (`components/ui/SegmentedControl.tsx`)
- Props: `{ options, value, onChange }`
- `'use client'` directive (interactive state)
- Keyboard accessible: `role="radiogroup"` + `role="radio"` + `aria-checked`
- Active state: cyan bg, black text, glow shadow
- Focus-visible outline
- CSS Module: `SegmentedControl.module.css`

---

## Types

`web/lib/types/route.ts` — copied from app's `lib/types.ts`:
- `FixedRoute` (24 fields)
- `Stop` (5 fields)
- `OnDemandService` (17 fields)

---

## Design Preview Page

`/design-preview` — all 6 components rendered with dummy data:
- Fonts section (Geist English + Pretendard Korean)
- Pill: all 4 variants
- Button: all 3 variants x 3 sizes + disabled
- SegmentedControl: interactive (All/Bus/Robotaxi)
- InfoCard: 2x2 grid with accent and Unknown->dash
- RouteCard: 2 cards (verified + official)
- RobotaxiCard: pending status with app tag

---

## Build Verification

```
▲ Next.js 16.2.4 (Turbopack)
✓ Compiled successfully in 1409ms
✓ TypeScript passed
✓ Static pages generated (5/5)

Route (app)
┌ ○ /
├ ○ /_not-found
└ ○ /design-preview
```

## Dev Server Verification

- `/design-preview` rendered successfully
- All 6 keywords confirmed in HTML output:
  - `Pretendard`, `VERIFIED`, `ROBOTAXI`, `CHECK BEFORE RIDING`, `Primary SM`, `서울 자율주행`
- Korean text renders with Pretendard font family
- English text renders with Geist font family

## Files Created/Modified

All within `web/` directory:
- `lib/fonts.ts` — modified (added Pretendard)
- `app/layout.tsx` — modified (added pretendard variable)
- `app/globals.css` — modified (updated font-family, added button reset)
- `public/fonts/Pretendard-Regular.otf` — new
- `public/fonts/Pretendard-Medium.otf` — new
- `public/fonts/Pretendard-SemiBold.otf` — new
- `public/fonts/LICENSE` — new
- `lib/types/route.ts` — new
- `components/ui/Pill.tsx` + `.module.css` — new
- `components/ui/Button.tsx` + `.module.css` — new
- `components/ui/RouteCard.tsx` + `.module.css` — new
- `components/ui/RobotaxiCard.tsx` + `.module.css` — new
- `components/ui/InfoCard.tsx` + `.module.css` — new
- `components/ui/SegmentedControl.tsx` + `.module.css` — new
- `app/design-preview/page.tsx` + `page.module.css` — new

**App project files modified: 0**
**Pretendard LICENSE file included: Yes**
