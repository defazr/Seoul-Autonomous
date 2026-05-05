# GPT Handoff — 2026-05-05 (Round 11B까지)

> 이 문서 하나로 세션이 바뀌어도 이어갈 수 있음.
> Claude Code / Claude UI / GPT 누구든 이 문서 + 아래 참조 문서 읽으면 전체 맥락 복원 가능.

---

## 한 줄 요약

서울 자율주행 가이드 웹사이트. Next.js 16.2.4, 45 정적 페이지, GlobalHeader 도입 완료, 디자인 풀 오딧 진행 중.

---

## 현재 사이트 상태

**빌드:** 45 정적 페이지 (npm run build 통과)
**도메인:** autonomous.fazr.co.kr (DNS 미생성, Vultr 미배포)

### 완성된 페이지 (9개 유형, 43 URL + sitemap + robots)

| 페이지 | URL | 상태 |
|--------|-----|------|
| Home | /en, /ko | 완성 |
| Routes 목록 | /en/routes, /ko/routes | 완성 |
| Route Detail | /[locale]/routes/[id] x 11노선 x 2 = 22 URL | 완성 |
| How to Ride | /en/how-to-ride, /ko/how-to-ride | 완성 |
| FAQ | /en/faq, /ko/faq | 완성 |
| Data Source | /en/data-source, /ko/data-source | 완성 |
| About | /en/about, /ko/about | 완성 |
| Privacy | /en/privacy, /ko/privacy | 완성 |
| Terms | /en/terms, /ko/terms | 완성 |

### 전역 내비게이션 (Round 11B 신규)

- **GlobalHeader:** `[locale]/layout.tsx` 단일 삽입. 모든 9개 페이지 유형에 적용
  - 로고 (SensorIcon + "Seoul Autonomous") → Home 링크
  - 데스크탑 768px+: Routes / How to Ride / FAQ 가로 링크 3개
  - 모바일: 햄버거 → 우측 slide drawer (7개 링크 + 반투명 overlay)
  - Static (sticky X), LangToggle 미포함 (각 페이지 기존 위치 유지)
- **SiteFooter:** 8개 링크 (탐색 6개 + 법적 2개 분리), 터치 영역 보강
  - 순서: Home / Routes / FAQ / How to Ride / Data Source / About | Privacy / Terms

### SEO 인프라

- sitemap.xml (38 URL, design-preview 제외)
- robots.txt (Disallow: /design-preview)
- 전역 OG 메타데이터 + hreflang (en <-> ko)
- WebSite JSON-LD (Home), BreadcrumbList JSON-LD (8개 유형), FAQPage JSON-LD (FAQ)

---

## 이번 세션 커밋 (4개, Round 11)

```
a1b52a4 fix: Route Detail TopBar — codeBadge nowrap + 모바일 2줄 명시 분리
a3d6d57 fix: Round 11B 회귀 수정 — Hero 로고 중복 제거 + Route Detail wrap
41253a8 feat: Round 11B — GlobalHeader + MobileDrawer (회귀 미해소, 디자인 검토 필요)
173bb85 feat: Round 11A — SiteFooter polish (Routes link, touch targets, nav/legal split)
```

---

## 확립된 원칙

1. **사양 변경 시 먼저 보고** (R7B 교훈)
2. **사전 합의 외 파일/키 추가 시 사전 보고** (R8B 교훈)
3. **라운드 번호 미확정** — 순서 결정은 포그린 몫
4. **권고는 최종 결정이 아님** — 포그린이 최종 결정
5. **지시서 1/4 분량** — 짧은 지시서로 동일 품질 가능
6. **SiteFooter는 `<a>` 태그** — next/link 같은 페이지 스크롤 미작동 이슈
7. **GlobalHeader에 LangToggle 미포함** — 기존 각 페이지 TopBar 위치 유지
8. **GlobalHeader는 static** — sticky는 후속 디자인 후보
9. **디자인 결정은 디자인 클로드, 구현은 Claude Code** — 역할 분리

### 11B 회귀 교훈
- flex-wrap + flex: 1 충돌 → badges가 가용폭 전체 차지하여 의도된 wrap 불가
- codeBadge에 white-space: nowrap 필수 (CHEONGWADAE A01 등 공백 있는 코드)
- 모바일 2줄 분리는 미디어쿼리로 명시적 처리 (flex-basis: 100%)
- margin-left: auto로 1행/2행 모두 우측 정렬 보장

