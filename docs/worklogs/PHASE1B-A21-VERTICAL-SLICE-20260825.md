# Phase 1B — A21 Vertical Slice: shared-stop 탐색 UX (정본)

- 일자: 2026-08-25
- 판정: **Phase 1B = APPROVED / PRODUCTION LIVE / CLOSED**
  (구현 → 로컬 QA → 사용자 로컬 승인 → commit·push → Production 배포 → Live QA → 사용자 라이브 승인 → latest 정렬)
- 커밋: **`2d380c955e6a469c8dd2a135ba4f0368723a80b5`** "feat: Add A21 shared-stop route links"
- 상위 정본: `PHASE0-CTG-STRUCTURE-AUDIT-20260825.md` · `PHASE1A-GRAPH-CORE-20260825.md` (소급 수정 없음)

## A. 목적과 결과

Phase 1A가 검증한 Route → StopVisit → Stop 그래프를 **처음으로 사용자 화면에 연결**했다.
A21(심야 A21) 상세 페이지에서 사용자가:

```
A21 Route → shared Stop → 같은 Stop을 지나는 다른 Route (새벽A160 · 새벽A741)
```

를 **신규 URL 0으로** 기존 route detail 안에서 실제 링크로 탐색할 수 있음을 Production에서 증명했다.

## B. 변경 범위 (허용 5파일, +196/−19 — 그 외 0)

| 파일 | 역할 |
|---|---|
| `web/app/[locale]/routes/[id]/page.tsx` | 모듈 로드 시 `buildGraph(routesData)` 1회 파생 → stopId별 otherRoutes 계산 → **A21 게이트**(`route.id === 'simya-a21'`, 기존 CTA 게이트와 동일 수준) → StopsList에 presentation props 전달 |
| `web/components/route-detail/StopsList.tsx` | `DisplayStop.otherRoutes?` 확장 · 목록 상단 요약 1줄(`sharedSummary`) · shared 행 보조줄+칩 렌더. 서버 컴포넌트 유지, `<details>` 구조 무변경 |
| `web/components/route-detail/StopsList.module.css` | 요약·보조줄·칩 스타일 (기존 토큰만 사용) |
| `web/messages/ko.json` · `en.json` | 신규 키 2개: `routeDetail.stops.otherRoutes` · `routeDetail.stops.sharedStopsSummary` |

**Graph Core 수정 0 · routes.json 등 데이터 수정 0 · 신규 URL 0 · 신규 dependency 0 · sitemap/routing 무변경.**

## C. A21 실측 (Graph Core 재산출 — Phase 0/1A와 동일값 재현)

```
StopVisits 40 / unique Stops 40 / shared 17 / single 23
shared 내역: 2-route 12 + 3-route 5
연결 노선: saebyeok-a160 17개 · saebyeok-a741 5개 (a148 연결 0)
공유 구간: 종로4가↔충정로 회랑 — outbound seq 4~11 + inbound seq 30~38
```

## D. UX 확정 사양

- **요약 1줄**: 정류장 카드 제목 아래 "다른 노선과 함께 지나는 정류장 17곳 · [새벽A160] [새벽A741]" /
  "17 stops are also served by other routes · …" — 수치·노선 목록 전부 Graph 계산 파생(하드코딩 0).
  닫힌 `<details>` 미리보기 3곳(첫·반환점·마지막)이 전부 비공유라 발견성은 이 줄이 담당.
- **shared 행**: 17행에만 "이 정류장을 지나는 다른 노선 / Other routes serving this stop" + 노선 칩.
  비공유 23행은 기존과 동일(억지 링크 0).
- **칩**: `i18n/navigation`의 locale-aware `Link` 실 `<a>`. 텍스트는 공식 표시명만
  (`새벽A160`/`Saebyeok A160` — SSOT `displayNameKo` 원문 그대로, 공백 임의 교정 없음).
  v1에서 구간·시간·요금·방면·출처 미포함 — 상세·provenance는 대상 노선 페이지가 담당.
- **금지 준수**: "환승" 계열 단정 표현 0 (데이터가 증명하는 것은 동일 ARS 정류장 경유까지) ·
  outbound/inbound/loop 사용자 노출 0 · 행 자체 비인터랙티브(칩만 focus/tap 대상, 중첩 interactive 0).
- **격리**: A160·A741·A148 등 다른 노선 페이지에는 신규 UI 미노출 (게이트 + import 구조 이중 보장).

## E. 로컬 QA (commit 전)

```
validate-graph 21항 PASS · validate-stop-names PASS · test-stop-names 56/56
tsc --noEmit PASS (.d.ts 없이 JSDoc 타입 소비 성공) · build PASS (53 URL 유지)
lint = baseline 5 errors / 27 warnings 완전 동일 (파일 목록·건수 diff 대조) — 신규 회귀 0
standalone(:3100)+Chromium: 요약·17행·칩 클릭 내비·a160 격리·mobile 390 overflow 0
캡처: ~/Desktop/seoul-shots/Phase1B-A21-slice/ (로컬 1~7 + 라이브 8~9)
사용자 로컬 육안 승인 후 commit(5파일 명시 stage) → push (d620054..2d380c9 ff)
```

