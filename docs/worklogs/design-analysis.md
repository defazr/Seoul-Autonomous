# Design Analysis — Claude Design Mockup vs Project

> 분석일: 2026-04-29
> 소스: /design-references/ (Seoul Autonomous.zip)
> 대상: colors_and_type.css, Components.jsx, Icons.jsx, 5개 화면 JSX

---

## 1. 디자인 토큰 비교 (CSS vs tokens.ts vs tailwind.config.js)

### 1-1. Backgrounds — 일치

| Level | CSS (:root) | tokens.ts | tailwind | 일치 |
|-------|------------|-----------|----------|------|
| bg-0  | #000000    | #000000   | #000000  | OK   |
| bg-1  | #0A0A0A    | #0A0A0A   | #0A0A0A  | OK   |
| bg-2  | #111111    | #111111   | #111111  | OK   |
| bg-3  | #1A1A1A    | #1A1A1A   | #1A1A1A  | OK   |
| bg-4  | #1F1F1F    | #1F1F1F   | #1F1F1F  | OK   |

### 1-2. Foregrounds — 불일치

| Level | CSS (:root) | tokens.ts | tailwind | 불일치 |
|-------|------------|-----------|----------|--------|
| fg-1  | #FFFFFF    | fg.0: #FFFFFF | fg.0: #FFFFFF | OK |
| fg-2  | #EDEDED    | -         | -        | **MISSING in tokens** |
| fg-3  | #A1A1A1    | fg.1: #A0A0B0 | fg.1: #A0A0B0 | **다름** (CSS=#A1A1A1, tokens=#A0A0B0) |
| fg-4  | #8F8F8F    | -         | -        | **MISSING in tokens** |
| fg-5  | #555555    | fg.2: #6B6B7B | fg.2: #6B6B7B | **다름** (CSS=#555555, tokens=#6B6B7B) |

**결론: CSS에는 fg 5단계, tokens에는 3단계. 색상값도 다름.**

### 1-3. Borders — tokens에 없음

| Level | CSS          | tokens.ts | tailwind |
|-------|-------------|-----------|----------|
| border-1 | #1F1F1F | -         | -        |
| border-2 | #2E2E2E | -         | -        |
| border-3 | #454545 | -         | -        |

**결론: border 토큰 전체 누락.**

### 1-4. Accent — 부분 일치

| Token | CSS | tokens.ts | tailwind |
|-------|-----|-----------|----------|
| accent | #00D4FF | #00D4FF | #00D4FF | OK |
| accent-hi | #5BE6FF | - | - | **MISSING** |
| accent-lo | #0099BF | - | - | **MISSING** |
| accent-glow | rgba(0,212,255,0.32) | - | - | **MISSING** |
| accent-faint | rgba(0,212,255,0.10) | - | - | **MISSING** |

### 1-5. Status — 불일치

| Token | CSS | tokens.ts | tailwind |
|-------|-----|-----------|----------|
| success | #45A557 | #22C55E | #22C55E | **다름** |
| warning | #FFB224 | #F59E0B | #F59E0B | **다름** |
| danger  | #E5484D | #EF4444 | #EF4444 | **다름** |
| info    | #0072F5 | #00D4FF | #00D4FF | **다름** (CSS=blue, tokens=cyan) |

**결론: CSS의 status 색상은 Geist 계열, tokens는 Tailwind 기본값. CSS 기준으로 통일 권장.**

### 1-6. Radius — 부분 일치

| CSS | tokens.ts |
|-----|-----------|
| xs: 4px | - |
| sm: 6px | sm: 8 |
| md: 8px | md: 12 |
| lg: 12px | lg: 16 |
| xl: 16px | xl: 24 |
| 2xl: 24px | - |
| pill: 999px | - |

**결론: 값이 다르고 CSS 쪽이 더 세밀. 실제 JSX에서 사용하는 값 기준으로 재정렬 필요.**

