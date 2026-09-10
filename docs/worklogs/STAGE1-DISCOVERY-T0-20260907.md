# Stage-1 Discovery — Preflight + sitemap T0 (2026-09-07)

> 정본 1건. preflight 결과와 T0 개입 기록을 분리하지 않는다 —
> 관측 계약이 두 파일로 갈리면 다음 세션이 어느 쪽을 기준으로 볼지 모호해진다.
> 선행 정본: `RT2-STABILITY-FOLLOWUP-20260907.md` · `STAGE1-STOP-PAGES-DEPLOYMENT-20260827.md`

---

## 0. 판정

```
Stage-1 Search Console Gate
FAIL — NOT DISCOVERED

Discovery intervention T0
SUCCESS

sitemap axis
OPEN / REFRESHED

RT-2
CLOSED / Production Live Approved 유지
```

**"색인 거절"이 아니라 "발견 실패"다.** 두 상태는 대응이 전혀 다르다 —
색인 부진은 품질·중복 신호를 의심하지만, 발견 실패는 크롤 경로 문제다.
우리 페이지의 색인 가능성에는 고칠 결함이 없다(§2).

게이트는 원래 2026년 9월 중순 예정이었으나 **2026-09-07 실측으로 조기 개방·판정 완료**했다.

> **⚠ Superseded 2026-09-09 — §13 참조.**
> 위 `FAIL — NOT DISCOVERED` 는 **T0(2026-09-07) 당시 사실**이며 삭제·수정하지 않는다.
> 당시 14/14 가 `URL is unknown to Google` 이었으므로 정확한 역사 기록이다.
> 2026-09-09 08:14 KST(T+42.8h) 관측에서 10/14 가 UNKNOWN 을 벗어나,
> 현재 Stage-1 discovery 상태는 **`DISCOVERY STARTED`** 로 갱신됐다.

---

## 1. 게이트 실측 — 14/14 unknown

URL Inspection API, Stage-1 Stop URL 14건 전수:

```
coverageState   14/14  URL is unknown to Google
verdict         14/14  NEUTRAL
lastCrawlTime   14/14  없음 (크롤 이력 0)
GSC impressions 08-27~09-06  /stops/ 필터 = 0건
```

출시 2026-08-27 이후 11일째 상태다.

**도구 오탐이 아니다 — 대조군이 정상이다:**

```
/ko/night-bus-map          Submitted and indexed   crawl 2026-09-04
/ko/routes                 Submitted and indexed   crawl 2026-09-03
/ko/routes/saebyeok-a741   Submitted and indexed   crawl 2026-08-04
```

구글은 이 사이트를 지금도 크롤하고 있다. **새 URL만 못 찾고 있다.**

---

## 2. Live indexability — 14/14 PASS

| 항목 | 결과 |
|---|---|
| HTTP status | 14/14 = 200 |
| redirect | 14/14 = 0회 |
| canonical | 14/14 자기 URL과 정확 일치 |
| meta robots `noindex` | 14/14 없음 |
| `X-Robots-Tag` | 14/14 없음 |
| robots.txt 차단 | 없음 (`Allow: /`, Disallow 0, Sitemap 지시자 정상) |
| sitemap `<loc>` | 14/14 각 1건 |
| `<h1>` | 14/14 = 1개 |
| 본문 실체 | 57–65KB · H2 4~6 · JSON-LD 2 · 정상 렌더 |

**hreflang은 2계층으로 분리해 기록한다** (단일 PASS/FAIL 로 뭉치면 오독된다):

```
sitemap 계층   14/14 각 <url> 에 xhtml:link 대체 2건(ko·en) 존재 → 선언됨
HTML 계층      14/14 hreflang 링크 0
               회귀 아님 — next-intl alternateLinks:false 사이트 전역 기존 설정.
               /ko/routes · /en/routes · 01010 등도 동일하다.
```

**도구 오탐 1건 배제 기록**: 초기 스캔에서 `404` 문자열이 14/14 매치됐으나,
실물은 Next.js 가 모든 페이지 RSC 페이로드에 심는 `notFound` 템플릿이었다.
대조군 확인 — 미승인 `/ko/stops/99999-fake` 는 **진짜 404** 를 반환하고,
승인 페이지는 `<h1>광화문역` + H2 6개가 정상 렌더된다.

**budget 무소비 증명**: preflight 20회 fetch 전후 Production `[rt2] upstream call` 누적
**7 → 7, 변화 0.** 서버 사이드 렌더는 upstream 을 태우지 않는다.

---

## 3. 내부 발견 경로 — 구조는 PASS, 크롤 시점이 문제

Stop 링크는 실제 crawlable `<a href>` 이며 JS 전용이 아니다.
`getApprovedStopPath()` 로 생성되고 canonical 경로와 정확히 일치한다.

| route 페이지 | KO | EN | 마지막 크롤 |
|---|---|---|---|
| saebyeok-a160 | 7건 | 7건 | 2026-08-02 |
| saebyeok-a741 | 5건 | 5건 | 2026-08-04 |
| simya-a21 | 7건 | 7건 | 2026-08-16 |

