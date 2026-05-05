# Round 11B-Design — GlobalHeader 설계안

> 구현 X. 포그린 승인 후 11B-Build에서 구현.

---

## 현재 상단 구조 (페이지별)

| 페이지 | 상단 구조 | Home 접근 | Routes 접근 | 다른 페이지 접근 |
|--------|----------|----------|------------|----------------|
| Home | Hero header (로고 + "Seoul Autonomous" + LangToggle) | 현재 페이지 | CTA 버튼 | Footer만 |
| Routes | 없음 (H1 바로 시작) | X | 현재 페이지 | Footer만 |
| Route Detail | back(/routes) + 배지 + VERIFIED + LangToggle | X | back 버튼 | Footer만 |
| How to Ride | back(Home) + topTitle(Home링크) + LangToggle | topTitle | X | Footer만 |
| FAQ | back(Home) + topTitle(Home링크) + LangToggle | topTitle | X | cross-link 2개 |
| Data Source | back(Home) + topTitle(Home링크) + LangToggle | topTitle | X | About 링크 |
| About | back(Home) + topTitle(Home링크) + LangToggle | topTitle | X | Data Source 링크 |
| Privacy | back(Home) + topTitle(Home링크) + LangToggle | topTitle | X | Footer만 |
| Terms | back(Home) + topTitle(Home링크) + LangToggle | topTitle | X | Footer만 |

**핵심 문제:** Routes/Route Detail에서 Home 접근 불가. 모든 페이지에서 다른 주요 페이지(Routes/FAQ/How to Ride) 상단 접근 불가.

---

## 후보 패턴 3개

### A. GlobalHeader 1행 추가 (로고 + 햄버거)

```
[로고 Seoul Autonomous]          [햄버거 아이콘]
─────────────────────────────────────────────
(기존 TopBar / Hero / RoutesList 그대로)
```

- 모든 페이지 최상단에 동일한 1행 추가
- 로고 클릭 = Home
- 햄버거 클릭 = 오버레이 메뉴 (Routes / How to Ride / FAQ / About / Data Source / Privacy / Terms)
- 데스크탑 768px+: 햄버거 대신 가로 링크 (Routes / How to Ride / FAQ) + 나머지는 생략 또는 More
- LangToggle은 GlobalHeader 우측 또는 메뉴 내부로 이동
- 기존 TopBar (back + topTitle)는 유지. Route Detail 배지 TopBar도 유지

### B. 기존 TopBar 확장 (back + 로고 + 햄버거)

```
[back] [Seoul Autonomous]        [햄버거] [LangToggle]
```

- 기존 7개 페이지의 TopBar를 확장: topTitle을 "Seoul Autonomous"(Home링크)로 통일, 우측에 햄버거 추가
- Home: Hero header에 햄버거 추가
- Routes: 새로 TopBar 추가 (back X, 로고 + 햄버거)
- Route Detail: 배지 TopBar 위에 compact bar 추가 또는 배지 행에 햄버거 삽입

### C. Home 스타일 확장 (로고 바 전역화)

```
[로고마크] Seoul Autonomous      [LangToggle]
```

- Home의 Hero header 스타일을 전역으로 사용
- 햄버거 없음. 대신 주요 링크를 로고 바 아래 2행째에 배치
- 데스크탑: `[로고] Seoul Autonomous   Routes  How to Ride  FAQ   [LangToggle]`
- 모바일: `[로고] Seoul Autonomous [햄버거] [LangToggle]` (결국 A와 동일)

---

## 비교표

| 기준 | A. GlobalHeader 1행 | B. TopBar 확장 | C. 로고 바 확장 |
|------|---------------------|---------------|----------------|
| 기존 구조 영향 | 최소 (위에 1행 추가만) | 中 (기존 TopBar 수정 필요) | 中 (Home header 복제) |
| Routes/Route Detail 적용 | 자연스러움 (위에 얹기만) | Route Detail 배지와 충돌 가능 | 자연스러움 |
| 모바일 높이 증가 | +48px | +0~8px (기존 행 재활용) | +48px |
| 데스크탑 가로 링크 | 가능 (768px+) | 어려움 (공간 부족) | 자연스러움 |
| 컴포넌트 신규 | GlobalHeader 1개 + MobileMenu 1개 | 기존 TopBar 수정 + MobileMenu 1개 | GlobalHeader 1개 + MobileMenu 1개 |
| 시각 일관성 | 최고 (모든 페이지 동일) | 高 (기존 패턴 유지) | 高 (Home 톤 통일) |
| 구현 복잡도 | 低 | 中 (페이지별 분기) | 低~中 |

---

## 추천안: A. GlobalHeader 1행 추가

**사유:**
1. 기존 구조를 **일절 건드리지 않음** — 위에 1행만 추가
2. Route Detail 배지 TopBar 유지 (망가뜨리지 않음)
3. Routes 페이지에 Header 부재 문제 즉시 해결
4. 모든 9개 페이지에 동일 컴포넌트 1개만 삽입
5. 데스크탑에서 가로 링크 자연스러움

**구현 범위 (11B-Build):**

| 파일 | 작업 |
|------|------|
| `components/common/GlobalHeader.tsx` | 신규. 로고 + 햄버거 + 데스크탑 링크 + LangToggle |
| `components/common/GlobalHeader.module.css` | 신규 |
| `components/common/MobileMenu.tsx` | 신규. 오버레이 메뉴 (client component) |
| `components/common/MobileMenu.module.css` | 신규 |
| `app/[locale]/page.tsx` (Home) | Hero header를 GlobalHeader로 교체 |
| `app/[locale]/routes/page.tsx` | GlobalHeader 추가 |
| `app/[locale]/routes/[id]/page.tsx` | GlobalHeader 추가 (배지 TopBar 위) |
| 나머지 6개 페이지 | GlobalHeader 추가, 기존 TopBar의 LangToggle 제거 (GlobalHeader로 이동) |
| i18n (en.json, ko.json) | `globalHeader` 네임스페이스 추가 |

**기존 TopBar 처리:**
- How to Ride / FAQ / Data Source / About / Privacy / Terms: 기존 back + topTitle 유지, LangToggle만 제거
- Route Detail: 배지 TopBar 그대로 유지, LangToggle만 제거
- Home: Hero header 제거 → GlobalHeader가 대체
- Routes: 변경 없음 (원래 TopBar 없었음)

**모바일 메뉴 항목 순서:**
Routes / How to Ride / FAQ / About / Data Source / Privacy / Terms

**데스크탑 가로 링크 (768px+):**
Routes / How to Ride / FAQ (3개만. 나머지는 Footer에서)

---

## 포그린 결정 필요 사항

1. **패턴 A/B/C 중 선택** (추천: A)
2. Home Hero header를 GlobalHeader로 완전 교체할지, GlobalHeader + Hero header 병행할지
3. 데스크탑 가로 링크를 3개(Routes/How to Ride/FAQ)로 할지, 더 넣을지
4. 모바일 메뉴 열렸을 때 배경 처리 (반투명 overlay vs 전체화면)

---

*Claude Code는 설계안을 제시하되, 최종 결정은 포그린이 한다.*