### 1-7. Typography — tokens에 전혀 없음

CSS 정의:
- display: 700 40px/44px (hero/route number)
- h1: 600 32px/36px (screen title)
- h2: 600 24px/28px (section header)
- h3: 600 20px/24px (card header)
- title: 500 17px/22px (list item)
- body: 400 15px/22px
- body-md: 500 15px/22px (emphasized)
- caption: 400 13px/18px
- label: 500 12px/16px (uppercase)
- mono: 500 13px/18px (IDs, codes)
- mono-lg: 500 16px/20px

**결론: tokens.ts에 typography 정의 필요.**

### 1-8. Fonts

CSS 정의:
- Geist (Latin, 100-900 weight, italic 포함)
- Geist Mono (monospace, 100-900 weight)
- Pretendard (Korean, 100-900 weight)
- Pretendard Variable (Korean variable font)
- Geist Pixel (decorative, 미사용 가능)

앱에서 필요한 최소 폰트:
- Geist-Regular, Geist-Medium, Geist-SemiBold, Geist-Bold (400/500/600/700)
- GeistMono-Medium (500, 데이터 표시용)
- Pretendard-Regular, Pretendard-Medium, Pretendard-SemiBold (400/500/600, 한국어)

**결론: assets/fonts에 복사 + expo-font 로딩 필요.**

### 1-9. Shadows — tokens에 없음

CSS 정의: shadow-sm, shadow-md, shadow-lg, shadow-glow, shadow-inner

---

## 2. 재사용 컴포넌트 (Components.jsx)

| 컴포넌트 | 용도 | RN 변환 필요 | 비고 |
|---------|------|-------------|------|
| StatusBar | iOS 상태바 목업 | X | RN의 StatusBar 사용 |
| HomeIndicator | 홈 인디케이터 목업 | X | 불필요 |
| Frame | 디바이스 프레임 | X | 불필요 |
| **Pill** | 상태 뱃지 (success/warning/accent) | O | components/ui/Pill.tsx |
| **StatusDot** | 펄스 점 (6px) | O | components/ui/StatusDot.tsx |
| **Btn** | 버튼 (primary/secondary/ghost, sm/md/lg) | O | components/ui/Button.tsx |
| **Card** | 카드 (live glow border) | O | components/ui/Card.tsx |
| **KrLine** | 한국어 보조 텍스트 | O | components/ui/KrLine.tsx |
| **SectionHeader** | 섹션 헤더 (title + action) | O | components/ui/SectionHeader.tsx |
| **BottomNav** | 4탭 하단 네비 | X | expo-router Tabs로 대체 |
| **TopBar** | 상단 바 (back + title + action) | O | components/layout/TopBar.tsx |

**변환 대상: 8개 (Pill, StatusDot, Btn, Card, KrLine, SectionHeader, TopBar + 추가)**

---

## 3. 아이콘 (Icons.jsx)

총 20개, Lucide 스타일 SVG (24px viewBox, 1.8 stroke):

| 아이콘 | 사용 화면 | 비고 |
|--------|---------|------|
| IconHome | BottomNav | 탭 아이콘 |
| IconRoute | BottomNav | 탭 아이콘 |
| IconHelp | BottomNav | 탭 아이콘 |
| IconSettings | BottomNav | 탭 아이콘 |
| IconArrowR | Home, Detail, HowToRide | CTA 화살표 |
| IconChevR | 공통 | 리스트/섹션 chevron |
| IconChevL | Detail | 뒤로가기 |
| IconPin | Detail, HowToRide | 정류장 |
| IconSensor | Home, Routes, Detail, HowToRide | 자율주행 마크 |
| IconBus | Home, Routes, Detail, HowToRide | 버스 타입 |
| IconTaxi | Home, Routes, HowToRide | 택시 타입 |
| IconClock | Detail, HowToRide | 시간 |
| IconSearch | Routes | 검색 (미사용 v1) |
| IconCheck | Detail, HowToRide | 체크 |
| IconQR | HowToRide | QR/탭 |
| IconWifi | StatusBar 목업 | 불필요 |
| IconNav | Detail, HowToRide | 네비게이션/외부링크 |
| IconLeaf | - | 미사용 |
| IconMoon | - | 미사용 |
| IconSparkle | HowToRide | START HERE 뱃지 |

