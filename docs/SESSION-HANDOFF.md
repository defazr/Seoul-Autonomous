# Session Handoff

> 마지막 업데이트: 2026-08-25 3회차 (Phase 1B A21 slice **PRODUCTION LIVE**·CLOSED / 다음 라운드 선택 대기)
> 다음 세션은 **이 파일을 가장 먼저** 읽고 시작한다.

## 현재 위치

**CTG 전환 — Phase 0·1A·1B 전부 CLOSED, 1B는 Production LIVE.** AdSense 3차 거절
("가치가 별로 없는 콘텐츠") 확인 후 같은 날: Phase 0 구조 감사(EXIT 0) → Phase 1A
그래프 엔진(`891fc02`) → **Phase 1B A21 vertical slice(`2d380c9`)를 구현·배포까지 완료**.
A21 상세에서 Route → Stop → 다른 Route 실링크 탐색이 라이브로 작동한다(신규 URL 0).
Round 26·27은 CLOSED 유지(재작업 금지).

```
Phase 0 감사          APPROVED / CLOSED   (2026-08-25)
Phase 1A Graph Core   APPROVED / CLOSED   (891fc02 — 3층 엔진 + validator 21항)
Phase 1B A21 slice    APPROVED / PRODUCTION LIVE / CLOSED   (2d380c9)
  UX                  요약 1줄 + shared 17행 칩(2노선 12+3노선 5 · 새벽A160 17·새벽A741 5),
                      비공유 23행 무변화 · A21 게이트 격리 · "환승" 단정 0 · out/inbound 노출 0
  배포                abb0ba7 → 2d380c9(fd10551bb9c6) · 중단 실측 0.9초 · latest 동일 이동
                      신규 URL 0 · sitemap 53 유지 · Live QA 전항 PASS
  승인                사용자 로컬 + 라이브 육안 승인 (2026-08-25)
web Graph SSOT        web/data/routes.json
전략                  STATIC-FIRST / NO EXTERNAL STATE NEEDED
엔터티                Route → StopVisit → Stop (267 ARS = 원자, 177 그룹 = 보조 후보)
금지                  267 Stop 전량 페이지 생성 / AdSense 재신청(당분간) / 신규 dependency
```

정본: Phase 0 `PHASE0-CTG-STRUCTURE-AUDIT-20260825.md` / Phase 1A `PHASE1A-GRAPH-CORE-20260825.md` /
**Phase 1B `PHASE1B-A21-VERTICAL-SLICE-20260825.md`** (전부 docs/worklogs/)
핸드오프: `HANDOFF-20260825.md` · `_2.md` · **`_3.md`** (docs/handoff/)

## 다음 세션 첫 작업

1. **Phase 1B 종료 docs-only 커밋(정본 3건: 이 파일·PHASE1B worklog·HANDOFF _3)의
   커밋·push 승인 확인** — 각각 별도 승인.
2. push 완료 후: **다음 큰 기능 라운드 선택 (포그린·GPT 결정 대기 — 단독 확정 금지).**
   후보(우선순위 미확정): shared-stop UX 확대(A21 게이트 해제 → 4노선 양방향) /
   Robotaxi Freshness(8/19 공식 출처 확보 완료) / Stop URL 정책·품질 게이트 /
   Night Bus Map ↔ CTG 매핑 / static "지금 운행 중" decision / N버스 통합(대형 조사 선행).
3. 어떤 라운드든 관례 유지: read-only 선점검 → 선보고 → 최종 지시서 → 구현+QA →
   승인 → commit → push → (배포 라운드면) deploy 게이트 분리.

## 확정 설계 (Phase 0, 포그린 검수 — 깨면 안 됨)

