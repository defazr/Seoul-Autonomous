# GPT HANDOFF — SEOUL AUTONOMOUS — 2026-09-21

> 이 문서는 **`docs/GPT-HANDOFF-2026-09-17.md` 를 대체한다.** 09-17 문서는 저장소에
> 그대로 보존하며 삭제·소급 수정하지 않는다 — 다만 **현재 지시로 읽지 않는다.**
> 09-17 문서의 §1·§9·§10·§11·§19 는 2026-09-21 T+14d Decision 이 **완료되기 전**
> 상태이므로 그대로 따르면 **이미 끝난 Decision 을 다시 연다.** 무엇이 왜 바뀌었는지는 §20.
>
> 그 앞 세대인 2026-09-01 GPT용 핸드오프는 **채팅 기록으로만 존재하며 저장소에 파일이
> 없다** — 소급 생성하지 않는다. 계약·금지선은 09-17 을 거쳐 이 문서에 승계됐다.
>
> 새 세션에는 **이 문서 하나면 된다.** 세부 구현 근거가 필요하면 그때
> `docs/handoff/HANDOFF-20260901.md`(CC 최종 좌표·구현/QA 구조)를 추가로 받는다.

---

## 0. 이 핸드오프의 목적

이 프로젝트는 이미 긴 검증·배포 과정을 거쳤다.
**이전 결정을 처음부터 다시 검토하거나 재설계하지 말 것.**

현재 목적은 단 하나다.

```
Caddy access-log observability — READ-ONLY discovery / 설계
목적은 계측 가능성 조사이지 Caddy 변경이 아니다.
```

RT-1·RT-2 는 닫혔고, RT-2 stability follow-up 도 닫혔고, **Stage-1 discovery 관측도
T+14d Decision 으로 닫혔다.** 고정 주기 관측을 반복하는 것은 현재 NEXT 가 아니다.
계측 수단이 없는 상태에서 같은 0/14 를 다시 확인할 뿐이기 때문이다.

---

## 1. 현재 상태 — 한눈에

```
implementation / deployment round   none
Stage-1 observation axis            CLOSED — T+14d Decision 완료 (2026-09-21 16:57 KST)
                                    정본 STAGE1-DISCOVERY-T0-20260907.md §17

Stage-1 discovery 판정               DISCOVERY STARTED   유지
decision anchor                     T0 2026-09-07 · 14/14 UNKNOWN (불변)
anchor 대비 UNKNOWN 이탈              11 / 14
현재 snapshot                        Discovered 11 / UNKNOWN 3
                                    UNKNOWN = /en/01013 · /ko/01013 · /ko/01014
lastCrawlTime                       0 / 14        ← T0 포함 6회차 연속
Crawl                               NOT OBSERVED
Crawled / Indexed progression       NOT OBSERVED

AdSense                             HOLD
  사유                               §15.6b 의 조기 재판정 조건(lastCrawlTime 또는
                                    의미 있는 Indexed progression)이 T0 이후 14일간
                                    **한 번도 성립하지 않았다**
RT-2 확대                            HOLD
  ⚠ AdSense 때문이 **아니다.** 둘은 독립 gate 이며 09-21 에 각각 따로 판정했다
  사유                               확대 자체를 정당화할 **제품 근거 부족** —
                                    자연 운행시간대 B 화면이 Production 에서 미관측이고
                                    realtime 적용은 KO 01009 한 페이지뿐이다
  🚫 색인 부진을 확대의 **찬성 근거로도 반대 근거로도** 사용하지 않는다

sitemap lastDownloaded              2026-09-14 14:02 KST
                                    09-21 관측까지 **7일간 새 다운로드 기록 없음**
                                    ※ 사실만 기록. 원인·패턴 해석 금지

NEXT                                Caddy access-log observability
                                    READ-ONLY discovery / 설계   ← 유일
                                    실제 Caddy 변경은 범위 밖 (§11)
```

⚠ **Search Console 의 0/14 만으로 "실제 Googlebot 접근 자체가 없었다" 고 단정하지 않는다.**
실측한 것은 "Search Console 이 `lastCrawlTime` 을 14/14 에서 보고하지 않았다" 까지다.
서버 측 독립 확인 수단은 현재 **존재하지 않는다**(Caddy log 지시자 0건 — §9.4).
이 공백이 바로 다음 라운드의 이유다.

