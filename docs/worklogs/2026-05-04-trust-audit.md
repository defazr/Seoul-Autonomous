# Round 9D-TrustAudit — Data Source / Accuracy Policy + About 경량 audit

> Date: 2026-05-04
> Status: Complete
> Type: audit-only
> Reference: Round 9B-IA (커밋 d82a6f8) C11 + C13 진행 권고

## 1. Summary

C11(Data Source / Accuracy Policy)과 C13(About) 두 페이지의 구현 전 사전 점검 완료. C11은 1페이지 통합안 유지, 5개 섹션 구성 권고. C13은 앱 Settings About 섹션 재사용 가능, 매우 짧은 페이지. 두 페이지 모두 LOW 난이도로 1라운드 묶음 처리 권고. URL은 `/[locale]/data-source` 권고 (최종 결정 포그린).

## 2. C11 평가 결과

### 2.1 페이지 구조 분석

**A. 섹션 구성 후보**

| 순서 | 섹션명 후보 | 목적 | 콘텐츠 유형 |
|------|------------|------|------------|
| 1 | 페이지 헤더 | 제목 + 간단 소개 | 제목 + 1~2줄 설명 |
| 2 | 데이터 출처 | 어디서 정보를 가져오는지 | 불릿 리스트 (카카오맵 서울시 제공, 수동 검증) |
| 3 | 검증 방법 | verificationLevel 4단계 설명 | 단계별 설명 (kakao_seoul_verified, official_confirmed 등) |
| 4 | 정확성 정책 | Unknown 처리, 실시간 아님, 탑승 전 확인 | 불릿 리스트 또는 카드 |
| 5 | 기준일 정책 | lastChecked 표시 방식, 갱신 주기 | 짧은 설명 |

**B. 페이지 길이 추정**
짧음 (1~2 viewport) — SITE-STRATEGY §4가 핵심 소스. 분량 많지 않음.

**C. 사용자 동선**
- 진입 경로: Footer 링크 (common.footer 옆 또는 하단), About 페이지 내부 링크
- 다음 페이지 유도: Routes 페이지로 CTA ("검증된 노선 보기")

### 2.2 기존 컴포넌트 재사용 가능성

| 컴포넌트 | 재사용 | 사유 |
|----------|--------|------|
| BulletRow (how-to-ride) | ○ | 체크 아이콘 + 텍스트 → 정책 항목 나열에 적합 |
| HeroCard (how-to-ride) | △ | 인트로 카드로 사용 가능하나, START HERE 뱃지가 맥락에 안 맞음. props 수정 또는 미사용 |
| FAQItem (how-to-ride) | △ | 검증 방법 Q&A 형태 가능하나, 페이지 볼륨이 작아 과잉 |
| InfoCard (ui) | ○ | verificationLevel 4단계 표시에 적합 |
| Footer (home) | ○ | 동일 footer 재사용 |
| LangToggle (ui) | ○ | 페이지 헤더 |

**신규 컴포넌트 필요:** 없음. 기존 컴포넌트로 충분. 페이지 CSS만 신규.

### 2.3 i18n 키 규모 분석

**A. 기존 키 재사용 가능:**
- `common.footer` — 동일 면책 문구
- `routeDetail.disclaimer` — "Information based on Kakao Map. Please confirm before riding." 참고 가능
- `metadata.*` — 패턴 재사용

**B. 신규 키 예상 규모: 약 18~22개**
- 페이지 제목/설명: 3~4개
- 데이터 출처 섹션: 4~5개
- 검증 방법 섹션: 5~6개 (4단계 설명)
- 정확성 정책 섹션: 4~5개
- 기준일 정책: 2~3개
- metadata: 2개

**C. 네임스페이스 후보:**
- `dataSource.*` 권고 — "data-source" URL과 일관, 짧고 명확

### 2.4 1페이지 통합안 섹션 분할

