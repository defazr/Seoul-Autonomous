# Round 8A — How to Ride Page Audit

> Date: 2026-05-04
> Status: Complete (audit-only)

---

## 1. 앱 v1에 How to Ride 화면 존재 여부

**존재함.**

- 파일: `app/(tabs)/how-to-ride.tsx`
- 탭 구조: 4번째 탭 중 3번째 (Home → Routes → **How to ride** → Settings)
- 탭 레이아웃: `app/(tabs)/_layout.tsx` line 40-45, IconHelp 아이콘 사용

### 사용 컴포넌트 (6개)
| 컴포넌트 | 파일 | 웹 존재 |
|----------|------|---------|
| Eyebrow | `components/ui/Eyebrow.tsx` | X |
| SegmentedControl | `components/ui/SegmentedControl.tsx` | O (web/components/ui/) |
| HeroCard | `components/ui/HeroCard.tsx` | X |
| FAQItem | `components/ui/FAQItem.tsx` | X |
| StepCard | `components/ui/StepCard.tsx` | X |
| KakaoCard | `components/ui/KakaoCard.tsx` | X |
| BulletRow | `components/ui/BulletRow.tsx` | X |

---

## 2. 콘텐츠 구조 audit

### 페이지 레이아웃 (위→아래)
1. **Header** — 제목 "How to ride" / "이용 방법"
2. **SegmentedControl** — BUS / TAXI 탭 전환
3. **HeroCard** — "First time? Start here." + 설명 + 3개 불릿
4. **FAQ 섹션** — "Common questions" / "자주 묻는 질문", 5개 Q&A (접힘/펼침)
5. **Visual Guide 섹션** — "Visual guide" / "단계별 안내", 4단계 StepCard 2x2 그리드
6. **KakaoCard** (TAXI 탭에서만) — "For robotaxi riders", 4단계 + 주의사항
7. **Tips 섹션** — "Good to know" / "알아두면 좋은 점", 4개 체크 불릿
8. **Footer** — 공통 면책 문구

### 텍스트 문구 (한글/영문 모두 존재)
- 전체 i18n 키: `howToRide.*` (앱 lib/i18n/en.json line 48-109, ko.json 동일 구조)
- 영문 62개 키, 한글 62개 키 — 1:1 대응

### 단계 수
- Visual Guide: **4단계** (정류장 찾기 → 시간 확인 → 카드/앱 → 안전 요원)
- Kakao T 가이드: **4단계** (앱 열기 → 입력 → 옵션 → 확인 후 탑승)

### 시각 요소
- HeroCard: START HERE 뱃지 (SparkleIcon), 3개 불릿에 아이콘 (QR, Check, Sensor)
- StepCard: 각 스텝별 아이콘 (Pin, Clock, Phone SVG, Bus)
- FAQItem: Plus/Minus 토글 아이콘
- KakaoCard: Phone SVG 아이콘
- BulletRow: Check 아이콘 (accent circle 배경)

### 다루는 항목
| 항목 | 내용 |
|------|------|
| 정류장 찾기 | Step 1: Routes 탭에서 검증된 정류장 확인 |
| 시간 확인 | Step 2: 첫차/막차, 운영 요일 |
| 탑승/결제 | Step 3: T-money/컨택리스 카드, 또는 Kakao T |
| 안전 요원 | Step 4: 시범 운행 중 동승 안내 |
| 앱 필요 여부 | FAQ Q1: 버스 X, 로보택시 Kakao T |
| 외국인 탑승 | FAQ Q2: 공개 시범 노선, 안내 따르면 가능 |
| 요금 결제 | FAQ Q3: T-money/앱 결제 |
| 실시간 여부 | FAQ Q4: 아님, 수동 검증 |
| 탑승 전 확인 | FAQ Q5: 시간/요일/운영 상태 |

---

## 3. 컴포넌트 재사용 분석

### 웹에 이미 있는 것 (재사용 가능)
| 컴포넌트 | 용도 |
|----------|------|
| SegmentedControl | BUS/TAXI 탭 전환 |
| LangToggle | 페이지 헤더 |
| Button | CTA 등 |

### 새로 만들어야 할 것 (5개)

| 컴포넌트 | 난이도 | 설명 |
|----------|--------|------|
| HeroCard | LOW | 카드 + 뱃지 + 불릿 3개. 순수 표시용, 상태 없음 |
| FAQItem | LOW | 접힘/펼침 useState 1개. details/summary HTML로도 가능 |
| StepCard | LOW | 순수 표시용 카드. 아이콘 + 텍스트 |
| KakaoCard | LOW | 순수 표시용 카드. 번호 리스트 + 주의사항 |
| BulletRow | TRIVIAL | flex row + 체크 아이콘 |

### 위치 권고
- `web/components/how-to-ride/` 하위에 생성 (지시서 §금지: web/components/ui/ 신규 추가 금지)
- Eyebrow는 앱에서 섹션 제목용으로 쓰이지만, 웹에서는 CSS class로 충분 (별도 컴포넌트 불필요)

---

## 4. i18n 상태

### 앱 i18n 키 구조 (`howToRide.*`)
```
howToRide.title
howToRide.filter.buses / robotaxis
howToRide.hero.title / description / bullet1~3
howToRide.faq.sectionTitle / q1~q5 (각 .q, .a1, .a2)
howToRide.steps.sectionTitle / s1~s4 (각 .title, .desc)
howToRide.kakao.sectionTitle / title / titleKr / step1~4 / note
howToRide.tips.sectionTitle / t1~4
```

