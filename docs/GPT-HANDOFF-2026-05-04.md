# GPT Handoff — 2026-05-04 (Web Migration Day 2)

> Claude Code → GPT/Claude UI 검토용 핸드오프 문서
> 이전 핸드오프: GPT-HANDOFF-2026-05-02-web.md (Round 7A까지)

## 세션 요약

Round 7B(Route Detail) + Round 8(How to Ride) 완성 + 사이트 전략 문서 작성.
v1 핵심 4페이지(Home, Routes, Route Detail, How to Ride) 모두 완성.
다음 세션에서 Gemini Deep Research → Round 9B-IA(페이지 확장 audit)로 이어감.

---

## 이번 세션 커밋 (3개)

| 해시 | 메시지 | 내용 |
|------|--------|------|
| `f168382` | Round 7B: Route Detail 페이지 구현 및 dot 렌더 버그 수정 | Route Detail 22페이지 + RouteDiagram dot 버그 수정 |
| `0218fae` | Round 8B: How to Ride 페이지 구현 | How to Ride 2페이지 + 컴포넌트 5개 + i18n 62키 |
| `9e767d1` | docs: 사이트 전략 문서 추가 (SITE-STRATEGY.md v1.0) | 사이트 전략 9개 섹션 + 안전장치 4개 |

---

## 완료 라운드

### Round 7B — Route Detail 풀 구현
- `/[locale]/routes/[id]` 동적 라우팅 (11 routes × 2 locales = 22 pages)
- 컴포넌트: RouteDiagram, StopsList, MapLinkButton
- RouteDiagram dot 타원 버그: `preserveAspectRatio="none"` + SVG circle → CSS div로 교체
  - **사양 변경 사고:** 지시서는 SVG Line+Circle 명시했으나, SVG 내 해결책 먼저 검토 않고 CSS로 변경. 포그린 피드백 받아 교훈 기록
- 중간 dot 크기: 앱 6px → 웹 8px (넓은 화면 가독성 위해 조정, audit 근거 명시)
- RouteCard href: `/route/{id}` → `/{locale}/routes/{id}`
- Kakao Map URL: `https://map.kakao.com/?q={encodeURIComponent(displayNameKo)}` (앱과 동일)
- 산출물: `docs/worklogs/2026-05-02-route-detail.md`

### Round 8A — How to Ride Audit (audit-only)
- 앱 v1에 How to Ride 화면 존재 확인 (`app/(tabs)/how-to-ride.tsx`)
- 콘텐츠: 4단계 가이드 + 5 FAQ + Kakao T 4단계 + 4 Tips, EN/KO 완비
- 신규 컴포넌트 5개 모두 LOW 난이도
- i18n: 앱 `howToRide.*` 62키 그대로 복사 가능
- 단일 라운드(8B) 가능 판정
- 산출물: `docs/worklogs/2026-05-04-how-to-ride-audit.md`

### Round 8B — How to Ride 풀 구현
- `/[locale]/how-to-ride` (en/ko 2페이지)
- 컴포넌트 5개: HeroCard, FAQItem, StepCard, KakaoCard, BulletRow (`web/components/how-to-ride/`)
- 한국어 페이지 SEO: H1 "서울 자율주행버스 타는 법" + H2 6개 구조
- 영어 페이지: 앱 동일 구조 (SegmentedControl BUS/TAXI 탭)
- HowToRideClient.tsx: Server/Client 분리 (SegmentedControl useState)
- CTASection How to Ride 링크 활성화
- i18n: howToRide.* 62키 + webTitle + metadata 2키 추가
- 산출물: `docs/worklogs/2026-05-04-how-to-ride.md`

### 사이트 전략 문서
- `docs/strategy/SITE-STRATEGY.md` v1.0
- 9개 섹션: 정체성, SSoT 원칙, 페이지 유형 4분류, 정확성 정책, AI 검색 가설 전략, 네이버 SEO, 운영 원칙, 안전장치 4개, 변경 이력
- 핵심 포지션: "AI 검색 대응형 지식베이스" (실시간 교통앱 X)
- 자동 생성형 우선, 수동 양산 금지

