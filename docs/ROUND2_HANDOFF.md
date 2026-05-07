# Seoul Autonomous — Round 2 핸드오프 문서

**작성일:** 2026-05-06
**이전 라운드:** Round 1 + Round 1.5 완료 (커밋 `c4b37d9`까지)
**서버:** http://localhost:3099

---

## 0. 컨텍스트 요약 (새 세션이 알아야 할 것)

### 프로젝트 개요
- **Seoul Autonomous** — 서울시 자율주행 버스/로보택시 안내 사이트
- 다크 테크 톤, 미니멀, 정보성, 한/영 i18n
- Next.js + CSS Modules (Tailwind 없음)
- 9개 페이지: Home / Routes / Route Detail / How to ride / FAQ / About / Data source / Privacy / Terms

### 페이지 폭 시스템 (의도된 차이)
| 페이지 | max-width | 사유 |
|---|---|---|
| Home, Routes, Route Detail, How to ride | 1120px (default) | 카드/그리드 레이아웃 |
| FAQ, About, Data source, Privacy, Terms | 720px (longform) | 텍스트 가독성 (한 줄 65~75자) |

→ **720은 의도. 올리지 마세요.**

### 컴포넌트 구조
- `PageContainer` — default(1120) / longform(720) variant
- `GlobalHeader` — 풀폭 nav. 좌측 로고 / 가운데 메뉴 / 우측 EN-KO 토글
- `GlobalFooter` — nav 그룹 + legal 그룹 + disclaimer

### Round 1 + 1.5에서 완료된 것 (참고용)
- N 마크 제거 (devIndicators: false)
- PageContainer 도입 (1120 / 720)
- EN/KO 토글 GlobalHeader 이동
- 중복 disclaimer 제거 (RoutesList footer)
- 5개 longform 페이지 중복 topTitle 제거
- Drawer separator (Privacy/Terms 앞 구분선)
- Home 폭 일치 (FeaturedRoutes/CTASection이 PageContainer 밖이었음 → 수정)
- About 2-column 카드 레이아웃
- FAQ 질문 간 여백 확장 + 좌측 cyan accent bar

### Round 1.5 마무리 단계 (커밋 `c4b37d9` 이후 진행 중일 수도 있음)
- **로고 정렬 수정** — GlobalHeader 내부 컨테이너를 PageContainer와 동일 폭(1120)/padding으로 맞춤
- 검증: 1280px 뷰포트에서 로고 좌측 x좌표 == hero h1 좌측 x좌표

→ **새 세션 시작 시 이게 push되어 있는지 먼저 확인.**

---

## 1. Round 2 작업 범위

Round 2는 두 묶음입니다:

### 묶음 A — Route Detail 페이지 재설계 (메인 작업)
### 묶음 B — Privacy/Terms 시각 보강 (잔여 R1 작업, 가벼움)

**진행 순서: B 먼저(빠르고 안전) → A (메인)**

---

## 2. 묶음 B — Privacy/Terms 시각 보강

### 배경
Round 1에서 longform 페이지 시각 보강을 일부만 했음:
- About → 2-column 카드 ✅
- FAQ → 질문 간 여백 + accent bar ✅
- **Privacy / Terms → 미처리** (이번 라운드에 처리)

원래 풀 TOC (sticky sidebar + IntersectionObserver scroll-spy)를 제안했으나 R8B 교훈(범위 흔들림)으로 보류함. 대신 **가장 가볍고 안전한 옵션**으로 진행.

### 작업 내용

```
Task B-1: Privacy / Terms 섹션 시각 분리

조치:
1. 각 h2 섹션 헤더("1. Acceptance of Terms" 등) 위에 얇은 divider 추가
   - className equivalent: border-t border-zinc-800/50 pt-10 mt-14
   - 단, 첫 번째 섹션(1번)에는 divider 없음

2. 섹션 번호 cyan 강조
   - "1. Acceptance of Terms" 에서 "1." 부분만 text-cyan-400 (#22d3ee 계열)
   - 나머지 텍스트는 기존 색상
   - 구현 힌트: <h2><span style="color: cyan">1.</span> Acceptance of Terms</h2>
   - i18n 문자열에서 "1." 분리가 어려우면 정규식 split 또는 CSS로 처리

3. 적용 범위
   - Privacy: 1~8번 섹션
   - Terms: 1~11번 섹션
   - EN/KO 양 언어 동시

제약:
- i18n 키 추가 절대 금지 (R8B 교훈)
- JS 추가 없음 (scroll-spy 등 X)
- CSS Modules 컨벤션 따르기
- 기존 다크 톤 / zinc 팔레트 유지

검증:
- 섹션 사이 시각적 휴식 지점 확인
- divider가 너무 진하지 않은지 (50% 투명도 유지)
- 모바일에서도 자연스러운지
- 1280px / 375px 둘 다 캡처
```