⚠ **Stage-1 고정 주기 관측 반복은 현재 NEXT 가 아니다.**

Git / Production 좌표

```
Git local / origin           새 세션 시작 시 **동적 확인** — 이 문서에 기대 SHA 를 적지 않는다
  실측                        local HEAD · origin/main · ahead/behind 를 반드시 직접 측정
  차이가 있으면                원인을 확인한다 (미push 커밋인지, 실제 불일치인지)
  🚫 pin 금지                 특정 docs SHA 를 기대값으로 쓰지 않는다 —
                             docs 커밋마다 전진하므로 적는 순간 낡는다
  목표값                      동기화 완료 상태의 목표는 0/0 이다.
                             단 **문서만 보고 불일치를 drift 로 단정하지 않는다** (§19 ①)
Production runtime           b10c7d3333b9e448fcfe2b116301635bd178d160
server checkout              b10c7d3333b9e448fcfe2b116301635bd178d160
image / latest               sha256:d55dbf7d9afd…
sitemap                      69      Stage-1 Stop URLs 14 (7 Stop × KO/EN)
```

⚠ **Git HEAD 가 Production runtime 보다 앞선 것은 정상이다.** docs·tooling 커밋이
Production 을 바꾸지 않기 때문이다. 이것을 drift 로 읽지 않는다.

---

## 2. RT-1 — CLOSED

핵심 검증

```
실시간 API 노선 Coverage      11/11
Stage-1 Stop coverage        7/7
Stop matching mechanism      PASS
Vehicle position             PASS
A160 실차 GPS                 57초 동안 496m 이동 실측
```

실제 arrmsg 패턴

```
N분후[K번째 전] · 곧 도착 · 운행종료 · 출발대기 · 회차대기
```

Localization 은 아직 OPEN. `firstTm` / `lastTm` / `getBustimeByStation` 은 RT-2 v1 사용 금지.

**가장 중요한 발견 — arrival 과 position 은 서로 다른 축이다.**
A160 차량은 실제로 움직이고 있었지만 광화문역 기준 arrmsg 는 `회차대기` 였다.
따라서 "몇 분 후 도착"과 "지도 위 차량 위치"를 같은 상태의 두 표현으로 취급하면 안 된다.
**이 발견 때문에 RT-2 arrival 과 RT-3 map 을 분리했다.**
정본 `REALTIME-TRANSIT-RT1-NIGHT-20260901.md`

---

## 3. RT-2 — CLOSED / Production Live Approved

배포 대상 `/ko/stops/01009-gwanghwamun-station` **한 페이지뿐이다.**
코드 조건은 `isKo && stopId === '01009'` — 14 URL 중 1개다.
영어 01009 도, 방향쌍 01010 도 실시간이 없다.

현재 제공: 정적 노선 운행 안내 · 조건부 실시간 도착 카드 · 서버사이드 arrival proxy
아직 없음: 나머지 6 Stop RT-2 · EN realtime · RT-3 지도

좌표

```
RT-2 code commit      b10c7d3333b9e448fcfe2b116301635bd178d160
RT-2 docs closure     4af3bb79bc6e32127d67cfd320bbdaab23a75dbf
배포                   2026-09-01 19:07 KST · downtime 1.87초 · BLOCK 0
```

post-launch READ-ONLY audit = PASS / BLOCK 0. 단 감사 시점이 배포 14분 후이므로
**post-deploy immediate audit PASS; long-term stability not established** 로 읽는다.
정본 `RT2-POST-LAUNCH-AUDIT-20260901.md` · `RT2-PRODUCTION-DEPLOYMENT-20260901.md`

**그 한계는 이미 메워졌다 — §9 stability follow-up 참조. 재실행 금지.**

---

## 4. RT-2 핵심 제품 계약 — 다시 열지 말 것

**Static-first.** 정적 shell 은 실시간 upstream 가용성에 의존하지 않는다.
실시간 API 가 죽어도 정적 페이지는 정상이어야 한다.

**정적과 실시간은 대체 관계가 아니다.** 정적 노선 운행 안내 = 항상 존재하는 base layer,
실시간 = 조건부 보강. Route 수준 첫차·막차를 "이 정류장의 첫차/막차"처럼 표현 금지 —
반드시 "노선 운행 기준"임이 드러나야 한다. 정본 `RT2-ARRIVAL-CARD-DESIGN-20260901.md`