**1페이지 통합안 유지 권고.** 사유:
- 전체 분량이 1~2 viewport로 매우 짧음
- SITE-STRATEGY §4 정확성 정책이 핵심 소스이나, 사용자용으로 재작성해도 볼륨 작음
- routes.json sourceUrls가 전부 `https://map.kakao.com` 1개뿐 → 데이터 출처 섹션이 길어질 여지 없음
- verificationLevel도 현재 전부 `kakao_seoul_verified` → 4단계 설명은 간략해도 됨

2페이지 분리는 콘텐츠 볼륨 확대(v1.1 이후, sourceUrls 다양화 시) 재검토.

### 2.5 URL 후보 비교 + 권고

| URL 후보 | SEO 키워드 | 정체성 정합 | 사용자 검색 | AI 인용 |
|----------|-----------|-----------|-----------|---------|
| `/data-source` | "data source" — 기술 용어, 일반 검색 약함 | ○ — 데이터 출처 명확 | △ | ○ — 데이터 투명성 시그널 |
| `/accuracy-policy` | "accuracy policy" — 정책 문서 느낌 | ○ — 정확성 정책 명확 | × — 사용자가 검색할 용어 아님 | ○ |
| `/how-we-verify` | "how we verify" — 행위 중심 | ○ | △ — 약간 더 자연스러움 | ○ |
| `/transparency` | "transparency" — 포괄적 | △ — 너무 넓음 | △ | △ |

**권고: `/data-source`** — 데이터 출처 + 정확성 정책을 통합하는 1페이지의 핵심 목적이 "우리 데이터가 어디서 오는가"이므로, data-source가 가장 직관적. i18n 네임스페이스(dataSource.*)와도 일관.

최종 URL 결정은 포그린이 한다.

## 3. C13 평가 결과

### 3.1 페이지 구조 분석

**A. 섹션 구성 후보**

| 순서 | 섹션명 후보 | 목적 |
|------|------------|------|
| 1 | 페이지 헤더 | "About Seoul Autonomous" / "Seoul Autonomous 소개" |
| 2 | 사이트 소개 | 무엇을 하는 사이트인지 (SITE-STRATEGY §1 요약) |
| 3 | 데이터 정책 링크 | Data Source 페이지로 링크 |
| 4 | 연락/피드백 | 이메일 또는 GitHub 링크 (있다면) |

**B. 페이지 길이 추정**
매우 짧음 (1 viewport 미만) — 앱 Settings About이 2줄(버전 + 검증일 + about.note)이었으므로, 웹에서 약간 확장해도 짧음.

**C. 사용자 동선**
- 진입: Footer 링크
- 다음: Data Source, Routes

### 3.2 기존 컴포넌트 재사용 가능성

| 컴포넌트 | 재사용 | 사유 |
|----------|--------|------|
| Footer (home) | ○ | 동일 |
| LangToggle (ui) | ○ | 헤더 |
| BulletRow (how-to-ride) | △ | 필요 시 정보 항목 나열 |

**신규 컴포넌트 필요:** 없음. 순수 텍스트 페이지.

### 3.3 i18n 키 규모 분석

**A. 기존 키 재사용:**
- `common.footer` — 면책 문구
- 앱 `settings.about.note` — "Route information is curated and last verified..." 직접 재사용 가능
- 앱 `settings.footer` — "SEOUL AUTONOMOUS"

**B. 신규 키 예상 규모: 약 8~12개**
- 페이지 제목: 2개
- 사이트 소개: 3~4개
- 연락/피드백: 2~3개
- metadata: 2개

**C. 네임스페이스 후보:**
- `about.*`

### 3.4 앱 재사용 범위

**앱 Settings 분석** (`app/(tabs)/settings.tsx`):