**예상 시간: 20~30분**

---

## 3. 묶음 A — Route Detail 페이지 재설계

### 배경
Route Detail은 9개 페이지 중 시각 검증이 아직 안 된 페이지. Round 1 audit 캡처에도 포함 안 됐음. 다른 페이지 정합성 작업이 끝났으니 이제 Route Detail을 본격적으로 재설계할 차례.

### 사전 준비 (새 세션이 먼저 할 것)
1. **Route Detail 캡처 요청**
   - URL 예: `/en/routes/cheongwadae-a01` 또는 `/en/routes/[가장 데이터 풍부한 노선]`
   - 데스크톱 1280px 1장 + 모바일 375px 1장
   - 한국어/영어 동일하니 EN만으로 충분

2. **현재 페이지 코드 읽기**
   - Route Detail page 파일
   - 사용된 컴포넌트들 (RouteHeader, StopList, MetaGrid 등 — 명칭 추정)
   - i18n 키 목록

3. **현재 데이터 구조 파악**
   - 노선당 어떤 필드가 있는지 (route_name_en/ko, stops, schedule, fare, reservation, verification_date 등)
   - 일부 필드는 "Unknown"이 정상 (Round 1에서 확정된 정책)

### 작업 의도

데스크톱과 모바일 둘 다 같이 처리합니다 (디바이스 분리하지 않음):

#### 데스크톱 (≥1024px) — 2-column 레이아웃
```
┌──────────────────────────┬───────────────────────┐
│ LEFT (main, ~720px)      │ RIGHT (sticky, ~340)  │
│                          │                       │
│ Route header             │ Quick facts card      │
│ - VERIFIED chip          │ - First/last service  │
│ - Route name (EN+KO)     │ - Operating days      │
│ - From → To              │ - Reservation status  │
│                          │ - Fare                │
│ Stop diagram (vertical)  │ - Last verified date  │
│ ├─ Stop 1                │                       │
│ ├─ Stop 2                │ External links        │
│ ├─ ...                   │ - Open in Kakao Map → │
│ └─ Stop N                │                       │
│                          │ Disclaimer            │
│ Schedule details         │ (route-specific)      │
│ Notes / extra info       │                       │
└──────────────────────────┴───────────────────────┘
```

#### 모바일 (<1024px) — 1-column 정리
- 현재 모바일에서 메타 정보가 4-cell grid로 갇혀있다는 가정 (확인 필요)
- 4-grid → inline meta list 또는 1-column stacked card로 변경
- Stop diagram: 세로 통일 (가로 timeline 금지 — 모바일에서 깨짐)
- Sticky right column 없음, 모든 섹션 세로 흐름

### Route Detail에서 점검할 항목 (캡처 받고 확인)
1. **VERIFIED chip 위치/크기 일관성** — Routes 리스트의 chip과 동일 스타일?
2. **Stop diagram 시각 표현** — 점-선 connector, 첫/끝 stop 강조, 텍스트 정렬
3. **Meta 정보 그리드** — 4-cell이라면 어떤 필드들이 들어가 있는지, 모바일에서 어떻게 깨지는지
4. **노선별 disclaimer** — Round 1에서 유지하기로 했음. 위치와 톤 확인
5. **Back 버튼** — Routes 리스트로 돌아가는 동작
6. **External link** — Kakao Map 등 외부 링크가 있다면 링크 버튼 스타일
7. **Empty state** — fare/reservation이 "Unknown"인 경우 어떻게 표시되는지

