# Stop URL Policy (정본) — SEO 안전 계약

- 확정일: 2026-08-26 (포그린 7결정 / GPT 검수 / CC audit 실측 기반)
- 상태: **APPROVED — 2026-10-16 개정(§17 · 1 장소 = 1 페이지)**. 아래 §1~§16 은 2026-08-26 원문이며, §17 과 다르면 §17 이 우선한다.
- 근거 audit: 2026-08-26 Stop URL 정책 READ-ONLY audit (판정 PROCEED WITH NARROWER GATE)

## 1. 목적

Stop URL의 **개수·색인 규모를 통제하는 안전 계약**을 구현 전에 잠근다.
목적은 URL 생산량이 아니라 **페이지당 고유 이용 가치 확보**다. AdSense "저가치" 대응
맥락에서도 페이지 수 확대가 아니라 기존 CTG를 실제 이용 판단 콘텐츠로 확장하는 방향이다.

## 2. 현재 상태 (확정 시점 실측)

Git `446c1d4` · Production `8e3c9f8`/`f13663508dc2`(latest 동일) · sitemap **55** ·
**Stop URL 생성 수 = 0** (라우팅·sitemap에 /stops 부재 실측).

## 3. Audit 모집단·수치 (2026-08-26 HEAD Graph Core 재계산 — 기억 아닌 실측 이관)

```
모집단: 고유 ARS Stop 267 = single-route 234 + 2-route 28 + 3-route 5
신호:   multi-route 33 · turnaround 11 · terminal 20 · editorial(keyStopIds) 52
합집합: multi∪turn 44 · multi∪turn∪term 64 · +editorial 85
Policy: A(보수형)=44 · B(균형형)=64 · C(가치형)=85
single 분해: 신호 보유 52 / **무신호 182 → URL 후보 영구 제외**
editorial 순수분(C−B) = 21 → 자동 통과 아님, 개별 심사제
multi 33 = 전부 same-name 방향쌍 소속·1C 라이브 UI로 탐색 가치 기증명
EN fallback 6: 02247(청계광장)·06510(경희대의료원.경희여중고)·13243(DMC파크뷰자이1단지입구)·
              13257(가좌역3번출구)·14628(YTN뉴스퀘어.CJ E&M)·20169(숭실대중문앞)
```

## 4. 최종 정책 = Policy B + 이중 게이트 (결정 1)

후보 자격(1차 게이트): `routeCount ≥ 2` OR `turnaround` OR `terminal` — **상한 64**.
생성 자격(2차 게이트): **최소 콘텐츠 계약 6/6 전항 통과** (§6).
Stop 데이터 존재·keyStop 지위·Graph membership만으로 URL을 생성하지 않는다.

## 5. Stage 1 — 최대 33개 "심사" 원칙 (핵심 잠금)

> **Stage 1의 33개는 생성 목표가 아니라 심사 상한이다.**
> 최대 33개(multi-route) 후보를 6/6 계약으로 개별 심사한다.
> 예를 들어 33개 중 27개만 계약을 통과하면 구현 후보는 27개다.
> **숫자를 맞추기 위해 약한 Stop 페이지를 생성하지 않는다.**
> 이 원칙은 향후 어떤 자동 생성 로직보다 우선한다.

## 6. 최소 콘텐츠 계약 (결정 4 — 6/6 통과제)

필수 6항. **하나라도 결손이면 해당 Stop의 URL 생성 금지** (`PASS 6/6` / `FAIL n/6` 판정):

1. 공식 정류장명 KO/EN(공식 SSOT) + ARS id
2. 경유 노선 전부 (실링크 칩)
3. 노선별 위치 (seq·구간 서술)
4. 앞/뒤 정류장 (StopVisit 기반)
5. 구조 역할 (기점·종점·반환점·환승 여부)
6. provenance (노선 페이지 링크 + 검증일)

권장 2항(비필수): 관련 route-context 발췌 / 카카오맵 링크.
글자 수 기준은 채택하지 않는다 — 구조적 블록이 기준.
editorial 순수분 21개는 이 계약을 통과해도 **개별 심사 후 승인된 것만** 후보가 된다.

## 7. slug 계약 (결정 2)

`/stops/<stopId>-<human-readable-name>` (예: `01010-gwanghwamun-station`).
**canonical identity = stopId** — 매칭은 stopId로, 이름부는 표시용(공식명 개명 시에도 URL 안정).
이름 단독 slug 금지. KO/EN 동일 slug(`/ko|en/stops/...`).

## 8. KO/EN 계약 (결정 3)

EN 공식명 미보유(fallback 6)라는 이유로 후보 심사에서 제외하지 않으며 `nameKo` fallback 허용
(기존 C2E 표시 계약과 동일). 단 **fallback 허용 ≠ 저품질 EN 페이지 허용** — EN 페이지도
KO와 동일한 6/6 계약을 만족해야 indexable 후보다.

## 9. Same-name 방향쌍 / 물리 그룹