## F. Production 배포 (2026-08-25) — DEPLOY PASS

```
previous   runtime abb0ba7 / image sha256:23bfedc2ba78…
new        runtime 2d380c9 / image fd10551bb9c6  (revision 라벨 = full SHA)
절차        rollback-abb0ba7 태그 박제 → git pull --ff-only (서버 HEAD 2d380c9)
           → immutable 2d380c9 단독 빌드(+라벨) → candidate 선검증(외부 트래픽 0)
           → 기존 컨테이너 stop·rename 보존 → 새 컨테이너 기동
중단        실측 0.9초 (0.4s 프로브 120회 중 502 2샘플 — R26 3초·R27 2초 대비 단축)
무접촉      Caddy 0 (reload조차 없음) · 타 8컨테이너 restarts 0 · 이미지 삭제/prune 0
rollback   미실행
```

**배포 교훈 (배포 안전 계약에 추가)**: candidate·Production standalone 컨테이너 공히
**`--hostname 0.0.0.0` 필수.** 누락 시 Next standalone이 컨테이너 해시 hostname에 bind되어
candidate 내부 fetch 검증이 실패한 실사고 1회 발생(candidate 재기동으로 해소).
Production 본 교체에는 올바른 플래그를 사용해 영향 0.

## G. Live QA — 전항 PASS

```
/ko/routes/simya-a21    요약·shared 17행·label 17·chip 24(행 22+요약 2)·FAQ/sidebar/CTA 정상
/en/routes/simya-a21    영어 요약·label·칩 표시명·href 전부 /en/ locale
칩 실클릭 3경로          ko→a160 · ko→a741 · en→/en/a160 (404·locale 이탈 0)
/ko·en/routes/saebyeok-a160   격리 — sharedSummary/chip/label 렌더 0
모바일 390px            KO·EN 닫힘·펼침 전부 horizontal overflow 0, 칩 wrap·탭 정상
smoke                  6도메인 200 · sitemap 53/53 전수 200 · 404 매트릭스 4/4 · 신규 URL 0
runtime                컨테이너 로그 clean · pageerror/hydration 0
                       (간헐 콘솔 403은 googleads 승인 전 거절 — 기존 기준선 동일, 재로드 4xx 0)
```

**사용자 라이브 확인·승인: 2026-08-25 완료.**

## H. latest 최종 처리

사용자 라이브 승인 후, 기존 관례(QA+승인 후 latest = 현 운영 이미지)대로
**latest → `fd10551bb9c6` 이동 완료** (사전 게이트 5항 확인 → `docker tag` 1회 → 사후 확인,
컨테이너 재시작 0). latest는 rollback 기준이 아니며 그 역할은 rollback 태그·backup이 담당.

## I. 최종 좌표 / rollback 자산

```
Git local = origin/main   2d380c955e6a469c8dd2a135ba4f0368723a80b5
Production runtime        2d380c9 · image fd10551bb9c6 · latest 동일(fd10551bb9c6)
previous                  abb0ba7 · 23bfedc2ba78
rollback                  rollback-abb0ba7 → 23bfedc2ba78 (유지 확인)
backup                    seoul_autonomous_web_backup_abb0ba7_20260825-204839 (exited, 보존)
기존 보존                  rollback-ba058ee·rollback-ef0274a·backup 2건 — 삭제·prune 금지 유지
```

## J. Phase 1B가 증명한 제품 가치

단순 내부링크 추가가 아니다. **ARS stopId 기반 Graph 관계를 실제 사용자가 탐색 가능한 UI로
Production에서 처음 증명했다.** 표시된 "이 정류장을 지나는 다른 노선"은 편집 판단이 아니라
Graph Core가 SSOT에서 파생한 것이므로 데이터가 바뀌면 UI가 따라오고, 리프 문서 집합이던
노선 페이지가 처음으로 데이터 기반 탐색 구조를 가졌다. 이 패턴은 게이트 1줄 제거로
공유 정류장이 있는 4개 노선 전체(양방향)로 확장 가능함이 구조적으로 확인됐다.

## K. 다음 라운드 후보 (기록만 — 우선순위 미확정, 별도 승인으로 선택)

```
shared-stop UX 확대 (A21 게이트 해제 → a160·a148·a741 양방향)
Robotaxi Freshness (2026-08-19 공식 출처 확보 완료 — Phase 0 정본 §F)
독립 Stop URL 정책·품질 게이트 (Phase 0 §13 기준 후보 약 60~80)
Night Bus Map ↔ CTG 매핑 (115행 수동 테이블, SVG 무수정)
static "지금 운행 중인가" decision 기능
N버스 통합 (별도 대형 공식 조사 라운드 선행)
```