| 앱 Settings 항목 | 웹 About 재사용 |
|-----------------|----------------|
| Language 섹션 | × — 웹은 LangToggle로 별도 처리 |
| App version: "1.0.0" | △ — 웹 버전 표시 여부 포그린 결정 |
| Information verified: "2026-04-29" | ○ — routes.json lastUpdated 인용 가능 |
| about.note (검증 안내) | ○ — 직접 재사용 가능 |
| Privacy / Terms 링크 | ○ — 웹 C8/C9 구현 후 링크 |
| "SEOUL AUTONOMOUS" 푸터 | ○ — 브랜드 표기 |

**재사용 가능 i18n 키:**
- `settings.about.note` (en/ko) — 그대로 복사 가능
- `settings.footer` — "SEOUL AUTONOMOUS"
- `settings.row.informationVerified` — 라벨 재사용

**재사용 불가:**
- LangSwitch 컴포넌트 (웹은 LangToggle 사용)
- App version row (앱 전용)

## 4. 라운드 분할 권고

**1라운드 묶음 권고.**

사유:
- 두 페이지 모두 LOW 난이도
- 신규 컴포넌트 0개 (기존 BulletRow, InfoCard 재사용)
- i18n 총 키: 약 26~34개 (C11 18~22 + C13 8~12)
- 컴포넌트 의존성: Footer, LangToggle 공유 → 묶음 시 효율적
- 두 페이지 합산해도 How to Ride(Round 8B) 1라운드보다 작은 분량
- C13 About에서 C11 Data Source로 링크 → 동시 구현이 자연스러움

분리 시 장점 거의 없음 (각각 0.5라운드 분량이라 분리하면 비효율).

## 5. 다음 구현 라운드 지시서에 반영할 항목

### 페이지 구조
- C11: 5개 섹션 (헤더 → 출처 → 검증 방법 → 정확성 정책 → 기준일)
- C13: 4개 섹션 (헤더 → 소개 → 데이터 정책 링크 → 연락)
- 두 페이지 모두 TopBar(뒤로가기 + 제목 + LangToggle) 패턴 재사용

### 컴포넌트 재사용
- 신규 컴포넌트 0개
- BulletRow(how-to-ride) → C11 정책 항목
- InfoCard(ui) → C11 verificationLevel 4단계 (선택)
- Footer(home) → 양쪽 공통

### i18n 설계
- C11: `dataSource.*` 네임스페이스 (18~22키)
- C13: `about.*` 네임스페이스 (8~12키)
- 앱 `settings.about.note`, `settings.footer` 직접 복사
- `metadata.dataSourceTitle/Description`, `metadata.aboutTitle/Description` 추가

### URL 권고 (포그린 결정 대기)
- C11: `/[locale]/data-source` 권고
- C13: `/[locale]/about` (변경 없음)

### 추가 고려
- C13에서 C11로의 내부 링크 구성
- Footer에 Data Source + About 링크 추가 (현재 Footer에 링크 없음 — 구현 시 Footer 수정 최소화)

## 6. 검증 완료 항목

### 절대 금지선 준수 확인
- [x] 페이지 구현 0건
- [x] 컴포넌트 신규 작성 0건
- [x] 본문 완성 문구 / SEO 메타 문구 / 최종 카피 작성 0건
- [x] routes.json 변경 0건
- [x] SSoT/DECISIONS/SITE-STRATEGY/CLAUDE/README 변경 0건
- [x] web/messages/ 실제 변경 0건
- [x] web/components/ 변경 0건
- [x] 앱 프로젝트 변경 0건
- [x] C11 URL 확정 0건 (후보 비교 + 권고만)

### 산출물 완결성
- [x] C11, C13 모두 §5.1~§5.3 평가 완료
- [x] C11 §5.5 1페이지 섹션 분할 평가 완료
- [x] C11 §5.6 URL 후보 비교 + 권고 완료
- [x] C13 §5.4 앱 재사용 범위 평가 완료
- [x] §5.7 라운드 분할 권고 완료

### 권고 분류 명확성
- [x] 라운드 분할 권고에 사유 기재
- [x] URL 권고에 사유 + "최종 결정은 포그린" 명시
- [x] 권고 위상이 "최종 결정 아님"임을 명시
