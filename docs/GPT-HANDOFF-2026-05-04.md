# GPT Handoff — 2026-05-04 (Web Migration Day 2)

> Claude Code → GPT/Claude UI 검토용 핸드오프 문서
> 이전 핸드오프: GPT-HANDOFF-2026-05-02-web.md (Round 7A까지)
> **갱신: 2026-05-04 세션 종료 시점 (Round 9D까지 반영)**

## 세션 요약

Round 7B(Route Detail) + Round 8(How to Ride) 구현 완성.
사이트 전략 문서 작성(SITE-STRATEGY.md v1.0).
Gemini Deep Research 수신 + Round 9B-IA(페이지 확장 audit 13개 후보) 완료.
Round 9C-DocSync(SSoT/DECISIONS 동기화) 완료.
Round 9D-TrustAudit(Data Source + About 경량 audit) 완료.

**v1 핵심 4페이지 완성.** 다음은 C11(Data Source) + C13(About) 구현 라운드.

---

## 이번 세션 커밋 (7개)

| 해시 | 메시지 | 내용 |
|------|--------|------|
| `f168382` | Round 7B: Route Detail 페이지 구현 및 dot 렌더 버그 수정 | Route Detail 22페이지 + dot 버그 수정 |
| `0218fae` | Round 8B: How to Ride 페이지 구현 | How to Ride 2페이지 + 컴포넌트 5개 + i18n 62키 |
| `9e767d1` | docs: 사이트 전략 문서 추가 (SITE-STRATEGY.md v1.0) | 전략 9섹션 + 안전장치 4개 |
| `177566a` | docs: GPT 핸드오프 추가 (2026-05-04) | 세션 핸드오프 초판 |
| `d82a6f8` | docs: Round 9B-IA 페이지 확장 audit 추가 | 13개 후보 평가 + routes.json 필드 평가 |
| `0998b9d` | docs: Round 9C-DocSync — SSoT/DECISIONS 동기화 | SSoT §8/§9/§2 갱신 + DEC-015/016 추가 |
| `87f0cce` | docs: Round 9D-TrustAudit — Data Source + About 경량 audit | C11/C13 구현 전 사전 점검 |

---

## 완료 라운드 (7개)

### Round 7B — Route Detail 풀 구현
- `/[locale]/routes/[id]` 동적 라우팅 (11 routes × 2 locales = 22 pages)
- 컴포넌트: RouteDiagram, StopsList, MapLinkButton
- RouteDiagram dot 타원 버그 수정 (SVG → CSS div)
- 사양 변경 교훈: 먼저 보고 + 사양 내 해결책 먼저 시도
- 산출물: `docs/worklogs/2026-05-02-route-detail.md`

### Round 8A — How to Ride Audit (audit-only)
- 앱 v1에 How to Ride 화면 존재 확인, LOW 판정
- 산출물: `docs/worklogs/2026-05-04-how-to-ride-audit.md`

### Round 8B — How to Ride 풀 구현
- `/[locale]/how-to-ride` (en/ko 2페이지)
- 컴포넌트 5개, 한국어 SEO H2 구조, 영어 SegmentedControl
- 산출물: `docs/worklogs/2026-05-04-how-to-ride.md`

### SITE-STRATEGY.md v1.0
- 사이트 정체성, SSoT 원칙, 페이지 4유형 분류, 정확성 정책, AI 검색 가설, 네이버 SEO, 운영 원칙, 안전장치 4개

### Round 9B-IA — 페이지 확장 Inventory + Audit
- 13개 후보(C1~C13) + 2개 필드(F1, F2) 평가
- 진행 권고: C8(Privacy), C9(Terms), C10(SEO 인프라), C11(Data Source), C13(About)
- 보류: C1~C3, C5, C7, C12, F1, F2
- 폐기: C4, C6
- SSoT 갱신 필요 항목 4건 기록
- 산출물: `docs/worklogs/2026-05-04-page-expansion-audit.md`

### Round 9C-DocSync — SSoT/DECISIONS 동기화
- SSoT §8: Fixed 10 → 11
- SSoT §9: A504 보류 삭제
- SSoT §2: 웹 기술 "미확정" → "Next.js 16.2.4"
- DECISIONS: DEC-015(A504 정식), DEC-016(웹 기술 확정) 추가
- 산출물: `docs/worklogs/2026-05-04-docsync.md`

### Round 9D-TrustAudit — Data Source + About 경량 audit
- C11: 1페이지 통합안 유지, 5개 섹션, URL 권고 `/data-source`
- C13: 매우 짧은 페이지, 앱 Settings About 재사용 가능
- 신규 컴포넌트 0개, 1라운드 묶음 권고
- i18n: C11 약 18~22키 + C13 약 8~12키
- 산출물: `docs/worklogs/2026-05-04-trust-audit.md`

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