URL identity는 항상 **ARS stopId** — 동명 맞은편 정류장을 이름으로 병합한 URL 금지
(방향·승차위치·노선 관계 소실). 물리 그룹 177은 URL 단위가 아니라 보조 navigation layer 후보.

## 10. adjacent Stop 링크 계약 (결정 6)

**정책을 통과한 Stop URL끼리만 링크.** 인접 정류장 이름·정보의 텍스트 표시는 가능하나,
인접이라는 이유로 URL을 만들거나 존재하지 않는 URL로 링크하지 않는다.
내부링크 v1 범위 = Route ↔ Stop 양방향만. 노선쌍 corridor 전용 페이지는 **불필요 확정**.

## 11. Stage 1 → Stage 2 게이트 (결정 5)

**자동 진행 금지. Stage 2는 미승인 상태다.** Stage 1이 구현·배포되더라도 다음을
READ-ONLY audit으로 확인한 뒤에만 Stage 2 여부를 새로 결정한다: 사용자 live 승인 ·
indexability/색인 상태 · 실제 콘텐츠 품질 · 중복·thin 인상 · 내부링크 밀도·탐색 체감 ·
KO/EN 품질 · sitemap/canonical/hreflang 계약 · Production 오류 여부.
(Stage 2 후보 = turnaround∪terminal 신규 31 / Stage 3 = editorial 개별 심사분 — 전부 미승인.)

## 12. SEO/색인 안전 계약

```
Stop 데이터 존재 ≠ URL 생성 · keyStop ≠ 자동 생성 · Graph membership ≠ 자동 생성
adjacent ≠ 자동 생성 · KO 생성 ≠ EN 품질 면제 · URL 개수 목표 없음
sitemap 수 늘리기가 목표 아님 · thin/near-duplicate 생성 금지 · Stage 2 자동 확대 금지
저가치 페이지는 noindex로 숨기지 않고 애초에 만들지 않는다 (noindex 페이지 0)
생성된 모든 Stop 페이지 = indexable = sitemap 포함 · canonical 자기참조 +
sitemap alternates KO↔EN (기존 전역 정책 유지 — Stop 전용 별도 정책 없음)
structured data: v1 = BreadcrumbList만, BusStop schema는 좌표 확보 후 재검토
```

## 13. Graph Core와의 관계

Graph에 node가 존재한다는 이유만으로 Stop 페이지를 생성하지 않는다. Phase 1C가 이미
`Route → shared Stop → other Route`를 제공하며, Stop URL은 그 관계를
`Route → Stop → connected Routes / adjacent context`의 독립 탐색 단위로 발전시키는 것 —
**Graph Core 위의 별도 품질 게이트(본 정책)를 통과해야만** 한다.

## 14. 금지사항 (본 정책 위반)

267 전량 생성 · 무신호 182 생성 · 6/6 미달 생성 · 숫자 채우기 생성 · noindex 은닉 ·
Stage 자동 확대 · 이름 기반 slug · 방향쌍 병합 URL · 비후보 링크.

## 15. 다음 라운드

**Stage 1 후보(최대 33 = multi-route 전원)의 6/6 전수 판정 READ-ONLY audit** —
판정표(`PASS 6/6` / `FAIL n/6` + 근거)를 산출하고 정지. 그 판정표를 포그린·GPT가 검토한
뒤에야 실제 Stop 페이지 구현 지시서가 나온다. 이번 정본화 라운드에서는 판정을 실행하지 않았다.

## 16. 변경 이력 / 승인

2026-08-26 v1 확정 — audit(CC) → 7결정(포그린) → GPT 검수 → 본 정본화.
본 정책의 변경은 포그린 명시 승인 후에만 가능하다.

---

## 개정 예고 (2026-10-16 · 포그린 결정)

AdSense 5차 신청 전 보강(R3a §12.10 · GPT-REVIEW-20261016.md)에 따라 포그린이 **B(양방향 통합)** 를 선택했다. 적용 시 이 문서의 slug·"1 ARS = 1 페이지" 조항은 "1 장소(양방향) = 1 페이지 · 옛 ARS URL 은 301" 로 개정한다. §12 의 색인 안전 계약(사이트맵 포함 · noindex 0 · thin 생성 금지)은 유지한다. 개정 본문은 R3b 설계 문서 승인 뒤 쓴다.

→ 개정 본문은 §17 (2026-10-16 R3b-1 구현과 함께 작성 · 옛 ARS URL 은 Next 영구 리다이렉트 308 — 301 은 Caddy 규칙이 필요해 배포 안전 계약상 쓰지 않는다).

---

## 17. 2026-10-16 개정 — 1 장소 = 1 페이지 (R3b-1 · 포그린 결정 B)