```
SSOT                 web/data/routes.json (원본 무수정, 파생 레이어만)
                     루트 data/routes.json 은 RN 레거시 — 웹 작업에서 비접촉, 절대경로 필수
3층 모델             Route → StopVisit(routeId,seq) → Stop(ARS stopId)
                     같은 노선이 같은 stopId 를 2번 지나는 실데이터 존재
                     (cheonggye-a01 02247 / seodaemun-a01 13156) → 2층 모델 금지
                     prev/next·방향 = StopVisit 층, 노선 간 join = Stop 층
방향                 왕복형(반환점 기준)과 순환형을 동일 규칙으로 처리 금지, loop 오분류 금지
정류장 층            267 ARS = 원자 identity. 177 물리 그룹 = 보조 계층 후보 —
                     병합 금지, URL 단위 결정은 Phase 1B 프로토타입 후
페이지 정책           267 전량 URL 생성 금지 (단일 노선 234개 기계 생성 = 최악 대응).
                     독립 페이지는 품질 게이트(다노선/기점·종점·반환점/에디토리얼/
                     N버스 연결/실제 decision value) 통과분만 — 정책 확정은 1B 이후
아키텍처             STATIC-FIRST. 외부 API 현재 불필요. Upstash/Redis/KV/DB 도입 금지
                     (trigger: 실시간 API / 사용자 상태 / build 시간 초과 / 다중 인스턴스)
dependency           Phase 1A 신규 설치 0 (zod·graph lib·테스트 러너 포함)
영문명               C2E 계약 승계 — getOfficialStopNameEn 단독, 별도 영문명 SSOT 신설 금지
N버스                별도 대형 공식 조사 라운드로 이월 (최종 목표에는 포함)
제품 목표(잠금)       "서울에서 지금 어디서 무엇을 타야 하는지, 공식 근거와 함께 판단할 수
                     있는 한·영 심야 이동 서비스." — 기능 채택 기준. URL 수·SEO 점수 아님
```

**Phase 1A 수치 QA 매트릭스** — 구현·재현 완료: `cd web && node scripts/validate-graph.mjs`
가 21항 전항을 자동 대조한다(불일치 시 exit 1, 하드코딩 PASS 불가 구조). 기준값:
Route 11(roundTrip 9 + loop 2) / ARS Stop 267 / StopVisit 307 / 다노선 33(2노선 28+3노선 5) / 방향쌍 90(전부
같은 노선 왕복) / null 0 / 충돌 0 / 공식EN 261+fallback 6 / 노선당 반환점 1 / 노선 내
stopId 반복 2건에서 prev/next 정확 / loop 오분류 0 / shared-stop이 StopVisit 중복으로
부풀지 않음. 의미가 다르면 숫자 맞추지 말고 BLOCK.

## 좌표

```
local HEAD          2d380c9 + 2026-08-25 3회차 docs-only 커밋 (커밋·push는 승인 후)
origin/main         2d380c9  (Phase 1B까지 push 완료)
server checkout     2d380c9
runtime revision    2d380c9                  ← OCI label로 직접 증명 가능 (full SHA)
live image ID       sha256:fd10551bb9c6b26cc5645997793d974c9b3291175558739c167ac8c26c092576
latest              동일 (fd10551bb9c6 — 사용자 라이브 승인 후 이동 완료)
previous runtime    abb0ba7 (이미지 23bfedc2ba78) ← rollback 기준점
```

**Git HEAD ≠ runtime은 docs-only 커밋 때문 — 정상.** 라이브 판정은 컨테이너 라벨로:

```bash
docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' seoul_autonomous_web
```

보존 자산 — **삭제·prune 금지**

```
1B backup     seoul_autonomous_web_backup_abb0ba7_20260825-204839  (exited)
1B rollback   seoul-autonomous-web:rollback-abb0ba7 → sha256:23bfedc2ba78…
R27 backup    seoul_autonomous_web_backup_ba058ee_20260803-210527  (exited)
R27 rollback  seoul-autonomous-web:rollback-ba058ee → sha256:f2674161ee68…
R26 backup    seoul_autonomous_web_backup_ef0274a_20260803-183544  (exited)
R26 rollback  seoul-autonomous-web:rollback-ef0274a → sha256:6d878d66110e…
```

작업 트리 비접촉 대상: 미추적 보존 2건(`round19-final-이식지시서.md`, `route/`) ·
기존 미추적 문서 5건 · `.env.local`

## AdSense 이력

