# Stage 1 Stop Page Content/UI Design (Phase Stop-1D) — 설계 정본

- 라운드: Phase Stop-1D READ-ONLY 설계 (GPT 지시서 §0~§30 + 최종 보정 조항 A~I)
- 일자: 2026-08-26
- 상태: **APPROVED / 구현·배포 완료 (2026-08-27 Stage 1 CLOSED)** — 본 설계는 Phase Stop-1E에서
  전량 구현돼 Production에 반영됐다. 아래 A~V절은 설계 라운드 당시(2026-08-26)의 기록이며,
  구현 결과 보정은 W절, 배포·종료 기록은 `docs/worklogs/STAGE1-STOP-PAGES-DEPLOYMENT-20260827.md`
- 정책 SSOT: `docs/strategy/STOP-URL-POLICY-20260826.md` (본 문서는 정책을 재설계하지 않는다)

> **최종 구현 결과 요약 (2026-08-27 기준)**
> 승인 Stop 7개 · locale 포함 URL 14개 · sitemap 55→69 · Route→Stop 링크 19
> (A160 7 · A741 5 · A21 7, A741→01123·01008 무링크) · Stop→Stop 링크 v1 0 ·
> breadcrumb = JSON-LD 2-level(가시 breadcrumb 없음) · provenance에 OA-12830 dataset 실링크 노출 ·
> 노선 운영정보(운행시간·요금·배차·운행일) Stop 페이지 미복제.
> Production runtime = Git = latest = `19ebf0e`.

---

## A. 기준점 (2026-08-26 실측)

```
local HEAD = origin/main   7cb467d1cf0ea7aa31f5f31605b49cd2756ef56c
tracked dirty              0  (미추적 7건 = 기존 보존 대상, 비접촉)
Production 확인 방식        보정 G — SSH 미접속. 정본 문서 대조 + live HTTP smoke만
live smoke                 sitemap <loc> 55 · sitemap 내 stops URL 0 ·
                           /ko/stops 404 · /en/stops 404 ·
                           /en/routes/saebyeok-a160 200 · /ko/routes/simya-a21 200 ·
                           /ko/updates/gangnam-robotaxi-expanded-to-19 200
repo                       web/app/[locale]/stops 디렉토리 없음 · slug helper 없음
정본 3파일                  routes.json · stops/stop-names.json · STOP-URL-POLICY 존재 확인
서버·Docker·latest·rollback  조회/조작 0 (보정 G 준수)
```

판정: **기준점 게이트 PASS** (BLOCK 조건 1 해당 없음).

## B. 정책 잠금 요약 (설계 상위 계약)

- 구현 대상 = 정확히 7 stop (01009·01010·01013·01014·01007·01008·01019) / V3 26 보류 / 그 외 Stop URL 금지
- URL = `/[locale]/stops/<stopId>-<readable-name>` · canonical identity = stopId · KO/EN 동일 slug
- 신규 URL 정확히 14 (7×ko/en) · sitemap 55→69 (구현 라운드에서)
- 링크 v1 = Route↔Stop 양방향만. Stop↔Stop(인접·방향쌍 포함) 링크 0
- 6/6 계약 6블록이 화면에 실존 · noindex 0 · BreadcrumbList만(BusStop schema 금지)
- 표현 안전선: "환승" 단정 금지 / outbound·inbound·loop 노출 금지 / 평가 형용사 금지 /
  실시간처럼 보이는 표현 금지 / 공식 EN 원문 임의 교정 금지 / 미검증 방향명("동쪽행" 등) 창작 금지
- STATIC-FIRST · 신규 dependency 0 · routes.json 무수정 · Graph 계산은 graph-core.mjs 단일 source

## C. 7 Stop 실측 재검증 (§4 — Graph Core 재계산, 기억값 미사용)

검증 방법: `web/scripts/validate-graph.mjs` 21항 PASS + 별도 검증 스크립트(스크래치패드
`verify-stop1d.mjs`)로 지시서 §4 기대값 전수 자동 대조. 결과 **44/44 PASS · 불일치 0**.

- 모집단 재현: 고유 Stop 267 = single 234 + 2-route 28 + 3-route 5, multi-route 33 ✓
- 19행(stopId×route의 seq/전체/이전/다음) 전항 일치 ✓ (§4 표와 동일 — 재기재 생략, 4b 표는 지시서 원문 참조)
- 01007 = 3노선 / **01008 = 2노선**(A741은 반대 방향에서 01123 정차) ✓
- 01019의 동명 상대 01020 = 단일 노선(후보 아님) ✓ / 01123 = 단일 노선(비후보) ✓
- 7개 전부 기점/종점/반환점 아님(전 visit prev·next 존재, isTurnaround 0) ✓
- 7개 전부 공식 EN 보유(matchStatus 전부 `exact`), Stage 1 EN fallback 0 ✓
- 정량 QA 계약(보정 D) 재현: A160 7행·A741 5행·A21 7행(합 19) / Stop→Route 칩 합 19 ✓

판정: **BLOCK 조건 3·4 해당 없음.**

## D. slug 7개 확정표 (D1)

repo 감사: slug/slugify helper **부재**(grep 0건). update 기사 slug는 데이터에 수기 확정된
리터럴이 관례. → **Stage 1도 slug를 리터럴 7건으로 잠근다**(런타임 slugify 함수 불필요,
신규 dependency 0). 아래 변환 규칙은 이 7건의 도출 근거이자 향후 Stage 확장 시의 규칙 정의다.

