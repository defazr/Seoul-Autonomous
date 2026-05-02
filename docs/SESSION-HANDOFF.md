# Session Handoff

> 새 대화에서 이어갈 때 이 문서를 참고합니다.
> 마지막 업데이트: 2026-05-02

## 현재 위치

**앱 5화면 완성 + Polish 완료 → v1 출시 준비 직전**

## 완료된 것

- [x] Expo SDK 54 프로젝트 초기화
- [x] SSoT 4개 파일 배치
- [x] 디자인 토큰 CSS 기준 정렬
- [x] 폰트 8개 + 22 SVG 아이콘
- [x] 공통 컴포넌트 22개
- [x] Home 화면 (Featured 4 routes, hero, LangToggle)
- [x] Routes 화면 (SegmentedControl, 11 bus + 1 robotaxi)
- [x] How to Ride 화면 (HeroCard, FAQ, StepCard, KakaoCard)
- [x] Settings 화면 (i18n, LangSwitch, Korean date)
- [x] Route Detail 화면 (RouteDiagram, InfoCard, StopsList, Kakao Map only)
- [x] A504 승격 (kakao_seoul_verified)
- [x] Stops 보강 11/11 (307개 정류장)
- [x] Polish 라운드 (subtitle, truncate, date, FAQ, spacing)
- [x] tsc clean, expo export OK (2.98 MB)

## 다음 작업 후보

### Option A: v1 출시 준비
- 앱 아이콘 + 스플래시 스크린
- app.json 정비 (버전, 스킴, 패키지명)
- Privacy Policy / Terms of Use 본문
- EAS Build + Google Play 등록

### Option B: routes.json 데이터 보강 (Gemini 리서치)
- daysOfOperation (7개 Unknown)
- fare, operator, reservationRequired, appRequired
- 5인 체제 Gemini 본격 투입

### Option C: 웹 작업 (autonomous.fazr.co.kr)
- SSoT 11번 본판
- 1차 30~35페이지
- JSON-LD 구조화 데이터

## 주요 파일 위치

| 파일 | 용도 |
|------|------|
| `/lib/design/tokens.ts` | 디자인 토큰 (CSS 기준) |
| `/lib/utils/date.ts` | 공통 날짜 포맷 헬퍼 |
| `/lib/types.ts` | FixedRoute, Stop, OnDemandService 타입 |
| `/components/ui/` | 공통 UI 컴포넌트 22개 |
| `/design-references/` | Claude Design 시안 원본 (gitignored) |
| `/data/routes.json` | 노선 데이터 (11 routes, 307 stops) |

## npm 설치 주의사항
- --legacy-peer-deps: nativewind, react-native-svg

## Git 커밋 히스토리
```
3f2b594 Polish app screens before v1 prep
3e5122c Day 2 Part 5: Route Detail screen (final app screen)
ddf0429 Add stops for Saebyeok A160 route
09a309a Add stops for Saebyeok A741 and A148 routes
1f57585 Add stops for Dongjak, Dongdaemun, and Seodaemun routes
5a29ae7 Add stops for Cheonggye, Cheongwadae, Sangam A21, and Simya A21
91f4bb6 Day 2 Part 4: How to Ride screen
a887a3e Fix Settings screen i18n keys
5ac6370 Day 2 Part 3: Routes screen with SegmentedControl and RobotaxiCard
5adc8e3 Fix Home hero title: add color and Korean font fallback
859b244 Day 2: Design system, shared components, and Settings screen
783eeae Day 1: Project initialization
27fe6d0 Add A504 route with stops schema (v0.1)
```
