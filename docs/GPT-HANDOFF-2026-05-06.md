# GPT Handoff — 2026-05-06

> 이 문서 하나로 세션이 바뀌어도 이어갈 수 있음.
> Claude Code / Claude UI / GPT / 디자인 클로드 누구든 이 문서 읽으면 전체 맥락 복원 가능.

---

## 한 줄 요약

서울 자율주행 가이드 웹사이트. 45 정적 페이지, 레이아웃 정합성 완료 (Round 1 + 1.5), Round 2 (Privacy/Terms 시각 보강 + Route Detail 재설계) 대기 중.

---

## 현재 상태

**빌드:** 45 정적 페이지, npm run build 통과
**마지막 커밋:** `2748d97` (GlobalHeader padding 정렬)
**도메인:** autonomous.fazr.co.kr (미배포)

### 레이아웃 시스템 (Round 1에서 확립)

| 컴포넌트 | 역할 | 스펙 |
|---------|------|------|
| PageContainer (default) | 카드/그리드 페이지 | max-width 1120px, padding 20/24px |
| PageContainer (longform) | 텍스트 위주 페이지 | max-width 720px, padding 20/24px |
| GlobalHeader | 전역 내비게이션 | max-width 1120px, padding 20/24px (PageContainer와 동일) |
| SiteFooter | 전역 푸터 | nav 6링크 + legal 2링크 분리 |

### 페이지별 폭 배정

| default (1120px) | longform (720px) |
|-----------------|-----------------|
| Home, Routes, Route Detail, How to Ride | FAQ, About, Data Source, Privacy, Terms |

### 전역 내비게이션

- **GlobalHeader**: `[locale]/layout.tsx` 단일 삽입
  - 로고 (SensorIcon + "Seoul Autonomous") → Home 링크
  - 데스크탑 768px+: Routes / How to Ride / FAQ 가로 링크
  - 모바일: 햄버거 → 우측 slide drawer (7링크 + Privacy/Terms 앞 구분선)
  - LangToggle: GlobalHeader 우측 (모든 페이지 동일 위치)
  - Static (sticky X)

---

## 이번 세션 커밋 (Round 1 + 1.5, 총 8개)

```
2748d97 fix: GlobalHeader padding aligned to PageContainer (20/24px)
c4b37d9 feat: Round 1.5 — Home width fix + About cards + FAQ spacing
0e7f082 feat: Task 1.5 — drawer separator before policy links
a7b5f45 feat: Task 1.4 — remove redundant topTitle from 5 longform pages
b4ca4a2 fix: Task 1.3 — remove duplicate disclaimer from RoutesList
283c363 feat: Task 1.2 — EN/KO toggle moved to GlobalHeader
b8af54f feat: Task 1.1 — PageContainer (default 1120px / longform 720px)
4215fee fix: Task 1.0 — disable Next.js dev indicator (N mark)
```

이전 세션 커밋 (Round 11):
```
a1b52a4 fix: Route Detail TopBar — codeBadge nowrap + 모바일 2줄 명시 분리
a3d6d57 fix: Round 11B 회귀 수정 — Hero 로고 중복 제거 + Route Detail wrap
41253a8 feat: Round 11B — GlobalHeader + MobileDrawer
173bb85 feat: Round 11A — SiteFooter polish
```

---

## 다음 작업: Round 2

**상세 지시서:** `docs/ROUND2_HANDOFF.md` (디자인 클로드 작성)

### 진행 순서

1. **묶음 B (먼저, 빠르고 안전)**
   - Privacy/Terms 섹션 divider 추가 (h2 사이 hairline)
   - 섹션 번호 cyan 강조 ("1." → cyan, 나머지 기존 색)
   - i18n 키 추가 금지, CSS만

2. **묶음 A (메인, Route Detail 재설계)**
   - 사전: Route Detail 캡처 (데스크탑 1280px + 모바일 375px)
   - 데스크탑: 2-column (좌 720 main + 우 340 sticky sidebar)
   - 모바일: 1-column stacked
   - 디자인 클로드와 구조 합의 후 구현

---

