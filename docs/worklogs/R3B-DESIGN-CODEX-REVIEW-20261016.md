# R3b 설계 Codex read-only 감사 (2026-10-16)

대상: docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md (DRAFT). 실행: `codex exec --sandbox read-only -C <repo>` · 프롬프트 = 잠금 계약 충돌 · 데이터 주장 검증 · 구현 설계 결함 · §4 판정 논리 · 누락 리스크 (네트워크 금지).
결과: BLOCK 2 · FIX 8 · NOTE 7. CC 처리는 설계 문서 §7(감사 반영) 에 항목별로 적었다 — ✅ 설계 수정 반영 · 🔸 포그린 결정 항목으로 전환 · ▫ 구현 때 실측.

---

## BLOCK

- §2.10은 잠금 계약 변경 범위를 완전히 덮지 못한다. 장소 병합은 정책 §7·§9·§14뿐 아니라 후보 단위·이중 게이트·6/6 판정 단위·Stage 2 승인 경계까지 바꾼다. 특히 미승인 단일노선 ARS `01020`을 새 장소 페이지에 추가하면서 정책 §4~§6·§11·§13과 SESSION-HANDOFF 승인 목록 변경 문안이 없다. 구현 전에 이 조항들과 핸드오프 잠금을 명시적으로 개정해야 한다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:16-17,185-194`; `docs/strategy/STOP-URL-POLICY-20260826.md:32-59,84-109`; `docs/SESSION-HANDOFF.md:494-503`; `web/lib/stop-pages.ts:6-12`

- `getApprovedStopPath(01020)`을 truthy로 만들면 도착정보 API 허용 범위가 7 ARS에서 8 ARS로 확대된다. 설계의 “RT-2는 01009 한 곳 그대로·API 코드 변경 0” 주장은 실제 게이트와 맞지 않는다. UI는 KO `01009`만 렌더하지만 API는 현재 모든 승인 Stop을 허용한다. API용 승인 predicate를 RT-2/허브 등록부와 분리하거나 01020 확대를 별도 승인해야 한다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:83-85,168,313`; `web/app/api/arrivals/[stopId]/route.ts:201-205`; `web/app/[locale]/stops/[slug]/page.tsx:257-276`

## FIX

- §2.10에 Stage 1 잠금의 부수 변경을 추가해야 한다: 승인 단위 7 ARS→4 장소/8 플랫폼, 6/6 계약을 장소 전체와 플랫폼별 필수정보 중 어디에 적용하는지, EN 품질 계약, Stage 2 비확대, Graph 파생 원칙, 공식 EN명 원문 보존을 명시해야 한다. 근거: `docs/SESSION-HANDOFF.md:495-509`; `docs/strategy/STOP-URL-POLICY-20260826.md:46-71,84-101`

- breadcrumb를 `Home › 노선 › 장소`로 바꾸는 안은 “JSON-LD 2-level [Home, Stop]” 잠금 변경인데 §2.10에 없다. 가시 breadcrumb 여부도 불명확하다. 유지하거나 별도 개정 문안을 넣어야 한다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:131-134`; `docs/SESSION-HANDOFF.md:504-507`

- §A의 “노선 운행 시간”과 §2.8의 `StopServiceHours` 존치는 “운영정보는 Stop 페이지에 복제하지 않는다”는 잠금과 충돌한다. RT-2의 기존 예외를 명문화하거나 제거해야 한다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:106-107,115`; `docs/SESSION-HANDOFF.md:507`; `web/app/[locale]/stops/[slug]/page.tsx:270-276`

- 옛 ARS URL 리다이렉트 목적지에 해당 `#ars-xxxxx` fragment를 포함한다고 명시해야 한다. 현재 문안대로 장소 루트로만 보내면 플랫폼 identity와 “방향 카드로 바로 간다”는 계약이 소실된다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:93-99,188-191`

- sitemap의 장소 `lastModified` 산정은 두 ARS의 Graph membership 합집합에서 최대값을 구한다고 명시해야 한다. 현재 구현은 ARS 하나의 `routeIds`만 사용하므로 단순 루프 교체 시 A741 같은 비대칭 멤버를 빠뜨릴 수 있다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:96`; `web/app/sitemap.ts:77-90`; `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:39-45`