---

## 현재 웹 상태

### 동작하는 페이지 (33 정적 페이지)
| 경로 | 설명 |
|------|------|
| / | → /en 307 redirect |
| /en, /ko | Home |
| /en/routes, /ko/routes | Routes 목록 (11 bus + 1 robotaxi) |
| /[locale]/routes/[id] | Route Detail (11 routes × 2 = 22 pages) |
| /en/how-to-ride | How to Ride (영문, SegmentedControl) |
| /ko/how-to-ride | How to Ride (한글, SEO H2 구조) |
| /design-preview | 컴포넌트 프리뷰 |

### 미구현 페이지
| 경로 | 상태 |
|------|------|
| /[locale]/privacy | 후보 (법적 필수형) |
| /[locale]/terms | 후보 (법적 필수형) |
| /[locale]/areas/[area] | 후보 (자동 생성형) |
| /[locale]/guides/* | 후보 (수동 작성형) |

### 웹 컴포넌트 현황
```
web/components/ui/           — Pill, StatusDot, Button, RouteCard, RobotaxiCard,
                               InfoCard, SegmentedControl, LangToggle
web/components/home/         — Hero, FeaturedRoutes, CTASection, Footer
web/components/routes/       — SearchBar, RoutesList
web/components/route-detail/ — RouteDiagram, StopsList, MapLinkButton
web/components/how-to-ride/  — HeroCard, FAQItem, StepCard, KakaoCard, BulletRow
```

### 웹 파일 구조
```
web/
├── app/
│   ├── [locale]/
│   │   ├── how-to-ride/ (page.tsx, page.module.css, HowToRideClient.tsx)
│   │   ├── routes/
│   │   │   └── [id]/ (page.tsx, page.module.css)
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx + page.module.css
│   ├── design-preview/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (redirect)
├── components/ (ui/ home/ routes/ route-detail/ how-to-ride/)
├── data/routes.json
├── i18n/ (routing.ts, navigation.ts, request.ts)
├── lib/ (routes.ts, types/route.ts, design/tokens.ts, fonts.ts)
├── messages/ (en.json, ko.json)
└── middleware.ts
```

---

## 기술 결정 로그 (이번 세션 추가분)

| 항목 | 결정 | 근거 |
|------|------|------|
| RouteDiagram | CSS div (SVG 아님) | preserveAspectRatio="none" stretch 버그 → CSS div로 교체 |
| 중간 dot 크기 | 8px (앱 6px) | 웹 넓은 화면에서 가독성 위해 조정 |
| How to Ride KO H1 | "서울 자율주행버스 타는 법" | 네이버 SEO 최적화 |
| How to Ride EN | 앱 구조 그대로 | 영문 SEO는 별도 라운드 |
| Server/Client 분리 | HowToRideClient.tsx | SegmentedControl useState 분리 |
| metadata 키 | howToRideTitle/Description | 기존 패턴(routesTitle 등) 일관성 |
| 전략 문서 위치 | docs/strategy/ | 라운드 worklogs와 분리 |

---

## 세션 중 확립된 원칙 (중요)

### 사양 변경 원칙 (Round 7B 교훈)
- 지시서 사양 벗어날 때 **먼저 보고**
- 사양 내 해결책 먼저 시도, 그 흐름을 보고에 명시
- 단독 결정 금지

### 사전 합의 외 파일/키 추가 원칙 (Round 8B 교훈)
- 지시서 산출물에 없는 신규 파일 추가 시 사전 보고
- 합의 외 i18n 키 추가 시 사전 보고
- 합리적이면 받아들이되, 다음부터 원칙 유지

### 라운드 번호 확정 X
- 다음 라운드 후보는 번호 없이 후보 목록으로만
- 순서 결정은 포그린 몫

### 4 viewport 검증
- 375/768/1280/1920 구체 항목별 검증 (레이아웃 깨짐, 가로 스크롤, 카드 겹침, CTA/FAQ)
- CSS 분석은 보조, 실제 브라우저 렌더 캡처 권장

---

## SSoT 변경 여부

**없음.** 앱 프로젝트 파일 변경 0건. web/, docs/ 만 추가/수정.

---

## Vultr 서버 현황 (변경 없음)

```
IP: 158.247.252.172
OS: Ubuntu 22.04
Disk: 46GB free
Docker: 8 containers
Caddy: /opt/apps-newsforgreens/Caddyfile
DNS: autonomous.fazr.co.kr 미생성
```

---

## 다음 세션 계획

### Step 1: Gemini Deep Research 위임
SITE-STRATEGY.md 기반으로 외부 리서치 의뢰:
1. 2026년 5월 서울 자율주행 운영 현황
2. AI 검색 인용 메커니즘
3. 네이버 SEO 트렌드 (2026)
4. 지역 자율주행 콘텐츠 출처
5. 비교 사이트 분석

### Step 2: Round 9B-IA — 페이지 확장 Inventory + Audit
Gemini 리서치 결과 + SITE-STRATEGY.md 기반으로:
- 후보 페이지 전수 분류 (자동 생성 / 수동 작성 / 법적 필수 / SEO 인프라)
- 난이도 + 우선순위 평가
- 포그린 최종 결정 → 다음 라운드 확정

### 다음 라운드 후보 (확정 X, 포그린 결정 필요)

자동 생성형:
- 지역 허브 (/areas/cheonggye, /areas/gangnam 등)
- 노선 그룹 페이지

수동 작성형:
- 자율주행버스란 (/guides/seoul-autonomous-bus)
- 무인버스와 자율주행버스 차이

법적 필수형:
- Privacy, Terms

SEO 인프라형:
- sitemap, robots, JSON-LD, OG 메타데이터

신뢰 페이지:
- Data Source / Accuracy Policy

운영:
- Vultr 배포 (Dockerfile, Caddy, DNS)

---

## 전체 Worklogs 목록

| 파일 | 내용 |
|------|------|
| docs/worklogs/2026-05-02-web-design-audit.md | Round 1: 디자인 시스템 audit |
| docs/worklogs/2026-05-02-deploy-audit.md | Round 2: Vultr 서버 audit |
| docs/worklogs/2026-05-02-web-init.md | Round 3: Next.js 초기화 |
| docs/worklogs/2026-05-02-web-components-r1.md | Round 4: 핵심 컴포넌트 6개 |
| docs/worklogs/2026-05-02-home-page.md | Round 5: Home 페이지 |
| docs/worklogs/2026-05-02-locale-audit.md | Round 5.5: Locale audit |
| docs/worklogs/2026-05-02-routes-page.md | Round 6: Routes 목록 |
| docs/worklogs/2026-05-02-route-detail-audit.md | Round 7A: Route Detail audit |
| docs/worklogs/2026-05-02-route-detail.md | Round 7B: Route Detail 구현 |
| docs/worklogs/2026-05-04-how-to-ride-audit.md | Round 8A: How to Ride audit |
| docs/worklogs/2026-05-04-how-to-ride.md | Round 8B: How to Ride 구현 |
| docs/strategy/SITE-STRATEGY.md | 사이트 전략 문서 v1.0 |
| docs/GPT-HANDOFF-2026-05-02-web.md | 이전 세션 핸드오프 |
| **docs/GPT-HANDOFF-2026-05-04.md** | **이번 세션 핸드오프 (이 문서)** |

---

## Claude Code 자동 메모리

Claude Code의 persistent memory (`MEMORY.md`)에 이번 세션 결과 반영 완료:
- Web Migration Progress: Round 8 DONE
- Current Web State: 33 페이지, how-to-ride 컴포넌트 추가
- Implementation Notes: RouteDiagram CSS div, How to Ride SEO 구조
- Worklogs: 2026-05-04 항목 3개 추가

→ Claude Code 새 세션에서도 이 메모리를 자동 로드하므로 컨텍스트 유지됨.

---

v1 핵심 4페이지 완성. 전략 문서 박힘. 다음은 외부 리서치 → 페이지 확장 audit.
