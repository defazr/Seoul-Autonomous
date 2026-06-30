# Session Handoff

> 마지막 업데이트: 2026-06-30 2차 (Round 22 본작업 배포 완료)
> 다음 세션은 **이 파일을 가장 먼저** 읽고 시작한다.

## 현재 위치

**Round 22(지도/업데이트 SEO + 내부 링크) 단독 배포 완료. 라이브 §8 회귀검증 전 항목 PASS. 다음 작업 미착수. 다음 후보는 Round 24 AdSense 사전 감사(Round 22와 혼합 금지).**

## 마지막 커밋 (origin/main · 서버 라이브 HEAD 모두 동일)

`c5b8abc` — Round 22: refine night bus map SEO and internal links

## 커밋 이력

```
c5b8abc  Round 22: 지도/업데이트 SEO + 내부 링크 (배포됨, 2026-06-30)
6e89360  docs: Round 22-Privacy 배포 완료 — 핸드오프 갱신
0a27b2c  Round 22-Privacy — /ko/privacy + /en/privacy 정정 (배포됨)
54d9e3d  docs: Round 22-Privacy 지시서 + audit + 2차 핸드오프
c65eb96  Round 16B — HTTP Link 헤더 hreflang 정리 (배포됨)
```

## 배포 상태 (라이브)

- seoulautonomous.com 라이브 (Docker + Caddy), 서버 HEAD `c5b8abc`
- 새 이미지 `sha256:47a89e95...` / 롤백 태그 `seoul-autonomous-web:rollback-0a27b2c` 보존
- 지도 `/ko/night-bus-map` 200 — title `서울 심야버스 노선과 N버스 환승 노선도`, H1 `서울 심야버스 노선과 환승 노선도`, WebPage+BreadcrumbList
- 업데이트 `/ko/updates/night-bus-map-launch` 200 — title `…공개와 이용 방법`, H1 `…공개`, Article(dateModified 2026-06-30)+FAQPage 8+상·하단 CTA 2개
- 홈 ko 지도 CTA(서버 렌더) / how-to-ride ko 문맥 링크 / `/en` 양쪽 미노출
- `/en/night-bus-map`·`/en/updates/night-bus-map-launch` 하드 404 유지
- HTTP Link hreflang 미발생, sitemap·noindex 정상
- Privacy(`/ko·en/privacy`)도 라이브 정상(이전 라운드)
- 기존 사이트 무손상: newsforgreens.com 200, fazr.co.kr 200

## 다음 세션 할 것

1. **관찰 기간**: Round 22 title·H1·본문은 최소 2~4주 재수정하지 않고 GSC·네이버 결과 관찰
2. **다음 후보: Round 24 AdSense 사전 감사** — Round 22와 혼합 금지
3. Round 23(GA4 커스텀 이벤트)도 별도 라운드 분리

## 협업 구조 (확정)

- GPT: 지시서 작성·최종 판단 / Claude Code: 구현자 충돌·최소 대안 제시(편집 전 사전 검토 보고 필수) / Claude UI: 문서 정리
- 승인 지점 3곳 단독: 커밋 / 푸시 / 배포 (각각 명시적 승인)

## 핵심 경고 / 운영 주의

- **서버에 추적 밖 `Dockerfile`(untracked) 존재** — 수동 Docker 빌드가 이 파일에 의존. `git pull --ff-only`는 tracked `web/`만 갱신(충돌 없음). 저장소엔 Dockerfile 미커밋.
- **롤백**: 배포는 `:latest`를 덮음 → 배포 전 현재 이미지를 `rollback-<해시>` 태그로 박제할 것. 현재 보존: `rollback-0a27b2c`.
- **Caddy 절대 미변경** (validate→reload만, restart 금지)
- **night-bus-data.ts 읽기 전용 / SVG 기하 보정 금지**
- **alternateLinks: false 유지** (true 복귀 시 GSC 404 부활)
- **묶음 배포 금지** — 라운드 단독 배포·검증 후 다음 라운드
- 보류(정직성): 운영자 실명·법적주체, 국외이전 정식 고지 → 별도 법률 점검 라운드. "법적 완전 충족" 표현 금지

## 새 세션 시작 시

1. [ ] 이 문서(`docs/SESSION-HANDOFF.md`) 읽기
2. [ ] 최신 날짜별 핸드오프 `docs/handoff/HANDOFF-20260630_2.md` 읽기
3. [ ] MEMORY.md 확인
4. [ ] 라이브 확인: https://seoulautonomous.com/ko/night-bus-map , /ko/updates/night-bus-map-launch

## 핸드오프 운영 규칙

- `docs/handoff/HANDOFF-YYYYMMDD.md` — 날짜별 이력 누적(삭제·통합·개명 금지). 같은 날 2회차는 `_2` 신규.
- `docs/SESSION-HANDOFF.md` — 항상 최신 갱신, 다음 세션 시작점
- 미추적 파일(`docs/handoff/HANDOFF-20260608.md`, `round19-final-이식지시서.md`, `route/`) 건드리지 않음

## 서버 정보

- Vultr 158.247.252.172, Docker 수동 docker run(compose 아님)
- Caddy 6개 도메인 블록 — docker restart 금지
- docs/ 변경은 배포 불필요
