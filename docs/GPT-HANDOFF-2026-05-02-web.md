# GPT Handoff — 2026-05-02 (Web Migration Day 1)

> Claude Code → GPT/Claude UI 검토용 핸드오프 문서
> 이전 핸드오프: GPT-HANDOFF-2026-05-02-v1.md (v1 APK 완성)

## 세션 요약

v1 APK 완성 후, autonomous.fazr.co.kr 웹 마이그레이션을 8라운드에 걸쳐 진행.
Home + Routes 목록 페이지 완성. Route Detail audit 완료.
다음 세션에서 Round 7B(Route Detail 풀 구현)로 이어감.

---

## 완료 라운드 (8개)

### Round 1 — Design Audit (audit-only)
- 앱 v1 디자인 시스템 전수 조사 (토큰, 폰트, 색상, 컴포넌트 21개, 화면 7개)
- 산출물: `docs/worklogs/2026-05-02-web-design-audit.md`

### Round 2 — Deploy Audit (audit-only)
- Vultr 서버(158.247.252.172) Docker/Caddy 환경 조사
- Docker build cache 18.7GB 정리 → 46GB 여유 확보
- calc.fazr.co.kr이 같은 서버에서 동작 중 → 배포 파이프라인 검증됨
- DNS autonomous.fazr.co.kr 미생성 확인
- 산출물: `docs/worklogs/2026-05-02-deploy-audit.md`

### Round 3 — Next.js 프로젝트 초기화
- Next.js 16.2.4 + React 19.2.4 + TypeScript
- web/ 디렉토리 (모노레포, 별도 package.json)
- 디자인 토큰 1:1 복제 + CSS 변수 68개 정의
- Geist 폰트 적용 (next/font/google)
- 산출물: `docs/worklogs/2026-05-02-web-init.md`

### Round 4 — Pretendard + 핵심 컴포넌트 6개
- Pretendard .otf 3개 복사 + next/font/local 적용
- 컴포넌트: Pill, StatusDot, Button, RouteCard, RobotaxiCard, InfoCard, SegmentedControl
- CSS Modules (Tailwind 미사용)
- /design-preview 시각 검증 페이지
- 산출물: `docs/worklogs/2026-05-02-web-components-r1.md`

### Round 5 — Home 페이지 + i18n
- next-intl 4.11.0 도입 ([locale] 라우트)
- /en, /ko Home 페이지 완성
- Hero (동적 카운트 "11 ROUTES VERIFIED"), Featured Routes 4개, CTA, Footer
- LangToggle (EN/KO 전환)
- routes.json 1:1 복제 → web/data/
- 루트 / → 307 redirect → /en
- 반응형 (375/768/1280/1920px)
- 산출물: `docs/worklogs/2026-05-02-home-page.md`

### Round 5.5 — Locale Audit + RouteCard Fix
- 컴포넌트 6개의 locale 분기 누락 전수 조사
- RouteCard: locale prop 추가 → /ko에서 한글 노선명/출발/도착지 표시
- RobotaxiCard, InfoCard 누락 확인 → 다음 라운드로 보류
- 산출물: `docs/worklogs/2026-05-02-locale-audit.md`

### Round 6 — Routes 목록 페이지 + RobotaxiCard Fix
- /en/routes, /ko/routes 완성
- 검색바 (6필드 매칭 + serviceArea 4필드)
- SegmentedControl (All/Bus/Robotaxi)
- RobotaxiCard locale fix ("Kakao T 필요", "탑승 전 확인 필요")
- Home CTA → /[locale]/routes 연결 활성화
- 산출물: `docs/worklogs/2026-05-02-routes-page.md`

### Round 7A — Route Detail Audit (audit-only)
- RouteDiagram: SVG Line+Circle 2개뿐, 난이도 LOW
- StopsList: CSS timeline + useState, LOW
- MapLinkButtons: <a> 태그, TRIVIAL
- InfoCard: 컴포넌트 수정 불필요
- 권고: 단일 라운드(7B)로 풀 구현
- 산출물: `docs/worklogs/2026-05-02-route-detail-audit.md`

---

## 현재 웹 상태

