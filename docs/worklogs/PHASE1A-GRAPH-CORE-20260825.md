# Phase 1A — Graph Core (정본)

- 일자: 2026-08-25
- 판정: **Phase 1A = APPROVED / CLOSED** (구현 + QA + Codex 재감사 + 사용자 실기 확인 + push 완료)
- 상위 정본: `docs/worklogs/PHASE0-CTG-STRUCTURE-AUDIT-20260825.md` (Phase 0 감사 — 소급 수정하지 않음)

## A. 목적과 범위

Phase 1A는 **UI/URL 작업이 아니라 Graph Core 계산 기반 구축 단계**다.
`web/data/routes.json`을 수정하지 않고, 11개 fixed route로부터
Route → StopVisit → Stop 3층 그래프를 순수 파생 계산할 수 있음을 구현으로 증명했다.

```
코드 변경             신규 2파일만 (489줄)
기존 코드·데이터 수정   0
신규 dependency       0  (package.json / lockfile 변경 0)
신규 URL·UI·라우팅    0
Production deploy     0  (사이트 육안 변화 0 = 정상)
```

## B. 기준점

```
착수 시점    b160bcb  (Phase 0 docs 정본화 커밋)
최종         891fc02833ddbcac7089dd2ff840f5d0e5834c11
             "feat: Add Phase 1A transit graph core"
push         완료 — local = origin/main = 891fc02, ahead/behind 0/0
```

## C. 구현 파일

| 파일 | 역할 |
|---|---|
| `web/lib/graph/graph-core.mjs` (295줄) | **순수 계산 core.** 입력 구조 검증(게이트) · Route/StopVisit/Stop 파생 · routeShape · direction · prev/next · membership dedup · 관계 함수 3종. 파일시스템을 읽지 않고, JSON을 import하지 않고, CLI 출력을 하지 않고, 기대 매트릭스 수치를 알지 않는다. JSDoc 타입 |
| `web/scripts/validate-graph.mjs` (194줄) | **검증 실행체.** SSOT 2파일(`web/data/routes.json` · `web/data/stops/stop-names.json`)을 읽어 core에 전달 → 기대 매트릭스와 실제 계산 결과 비교 → 사람이 읽는 표 출력 → 불일치·구조위반 시 exit 1. 계산 로직 중복 구현 없음 |

실행: `cd web && node scripts/validate-graph.mjs` (전항 일치 시 마지막 줄 `Phase 1A Graph validation PASS`, exit 0)

## D. 최종 모델

```
Route
  ↓
StopVisit(routeId, seq)
  ↓
Stop(stopId)
```

- **StopVisit = occurrence identity** (routeId + seq). prev/next·sequence·direction은 이 층에서 계산
- **Stop = ARS stopId identity.** 노선 간 join(routeIds)은 이 층에서 Set semantics로 계산
- prev/next는 **StopVisit 객체 참조**다 (stopId 문자열 아님). seq 1의 prev = null, 마지막의 next = null.
  loop라도 마지막→첫 자동 연결은 하지 않는다 — 원본이 폐합 occurrence(첫=마지막 stopId)를 별도 방문으로 명시
- **같은 route의 반복 stopId occurrence는 병합하지 않는다** (병합 시 순서 문맥 소실 — §G 실증)
- 구조 게이트(core 내장, 위반 시 `GraphInputError` throw): fixedRoutes 존재·비어있지 않음 /
  route.id 문자열·비공백·전체 unique / stops 존재·비어있지 않음 / seq 정수·index+1 일치 /
  stopId 5자리 / nameKo **trim 후 비공백** / isTurnaround boolean / route당 turnaround 정확히 1

## E. routeShape / direction (확정 구현)

```
roundTrip  9    loop  2 (cheonggye-a01 · seodaemun-a01)
loop 판정  first.stopId === last.stopId

direction (StopVisit 단위):
  roundTrip:  seq <= turnaroundSeq → outbound (반환점 occurrence 포함)
              seq >  turnaroundSeq → inbound
  loop:       전 visit 'loop' — outbound/inbound 미부여
```

- 이 direction은 Graph 내부의 구조적 방향이며 사용자 화면 방면명으로 직접 노출한다는 뜻이 아니다.
- ⚠ **turnaroundSeq는 1-base**다. Phase 0 보고 일부가 turn **idx(0-base)** 로 표기해 1 차이가
  나 보이는 것(예: A160 idx 43 = seq 44)은 표기 차이일 뿐 오류가 아니다.

## F. 최종 QA 매트릭스 — validator 21항 전항 PASS

```
Routes                         11        Routes exactly one turnaround  11
Unique Stops                  267        Duplicate affected routes       2
StopVisits                    307        Duplicate stopIds     02247, 13156
Multi-route Stops              33        roundTrip                       9
  exactly 2 routes             28        loop                            2
  exactly 3 routes              5        loop direction misclassified    0
Same-name pairs                90        membership inflation            0
Same-route pairs               90        chain integrity violations      0
stopId null                     0        names with 3+ stopIds           0
stopId/name conflicts           0
Official EN                   261        Fallback                        6
```

기대표는 validator의 상수, 실제값은 전부 core가 SSOT에서 계산 — 하드코딩 PASS 불가 구조.