**갱신** — 페이지 진입 1회 · 수동 새로고침 · **자동 polling 없음.**

**cache** — process-local memory cache, TTL 20초.
20초는 서울시 데이터 갱신주기가 아니라 **우리 호출 절감 정책**이다.

**budget** — 300 upstream calls / KST calendar day.

```
차감  실제 upstream request 시작 직전 +1 · upstream 실패도 이미 호출했다면 +1
비차감 fixture 0 · cache hit 0 · single-flight follower 0
```

현재 단일 컨테이너라 process-local counter 가 사실상 global 이지만 토폴로지가 늘면 재검토 필수.

**실패와 운행종료를 절대 섞지 않는다.**

```
AUTH_ERROR · UPSTREAM_QUOTA · TIMEOUT · APP_BUDGET_EXHAUSTED · UPSTREAM_ERROR · CONFIG_ERROR
```

사용자에게는 비차단 실패 UI. **API 실패를 운행종료로 표시 금지.**

---

## 5. RT-2 화면 상태

**B** — 의미 있는 상태 존재. 예: 새벽A741 곧 도착 / 새벽A160 18분 후 8번째 전 / 심야A21 출발대기

**C** — 우리 노선이 모두 운행종료 → 실시간 카드 숨김, 정적 운행 안내만 남음.
**이게 하루 대부분의 정상 상태다.**

**partial** — ended 노선은 카드에서 제외하고 나머지만 표시.

**unknown** — 미확인 정상 arrmsg 가 오면 **원문 그대로 표시.** 억지 번역·추론 금지.

---

## 6. RT-2 QA 에서 이미 닫힌 것 — 반복 테스트 금지

```
B · C · partial · unknown · approved route 0 · invalid auth · timeout · budget exhausted ·
cache hit · TTL expiry · single-flight · stale 5분 · manual refresh · unauthorized stop 404 ·
production fixture hard guard · static shell independence · key leakage 0 ·
EN realtime 렌더 0 · sitemap 69 · lint baseline regression 0 · tsc PASS · build PASS
```

CLS — 01010 control 0 / 01009 D 0.0396 / 01009 B 0.0994.
판정 **Pilot ACCEPT / expansion WATCH.**
실제 field p75 가 낮을 것이라는 추정은 사실로 기록하지 않는다.

---

## 7. Production 운영 계약

ServiceKey

```
/etc/seoul-autonomous/secrets/              root:root 700
/etc/seoul-autonomous/secrets/realtime.env  root:root 600
runtime injection   docker run --env-file /etc/seoul-autonomous/secrets/realtime.env
```

금지 — image ARG/ENV bake · repo 저장 · docs 저장 · 로그 출력 · shell literal ·
**브라우저 → 서울 버스 API 직접 호출(영구 금지).**

잠금 예외는 `approved server-side arrival proxy only` — `/api/arrivals/[stopId]` 서버측만.

rollback 주의 — pre-RT2 image 는 legacy docker run 이라 env-file 이 필요 없고,
RT2-capable image 는 secret preflight + `--env-file` 이 필요하다.
**과거 이미지를 모두 secret file 에 의존시키지 않는다.**

---

## 8. 배포 중 발견한 운영 지식

**container health 확인 시 `localhost` 사용 금지, `127.0.0.1` 사용.**
localhost 가 IPv6 로 해석돼 candidate 와 기존 Production **양쪽에서 동일 실패**한 것이
대조군으로 확인됐다. 단 "모든 서버/컨테이너에서 항상 그렇다"고 일반화하지 말 것.

**candidate·본 컨테이너 공히 `--hostname 0.0.0.0` 필수.** 누락 시 Next standalone 이
컨테이너 해시 hostname 에 bind 되어 내부 검증 fetch 가 실패한다 (2026-08-25 실사고 1회).

**server Dockerfile** — `/opt/seoul-autonomous/Dockerfile` 은 Git 에 없는 server-only
untracked 운영 자산이다. working-tree gate = tracked 0 / staged 0 / untracked Dockerfile 정확히 1개.
SHA-256 pin `01429bd8…68ac`.
⚠ **SHA pin 은 파일이 안 바뀌었다는 동일성만 보장한다. Dockerfile 자체의 정당성은 보장하지 않는다.**
근본 해결(version-controlled Dockerfile 이관)은 별도 backlog.