- §4 변경안은 각 필드마다 `value·verificationGrade·currentState·reason·sources`를 한 묶음으로 제시해야 한다. 특히 A504 승격과 A21 운영사 승격은 source 객체까지 필수이며, 청와대 값은 `reverification_required`에서 계속 null이어야 한다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:255-257,265`; `web/lib/types/route.ts:4-10,30-44`; `web/data/routes.json:1370-1382,2525-2537`

- 공식 보도자료·공식 포털 기사와 시민기자 체험기·SNS를 동일한 “공식 후보” 근거처럼 다루면 안 된다. 시민기자/SNS는 충돌 탐지·재확인 트리거로 제한하고 `official_confirmed` 승격은 발행 주체와 원문 성격을 재확인해야 한다. 네트워크 금지 조건 때문에 `2017617·2017838`의 실제 기사 등급은 미확인이다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:245,251-265,316`; `web/lib/types/route.ts:12-28`

- §6에 병합 후 등록부 불변식 검사를 추가해야 한다: 플랫폼 중복, 모든 ARS의 Graph 존재, 동일 장소명, 노선당 중복 방문, night-bus 좌표 다중값, fragment 고유성, 장소 lastmod 합집합을 빌드 실패 조건으로 삼아야 한다. 근거: `web/app/[locale]/stops/[slug]/page.tsx:50-68`; `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:307-317`

- §6에 올빼미 운행표 라이선스 리스크가 빠졌다. 원본 메타데이터가 공공누리 제4유형이며 사실 수치의 저작권 비보호 여부를 “미확인”으로 둔다. 상업 사이트에 재구성하는 범위를 별도로 검토해야 한다. 근거: `web/data/night-bus-routes.json:15-25`; `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:110-112`

## NOTE

- §1.1 수치는 직접 재계산 결과 정확하다: 승인 7 ARS는 동명 방향쌍 3개와 단독 1개로 4장소이며, 승인 7곳 모두 올빼미 `byArs`에 존재한다. `01020`은 승인 목록 밖의 추가 플랫폼이다. 근거: `web/lib/stop-pages.ts:22-30`; `web/lib/night-bus/core.mjs:45-55`

- 방향쌍 거리는 WGS84 haversine 재계산 시 각각 135.01m, 136.38m, 53.92m, 50.63m로 설계의 135/136/54/51m 반올림과 일치한다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:43-45`; `web/lib/night-bus/core.mjs:13`

- §1.1·§1.2의 자율주행 정차·파생 방면과 올빼미 방면은 모두 코어 실행 결과와 일치한다. A741은 `01007` 후 `01009·01013`을 지나 복귀 시 `01014·01010·01123`으로 가며 `01008`에는 서지 않는다. 근거: `web/data/routes.json:802-816,921-935`; `web/lib/graph/graph-core.mjs:1-12`

- `01020`에는 고정노선 중 심야A21만 정차하고, A160은 `01019` 다음 `01205`로 간다는 주장도 정확하다. 근거: `web/data/routes.json:493-500,1426`; `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:45`

- `permanent: true`의 308 채택과 locale 포함 옛 URL의 단일 이동 설계는 타당하다. 다만 현재 `next.config.ts`에는 아직 redirects가 없고 미들웨어 matcher는 `/` 및 locale 경로만 처리하므로 구현 후 실제 1-hop 회귀검사가 필요하다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:91-98`; `web/next.config.ts:6-14`; `web/middleware.ts:4-8`

- 노선 페이지 사용처는 반환 문자열을 href로만 쓰므로 장소 URL+fragment와 호환된다. API 사용처만 경로 함수의 truthiness를 승인 predicate로 오용하므로 분리가 필요하다. 근거: `web/app/[locale]/routes/[id]/page.tsx:209-220`; `web/app/api/arrivals/[stopId]/route.ts:203-205`

- sitemap 79→73 계산은 Stop 항목 14→8만 반영한 R3b-1 기준으로 맞다. §3.1 업데이트 2개 제거까지 같은 배포에 포함하면 최종 수는 71이므로 단계별 기대값을 구분해야 한다. 근거: `docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md:33,178,200-203`; `web/app/sitemap.ts:77-107,109-135`