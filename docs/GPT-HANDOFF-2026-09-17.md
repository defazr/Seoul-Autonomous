# GPT HANDOFF — SEOUL AUTONOMOUS — 2026-09-17

> 이 문서는 **2026-09-01 GPT용 핸드오프를 대체한다.** 그 09-01 핸드오프는
> **채팅 기록으로만 존재하며 저장소에는 별도 파일이 없다** — 소급 생성하지 않는다.
> 계약·금지선·보존 원칙은 이 문서에 승계됐고, **§10 다음 작업 순서**와
> **§17 새 세션 첫 행동**은 폐기됐다. 무엇이 왜 바뀌었는지는 이 문서 §20 에 있다.
>
> 새 세션에는 **이 문서 하나면 된다.** 세부 구현 근거가 필요하면 그때
> `docs/handoff/HANDOFF-20260901.md`(CC 최종 좌표·구현/QA 구조)를 추가로 받는다.

---

## 0. 이 핸드오프의 목적

이 프로젝트는 이미 긴 검증·배포 과정을 거쳤다.
**이전 결정을 처음부터 다시 검토하거나 재설계하지 말 것.**

현재 목적은 단 하나다.

```
2026-09-21 13:30 KST 전후 · Stage-1 discovery T+14d Decision
그때까지 전면 동결. 그 자리에서 RT-2 확대 GO/HOLD 와 AdSense GO/HOLD 를
서로 독립적으로 판단한다.
```

RT-1·RT-2 는 닫혔고, RT-2 stability follow-up 도 닫혔고, Search Console 감사는
**이미 진행 중**이다. 새로 열 것이 없다.

---

## 1. 현재 상태 — 한눈에

```
implementation / deployment round   none
observation axis                    ACTIVE — Stage-1 discovery (T0 2026-09-07 13:28 KST)

Stage-1 discovery 판정               DISCOVERY STARTED
decision anchor                     T0 2026-09-07 · 14/14 UNKNOWN (불변)
anchor 대비 UNKNOWN 이탈              12 / 14
현재 snapshot                        Discovered 12 / UNKNOWN 2
lastCrawlTime                       0 / 14        ← T0 포함 5회차 전부
Crawl                               NOT OBSERVED
Crawled / Indexed progression       NOT OBSERVED
AdSense                             HOLD

NEXT                                2026-09-21 13:30 KST 전후 T+14d Decision  ← 유일
그 전까지                             전면 동결 · 외부 write 0
```

Git / Production 좌표

```
Git local / origin           새 세션 시작 시 동적 확인 — 절대 SHA 를 기대값으로 pin 금지
  필수 조건                   local HEAD == origin/main · ahead/behind 0/0
  ※ 이 handoff 작성 직전 base 는 fc611e1 이었으나 기대 SHA 로 pin 하지 않는다
     (이 문서를 commit 하는 순간 HEAD 가 전진하므로 pin 하면 즉시 낡는다)
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

## 9. Stage-1 Search Console discovery — 현재 진행 축 ★

**이것이 지금 유일하게 살아 있는 축이다.** 코드 작업이 아니라 observation-only 이며
실험 변수는 전면 동결이다.

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
```

**lastCrawlTime 은 T0 포함 5회차 전부 0/14.** Crawled/Indexed 도 0/14.

sitemap

```
lastSubmitted    2026-09-07 13:28 KST   (재제출 0회)
lastDownloaded   09-07 13:28 → 09-08 16:55 → 09-14 14:02 → 09-17 변동 없음
reported URLs    69     errors/warnings 0/0     contents indexed 0
```

### 9.3 해석 금지선 — 반드시 지킬 것

```
허용 표현   "Search Console 이 두 시점에 서로 다른 coverageState 를 보고했다"
🚫 금지     "발견이 취소됐다" · "discovery 가 후퇴했다" · "나빠졌다" ·
            "페이지 결함이 생겼다" · "내부 파이프라인이 되돌아갔다"
```

- **snapshot 총계 변화를 선형 진전·후퇴로 판정하지 않는다.** 전체 판정의 비교 대상은
  직전 회차가 아니라 **decision anchor(T0)** 다 → 현재 12/14.
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
comparison baseline    러너가 출력하는 직전 이력 (2026-09-17 housekeeping 후 09-17 을 가리킨다)
official previous      2026-09-17 T+10d
decision anchor        2026-09-07 T0 · 14/14 UNKNOWN   ← 전체 판정은 항상 이 축
```

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

다음 판단 시점은 **늦어도 2026-09-21 T+14d Decision.** 그 전에 lastCrawlTime 또는
Indexed progression 이 의미 있게 발생하면 조기 재판정할 수 있다.

---

## 11. 다음 작업 순서 ★ — 09-01 §10 을 대체한다

```
STEP 1   2026-09-21 13:30 KST 전후 · T+14d Decision   ← 유일한 NEXT
STEP 2   그 결과로 RT-2 확대 GO/HOLD 를 판단  ┐ 서로 독립. 같은 결정이 아니다
STEP 3   그 결과로 AdSense GO/HOLD 를 판단    ┘ 입력(discovery·crawl 결과)만 공유
```

**🚫 "색인 정상 → 7-stop 확장 우선 → 그 뒤 재신청 판정" 이라는 직렬 순서는 폐기됐다.**
(2026-09-14 확정. 09-01 기록은 역사로 보존하되 현재 지시로 읽지 않는다.)

**🚫 AdSense 승인·거절이 RT-2 확대 여부를 자동으로 결정하지 않는다.** 거절 시에도
"거절했으니 확대 금지" 로 연결하지 않고 거절 원인과 제품 가치를 각각 본다.

RT-2 확대도 **두 축을 따로** 판단한다 — ① 한국어 나머지 6 Stop ② 영어 realtime.

### 09-21 Decision 에서 볼 것

```
제1  lastCrawlTime 발생 건수   0/14 = "첫 crawl 기록 미확인" · 1건 이상 = CRAWL STARTED
제2  coverageState aggregate snapshot (개별 URL 연속 추세 판정 금지)
제3  verdict
제4  Crawled/Indexed 계열 progression
```

0/14 가 유지되면 다음 단계 후보를 **그때 별도 판단**한다.

```
후보 ① Caddy access-log observability 라운드
       (6도메인·9컨테이너 공유 Caddy · 운영 사고 이력 영역 — validate→reload + 별도 승인 필수)