**배포 안전 계약** — rollback 태그 → immutable SHA 태그 단독 빌드(+revision 라벨) →
candidate 선검증 → 기존 컨테이너 rename 보존 → **라이브 QA + 사용자 승인 후에만 `latest` 이동.**
Caddy 는 validate → reload 만. `docker restart` 금지. 같은 Caddy 가 6도메인·9컨테이너 담당.

---

## 9. Stage-1 Search Console discovery — CLOSED (관측 기록 보존)

**이 축은 2026-09-21 T+14d Decision 으로 닫혔다** (정본 §17). 아래는 그 전 과정의
관측 기록이며 **재실행 지시가 아니다.** 고정 주기 관측을 반복하지 않는다.
관측 도구(§9.5)는 살아 있으나, 다음 실행은 별도 지시가 있을 때만 한다.

### 9.1 이미 닫힌 선행 작업

```
RT-2 stability follow-up   ✅ 2026-09-07 완료 — 재실행 금지
                           runtime PASS · real-usage WATCH (→ GA4 로 해소)
                           정본 RT2-STABILITY-FOLLOWUP-20260907.md
```

**09-01 핸드오프의 STEP 1 은 이것이다. 이미 끝났다. 다시 지시하지 말 것.**

### 9.2 관측 이력

```
T0        2026-09-07 13:28   sitemap 제출 1회(HTTP 204) · 14/14 UNKNOWN
                             reported URLs 50 → 69 · errors/warnings 0/0
T+42.8h   2026-09-09 08:14   Discovered 10 / UNKNOWN 4
T+72.6h   2026-09-10 14:01   Discovered  9 / UNKNOWN 5   (verdict 미기록 — 부분 불완전)
T+7d      2026-09-14 14:49   Discovered 13 / UNKNOWN 1   (남은 UNKNOWN /en/01009)
T+10d     2026-09-17 15:09   Discovered 12 / UNKNOWN 2   (UNKNOWN /en/01010 · /en/01013)
T+14d     2026-09-21 16:57   Discovered 11 / UNKNOWN 3   (UNKNOWN /en/01013 ·
                             /ko/01013 · /ko/01014)  ← Decision 회차. 관측 축 종료
```

**lastCrawlTime 은 T0 포함 6회차 전부 0/14.** Crawled/Indexed 도 0/14.

sitemap

```
lastSubmitted    2026-09-07 13:28 KST   (재제출 0회)
lastDownloaded   09-07 13:28 → 09-08 16:55 → 09-14 14:02 → 09-21 변동 없음
                 09-14 이후 7일간 새 다운로드 기록 없음 — 사실만 기록, 원인·패턴 주장 금지
reported URLs    69     errors/warnings 0/0     contents indexed 0
```

### 9.3 해석 금지선 — 반드시 지킬 것

```
허용 표현   "Search Console 이 두 시점에 서로 다른 coverageState 를 보고했다"
🚫 금지     "발견이 취소됐다" · "discovery 가 후퇴했다" · "나빠졌다" ·
            "페이지 결함이 생겼다" · "내부 파이프라인이 되돌아갔다"
```

- **snapshot 총계 변화를 선형 진전·후퇴로 판정하지 않는다.** 전체 판정의 비교 대상은
  직전 회차가 아니라 **decision anchor(T0)** 다 → 현재 11/14.
- 특정 URL 의 UNKNOWN 지속·복귀만으로 페이지 결함을 판정하지 않는다.
  **preflight 14/14 PASS(200·canonical·robots·sitemap·내부링크·본문) 는 유효하다.**
- DISCOVERY STARTED = "Google 이 URL 존재를 인식하기 시작" 이지 **색인 시작이 아니다.**

### 9.4 서버 로그 원인조사 (2026-09-14 READ-ONLY 완료)

```
판정   INCONCLUSIVE — 분기 전제 자체가 불성립
이유   Caddyfile 에 log 지시자 0건 · "status":200 전체 0건
       → 정상 응답 요청은 크롤러든 사람이든 한 줄도 기록되지 않는다
결론   crawl-not-observed 증거는 강화도 약화도 되지 않았다.
       근거는 여전히 Search Console 단일 출처다.
원인   미확정. crawl budget 은 배제되지 않았으나 가설 중 하나일 뿐이다.
🚫     rDNS 미검증이므로 "verified Googlebot" 표현 금지
```