변환 규칙 (deterministic):
1. 원천 = `stop-names.json`의 `nameEnOfficial` 원문 (임의 번역·약칭·교정 금지)
2. 소문자화 → 어퍼스트로피(`'`) 제거 → 나머지 비영숫자(`. , ( ) & /` 공백 포함) 연속 구간을 하이픈 1개로 → 양끝 하이픈 제거
3. `{stopId}-` 접두. identity 판정은 항상 stopId (이름부는 표시용)
4. 비ASCII 문자가 원문에 있으면 자동 변환하지 않고 BLOCK (Stage 1의 7건은 전부 ASCII)

| stopId | official KO | official EN | proposed slug |
|---|---|---|---|
| 01009 | 광화문역 | Gwanghwamun Station | `01009-gwanghwamun-station` |
| 01010 | 광화문역 | Gwanghwamun Station | `01010-gwanghwamun-station` |
| 01013 | 종로2가 | Jongno 2-ga | `01013-jongno-2-ga` |
| 01014 | 종로2가 | Jongno 2-ga | `01014-jongno-2-ga` |
| 01007 | 서울역사박물관.경희궁앞 | Seoul Museum of History, Gyeonghuigung Palace | `01007-seoul-museum-of-history-gyeonghuigung-palace` |
| 01008 | 서울역사박물관.경희궁앞 | Seoul Museum of History, Gyeonghuigung Palace | `01008-seoul-museum-of-history-gyeonghuigung-palace` |
| 01019 | 종로5가.광장시장 | Jongno 5(o)-ga.Gwangjang Market | `01019-jongno-5-o-ga-gwangjang-market` |

- 충돌 0 (stopId 접두가 유일성 보장). `01009/01010-gwanghwamun-station`은 정책 정본 §7 예시와 정확히 일치
- KO/EN 동일 slug (`/ko/stops/…`, `/en/stops/…`)

## E. title / H1 / description 규칙 (D2 + 보정 A)

용어 감사 결과: 사이트 확정 umbrella = **"자율주행" / "Autonomous"**
(`metadata.routeDetailDescription` "자율주행 버스 {name} 노선"/"Autonomous bus route {name}",
`routeGroups` "새벽 자율주행 노선"·"심야 자율주행 노선"). **"심야버스" 통칭은 사용하지 않는다**
(A160·A741은 새벽 노선 — 보정 A 확정). title suffix 관례 = `— Seoul Autonomous`.

- **title** (metadata namespace에 신규 2키, 기존 `{name} — Seoul Autonomous` 관례 승계):
  - KO `{name} 정류장 {ars} — Seoul Autonomous` → 예: `광화문역 정류장 01009 — Seoul Autonomous`
  - EN `{name} (Stop {ars}) — Seoul Autonomous` → 예: `Gwanghwamun Station (Stop 01009) — Seoul Autonomous`
  - 방향쌍은 ARS 숫자로 SERP에서 즉시 구분. 공식명에 없는 방향어 미사용
- **H1** = 공식명 원문 단독 (KO 페이지 `광화문역` / EN 페이지 `Gwanghwamun Station`).
  route 상세의 name/subName 관례 승계 — H1 아래 보조줄에 반대 locale 명 표기
- **identity/방향 라인** (H1 직하, hero): `ARS 01009` + 다음 정류장 union 라인 (F절)
- **description** (실데이터 조합 — 이름 치환만의 동일 템플릿 금지, §16):
  - KO `{name} 정류장(ARS {ars})을 지나는 자율주행 노선 {routes}의 정차 순서와 이전·다음 정류장을 확인하세요. 다음 정류장: {nextStops}.`
  - EN `Autonomous routes serving {name} (stop {ars}): {routes}. See each route's stop order and neighboring stops. Next stops: {nextStops}.`
  - 01009 vs 01010: routes 동일하지만 `{ars}`·`{nextStops}`가 달라 **description도 상호 고유** —
    01009 `…다음 정류장: 종로1가, 종로2가.` / 01010 `…다음 정류장: 서울역사박물관.경희궁앞, 서울역사박물관.강북삼성병원.`

## F. 방향쌍 구분 모델 (D3 + 보정 B)

**1급 식별 장치 = stopId + 노선별 다음 정류장 union** (보정 B 규칙 그대로 채택):

1. 각 경유 노선의 next Stop을 Graph Core에서 산출 (StopVisit 층)
2. stopId 기준 dedup — 같은 next stopId는 1회만
3. 표시 순서 = 페이지의 노선 표시 순서(= SSOT `fixedRoutes` 배열 순서의 visit 순 — deterministic)
4. 내부 direction 값(outbound/inbound/loop) 사용자 노출 0
5. 미검증 방향명("동쪽행"·"종로 방면" 등) 생성 0

hero 라인 렌더: KO `다음 정류장 · 종로1가 · 종로2가` / EN `Next stops · Jongno 1-ga · Jongno 2-ga`
(EN 라벨은 union 개수 1이면 `Next stop` — ICU plural). 구분자 ` · ` 고정.
긴 이름(01010 KO 2건 연속, EN은 더 김)은 **자연 줄바꿈 허용** — 390px horizontal overflow 0을
acceptance에 포함 (보정 B·T절).

이 모델은 V3 26개 재심사 때 사용할 **방향 차별 장치의 원형**으로 본 문서에 기록된다 (§7).