합집합 = **7 Stop 전부 · KO/EN 14 URL 전부 도달 가능.** 링크 구조에 결함 없음.

**그러나 셋 다 마지막 크롤이 Stop 출시(08-27) 이전이다.**
반대로 최근 크롤된 페이지에는 Stop 링크가 없다:

```
/ko/night-bus-map   crawl 2026-09-04   stop 링크 0
/ko/routes          crawl 2026-09-03   stop 링크 0
/ko · /en/routes                       stop 링크 0
```

즉 **구글이 최근 방문한 페이지에는 Stop 링크가 없고,
Stop 링크가 있는 페이지는 최근 방문하지 않았다.**

---

## 4. sitemap stale 실측 (T0 이전)

```
GSC 기록
  lastSubmitted   2026-06-14
  lastDownloaded  2026-06-14   (85일 전)
  reported URLs   50
  errors 0 · warnings 0 · isPending false

Production 실물
  HTTP 200 · application/xml · 25,275 bytes
  current URLs 69 · Stop <loc> 14
  robots Sitemap 지시자 정상
```

**사용 금지 문장**: "Google 이 6월 sitemap 만 봤기 때문에 Stop URL 을 못 찾았다."
인과는 미증명이다.

**정확한 표현**:

> sitemap refresh 가 2026-06-14 이후 관측되지 않았고, Stop 링크가 있는 route 페이지
> 또한 Stop 출시 전 마지막 크롤 상태다. 따라서 **두 주요 discovery path 가 모두
> stale 한 것이 현재 가장 강한 원인 후보**다.

preflight 로 **세 번째 축(우리 쪽 결함)은 배제됐다** — §2·§3 전항 PASS.

---

## 5. GA4 — 기존 WATCH 해소

```
/ko/stops/01009   08-27 views 3 / users 2
                  09-01 views 17 / users 4   (RT-2 배포일 QA)
                  09-02~09-07 views 0
전체 /stops/       09-02~09-07 = 1 view
사이트 전체         일 19~35 views / 13~22 users (정상 유입 지속)
```

**해석**: 09-02 이후 RT-2 upstream 0 은 해당 Stop 페이지의 실제 방문이 사실상
없었던 것과 일치한다. **기능 결함 증거가 아니다.**

`RT2-STABILITY-FOLLOWUP-20260907.md` §6 의 당시 판단("판별 불가")은 그 시점에는
정확했다. 원문은 보존하고 `Resolved by GA4 follow-up` 주석으로 연결한다.

---

## 6. T0 개입 기록

### 6-1. 첫 시도 — 실패 (숨기지 않는다)

```
sitemaps.submit attempt #1
2026-09-07 13:25:15 KST
HTTP 403  ACCESS_TOKEN_SCOPE_INSUFFICIENT
state change = 0

원인: readonly OAuth scope 사용 (webmasters.readonly)
      property 권한 거부가 아니다 — 서비스 계정은 siteOwner 였다.
```

인증 계층에서 막혀 submit 로직에 도달하지 않았고, GSC 상태는 전혀 변하지 않았다.
제품/GSC 상태를 바꾼 실패는 아니지만 **운영 기록으로 남긴다.**

교훈: 쓰기 API 는 **property 권한과 OAuth scope 두 축을 모두** 확인해야 한다.

### 6-2. 성공 — 정확히 1회

```
sitemaps.submit successful write   정확히 1회
2026-09-07 13:28:05 KST
HTTP 204 (본문 0 bytes)

scope     https://www.googleapis.com/auth/webmasters (TTL 600초)
보관       프로세스 메모리 전용 — 디스크·repo·docs 저장 0
allowlist  property/sitemap 하드코딩 가드, 불일치 시 실행 차단
다른 GSC property write  0건
```

### 6-3. 즉시 결과 — 3개 지표 갱신

| 지표 | T0 이전 | T0 이후 |
|---|---|---|
| `lastSubmitted` | 2026-06-14T10:11:27 | **2026-09-07T04:28:06Z (13:28 KST)** |
| `lastDownloaded` | 2026-06-14T10:11:29 | **2026-09-07T04:28:08Z (13:28 KST)** |
| `reported URLs` | 50 | **69** |
| errors / warnings | 0 / 0 | 0 / 0 |
| isPending | False | False |

계약상 "즉시 안 변해도 실패 아님" 이었던 두 값이 **2초 만에 갱신**됐다.

---

## 7. 신호 분리 — ①② 를 ③ 으로 읽지 않는다

```
① lastDownloaded 갱신       확인됨 — Google 이 sitemap 을 다시 가져갔다
② reported URLs 50 → 69     확인됨 — 현재 URL 수가 GSC 처리 결과에 반영됐다
③ 14 URL UNKNOWN 탈출        미확인 — Stage-1 discovery 가 시작된 신호
```

**성공 기준은 "색인됨" 이 아니라 "14개 중 하나라도 Google 이 존재를 알아차렸는가" 다.**

---

## 8. 관측 계약

