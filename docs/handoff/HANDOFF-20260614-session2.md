# Handoff — 2026-06-14 Session 2

> Round 19.6 + 19.7 + 20 + 21 + 16B 완료. 전부 배포됨. 색인 요청 완료. 네이버 검색 노출 확인.

## 프로젝트 현재 상태 한 줄

**올빼미버스 인터랙티브 노선도 완성 — 전체화면·환승 2회(115역 100% 연결)·발표 글·HTTP 헤더 정리까지 배포. 색인 요청 완료, 네이버 검색 노출 확인됨.**

---

## 오늘 완료한 작업

### Round 19.6 — locale별 html lang 정리 (`3637662`)
- Root Layout → children passthrough (html/body/GA4/verification 제거)
- `[locale]/layout.tsx` → `<html lang={locale}>` + GA4 + verification + fonts 이동
- `design-preview/layout.tsx` 신규 (자체 html/body, GA4/verification 없음)
- `/ko/*` → `lang="ko"`, `/en/*` → `lang="en"` 동적 전환
- view-source 검증: lang / GA4 / verification 2개 / canonical / og:image — /ko·/en 양쪽

### Round 19.7 — 전체화면 보기 + 경로 바 칩 동작 + UI 개선 (`d96ca8f`)
- CSS 풀뷰포트 오버레이 (100dvw×100dvh, z-index 9999)
- 인라인 지도 항상 렌더 (언마운트 안 함) → PNG 회귀 방지
- useTouchZoom 훅 추출 → 인라인/오버레이 재사용
- 하단 도크: StationCard + JourneyBar flex column 자동 쌓임
- 좌상단 컨트롤: [PNG 저장(파랑)] [초기화(중립)] 상시
- 경로 바 칩 4케이스: 직통1(라벨)/직통N(셀렉트)/환승1(토글)/환승2(토글 — Round 20에서 추가)
- 근본 수정: 경로 활성 중 isAll 절대 안 빠짐
- chipTextColor: 배경 밝기 기반 글자색 자동 (N72 하드코딩 전부 제거)
- 길찾기 브랜드 색: 카카오 노랑 + 네이버 초록(흰 글씨)
- "크게 보기" / "전체 보기" 문구 정리, 점선 플레이스홀더 칩, 직통 괄호 제거

### Round 20 — 환승 2회 경로 + 서울역 라벨 + 전체화면 뷰 맞춤 (`44c1d23`)
- transfer2 별도 타입 (기존 transfer 불변), 3중 루프 폴백
- JourneyBar: 칩 3개 + 환승점 2개, journeySegs/activeNodes/transfer 3-leg 확장
- 168쌍 추가 연결, 불가 0쌍 (115역 100% 연결)
- shortName() 공통 함수: 서울역만 "역" 유지 (7곳 통일)
- FS_VB: 전체화면 전체 콘텐츠 + 패딩, 끝역·저작권 잘림 해소

### Round 21 — Updates 발표 글 (Updates + JSON-LD + 내부 링크) (`fbe3fe2`)
- A안 전용 렌더 (PageContainer longform 껍데기 기존, 내용만 전용)
- 본문 + 이미지 6개 + FAQ 8개 (원고 그대로)
- Article JSON-LD + FAQPage JSON-LD
- ko 전용: /en 404, hreflang ko self만, canonical ko, sitemap ko만
- og:image: night-bus-map-og.jpg (전용 OG 재사용)
- /ko/night-bus-map 내부 링크 → 고아 페이지 해소 (routes·A21·Updates 3곳)

### Round 16B — HTTP Link 헤더 hreflang 정리 (`c65eb96`)
- routing.ts에 `alternateLinks: false` 1줄 추가
- 미들웨어 자동 HTTP Link hreflang/x-default 헤더 완전 제거
- GSC 404 13개 근본 원인(Link 헤더가 locale 없는 URL 광고) 제거
- middleware.ts 미변경, matcher 미변경
- 19.6(html lang) + Round 21(Updates ko-only)의 HTTP 헤더 레벨 완결편

### 색인 요청 (코드 외 — 포그린 운영)
- 네이버 서치어드바이저 URL 수집 요청
- 구글 서치콘솔 URL 검사 → 색인 요청
- 다음(카카오) 검색등록
- 네이버 검색 노출 확인됨 ("서울 심야버스 노선도" 검색 시 노출)

---

## 변경 파일 (5개 커밋 합산)

### Round 19.6
- `web/app/layout.tsx` — children passthrough
- `web/app/[locale]/layout.tsx` — html lang={locale} + GA4 + verification
- `web/app/design-preview/layout.tsx` — 신규

### Round 19.7
- `web/app/[locale]/night-bus-map/NightBusMap.tsx`
- `web/app/[locale]/night-bus-map/night-bus-map.module.css`

### Round 20
- `web/app/[locale]/night-bus-map/NightBusMap.tsx`

### Round 21
- `web/app/[locale]/updates/[slug]/page.tsx`
- `web/app/[locale]/updates/page.tsx`
- `web/app/sitemap.ts`
- `web/data/updates/index.ts`
- `web/data/updates/night-bus-map-launch.ts` — 신규
- `web/lib/types/update.ts`
- `web/components/updates/NightBusMapLaunch.tsx` — 신규
- `web/components/updates/NightBusMapLaunch.module.css` — 신규
- `web/public/images/updates/` — 이미지 6개 신규