**RN 변환 방법: react-native-svg로 SVG 컴포넌트 작성 또는 @expo/vector-icons + 커스텀 아이콘**

---

## 4. 화면별 UI 요소 분석

### 4-1. Home (HomeScreen.jsx → app/(tabs)/index.tsx)

구조:
1. Header: 로고(mark.svg) + "Seoul Autonomous" + LangToggle(EN/KO)
2. Hero: 펄스 뱃지("14 SERVICES LISTED") + 대제목 + 설명 + CTA 버튼
3. Section "Active routes": SectionHead + RouteCard x4 (세로 스크롤)
4. Section "Popular tour routes": 가로 스크롤 TourCard x3
5. Footer note: Sensor 아이콘 + 서울시 파일럿 안내

주요 컴포넌트: LangToggle, RouteCard, ModeGlyph, StatusBadge, TourCard, TourGlyph, SectionHead

**주의: 시안의 ACTIVE_ROUTES 데이터는 routes.json과 다름 (예: sangam-a01은 pending). 실제 구현 시 routes.json 기준.**

### 4-2. Routes (RoutesScreen.jsx → app/(tabs)/routes.tsx)

구조:
1. Header: "Routes" 대제목 + 필터 버튼
2. SegmentedControl: All / Bus / Robotaxi
3. 카운트 리본: "N services matching"
4. Section "Currently operating": SectionLabel + RouteCard 리스트
5. Section "Limited service": SectionLabel + RouteCard 리스트
6. Section "Robotaxi services": SectionLabel + RouteCard 리스트
7. Empty state: "No services match this filter."
8. Footer note

주요 컴포넌트: SegmentedControl, SectionLabel, FilterIcon, RouteCard (Home과 공유)

### 4-3. Route Detail (RouteDetailScreen.jsx → app/route/[id].tsx)

구조:
1. TopBar: Back + "ROUTE A01" 뱃지 + "BUS" 뱃지 + StatusPill
2. Title: 노선명 + 한국어 + 운영사 + 검증일 + disclaimer
3. MapPreview: 정적 SVG 다이어그램 (placeholder)
4. InfoCard 2x2 그리드: Hours, Fare, Reservation, Distance
5. "How to ride" 섹션: Step 1-2-3 + "Read full guide" 링크
6. Stops list: StopRow (축소/펼치기)
7. Nearby: NearbyCard x4 (주변 관광지)
8. Verification note
9. Sticky bottom: Google Maps + Kakao Map 버튼 2개

주요 컴포넌트: Eyebrow, MapPreview, InfoCard, Step, StopRow, NearbyCard, NearbyGlyph

**이 화면이 가장 복잡. stops 데이터 필요 (routes.json에 아직 없음).**

### 4-4. How to Ride (HowToRideScreen.jsx → app/(tabs)/how-to-ride.tsx)

구조:
1. Header: "How to ride" 대제목
2. SegmentedControl: Buses / Robotaxis (2열)
3. HeroCard: "First time? Start here." + 3개 핵심 포인트
4. FAQ accordion: 5개 질문 (펼침/접힘)
5. Visual guide: StepCard 2x2 그리드 (Find → Wait → Tap → Ride)
6. Kakao T mini-guide: KakaoCard (로보택시용)
7. Tips: 4개 체크리스트
8. Footer verification note

주요 컴포넌트: HeroCard, FAQItem, StepCard, KakaoCard, FAQRow, BulletRow, Mono

### 4-5. Settings (SettingsScreen.jsx → app/(tabs)/settings.tsx)