T0 기준시각 **2026-09-07 13:28 KST**

| 체크포인트 | 시각 | 성격 |
|---|---|---|
| Checkpoint 1 | 2026-09-08 13:30 KST 전후 (T+24h) | 변화 감지용 (판정 아님) |
| Checkpoint 2 | 2026-09-10 13:30 KST 전후 (T+72h) | 변화 감지용 (판정 아님) |
| Decision | 2026-09-14 13:30 KST 전후 (T+7d) | 두 번째 축 개방 여부 결정 |

각 체크포인트 READ-ONLY 항목:

```
sitemap lastDownloaded · reported URLs · errors/warnings
Stage-1 14 URL: coverageState · verdict · lastCrawlTime
(가능하면) Stop URL impressions
```

**14 URL Inspection 은 각 URL 1회만.** 반복 호출하지 않는다.

### 판정 계약

```
한 URL이라도 UNKNOWN 탈출 (또는 lastCrawlTime 최초 발생)
  → DISCOVERY STARTED 판정. 추가 조치 없음. 나머지도 그대로 관측.
    indexed 까지 즉시 요구하지 않는다.

T+24h 에 14/14 UNKNOWN
  → 정상 관측 범위. 추가 외부 조치 금지. FAIL 을 새로 선언하지 않는다.

T+72h 에 14/14 UNKNOWN
  → WATCH 유지. route 재크롤·Request Indexing 실행 금지.

T+7d 에도 14/14 UNKNOWN
  → 그때 처음 "sitemap axis refreshed but Stage-1 discovery absent" 로 확정하고
    두 번째 discovery 축을 연다. 후보 = Stop 링크 보유 route 상세 3개
    (saebyeok-a160 · saebyeok-a741 · simya-a21) 의 출시 이후 미재크롤 문제.
    T+7d 에도 자동 실행하지 않고 별도 판단을 받는다.
```

> **⚠ 관측 계약 갱신 2026-09-09 — §13 이 대체한다.**
> 위 계약의 `T+7d 에도 14/14 UNKNOWN → 두 번째 discovery 축 개방` 조건은
> **더 이상 성립하지 않는다** (T+42.8h 에 10/14 discovery 확인).
> T+72h·T+7d 의 우선 관측 신호와 Decision 기준은 §13 을 따른다.
> 원문은 T0 당시 계약의 역사 기록으로 보존한다.

---

## 9. 외부 변경 동결

다음 관측 전까지 금지:

```
sitemap 재제출 추가 · 14 URL Request Indexing · route 페이지 재크롤 요청 ·
내부링크 변경 · sitemap 구조 변경 · RT-2 6-stop 확장 · RT-3 · EN realtime ·
observability 코드 · AdSense 재신청 · GSC/GA4 설정 변경
```

**현재부터 실험 변수는 고정한다.**

---

## 10. AdSense — 재해석 금지

```
3차 재신청   2026-08-11
Stop 출시    2026-08-27
```

**Stage-1 14 URL 미발견은 3차 거절의 원인이 될 수 없다.** 당시 존재하지 않았다.

또한 `Search Console sitemap lastDownloaded` 를 `AdSense 심사 크롤러가 본 사이트 범위`
와 동일시하지 않는다.

허용되는 해석은 여기까지다:

> Google Search discovery 측에서 6월 이후 추가 URL 발견이 충분히 갱신되지 않은
> 정황이 확인됐다. 이는 향후 AdSense 재신청 전에 닫아야 할 SEO/발견 문제이지만,
> 과거 AdSense 거절의 직접 원인으로는 미증명이다.

06-14~08-11 사이 Round 21·22·25-E·25-F 가 콘텐츠를 추가했으므로 증가분은 존재하나,
**08-11 시점의 정확한 URL 수는 이 라운드에서 확정하지 않았다. 추정치를 쓰지 않는다.**

---

## 11. 보안 backlog (이번 라운드와 분리)

```
서비스 계정 키가 다수 GSC property 의 owner 권한 보유
+ 로컬 ~/Downloads 에 평문 JSON 존재
→ 장기적으로 seoulautonomous.com 전용 계정 또는 최소 권한 구조 검토 가치 있음
```

이번 discovery 라운드에서 교체·권한 변경·이동을 하지 않는다. repo 복사·키 출력 금지.

---

## 12. CC 이견 및 아이디어

**이견 1 — 즉시 갱신 자체가 새 정보다.** 계약은 "`lastDownloaded` 가 즉시 안 바뀌어도
실패 아님" 이었는데 실제로는 2초 만에 재수집됐다. 이는 구글이 이 sitemap 을 **가져오지
못하고 있던 게 아니라, 가져갈 신호가 없었다**는 쪽을 시사한다. 접근성 문제였다면 지금도
실패했어야 한다. 다만 **단정하지 않는다** — 제출 트리거에 의한 즉시 fetch 와 평상시 자동
재수집 주기는 다른 메커니즘이고, 6월 이후 자동 재수집이 왜 없었는지는 여전히 미증명이다.