---

## 다음 작업 (포그린 결정 필요)

### 진행 중
- **디자인 클로드 풀 오딧** — 데스크탑 1280px 9페이지 스크린샷 기반 시각 검증 예정
  - 글 페이지(FAQ/Privacy/Terms) 단조로움
  - 데스크탑 레이아웃 일관성
  - GlobalHeader와 각 페이지 header 간격/톤 매칭

### 후속 軽 후보 (우선순위 미정)
- LangToggle 전역 통일 (GlobalHeader 이동 + 각 TopBar 제거)
- GlobalHeader sticky + backdrop-filter: blur
- Privacy/Terms 섹션 구분선 (hairline)
- Route Detail disclaimer 톤 (warning → fg-3)
- TopBar 2행 spacing 미세 조정
- Back to Top (Terms/Privacy 한정)

### 배포 준비
- Vultr 배포 (Dockerfile, Caddy, DNS autonomous.fazr.co.kr)
- og:image 제작

### 데이터 보강 (v1.1)
- routes.json Unknown 필드 보강

---

## 웹 파일 구조 (요약)

```
web/
├── app/
│   ├── [locale]/
│   │   ├── about/
│   │   ├── data-source/
│   │   ├── faq/
│   │   ├── how-to-ride/
│   │   ├── privacy/
│   │   ├── routes/ + routes/[id]/
│   │   ├── terms/
│   │   ├── layout.tsx (OG, hreflang, GlobalHeader)
│   │   └── page.tsx (Home)
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx (root)
│   └── page.tsx (redirect -> /en)
├── components/
│   ├── common/ (GlobalHeader, MobileDrawer, SiteFooter)
│   ├── faq/ (FAQList)
│   ├── home/ (Hero, FeaturedRoutes, CTASection)
│   ├── how-to-ride/ (HeroCard, FAQItem, StepCard, KakaoCard, BulletRow)
│   ├── legal/ (LegalDocument)
│   ├── route-detail/ (RouteDiagram, StopsList, MapLinkButton)
│   ├── routes/ (SearchBar, RoutesList)
│   └── ui/ (Pill, Button, RouteCard, RobotaxiCard, InfoCard, SegmentedControl, LangToggle)
├── data/ (routes.json, legal/*.ts, faq/*.ts)
├── lib/ (routes.ts, types/, design/tokens.ts, seo/config.ts, seo/jsonld.ts)
├── messages/ (en.json, ko.json)
└── i18n/ (routing.ts, navigation.ts, request.ts)
```

---

## i18n 네임스페이스 (신규)

- `globalHeader.*` — 9개 키 (routes, howToRide, faq, about, dataSource, privacy, terms, menuOpen, menuClose)
- `siteFooter.*` — 9개 키 (home, routes, faq, howToRide, dataSource, about, privacy, terms, copyright)

---

## 이 문서만으로 부족할 때 읽을 문서

### 프로젝트 전체 이해
```
SSOT.md                            — 헌법 (11개 합의 항목)
CLAUDE.md                          — 작업 규칙
docs/strategy/SITE-STRATEGY.md     — 사이트 전략 v1.0
docs/DECISIONS.md                  — 의사결정 로그 (DEC-001~016)
```

### Round 11 worklogs
```
docs/worklogs/2026-05-05-ux-polish-audit.md        — R11 UX audit (10항목 표)
docs/worklogs/2026-05-05-globalheader-design.md     — GlobalHeader 설계안 (A/B/C 비교)
```

### 이전 핸드오프
```
docs/GPT-HANDOFF-2026-05-05.md     — Round 10H까지
docs/GPT-HANDOFF-2026-05-04.md     — Round 9D까지
```

### 데이터 / i18n 구조
```
web/data/routes.json               — 노선 데이터 (11 fixed + 1 on-demand)
web/messages/en.json               — 영문 i18n
web/messages/ko.json               — 한국어 i18n
```

---

## Vultr 서버 (미배포)

```
IP: 158.247.252.172
OS: Ubuntu 22.04, 46GB free
Docker: 8 containers
Caddy: /opt/apps-newsforgreens/Caddyfile
DNS: autonomous.fazr.co.kr 미생성 (Cloudflare A record 필요)
```