## G. Stop 페이지 정보 구조 (D4 — 6/6 화면 매핑)

route 상세 페이지의 기존 구성 요소(PageContainer·카드·factList·칩·Pill)를 재사용한 6블록:

| # | 블록 | 6/6 대응 | 내용 |
|---|---|---|---|
| ① | Hero / identity | C1 | H1 공식명 + 보조줄(반대 locale 명) + `ARS {stopId}` + 다음 정류장 union 라인(F절) |
| ② | 경유 노선 | C2 | 헤딩 KO `이 정류장을 지나는 자율주행 노선` / EN `Autonomous routes serving this stop` + 노선 칩 실링크(기존 RouteChips 스타일, SSOT displayName/Ko 원문) |
| ③ | 노선별 위치 카드 ×routeCount | C3+C4 | H2 `{route}에서의 위치`/`Position on {route}` + `전체 {total}개 정류장 중 {seq}번째`/`Stop {seq} of {total} on this route` + 이전/다음 정류장(텍스트, 링크 0) + `{route} 노선 보기` 링크 |
| ④ | 함께 지나는 노선 | C5 | 파생 사실 1문장: `광화문역 ARS 01009는 새벽A160·새벽A741·심야A21이 함께 지나는 정류장입니다.` (2노선이면 2노선 문형). 평가어 0 |
| ⑤ | 정보 확인 기준 | C6 | P절 provenance 블록 (출처 2계열 + 확인 기준일) |
| ⑥ | 고지 | — | 기존 관례 문안 재사용: `카카오맵 기반 정보입니다. 탑승 전 확인하세요.` (신규 장문 disclaimer 0) |

- **C5 판정 (보정 C 채택)**: 화면에는 부정 사실("기점/종점/반환점 아님")을 나열하지 않고
  multi-route shared 관계(④)만 노출한다. **판정 근거**: 7개 전부 terminal/turnaround 아님을
  C절 실측으로 본 문서에 명시 — C5는 ④ + 본 기록으로 충족
- 설명형 안내문("다음 정류장을 보면 … 구분할 수 있습니다")은 렌더하지 않는다 — 데이터 우선 (§8 ①)
- seq는 숨기지 않되 raw `55/87` 단독 표기 대신 문장형(§9)
- 방향쌍 상대 페이지 링크·텍스트 언급 모두 v1 미구현 (§12) — 01019(상대 페이지 없음)도 동일 template로 자연 렌더 (§23)

## H. 광화문역 01009 — KO 전체 mock

가시 breadcrumb 없음(O절 — 사이트 관례).
**아래는 Phase Stop-1E 구현 후 standalone 실렌더에서 추출한 실제 텍스트다**(§24 보정 반영).

```
[← /routes 백버튼]

광화문역                                  ← H1
Gwanghwamun Station                       ← 보조줄 (subName 관례)
ARS  01009
다음 정류장   종로1가 · 종로2가              ← F절 union 라인

이 정류장을 지나는 자율주행 노선              ← H2 (②+④ 통합 섹션)
[새벽A160] [새벽A741] [심야A21]             ← 칩 실링크 3개
광화문역 ARS 01009에는 새벽A160 · 새벽A741 · 심야A21
노선이 함께 정차합니다.                      ← C5 구조 문장 (별도 H2 없음)

새벽A160에서의 위치                         ← H2
전체 87개 정류장 중 55번째
이전 정류장   서울역사박물관.경희궁앞
다음 정류장   종로1가
새벽A160 노선 보기 →                        ← /routes/saebyeok-a160

새벽A741에서의 위치                         ← H2
전체 34개 정류장 중 9번째
이전 정류장   서울역사박물관.경희궁앞
다음 정류장   종로2가
새벽A741 노선 보기 →

심야A21에서의 위치                          ← H2
전체 40개 정류장 중 33번째
이전 정류장   서울역사박물관.경희궁앞
다음 정류장   종로1가
심야A21 노선 보기 →

정보 확인 기준                              ← H2
정류장 공식명 — 서울특별시 공공데이터
  [OA-12830]  확인 2026.08.02              ← dataset 실링크(data.seoul.go.kr)
노선 정차 순서·이전·다음 정류장 — 카카오맵 기반 노선 데이터
  확인 2026.05.01

카카오맵 기반 정보입니다. 탑승 전 확인하세요.    ← 고지 (기존 문안)

[← 전체 노선 보기]                          ← nav.viewAllRoutes 재사용
```

- 이전/다음 정류장은 **텍스트만** (링크 0 — 결정 3. 01007·01013 등 승인 Stop이 이웃이어도 동일)
- 실시간 표현 0 · 평가어 0 · outbound/inbound 0 · "환승" 0

## I. 핵심 EN mock (01009)

```
Gwanghwamun Station          ← H1
광화문역                      ← 보조줄
ARS 01009
Next stops · Jongno 1-ga · Jongno 2-ga

Autonomous routes serving this stop
[Saebyeok A160] [Saebyeok A741] [Simya A21]
Saebyeok A160, Saebyeok A741 and Simya A21 serve
Gwanghwamun Station (ARS 01009).      ← C5 문장, 같은 섹션

Position on Saebyeok A160
Stop 55 of 87 on this route
Previous stop   Seoul Museum of History, Gyeonghuigung Palace
Next stop       Jongno 1-ga
View Saebyeok A160 route →

(… A741 · A21 동일 구조 …)

How this information was checked
Official stop names — Seoul Metropolitan Government open data
  [OA-12830]  checked Aug 2, 2026
Stop order and neighboring stops — route data based on Kakao Map
  checked May 1, 2026

Information based on Kakao Map. Please confirm before riding.
```

