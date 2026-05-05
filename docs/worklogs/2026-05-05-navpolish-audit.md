# Round 10G-NavPolishAudit — 디자인/UX 점검

> Date: 2026-05-05
> Status: Complete
> Type: audit-only

## Summary

9개 페이지의 내비게이션/UX를 실제 화면 기준으로 점검. 핵심 발견: 상단 내비게이션 부재(SiteFooter만 의존), SiteFooter 터치 영역 부족, Route Detail 하단 CTA 없음. 軽 4건 + 中 1건 + 보류 2건.

## 점검 결과 표

| # | 항목 | 문제 | 사용자 영향 | 권고 수정 | 무게 |
|---|------|------|-------------|-----------|------|
| 1 | **SiteFooter 터치 영역** | 링크 font-size 13px, line-height 18px, gap 8px — 모바일 터치 타겟 최소 44px 미달 | 모바일에서 잘못 누를 가능성 | 링크에 `padding: 8px 0` 추가 → 터치 영역 34px 확보 (gap과 합산 42px). 또는 padding: 10px 0으로 38px | 軽 |
| 2 | **Route Detail 하단 CTA** | StopsList 아래 SiteFooter 사이 빈 공간. 다른 노선 탐색 경로 없음 | 상세 페이지 본 뒤 다른 노선 찾기 어려움 | "View all routes" / "전체 노선 보기" 인라인 링크 추가 (SiteFooter 위) | 軽 |
| 3 | **Home 이동성** | 서브 페이지(FAQ, Data Source 등)에서 Home 가는 유일한 경로가 TopBar 뒤로가기 버튼(←). 사이트 로고/이름 클릭으로 Home 가기 기대하는 사용자 패턴 미지원 | Home 복귀 경로 불명확 | TopBar의 topTitle 텍스트를 Home 링크로 변경, 또는 SiteFooter에 Home 링크 추가 | 軽 |
| 4 | **SiteFooter copyright** | copyright 문구 없음 | 독립 사이트 신뢰도 약화 | `© 2026 Seoul Autonomous. Independent guide.` / `© 2026 Seoul Autonomous. 독립 안내 사이트.` 추가 | 軽 |
| 5 | **전역 상단 내비게이션** | 상단 메뉴 없음. SiteFooter만으로 페이지 간 이동 지원 | 페이지 하단까지 스크롤해야 다른 페이지로 이동 가능 | 모바일: 햄버거 메뉴 + 사이드 드로어. 데스크탑: 상단 링크 바. 주요 항목: Routes / FAQ / How to Ride | 中 |
| 6 | **Back to Top** | 긴 페이지(Privacy 8섹션, Terms 11섹션, Route Detail 87 stops)에서 상단 복귀 어려움 | 긴 페이지 모바일 사용성 저하 | 우측 하단 고정 버튼, 스크롤 300px 이후 노출. SiteFooter와 겹치지 않는 위치 (bottom: 80px) | 보류 |
| 7 | **FAQ accordion** | 8문항이 모두 펼쳐져 있어 페이지 길이 김 | 스크롤 증가, 특정 질문 찾기 어려움 | accordion 도입 시 SEO 영향 검토 필요 (FAQPage JSON-LD는 펼친 텍스트 기준). 검색엔진이 숨긴 텍스트를 동등하게 평가하는지 확인 후 결정 | 보류 |

## 분류 요약

### 軽 (즉시 구현 가능 — 1라운드로 묶음 가능)
1. SiteFooter 터치 영역 padding 추가
2. Route Detail 하단 "View all routes" 링크
3. Home 이동성 개선 (TopBar topTitle → Home 링크)
4. SiteFooter copyright 문구

### 中 (구현 라운드 분리 필요)
5. 전역 상단 내비게이션 (햄버거 메뉴) — 설계 + 구현 필요. 모바일/데스크탑 분기. 'use client' 컴포넌트.

### 보류 (충분한 근거/사용자 검증 필요)
6. Back to Top — 배포 후 사용자 행동 데이터로 필요성 검증
7. FAQ accordion — SEO/접근성 영향 확인 후 결정

## 4 viewport 점검 결과 (프로덕션 빌드)

| 항목 | 375px | 768px | 1280px | 1920px |
|------|-------|-------|--------|--------|
| 좌우 여백 | 20px padding 정상 | 정상 | max-width 1200px 정상 | 동일 |
| 섹션 간격 | 32px 균일 | 정상 | 정상 | 정상 |
| SiteFooter wrap | 3줄 wrap (6링크) | 2줄 | 1줄 | 1줄 |
| TopBar 위치 | 정상 | 정상 | 정상 | 정상 |
| 가로 스크롤 | 없음 | 없음 | 없음 | 없음 |
| 하단 동선 | SiteFooter만 | SiteFooter만 | SiteFooter만 | SiteFooter만 |

## 상단 내비게이션 현황

| 페이지 | TopBar 구조 | Home 접근 |
|--------|------------|-----------|
| Home | Hero 내부 (LangToggle만) | 현재 페이지 |
| Routes | 없음 (RoutesList 직접) | SiteFooter 통해서만 |
| Route Detail | ← Routes + 노선명 + LangToggle | ← → Routes → Home? 2단계 |
| How to Ride | ← Home + 제목 + LangToggle | ← 버튼 (Home) |
| FAQ | ← Home + 제목 + LangToggle | ← 버튼 (Home) |
| Data Source | ← Home + 제목 + LangToggle | ← 버튼 (Home) |
| About | ← Home + 제목 + LangToggle | ← 버튼 (Home) |
| Privacy | ← Home + 제목 + LangToggle | ← 버튼 (Home) |
| Terms | ← Home + 제목 + LangToggle | ← 버튼 (Home) |

Routes 페이지만 TopBar가 없어서 Home 복귀가 SiteFooter 의존.

## 추가 관찰

- Home Hero에 LangToggle만 있고 메뉴 없음. "11 ROUTES VERIFIED" 뱃지 + CTA가 주요 동선
- CTASection에 "View all routes" + "How to ride →" 버튼 있어 Home에서 나가는 동선은 양호
- Routes 페이지는 TopBar 자체가 없음 — 검색바와 필터가 상단이라 TopBar 공간이 없는 구조
- SiteFooter 링크 색상 fg-3(#A1A1A1) → hover 시 accent(#00D4FF). 기본 상태에서 링크인지 텍스트인지 구분 약함