## G. 반복 occurrence 실증 (StopVisit 계층이 필요한 실제 증거)

```
cheonggye-a01  02247 청계광장            seq 1 (기점, next=02224 청계1가.광교)
                                        seq 12 (종점, prev=01174 청계1가.장통교)
seodaemun-a01  13156 서대문구청.보건소.구청  seq 1 (기점, next=13201) / seq 14 (종점, prev=13213)

두 사례 모두: StopVisits = 2, Stop.routeIds = {해당 노선 1개}  ← occurrence dedup
```

stopId 하나로 접으면 "seq 1의 다음"과 "seq 12의 이전"이 한 노드에 뭉개져 노선 순회 재구성이
불가능해진다 — Route → Stop 2층 모델을 금지한 이유의 실데이터 증명.

## H. 공식 EN 계약

```
official EN = 261  /  fallback(nameKo) = 6
```

기존 정본 `web/data/stops/stop-names.json`(OA-12830)을 **validator가 읽어 stopId→EN lookup으로
core에 전달**했다. `web/lib/stops.ts` 비수정, 신규 번역·별도 EN SSOT 신설 0 (C2E 계약 승계).

## I. QA 최종 결과

```
validate-graph            PASS (exit 0, 21항 전항)
validate-stop-names       PASS (exit 0)
test-stop-names           56/56 PASS (exit 0)
tsc --noEmit              PASS (exit 0)
npm run build             PASS (exit 0, route 인벤토리 변화 없음 — 신규 URL 0)
npm run lint              exit 1 — 기존 baseline 5 errors / 27 warnings 그대로, 신규 회귀 0
```

lint의 5 errors는 전부 R27 잠금 파일 `NightBusMap.tsx`의 기지 baseline이며 **Phase 1A 문제가
아니다.** Phase 1A 신규 2파일은 lint 리포트에 등장하지 않는다(error 0 / warning 0).

## J. Codex 감사 이력 (과장 없이)

**1차 감사: P0 1 / P1 2 → BLOCK**

- P0: core 머리 주석에 기대 수치 문자열(`11/267/…`) 존재. **실행 경로의 하드코딩은 아니었고**
  "core는 기대 수치를 알지 않는다"는 주석 계약의 **문자적 위반**이었다.
- P1-①: nameKo 게이트가 length만 검사해 whitespace-only 문자열 미차단
- P1-②: validator의 chain 검사가 next 방향·양끝만 보고 중간 visit의 prev 역참조 미검증

**반영 (포그린 A안 승인):** 주석 수치 제거 / `trim().length === 0` 검사 / 전 visit prev
역참조 검증 추가 — 3건 한정 수정 후 `git commit --amend`.

```
구 SHA   07e6a4c  ← push된 적이 없고 로컬 amend 과정에서 대체됨
최종 SHA  891fc02
```

**재감사: 3건 전부 해소 확인 · 범위 밖 변경 없음(구 커밋 대비 diff 교차 확인) ·
신규 P0 0 / P1 0 / P2 0 → PASS**

## K. 사용자 직접 검증

포그린이 로컬에서 직접 `cd web && node scripts/validate-graph.mjs`를 실행해 21항 전항 PASS와
최종 `Phase 1A Graph validation PASS`를 확인했다. Phase 1A는 UI 작업이 아니므로 **사이트
육안 변화가 없는 것이 정상**이라는 점을 함께 확인했다.

## L. push / Production

```
891fc02 → origin/main   fast-forward push 완료 (b160bcb..891fc02)
local = origin/main     ahead/behind 0/0
Production deploy       미실행 — runtime 계속 abb0ba7, 라이브 이미지 23bfedc2ba78
```

이 프로젝트는 main push와 Production deploy가 분리돼 있다(Vercel 미사용) — push는 라이브에
영향 없음.

## M. 다음 단계 순서 — 최신 결정 (2026-08-25)

Phase 0 정본(§M)의 당시 계획은 `Phase 1A → Robotaxi Freshness → Phase 1B`였다.
Phase 1A 종료 후 포그린·GPT가 순서를 다음으로 조정했다 (과거 문서는 수정하지 않고 여기 명시):

```
Phase 1A docs 정본화 (이 문서)
→ A21 vertical slice READ-ONLY UX 선점검
→ 선보고 검수
→ Phase 1B UX 최종 구현 지시
```

**Robotaxi Freshness는 취소된 것이 아니다** — A21 UX 선점검 이후의 별도 라운드로 순서만
조정됐다 (8/19 공식 출처는 Phase 0 정본 §F에 확보돼 있음).

## N. Phase 1B 선행 잠금

다음 목표: **A21 기존 노선 상세에서 Route → Stop → 같은 Stop을 지나는 다른 Route 탐색이
실제 사용자에게 의미 있게 작동하는 UX를 먼저 증명**한다.

아직 결정하지 않는다 (read-only UX 선점검 결과를 보고 결정):

```
신규 Stop URL / 60~80 독립 페이지 확대 / 물리 정류장 177 URL화
N버스 전체 연결 / Night Bus Map SVG 변경 / Robotaxi 통합
실시간 API / DB·Redis·Upstash
```

특히 **"Phase 1B = Stop 페이지 생성"으로 미리 확정하지 않는다.**