**이견 2 — B분기 판정이 더 깨끗해졌다.** sitemap 축이 확실히 열렸으므로, 이후 14 URL 이
계속 unknown 이면 그것은 두 번째 축(route 페이지 미재크롤)의 비중을 강하게 지지한다.
관측기간을 재다운로드 시점 기준으로 잡은 판단이 옳았고, **그 기준시각이 2026-09-07
13:28 KST 로 확정**됐다.

**이견 3 — CC 자체 오류 1건 기록.** 승인 요청 단계에서 `permissionLevel: siteOwner` 만
확인하고 OAuth scope 를 점검하지 않아 첫 submit 이 403 으로 실패했다. 상태 변화는 0이라
실험은 훼손되지 않았으나, 원인은 CC 의 준비 부족이다.

**아이디어** — §3 이 사실이라면, 재제출과 별개로 **최근 크롤되는 페이지에 Stop 진입 경로가
하나도 없다**는 구조가 남는다. 코드 변경 사안이므로 이번에 착수하지 않으며, T+7d 판정
이후 후보로만 남긴다.

---

## 13. T+42.8h follow-up — DISCOVERY STARTED (2026-09-09)

> 이 절은 §0 판정과 §8 관측 계약을 **대체(supersede)** 한다.
> 두 절의 원문은 수정하지 않는다 — T0 시점의 정확한 역사 기록이기 때문이다.

### 13.1 판정 갱신

```
Stage-1 discovery 상태
DISCOVERY STARTED

T0(2026-09-07) 판정   FAIL — NOT DISCOVERED   ← 당시 사실. 삭제·수정하지 않는다
2026-09-09 관측        위 상태를 Superseded
```

읽는 법은 이 한 문장이다:
**"T0 에서 FAIL — NOT DISCOVERED 였으나, 2026-09-09 후속 관측에서 DISCOVERY STARTED 확인."**

"T0 판정이 틀렸다"가 아니다. T0 시점 14/14 는 실제로 `URL is unknown to Google` 이었고,
그 측정과 판정은 지금도 유효한 기록이다.

### 13.2 실측 — 2026-09-09 08:14 KST (T+42.8h)

sitemap

```
lastSubmitted    2026-09-07 13:28 KST    변동 없음 (재제출 0회)
lastDownloaded   2026-09-08 16:55 KST    T0 이후 자동 재수집 1회 추가 발생
reported URLs    69                      유지
errors/warnings  0 / 0
contents         web submitted 69 / indexed 0
```

URL Inspection — Stage-1 14 URL 전수, 각 URL 1회

```
Discovered - currently not indexed   10 / 14
URL is unknown to Google              4 / 14
lastCrawlTime                         0 / 14   (전건 없음)
verdict                              14 / 14   NEUTRAL
```

잔여 UNKNOWN 4건

```
/en/stops/01007-seoul-museum-of-history-gyeonghuigung-palace
/en/stops/01008-seoul-museum-of-history-gyeonghuigung-palace
/en/stops/01009-gwanghwamun-station
/ko/stops/01007-seoul-museum-of-history-gyeonghuigung-palace
```

검색 성과

```
/stops/ impressions   0             (2026-08-27 ~ 09-08)
사이트 전체 대조군      18 impressions / 11일   ← 사이트 자체는 정상 노출 중
```

외부 변경 — 전부 0

```
GSC write 0 · sitemap 재제출 0 · Request Indexing 0 · route 재크롤 요청 0
제품 코드 0 · Production 0
발급 scope = webmasters.readonly 단독 (쓰기 scope 미발급)
```

### 13.3 해석 — 넘지 않는 4개 선

1. **DISCOVERY STARTED 는 "색인 시작"이 아니다.**
   Google 이 URL 의 **존재를 인식하기 시작했다**는 뜻까지다.

2. **아직 크롤은 시작되지 않았다.**
   근거 = `lastCrawlTime` 14/14 없음. 발견 → 크롤 → 색인 중 **첫 단계만** 넘었다.

3. **인과 순서는 확정하지 않는다.**
   09-08 16:55 자동 재다운로드가 discovery 를 만든 것인지, T0 fetch 가 이미 만든 것을
   오늘 처음 관측한 것인지 구분할 수 없다 — T+24h 중간 체크포인트를 관측하지 않았기
   때문이다. 어느 쪽이든 **sitemap 축이 열렸다는 결론은 같다.**

4. **잔여 4 URL 의 공통 결함을 추론하지 않는다.**
   §2 preflight 14/14 PASS 를 뒤집을 근거가 아직 없다. 언어로도 stop 으로도 갈리지
   않는다 — 같은 01007 쌍이 ko/en 으로 갈리고, 01009 는 ko 만 전환됐다.

### 13.4 관측 계약 갱신 (§8 대체)

체크포인트 시각은 유지하고 **우선 관측 신호만 교체**한다.

```
T+72h      2026-09-10 13:30 KST 전후   READ-ONLY observation (판정 아님)
Decision   2026-09-14 13:30 KST 전후   T+7d
```

T+72h 우선 관측 신호 — 순서대로

