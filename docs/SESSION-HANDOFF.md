# Session Handoff

> 마지막 업데이트: 2026-06-30 (Round 22-Privacy 정정 배포 완료)

## 현재 위치

**Round 22-Privacy(/ko/privacy + /en/privacy 정정) 단독 배포 완료. 라이브 §9 회귀검증 전 항목 PASS. 다음은 Round 22(지도/업데이트) 지시서 대기.**

## 마지막 커밋 (main, 배포됨)

`0a27b2c` — Round 22-Privacy — /ko/privacy + /en/privacy 정정 (GA4 운영 반영)

## 커밋 이력

```
0a27b2c  Round 22-Privacy — /ko/privacy + /en/privacy 정정 (GA4 운영 반영) (배포됨)
54d9e3d  docs: Round 22-Privacy 지시서 + audit 완료 + 2차 핸드오프
43c35c8  docs: Round 22A 오디트 보고서 문서화
ba37ce7  docs: Round 22A 오디트 완료 + 최종 계획서 확정
c65eb96  Round 16B — HTTP Link 헤더 hreflang 정리 (배포됨)
fbe3fe2  Round 21 — 서울 심야버스 노선도 발표 글 (배포됨)
```

## 배포 상태

- seoulautonomous.com 라이브 (Docker + Caddy)
- /ko/privacy 200 ✅ — title `개인정보처리방침 Seoul Autonomous`, 14개 섹션, GA4 운영 반영
- /en/privacy 200 ✅ — title `Privacy Policy Seoul Autonomous`
- 측정ID·GTM·AdSense·Consent 본문 미기재 / §10 정보주체 권리 문단 포함
- 운영자 `Seoul Autonomous` / 문의 `seoulautonomous@protonmail.com`
- /ko/night-bus-map 200 ✅, /en/night-bus-map 404 ✅ (ko 전용)
- HTTP Link 헤더 hreflang 미발생 ✅ (alternateLinks false 유지)
- sitemap privacy 등록 유지, noindex 없음
- 기존 사이트 무손상 (newsforgreens.com 200, fazr.co.kr 200)

## 다음 세션 할 것

1. **Round 22 본작업(지도/업데이트) — GPT 지시서 대기**
   - 지도 페이지 title/meta/DOM, 업데이트 글, 내부 링크, JSON-LD(WebPage+BreadcrumbList), DOM 순서 변경
   - 참조: `docs/worklogs/ROUND-22-FINAL-PLAN.md`
2. 이후 Round 23(GA4 이벤트) → Round 24(AdSense)
3. GSC 404 드롭 현황 + 네이버·구글 순위 모니터링

## 협업 구조 (확정)

- **GPT**: 지시서 작성·최종 판단
- **Claude Code**: 구현자 관점 충돌·최소 대안 제시 (무조건 동의 X, 실제 코드 기준 검토)
- **Claude UI**: 핸드오프 공유·문서 정리
- 최종 선택은 포그린이 잠금 문서·전체 범위 기준 결정
- 승인 지점 3곳 단독 유지: 커밋 / 푸시 / 배포 (각각 명시적 승인)

## 핵심 경고

- **alternateLinks: false 유지** — true로 돌리면 GSC 404 부활
- **Caddy 절대 건드리지 말 것** (validate → reload만, restart 금지)
- **night-bus-data.ts 읽기 전용 / 노선 기하 보정 금지**
- **묶음 배포 금지** — 라운드 단독 배포 후 검증 완료 후에만 다음 라운드
- 보류(정직성): 운영자 실명·법적주체, 국외이전 정식 고지 → 별도 법률 점검 라운드. "법적 완전 충족" 표현 금지

## 새 세션 시작 시

1. [ ] 이 문서(`docs/SESSION-HANDOFF.md`) 읽기
2. [ ] 최신 날짜별 핸드오프 `docs/handoff/HANDOFF-20260630.md` 읽기
3. [ ] MEMORY.md 확인
4. [ ] 라이브 확인: https://seoulautonomous.com/ko/privacy , /ko/night-bus-map

## 핸드오프 운영 규칙

- `docs/handoff/HANDOFF-YYYYMMDD.md` — 날짜별 이력 누적 (삭제·통합 금지, 보관)
- `docs/SESSION-HANDOFF.md` — 항상 최신 상태로 갱신, 다음 세션 시작점
- 미추적 파일(`docs/handoff/HANDOFF-20260608.md`, `round19-final-이식지시서.md`, `route/`) 건드리지 않음

## 서버 정보

- Vultr 158.247.252.172
- Docker 수동 docker run (compose 아님)
- Caddy 6개 도메인 블록 — docker restart 금지
- docs/ 변경은 배포 불필요
