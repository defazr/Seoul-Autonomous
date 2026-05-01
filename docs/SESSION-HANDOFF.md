# Session Handoff

> 새 대화에서 이어갈 때 이 문서를 참고합니다.
> 마지막 업데이트: 2026-04-29

## 현재 위치

**Day 2 Part 1 완료 → Part 2 Home 화면 구현 직전**

## 바로 이어갈 작업

```
1. Home 화면 구현 (HomeScreen.jsx 기반)
2. Routes 화면 구현
3. How to Ride 화면 구현
4. Route Detail 화면 구현 (stops 데이터 사전 결정 필요)
```

## Home 화면 핵심 결정사항 (포그린 확정)

### 대표 노선 4개
1. `cheonggye-a01` — 광장시장/청계천 관광
2. `cheongwadae-a01` — 외국인 관광객 의미
3. `sangam-a21` — DMC 미래도시
4. `simya-a21` — 심야 자율주행 차별성

### 데이터 규칙
- `fixedRoutes` 중 `kakao_seoul_verified` 또는 `official_confirmed`만 사용
- `_pendingRoutes`는 앱 UI에서 완전 무시
- 시안 데모 데이터(sangam-a01/a02/a03 등) 사용 금지
- 실시간 표현 금지 (Operating now, Live today, Arriving in N min)

### 섹션명
"Routes to try first" 또는 "Featured autonomous routes"

## 완료된 것

- [x] Expo SDK 54 프로젝트 초기화
- [x] SSoT 4개 파일 배치
- [x] tokens.ts CSS 기준 정렬 (fg 5단계, border, accent, status, typography, radius, shadows)
- [x] tailwind.config.js 동기화
- [x] 폰트 8개 (Geist 4w + GeistMono 1w + Pretendard 3w)
- [x] 22 SVG 아이콘 (react-native-svg)
- [x] 공통 컴포넌트 8개
- [x] Tab 네비게이션 (커스텀 아이콘)
- [x] Settings 화면 완전 구현
- [x] 디자인 분석 문서 (design-analysis.md)

## 미완료 / 블로커

- [ ] Home 화면
- [ ] Routes 화면
- [ ] How to Ride 화면
- [ ] Route Detail 화면
- [ ] **routes.json stops 배열 없음** — Detail 구현 전 결정 필요
- [ ] Popular tours 섹션 — 시안에 있지만 데이터 근거 없음 (v1 제외 가능)
- [ ] Git remote 미설정 — GitHub 리포 생성 필요

## 주요 파일 위치

| 파일 | 용도 |
|------|------|
| `/lib/design/tokens.ts` | 디자인 토큰 (CSS 기준) |
| `/components/ui/icons.tsx` | 22개 SVG 아이콘 |
| `/components/ui/*.tsx` | 공통 UI 컴포넌트 |
| `/design-references/` | Claude Design 시안 원본 (gitignored) |
| `/docs/worklogs/design-analysis.md` | 시안 분석 결과 |
| `/data/routes.json` | 노선 데이터 (SSoT, v0.1 seed) |

## npm 설치 주의사항

peer dependency 충돌 때문에 일부 패키지는 `--legacy-peer-deps` 필요:
- nativewind
- react-native-svg