후보 ② discovery/crawl 촉진 수단에 대한 READ-ONLY 설계 검토
```

**🚫 route recrawl · Request Indexing · sitemap 재제출 · 내부링크 변경은 어느 경우에도
자동 실행하지 않는다.** 별도 GPT 판단 + 사용자 승인 없이 외부 write 금지.

---

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
09-17 anchor 대비 이탈 12/14 를 자동 고정하는 회귀 테스트 추가
                                      — 별도 hardening 후보, 현재 미실행
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

## 19. 새 세션 첫 행동 ★ — 09-01 §17 을 대체한다

**판단할 질문은 하나뿐이다.**

```
현재 시각이 2026-09-21 13:30 KST 이전인가, 그 시각 이후인가?
```

**이전이면** — 완전 동결. 아무것도 구현하지 않고 아무 지시서도 쓰지 않는다.
관측도 하지 않는다 (다음 실제 URL Inspection 은 09-21 한 번뿐이며,
그 전에 호출하면 예정에 없던 회차가 생긴다).

**2026-09-21 13:30 KST 이후면** — T+14d Decision 라운드를 연다.
순서는 ① 오프라인 QA 26/26 PASS 선행 ② READ-ONLY 관측 ③ 판정 ④ 정본화.
그날은 13:30 KST 에 가깝게 시작한다 (T+14d 기준을 깔끔히 유지).
관측·판정·기록·도구 정리를 한 라운드에 섞지 않는다.

**🚫 어느 경우에도 RT-2 7-stop 확장 · RT-3 · EN realtime · AdSense 재신청 ·
stability follow-up 재감사 를 먼저 시작하지 않는다.**

세션 시작 절차 (CC 쪽)

```
1  cd web && node scripts/project-status.mjs      ← 좌표 실측 (git·문서 존재만. 네트워크 0)
2  docs/SESSION-HANDOFF.md                        ← 판단·gate·NEXT 정본
3  docs/worklogs/STAGE1-DISCOVERY-T0-20260907.md  ← 최상위 정본
   현재 판정 정본 = §16 · 현재 관측 계약 = §16.7
   §0·§8·§13·§14·§15 는 당시 기록이며 Superseded — 현재 지시로 읽지 않는다
```

---

## 20. 09-01 핸드오프와 무엇이 달라졌나 (2026-09-01 → 2026-09-17)

**유효 그대로** — §1~§9, §11~§16 의 RT-1/RT-2 계약, 운영 계약, 보존 원칙, 협업 방식.
내용이 정확하며 지금도 구속력이 있다.

**폐기·대체**

```
09-01 §10 STEP 1  RT-2 stability follow-up 지시
                  → ✅ 2026-09-07 완료. 재실행 금지. (이 문서 §9.1)
09-01 §10 STEP 2  "9월 중순 Search Console 감사" 가 최우선
                  → 이미 진행 중. T0 09-07 이후 5회차 관측 완료. (이 문서 §9.2)
09-01 §10 STEP 3~5  "색인 정상 → 7-stop 확장 우선 → 그 뒤 AdSense 판정" 직렬 순서
                  → ❌ 폐기. RT-2 확대와 AdSense 는 독립 gate. (이 문서 §11)
09-01 §17         "RT-2 배포한 지 며칠 지났는가" 를 먼저 판단
                  → ❌ 대체. 판단 질문은 "오늘이 09-21 이전인가 이후인가". (이 문서 §19)
```

**새로 추가** — §9 Stage-1 discovery 관측 축 전체(이력·금지선·서버로그 조사·도구),
§11 독립 gate 구조, §17 backlog, §19 단일 분기 첫 행동.

**2026-09-01 GPT용 핸드오프는 채팅 기록으로만 존재하며 저장소에는 별도 파일이 없다.**
새 역사 파일을 소급 생성하지 않는다. 해당 핸드오프의 계약·금지선은 이 09-17 정본에
승계됐고, 위 4개 날짜 종속 지시는 superseded 상태다.

---

## 참조 정본

```
현재 관측 정본   docs/worklogs/STAGE1-DISCOVERY-T0-20260907.md  (§16 = 현재 판정)
판단·gate·NEXT   docs/SESSION-HANDOFF.md
CC 최종 좌표     docs/handoff/HANDOFF-20260907.md · HANDOFF-20260901.md
RT-2             RT2-PRODUCTION-DEPLOYMENT-20260901.md · RT2-POST-LAUNCH-AUDIT-20260901.md
                 RT2-ARRIVAL-CARD-DESIGN-20260901.md · RT2-STABILITY-FOLLOWUP-20260907.md
RT-1             REALTIME-TRANSIT-RT1-NIGHT-20260901.md
Stage 1          STAGE1-STOP-PAGES-DEPLOYMENT-20260827.md
Stop URL 정책    docs/strategy/STOP-URL-POLICY-20260826.md
```