### 9.5 관측 도구

```
web/scripts/observe-gsc-discovery.mjs      러너 (READ-ONLY scope 단독)
web/scripts/lib/gsc-discovery-core.mjs     순수 분석 (네트워크 없음)
web/scripts/test-gsc-discovery.mjs         오프라인 QA 26항
```

실행 순서 — ① `cd web && node scripts/test-gsc-discovery.mjs` (관측 전 QA 먼저, 26/26 PASS 필수)
② `node scripts/observe-gsc-discovery.mjs --key <sa.json>` ③ 정본 순서로 판정.

**scope 는 `webmasters.readonly` 정확히 1개만 허용** — 혼합·write 는 서명 전·요청 전 2중 BLOCK.

비교 축 3개를 항상 분리한다.

```
comparison baseline    러너 출력 == 공식 직전 snapshot (불일치 해소됨 · commit fc611e1)
official previous      2026-09-21 T+14d
decision anchor        2026-09-07 T0 · 14/14 UNKNOWN   ← 전체 판정은 항상 이 축
```

`OBSERVATION_HISTORY` housekeeping 은 **commit `fc611e1` 에서 실행 완료**됐고
09-21 실데이터에서 검증됐다. **다시 열 일이 아니다** — 미실행 후보로 쓰지 않는다.

---

## 10. AdSense 판단

```
1차 거절   2026-07-10   "가치가 별로 없는 콘텐츠"
2차 거절   2026-07-29   색인 완료 상태에서 동일 사유
3차 거절   2026-08-25 확인   "정책 위반 → 가치가 별로 없는 콘텐츠"
현재       재신청 HOLD
```

**"기능을 전부 구현한 다음 신청"이 조건이 아니다.**
RT-3 지도나 EN realtime 은 AdSense 승인 필수조건이 아니며 "지도가 있어야 승인된다"는 근거는 없다.
RT-2 는 URL 을 늘리지 않았다 — sitemap 69 유지.

3차 거절 원인이 페이지 양 부족인지 콘텐츠 가치·깊이 부족인지 **아직 미증명**이다.
기술 게이트(robots·ads.txt·canonical 등)는 2026-08-11 감사에서 전건 PASS 였다.
따라서 대응은 SEO 미세 튜닝이 아니라 **사이트 실질 가치 상승**이며,
**기능 개수를 AdSense 판단 기준으로 쓰지 않는다.**

판단 기준 — 기능 개수보다, **실제 사용자 가치가 명확해졌고 그 변화가 Google 에
크롤·색인될 시간을 가졌는가.** 현재 lastCrawlTime 0/14 는 그 질문에 아직 답이
나오지 않았다는 뜻이다.

2026-09-21 T+14d Decision 에서 **HOLD 로 판정했다** (정본 §17.1). 14일 동안 조기
재판정 조건이 한 번도 성립하지 않았다. **다음 판단 시점은 고정 날짜가 아니라
Caddy 계측 확보 이후** 별도로 정한다. 그 전에 lastCrawlTime 또는 Indexed progression 이
의미 있게 발생하면 그 시점에 앞당겨 판단할 수 있다.

---

## 11. 다음 작업 순서 ★ — 현재 NEXT 는 하나뿐이다

**2026-09-21 T+14d Decision 은 완료됐다 (정본 §17). 재실행 금지.**

```
NEXT   Caddy access-log observability — READ-ONLY discovery / 설계
       목적은 계측 가능성 조사이지 Caddy 변경이 아니다
```

### 왜 촉진보다 계측이 먼저인가

지금 Request Indexing 이나 sitemap 재제출부터 하면, 이후 Googlebot 이 들어와도
**어떤 변화 때문에 들어왔는지 분리할 수 없다.** 게다가 현재 crawl 근거는 Search Console
단일 출처이고 서버 쪽에서는 **구조적으로 답할 수 없다**(Caddy log 지시자 0건 · §9.4).

현재 가장 큰 공백은 **색인 촉진책 부족이 아니라 서버 측 독립 관측 수단 부재**다.
순서는 **계측기 먼저 → 촉진 수단은 그 이후 별도 판단.**