```
1  14 URL 중 lastCrawlTime 이 하나라도 최초 발생했는가
2  잔여 4 UNKNOWN 이 추가로 Discovered 로 전환됐는가
3  Discovered 가 Crawled / Indexed 계열로 진행했는가
```

**indexed 까지 즉시 요구하지 않는다.**

T+7d Decision 갱신

```
폐기   "T+7d 에도 discovery absent → route 미재크롤 두 번째 축 개방"
       → discovery 가 이미 시작됐으므로 조건 자체가 성립하지 않는다.
         2026-09-14 에 route 재크롤을 자동 개방하지 않는다.

대체   Decision 에서 보는 것
       · 14 URL 의 discovery 완료 정도
       · lastCrawlTime 발생 여부
       · Crawled / Indexed 전환 여부
       · 잔여 UNKNOWN 의 지속 여부
       → 그 결과를 보고 다음 원인 조사·외부 조치를 별도 판단한다. 자동 실행 금지.
```

§9 외부 변경 동결은 **그대로 유효**하다. 재제출·Request Indexing·재크롤 요청·
내부링크 변경·sitemap 구조 변경은 계속 금지다.

> **⚠ Decision 기준 갱신 2026-09-10 — §14 참조.**
> 위 "잔여 UNKNOWN 의 지속 여부" 는 **개별 URL 추세 지표로 쓰지 않는다.**
> T+72.6h 관측에서 coverageState 가 URL 단위로 양방향 변동함이 실측됐다.
> T+7d 제1 판정 입력은 **lastCrawlTime 발생 건수**이며, coverageState 는
> 그 시점 aggregate snapshot 으로만 기록한다. 원문은 09-09 당시 계약으로 보존한다.

### 13.5 이번 갱신에서 하지 않은 것

```
제품 코드 수정 · GSC/GA4 write · sitemap 재제출 · Request Indexing · route 재크롤 요청
Production 변경 · RT-2 확장 · RT-3 · EN realtime · AdSense 재신청 · backlog 정리
commit · push        ← 별도 승인 대기 (이번 라운드에서 실행하지 않는다)
```

### 13.6 CC 이견 및 아이디어 (T+42.8h 시점)

**이견 1 — §12 이견 2 를 여기서 뒤집어 기록한다.** T0 당시 CC 는 "이후에도 14 URL 이
unknown 이면 두 번째 축(route 미재크롤)을 강하게 지지한다"고 적었다. 그 전제 자체가
소멸했다 — 10/14 가 sitemap 축만으로 발견됐다. §12 원문은 **당시 판단으로 보존**하되,
현재 유효한 것은 §13.4 다.

**이견 2 — T+24h 를 놓친 실제 손실은 인과 구분 하나다.** 실험은 훼손되지 않았고 판정도
가능했다. 다만 §13.3-3 을 영구히 미확정으로 남기게 됐다. 이후 라운드에서 관측
체크포인트는 "놓쳐도 되는 것"이 아니라 **인과를 사는 비용**으로 취급한다.

**아이디어 없음** — 관측 대기 국면에서 제안은 변수만 늘린다. §12 아이디어(최근 크롤
페이지에 Stop 진입 경로 0)는 여전히 후보로만 남기며, Decision 이후에 다시 본다.

---

## 14. T+72.6h observation — DISCOVERY STARTED 유지 / CRAWL NOT OBSERVED (2026-09-10)

> §13.4 의 Decision 기준을 **대체**한다. §0·§8·§13 원문은 소급 수정하지 않는다.

### 14.1 판정

```
Stage-1 discovery      DISCOVERY STARTED   유지
Crawl                  NOT OBSERVED
Indexed progression    NOT OBSERVED
```

판정 문구는 다음 취지로 쓴다:
**"DISCOVERY STARTED 유지. T+72.6h 기준 Search Console 에서 첫 crawl 기록은 확인되지 않았다."**

이번 회차를 **NO CHANGE 라고 부르지 않는다** — coverageState 에 실제 변동이 있었다.

### 14.2 실측 — 2026-09-10 14:01 KST (T+72.6h)

sitemap

```
lastSubmitted    2026-09-07 13:28 KST    그대로 (재제출 0회)
lastDownloaded   2026-09-08 16:55 KST    09-09 관측과 동일 — 추가 재수집 없음
reported URLs    69                      유지
errors/warnings  0 / 0                   contents indexed 0
```

coverageState 총계 — **그 시점 aggregate snapshot 으로만 기록한다**

```
2026-09-09 T+42.8h    Discovered 10 / UNKNOWN 4
2026-09-10 T+72.6h    Discovered  9 / UNKNOWN 5
lastCrawlTime          0 / 14   (양 회차 모두)
```

14 URL 변동 내역 — 3 + 4 + 1 + 6 = 14 (합계 검증 PASS)