구조:
1. Header: "Settings" + 한국어 "설정"
2. Language: LangSwitch (EN/KO 세그먼트)
3. About: App version + Information verified date
4. Legal: Privacy policy + Terms of use (chevron 링크)
5. Footer: "SEOUL AUTONOMOUS · MVP"

주요 컴포넌트: Eyebrow, Group, Row, LangSwitch

**가장 간단한 화면.**

---

## 5. 변환 시 주요 주의사항

### HTML/CSS → React Native 변환

| Web | React Native |
|-----|-------------|
| div | View |
| span, p | Text (모든 텍스트는 Text 안에) |
| button | Pressable 또는 TouchableOpacity |
| overflow: auto | ScrollView 또는 FlatList |
| position: absolute | 동일하게 사용 가능 |
| grid | 직접 구현 (flexbox 조합) |
| backdrop-filter: blur | expo-blur의 BlurView |
| border-radius: 999px | borderRadius: 999 |
| box-shadow | React Native shadow props (iOS) + elevation (Android) |
| cursor: pointer | 불필요 |
| transition/animation | Animated API 또는 react-native-reanimated |
| SVG | react-native-svg |
| @font-face | expo-font + useFonts hook |
| CSS variables | tokens.ts 직접 참조 |

### NativeWind 적용 가능 여부

대부분의 인라인 스타일을 NativeWind className으로 대체 가능하나, 시안의 세밀한 값들(font shorthand, 특정 px값)은 커스텀 스타일이 필요할 수 있음. 하이브리드 접근 권장:
- 레이아웃 (flex, padding, gap): NativeWind
- 세밀한 디자인 (특정 색상, 그라데이션, 그림자): tokens.ts + StyleSheet

---

## 6. 시안 데이터 vs routes.json 차이

시안에서 사용된 데이터는 **데모용이며 routes.json과 다름:**

| 시안 데이터 | routes.json 실제 |
|-----------|-----------------|
| sangam-a01 (operating) | _pendingRoutes (미검증) |
| sangam-a02 (operating) | _pendingRoutes (미검증) |
| sangam-a03 (operating) | 존재하지 않음 |
| yeouido-a02 | _pendingRoutes (yeouido-a01) |
| "42dot" operator | Unknown |
| "Free" fare | Unknown |
| stops 배열 | 아직 없음 |

**구현 시 시안의 UI 패턴은 따르되, 데이터는 반드시 routes.json 기준.**

---

## 7. 구현 우선순위 제안

1. **tokens.ts 보강** — CSS 기준으로 fg 5단계, border, accent 변형, typography 추가
2. **폰트 셋업** — Geist(4w) + GeistMono(1w) + Pretendard(3w) 로딩
3. **공통 컴포넌트 8개** — Pill, StatusDot, Btn, Card, KrLine, SectionHeader, TopBar, Icon 시스템
4. **Settings** (가장 단순) → **Home** → **Routes** → **How to Ride** → **Route Detail** (가장 복잡)

---

## 파일 매핑 요약

```
design-references/              →  app/
  HomeScreen.jsx               →  app/(tabs)/index.tsx
  RoutesScreen.jsx             →  app/(tabs)/routes.tsx
  HowToRideScreen.jsx         →  app/(tabs)/how-to-ride.tsx
  SettingsScreen.jsx           →  app/(tabs)/settings.tsx
  RouteDetailScreen.jsx        →  app/route/[id].tsx
  Components.jsx               →  components/ui/*.tsx + components/layout/*.tsx
  Icons.jsx                    →  components/ui/icons.tsx (react-native-svg)
  colors_and_type.css          →  lib/design/tokens.ts (보강)
  fonts/Geist-*.otf            →  assets/fonts/
  fonts/Pretendard-*.otf       →  assets/fonts/
  assets/logos/mark.svg        →  assets/images/mark.svg (또는 RN SVG 컴포넌트)
```
