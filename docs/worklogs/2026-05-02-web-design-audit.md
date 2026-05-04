# Audit Round 1 — App v1 Design to Next.js Web Migration Audit

**Date:** 2026-05-02
**Scope:** audit-only, no code changes
**Purpose:** Catalog the Expo app v1 design system for Next.js web reimplementation

---

## 1. Design Tokens

### Source file: `lib/design/tokens.ts` (full)

```typescript
// Design tokens — aligned with colors_and_type.css (design source of truth)

export const colors = {
  // Backgrounds (deepest -> highest elevation)
  bg: {
    0: '#000000',  // page void / map base
    1: '#0A0A0A',  // primary surface
    2: '#111111',  // card / sheet
    3: '#1A1A1A',  // raised card
    4: '#1F1F1F',  // hovered card
  },
  // Foregrounds
  fg: {
    1: '#FFFFFF',  // primary text, headlines
    2: '#EDEDED',  // secondary text, dense body
    3: '#A1A1A1',  // tertiary, captions, labels
    4: '#8F8F8F',  // quaternary, hint
    5: '#555555',  // disabled
  },
  // Borders / strokes
  border: {
    1: '#1F1F1F',  // hairline card border
    2: '#2E2E2E',  // visible border
    3: '#454545',  // hovered/focused
  },
  // Accent — Electric Cyan
  accent: {
    DEFAULT: '#00D4FF',
    hi: '#5BE6FF',     // lighter, hover
    lo: '#0099BF',     // deeper, pressed
    glow: 'rgba(0, 212, 255, 0.32)',
    faint: 'rgba(0, 212, 255, 0.10)',
  },
  // Status / semantic
  status: {
    success: '#45A557',  // on-route, operational
    warning: '#FFB224',  // delay, caution
    danger: '#E5484D',   // offline, error
    info: '#0072F5',     // informational blue
  },
};

// Spacing scale (4pt)
export const spacing = {
  1: 4,   2: 8,   3: 12,  4: 16,
  5: 20,  6: 24,  7: 32,  8: 40,
  9: 48,  10: 64,
  // Semantic aliases
  screenPadding: 20,
  cardPadding: 16,
  cardGap: 12,
  sectionGap: 32,
};

// Border radius
export const radius = {
  xs: 4,   sm: 6,   md: 8,   lg: 12,
  xl: 16,  '2xl': 24,  pill: 999,
};

// Shadows (iOS shadowX props + Android elevation)
export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.4, shadowRadius: 2, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 6 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.7, shadowRadius: 48, elevation: 12 },
  glow: { shadowColor: '#00D4FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.32, shadowRadius: 24, elevation: 8 },
  inner: { /* RN doesn't support inset shadows natively; handled via border/overlay */ },
};

// Typography
export const fonts = {
  sans: 'Geist',
  mono: 'GeistMono',
  kr: 'Pretendard',
};

export const typography = {
  display: { fontFamily: 'Geist-Bold', fontSize: 40, lineHeight: 44, letterSpacing: -0.02 * 40 },
  h1:      { fontFamily: 'Geist-SemiBold', fontSize: 32, lineHeight: 36, letterSpacing: -0.02 * 32 },
  h2:      { fontFamily: 'Geist-SemiBold', fontSize: 24, lineHeight: 28, letterSpacing: -0.02 * 24 },
  h3:      { fontFamily: 'Geist-SemiBold', fontSize: 20, lineHeight: 24 },
  title:   { fontFamily: 'Geist-Medium', fontSize: 17, lineHeight: 22 },
  body:    { fontFamily: 'Geist-Regular', fontSize: 15, lineHeight: 22 },
  bodyMd:  { fontFamily: 'Geist-Medium', fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: 'Geist-Regular', fontSize: 13, lineHeight: 18 },
  label:   { fontFamily: 'Geist-Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.08 * 12, textTransform: 'uppercase' },
  mono:    { fontFamily: 'GeistMono-Medium', fontSize: 13, lineHeight: 18 },
  monoLg:  { fontFamily: 'GeistMono-Medium', fontSize: 16, lineHeight: 20 },
};
```

### Token classification

