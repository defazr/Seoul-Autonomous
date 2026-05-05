# GPT Handoff — 2026-05-05

> 이 문서 하나로 세션이 바뀌어도 이어갈 수 있음.
> Claude Code / Claude UI / GPT 누구든 이 문서 + 아래 참조 문서 읽으면 전체 맥락 복원 가능.

---

## 한 줄 요약

서울 자율주행 가이드 웹사이트. Next.js 16.2.4, 45 정적 페이지, 9개 페이지 유형 완성, SEO 인프라 완료, 배포 전 상태.

---

## 현재 사이트 상태

**빌드:** 45 정적 페이지 (npm run build 통과)
**도메인:** autonomous.fazr.co.kr (DNS 미생성, Vultr 미배포)

### 완성된 페이지 (9개 유형, 43 URL + sitemap + robots)

| 페이지 | URL | 상태 |
|--------|-----|------|
| Home | /en, /ko | 완성 |
| Routes 목록 | /en/routes, /ko/routes | 완성 |
| Route Detail | /[locale]/routes/[id] × 11노선 × 2 = 22 URL | 완성 |
| How to Ride | /en/how-to-ride, /ko/how-to-ride | 완성 (한국어 SEO H2) |
| FAQ | /en/faq, /ko/faq | 완성 (FAQPage JSON-LD) |
| Data Source | /en/data-source, /ko/data-source | 완성 |
| About | /en/about, /ko/about | 완성 |
| Privacy | /en/privacy, /ko/privacy | 완성 (앱 원문 복사) |
| Terms | /en/terms, /ko/terms | 완성 (앱 원문 복사) |

### SEO 인프라

- sitemap.xml (38 URL, design-preview 제외)
- robots.txt (Disallow: /design-preview)
- 전역 OG 메타데이터 + hreflang (en ↔ ko)
- WebSite JSON-LD (Home)
- BreadcrumbList JSON-LD (8개 페이지 유형)
- FAQPage JSON-LD (FAQ)

### 전역 내비게이션

- **SiteFooter:** 7개 링크 (Home/FAQ/How to Ride/Data Source/About/Privacy/Terms) + copyright + 면책 문구. 9개 페이지 모두 적용. `<a>` 태그 사용 (full reload, 같은 페이지 상단 이동 보장).
- **TopBar Home 링크:** 6개 페이지 (How to Ride, FAQ, Data Source, About, Privacy, Terms)의 topTitle이 Home 링크
- **Route Detail CTA:** "View all routes" 버튼 (StopsList 아래)

---

## 이번 세션 커밋 (10개)

```
9d7d20e feat: Round 10G+10H — NavPolish audit + 軽 구현
cb46a62 feat: Round 10F-SEO — sitemap, robots, OG, JSON-LD 정리
65b0448 feat: Round 10E-NavSync — 공통 SiteFooter + 진입 경로 정리
c101444 feat: Round 10D-FAQ — FAQ 페이지 + FAQPage JSON-LD
dab27a8 feat: Round 10C-Legal — Privacy + Terms 페이지 구현
456df5e feat: Round 10A-Trust — Data Source + About 페이지 구현
b48fabb docs: GPT 핸드오프 갱신 (Round 9D까지 반영)
87f0cce docs: Round 9D-TrustAudit — Data Source + About 경량 audit
0998b9d docs: Round 9C-DocSync — SSoT/DECISIONS 동기화
d82a6f8 docs: Round 9B-IA 페이지 확장 audit 추가
```

---

## SSoT / DECISIONS 현재 상태

- SSoT §8: Fixed routes **11개** (A504 포함)
- SSoT §9: 보류 = 상암A01, 상암A02, 여의도A01
- SSoT §2: 웹 = Next.js 16.2.4
- DECISIONS: DEC-001 ~ DEC-016

---

## 확립된 원칙 (모든 세션에서 준수)

