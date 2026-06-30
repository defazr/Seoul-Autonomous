# Session Handoff

> 마지막 업데이트: 2026-06-30 4차 (Round 24-B 배포 완료 + AdSense 리뷰 요청 완료)
> 다음 세션은 **이 파일을 가장 먼저** 읽고 시작한다.

## 현재 위치

**Round 24-A·24-B 모두 단독 배포 완료. AdSense `seoulautonomous.com` 사이트 추가·소유권 확인·리뷰 요청 완료. 현재 "사이트의 광고 게재 가능 여부 검토 중"(심사 결과 미확정). 다음 작업은 심사 결과에 따라 분기 — 결과 전까지 사이트 흔들지 않음(코드·ads.txt·Privacy·Terms·title·H1·URL 수정 금지). 광고 슬롯·Auto ads·CMP·Consent Mode 미구현.**

## 마지막 커밋 (origin/main · 로컬 HEAD · 서버 라이브 HEAD 모두 동일)

`86af374` — Round 24-B: add ads.txt and AdSense connection script

## 커밋 이력

```
86af374  Round 24-B: ads.txt + AdSense 연결 스크립트 (배포됨, 2026-06-30)
dffcbb0  docs: record Round 24-A deployment handoff
be8d412  Round 24-A: privacy 광고 고지 + terms 정정 + design-preview 프로덕션 404 (배포됨, 2026-06-30)
a1dc18d  docs: record Round 22 deployment handoff
c5b8abc  Round 22: 지도/업데이트 SEO + 내부 링크 (배포됨, 2026-06-30)
0a27b2c  Round 22-Privacy — /ko/privacy + /en/privacy 정정 (배포됨)
c65eb96  Round 16B — HTTP Link 헤더 hreflang 정리 (배포됨)
```

## 배포 상태 (라이브)

- seoulautonomous.com 라이브 (Docker + Caddy), 서버 HEAD `86af374`
- 새 이미지 `fe355aa01666` (sha256 `fe355aa…`) / 롤백 태그 `rollback-be8d412`(=`5b647441350e`) 박제, `rollback-c5b8abc`·`rollback-0a27b2c` 보존
- **R24-B 라이브**: `/ads.txt` 200·text/plain·redirect 없음(`google.com, pub-7976139023602789, DIRECT, f08c47fec0942fa0`) · ko/en 공개 페이지 초기 HTML `<head>`에 AdSense 연결 `<script>` 1회(async·crossorigin) · 404·design-preview 미노출 · 광고 슬롯 0
- **R24-A 라이브**: `/ko·en/privacy` §10 광고/Advertising(§1~§15 연속, 조건부) · `/ko·en/terms` 웹사이트 표현·운영자 Seoul Autonomous·protonmail·수정일 2026-06-30 · `/design-preview` 프로덕션 하드 404 · robots.txt design-preview Disallow 제거
- 지도 `/ko/night-bus-map` 200 — title `서울 심야버스 노선과 N버스 환승 노선도`, H1 `서울 심야버스 노선과 환승 노선도`, WebPage+BreadcrumbList (Round 22 무변경)
- 업데이트 `/ko/updates/night-bus-map-launch` 200 — title `…공개와 이용 방법`, H1 `…공개`, Article(dateModified 2026-06-30)+FAQPage 8+상·하단 CTA 2개
- 홈 ko 지도 CTA(서버 렌더) / how-to-ride ko 문맥 링크 / `/en` 양쪽 미노출
- `/en/night-bus-map`·`/en/updates/night-bus-map-launch` 하드 404 유지
- HTTP Link hreflang 미발생, sitemap·noindex 정상, 루트 언어협상 정상
- 기존 사이트 무손상: newsforgreens.com 200, fazr.co.kr 200
- **이번 배포 Caddy 완전 미접촉** (컨테이너 교체만)

## 다음 세션 할 것 — AdSense 심사 결과에 따라 분기