| Category | Tokens | Count |
|----------|--------|-------|
| Colors — bg | bg.0 ~ bg.4 | 5 |
| Colors — fg | fg.1 ~ fg.5 | 5 |
| Colors — border | border.1 ~ border.3 | 3 |
| Colors — accent | DEFAULT, hi, lo, glow, faint | 5 |
| Colors — status | success, warning, danger, info | 4 |
| Spacing | 1~10 + 4 semantic aliases | 14 |
| Radius | xs, sm, md, lg, xl, 2xl, pill | 7 |
| Shadows | sm, md, lg, glow, inner | 5 |
| Typography | 11 presets | 11 |

### Web CSS variable migration feasibility

- **Colors, spacing, radius:** Direct 1:1 mapping to CSS custom properties. All values are raw hex/rgba/px. No conversion needed.
- **Shadows:** RN uses `shadowColor + shadowOffset + shadowOpacity + shadowRadius + elevation`. Web needs `box-shadow`. Conversion formula: `box-shadow: offsetX offsetY blur rgba(color, opacity)`. `glow` maps to `0 0 24px rgba(0,212,255,0.32)`. `elevation` is Android-only, ignored on web.
- **Typography:** `fontSize`/`lineHeight` in px directly usable. `letterSpacing` is in px (RN computes as fraction * fontSize). Web CSS `letter-spacing` is also in px/em — values port directly.
- **Verdict:** All tokens can be mapped 1:1 to CSS variables with no loss.

---

## 2. Fonts

### Font families in use

| Family | Weights | Format | File |
|--------|---------|--------|------|
| Geist | Regular (400), Medium (500), SemiBold (600), Bold (700) | .otf | `assets/fonts/Geist-*.otf` |
| GeistMono | Medium (500) | .otf | `assets/fonts/GeistMono-Medium.otf` |
| Pretendard | Regular (400), Medium (500), SemiBold (600) | .otf | `assets/fonts/Pretendard-*.otf` |

### Font loading method (app)

- `expo-font` + `useFonts()` hook in `app/_layout.tsx`
- Loaded at app root with `SplashScreen.preventAutoHideAsync()` gating
- 8 font files loaded in total

### Language branch logic

- English UI: `Geist-*` for all text, `GeistMono-Medium` for monospace elements
- Korean UI: `Pretendard-*` replaces Geist for body/heading text
- Branch pattern: `isKo && { fontFamily: 'Pretendard-*' }` applied per component
- Monospace (GeistMono) is NOT switched for Korean

### Next.js migration plan

- **Geist:** Vercel's official font. Available via `next/font/google` or `@vercel/geist`. Confirmed open-source (SIL Open Font License). No licensing issue.
- **GeistMono:** Same package as Geist. Available via `next/font/google` or `@vercel/geist`.
- **Pretendard:** Open-source (SIL OFL). Available via CDN (`cdn.jsdelivr.net/gh/orioncactus/pretendard`), npm (`pretendard`), or self-hosted `.otf` files. Can use `next/font/local` with the existing .otf files.
- **Strategy:** Use `next/font` with `variable` CSS custom property approach:
  - `--font-geist-sans` for Geist
  - `--font-geist-mono` for GeistMono
  - `--font-pretendard` for Pretendard
  - Apply via Tailwind `fontFamily` config

---

## 3. Color System

### Background hierarchy (dark navy scale)

| Token | Hex | Usage |
|-------|-----|-------|
| bg.0 | `#000000` | Page void, map base, deepest background |
| bg.1 | `#0A0A0A` | Primary surface (Settings screen uses this) |
| bg.2 | `#111111` | Card body, sheet, search bar, toggle containers |
| bg.3 | `#1A1A1A` | Raised card, icon wraps, toggle active bg |
| bg.4 | `#1F1F1F` | Hovered card, LangToggle active state |