근거: 포그린 결정 B(2026-10-16 · GPT-REVIEW-20261016.md BLOCK 1) · 설계 docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md §2.10 · Codex 설계 감사 R3B-DESIGN-CODEX-REVIEW-20261016.md(BLOCK 1·2 · FIX 1~5 반영). 설계 결정(D1·D2·D7)은 포그린 위임("현재는 너 혼자 판단하면 된다")에 따라 CC 가 내렸다.

### 17.1 조항별 개정

```
§4~§6 후보·게이트   후보 단위 = 장소(같은 이름의 방향쌍 ARS 집합). 상한 64 · 숫자 채우기 금지 · Stage 1 "심사 상한" 원칙 유지.
                   6/6 최소 콘텐츠 계약은 플랫폼(ARS)마다 1·3·4항(공식명+ARS · 노선별 위치 · 앞/뒤 정류장),
                   장소 전체에 2·5·6항(경유 노선 전부 · 구조 역할 · provenance)을 적용한다.
§7 slug            URL = /{ko|en}/stops/<장소 이름 slug> (예: gwanghwamun-station). slug 는 등록부 리터럴(런타임 생성 금지 · 개칭에도 URL 안정).
                   identity 는 장소의 ARS 집합이며, ARS 는 페이지 안 절의 앵커(#ars-01009)로 유지한다.
§8 KO/EN           (유지) EN 도 같은 계약 · 공식 EN 정류장명 원문 보존(축약·교정 금지) · fallback 6 규칙 유지.
§9 방향쌍           같은 이름의 양방향 정류소는 한 페이지의 두 절로 함께 다룬다. 방향·승차 위치·노선 관계는 절마다 분리해 적는다.
                   방면 표기는 데이터 파생만(자율주행 = 노선 기·종점 · 올빼미 = 공식 기·종점) · outbound/inbound 노출 금지 · 창작 방향어 금지.
§10 adjacent       같은 장소 안 두 절 사이의 앵커 링크만 허용. 근처 정류소는 텍스트(번호·이름·노선·직선거리)로만 적고 URL 을 만들지 않는다.
§11 Stage 2        (유지+명시) 반대편 01020 추가는 승인 장소의 플랫폼 추가이지 Stage 2(turnaround∪terminal 31) 개방이 아니다 · 자동 확대 금지 유지.
§12 색인 안전        (유지) 장소 URL 은 전부 sitemap 포함 · canonical 자기참조 · ko/en/x-default alternates · noindex 0 · thin 생성 금지.
                   옛 ARS URL 은 영구 리다이렉트(Next permanent = 308 · 1회 이동)로 신호를 옮기고 sitemap 에서 뺀다.
§13 Graph          (유지) 장소 페이지의 관계·순서·이웃·방면은 Graph Core·올빼미 데이터 파생 단독. 리터럴은 slug·ARS 뿐.
§14 금지            "방향쌍 병합 URL" 삭제 → "장소 밖 병합(다른 이름의 정류소 묶기)" 금지로 교체. 나머지 금지 유지.
```

### 17.2 현재 등록부 (web/lib/stop-pages.ts · 2026-10-16)

```
장소 4 = URL 8 (ko/en) · 플랫폼 8
  gwanghwamun-station                            01009 · 01010
  jongno-2-ga                                    01013 · 01014
  seoul-museum-of-history-gyeonghuigung-palace   01007 · 01008
  jongno-5-ga-gwangjang-market                   01019 · 01020 (01020 = D2 · 심야A21 만 정차)
옛 URL 14 (7 ARS × ko/en) → 장소 URL#ars-XXXXX 영구 리다이렉트 (data/legacy-redirects.json)
도착정보 API 허용 범위 = ARRIVAL_STOP_IDS(승인 7 ARS 리터럴) + R3a 허브 ARS — 01020 은 들어가지 않는다(Codex BLOCK 2).
  장소 등록부와 API 허용 술어는 분리돼 있다(링크 함수의 truthiness 를 승인 술어로 쓰지 않는다).
RT-2 도착정보 카드 = ko · 01009 절 한 곳 그대로(확대 아님).
```

### 17.3 같이 바뀐 Stage 1 잠금 (SESSION-HANDOFF 잠금 절의 사후 명문화)

```
"승인 Stop 7개 = URL 14개가 전부"            → "장소 4 = URL 8 · 플랫폼 8(01020 포함)"
"breadcrumb = JSON-LD 2-level · 가시 없음"    → 3-level [Home, Routes, 장소] + 가시 Crumbs (R3a V4·배포 전 점검 SEO FIX 6 에서 이미 바뀐 것을 명문화)
"운영정보 복제 금지"                          → 유지. 유일한 예외 = RT-2 01009 절의 노선 운행 시간 카드(도착정보 카드 보조 · RT-2 설계 §3-2)
"EN metadata 어순 Stop {ars} · {name}"       → 장소형 title "{name} stops {a} & {b}: which side to board"
"Stop lastmod = 멤버 노선 lastChecked 최대"    → 두 플랫폼 노선 합집합의 lastChecked 최대
"Stop→Stop 링크 v1 0"                        → 같은 장소 안 앵커만
```