### 미구현 페이지 (9B-IA 진행 권고 기준)
| 경로 | 상태 | 라운드 |
|------|------|--------|
| /[locale]/data-source | 진행 권고 (C11) | 다음 구현 라운드 |
| /[locale]/about | 진행 권고 (C13) | 다음 구현 라운드 |
| /[locale]/privacy | 진행 권고 (C8) | 이후 |
| /[locale]/terms | 진행 권고 (C9) | 이후 |
| SEO 인프라 (sitemap/robots/JSON-LD/OG) | 진행 권고 (C10) | 이후 |
| /[locale]/areas/* | 보류 (C1, C2) | area 매핑 체계 선행 |
| /[locale]/guides/* | 보류/폐기 (C5~C7) | Unknown 보강 후 |
| /[locale]/safety | 보류 (C12) | 1차 안전 통계 출처 확보 시 |

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

## SSoT/DECISIONS 현재 상태 (Round 9C 갱신 반영)

- SSoT §8: Fixed routes **11**개
- SSoT §9: 보류 노선 = 상암A01, 상암A02, 여의도A01 (A504 삭제됨)
- SSoT §2: 웹 = Next.js 16.2.4, autonomous.fazr.co.kr
- DECISIONS: DEC-001~DEC-016 (DEC-015 A504 정식, DEC-016 웹 기술 확정)

---

## 기술 결정 로그 (이번 세션 추가분)

| 항목 | 결정 | 근거 |
|------|------|------|
| RouteDiagram | CSS div (SVG 아님) | preserveAspectRatio stretch 버그 |
| 중간 dot 크기 | 8px (앱 6px) | 웹 가독성 조정 |
| How to Ride KO H1 | "서울 자율주행버스 타는 법" | 네이버 SEO |
| How to Ride EN | 앱 구조 그대로 | 영문 SEO 별도 |
| Server/Client 분리 | HowToRideClient.tsx | SegmentedControl useState |
| metadata 키 패턴 | {page}Title/{page}Description | 기존 패턴 일관성 |
| C11 URL 권고 | `/data-source` | 9D audit 비교 결과 |
| C11 구조 | 1페이지 통합안 | sourceUrls/verificationLevel 볼륨 작음 |
| C11+C13 분할 | 1라운드 묶음 | 합산 분량 < R8B |

---

## 세션 중 확립된 원칙 (중요)

### 사양 변경 원칙 (Round 7B 교훈)
- 지시서 사양 벗어날 때 **먼저 보고**
- 사양 내 해결책 먼저 시도, 흐름 보고에 명시
- 단독 결정 금지

### 사전 합의 외 파일/키 추가 원칙 (Round 8B 교훈)
- 지시서 산출물에 없는 신규 파일 추가 시 사전 보고
- 합의 외 i18n 키 추가 시 사전 보고

### 라운드 번호 확정 X
- 다음 라운드 후보는 번호 없이 후보 목록으로만
- 순서 결정은 포그린 몫

### 4 viewport 검증
- 375/768/1280/1920 구체 항목별 (레이아웃 깨짐, 가로 스크롤, 카드 겹침)
- CSS 분석은 보조, 브라우저 렌더 캡처 권장

### 권고의 위상
- 모든 audit 권고는 최종 결정이 아님
- 채택 여부와 라운드 순서는 포그린이 결정

---

## 다음 세션 계획

### 즉시 작업: C11 + C13 구현 라운드 지시서 작성

Round 9D-TrustAudit 결과 기반으로 Data Source + About 구현 지시서 작성.

**포그린 결정 대기 2건:**
1. C11 URL 확정 — 9D 권고: `/[locale]/data-source` (포그린 결정 필요)
2. Footer 링크 추가 — 구현 라운드에 포함할지, 별도 분리할지 (포그린 결정 필요)

**구현 라운드 반영 항목 (9D §5 정리):**
- C11: 5개 섹션 (헤더 → 출처 → 검증 방법 → 정확성 정책 → 기준일)
- C13: 4개 섹션 (헤더 → 소개 → 데이터 정책 링크 → 연락)
- 신규 컴포넌트 0개, 기존 BulletRow/InfoCard/Footer/LangToggle 재사용
- i18n: `dataSource.*` 18~22키 + `about.*` 8~12키
- 앱 텍스트 "재사용" = 신규 키로 복사 (next-intl/i18next 직접 공유 불가)

### 이후 후보 (확정 X)
- C8+C9 (Privacy + Terms) — 배포 전 필수
- C10 (SEO 인프라) — 페이지 정리 후 일괄 적용
- Vultr 배포
- routes.json Unknown 필드 보강 (v1.1)

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
| docs/worklogs/2026-05-04-page-expansion-audit.md | Round 9B-IA: 페이지 확장 audit (13후보) |
| docs/worklogs/2026-05-04-docsync.md | Round 9C: SSoT/DECISIONS 동기화 |
| docs/worklogs/2026-05-04-trust-audit.md | Round 9D: Data Source + About 경량 audit |
| docs/strategy/SITE-STRATEGY.md | 사이트 전략 문서 v1.0 |
| docs/GPT-HANDOFF-2026-05-02-web.md | 이전 세션 핸드오프 |
| **docs/GPT-HANDOFF-2026-05-04.md** | **이번 세션 핸드오프 (이 문서)** |

---

## Claude Code 자동 메모리

Claude Code의 persistent memory (`MEMORY.md`)에 이번 세션 결과 반영 완료:
- Web Migration Progress: Round 8 DONE, Next TBD by Fogrin
- Current Web State: 33 페이지, 컴포넌트 5그룹
- Implementation Notes: RouteDiagram CSS div, How to Ride SEO, 사양 변경 원칙
- Worklogs: 2026-05-04 항목 5개

→ Claude Code 새 세션에서도 이 메모리를 자동 로드하므로 컨텍스트 유지됨.

---

v1 핵심 4페이지 완성. 전략 + audit 3라운드 완료. 다음은 C11+C13 구현 → 배포 준비.