## 확립된 원칙

1. 사양 변경 시 먼저 보고 (R7B)
2. 사전 합의 외 파일/키 추가 시 사전 보고 (R8B)
3. CSS Modules 전용 (Tailwind X)
4. 디자인 결정 = 디자인 클로드, 구현 = Claude Code
5. Unknown 데이터는 "—" (추측 금지)
6. 다크 톤 + zinc + cyan accent 유지
7. 720px longform은 의도, 올리지 말 것
8. 부분 수정만 보면 전체 정합성 놓침 → 페이지 단위 검증

### 회귀 교훈
- flex-wrap + flex: 1 충돌 주의
- codeBadge에 white-space: nowrap 필수
- 모바일 2줄 분리는 미디어쿼리 명시적 처리
- GlobalHeader padding은 PageContainer와 반드시 동일

---

## 보류 항목

| 항목 | 사유 | 후속 시점 |
|------|------|----------|
| Privacy/Terms sticky TOC | 과함 (법적 페이지에 불필요) | 보류 |
| FAQ 카테고리 그루핑 | i18n 키 추가 필요 → 별도 라운드 | Round 2 이후 |
| GlobalHeader sticky + blur | 후속 디자인 후보 | Round 2 이후 |
| Vultr 배포 | 디자인 완성 후 | Round 2 이후 |

---

## 웹 파일 구조 (신규 포함)

```
web/
├── app/[locale]/
│   ├── layout.tsx (GlobalHeader 삽입)
│   ├── page.tsx (Home, PageContainer default)
│   ├── routes/page.tsx (PageContainer default)
│   ├── routes/[id]/page.tsx (Route Detail, PageContainer default)
│   ├── how-to-ride/page.tsx (PageContainer default)
│   ├── faq/page.tsx (PageContainer longform)
│   ├── about/page.tsx (PageContainer longform, 카드 레이아웃)
│   ├── data-source/page.tsx (PageContainer longform)
│   ├── privacy/page.tsx (PageContainer longform)
│   └── terms/page.tsx (PageContainer longform)
├── components/
│   ├── common/ (GlobalHeader, MobileDrawer, SiteFooter)
│   ├── layout/ (PageContainer) ← Round 1 신규
│   ├── home/ (Hero, FeaturedRoutes, CTASection)
│   ├── faq/ (FAQList — accent bar 추가됨)
│   ├── legal/ (LegalDocument)
│   ├── route-detail/ (RouteDiagram, StopsList, MapLinkButton)
│   ├── routes/ (SearchBar, RoutesList)
│   └── ui/ (Pill, Button, RouteCard, InfoCard, LangToggle 등)
├── data/ (routes.json, legal/*.ts, faq/*.ts)
├── lib/ (routes.ts, types/, design/tokens.ts, seo/)
├── messages/ (en.json, ko.json)
└── i18n/ (routing.ts, navigation.ts, request.ts)
```

### i18n 네임스페이스 현황
- `globalHeader.*` — 9개 키
- `siteFooter.*` — 9개 키
- `home.*`, `routes.*`, `routeDetail.*`, `howToRide.*`, `faq.*`, `dataSource.*`, `about.*`, `metadata.*`, `common.*`, `nav.*`

---

## 이 문서만으로 부족할 때 읽을 문서

```
docs/ROUND2_HANDOFF.md              — Round 2 상세 지시서 (디자인 클로드 작성)
docs/DESIGN_AUDIT_ROUND_1.md        — Round 1 지시서
docs/GPT-HANDOFF-2026-05-05-R11.md  — Round 11B 핸드오프
docs/SESSION-HANDOFF.md             — 세션 핸드오프 (항상 최신)
SSOT.md                              — 헌법
CLAUDE.md                            — 작업 규칙
docs/DECISIONS.md                    — 의사결정 로그
```

---

## Vultr 서버 (미배포)

```
IP: 158.247.252.172
OS: Ubuntu 22.04, 46GB free
Docker: 8 containers
Caddy: /opt/apps-newsforgreens/Caddyfile
DNS: autonomous.fazr.co.kr 미생성
```