### READ-ONLY discovery 에서 조사할 것

```
현행 Caddyfile 실제 구조 (전역 / 사이트 블록 경계 · log 지시자 유무)
6도메인 · 9컨테이너 공유 범위
seoulautonomous 단일 도메인만 access log 격리 가능 여부
로그 경로 · 포맷
rotation / retention
예상 디스크 영향
현행 validate / reload / rollback 계약 (Caddyfile 전문 백업 포함)
```

**Caddy 계측이 불가능한 것으로 나올 경우의 대안은 조사 결과를 보고 별도 판단한다.**
지금 대안을 미리 정하지 않는다.

### 이 라운드에서 금지

```
Caddyfile 수정 · validate / reload · Production 변경
앱 / Next.js 제품 코드에 임시 logging 추가        ← observability 를 제품 코드로 선행 구현 금지
Request Indexing · sitemap 재제출 · route recrawl · 내부링크 변경
그 밖의 모든 discovery / crawl 촉진 write
```

조사와 구현을 **같은 라운드에 섞지 않는다.** 구현 여부는 조사 결과를 보고 다시 승인한다.
공유 Caddy 는 운영 사고 이력이 있는 영역이다.

### gate 관계 — 유지

**RT-2 확대와 AdSense 재신청은 서로 독립된 gate 다.** 2026-09-21 에 **각각 따로 판정**했고
결과는 둘 다 HOLD 이나 **사유가 다르다**(§1). 입력(discovery·crawl 결과)만 공유한다.

```
🚫 "AdSense 승인되면 RT-2 확대" · "색인 정상 → 7-stop 확장 → 그 뒤 재신청"
   같은 종속·직렬 구조는 폐기됐다. 되살리지 않는다.
🚫 AdSense 승인·거절이 RT-2 확대 여부를 자동으로 결정하지 않는다.
```

RT-2 확대는 여전히 **두 축을 따로** 판단한다 — ① 한국어 나머지 6 Stop ② 영어 realtime.
**같은 결정이 아니다.**

## 12. 자연 B 화면

Production 에서 실제 운행시간대 B 화면은 아직 자연 관측하지 못했다.
등급 **non-blocking WATCH. 이것 때문에 RT-2 를 다시 OPEN 하지 않는다.**

근거 세 축이 이미 닫혔다 — RT-1 actual arrmsg 실측 · local B rendering 시각 승인 ·
Production actual API path PASS.

**Production 에 fixture 를 주입해 강제로 B 를 만들지 말 것.**

---

## 13. RT-3 지도 — 미승인

기술 가능성 PASS (A160 차량 GPS 실제 이동 확인).

시작한다면 조건 — 우리 자율주행 차량만 · 일반 버스 제외 · 차량번호 미표시 ·
dataTm 기준 freshness 표시 · "정확히 지금 여기" 표현 금지 ·
**arrival 과 position 을 같은 의미로 표현 금지.**

**RT-3 전에 `A21 static 40 stops ↔ API 44 stops` discrepancy CLOSE 필수.**
RT-3 는 AdSense 재신청 필수조건이 아니다.

---

## 14. EN realtime — 미승인

Localization gate

```
서로 다른 자율주행 노선 ≥ 3 · 서로 다른 운행 시점 ≥ 3 · matched arrmsg ≥ 30
현재 parser 미처리 신규 정상 패턴 = 0
```

현재 arrmsg 집합은 닫히지 않았다. unknown fallback 은 항상 유지.
**EN 때문에 KO 확장을 막지 않는다.**

---

## 15. 별도 운영 라운드 — RT-2 및 관측과 섞지 않는다

서버에 **System restart required** 가 떠 있다.
영향 범위가 여러 컨테이너·여러 도메인·Caddy 포함이고,
재부팅 시 `restart unless-stopped` 로 모두 정상 복귀하는 것이 **실제 검증된 적 없다.**
따라서 별도 infrastructure round 다.

---

## 16. 보존 원칙

Production 에서 backup containers 보존 · rollback images 보존 · **prune 금지 · 삭제 금지.**
retention policy 는 별도 backlog.

저장소의 오래된 미추적 파일 11건도 현재 작업과 무관하므로 임의 정리 금지.
(`.playwright-mcp/` · 미추적 handoff 5건 · 미추적 worklog 3건 ·
`round19-final-이식지시서.md` · `route/`)

