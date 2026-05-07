# Session Handoff

> 새 대화에서 이어갈 때 이 문서를 참고합니다.
> 마지막 업데이트: 2026-05-07 (Round 2 PR 2.3 완료)

## 현재 위치

**Round 2 진행 중. PR 2.1~2.3 완료, PR 2.4 (풀폭 CTA 정리) 미착수.**

## 마지막 커밋

PR 2.3 카드 정렬 + 모바일 gap 수정 (미커밋 — 캡처 검증 후 커밋 예정)

## 마스터 핸드오프

**docs/HANDOFF.md** — 모든 AI(Claude Code / GPT / 디자인 클로드)가 공유하는 마스터 문서. 9개 섹션으로 전체 프로젝트 컨텍스트 100% 복원 가능.

## 새 세션 시작 시

1. [ ] `docs/HANDOFF.md` 읽기 (마스터)
2. [ ] `SSOT.md` + `CLAUDE.md` 읽기 (헌법 + 규칙)
3. [ ] `git log --oneline -5`로 마지막 커밋 확인
4. [ ] 포그린 지시 대기 또는 PR 2.4 진행

## 핵심 아키텍처

- **PageContainer**: default 1120px / longform 720px
- **GlobalHeader**: components/common/GlobalHeader.tsx, static, padding = PageContainer와 동일
- **SiteFooter**: components/common/SiteFooter.tsx, nav 6 + legal 2 분리
- **CSS Modules 전용** (Tailwind X)
- **다크 톤 + zinc + cyan accent**
- **dev 서버 불안정 시**: `npm run build && npx next start -p 4099`

## Route Detail 현재 구조 (Round 2)

- 데스크톱 ≥1024px: 2-column (좌 stopsCard + 우 sidebarCard sticky)
- 모바일: 1-column, gap 24px
- Meta: inline rows (HOURS/DAYS/STOPS/VERIFIED)
- StopsList: 세로 timeline 단일 (가로 RouteDiagram 제거됨)

## 보류/로드맵

| Round | 내용 | 우선순위 |
|-------|------|---------|
| 2.4 | 풀폭 CTA 정리 | 다음 |
| 3 | Privacy/Terms sticky TOC | 낮음 |
| 4 | Home hero right-side | 중간 |
| 5 | i18n label cleanup | 낮음 |
| 6+ | Routes 필터, 404 등 | 미정 |

## 참조 문서 우선순위

1. `docs/HANDOFF.md` — 마스터 핸드오프
2. `SSOT.md` / `CLAUDE.md` — 헌법/규칙
3. `docs/ROUND2_HANDOFF.md` — Round 2 지시서
4. `docs/DECISIONS.md` — 의사결정 로그

## 협업 패턴

- Claude Code = 구현 (코드, push)
- 디자인 클로드 = 검증/피드백 (캡처 보고 진단)
- GPT = 검토/태클 (지시서 정리, 범위 관리)
- 포그린 = 최종 결정

**사이클**: 구현 → build → 캡처 → 디자인 진단 → 후속 수정