### 작업 흐름
1. 새 세션 시작 → 이 핸드오프 문서 읽기
2. Round 1.5 커밋(c4b37d9 또는 그 이후) 푸시 상태 확인
3. **Task B (Privacy/Terms 시각 보강) 먼저 진행** — 작고 안전
4. B 완료 후 push → 캡처 검증 → 다음 단계
5. **Task A 시작**:
   a. Route Detail 캡처 요청 (데스크톱+모바일)
   b. 현재 코드/데이터 구조 파악
   c. 디자인 클로드(이 어시스턴트)와 페이지 구조 합의
   d. 구현 → push → 캡처 검증
6. 디자인 클로드가 캡처 보고 회귀/개선점 피드백
7. 마무리 단계 라운드(필요 시)

### 제약 사항 (R8B 교훈 + Round 1에서 확정된 것들)
- **i18n 키 추가 최소화** — 추가가 필요하면 사전에 합의 후
- **데이터 모델 변경 금지** — UI만
- **"Unknown" / "—" 정책 유지** — 추측해서 채우지 말 것
- **다크 테크 톤 유지** — 새 색상 도입 X
- **CSS Modules 컨벤션** — Tailwind 도입 X
- **PageContainer 1120 (default) 유지** — Route Detail은 default 폭 페이지

---

## 4. 새 세션이 따라야 할 워크플로우

### 시작 시 체크리스트
1. [ ] 이 문서(ROUND2_HANDOFF.md) 읽기
2. [ ] 마지막 커밋 SHA 확인 (`c4b37d9` 또는 이후)
3. [ ] localhost:3099 서버 상태 확인
4. [ ] 디자인 클로드(이 어시스턴트)에게 "Round 2 시작합니다, 핸드오프 문서 따라 진행" 알림

### 디자인 클로드와의 협업 방식 (Round 1에서 확립된 패턴)
- Claude Code = 구현 담당 (코드 작성, push)
- 디자인 클로드 = 검증/피드백 담당 (캡처 보고 회귀/개선 진단)
- **사이클**: Claude Code 구현 → push → 포그린(사용자)이 캡처 보냄 → 디자인 클로드 진단 → Claude Code 후속 작업

### 의사결정 패턴
- 범위 확장이 보이면 **포그린에게 분리 승인 요청** (R8B 교훈)
- i18n 키 추가는 **사전 합의 필수**
- 큰 구조 변경은 **단계 분리 후 각 단계 검증**

---

## 5. 알려진 이슈 / 미결 사항

### Round 1에서 보류된 작업
- **Privacy/Terms sticky TOC** — Round 2에서도 안 함. 풀 TOC는 무거움 + 법적 페이지에 과함. 위 묶음 B의 가벼운 버전으로 대체.
- **FAQ 카테고리 그루핑** — i18n 키 추가 필요해서 보류 중. 별도 라운드에서 포그린 승인 받고 진행.

### 데이터/카피 미결
- 일부 노선의 fare, reservation 필드가 "Unknown"인 채로 유지됨 (정상, 추측 금지)
- 노선별 disclaimer 카피는 현재 그대로 유지

---

## 6. 핵심 원칙 (Round 1에서 확립)

1. **풀 오딧 vs 부분 회귀** — 부분 수정만 보면 전체 정합성 놓침. 페이지 단위로 한 번에 검증.
2. **디바이스 분리 X, 페이지 분리 O** — 한 페이지의 데스크톱+모바일을 같이 처리.
3. **콘텐츠 추가 자제** — 유저가 명시적으로 요청한 것만. 빈 공간은 레이아웃으로 해결.
4. **사전 합의 없는 i18n 키 추가 X**
5. **추측 데이터 X** — Unknown은 Unknown으로.
6. **다크 톤 + zinc 팔레트 + cyan accent** — 디자인 시스템 유지.

---

## 7. 마지막 메모

새 세션이 시작되면 이 문서를 디자인 클로드에게 전달하세요. 디자인 클로드가 컨텍스트를 빠르게 회복하고 Round 2를 이어갑니다.

**진행 순서 다시:**
1. Round 1.5 마무리(로고 정렬) push 확인
2. **묶음 B (Privacy/Terms 섹션 divider + 번호 cyan)** 먼저
3. **묶음 A (Route Detail 재설계)** 본 작업

수고하셨습니다.