```
1차 거절     2026-07-10   "가치가 별로 없는 콘텐츠"
2차 거절     2026-07-29   색인 완료 상태에서 동일 사유
Round 26     2026-08-03   거절 원인 3건 수리 배포
3차 신청     2026-08-11   Final Gate APPLY-NOW (P0/P1 0) 후 포그린 실행
3차 거절     (2026-08-25 확인)  "정책 위반 → 가치가 별로 없는 콘텐츠"
현재         재신청 금지. CTG 구조 전환 후 색인 반영을 보고 별도 판단
```

거절 원인이 "그래프 부재"로 확정된 것은 아니다(미증명). 기술 게이트(robots·ads.txt·
canonical 등)는 2026-08-11 감사에서 전건 PASS였다 — 대응은 SEO 미세 튜닝이 아니라
사이트 실질 가치 상승.

## 잠금 계약 (이후 라운드에서 깨면 안 됨)

```
영어 정류장명은 getOfficialStopNameEn 단독, 미스는 nameKo fallback
routes.json.nameEn 은 표시 경로 사용 금지
endPoint 는 종점·마지막 정류장으로 사용 금지 (반환점)
반환점·마지막 정류장은 실제 stop 배열로 계산
운영정보는 official_confirmed + confirmed 조합만 화면 표시
reverification_required 상태에서는 금액 표시 금지
로보택시는 시간대별 요금 4구간·실시간 호출·카카오T 필수 계약 유지
FAQ q1 은 stop 배열 구조 기반 3분기 / q4 는 C2O 상태 모델 기반 조건부
C2E disclosure 임계값 5·미리보기 3, 보조줄 C안 유지
비교 표현은 전 노선 데이터 대조 후에만 / 근거 없는 편의·성능 평가 금지
--- Round 27 ---
더블클릭·더블탭은 전체화면 진입만 (종료 제스처 없음) / 크게 보기 버튼 유지
/ko/night-bus-map 만 인터랙티브, /en 은 텍스트 가이드
CSS 오버레이 유지, Fullscreen API 금지 / 전역 viewport·touch-action 변경 금지
--- AdSense ---
ads.txt publisher ID = pub-7976139023602789 (layout.tsx client ID와 일치 유지)
robots.txt 에 Disallow 추가 금지
--- CTG (2026-08-25) ---
web/data/routes.json 원본 무수정 (파생 레이어만) / 루트 routes.json 비접촉
267 Stop 전량 페이지 생성 금지 / 노선 선 기하·night-bus-data.ts 수정 금지 유지
Graph 계산은 web/lib/graph/graph-core.mjs 단일 source (validator·앱 공용, 생성 JSON 커밋 금지)
Graph 변경 시 node scripts/validate-graph.mjs 21항 PASS 필수 / lint baseline 5err·27warn 고정(신규 회귀 0 기준)
--- Phase 1B ---
shared-stop UI 는 현재 A21 게이트(route.id === 'simya-a21') — 해제는 별도 승인 라운드
"환승" 계열 단정 표현 금지 ("이 정류장을 지나는 다른 노선"까지만) / outbound·inbound·loop 사용자 노출 금지
칩 텍스트는 SSOT displayName/displayNameKo 원문만 (임의 교정·창작 금지) / 행 비인터랙티브 유지(칩 <a>만)
```

## 협업 규칙 (필수)

1. **지시서만 와도 요청 없이 이견 제시. 스스로 승인해 실행 금지** (read-only·감사도 예외 아님)
2. GPT는 파일을 못 읽으므로, 지시서가 오답이면 **오디트 지시서를 역제안**하는 것도 임무
3. 조건부 게이트는 이진 판정 — 미결 1건이라도 있으면 정지
4. **코덱스는 부사수**: 구현·실증은 Claude Code, 완성 후 read-only 검사만 (/tmp 생성 불가)
5. 선택 창 사용 금지 — 미결은 채팅에 A/B안으로
6. 캡처는 `~/Desktop/seoul-shots/<라운드폴더>/`에 번호+설명
7. 커밋·푸시·배포 각각 별도 승인 / 디버깅 5분 초과 시 중간 보고 / BLOCK 즉시 정지

## 검사 도구 안전선 (누적)