docs 커밋은 코드와 분리한 **docs-only 단독 커밋**. **`git add .` · `git add -A` 금지** —
정본만 경로 명시 stage (미추적 보존물 혼입 방지).

---

## 17. Backlog — 전부 착수 금지, 별도 승인 사항

```
OBSERVATION_HISTORY / comparison-baseline 회귀 테스트 hardening 후보
                                      — 특정 회차 총계를 기대값으로 고정하지 않는 형태로
                                        설계할 것. 별도 후보, 현재 미실행
Stage 2 (V3 26개 재심사)                — 미승인. 수량·대상 모두 미정
RT-2 나머지 6 Stop 확장 / EN realtime / RT-3 지도 / observability 제품 코드
ServiceKey 구조 변경 · budget 변경 · Redis/KV · 자동 polling
backup 삭제 · rollback 삭제 · Docker prune · 서버 reboot · Dockerfile repo 편입
AdSense 재신청
A21 static 40 ↔ API 44          — RT-3 시작 전 CLOSE 필수
dev AbortError / cleanup-state flow    — expansion 전 TECH-DEBT
01008 카드 prev/next 중복 · 데스크톱 여백 · tap target 44px
1C backlog 3건 (EN 라벨 축약 · summary "일부 정류장" 명확화 · 칩 tap 44px)
`Failed to find Server Action` 프로빙 (RT-2 와 별도)
지도 ↔ CTG 매핑 · static decision(C1O 재조사 선행) · N버스 통합
검색 8개 제한 해제 · 크롬 다크톤 · 페르소나 롱테일 · 안드로이드 back · 영문 노선도 ·
경로탐색 audit · /ko/updates title suffix · ko 320px word-break · R27 후속 3건
```

---

## 18. 협업 방식

```
GPT          판단 / 전략 / gate / CC 지시서
Claude Code  구현 / QA / read-only audit / 이견 제시
사용자(포그린) 최종 human approval
```

항상 **GPT 지시 → CC 선보고 → GPT 판단 → 실행.**
불확실하면 추측하지 말고 read-only audit.
Production irreversibility 는 human gate 필수.
**커밋·푸시·배포는 각각 별도 승인.**
구현자가 이견을 내면 억누르지 말고 검토한다.
**모든 CC 보고 하단에 「CC 이견 및 아이디어」 섹션 필수** (없으면 "이견 없음" 명시).
조건부 게이트는 이진 판정 — 미결 1건이라도 있으면 정지.

---

## 19. 새 세션 첫 행동 ★

**2026-09-21 T+14d Decision 은 이미 완료된 과거 작업이다. 날짜를 보고 Decision 을
여는 기존 분기는 폐기됐다.** 새 세션은 아래 순서만 밟는다.

**① Git docs axis — 동적 확인**

```
local HEAD == origin/main 인가 · ahead/behind 는 몇인가
🚫 특정 docs SHA 를 기대값으로 pin 하지 않는다 (docs 커밋마다 전진한다)
```

⚠ **이 문서가 새 방에 전달되는 시점에 로컬이 origin 보다 앞서 있을 수 있다.**
작성 시점 기준 정본 커밋 `adbbbc3`(T+14d Decision 기록)는 **push 전**이었다.
따라서 `ahead 1` 또는 그 이상이 나와도 **그 자체를 이상으로 판정하지 않는다.**
실제 상태는 새 세션에서 직접 확인하고, 이 문서의 서술로 덮어쓰지 않는다.

**② Production axis — pin 기준 확인**

```
runtime / server checkout   b10c7d3333b9e448fcfe2b116301635bd178d160
image / latest              sha256:d55dbf7d9afd…
sitemap 69 · Stage-1 Stop URLs 14
```

Production 이 origin/main 보다 docs 커밋 N개 뒤인 것은 **정상이며 drift 가 아니다.**

**③ 현재 판정 확인**

```
docs/worklogs/STAGE1-DISCOVERY-T0-20260907.md  §17   ← 현재 판정 정본
docs/SESSION-HANDOFF.md                              ← 판단·gate·NEXT 정본
```

**④ T+14d Decision 은 완료된 작업이다 — 재실행 금지.**
관측을 다시 돌려 0/14 를 재확인하지 않는다.

**⑤ 현재 승인된 NEXT 가 열렸는지 확인**