- EN 이웃 정류장명 = `getOfficialStopNameEn` 단독, 미스는 nameKo (C2E 계약 — 7개의 이웃은 현재 전부 공식 EN 보유)
- 공식 EN 원문 보존: `Jongno 5(o)-ga.Gwangjang Market` 등 특수문자·표기 그대로 (교정 0)

## J. 01009 vs 01010 above-the-fold 비교 (§21)

| 요소 | 01009 | 01010 |
|---|---|---|
| ARS (hero 2번째 줄) | 01009 | 01010 |
| route set | A160·A741·A21 | A160·A741·A21 (동일) |
| hero 다음 정류장 union | 종로1가 · 종로2가 | 서울역사박물관.경희궁앞 · 서울역사박물관.강북삼성병원 |
| A160 이전→다음 | 서울역사박물관.경희궁앞 → 종로1가 | 종로1가 → 서울역사박물관.경희궁앞 |
| A741 이전→다음 | 서울역사박물관.경희궁앞 → 종로2가 | 종로2가 → 서울역사박물관.강북삼성병원 |
| A21 이전→다음 | 서울역사박물관.경희궁앞 → 종로1가 | 종로1가 → 서울역사박물관.경희궁앞 |
| seq (A160/A741/A21) | 55/87 · 9/34 · 33/40 | 32/87 · 26/34 · 8/40 |
| title/description/slug | 전부 상이 (ARS·nextStops 파생) | 전부 상이 |

**판정: YES** — 같은 공식명·같은 route set이어도 hero의 ARS + 다음 정류장 union이 첫 화면에서
완전히 다르고(공유 항목 0), 3개 위치 카드의 이전/다음·seq 전부 상이하다. 창작 방향명 없이
실데이터만으로 구분이 성립한다. → 구현 BLOCK 없음. **V3 26 재심사의 원형 근거로 기록.**

## K. 01007 vs 01008 비대칭 사례 (§22)

| 요소 | 01007 | 01008 |
|---|---|---|
| route set | **A160·A741·A21 (3)** | **A160·A21 (2)** — route membership 자체가 상이 |
| hero union | 광화문역 (3노선 모두 next=01009 → union 1개) | 서대문역사거리 (2노선 모두 next=01006 → union 1개) |
| 위치 카드 수 | 3 | 2 |

- 차별성이 route set 층위에서 이미 성립하는 기준 사례. ② 칩 수·③ 카드 수·④ 문장이 전부 다름
- A741의 반대 방향 정차 정류장 **01123은 Graph로 확인만 하고 URL 생성 0** (§22) —
  A741 노선 페이지의 01123 행에도 Stop 링크 없음 (T절 QA 계약)
- hero union이 1개로 수렴하는 케이스(01007·01008·01019)의 렌더도 동일 규칙으로 자연 처리 —
  EN 라벨만 단수형 `Next stop`

## L. 01019 단독 사례 (§23)

- 상대 01020은 단일 노선 → Stage 1 후보 아님, 페이지 없음. **counterpart 존재를 전제하는 UI가
  설계에 없으므로**(§12에서 방향쌍 언급 자체를 제거) 01019는 공통 template 그대로 렌더
- "반대편 페이지 없음" 안내 UI 만들지 않음 (§23)
- hero union = `종로5가.효제초등학교`(A160)·`종로6가.동대문종합시장`(A21) 2개 — 페이지 성립에 쌍 불요

## M. Route → Stop 진입 UX (D7 — 잠금 계약 수정안 포함)

감사 실측: `StopsList.tsx`의 행 = timeline + stopContent(seq+표시명, 보조줄, otherRoutes 칩 줄).
행 자체 클릭 동작 없음. 인터랙티브 요소는 route 칩 `<a>`만 (1C 잠금).

**설계안 (지시서 §11 방식 채택)**:
- 승인 7 stop의 행에만 stopContent 안에 **명시적 텍스트 링크 1개 추가**:
  KO `정류장 상세 →` / EN `Stop details →` (`stopDetailHref`가 있을 때만 렌더 —
  없는 행은 기존과 바이트 단위 동일 렌더)
- 행 전체 clickable 금지 유지 · 정류장명 자체의 링크화 금지 (§11 비권고 채택)
- 노출 위치: otherRoutes 칩 줄과 같은 보조 영역(칩 줄 아래 또는 우측) — 시각 위계는 칩과 동급 이하
- 링크 대상 행: A160 7행 · A741 5행 · A21 7행 = **19행** (그 외 전 노선·전 행 0)
- 참고: 3노선 모두 87·34·40행 > DISCLOSURE_THRESHOLD(5)이고 승인 7개는 미리보기 3곳(첫·반환점·
  마지막)에 해당하지 않으므로, **링크는 `<details>` 펼친 목록 안에서만 보인다** — 기존 접힘 UX 유지,
  별도 승격 없음 (v1 의도된 제약으로 기록)

**잠금 계약 수정안 (사용자 승인 필요 — 승인 전 구현 금지, §11)**:

> StopsList 행 자체는 계속 비인터랙티브로 유지한다.
> 승인된 Stop URL이 존재하는 행에 한해 명시적인 "정류장 상세" 링크를 추가할 수 있다.
> route chip과 Stop detail link 외의 행 클릭 동작은 만들지 않는다.

**Stop → Route 방향**: ② 노선 칩 + ③ 카드의 `{route} 노선 보기` 링크로 충족 (칩과 카드 링크는
같은 대상 — 중복이지만 칩=개요/카드=문맥 위치라 유지. 페이지당 route 링크 = routeCount×2).

## N. i18n 설계 (D9)

- 신규 namespace **`stopDetail`** (지시서 §13) + `metadata`에 2키 추가. 공식 정류장명·노선명은
  키로 만들지 않고 SSOT 원문 사용
- stop별 문구 복제 0 — 전부 템플릿 키. 예상 키 (14±, 상한 20):

```
metadata.stopDetailTitle        KO "{name} 정류장 {ars} — Seoul Autonomous" / EN "{name} (Stop {ars}) — Seoul Autonomous"
metadata.stopDetailDescription  E절 템플릿 ({name}/{ars}/{routes}/{nextStops})
stopDetail.arsLabel             "ARS" / "ARS"
stopDetail.heroNextStops        "다음 정류장" / "{count, plural, one {Next stop} other {Next stops}}"
stopDetail.routesTitle          "이 정류장을 지나는 자율주행 노선" / "Autonomous routes serving this stop"
stopDetail.positionTitle        "{route}에서의 위치" / "Position on {route}"
stopDetail.positionValue        "전체 {total}개 정류장 중 {seq}번째" / "Stop {seq} of {total} on this route"
stopDetail.previousStop         "이전 정류장" / "Previous stop"
stopDetail.nextStop             "다음 정류장" / "Next stop"
stopDetail.viewRoute            "{route} 노선 보기" / "View {route} route"
stopDetail.sharedTitle          "함께 지나는 노선" / "Routes that share this stop"
stopDetail.sharedSentence       "{stop} ARS {ars}는 {routes}이 함께 지나는 정류장입니다." / "{stop} (ARS {ars}) is served by {routes}."
stopDetail.provenanceTitle      "정보 확인 기준" / "How this information was checked"
stopDetail.provenanceStopNames  "정류장명(한국어·영어) — 서울시 버스 정류소 다국어 목록 정보(OA-12830) · 확인 {date}"
stopDetail.provenanceRouteData  "노선 정차 순서·이전/다음 정류장 — 카카오맵 기반 노선 데이터 · 확인 기준일 {date}"
stopDetail.disclaimer           routeDetail.disclaimer와 동일 문안의 자체 키 (소유권 분리)
routeDetail.stops.stopDetailLink  "정류장 상세" / "Stop details"   ← StopsList용 (routeDetail 소속)
```

- KO 조사 문제(`…는/은`): sharedSentence는 KO에서 stop명 조사 회피 문형으로 최종 조정 가능
  (예: "…는 다음 노선이 함께 지나는 정류장입니다: {routes}") — 구현 시 문안 확정, 의미 불변

## O. metadata / canonical / sitemap / BreadcrumbList (D10·D12)

감사 실측:
- `buildPageMetadata(locale, path, title, description)` = canonical 자기참조 + HTML hreflang
  (en/ko/x-default) + OG/Twitter 공통 이미지 — **전 페이지 공용 관례. Stop 페이지도 이 헬퍼
  호출만으로 §16 요건 충족** (Stop 전용 metadata 정책 신설 0)
- sitemap.ts 관례: 그룹별 루프 + `alternates.languages` ko/en. **구현 시 승인 7 stop 루프 추가**
  → 정확히 14 entries (55→69). 제안값: `lastModified` = 멤버 노선 lastChecked 중 최대(현재
  3노선 모두 2026-05-01 → 동일), `changeFrequency` monthly, `priority` 0.6 (update와 동급,
  route 0.7 미만) — 구현 지시서에서 확정
- **BreadcrumbList**: 가시 breadcrumb 관례 **없음**(route 상세 = JSON-LD만) → **보정 F 선택지 B
  채택: visible breadcrumb 없음 + BreadcrumbList JSON-LD만**
  - 기존 헬퍼 `breadcrumbJsonLd(items[], locale)`는 항목 수 자유 — 신규 코드 불필요
  - 항목: `[Home(/), Routes(/routes), {공식명} {ars}(/stops/{slug})]` — 3-level.
    근거: route 상세의 기존 3-level `[Home, Routes, {route}]` 관례 승계. `/routes`는 실존 URL이며
    "섹션 허브"로 사용 — **특정 단일 route를 parent로 쓰지 않는다**(보정 F 금지 준수).
    `/stops` index는 어떤 경우에도 item 0 (실존하지 않음)
  - 대안 2-level `[Home, {stop}]`도 성립 — U절 결정 항목 ④로 병기
- routing (D11): `generateStaticParams` = 7 slug × 2 locale = 14. slug 정확 일치만 렌더,
  그 외 전부 `notFound()` 404 (route 상세의 `getRouteById` 미스 → notFound 관례와 동일).
  감사 결과 canonical-slug redirect 관례 **없음** → **redirect 체계 발명 0, 404 단순 정책 채택**
  (stopId만 맞고 이름부 틀린 slug 포함 404). `/ko/stops`·`/en/stops` = 404 유지 (index 미생성)

