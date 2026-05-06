# Session Handoff

> 새 대화에서 이어갈 때 이 문서를 참고합니다.
> 마지막 업데이트: 2026-05-06 (Round 1.5 완료, Round 2 대기)

## 현재 위치

**Round 1 + 1.5 레이아웃 정합성 완료. Round 2 (Privacy/Terms 시각 보강 + Route Detail 재설계) 대기.**

## 마지막 커밋

`2748d97` — GlobalHeader padding 정렬 (PageContainer와 동일 20/24px)

## 다음 작업

**docs/ROUND2_HANDOFF.md** 문서대로 진행:

1. **묶음 B 먼저** — Privacy/Terms 섹션 divider + 번호 cyan (CSS만, 20~30분)
2. **묶음 A** — Route Detail 2-column 재설계 (캡처 → 디자인 합의 → 구현)

## 새 세션 시작 시

1. [ ] 이 문서 읽기
2. [ ] `docs/ROUND2_HANDOFF.md` 읽기
3. [ ] `docs/GPT-HANDOFF-2026-05-06.md` 읽기 (전체 맥락 필요 시)
4. [ ] `git log --oneline -5`로 마지막 커밋 확인 (`2748d97` 이후)
5. [ ] 포그린 지시 대기 또는 Round 2 묶음 B 진행

## 핵심 아키텍처 (Round 1에서 확립)

- **PageContainer**: default 1120px / longform 720px
- **GlobalHeader**: layout.tsx 단일 삽입, LangToggle 포함, static, padding = PageContainer와 동일
- **SiteFooter**: nav 6 + legal 2 분리
- **CSS Modules 전용** (Tailwind X)
- **다크 톤 + zinc + cyan accent**

## 페이지 폭

| default (1120px) | longform (720px) |
|-----------------|-----------------|
| Home, Routes, Route Detail, How to Ride | FAQ, About, Data Source, Privacy, Terms |

720px은 의도. 올리지 말 것.

## 보류 항목

- Privacy/Terms sticky TOC (과함, 보류)
- FAQ 카테고리 그루핑 (i18n 키 추가 필요, 별도 라운드)
- GlobalHeader sticky + blur
- Vultr 배포

## 참조 문서 우선순위

1. `docs/ROUND2_HANDOFF.md` — Round 2 상세 지시서
2. `docs/GPT-HANDOFF-2026-05-06.md` — 전체 핸드오프
3. `docs/DESIGN_AUDIT_ROUND_1.md` — Round 1 지시서
4. `SSOT.md` / `CLAUDE.md` — 헌법/규칙

## 협업 패턴

- Claude Code = 구현 (코드, push)
- 디자인 클로드 = 검증/피드백 (캡처 보고 진단)
- GPT = 검토/태클 (지시서 정리, 범위 관리)
- 포그린 = 최종 결정

**사이클**: 구현 → push → 캡처 → 디자인 진단 → 후속 수정