### 동작하는 페이지
| 경로 | 설명 |
|------|------|
| / | → /en 307 redirect |
| /en | English Home |
| /ko | Korean Home |
| /en/routes | English Routes (11 bus + 1 robotaxi) |
| /ko/routes | Korean Routes |
| /design-preview | 컴포넌트 프리뷰 |

### 미구현 페이지
| 경로 | 다음 라운드 |
|------|-----------|
| /[locale]/routes/[id] | Round 7B (지시서 확정) |
| /[locale]/how-to-ride | 이후 |
| /[locale]/legal/* | 이후 |

### 웹 컴포넌트 현황
```
web/components/ui/        — Pill, StatusDot, Button, RouteCard, RobotaxiCard, InfoCard, SegmentedControl, LangToggle
web/components/home/      — Hero, FeaturedRoutes, CTASection, Footer
web/components/routes/    — SearchBar, RoutesList
web/components/route-detail/ — (Round 7B에서 생성 예정)
```

---

## 기술 결정 로그

| 항목 | 결정 | 근거 |
|------|------|------|
| Next.js 버전 | 16.2.4 (latest) | npm latest 태그, stable |
| 스타일링 | CSS Modules | 앱이 NativeWind 미사용(StyleSheet만), Tailwind 불필요 |
| i18n | next-intl 4.11.0 | App Router 네이티브 지원, ICU format |
| 폰트 | Geist (google) + Pretendard (local .otf) | 앱 동일, SIL OFL 라이선스 |
| 루트 / 처리 | /en 리다이렉트 | SEO 안전, 단순 |
| 아이콘 | 인라인 SVG | 앱의 react-native-svg 패턴 유지, 20개 소규모 |

---

## Vultr 서버 현황

```
IP: 158.247.252.172
OS: Ubuntu 22.04
Disk: 26GB/75GB (46GB free)
RAM: 3.8GB (2.3GB available)
Docker: 8 containers on apps-newsforgreens_default
Caddy: /opt/apps-newsforgreens/Caddyfile
```

**배포 계획 (미실행):**
1. Cloudflare: A record autonomous.fazr.co.kr → 158.247.252.172
2. Server: /opt/seoul-autonomous/ + docker-compose + Dockerfile
3. Caddyfile: autonomous.fazr.co.kr 블록 추가
4. calc.fazr.co.kr과 동일 구조

---

## SSoT 변경 여부

**없음.** 앱 프로젝트 파일 변경 0건. web/ 디렉토리와 docs/worklogs/만 추가.

---

## 다음 세션: Round 7B

### 목표
Route Detail 페이지 풀 구현 → v1 핵심 3페이지(Home, Routes, Route Detail) 완성

### 핵심 구현 항목
- /[locale]/routes/[id] 동적 라우팅 (11 routes × 2 locales = 22 pages)
- RouteDiagram (SVG Line+Circle, 회차 2단)
- StopsList (접힘/펼침, CSS timeline)
- MapLinkButton (Kakao Map 외부 링크)
- InfoCard 2x2 (Hours, Days, Stops, Verified)
- 페이지 헤더 (뒤로가기 + 노선명 + LangToggle)

### 지시서 위치
포그린이 확정한 Round 7B 지시서를 다음 세션 첫 메시지로 전달.
4개 수정사항(RouteCard 리팩터 금지, MapLink URL 방식 명시, RouteDiagram polish 보류 허용, 헤더 표기) 반영된 최종본.

---

## Round 7B 이후 남은 작업

| 순서 | 작업 | 예상 |
|------|------|------|
| 8 | How to Ride 페이지 | 1 라운드 |
| 9 | Legal (Privacy, Terms) | 1 라운드 |
| 10 | Settings (또는 웹용 About) | 1 라운드 |
| 11 | 배포 (Dockerfile, Caddy, DNS) | 1 라운드 |
| 12 | SEO (sitemap, robots, meta, JSON-LD) | 1 라운드 |
| 13+ | favicon, OG image, 성능 최적화 | 보류 |

---

v1 웹 핵심 3페이지 완성까지 Round 7B 1개 남음. 다음 세션에서 이어감.