```
Caddy access-log observability — READ-ONLY discovery / 설계
🚫 사용자의 별도 GO 없이 실제 Caddy 수정으로 넘어가지 않는다
```

**⑥ 새 세션이 시작됐다는 이유만으로 자동 실행하지 않는다.**

```
GSC / GA4 호출 · 관측 회차 · 외부 write · 배포 · 커밋 · 푸시 — 전부 지시 후에만
```

세션 시작 절차 (CC 쪽)

```
1  cd web && node scripts/project-status.mjs      ← 좌표 실측 (git·문서 존재만. 네트워크 0)
2  docs/SESSION-HANDOFF.md                        ← 판단·gate·NEXT 정본
3  docs/worklogs/STAGE1-DISCOVERY-T0-20260907.md  ← 최상위 정본
   현재 판정 정본 = §17 · 다음 라운드 계약 = §17.6
   §0·§8·§13·§14·§15·§16 은 당시 기록이며 Superseded — 현재 지시로 읽지 않는다
```

## 20. 무엇이 달라졌나 (2026-09-17 → 2026-09-21)

**유효 그대로 승계** — §2~§8(RT-1·RT-2 계약·QA·Production 운영·배포 지식),
§12~§18(자연 B·RT-3·EN realtime·별도 운영 라운드·보존 원칙·backlog·협업 방식).
내용이 정확하며 지금도 구속력이 있다. 다시 쓰거나 의미를 바꾸지 않았다.

**갱신·대체**

```
09-17 §1   NEXT = 09-21 T+14d Decision · snapshot 12/14 · 5회차
           → Decision 완료 상태로 교체. 11/14 · 6회차 · AdSense·RT-2 둘 다 HOLD(사유 분리)
09-17 §9   관측 이력이 T+10d 에서 끝나고 관측 축이 ACTIVE
           → T+14d 회차 추가 · 관측 축 CLOSED · baseline 불일치 해소 기록
09-17 §10  "다음 판단 시점은 늦어도 2026-09-21"
           → 09-21 에 HOLD 판정 완료. 다음 시점은 Caddy 계측 확보 이후 (고정 날짜 없음)
09-17 §11  STEP 1 = 09-21 T+14d Decision
           → ❌ 대체. NEXT = Caddy access-log observability READ-ONLY discovery/설계
09-17 §19  "현재 시각이 09-21 13:30 이전인가 이후인가" 날짜 분기
           → ❌ 대체. Decision 은 완료된 과거 작업이며 분기 자체가 사라졌다 (6단계 순서)
```

**결정으로 닫힌 것 — 미실행 후보로 쓰지 않는다**

```
OBSERVATION_HISTORY housekeeping   ✅ commit fc611e1 에서 실행 완료. 다시 열지 않는다
HANDOFF-20260921.md                생성하지 않기로 결정 (§17 + SESSION-HANDOFF 로 인계 완결)
SESSION-HANDOFF → GPT-HANDOFF 포인터  추가하지 않기로 결정 (두 문서의 독자가 다르다)
```

**보존** — `docs/GPT-HANDOFF-2026-09-17.md` 는 저장소에 그대로 둔다. 삭제·소급 수정하지
않으며, 위 5개 절만 "현재 지시가 아님" 으로 읽는다. 그 앞 세대 2026-09-01 핸드오프는
채팅 기록으로만 존재하며 파일을 소급 생성하지 않는다.

## 참조 정본

```
현재 판정 정본   docs/worklogs/STAGE1-DISCOVERY-T0-20260907.md  (§17 = 현재 판정)
판단·gate·NEXT   docs/SESSION-HANDOFF.md
CC 최종 좌표     docs/handoff/HANDOFF-20260907.md · HANDOFF-20260901.md
RT-2             RT2-PRODUCTION-DEPLOYMENT-20260901.md · RT2-POST-LAUNCH-AUDIT-20260901.md
                 RT2-ARRIVAL-CARD-DESIGN-20260901.md · RT2-STABILITY-FOLLOWUP-20260907.md
RT-1             REALTIME-TRANSIT-RT1-NIGHT-20260901.md
Stage 1          STAGE1-STOP-PAGES-DEPLOYMENT-20260827.md
Stop URL 정책    docs/strategy/STOP-URL-POLICY-20260826.md
```
