# Session Handoff

> 새 대화에서 이어갈 때 이 문서를 참고합니다.
> 마지막 업데이트: 2026-05-02 (v1 APK 완성)

## 현재 위치

**v1 Android APK 빌드 성공. 웹 공개 준비 직전.**

## 완료된 것

### 앱 화면 (7개)
- [x] Home (Featured 4 routes, hero, LangToggle)
- [x] Routes (SegmentedControl, search bar, 11 bus + 1 robotaxi)
- [x] How to Ride (HeroCard, FAQ, StepCard, KakaoCard)
- [x] Settings (i18n, LangSwitch, About, Legal links, v1.0.0)
- [x] Route Detail (RouteDiagram, InfoCard, StopsList, Kakao Map)
- [x] Legal/Privacy (EN/KO, LegalDocumentScreen)
- [x] Legal/Terms (EN/KO, LegalDocumentScreen)

### v1 출시 준비
- [x] app.json 정비 (scheme, package, bundleIdentifier)
- [x] 앱 아이콘 + 스플래시 (SA 모노그램, #0A1428)
- [x] Privacy Policy + Terms of Use (4개 언어 파일)
- [x] LegalDocumentScreen 렌더러
- [x] Settings → Legal 라우트 연결
- [x] Routes 검색 기능 (6필드 매칭, AND 필터)
- [x] Pill StatusDot 간격 수정
- [x] Robotaxi 라벨 "Kakao T (Korean app) required"
- [x] MVP 표기 제거
- [x] EAS Build 환경 (eas.json, .npmrc)
- [x] v1 APK 빌드 성공 (ee05e46a)

### 데이터
- [x] Stops 보강 11/11 (307개)
- [x] A504 승격 (kakao_seoul_verified)
- [x] tsc clean

## v1 APK 빌드 정보

```
빌드 ID: ee05e46a-c05a-478e-a120-21e080d8f647
EAS owner: thisiz43
projectId: a19cf82e-53f8-442f-9ced-c4fc8e0b2ba5
```

## 다음 작업

### 1순위: 웹 공개 (autonomous.fazr.co.kr)
- react-dom, react-native-web 설치 필요
- favicon.png 교체
- 도메인 DNS (Cloudflare)
- 호스팅: Cloudflare Pages 추천

### 2순위: 데이터 보강 (Gemini)
- daysOfOperation (7개 Unknown)
- fare, operator, reservationRequired, appRequired

### 3순위: iOS 빌드

## 주요 파일 위치

| 파일 | 용도 |
|------|------|
| `/lib/design/tokens.ts` | 디자인 토큰 (CSS 기준) |
| `/lib/utils/date.ts` | 공통 날짜 포맷 헬퍼 |
| `/lib/types.ts` | FixedRoute, Stop, OnDemandService 타입 |
| `/lib/legal/` | Legal 문서 타입 + EN/KO 콘텐츠 (5 files) |
| `/components/ui/` | 공통 UI 컴포넌트 21개 |
| `/components/legal/` | LegalDocumentScreen 렌더러 |
| `/app/legal/` | Privacy, Terms 라우트 |
| `/data/routes.json` | 노선 데이터 (11 routes, 307 stops) |
| `.npmrc` | legacy-peer-deps=true (EAS 빌드 필수) |
| `eas.json` | EAS Build 프로필 |

## 빌드 주의사항

- .npmrc 삭제 금지 (EAS 빌드 실패함)
- package-lock.json 재생성 금지 (Linux 바이너리 제거됨)
- npm install 시 항상 --legacy-peer-deps 사용

## Git 커밋 히스토리 (최신순)

```
2ebf54d Remove MVP labels for v1 release
7c3adae Configure npm legacy peer deps for EAS Build
762888a Configure EAS Build for preview profile
1f358ac Fix StatusDot and text spacing in Pill
39f9529 Clarify Kakao T label for non-Korean users
cfb2e01 Add search to Routes screen
e10d2eb Connect Settings legal rows to /legal/privacy and /legal/terms
b0df168 Add legal document routes (privacy, terms)
35ce3de Add LegalDocumentScreen renderer component
29a6e8d Add legal document content for v1 release
91d96d8 Add app icons and splash screen for v1 release
c7cf092 Configure app.json for v1 release
3f948ce Update session handoff and GPT handoff docs (2026-05-02)
3f2b594 Polish app screens before v1 prep
3e5122c Day 2 Part 5: Route Detail screen (final app screen)
```

## v1.1 보류 항목

- routes.json Unknown 필드 보강
- 정류장명 검색, 초성 검색
- 영문 stops 데이터
- iOS 빌드
- Naver Map 외부 링크
- Settings "Information verified" 라벨 명확화