```
UNKNOWN → Discovered   3건
  /en/stops/01007-seoul-museum-of-history-gyeonghuigung-palace
  /en/stops/01008-seoul-museum-of-history-gyeonghuigung-palace
  /ko/stops/01007-seoul-museum-of-history-gyeonghuigung-palace

Discovered → UNKNOWN   4건
  /en/stops/01013-jongno-2-ga
  /en/stops/01014-jongno-2-ga
  /ko/stops/01010-gwanghwamun-station
  /ko/stops/01019-jongno-5-o-ga-gwangjang-market

그대로 UNKNOWN         1건
  /en/stops/01009-gwanghwamun-station

그대로 Discovered      6건
  /en/stops/01010-gwanghwamun-station
  /en/stops/01019-jongno-5-o-ga-gwangjang-market
  /ko/stops/01008-seoul-museum-of-history-gyeonghuigung-palace
  /ko/stops/01009-gwanghwamun-station
  /ko/stops/01013-jongno-2-ga
  /ko/stops/01014-jongno-2-ga
```

검색 성과

```
/stops/ impressions   0        (2026-08-27 ~ 09-09)
사이트 전체 대조군      18 impressions / 12일
```

외부 변경

```
GSC write 0 · sitemap 재제출 0 · Request Indexing 0 · route 재크롤 요청 0
제품 코드 0 · Production 0 · URL Inspection 각 URL 정확히 1회 (총 14회)
발급 scope = webmasters.readonly 단독
```

### 14.3 해석 — 넘지 않는 선

우리가 실측한 것은 **Search Console 이 두 관측 시점에 서로 다른 coverageState 를
보고했다**는 것까지다. 다음 해석은 **하지 않는다**:

```
🚫 "Google 이 발견을 취소했다"
🚫 "discovery 가 후퇴했다"
🚫 "내부 파이프라인이 실제로 되돌아갔다"
```

개별 URL 의 내부 실제 상태 변화 원인은 **미확정**으로 둔다.
중요한 것은 9냐 10이냐가 아니라 **T0 의 발견 0 상태에서 벗어났다**는 점이며,
다음 핵심 신호는 **lastCrawlTime 이 여전히 0/14** 라는 사실이다.

§13.3-4("잔여 4건의 공통 결함을 추론하지 않는다")는 **결과적으로 옳았다** —
그 4건 중 3건이 이번에 Discovered 로 전환됐다. 당시 결함을 추론했다면 오답을
정본에 박아넣었을 것이다.

### 14.4 이번 회차 기록 품질

**T+72h 체크포인트 기록 품질 = 부분 불완전(partially incomplete).**

```
coverageState 관측    유효
lastCrawlTime 관측    유효
verdict               미기록
→ 핵심 두 신호는 보존됐으나 계약 필드 하나가 누락된 부분 불완전 기록이다.
```

🚫 "관측 자체는 훼손되지 않았다" 처럼 **전체 관측이 완전했다는 인상을 주는 표현을
쓰지 않는다.** verdict 는 계약 항목이었다.

**verdict = 이번 회차 미기록으로 확정한다.** 관측 스크립트가 계약 필드 3종 중
verdict 를 출력에서 누락했고, 응답을 보존하지 않아 사후 복구가 불가능하다.
URL 당 1회 계약을 지켜 **재조회하지 않았다**(이 판단은 승인됨).
09-09 의 `NEUTRAL` 을 09-10 값으로 **승계하거나 추정하지 않는다.**

**집계 오기 1건 정정.** 최초 구두 보고에서 "그대로 Discovered 6건" 목록에
`/ko/stops/01007-…` 을 잘못 포함시켰다. 이 URL 은 `UNKNOWN → Discovered` 전환
3건에 속하므로 해당 목록에서 제외된다. §14.2 목록이 정확한 값이다.

**무효 출력 명시.** 관측 스크립트의 전일 대비 변화 표시는 결함으로 전건 오작동했고
(§14.5 결함 1), 화면에 찍힌 `?→X 변화` 표기와 `잔여 UNKNOWN 신규 전환 0/4` 줄은
**관측 근거로 사용하지 않았다.** §14.2 의 수치는 원시 coverageState 값을 수정된
도구로 재대조해 산출한 것이다.

### 14.5 관측 도구 수정 (로컬 · 외부 호출 0)

```
결함 1   기준선 키를 15자, 조회 키를 16자로 잘라 비교 → 전건 미매치
         수정: 길이 기반 slice 자체를 제거. urlsplit 으로 얻은 canonical path 를
               기준선·관측 양쪽 키로 사용. 길이 상수를 다른 숫자로 바꾸지 않았다.

결함 2   verdict 필드를 출력에서 누락
         수정: 계약 필드 3종(coverageState·verdict·lastCrawlTime)을 항상 출력.
               응답에 없으면 빈 값으로 메우지 않고 ABSENT/EMPTY/NULL 을 구별한다.
```

fixture QA 10/10 PASS · 외부 API 호출 0 (순수 분석 모듈만 import)

```
1  UNKNOWN → Discovered          6  lastCrawlTime 없음 → ABSENT
2  Discovered → UNKNOWN          7  lastCrawlTime 최초 발생 → CRAWLED 분류
3  상태 동일 → SAME               8  14 URL 입력 → 14 비교 행 · 키 중복 0
4  verdict NEUTRAL 존재          9  [결함1 회귀] 긴 slug 정확 매칭
5  verdict 누락 → ABSENT 구별    10 [결함1 회귀] full URL == path 동일 키
```