## P. provenance 설계 (D14)

감사 실측 (전부 repo 기확보 — 웹 신규 조사 0):

```
정류장명 SSOT   data/stops/stop-names.json + stop-names.meta.json
               dataset OA-12830 (서울시 버스 정류소 노선도 다국어 목록 정보, KOGL 제1유형)
               collectedAt 2026-08-02 / sourceUpdatedAt 2025-03-14 / datasetUrl 존재
노선 데이터     routes.json — 3노선 모두 lastChecked 2026-05-01,
               verificationLevel kakao_seoul_verified, sourceUrls [map.kakao.com]
기존 표시 관례  route 상세 "확인 기준일 {lastChecked}" + disclaimer "카카오맵 기반 정보입니다…"
```

**확정안**: "검증일"은 페이지 생성일이 아니라 **데이터 계열별 확인일 2줄로 분리 표기** (임의 최신
1개 선택 금지 — 지시서 §18):
1. 정류장명(KO/EN) → OA-12830 · 확인 2026.08.02 (`collectedAt` 파생 — KOGL 출처표시 의무도 충족)
2. 노선 정차 순서·이전/다음 → 카카오맵 기반 노선 데이터 · 확인 기준일 = 각 멤버 노선 `lastChecked`
   파생 (현재 3노선 동일 2026-05-01 → 1줄로 수렴. 값이 갈리면 노선명과 함께 날짜별로 나열 —
   데이터 파생 렌더, 하드코딩 0)
- 출처 링크: v1 화면에는 dataset명 텍스트 표기까지 (외부 링크는 datasetUrl이 repo에 있어 추가
  가능하나, route 상세의 operational sources 링크 관례와 달리 필수 아님 — U절 결정 항목 ⑤)
- Graph 관계 파생 사실(④)의 근거 = 위 2계열 (별도 제3 출처 없음 — 창작 0)

## Q. 제외 항목과 이유 (v1)

| 제외 | 근거 |
|---|---|
| 노선 운영정보 재노출(첫차·막차·배차·요금·운행일) | §17 — intent 희석·C2O 조건 복제·thin/duplicate 위험. route 링크로 대체 |
| route-context 발췌 | §19 — duplicate content 증가 |
| Kakao Map 링크(MapLinkButton) | §19 — 좌표/공식 stop mapping 계약 부재. 6/6 필수 아님 |
| Stop↔Stop 링크 전부 (인접·방향쌍) | 결정 3·§10·§12 |
| 방향쌍 상대의 비링크 텍스트 언급 | §12 — 방향 구분은 자기 데이터로 성립. 01019 비대칭도 자연 해소 |
| `/stops` index 페이지 | sitemap +14 계약 · 정책 §12 |
| 가시 breadcrumb UI | 사이트 관례 없음 (O절 — JSON-LD만) |
| verificationLevel 상태 Pill (hero) | stop 층위 검증 개념 오인 위험 — provenance 블록이 담당 |
| BusStop/TransitStop schema | 정책 §12 — 좌표 확보 후 재검토 |
| canonical-slug redirect | 관례 부재 — 발명 금지 (§15) |
| 설명형 방향 안내 문장 | §8 ① — 데이터 우선, 기계 반복 문구 회피 |

## R. Stage 1 audit 부록 (§24 — 판정표 정본화)

2026-08-26 Stage 1 6/6 전수 판정 READ-ONLY audit (기준점 7cb467d) 결과 요약:

```
모집단 267 (single 234 + 2-route 28 + 3-route 5) / multi-route 33 = 심사 대상 전원
판정   33/33 PASS 6/6 · FAIL 0
duplicate-risk   DISTINCT 3 · BORDERLINE 30 · DUPLICATE-RISK 0
이용가치   V1 6 · V2 1 · V3 26
EN fallback 교집합 0 · slug 충돌 0 · adjacent(PASS끼리) 33/33
포그린 결정   구현 승인 7 (V1 6 + V2 1) · V3 26 = FAIL 아닌 보류
              (방향 차별 콘텐츠 장치 설계·검증 후 재심사 — 본 문서 F·J절이 그 원형)
```

> **PASS 6/6은 자동 생성 승인이 아니다.** 33은 생성 목표가 아니라 심사 상한이었고,
> 실제 구현은 포그린이 개별 승인한 7개뿐이다. 숫자를 채우기 위한 생성은 하지 않는다.

## S. 구현 예상 파일 범위 (§27 — 예측만, 이번 라운드 수정 0)

| 파일 | 신규/수정 | 내용 |
|---|---|---|
| `web/lib/stop-pages.ts` | 신규 | 승인 7건 리터럴 `{stopId, slug}` 상수 + slug→stopId 조회 (제품 결정의 명시적 표현 — 자동 생성 로직 아님) |
| `web/app/[locale]/stops/[slug]/page.tsx` | 신규 | generateStaticParams 14 · buildPageMetadata · Graph Core 파생(기존 route 상세와 동일 패턴 `buildGraph(routesData)`) · notFound |
| `web/app/[locale]/stops/[slug]/page.module.css` | 신규 | route 상세 토큰·카드 관례 재사용 |
| `web/components/route-detail/StopsList.tsx` (+`.module.css`) | 수정 | `stopDetailHref?` 옵션 필드 + 승인 행 한정 "정류장 상세" 링크 (M절 — 계약 수정 승인 후) |
| `web/app/[locale]/routes/[id]/page.tsx` | 수정 | displayStops에 승인 stop 한정 `stopDetailHref` 주입 |
| `web/app/sitemap.ts` | 수정 | 승인 7 stop 루프 (+14, 55→69) |
| `web/messages/en.json`·`ko.json` | 수정 | `stopDetail` namespace + `metadata` 2키 + `routeDetail.stops.stopDetailLink` |

