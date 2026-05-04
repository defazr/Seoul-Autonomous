# Round 5.5 — Component Locale Audit + RouteCard Fix

**Date:** 2026-05-02

---

## 1. routes.json Korean Fields Audit

All 11 fixedRoutes + 1 onDemandService have complete Korean fields.

| ID | displayNameKo | startPointKo | endPointKo |
|----|---------------|-------------|------------|
| saebyeok-a160 | 새벽A160 | 도봉산역광역환승센터 | 영등포역 |
| saebyeok-a741 | 새벽A741 | 구파발역입구 | 양재역.서초문화예술회관 |
| saebyeok-a148 | 새벽A148 | 상계역5번출구.상계벽산아파트 | 고속터미널 |
| simya-a21 | 심야A21 | 동대문역 | 합정역 |
| cheonggye-a01 | 청계A01 | 청계광장 | 청계5가.광장시장 |
| dongjak-a01 | 동작A01 | 숭실대중문 | 중앙대후문 |
| dongdaemun-a01 | 동대문A01 | 장한평역 | 경희의료원 |
| seodaemun-a01 | 서대문A01 | 서대문구청 | 가좌역3번출구 |
| sangam-a21 | 상암A21 | 월드컵경기장남측.월드컵공원 | 공항철도디지털미디어시티역 |
| cheongwadae-a01 | 청와대A01 | 경복궁역 | 청와대 |
| saebyeok-a504 | 새벽A504 | 금천구청.금천경찰서 | 시청역1호선.서울시청 |

| ID | displayNameKo | serviceAreaKo |
|----|---------------|--------------|
| gangnam-robotaxi | 강남 로보택시 | 강남구, 서초구 (심야) |

**Missing Korean fields:** None. All complete.

---

## 2. App Component Locale Logic (re-audit)

### RouteCard (app)
- Uses `useTranslation()` → `i18n.language === 'ko'` → `isKo`
- **Data switching:** displayName/Ko, startPoint/Ko, endPoint/Ko
- **Sub name:** isKo → shows English name below; !isKo → shows Korean below
- **Font:** Korean text uses Pretendard (via KrLine component)
- **Headway:** Displayed as-is from JSON (e.g., "15 min" — no locale unit conversion in app)

### RobotaxiCard (app)
- Uses `useTranslation()` → `isKo`
- **Data switching:** displayName/Ko, serviceArea/Ko
- **Sub name:** Same swap pattern as RouteCard
- **Font:** `isKo && styles.nameKo` (Pretendard-SemiBold), `isKo && styles.textKo` (Pretendard-Regular)
- **Labels:** "CHECK BEFORE RIDING" via `t('routes.robotaxi.checkBeforeRiding')`, "Kakao T required" via `t('routes.robotaxi.appRequired')`

### InfoCardItem (app)
- Accepts `isKo?: boolean` prop
- **Font only:** `isKo && styles.valueKo` (Pretendard-SemiBold)
- **No data switching** — label and value come from parent via i18n

### Pill (app)
- **No locale logic** — pure visual component

### Button (app)
- **No locale logic** — pure visual component

### SegmentedControl (app)
- **No locale logic** — labels come from parent via i18n

---

## 3. Web vs App Locale Logic Comparison

| Component | App locale logic | Web (Round 4) | Gap |
|-----------|-----------------|---------------|-----|
| **RouteCard** | isKo → swap displayName/Ko, startPoint/Ko, endPoint/Ko; sub name swap; Pretendard font | None — always English | **FIXED this round** |
| **RobotaxiCard** | isKo → swap displayName/Ko, serviceArea/Ko; sub name swap; Pretendard; i18n labels | None — always English, hardcoded labels | **Deferred** |
| **InfoCard** | isKo → Pretendard font for value | None — no font switching | **Deferred** (minor — CSS handles font fallback) |
| **Pill** | None | None | No gap |
| **Button** | None | None | No gap |
| **SegmentedControl** | None | None | No gap |

---

## 4. RouteCard Fix (this round)

### Changes
- Added `locale?: string` prop (default `'en'`)
- Added `isKo = locale === 'ko'` check
- Data switching: `name`, `subName`, `start`, `end` swap based on locale
- Sub name: ko page shows English name below, en page shows Korean below (matches app behavior)
- FeaturedRoutes passes `locale={useLocale()}` to each RouteCard

### Not changed
- VERIFIED / OFFICIAL badges remain English (as specified)
- Headway displayed as-is from JSON (app doesn't localize units either)
- Font switching not needed — CSS `font-family` fallback handles Korean glyphs automatically on web

### Verification
- `/ko`: 청계A01, 청와대A01, 상암A21, 심야A21 (Korean names primary)
- `/en`: Cheonggye A01, Cheongwadae A01, Sangam A21, Simya A21 (English names primary)
- Sub names correctly swapped in both locales
- Start/end points localized

---

## 5. Deferred Items (next round)

| Component | What to fix | When |
|-----------|------------|------|
| RobotaxiCard | Add locale prop, swap displayName/Ko and serviceArea/Ko, localize labels via i18n | When Routes page is built |
| InfoCard | Add font-family switching for Korean values (minor — CSS fallback works) | When Route Detail page is built |
| design-preview page | RouteCard dummy data now needs locale prop — low priority, preview-only | Optional |

---

## Files Modified

- `web/components/ui/RouteCard.tsx` — added locale prop + data switching
- `web/components/home/FeaturedRoutes.tsx` — passes locale to RouteCard

**Messages (en.json, ko.json):** Not modified — no unit changes needed (headway comes from JSON as-is, matching app behavior)

**App project files modified: 0**