### Round 16B
- `web/i18n/routing.ts` — alternateLinks: false

### 미변경 (절대 금지선)
- routes.json, middleware.ts, Caddy, night-bus-data.ts — 전부 미변경

---

## 검증 결과

### 19.6 view-source (라이브)
- /ko → `<html lang="ko">` ✅
- /en → `<html lang="en">` ✅
- GA4 / google-verification / naver-verification / canonical / og:image — 양쪽 ✅

### 19.7 실기기 (아이폰 + PC)
- 전체화면 열림/닫힘/핀치줌 ✅
- 칩 4케이스 ✅ (직통1/직통N/환승1/환승2)
- PNG 저장 (인라인 + 전체화면) ✅
- 초기화 전체 리셋 ✅
- 같은 역 처리 ✅

### Round 20
- 환승 2회 경로 (온수→중화 등) ✅
- 서울역 라벨 7곳 통일 ✅
- 전체화면 끝역·저작권 안 잘림 ✅

### Round 21
- /ko/updates/night-bus-map-launch 200 ✅
- /en/updates/night-bus-map-launch 404 ✅
- Article + FAQPage JSON-LD ✅
- og:image night-bus-map-og.jpg ✅
- 기존 Updates 글 2개 정상 ✅

### Round 16B (라이브)
- HTTP Link 헤더 hreflang 0개 (제거됨) ✅
- canonical + verification + GA4 유지 ✅
- sitemap 변경 없음 ✅

---

## 배포 여부

**전부 배포 완료.**

| 커밋 | 해시 | 배포 |
|------|------|------|
| Round 19.6 | `3637662` | ✅ |
| Round 19.7 | `d96ca8f` | ✅ |
| Round 20 | `44c1d23` | ✅ |
| Round 21 | `fbe3fe2` | ✅ |
| Round 16B | `c65eb96` | ✅ |

---

## 남은 작업

### 즉시 필요한 것 — 없음
색인 요청까지 완료. 네이버 노출 확인. 핵심 기능·SEO 인프라 전부 배포됨.

### 후속 개선 (급하지 않음)
- 스니펫 최적화: 네이버가 고지문을 스니펫으로 뽑음 → 상단 소개 텍스트 보강하면 개선 가능
- GSC 404 13개 자연 드롭 모니터링 (2~4주 후 확인)

---

## 보류한 P2 항목

- 검색 결과 8개 제한 해제
- 크롬 다크 톤
- 페르소나 롱테일 본문 ("새벽 2시 버스", "대리 끝나고" 등)
- JSON-LD WebPage + BreadcrumbList
- 안드로이드 하드웨어 back 닫기
- GA4 이벤트 (fullscreen_open 등)
- 영문 노선도 (별도 라운드 — 단순 번역 아닌 영어 랜딩 설계)
- 16B 미들웨어 matcher 확장 (필요 시 — 현재 Link 헤더 끄기로 원인 제거됨)

---

## 다음 세션 진행 순서

1. GSC 404 드롭 현황 확인 (2~4주 후)
2. 네이버·구글 검색 순위 모니터링
3. 스니펫 최적화 (필요 시)
4. P2 항목 우선순위 재정리
5. 영문 노선도 판단

---

## 운영상 주의할 점

- **Caddy 절대 건드리지 말 것** (memory/caddy-incident.md 참조)
- **alternateLinks: false 유지** — 이걸 다시 true로 돌리면 GSC 404 원인이 부활
- **night-bus-data.ts 읽기 전용** — 노선 선 기하/좌표 보정 금지
- 배포: docker build/run만 (Caddy reload 없음)
- ko-only 페이지(night-bus-map, Updates 발표글) en 경로 생성 금지

---

## 역할별 다음 할 일

### Claude Code
- 다음 세션까지 대기 — 핵심 작업 완료
- GSC 404 드롭 확인 시 보고
- P2 요청 시 작업

### Claude UI
- 스니펫 최적화 방향 판단 (상단 소개 텍스트 보강)
- 영문 노선도 설계 방향 (번역 vs 영어 랜딩)
- P2 우선순위 정리

### GPT
- 검색 순위 모니터링 (네이버·구글)
- GSC 404 드롭 추이 확인
- 스니펫 개선 문구 검토

---

## 환승 2회 오디트 결과 (참고)

| 분류 | 쌍 수 | 비율 |
|------|-------|------|
| 직통 | 1,724 | 26.3% |
| 환승 1회 | 4,663 | 71.1% |
| 환승 2회 | 168 | 2.6% |
| 불가 | 0 | 0.0% |
| 전체 | 6,555 | 100% |

---

## 커밋 이력 (이번 세션)

```
c65eb96  Round 16B — HTTP Link 헤더 hreflang 정리 (배포됨)
fbe3fe2  Round 21 — 서울 심야버스 노선도 발표 글 (배포됨)
44c1d23  Round 20 — 환승 2회 경로 + 서울역 라벨 + 전체화면 뷰 맞춤 (배포됨)
d96ca8f  Round 19.7 — 전체화면 보기 + 경로 바 칩 동작 + UI 개선 (배포됨)
3637662  Round 19.6 — locale별 html lang 정리 (배포됨)
```