- 신규 dependency **0** (BLOCK 조건 7 해당 없음) · 생성 JSON 커밋 0 · routes.json/stop-names.json 무수정
- Graph Core 재사용 가능 판정: page.tsx가 이미 동일 패턴으로 import 중 — 신규 API 불필요
- 14개 외 Stop URL이 구조적으로 강제되는 지점 없음 (generateStaticParams가 리터럴 7×2 —
  BLOCK 조건 8·9 해당 없음)

## T. Visual acceptance checklist (§28 + 보정 D·H — 구현 후 사용자 확인용)

Desktop + 390px (각각):
- KO 01009 · KO 01010 · KO 01007 · KO 01008 · KO 01019
- EN 01009 · EN 01010 · **EN 01019** (최장 EN명 + `(o)`·`.` slug 케이스: `01019-jongno-5-o-ga-gwangjang-market`, title/H1 원문 보존, hero wrap, overflow 0)
- hero union 라인 wrap 확인: KO/EN 01010 (최장 조합) — horizontal overflow 0

Route→Stop (정량 계약 = 보정 D):
- A160 페이지 stop 링크 **정확히 7** · A741 **정확히 5** · A21 **정확히 7** (합 19) · 그 외 8개 노선 페이지 0
- A741 → 01009/01010/01013/01014/01007 링크 있음 · **A741 → 01123 행 링크 없음** · A741 → 01008 링크 **없음**(01008은 A741 미경유)
- 링크는 `<details>` 펼친 목록 내에서 동작 (기존 접힘 UX 회귀 0)

Stop→Route:
- 01009 → A160/A741/A21 (칩 3 + 카드 링크 3) · 01008 → A160/A21 (2+2) · 금지 route 링크 0
- 페이지별 위치 카드 수 = routeCount (3·3·3·3·3·2·2)

404:
- 비승인 유효 stopId (예: `/ko/stops/01020-...`) · 존재하지 않는 stopId · malformed slug ·
  stopId 정확+이름부 오기 slug · `/ko/stops` · `/en/stops` — 전부 404, redirect 0

SEO:
- sitemap 정확히 69 (신규 14만 증가, 기존 55 보존) · canonical 자기참조 14/14 ·
  KO/EN alternates 상호참조 · noindex 0 · duplicate URL 0 · BreadcrumbList JSON-LD 14/14 ·
  title/description 14개 전부 고유 (01009↔01010·01013↔01014 상호 대조 포함)

회귀:
- graph validator 21항 PASS · tsc/build 0 · lint baseline 5err/27warn 동일 ·
  기존 라이브 QA 계약(A160 33행/41칩 · A21 17/24 등) 불변

## U. BLOCK / 이견 / 사용자·GPT 결정 필요사항

**BLOCK: 없음** (§29의 11개 조건 전항 해당 없음 — C·S절 실측 근거).

구현 지시서 발행 전 결정 필요:
1. **[사용자 승인 필수] StopsList 잠금 계약 수정안** (M절 인용문) — §11에 따라 승인 전 구현 금지
2. **[문안 확정] title 어순**: KO `{name} 정류장 {ars}` (제안) vs `{name} {ars} 정류장` — E절 제안 기준 검토
3. **[경미] ②·④ 헤딩 유사성**: "이 정류장을 지나는 자율주행 노선"(칩) vs "함께 지나는 노선"(문장).
   지시서 §8 구조 유지로 설계했으나, ④ 문장을 ② 섹션 하단 문단으로 통합하는 대안도 성립 —
   GPT 판단 요청
4. **[확인] BreadcrumbList 계층**: 3-level `[Home, Routes, {stop}]` (O절 제안·기존 관례 승계) vs
   2-level `[Home, {stop}]` — 채택 확인 요청
5. **[확인] provenance의 OA-12830 dataset 외부 링크** 노출 여부 (텍스트 표기만 vs data.seoul.go.kr 링크 추가)
6. **[확인] sitemap 제안값** (priority 0.6 · monthly · lastModified = 멤버 노선 lastChecked 최대)

## V. 검토 결과 — 설계 PASS · U절 6건 확정 (2026-08-26 추기)

GPT 검토 판정 **PASS**. U절 6건 확정 내용 (구현 지시서의 상위 결정):

1. **StopsList 잠금 계약 수정안 승인** — 행 비인터랙티브 유지, 승인 7 stop 행에만 명시적
   "정류장 상세 / Stop details" 링크, route chip과 이 링크 외 행 클릭 동작 금지.
   (§11상 포그린 명시 승인 확인 후 구현)
2. **title 확정** — KO `{name} 정류장 {ars} — Seoul Autonomous` / EN `{name} (Stop {ars}) — Seoul Autonomous`
3. **②·④ 섹션 통합** — "이 정류장을 지나는 자율주행 노선" 섹션 = 노선 칩 + 바로 아래 구조 설명
   1문장("{stop} ARS {ars}는 …이 함께 지나는 정류장입니다."). 별도 "함께 지나는 노선" H2 없음.
   **C5는 이 통합 섹션의 문장으로 충족** → H·I절 mock과 G절 표는 정본화 시 이 결정으로 보정