```
zsh 는 unquoted 변수를 워드 분할하지 않는다 — 다건 순회는 목록 파일 + while IFS= read -r
SSR one-line HTML 에 grep -c 금지 — 개수는 grep -o | wc -l 또는 parser
축약 SHA 와 full SHA 혼용 금지 (git rev-parse 는 40자 반환)
set -e + [ ... ] && echo 는 첫 미매치에서 루프 전체를 죽인다 — set +e / || true 격리
존재하지 않는 추정 URL 검사 금지 — URL 은 sitemap·내부 링크 실물에서만
예상 밖 수치(0 포함)가 나오면 결함 단정 전에 도구·selector 부터 재검증
redirect 는 최초 status 와 최종 URL·status 를 구분해 기록
raw count 와 deduplicated count 는 항상 분리 / 동일 이름 ≠ 동일 정류장
```

## 운영 주의 (변동 없음)

- 서버에 untracked `Dockerfile` — `git pull --ff-only`만 / 배포 전 `rollback-<해시>` 태그 /
  Caddy는 validate→reload만, docker restart 금지
- 배포 안전 계약: rollback 태그 → immutable SHA 태그 단독 빌드(+revision 라벨) →
  candidate 선검증 → 기존 컨테이너 rename 보존 → **라이브 QA + 사용자 승인 후에만 `latest` 이동**
  (R27·Phase 1B에서 확정된 순서)
- ⚠ candidate·본 컨테이너 공히 **`--hostname 0.0.0.0` 필수** — 누락 시 Next standalone이
  컨테이너 해시 hostname에 bind되어 내부 검증 fetch 실패 (2026-08-25 실사고 1회)
- 배포 시 수 초 502 불가피(실측 2~3초). 같은 Caddy가 6도메인·9컨테이너 담당 → 비접촉
- **Vercel 미사용.** main push는 라이브 무영향 — push와 deploy는 각각 별도 승인
- 로컬 최종 판정은 `node .next/standalone/server.js` (static·public 복사, 좀비 포트 확인)
- ⚠ `data/routes.json`이 루트(RN)와 `web/`에 둘 — 스크립트는 반드시 절대경로
- night-bus-data.ts·SVG 기하·sitemap·canonical·hreflang 변경 금지 (지시서 승인 시 예외)

## 새 세션 시작 시

1. [ ] 이 문서
2. [ ] `docs/worklogs/PHASE1B-A21-VERTICAL-SLICE-20260825.md` (Phase 1B 정본 — 최신)
3. [ ] `docs/handoff/HANDOFF-20260825_3.md`
4. [ ] `docs/worklogs/PHASE1A-GRAPH-CORE-20260825.md` · `PHASE0-CTG-STRUCTURE-AUDIT-20260825.md`
5. [ ] `docs/handoff/HANDOFF-20260825_2.md` · `HANDOFF-20260825.md`
6. [ ] MEMORY.md
7. [ ] 기준점 확인 — **runtime = server = origin = `2d380c9`, 라이브 이미지 `fd10551bb9c6`,
   latest 동일**(+3회차 docs 커밋 여부 확인). Round 26·27·Phase 0·1A·1B 재작업 금지.
   **다음 작업 = 다음 기능 라운드 선택(포그린·GPT).** 단 포그린이 다른 지시를 주면 그것이 우선

## 핸드오프 운영 규칙

- `docs/handoff/HANDOFF-YYYYMMDD.md` 날짜별 누적(삭제·통합·개명 금지), 같은 날 2회차는 `_2`
- `docs/SESSION-HANDOFF.md` 항상 최신 갱신
- 지시서·감사 결과는 `docs/worklogs/`에 정본 보존
- docs 변경은 배포 불필요, docs-only 단독 커밋(승인 후) / push 별도 승인
- `git add .` · `git add -A` 금지 — 정본 파일만 명시 stage

## 서버 정보

Vultr 158.247.252.172 / Docker 수동 run / 컨테이너 `seoul_autonomous_web` /
`--network apps-newsforgreens_default --restart unless-stopped -e NODE_ENV=production` /
Caddy 6개 도메인 — docker restart 금지