### 14.6 Decision 기준 갱신 (§13.4 대체)

```
NEXT   2026-09-14 13:30 KST 전후 (T+7d) Decision
```

제1 판정 입력 = **lastCrawlTime 발생 건수**

```
0 / 14        → "Search Console 기준 첫 crawl 기록 미확인"
1건 이상      → CRAWL STARTED
```

제2 입력 = coverageState. **개별 URL 의 연속 추세로 보지 않는다.**
그 시점의 Discovered / UNKNOWN 총계 snapshot 만 기록한다.
특정 URL 이 UNKNOWN 을 유지했다거나 다시 UNKNOWN 이 됐다는 사실만으로
**페이지 결함을 판정하지 않는다.**

제3 입력 = verdict (정상 수집되면 기록).

제4 입력 = Crawled / Indexed 계열 진행 여부 (별도 기록).

T0 의 14/14 UNKNOWN 은 **최초 기준 상태로 역사적으로 유지**한다. 다만
09-09 의 10/4 와 09-10 의 9/5 차이를 **선형 추세로 해석하지 않는다** —
비교 대상은 어제 숫자가 아니라 T0 의 발견 0 상태다.

```
T+7d 에도 lastCrawlTime 0/14 인 경우
  → route 재크롤을 자동 실행하지 않는다.
  → AdSense HOLD 유지.
  → 다음 외부 write 전에 READ-ONLY 원인조사 여부를 별도 판정한다.
```

**AdSense**: 09-14 에 lastCrawlTime 이 생겨도 그것만으로 자동 GO 가 아니다.
0/14 여도 즉시 무언가를 뜯어고치지 않는다. 어느 쪽이든 HOLD 유지 + 별도 판정.

### 14.7 이번 단계에서 하지 않은 것

```
GSC URL Inspection 재조회 0 · GSC/GA4 외부 호출 0 · write 0
sitemap 재제출 0 · Request Indexing 0 · route 재크롤 요청 0
제품 코드 0 · Production 0 · commit 0 · push 0
```

### 14.8 CC 이견 및 아이디어 (T+72.6h 시점)

**이견 1 — 09-09 의 "10 / 4" 도 확정 사실이 아니라 보고값이다.** 오늘 변동으로
그 숫자의 성격이 드러났다. §13.2 원문은 보존하되, 09-14 판정에서 그 숫자를
**기준선으로 삼지 않는다.** 비교 대상은 T0 의 0 발견 상태다.

**이견 2 — 관측 도구의 보관 위치가 미정이다.** 수정된 도구는 현재 세션
스크래치패드에 있어 **다음 세션에서 사라진다.** repo 편입은 승인 사항이고
이번 라운드는 commit 금지이므로 옮기지 않았다. 09-14 전에 위치를 정해야 한다
(후보: repo `scripts/` 편입 · 미추적 보존 · 매회 재작성).

**이견 3 — 오늘 CC 오류 2건은 모두 측정 도구 결함이었다.** coverageState 와
lastCrawlTime 관측은 유효하지만, verdict 누락으로 **T+72h 체크포인트 기록은
일부 불완전하다**(§14.4). 계약 필드였으므로 이번 회차 기록에 **영구 공백**이 남는다.
원인은 관측 직전에 도구를 점검하지 않은 것이다 — 다음 회차는 실행 전 QA 를 먼저 돌린다.

**아이디어 없음** — 관측 유지 국면이다.

### 14.9 관측 도구 repo 편입 (2026-09-10 · 로컬, 미커밋)

CC 이견 2(도구가 세션 스크래치패드에 있어 다음 세션에서 소실)가 채택돼,
수정된 도구를 **repo 안의 재사용 가능한 운영 도구**로 옮겼다.
기존 `web/scripts/` 관례(Node ESM `.mjs` · 순수 로직은 `lib/*-core.mjs` ·
오프라인 테스트는 `test-*.mjs` · 테스트 프레임워크·신규 dependency 0)를 그대로 따랐다.

```
web/scripts/lib/gsc-discovery-core.mjs    순수 분석 (네트워크 import 0)
web/scripts/observe-gsc-discovery.mjs     GSC 조회 러너 (READ-ONLY)
web/scripts/test-gsc-discovery.mjs        오프라인 fixture 테스트
```

제품 runtime 에서 import 되거나 실행되지 않는다 — `web/app`·`web/lib`·`web/components`
어디에서도 참조 0. 기존 `validate-graph.mjs`·`test-stop-names.mjs` 와 동일한 성격이다.

도구 책임 한계