### 웹 messages 현재 상태
- `web/messages/en.json`에 `howToRide` 키 없음
- `web/messages/ko.json`에 `howToRide` 키 없음

### 권고
- 앱의 `howToRide.*` 키를 웹 messages에 그대로 복사 가능
- 단, 앱은 `{{count}}` (i18next), 웹은 `{count}` (next-intl ICU) → 보간 문법 변환 불필요 (howToRide에 보간 사용 없음)
- 키 구조 완전 동일하게 가져갈 수 있음

---

## 5. 앱에 없는 경우

**해당 없음** — 앱 v1에 How to Ride 화면이 존재함.

---

## 6. 난이도 평가

**LOW**

근거:
- 앱에 완전한 화면/콘텐츠/i18n이 이미 존재
- 새 컴포넌트 5개 전부 순수 표시용 (상태: FAQItem만 useState 1개)
- SVG 아이콘은 인라인으로 이식 (앱 패턴 동일)
- SegmentedControl 이미 웹에 있음
- 데이터 의존 없음 (routes.json 불필요, 순수 정적 콘텐츠)

**8B 단일 라운드 가능: YES**

분할 불필요. Round 7B(Route Detail)보다 복잡도 낮음:
- Route Detail: 동적 라우팅 + generateStaticParams + data 의존 + 5개 컴포넌트
- How to Ride: 정적 페이지 + 순수 콘텐츠 + 5개 표시 컴포넌트

---

## 7. SEO/정보성 페이지 적합성 audit

### 단순 앱 화면 복제 vs 검색 유입용 정보성 페이지

현재 앱 콘텐츠는 **관광객 대상 이용 가이드**로, 검색 유입 가치가 있음:
- "how to ride autonomous bus seoul" (EN 검색)
- "서울 자율주행버스 타는 법" (KO 검색)

### 한국어 페이지 기준 네이버 검색 적합 H1 후보
1. "서울 자율주행버스 타는 법"
2. "서울 자율주행 버스·로보택시 이용 가이드"
3. "서울 자율주행 시범 노선 탑승 방법"
4. "서울 자율주행 교통 이용 안내"

### 영문 H1 후보
1. "How to ride autonomous buses in Seoul"
2. "Seoul autonomous bus & robotaxi rider's guide"

**결정 X — 후보 나열만.** 실제 H1 결정은 8B 지시서에서.

### 확장 가능성 (8A 범위에서는 제안만)
- FAQ 구조를 JSON-LD FAQ Schema로 확장 가능 (SEO 이후 라운드)
- 정류장별 링크를 Route Detail로 연결 가능 (콘텐츠 내 내부 링크)

---

## 8. 정확성/출처 리스크 audit

### 확정 정보 (앱 v1 SSoT에 명시)
| 정보 | 출처 |
|------|------|
| 노선 목록, 정류장, 운행 시간 | routes.json |
| T-money/컨택리스 카드 사용 | 앱 i18n howToRide.faq.q1.a1 |
| Kakao T 앱 필요 (로보택시) | 앱 i18n howToRide.faq.q1.a2 |
| 수동 검증, 실시간 아님 | 앱 i18n howToRide.faq.q4.a1 |
| 안전 요원 동승 가능 | 앱 i18n howToRide.hero.bullet3 |

### 추정/확인 필요 정보
| 정보 | 리스크 |
|------|--------|
| "Most listed services are public pilot routes. International visitors can usually ride" | "usually" — 모든 노선에 대해 검증되지 않음. 개별 운영사 정책에 따라 다를 수 있음 |
| "T-money or a contactless card where accepted" | "where accepted" — 일부 노선에서 무료이거나 결제 방법이 다를 수 있음 |
| "Fare rules may vary by route" | 현재 routes.json의 fare 필드가 대부분 "Unknown" |
| Kakao T 이용 절차 (4단계) | 앱 UI 변경 시 단계가 달라질 수 있음 |

### 면책/안내 필요 여부
- **필요함.** 앱 패턴 재사용 가능:
  - 페이지 하단: `common.footer` ("Pilot service operated by the Seoul Metropolitan Government...")
  - HeroCard 내: "Always check before riding" 이미 포함
  - KakaoCard 내: "Service availability may vary" 이미 포함
- 추가 기준일 표시 불필요 — How to Ride는 날짜 의존 콘텐츠가 아님 (routes.json의 lastChecked와 무관한 일반 가이드)

---

## 결론 요약

| 항목 | 결론 |
|------|------|
| §1 존재 여부 | **앱 v1에 존재** (`app/(tabs)/how-to-ride.tsx`) |
| §2 콘텐츠 | 4단계 가이드 + 5 FAQ + Kakao T 가이드 + 4 Tips, EN/KO 완비 |
| §3 컴포넌트 | 신규 5개 (전부 LOW), SegmentedControl 재사용 |
| §4 i18n | 앱 키 그대로 복사 가능, 보간 변환 불필요 |
| §5 앱 미존재 시 | 해당 없음 |
| §6 난이도 | **LOW**, 단일 라운드(8B) 가능 |
| §7 SEO | 검색 유입 가치 있음, H1 후보 4개(KO) + 2개(EN) 기록 |
| §8 정확성 | 확정 5건, 추정/확인 필요 4건, 면책 문구 앱 패턴 재사용 가능 |

**8B 단일 라운드 진행 가능. 추가 audit 라운드(8A-2) 불필요.**