4. **BreadcrumbList 2-level `[Home, {stop}]` 채택** — Stop은 Routes의 직접 하위 엔터티가 아님.
   visible breadcrumb 없음 유지 → O절 3-level 제안은 폐기
5. **OA-12830 외부 링크 v1 노출** — provenance 블록에서 `stop-names.meta.json`의 datasetUrl
   (data.seoul.go.kr) 실링크 제공. 신규 웹 조사 0, 기존 SSOT metadata URL만.
   카카오맵 기반 노선 데이터는 기존 route provenance 관례 유지
6. **sitemap 값 승인** — priority 0.6 · changeFrequency monthly · lastModified = 멤버 노선
   lastChecked 최대값 (SEO 장식이 아니라 기존 sitemap 관례 준수 목적)

- 운영정보(운행시간·요금 등) Stop 페이지 미복제 결정 **유지 확정** (Q절)
- 다음 순서: 설계 문서 commit/push가 아니라 **구현 지시서 작성 → 구현+로컬 QA → 사용자 visual 승인**.
  본 문서는 구현 결과와 함께 필요 시 보정 후 정본화

## W. Phase Stop-1E 구현 반영 (2026-08-27 추기 · §24 보정)

설계안이 실제 코드가 되면서 확정·변경된 사항. 정책 변경은 없다.

**V절 결정의 구현 결과**

| 항목 | 설계 초안 | 구현 결과 |
|---|---|---|
| ②·④ | 별도 H2 2개 | **1개 섹션으로 통합** — 칩 아래 C5 문장. H2 수 = 1 + routeCount + 1 (3노선 5개·2노선 4개, 실측) |
| C5 KO 문형 | "…이 함께 지나는 정류장입니다" | **"{name} ARS {ars}에는 {routes} 노선이 함께 정차합니다."** — 조사가 노선명이 아니라 고정어 "노선"에 붙어 노선명 말음과 무관하게 안전 |
| C5 EN | "is served by …" | **"{routes} serve {name} (ARS {ars})."** — 2노선·3노선 모두 자연스러움 |
| Breadcrumb | 3-level 제안 | **2-level `[Home, {공식명} {ars}]`** 확정. ld+json만, 가시 UI 0, `/stops` item 0 (실측 ListItem 2) |
| provenance | 텍스트 표기 | **OA-12830 = data.seoul.go.kr dataset 실링크**(SSOT `datasetUrl`), 확인일 2계열 분리 렌더 |
| sitemap | 제안값 | priority 0.6 · monthly · lastModified = 멤버 노선 lastChecked 최대 (Graph 파생) |
| StopsList | 승인 대기 | **계약 수정 승인 완료** — 행 비인터랙티브 유지 + 승인 행에만 `정류장 상세 →` / `Stop details →` |

**N절 i18n 실제 키 (16개, 초안에서 조정)**

- `metadata.stopDetailTitle`·`stopDetailDescription` / `routeDetail.stops.stopDetailLink`
- `stopDetail.*` 13개: ars · nextStops(ICU plural — hero 는 union 개수, 카드는 count 1로 재사용) ·
  previousStop · routesTitle · sharedSentence · positionTitle · positionValue · viewRoute ·
  provenanceTitle · provenanceStopNames · provenanceRouteData · checkedOn
- 초안의 `sharedTitle`은 ②·④ 통합으로 **불필요 → 미생성**. disclaimer·하단 링크는 기존
  `routeDetail.disclaimer`·`nav.viewAllRoutes` 재사용(신규 키 0). 공식 정류장·노선명은 키로 만들지 않음

**S절 실제 변경 파일 (9개, 예측과 동일)**

신규 3 — `web/lib/stop-pages.ts` · `web/app/[locale]/stops/[slug]/page.tsx` · `page.module.css`
수정 6 — `StopsList.tsx`(+`.module.css`) · `routes/[id]/page.tsx` · `sitemap.ts` · `messages/ko.json`·`en.json`
신규 dependency 0 · routes.json/stop-names/Graph Core/validator 수정 0

**구현에서 드러난 사실 (설계 시점에 없던 정보)**

- 승인 Stop 행 링크는 `<details>` 펼친 목록 안에서만 보인다(7개 모두 미리보기 3곳에 없음) —
  390px 실측에서 펼침 후 7/7 `checkVisibility` 가시 확인
- 이 프로젝트의 `/[locale]/*` 라우트는 **기존부터 전부 `ƒ`(on-demand)** 다(routes/[id]·updates/[slug] 포함).
  Stop 페이지도 동일 — 신규 회귀 아님. 미승인 slug 는 `notFound()` 로 404 (redirect 0)
- `stopDetail.nextStops` 하나로 hero 복수/카드 단수를 모두 처리(EN plural, KO 단일형)

---

**설계 라운드(Stop-1D)에서 실행하지 않은 것**: 코드·데이터·i18n·sitemap·routing 수정 0 ·
Stop URL 생성 0 · commit/push 0 · Production 접촉 0 · SSH 0 · 웹 신규 조사 0 · Stage 2 판단 0.
**구현 라운드(Stop-1E)에서도 유지**: commit/push/deploy 0 · Production·SSH 0 · Stage 2 0 ·
승인 7개 외 Stop URL 0.