```
· URL Inspection 응답에서 coverageState · verdict · lastCrawlTime 만 읽는다
· 비교 키는 canonical path. 문자열 길이 slice 금지. 기준선·현재값 동일 함수 통과
· coverageState 변화는 시점 간 보고값 비교로만 표현 — 내부 상태 진전·후퇴 해석 금지
· verdict·lastCrawlTime 은 독립 필드. ABSENT / EMPTY / NULL 구별 보존
· 네트워크부와 순수 분석부 분리 — 테스트는 외부 호출 없이 실행 가능
```

안전 계약 (러너에 하드코딩, 테스트 14~19 로 고정)

```
발급 scope   webmasters.readonly 를 정확히 1개만 허용한다 (exact match)
             · includes('readonly') 식 포함 검사 금지 — 혼합 scope 를 통과시킨다
             · readonly + webmasters write 혼합 → BLOCK
             · webmasters write 단독 → BLOCK
             · readonly + 무관 scope / 빈 값 / 비문자열 → BLOCK
             · 검증 시점 = 토큰 발급·네트워크 요청 **이전**. observe() 진입 즉시 1차,
               getToken() 2차, 서명 직전 3차 — 3중 방어선
property     https://seoulautonomous.com/ allowlist (서비스 계정이 타 5개 속성 소유자)
금지 호출    sitemaps.submit · Request Indexing · URL 당 2회 이상 Inspection
비밀 취급    access token·private key 를 출력·저장하지 않는다. 에러 본문도 찍지 않는다
```

**비교 축 2개를 섞지 않는다** (러너 출력 §0 절 · 테스트 20~22 로 고정)

```
comparison baseline   2026-09-10T14:01+09:00 (T+72.6h)   직전 상태 비교용
decision anchor       2026-09-07T13:28+09:00 (T0)        판정 기준점 · 14/14 UNKNOWN

· 두 값 모두 관측 스냅샷의 역사적 시점이므로 고정 가능하다
  (docs axis SHA 처럼 current-state 로 변하는 값이 아니다)
· 전체 discovery 판정은 anchor 축으로 읽는다. 직전 회차 총계 차이
  (예: 10/4 → 9/5)를 선형 진전·후퇴로 판정하지 않는다
· 실측 예: 09-10 은 baseline 대비 U→D 3건이지만, anchor(T0) 대비로는 이탈 9 / 잔존 5다.
  같은 관측이 축에 따라 다른 숫자를 낳으므로 어느 축인지 항상 명시한다
```

fixture 정책: 공개 URL path 와 `coverageState`/`verdict`/`lastCrawlTime` 만 넣는다.
OAuth token · service account key · authorization header · 원시 응답 전문은 **넣지 않는다.**

오프라인 테스트 26항 전항 PASS (`cd web && node scripts/test-gsc-discovery.mjs`)

```
1~3    UNKNOWN→Discovered · Discovered→UNKNOWN · 동일 상태
4~5    verdict NEUTRAL 존재 · verdict 필드 없음(ABSENT 구별)
6~7    lastCrawlTime 없음 · lastCrawlTime 최초 발생(CRAWL STARTED 판정)
8      14 URL 입력 → 14 비교 행 · 키 중복 0
9~10   [결함1 회귀] 긴 slug 정확 매칭 · full URL == path 동일 canonical key
11·11b [실측 재현] 09-09→09-10 D9/U5 · 3+4+1+6=14 · 집계 오기 회귀 방지
12~13  T0 14/14 UNKNOWN 보존 · latestBaseline() = 09-10
14~15  [안전] readonly scope 상수 · property allowlist 고정
16~19  [scope] readonly 단독 통과 · write 혼합 BLOCK · write 단독 BLOCK ·
       무관 scope/빈 값/비문자열 BLOCK
20~22  [축분리] baseline ≠ anchor · anchor = T0 14/14 UNKNOWN ·
       anchor 대비 이탈 9/14 (직전 회차 대비 3과 다른 값임을 고정)
23~25  [anchor집계] T0 UNKNOWN → CRAWLED 이탈 1 · → INDEXED 이탈 1 ·
       → UNKNOWN 이탈 0 (대조군). 각각 독립 케이스
```

anchor 이탈 집계는 `countEscapedFromUnknown()` 로 **core 에 추출**했다. 러너 안의
인라인 표현식이면 테스트가 실제 코드 경로를 타지 못해 검증이 성립하지 않기 때문이다.
동작은 동일하며 판정 계약은 바뀌지 않았다. `ESCAPED_STATES` 는 Discovered·Crawled·
Indexed 세 계열이다 — 크롤·색인까지 갔다면 발견은 이미 지난 단계이므로 이탈에 포함한다.

**미커밋이다.** commit·push 는 별도 승인 사항이며 이번 단계는 로컬 편입 + QA 까지다.

2026-09-14 실행 절차

```
1  cd web && node scripts/test-gsc-discovery.mjs      ← 관측 전 QA 먼저 (전항 PASS 확인)
2  node scripts/observe-gsc-discovery.mjs --key <service-account.json>
3  §14.6 순서로 판정: 제1 lastCrawlTime → 제2 coverageState snapshot → 제3 verdict → 제4 Crawled/Indexed
4  결과를 정본에 §15 로 추가 (기존 절 소급 수정 금지)
```
