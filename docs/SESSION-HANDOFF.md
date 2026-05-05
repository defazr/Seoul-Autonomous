# Session Handoff

> 새 대화에서 이어갈 때 이 문서를 참고합니다.
> 마지막 업데이트: 2026-05-05 (Round 11B 완료)

## 현재 위치

**GlobalHeader 도입 완료. 디자인 풀 오딧 진행 중. 배포 전 상태.**

## Round 11 진행 상황

### 완료
- [x] R11 audit: Global UX polish audit (10항목 표)
- [x] R11A: SiteFooter polish (Routes 링크 추가, 터치 영역, nav/legal 분리)
- [x] R11B: GlobalHeader + MobileDrawer + 회귀 수정 2회

### 진행 중
- [ ] 디자인 클로드 풀 오딧 — 데스크탑 9페이지 스크린샷 기반 시각 검증
  - 포그린이 스크린샷 전달 예정

### 미착수 후보
- Privacy/Terms 섹션 구분선 (11C)
- LangToggle 전역 통일
- GlobalHeader sticky + blur
- Back to Top
- Route Detail disclaimer 톤

## 웹 현재 상태

- 45 정적 페이지, 9개 유형, npm run build 통과
- GlobalHeader: layout.tsx 단일 삽입, 모든 페이지 적용
  - 데스크탑: 로고 + Routes/How to Ride/FAQ 가로 링크
  - 모바일: 로고 + 햄버거 → 우측 slide drawer
  - Static (sticky X), LangToggle 미포함
- SiteFooter: 8개 링크 (탐색 6 + 법적 2 분리)
- SEO: sitemap, robots, OG, hreflang, JSON-LD 완비

## 신규 컴포넌트 (Round 11)

| 컴포넌트 | 파일 | 성격 |
|---------|------|------|
| GlobalHeader | components/common/GlobalHeader.tsx | Server Component (async) |
| MobileDrawer | components/common/MobileDrawer.tsx | Client Component |

## i18n 신규 키

- `globalHeader.*` 9개 (routes, howToRide, faq, about, dataSource, privacy, terms, menuOpen, menuClose)
- `siteFooter.routes` 1개 추가

## 11B 회귀 교훈 (중요)

- flex-wrap + flex: 1 충돌 → 의도된 wrap 불가
- codeBadge에 white-space: nowrap 필수
- 모바일 2줄 분리는 미디어쿼리 명시적 처리
- 디자인 결정과 코드 구현 역할 분리 필수

## 참조 문서

- docs/GPT-HANDOFF-2026-05-05-R11.md — 최신 상세 핸드오프
- docs/worklogs/2026-05-05-ux-polish-audit.md — R11 UX audit
- docs/worklogs/2026-05-05-globalheader-design.md — GlobalHeader 설계안
- SSOT.md — 헌법
- CLAUDE.md — 작업 규칙

## 최근 커밋 (Round 11)

```
a1b52a4 fix: Route Detail TopBar — codeBadge nowrap + 모바일 2줄 명시 분리
a3d6d57 fix: Round 11B 회귀 수정 — Hero 로고 중복 제거 + Route Detail wrap
41253a8 feat: Round 11B — GlobalHeader + MobileDrawer
173bb85 feat: Round 11A — SiteFooter polish
```

## 다음 세션 시작 시

1. 이 문서 읽기
2. docs/GPT-HANDOFF-2026-05-05-R11.md 읽기
3. 포그린 지시 대기 (디자인 풀 오딧 결과 또는 다음 라운드 지시)