**Note:** The app is NOT "dark navy" (#0A1428) — it's pure dark/near-black. The navy tone (#0A1428) is used only for the app icon/splash background.

### Accent: Electric Cyan

| Token | Value | Usage |
|-------|-------|-------|
| accent.DEFAULT | `#00D4FF` | Primary CTA, active segment, accent text, glow source, StatusDot default |
| accent.hi | `#5BE6FF` | Lighter variant, hover states, starDot border |
| accent.lo | `#0099BF` | Deeper variant, pressed states |
| accent.glow | `rgba(0,212,255,0.32)` | Box-shadow glow effect |
| accent.faint | `rgba(0,212,255,0.10)` | Subtle accent background (badges, bullet icons, accent Pill bg) |

### Text color hierarchy

| Level | Token | Hex | Usage |
|-------|-------|-----|-------|
| Primary | fg.1 | `#FFFFFF` | Headlines, primary text, active labels |
| Secondary | fg.2 | `#EDEDED` | Body text, step text, bullet text, sub-labels |
| Tertiary | fg.3 | `#A1A1A1` | Captions, Korean subtext (KrLine), section labels, meta text |
| Quaternary | fg.4 | `#8F8F8F` | Hints, disabled-ish, stop sequence numbers, footer text |
| Disabled | fg.5 | `#555555` | Fully disabled, separator dots, inactive stop dots |

### Semantic/status color mapping

| Color | Hex | Components |
|-------|-----|------------|
| Success green | `#45A557` | Pill `success` variant, StatusDot in "OFFICIAL" pills |
| Warning amber | `#FFB224` | Pill `warning` variant, StatusDot in "CHECK BEFORE RIDING" pills, disclaimer text |
| Danger red | `#E5484D` | Defined but not used in v1 |
| Info blue | `#0072F5` | Defined but not used in v1 |

### Component-specific color patterns

- **Pill:** 4 variants (default, accent, success, warning). Each has `color`, `borderColor` (40% opacity), `backgroundColor` (10% opacity).
- **Card:** bg.2 background, border.1 hairline border. `live` variant adds cyan glow border.
- **StatusDot:** Accepts any color prop, defaults to accent cyan `#00D4FF`.
- **SegmentedControl active segment:** bg = accent.DEFAULT, text = `#000000`, glow shadow.
- **Button primary:** bg = accent.DEFAULT, text = `#000000`, glow shadow.
- **MapLinkButtons:** Primary button style (accent bg, black text, glow).

---

## 4. Core Component Patterns

### 4.1 Pill + StatusDot

**Files:** `components/ui/Pill.tsx`, `components/ui/StatusDot.tsx`

**Pill props:**
```typescript
type PillProps = {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning';
};
```

**StatusDot props:**
```typescript
type StatusDotProps = {
  color?: string;  // default '#00D4FF'
  size?: number;   // default 6
};
```

**Visual:** `flexDirection: row`, `gap: 6`, `paddingVertical: 4`, `paddingHorizontal: 10`, `borderRadius: 999` (pill shape), `borderWidth: 1`. Each variant defines its own color/borderColor/backgroundColor triplet.

**Usage:** RouteCard (StatusPill), RobotaxiCard, Route Detail topbar.

**Web notes:** No RN-specific APIs. StatusDot is just a div with border-radius: 50%. Comment mentions pulse animation (not implemented). Straightforward CSS port.

### 4.2 RouteCard

**File:** `components/ui/RouteCard.tsx`

**Props:**
```typescript
type RouteCardProps = {
  route: FixedRoute;
  onPress?: () => void;
};
```

**Structure:** Card wrapper > row layout (icon glyph 44x44 | content area | chevron). Content: topRow (name + StatusPill), KrLine subname, route line (start -> end), meta row (hours, headway).

**Visual:** Card (bg.2, border.1, radius.lg, padding 16). Icon glyph: 44x44, radius 10, bg.3, border.2. Monospace meta text.

**RN dependencies:** `useRouter` (expo-router), `Pressable` (via Card). Navigates to `/route/${route.id}`.

**Web notes:** Replace expo-router `useRouter` with next/navigation. Pressable -> button/a tag. Layout is standard flexbox.

### 4.3 RobotaxiCard

**File:** `components/ui/RobotaxiCard.tsx`

**Props:**
```typescript
type RobotaxiCardProps = {
  service: OnDemandService;
};
```

**Structure:** Similar to RouteCard but without chevron/navigation. Adds "ROBOTAXI" type label (GeistMono, accent color), conditional warning/success Pill, and `appTag` badge ("Kakao T required").

**Visual:** Same Card wrapper. No onPress navigation (official_pending status). appTag: bg.3, border.2, radius 6, small accent dot + text.

**Web notes:** No navigation dependency. Simpler than RouteCard.

### 4.4 InfoCardItem

**File:** `components/ui/InfoCardItem.tsx`

**Props:**
```typescript
type InfoCardItemProps = {
  label: string;
  value: string;
  accent?: boolean;
  isKo?: boolean;
};
```

**Visual:** `flex: 1` (used in 2-column grid), bg.2, border.1, radius.lg, padding 14. Label: uppercase Geist-Medium 11px fg.3. Value: Geist-SemiBold 18px fg.1 (or accent color). Used in 2x2 grid on Route Detail.

**Web notes:** Pure layout, no RN dependencies. Tailwind grid/flex port.

### 4.5 StepCard

**File:** `components/ui/StepCard.tsx`

**Props:**
```typescript
type StepCardProps = {
  step: number;
  title: string;
  description: string;
  isKo?: boolean;
};
```

**Visual:** `flexBasis: 48%` (2-column flow), bg.2, border.1, radius.lg, padding 16. Icon wrap 36x36. Step label (mono "STEP 01"). Title + description.

**RN dependencies:** `react-native-svg` for step 3 phone icon (inline SVG). Other icons from `icons.tsx` also use `react-native-svg`.

**Web notes:** Replace `react-native-svg` with standard `<svg>` elements. Layout uses `flexBasis` -> Tailwind `basis-[48%]` or CSS grid.

### 4.6 KakaoCard

**File:** `components/ui/KakaoCard.tsx`

**Props:**
```typescript
type KakaoCardProps = {
  title: string;
  titleKr?: string;
  steps: string[];
  note: string;
  isKo?: boolean;
};
```

**Visual:** bg.2, border.1, radius 14, padding 20. Header with icon wrap (accent.faint bg, accent border) + title. Numbered step list (number circles 22x22 with mono text). Note at bottom (fg.4).

**RN dependencies:** `react-native-svg` for PhoneIcon. `KrLine` component.

**Web notes:** PhoneIcon SVG needs standard web SVG. Rest is plain div/text.

### 4.7 HeroCard

**File:** `components/ui/HeroCard.tsx`

**Props:**
```typescript
type HeroCardProps = {
  title: string;
  description: string;
  bullets: string[];
  isKo?: boolean;
};
```

**Visual:** bg.2, cyan-tinted border (rgba 0.25), radius 14, padding 20. "START HERE" badge (pill shape, mono text, accent color). Bullet list with circular icons (24x24, accent.faint bg, accent border).

**RN dependencies:** `react-native-svg` icons (IconQR, IconCheck, IconSensor).

**Web notes:** All SVG icons need web SVG. Consider using Lucide React (web version). Badge and bullets are standard flexbox.

### 4.8 Button

**File:** `components/ui/Button.tsx`

**Props:**
```typescript
type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
};
```

**Variants:**
| Variant | BG | Text | Border | Shadow |
|---------|-----|------|--------|--------|
| primary | accent.DEFAULT (#00D4FF) | #000000 | accent.DEFAULT | glow |
| secondary | bg.3 | fg.1 | border.2 | none |
| ghost | transparent | fg.2 | border.2 | none |

**Sizes:** sm (h32, px12, 13px), md (h44, px16, 15px), lg (h52, px20, 16px).

**Visual:** radius.md (8px), borderWidth 1, flexDirection row, gap 8, centered.

**Web notes:** `Pressable` -> `<button>`. Add `cursor: pointer`, hover/active states (not implemented in RN version). Consider adding `transition` for hover effects on web.

### 4.9 SegmentedControl

**File:** `components/ui/SegmentedControl.tsx`

**Props:**
```typescript
type SegmentedControlProps = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
};
```

**Visual:** Container: bg.2, border.1, radius 10, padding 4, gap 4. Each segment: h36, radius 7. Active: accent.DEFAULT bg, #000 text, cyan glow shadow.

**Web notes:** Pressable -> button. Add hover state. Consider `transition` for smooth active state change. No RN dependencies.

### 4.10 LangToggle

**File:** `components/ui/LangToggle.tsx`

**Props:** None (self-contained, reads i18n state).

**Visual:** Pill-shaped container (radius 999): bg.2, border.1, padding 2. Buttons: radius 999, paddingV 5, paddingH 12. Active: bg.4 background, fg.1 text. Inactive: fg.4 text.

**Web notes:** Replace `i18n.changeLanguage()` with Next.js locale routing (`/en`, `/ko`). Consider whether this becomes a route change or client-side toggle.

### Additional components (not in audit scope but cataloged)

| Component | File | Description |
|-----------|------|-------------|
| Card | `components/ui/Card.tsx` | Base card wrapper. Pressable, bg.2, border.1, radius.lg, p16. `live` variant adds cyan glow. |
| KrLine | `components/ui/KrLine.tsx` | Korean subtitle text. Pretendard-Regular, fg.3, 13/18. |
| Eyebrow | `components/ui/Eyebrow.tsx` | Section label. Geist-Medium 12px, uppercase, fg.3, letter-spacing 1.2px. |
| SectionHeader | `components/ui/SectionHeader.tsx` | Section title with optional "See all" action. Geist-SemiBold 20px. |
| BulletRow | `components/ui/BulletRow.tsx` | Bullet or check item. Check wrap: 18x18 circle, accent.faint bg. |
| FAQItem | `components/ui/FAQItem.tsx` | Accordion. Question: SemiBold 16px. Toggle button: 28x28 circle, bg.3. Plus/Minus icons. |
| RouteDiagram | `components/ui/RouteDiagram.tsx` | SVG line diagram with dots. Uses react-native-svg Line/Circle. |
| StopsList | `components/ui/StopsList.tsx` | Timeline view. Dots on vertical line. Expandable (show 3 summary / full list). |
| MapLinkButtons | `components/ui/MapLinkButtons.tsx` | Sticky bottom CTA. Kakao Map link. Accent bg button with glow. |
| TopBar | `components/layout/TopBar.tsx` | Back button (40x40 circle) + title. Exists but unused in v1 (screens use inline headers). |

---

## 5. Screen Structure (IA)

### 5.1 Home (`app/(tabs)/index.tsx`)

| Order | Element | Component/Pattern |
|-------|---------|-------------------|
| 1 | Header | Logo mark (32x32 icon) + "Seoul Autonomous" + LangToggle |
| 2 | Hero | Badge pill ("12 VERIFIED ROUTES") + large title (Geist-Bold 36px) + description + CTA Button |
| 3 | Featured Routes | SectionHeader ("Featured" + "See all") + 4x RouteCard (FEATURED_IDS hardcoded) |
| 4 | Footer | Sensor icon + disclaimer text |

**Layout:** ScrollView, screenPadding (20px), sectionGap (32px) between sections.

### 5.2 Routes (`app/(tabs)/routes.tsx`)

| Order | Element | Component/Pattern |
|-------|---------|-------------------|
| 1 | Header | Page title (Geist-Bold 32px) |
| 2 | Search bar | TextInput with search icon, bg.2, radius 12, h44 |
| 3 | SegmentedControl | All / Bus / Robotaxi filter |
| 4 | Count ribbon | StatusDot + "12 ROUTES AVAILABLE" (mono text) |
| 5 | Verified section | Section label (uppercase) + count badge + RouteCard list |
| 6 | Robotaxi section | Section label + RobotaxiCard list |
| 7 | Empty state | Centered text (when no results) |
| 8 | Footer | Sensor icon + disclaimer |

**Search logic:** Matches displayName, displayNameKo, startPoint, startPointKo, endPoint, endPointKo (case-insensitive, whitespace-normalized).

### 5.3 Route Detail (`app/route/[id].tsx`)

| Order | Element | Component/Pattern |
|-------|---------|-------------------|
| 1 | TopBar | Back button (40x40 circle) + code badge + type badge + VERIFIED Pill |
| 2 | Title section | Heading (Geist-Bold 32px) + KrLine + operator row + checked date + disclaimer |
| 3 | RouteDiagram | SVG line with dots showing outbound/inbound stops |
| 4 | Info Cards 2x2 | Eyebrow + 2 rows x 2 InfoCardItems (Hours, Days, Stops, Verified) |
| 5 | How to Ride mini | Eyebrow + 3 numbered steps + "Read more" button |
| 6 | Stops List | Eyebrow + StopsList (timeline, expandable) |
| 7 | Footer | Sensor icon + date-stamped note |
| 8 | Sticky bottom | MapLinkButtons (Kakao Map CTA, always visible) |

**Layout:** Stack screen (not tab), SafeArea insets, ScrollView content + sticky bottom MapLinkButtons outside scroll.

### 5.4 How to Ride (`app/(tabs)/how-to-ride.tsx`)

| Order | Element | Component/Pattern |
|-------|---------|-------------------|
| 1 | Header | Page title (Geist-Bold 32px) |
| 2 | SegmentedControl | Bus / Robotaxis tab |
| 3 | HeroCard | "START HERE" badge + title + description + 3 bullets |
| 4 | FAQ section | Eyebrow + 5x FAQItem (accordion) |
| 5 | Steps section | Eyebrow + 2x2 StepCard grid (flexWrap) |
| 6 | Kakao section | Eyebrow + KakaoCard (TAXI tab only) |
| 7 | Tips section | Eyebrow + tips card (4x BulletRow with checks) |
| 8 | Footer | Sensor icon + disclaimer |

### 5.5 Settings (`app/(tabs)/settings.tsx`)

| Order | Element | Component/Pattern |
|-------|---------|-------------------|
| 1 | Header | Title (Geist-SemiBold 28px) + KrLine subtitle |
| 2 | Language group | Eyebrow + Group card > Row with LangSwitch |
| 3 | About group | Eyebrow + Group card > Version row + Verified date row |
| 4 | About note | Small fg.4 text below group |
| 5 | Legal group | Eyebrow + Group card > Privacy Policy row + Terms of Use row (chevron links) |
| 6 | Footer | Centered mono text |

**Unique:** Uses bg.1 (#0A0A0A) as page background instead of bg.0 (#000000). Settings-specific LangSwitch differs from LangToggle (accent bg active, mono font, more compact).

### 5.6 Legal (`app/legal/privacy.tsx`, `app/legal/terms.tsx`)

| Order | Element | Component/Pattern |
|-------|---------|-------------------|
| 1 | TopBar | Back button (40x40) + document title text |
| 2 | Document title | Geist-Bold 28px heading |
| 3 | Dates | Effective date + last updated (caption 13px) |
| 4 | Sections | H2 (SemiBold 20px) > paragraphs > bullet lists > subsections (H3 Medium 16px) |
| 5 | Contact block | Developer name + email + location |

**Renderer:** `components/legal/LegalDocumentScreen.tsx` — generic renderer that accepts a `LegalDocument` object. Supports `**bold**` markdown in paragraphs.

---

## 6. RN-Specific Dependencies

### Must-replace items

| RN Dependency | Usage | Web Replacement |
|---------------|-------|-----------------|
| `expo-router` (Stack, Tabs, useRouter, useLocalSearchParams) | All navigation | `next/navigation` (App Router) |
| `react-native` View/Text/ScrollView/Pressable/TextInput | All UI | `div`/`p`/`span`/`button`/`input` + Tailwind |
| `react-native-svg` (Svg, Path, Circle, Rect, Line) | 20+ custom icons, RouteDiagram | Standard `<svg>` elements or `lucide-react` |
| `react-native-safe-area-context` (useSafeAreaInsets) | Top padding on all screens | Not needed on web (CSS handles viewport) |
| `expo-status-bar` | StatusBar style="light" | `<meta name="theme-color">` or not needed |
| `expo-font` / `expo-splash-screen` | Font loading + splash | `next/font` (built-in) |
| `react-native` StyleSheet.create | All styles | Tailwind CSS classes |
| `react-native` Linking.openURL | Kakao Map link | `window.open()` or `<a href>` |
| `react-native` ActivityIndicator | Loading state | CSS spinner or skeleton |

### Icons analysis

**Current:** 20 custom SVG icons in `components/ui/icons.tsx`, all using `react-native-svg`. Pattern: `Svg viewBox="0 0 24 24"` + `Path`/`Circle`/`Rect`/`Line`.

**Web option 1 — Direct SVG:** Convert to `<svg>` JSX. Minimal effort, exact visual match. Recommended.

**Web option 2 — Lucide React (web):** The icons visually resemble Lucide icons. Potential matches:
- IconHome -> Home, IconRoute -> Route, IconHelp -> CircleHelp
- IconSettings -> Settings, IconBus -> Bus, IconTaxi -> Car
- IconPin -> MapPin, IconClock -> Clock, IconSearch -> Search
- IconCheck -> Check, IconChevR -> ChevronRight, IconChevL -> ChevronLeft
- However, some icons are custom (IconSensor, IconQR, IconNav, IconSparkle) and would need custom SVGs regardless.

**Recommendation:** Keep as inline `<svg>` components for exact visual match. The icon set is small (20) and already well-defined.

### NativeWind status

NativeWind v4 is installed and configured in `metro.config.js` (withNativeWind), but **all styling in the codebase uses `StyleSheet.create`** — NativeWind/Tailwind class names are NOT used in any component. This means:

- No Tailwind classes to migrate
- All styles are explicit in StyleSheet objects
- Web migration will write Tailwind classes fresh, referencing the StyleSheet values as spec

---

## 7. Next.js IA Proposal

### Route structure

Based on SSoT item 11 (30-35 pages target), using Next.js App Router with `/en` and `/ko` locale prefixes:

```
app/
  [locale]/              # 'en' | 'ko'
    layout.tsx            # Root layout with fonts, i18n, theme
    page.tsx              # Home (hero + featured routes)
    routes/
      page.tsx            # Routes list (search + filter)
    route/
      [id]/
        page.tsx          # Route Detail (dynamic, from routes.json)
    how-to-ride/
      page.tsx            # How to Ride guide
    support/
      page.tsx            # Support / Contact (new for web)
    updates/
      page.tsx            # Updates / Changelog (new for web)
    legal/
      privacy/
        page.tsx          # Privacy Policy
      terms/
        page.tsx          # Terms of Use
```

### Page count calculation

| Page type | Count | Calculation |
|-----------|-------|-------------|
| Home | 2 | 1 x 2 locales |
| Routes (list) | 2 | 1 x 2 locales |
| Route Detail (dynamic) | 22 | 11 routes x 2 locales |
| How to Ride | 2 | 1 x 2 locales |
| Support | 2 | 1 x 2 locales |
| Updates | 2 | 1 x 2 locales |
| Privacy Policy | 2 | 1 x 2 locales |
| Terms of Use | 2 | 1 x 2 locales |
| **Total** | **36** | Within 30-35 target (36 is close) |

**Note:** If Support and Updates are not needed for v1 web, total = 32 (exactly in range). If Robotaxi gets its own detail page later, add 2 more.

### Dynamic page generation from routes.json

```
Route Detail pages: generateStaticParams()
  -> Read routes.json fixedRoutes
  -> For each route, generate { locale: 'en', id: route.id } and { locale: 'ko', id: route.id }
  -> 11 routes x 2 locales = 22 static pages at build time
```

**Strategy:**
- `generateStaticParams()` reads `data/routes.json` at build time
- Each `[id]/page.tsx` receives route data as static props
- No API calls needed (v1 principle maintained)
- Adding a new route = updating routes.json + rebuild

### Locale routing

- `middleware.ts` detects Accept-Language header, redirects root `/` to `/en` or `/ko`
- `next-intl` or custom i18n solution using the existing `lib/i18n/` translation files
- Existing i18next JSON keys can be reused with `next-intl` (similar API)

### Web-specific additions (not in app)

- **SEO:** `<head>` meta tags, Open Graph, structured data per route page
- **Responsive layout:** Mobile-first (app layout matches mobile web), add desktop breakpoints
- **Hover states:** Button hover, Card hover (bg.4), link underlines
- **Keyboard navigation:** Focus styles using accent.DEFAULT outline
- **Footer:** Site-wide footer with legal links, language toggle, fazr branding

---

## Appendix: File inventory

### Components (21 UI + 1 layout + 1 legal)

```
components/ui/
  Button.tsx          Card.tsx            BulletRow.tsx
  Eyebrow.tsx         FAQItem.tsx         HeroCard.tsx
  icons.tsx           InfoCardItem.tsx     KakaoCard.tsx
  KrLine.tsx          LangToggle.tsx       MapLinkButtons.tsx
  Pill.tsx            RobotaxiCard.tsx     RouteDiagram.tsx
  RouteCard.tsx       SectionHeader.tsx    SegmentedControl.tsx
  StatusDot.tsx       StepCard.tsx         StopsList.tsx

components/layout/
  TopBar.tsx          (exists, unused in v1)

components/legal/
  LegalDocumentScreen.tsx
```

### Screens (9 files)

```
app/_layout.tsx                 # Root layout (fonts, StatusBar, Stack)
app/(tabs)/_layout.tsx          # Tab layout (4 tabs)
app/(tabs)/index.tsx            # Home
app/(tabs)/routes.tsx           # Routes list
app/(tabs)/how-to-ride.tsx      # How to Ride
app/(tabs)/settings.tsx         # Settings
app/route/[id].tsx              # Route Detail
app/legal/privacy.tsx           # Privacy Policy
app/legal/terms.tsx             # Terms of Use
```
