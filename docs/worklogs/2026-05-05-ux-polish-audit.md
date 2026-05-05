# Round 11 — Global UX / Design Polish Audit

> audit-only. 구현 X. 우선순위는 포그린이 결정.

---

## 후보표

| # | 항목 | 현재 문제 | 사용자 영향 | 권고 수정 | 무게 |
|---|------|----------|------------|----------|------|
| 1 | 전역 내비게이션 (햄버거 메뉴) | 전역 메뉴 없음. 페이지 간 이동은 SiteFooter 또는 TopBar back 버튼에 의존 | 사용자가 FAQ/How to Ride/Routes를 찾으려면 Home 돌아가거나 Footer까지 스크롤해야 함 | 모바일: 햄버거 메뉴 (Home/Routes/FAQ/How to Ride + 나머지). 데스크탑 768px+: 상단 가로 링크 3~4개 + 나머지 More 또는 동일 햄버거 | 重 |
| 2 | Routes / Route Detail 헤더 체계 | Routes: 공통 Header/TopBar 없음 (H1 + 검색 바로 시작). Route Detail: 배지 TopBar에 Home 링크 없음, back 버튼만 /routes로 감 | 핵심 페이지에서 Home/FAQ/How to Ride 접근 불가. Routes에서 사이트 이름조차 안 보임 | GlobalHeader 도입 시 Routes/Route Detail에 우선 적용. Route Detail 배지 TopBar는 유지하되 GlobalHeader를 그 위에 배치 | 重 |
| 3 | Privacy / Terms 단조로움 | LegalDocument: sectionBlock 간 margin-top 32px만 있고 구분선/배경 변화 없음. 10+ 섹션이 평면적 나열 | 긴 법적 문서 읽기 피로. 다크 테크 톤이 이 페이지에서 거의 안 느껴짐 | sectionBlock 사이 hairline (border-top: 1px solid var(--color-border-1)) 추가. heading 좌측 accent bar (2px cyan) 또는 sectionBlock 교대 배경 (bg-1 / bg-2) 검토 | 軽 |
| 4 | Home 이동성 | Home에는 Hero header (Seoul Autonomous + LangToggle)만 있고 다른 페이지로 가는 상단 내비 없음. CTA "View Routes"만 존재 | FAQ/How to Ride/About 등으로 가려면 Footer까지 스크롤 | 전역 내비게이션(#1) 도입 시 자동 해결. Home Hero header에 햄버거 아이콘 추가 | 重 (1번에 포함) |
| 5 | Route Detail CTA 위치/크기 | allRoutesCta: height 48px, width 100%, ghost 스타일 (bg-2 + border). StopsList 아래, SiteFooter 바로 위 | 위치 적절. 다만 ghost 스타일이라 Kakao Map CTA(accent)보다 눈에 덜 띔. 위계는 맞음 (Kakao Map = primary, View All = secondary) | 현행 유지 가능. 강화하려면 텍스트에 accent 컬러 적용 또는 좌측 ArrowLeft 아이콘 추가 | 軽 |
| 6 | FAQ 디자인 | 8개 항목이 dl > div 구조로 border-bottom만으로 구분. 카테고리 그룹화 없음. 질문 18px, 답변 15px | 스크롤 길이 적당 (8개). 구분선 있어 읽기는 가능. 그러나 질문 터치 영역이 텍스트 영역만큼만 (padding: 24px 0) | 질문 padding을 24px 16px로 좌우 추가하여 터치 영역 확대. 카테고리 그룹화는 질문 수 증가 시 재검토. FAQ accordion은 현재 8개로는 불필요 | 軽 |
| 7 | SiteFooter | 링크 순서: Home/FAQ/How to Ride/Data Source/About/Privacy/Terms (현행). 터치 영역: padding 10px 0 (수직만, 수평 gap 16px). flex-wrap으로 모바일 2~3행 | 순서는 사용자 중심으로 적절 (Routes 빠져있음). 터치 영역 수직은 44px 미만 (13px + 10px*2 = 33px). Footer가 법적 문서 모음으로 보일 수 있음 | Routes 링크 추가 (Home 다음). 링크 터치 영역 padding 12px 4px로 확대. 상단부(Home/Routes/FAQ/How to Ride)와 하단부(법적 문서)를 시각적으로 분리 | 中 |
| 8 | Back to Top | 없음. Terms/Privacy가 가장 긴 페이지 (10+ 섹션). FAQ는 8항목으로 비교적 짧음 | Terms/Privacy 하단에서 상단 복귀 불편. Route Detail도 정류장 많으면 길어짐 | 스크롤 300px 이후 우하단 FAB. 모바일: right 16px, bottom 80px (SiteFooter/브라우저 UI 회피). 대상: Terms, Privacy, Route Detail. FAQ/About/Data Source는 페이지 짧아 불필요 | 軽 |
| 9 | 전체 시각 리듬 | 7개 페이지 유형이 동일 TopBar 패턴 (back + topTitle + LangToggle) 사용. Home/Routes만 다른 패턴 | 페이지 간 시각 일관성은 높음. 다만 Home과 나머지 페이지의 header 체계 단절. 1280px+에서 max-width 1200px 콘텐츠가 좁아 보일 수 있음 | 전역 내비게이션(#1) 도입으로 상단 체계 통일. 1920px 뷰포트에서 max-width 유지 (콘텐츠 밀도상 적절) | 中 (1번에 포함) |
| 10 | 사이트 전반 인상 | Home/Routes/Route Detail은 다크 테크 톤 잘 살아있음. How to Ride도 카드/스텝 구조로 양호. Privacy/Terms/About은 단조로움. Data Source는 bulletCard로 양호 | 핵심 페이지(Routes 계열)는 정보 사이트다움. 보조 페이지(법적 문서)는 운영 문서 느낌. 시안 포인트는 CTA/배지/상태에만 사용 — 의도대로 | 법적 페이지 polish (#3)만으로 전반 인상 개선 가능. 시안 포인트 추가 사용은 불필요 (과하면 역효과) | — |

---

## 항목별 메모

### 1. 전역 내비게이션
- 현재 9개 페이지 중 **Home과 Routes에는 상단 내비가 사실상 없음**
- 나머지 7개 페이지의 TopBar는 back → Home 1개 경로만 제공
- **Routes가 SiteFooter에 빠져있음** — 가장 중요한 페이지인데 Footer에서 접근 불가
- 데스크탑 1280px+에서 햄버거만 두면 공간 낭비. 가로 링크 3~4개 권고
- 메뉴 항목 순서 권고: Routes / How to Ride / FAQ / About / Data Source / Privacy / Terms

### 2. Routes / Route Detail 헤더
- **Routes 페이지**: RoutesList 컴포넌트가 자체 heading만 렌더링. 공통 header 부재. 사이트 이름, Home 링크 없음
- **Route Detail**: TopBar에 back → /routes, 배지, VERIFIED pill, LangToggle. Home 링크 없음
- 전역 내비게이션 도입 시 이 두 페이지를 **기준점**으로 삼아야 함 (가장 트래픽 높은 페이지)
- Route Detail의 배지 TopBar는 페이지 정체성이므로 제거 X. GlobalHeader는 그 위에 별도 행

### 3. Privacy / Terms
- LegalDocument.module.css `.sectionBlock { margin-top: 32px }` — 여백만으로 섹션 구분
- 권고 A: sectionBlock 상단에 `border-top: 1px solid var(--color-border-1)` + `padding-top: 32px`
- 권고 B: h2 좌측에 3px accent bar (시안, border-left)
- 권고 C: 교대 배경은 다크 테마에서 미묘해질 수 있어 hairline이 더 안전

### 5. Route Detail CTA
- 현재 위계: Kakao Map (accent 컬러 텍스트) > View All Routes (ghost)
- 이 위계는 정확함. Kakao Map이 primary action, View All은 탐색 보조
- 강화 필요성 낮음

### 7. SiteFooter
- **Routes 링크 누락** 발견. Home 다음에 Routes 추가 필요
- 현재 링크 터치 높이 33px (13px font + 10px*2 padding) — Apple HIG 44px 미달
- 상단 그룹 (탐색 링크)과 하단 그룹 (법적 문서) 분리하면 Footer가 덜 법적으로 보임

### 8. Back to Top
- Terms 영문: 12 섹션 + contact block. Privacy 영문: 11 섹션. 모바일에서 상당히 길어짐
- Route Detail: 정류장 20+ 노선은 StopsList가 길지만 collapse/expand 있어 덜 급함
- FAQ: 8개 항목, 한 화면 1.5~2배. 상대적으로 짧아 불필요

---

## 핵심 질문 답변

| 질문 | 답변 |
|------|------|
| 1. 어디서든 Home으로 갈 수 있는가? | **부분적.** 7개 페이지는 TopBar에 Home 링크 있음. Routes/Route Detail은 Home 링크 없음 (back → /routes만). SiteFooter에 Home 있지만 스크롤 필요 |
| 2. 전체 노선을 쉽게 찾는가? | **약함.** Home CTA로만 접근 가능. SiteFooter에 Routes 링크 없음. 다른 페이지에서 Routes로 가려면 Home 경유 필수 |
| 3. FAQ/How to Ride 쉽게 찾는가? | **SiteFooter 의존.** 상단에는 접근 경로 없음 (Home 제외). FAQ 페이지에 How to Ride cross-link은 있음 |
| 4. 긴 페이지에서 위아래 이동 편한가? | **아니오.** Back to Top 없음. Terms/Privacy에서 하단→상단 복귀 불편 |
| 5. 하단에서 다음 행동 보이는가? | **예.** SiteFooter 7개 링크 + Route Detail에 View All Routes CTA. FAQ에 cross-link 2개 |
| 6. 운영 문서 모음이 아닌 정보 사이트인가? | **핵심 페이지는 예.** Home/Routes/Route Detail/How to Ride는 정보 사이트다움. Privacy/Terms는 운영 문서 느낌. 전역 내비 부재가 가장 큰 원인 |

---

## 무게별 정리

**重 (사이트 전체에 영향)**
- #1 전역 내비게이션 + #2 Routes/Route Detail 헤더 + #4 Home 이동성 + #9 시각 리듬 → 하나의 GlobalHeader 작업으로 묶일 수 있음

**中**
- #7 SiteFooter (Routes 링크 추가 + 터치 영역 + 그룹 분리)

**軽**
- #3 Privacy/Terms 구분선
- #5 Route Detail CTA (현행 유지 가능)
- #6 FAQ 터치 영역
- #8 Back to Top

---

*Claude Code는 후보별 권고는 하되, 다음 라운드 확정은 하지 않는다. 구현 우선순위는 포그린이 최종 결정한다.*