1. **사양 변경 시 먼저 보고** (R7B 교훈)
2. **사전 합의 외 파일/키 추가 시 사전 보고** (R8B 교훈)
3. **라운드 번호 미확정** — 순서 결정은 포그린 몫
4. **권고는 최종 결정이 아님** — 포그린이 최종 결정
5. **지시서 1/4 분량** — 짧은 지시서로 동일 품질 가능 (포그린 합의)
6. **SiteFooter는 `<a>` 태그** — next/link 같은 페이지 스크롤 미작동 이슈
7. **Turbopack dev 모드 JSON parse 에러** — 프로덕션 빌드는 정상, dev 모드만 문제

---

## 다음 작업 후보 (포그린 결정 필요)

### 배포 준비
- Vultr 배포 (Dockerfile, Caddy, DNS autonomous.fazr.co.kr)
- og:image 제작

### 콘텐츠 확장 (보류 — 조건부)
- 지역 허브 (/areas/*) — area 매핑 체계 + routes.json 필드 확장 필요
- 새벽동행 가이드 (/guides/saebyeok-donghaeng) — Unknown 필드 보강 필요
- 강남 로보택시 (/areas/gangnam) — official_pending 해제 필요

### UX 개선 (보류)
- 전역 상단 내비게이션 (햄버거 메뉴) — 中 라운드
- Back to Top 버튼
- FAQ accordion
- 초고속 스크롤 시 클릭 안 되는 현상 (hydration 이슈)

### 데이터 보강 (v1.1)
- routes.json Unknown 필드 보강 (fare, operator, daysOfOperation, appRequired)
- fare_model / operator_contact 신규 필드 검토

---

## 이 문서만으로 부족할 때 읽을 문서

### 프로젝트 전체 이해
```
/Users/dapala.corp/python/root/scripts/seoul-autonomous/SSOT.md          — 헌법 (11개 합의 항목)
/Users/dapala.corp/python/root/scripts/seoul-autonomous/CLAUDE.md        — 작업 규칙
/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/strategy/SITE-STRATEGY.md  — 사이트 전략 v1.0
/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/DECISIONS.md — 의사결정 로그 (DEC-001~016)
```

### 페이지 확장 평가 결과
```
/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/worklogs/2026-05-04-page-expansion-audit.md  — 13개 후보 평가 (C1~C13)
/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/worklogs/2026-05-04-trust-audit.md           — Data Source + About 사전 점검
```

### 데이터 / i18n 구조
```
/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/data/routes.json       — 노선 데이터 (11 fixed + 1 on-demand)
/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/messages/en.json       — 영문 i18n
/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/messages/ko.json       — 한국어 i18n
```

### 최근 구현 패턴 참조 (신규 페이지 만들 때)
```
/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/app/[locale]/faq/page.tsx          — 가장 최근 패턴 (데이터 파일 + JSON-LD)
/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/components/common/SiteFooter.tsx   — 공통 Footer (async Server Component)
```

### Gemini 리서치
```
/Users/dapala.corp/Downloads/서울 자율주행 사이트 리서치 의뢰.md  — 2026-05-04 수신
```

### 이전 핸드오프
```
/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/GPT-HANDOFF-2026-05-04.md  — 이전 세션 (Round 9D까지)
/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/GPT-HANDOFF-2026-05-02-web.md  — 웹 마이그레이션 Day 1
```

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
│   │   ├── layout.tsx (OG, hreflang)
│   │   └── page.tsx (Home)
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx (root)
│   └── page.tsx (redirect → /en)
├── components/
│   ├── common/ (SiteFooter)
│   ├── faq/ (FAQList)
│   ├── home/ (Hero, FeaturedRoutes, CTASection, Footer*)
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

*home/Footer.tsx는 미사용 (SiteFooter로 대체됨). 파일 자체는 미삭제.

---

## Vultr 서버 (미배포)

```
IP: 158.247.252.172
OS: Ubuntu 22.04, 46GB free
Docker: 8 containers
Caddy: /opt/apps-newsforgreens/Caddyfile
DNS: autonomous.fazr.co.kr 미생성 (Cloudflare A record 필요)
```