- **C. 심사 중 (현재 상태)**: 코드·ads.txt·Privacy·Terms·title·H1·URL 구조 **수정 금지**. 불필요한 재신청·사이트 삭제·코드 제거 금지. **사이트를 흔들지 않는 것이 최우선.** Round 22 관찰(2~4주, GSC·네이버)은 계속.
- **A. 승인 시**: Auto ads 사용 여부 결정 → 광고 노출 범위 설계 → CMP·Consent Mode 검토 → **지도·검색·버튼 주변 광고 제외** → 별도 R24-C/D 라운드.
- **B. 거절 시**: 거절 사유 **원문 확인**(추정 수정 금지) → 사유별 audit 후 별도 라운드.
- R24-C/D(광고 슬롯·자동광고·CMP·Consent Mode), Round 23(GA4 커스텀 이벤트)은 별도 라운드.

## AdSense 상태 (2026-06-30)

- `seoulautonomous.com` 사이트 추가·**소유권 확인 완료**, 연결 방식 = AdSense 코드 스니펫
- **리뷰 요청 완료** → 현재 **"사이트의 광고 게재 가능 여부 검토 중"** (승인 미확정, 승인 보장 아님)
- 심사 결과 전까지 광고 슬롯·Auto ads·CMP·Consent Mode 구현 금지

## 협업 구조 (확정)

- GPT: 지시서 작성·최종 판단 / Claude Code: 구현자 충돌·최소 대안 제시(편집 전 사전 검토 보고 필수) / Claude UI: 문서 정리
- 승인 지점 3곳 단독: 커밋 / 푸시 / 배포 (각각 명시적 승인)

## 핵심 경고 / 운영 주의

- **서버에 추적 밖 `Dockerfile`(untracked) 존재** — 수동 Docker 빌드가 이 파일에 의존. `git pull --ff-only`는 tracked `web/`만 갱신(충돌 없음). 저장소엔 Dockerfile 미커밋.
- **롤백**: 배포는 `:latest`를 덮음 → 배포 전 현재 이미지를 `rollback-<해시>` 태그로 박제할 것. 현재 직전: `rollback-be8d412`(=`5b647441350e`), 그 전: `rollback-c5b8abc`(=`47a89e955939`), `rollback-0a27b2c`.
- **Caddy 절대 미변경** (validate→reload만, restart 금지)
- **night-bus-data.ts 읽기 전용 / SVG 기하 보정 금지**
- **alternateLinks: false 유지** (true 복귀 시 GSC 404 부활)
- **묶음 배포 금지** — 라운드 단독 배포·검증 후 다음 라운드
- 보류(정직성): 운영자 실명·법적주체, 국외이전 정식 고지 → 별도 법률 점검 라운드. "법적 완전 충족" 표현 금지

## 새 세션 시작 시

1. [ ] 이 문서(`docs/SESSION-HANDOFF.md`) 읽기
2. [ ] 최신 날짜별 핸드오프 `docs/handoff/HANDOFF-20260630_4.md` 읽기
3. [ ] MEMORY.md 확인
4. [ ] 라이브 확인: https://seoulautonomous.com/ads.txt , /ko/night-bus-map , /ko/privacy , /ko/terms
5. [ ] AdSense 심사 결과 확인(검토 중 → 승인/거절 분기)

## 핸드오프 운영 규칙

- `docs/handoff/HANDOFF-YYYYMMDD.md` — 날짜별 이력 누적(삭제·통합·개명 금지). 같은 날 2회차는 `_2` 신규.
- `docs/SESSION-HANDOFF.md` — 항상 최신 갱신, 다음 세션 시작점
- 미추적 파일(`docs/handoff/HANDOFF-20260608.md`, `round19-final-이식지시서.md`, `route/`) 건드리지 않음

## 서버 정보

- Vultr 158.247.252.172, Docker 수동 docker run(compose 아님)
- Caddy 6개 도메인 블록 — docker restart 금지
- docs/ 변경은 배포 불필요
