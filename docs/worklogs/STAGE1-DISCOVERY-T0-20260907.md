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

---

## 15. T+7d Decision — DISCOVERY STARTED 유지 / CRAWL NOT OBSERVED (2026-09-14)

> §14 의 관측 계약을 이행한 회차다. §0·§8·§13·§14 원문은 소급 수정하지 않는다.

### 15.1 판정

```
Stage-1 discovery      DISCOVERY STARTED   유지
Discovery coverage     13 / 14
Crawl                  NOT OBSERVED in Search Console
Indexed progression    NOT OBSERVED
남은 UNKNOWN            /en/stops/01009-gwanghwamun-station  1건
sitemap auto re-download  계속 관측됨
AdSense                HOLD
route recrawl 자동 실행   금지 (조건 폐기 상태 유지)
```

제1 판정 입력 `lastCrawlTime = 0 / 14` → **"Search Console 기준 첫 crawl 기록 미확인."**

### 15.2 T+7d 실측 — 2026-09-14 14:49 KST

관측 전 오프라인 QA 26항 전항 PASS 를 먼저 확인했다(계약 순서 준수).

```
제1  lastCrawlTime        0 / 14
제2  coverageState        Discovered 13 / UNKNOWN 1     ← 그 시점 snapshot
       decision anchor(T0) 대비 UNKNOWN 이탈  13 / 14   ← 전체 판정 축
       comparison baseline(09-10) 대비        U→D 4 · D→U 0 · 동일 10
제3  verdict              14 / 14 NEUTRAL · 미수집 0
제4  Crawled / Indexed    0 / 14
```

sitemap

```
lastSubmitted    2026-09-07 13:28 KST     그대로 (재제출 0회)
lastDownloaded   2026-09-14 14:02 KST     관측 47분 전 자동 재수집
                 이력: 09-07 13:28(우리 제출) → 09-08 16:55 → 09-14 14:02
reported URLs    69        errors/warnings 0 / 0        contents indexed 0
```

**기록 품질 = 완전(complete).** 계약 필드 3종이 14/14 전부 수집됐다.
§14.4 의 verdict 누락은 이번 회차에서 재발하지 않았다 — 도구 결함 2 수정이 실데이터에서 검증됐다.

직전 회차(9/5)와의 차이를 **선형 진전으로 판정하지 않는다.** 다만 이번 회차에
역방향 변동(Discovered→UNKNOWN)이 0건이었다는 사실 자체는 기록한다.

### 15.3 서버 접근 로그 원인조사 (READ-ONLY)

목적: GSC 의 `lastCrawlTime` 14/14 미확인이 **실제 서버 접근 흔적과 일치하는지 독립 확인.**

조사 범위

```
대상 기간   2026-08-27 00:00 KST ~ 2026-09-14 (관측 시점)
대상 URL    Stage-1 Stop 14개
대조군      night-bus-map · /ko/routes · /en/routes · saebyeok-a160 · simya-a21
로그 소스   apps_ng_caddy (caddy:2-alpine) docker json-file log
보존 구간   2025-12-24 23:55 ~ 2026-09-14 13:28 KST  → 조사 창을 완전히 포함
```

**결정적 발견 — 이 서버에는 access log 가 존재하지 않는다.**

```
Caddyfile (2302 bytes)  log · access 지시자 0건
                        seoulautonomous.com 블록 = encode + reverse_proxy 뿐
http.log.access logger  0 건 (전체 13,335 줄 중)
"status":200 기록       0 건 (전체 로그 통틀어)
로그 레벨 분포           info 11,181 · warn 1,908 · error 246   ← access 레벨 없음
앱 컨테이너 로그         GET/HEAD 요청줄 0 · /stops/ 0 · Googlebot 0
                        (Next.js standalone 은 요청을 기록하지 않는다)
다른 소스               /var/log/caddy 없음 · /var/log/nginx 없음 · journald 무의미
```

따라서 로그에 남는 것은 **오류·경고를 유발한 요청뿐**이다.
정상 응답한 요청은 크롤러든 사람이든 **애초에 한 줄도 기록되지 않는다.**

대조군이 이를 확정한다

```
night-bus-map 114건 · /ko/routes 64건 · /en/routes 63건 · route detail 각 8건
→ 숫자는 잡히지만 전부 warn/error 라인(주로 "aborting with incomplete response")이며
  정상 접근 기록이 아니다. status 200 라인은 전체 로그에 0건이다.
```

조사 창(08-27~09-14) 내 seoulautonomous 관련 라인 420건의 성격

```
info 334  대부분 ACME/TLS 갱신 — 요청 기록이 아님
warn  80  "aborting with incomplete response" 64건 포함
error  6
UA    미기재 350 · Mozilla 38 · crusader-worker 25 · curl 7 · Googlebot 0
/stops/ 6건 = 전부 remote_ip 121.162.194.165 (08-27 출시 QA 시간대, 우리 접속)
```

Googlebot User-Agent 요청 (전체 로그 기준, 검증 수준 명시)

```
13건  debt-workbench-web (다른 사이트) · 2026-01-11 · ip 66.249.68.4~6
       → 66.249.0.0/16 은 Google 공개 크롤러 대역이나 **rDNS 검증은 하지 않았다**
1건   seoulautonomous.com/ngsw.json · 2026-07-18 16:26 KST · ip 34.138.251.219
       → 34.138.x.x 는 Google Cloud 일반 대역이며 크롤러 대역이 아니다.
         UA 만 Googlebot 을 칭한 요청일 수 있다
조사 창(08-27~) 내 seoulautonomous + Googlebot UA = 0건
```

**전부 "Googlebot User-Agent 를 가진 요청" 까지만 쓴다.** rDNS 정방향·역방향 검증을
하지 않았으므로 `verified Googlebot` 이라고 쓰지 않는다.

### 15.4 일치 판정 = INCONCLUSIVE (판정 불가)

지시서의 A·B·C 분기 중 **어디에도 해당하지 않는다.** 세 분기는 access log 가 존재한다는
전제 위에 있는데, 그 전제가 성립하지 않았다.

```
🚫 "Server log 에서도 crawl 흔적을 확인하지 못했다"  ← 이렇게 쓰지 않는다
   흔적이 없는 게 아니라 **기록 수단 자체가 없다.** 성공 요청은 원래 안 남는다.

✅ "이 서버에는 access log 가 설정돼 있지 않아, 서버 로그로는 Stage-1 Stop URL 에 대한
   crawler 요청 유무를 확인할 수도 반증할 수도 없다."
```

따라서 **crawl-not-observed 증거는 강화되지 않았고, 약화되지도 않았다.**
현재 근거는 여전히 Search Console 단일 출처다. 원인을 crawl budget 으로 **확정하지 않는다.**
동시에 **배제하지도 않는다** — 현재 실측만으로는 원인을 특정할 수 없으므로, crawl budget 은
**현재 확인된 원인이 아니라 가능한 가설 중 하나로만 유지한다.**
지금 확정 가능한 것은 두 가지뿐이다 — Search Console 에서 7일째 crawl 기록이 관측되지
않았다는 것, 그리고 discovery 가 13/14 까지 진행됐다는 것.

부수 관측(범위 밖, 이번 라운드 조치 0): 조사 창 내 `aborting with incomplete response`
64건. 기존부터 있던 현상이며 Stage-1·RT-2 회귀가 아니다. 별도 backlog.

### 15.5 이번 회차에서 하지 않은 것

```
GSC/GA4 write 0 · sitemap 재제출 0 · Request Indexing 0 · route recrawl 요청 0
발급 scope = webmasters.readonly 단독 · URL Inspection 각 URL 정확히 1회 (총 14회)
로그 설정 변경 0 · rotate 0 · container restart 0 · 서버 파일 생성·수정 0
제품 코드 0 · Production 0 · 내부링크 0 · RT-2 확장 0 · RT-3 0 · EN realtime 0
AdSense 재신청 0 · backlog 정리 0 · commit 0 · push 0
```

### 15.6 NEXT — 관측 계약 갱신 (§14.6 의 체크포인트 일정을 대체)

T+7d 의 "discovery absent → route recrawl" 조건은 §14.4 에서 이미 폐기됐고,
이번 조사로도 **자동 실행 사유가 생기지 않았다.** 매일 볼 이유도 없으므로
간격을 넓힌다. 그 사이는 전면 동결이다.

```
READ-ONLY checkpoint   2026-09-17 13:30 KST 전후
Decision (T+14d)       2026-09-21 13:30 KST 전후
사이 기간               동결 — 외부 write 0
```

09-17 checkpoint 관측 항목 — 이 4개로 제한한다

```
1  14 URL 중 lastCrawlTime 최초 발생 여부
2  남은 /en/stops/01009-gwanghwamun-station 의 UNKNOWN 탈출 여부
3  Crawled 또는 Indexed 계열 progression 발생 여부
4  sitemap lastDownloaded 및 errors/warnings 상태
```

**변화가 없어도 외부 write 를 실행하지 않는다.**

09-21 Decision (T+14d)

```
lastCrawlTime 0/14 이 유지되면 → 그때 다음 단계 후보를 별도 판단한다
  후보 ① Caddy access-log observability 라운드 (§15.7 아이디어)
  후보 ② discovery/crawl 촉진 수단에 대한 READ-ONLY 설계 검토
🚫 route recrawl · Request Indexing · sitemap 재제출 · 내부링크 변경은
   어느 경우에도 자동 실행하지 않는다. 별도 GPT + 사용자 승인 없이 write 금지.
```

**비교 기준 주의.** 러너의 `OBSERVATION_HISTORY` 에 09-14 회차를 넣지 않았으므로
다음 실행 시 `comparison baseline = 2026-09-10` 이 출력된다. 코드는 이번에 고치지 않는다.
**공식 직전 snapshot 은 2026-09-14 T+7d 결과**이며, 출력값과 공식 기준을 구분해 읽는다.
판정 anchor 는 변함없이 T0(2026-09-07, 14/14 UNKNOWN) 다.

### 15.6b AdSense 계약

```
현재            재신청하지 않는다
근거            13/14 discovery 는 긍정 신호이나,
                Search Console 기준 crawl progression 이 아직 관측되지 않았다
다음 판단 시점   늦어도 2026-09-21 T+14d Decision 에서 다시 한다
조기 재판정      그 전에 lastCrawlTime 또는 Indexed progression 이
                의미 있게 발생하면 그 시점에 앞당겨 판단할 수 있다
```

### 15.7 CC 이견 및 아이디어

**이견 1 — 오늘 조사의 실질 산출물은 "모른다"를 정확히 만든 것이다.** 로그를 보면
crawl 여부가 갈릴 줄 알았는데, 실제로는 판정에 쓸 수 있는 데이터가 애초에 없었다.
이것을 A분기(흔적 0)로 적었다면 단일 출처를 이중 출처로 위장하는 오류가 됐을 것이다.

**이견 2 — 관측 도구의 기준선이 09-10 에 멈춰 있다.** `OBSERVATION_HISTORY` 에
2026-09-14 회차가 없어서, 다음 실행 시 러너가 `comparison baseline = 2026-09-10` 을
출력한다. 기록으로는 틀리지 않지만 **직전 관측을 가리키지 않는다.** 코드 변경이므로
이번 라운드에서 손대지 않았다 — 다음 관측 전에 처리 여부를 정해야 한다.

**아이디어 — Caddy access log 활성화는 별도 라운드가 필요하다.** 지금 구조로는
"구글이 우리 페이지를 실제로 가져갔는가" 를 **영원히 서버 쪽에서 답할 수 없다.**
다만 Caddy 설정 변경은 6개 도메인·9개 컨테이너에 걸린 운영 사고 이력이 있는 영역이라
이번 라운드에서 제안 이상은 하지 않는다. validate → reload 계약과 별도 승인이 필요하다.

---

## 16. T+10d READ-ONLY checkpoint — DISCOVERY STARTED 유지 / CRAWL NOT OBSERVED (2026-09-17)

> §15.6 의 관측 계약을 이행한 회차다. §0·§8·§13·§14·§15 원문은 소급 수정하지 않는다.
> 이 회차는 **checkpoint 이며 Decision 라운드가 아니다.** Decision 은 09-21 T+14d 다.

### 16.1 판정

```
Stage-1 discovery        DISCOVERY STARTED   유지
decision anchor          T0 2026-09-07 13:28 KST · 14/14 UNKNOWN   (불변)
Discovery coverage       anchor 대비 UNKNOWN 이탈  12 / 14
현재 snapshot            Discovered 12 / UNKNOWN 2
lastCrawlTime            0 / 14        ← Search Console 기준
Crawl                    NOT OBSERVED
Crawled / Indexed progression   NOT OBSERVED
기록 품질                 완전 — verdict 미수집 0 / 14 · 14 URL 전건 수집
AdSense                  HOLD 유지
외부 write               0
```

제1 판정 입력 `lastCrawlTime = 0 / 14` → **"Search Console 기준 첫 crawl 기록 미확인."**
T0·T+42.8h·T+72.6h·T+7d 에 이어 **4회차 연속 0/14** 다.

### 16.2 실측 — 2026-09-17 15:09~15:12 KST

관측 전 오프라인 QA **26항 전항 PASS** 를 먼저 확인했다(계약 순서 준수).
발급 scope = `webmasters.readonly` 단독, 서명 전·네트워크 요청 전 2중 방어선 통과.
URL Inspection 은 14 URL 각 정확히 1회(총 14회).

```
제1  lastCrawlTime        0 / 14
제2  coverageState        Discovered 12 / UNKNOWN 2     ← 그 시점 snapshot
       decision anchor(T0) 대비 UNKNOWN 이탈  12 / 14   ← 전체 판정 축
제3  verdict              14 / 14 NEUTRAL · 미수집 0
제4  Crawled / Indexed    0 / 14
```

UNKNOWN 으로 보고된 2건

```
/en/stops/01010-gwanghwamun-station
/en/stops/01013-jongno-2-ga
```

계약 시각(13:30 전후) 대비 약 1.6시간 늦게 실행했다. 관측 성격상 판정에 영향이 없으나
사실로 기록한다.

### 16.3 비교 축 3개 — 명시적으로 보존한다

```
runner comparison baseline    2026-09-10 T+72.6h    ← 러너가 출력한 값
official previous snapshot    2026-09-14 T+7d       ← 직전 회차 변화 서술은 이 축으로 한다
decision anchor               2026-09-07 T0         ← 전체 판정 기준점 (14/14 UNKNOWN)
```

**러너의 09-10 비교 결과를 현재 추세 판정으로 사용하지 않는다.**
`OBSERVATION_HISTORY` 에 09-14 회차가 없어 러너는 여전히 09-10 을 baseline 으로 출력한다
(§15.6 의 B안 — 이번 라운드에서도 코드는 고치지 않았다).

두 축의 출력이 서로 다른 그림을 준다 — **양쪽 다 기록하고 어느 쪽도 추세로 읽지 않는다.**

```
runner 출력 (09-10 대비)             U→D 4 · D→U 1 · 동일 9
official previous (09-14 대비)       U→D 1 · D→U 2 · 동일 11      ← 직전 회차 변화 서술
                                     총계 Discovered 13 → 12
```

### 16.4 해석 — 넘지 않는 선

09-14 에 마지막 UNKNOWN 1건이던 `/en/stops/01009-gwanghwamun-station` 은 이번 회차에
`Discovered - currently not indexed` 로 보고됐다. 반대로 `/en/stops/01010-gwanghwamun-station`
과 `/en/stops/01013-jongno-2-ga` 는 09-14 snapshot 과 다른 상태로 보고됐다.

```
허용 표현   "Search Console 이 09-14 와 09-17 에 서로 다른 coverageState 를 보고했다"
🚫 금지     "발견이 취소됐다"  "페이지 결함이 생겼다"  "discovery 가 후퇴했다"
            "나빠졌다"  "내부 파이프라인이 되돌아갔다"
```

- **snapshot 12/14 를 regression 으로도 개선 추세로도 판정하지 않는다.**
- 특정 URL 의 UNKNOWN 복귀만으로 페이지 결함을 판정하지 않는다.
  **preflight 14/14 PASS 를 뒤집을 새 근거는 없다.**
- 전체 discovery 판정의 비교 대상은 직전 회차가 아니라 decision anchor(T0) 다 → 12/14.

**핵심 병목은 바뀌지 않았다** — Search Console 기준 `lastCrawlTime 0/14` ·
`Crawled/Indexed 0/14` 다. coverageState 의 URL별 차이는 이 병목을 바꾸지 않는다.

### 16.5 sitemap

```
lastSubmitted    2026-09-07 13:28 KST     유지 (재제출 0회)
lastDownloaded   2026-09-14 14:02 KST     유지 — 09-14 관측 시점 값 그대로
reported URLs    69        errors / warnings 0 / 0        contents indexed 0
이력             09-07 13:28(우리 제출) → 09-08 16:55 → 09-14 14:02 → (이후 없음)
```

**09-14 이후 3일간 추가 재다운로드가 관측되지 않았다는 사실만 기록한다.**
이를 "Google 이 사이트를 덜 크롤한다" 또는 이상 징후로 해석하지 않는다.
관측된 재수집 간격은 1일·6일·(진행중 3일) 로 표본이 3점뿐이라 어떤 패턴도 주장할 수 없다.

### 16.6 이번 회차에서 하지 않은 것

```
GSC/GA4 write 0 · sitemap 재제출 0 · Request Indexing 0 · route recrawl 요청 0
발급 scope = webmasters.readonly 단독 · URL Inspection 각 URL 정확히 1회 (총 14회)
OBSERVATION_HISTORY 수정 0 · 관측 runner 수정 0 · 판정 로직 수정 0
제품 코드 0 · Production 0 · 내부링크 0 · RT-2 확장 0 · RT-3 0 · EN realtime 0
AdSense 재신청 0 · 새 HANDOFF 파일 생성 0 · commit 0 · push 0
```

`HANDOFF-20260917.md` 는 만들지 않는다 — 09-17 은 Decision 라운드가 아니라 checkpoint 이므로
**정본 §추가 + SESSION-HANDOFF 갱신으로 충분하다.**

### 16.7 NEXT

```
Decision (T+14d)   2026-09-21 13:30 KST 전후
사이 기간           동결 — 외부 write 0
```

```
lastCrawlTime 0/14 이 유지되면 → 그때 다음 단계 후보를 별도 판단한다
  후보 ① Caddy access-log observability 라운드
  후보 ② discovery/crawl 촉진 수단에 대한 READ-ONLY 설계 검토
🚫 route recrawl · Request Indexing · sitemap 재제출 · 내부링크 변경은
   어느 경우에도 자동 실행하지 않는다. 별도 GPT + 사용자 승인 없이 write 금지.
```

**gate 관계 — 기존 계약 유지.** RT-2 확대와 AdSense 재신청은 **서로 독립된 gate** 이며
둘 다 09-21 에 **각각 별도 GO/HOLD** 판단한다. 입력(discovery·crawl 결과)만 공유한다.

AdSense = **HOLD 유지.** §15.6b 의 조기 재판정 조건이었던 `lastCrawlTime` 또는
의미 있는 `Indexed progression` 이 **발생하지 않았다.** 다음 판단은 09-21 T+14d.

### 16.8 후속 housekeeping 라운드 (승인 · 이번 라운드와 분리)

포그린 확정 2026-09-17. §15.7 이견 2 의 후속이며 **이번 문서 라운드와 절대 섞지 않는다.**

```
시점   이 문서 정본화가 닫힌 뒤 · 09-21 Decision 직전이 아닌 여유 있는 때
목적   OBSERVATION_HISTORY 에 2026-09-14 · 2026-09-17 snapshot 을 추가하여
       09-21 러너가 직전 관측(09-17)을 comparison baseline 으로 사용하게 만든다
범위   이력 데이터 추가 + 오프라인 QA 갱신·PASS 까지
🚫 금지 관측 로직 자체 · API 호출 방식 · 판정 로직 변경
```

**관측과 도구 정리를 같은 라운드에 섞지 않는다** 는 원칙은 유지된다.

### 16.9 CC 이견 및 아이디어

**이견 1 — B안(러너 미수정) 유지가 이번 회차에서 실제로 값을 했다.** 09-14 를 미리
`OBSERVATION_HISTORY` 에 넣었다면 러너가 곧바로 09-14 대비 delta 를 출력했을 것이고 그게
더 정확했겠지만, **두 축의 그림이 서로 다르다는 사실 자체**는 기록에 남지 않았을 것이다.
손계산 병기가 §16.3 의 대비를 남겼다. 다만 이 장점은 이번 한 번으로 끝이다 — §16.8 참조.

**이견 2 — 09-21 Decision 을 손계산 의존으로 치르면 안 된다.** 지금 baseline 이 09-10 에
멈춰 있어 09-21 에 러너를 그대로 돌리면 **11일 전 상태와 비교**한다. checkpoint 회차는
손계산으로 메울 수 있었지만 Decision 라운드에서 같은 방식은 위험하다. §16.8 housekeeping 을
**09-21 이전에, 그러나 09-21 직전이 아닌 시점에** 닫아두는 것이 안전선이다.

**이견 3 — sitemap 3일 무재수집은 지금 판단 근거로 쓰지 않는다.** 표본이 3점(1일·6일·
진행중 3일)뿐이라 패턴을 주장할 수 없다. 09-21 에 한 점이 더 생기면 그때 네 점으로 언급
가능한 수준이 된다. 그 전에 crawl budget 이나 사이트 품질과 연결하는 해석은 금지선 안쪽이다.

**아이디어 — 없다.** 09-21 까지 새 작업을 열지 않는다. Caddy access-log 는 09-21 후보로만 유지한다.

---

## 17. T+14d Decision — DISCOVERY STARTED 유지 / CRAWL NOT OBSERVED (2026-09-21)

> §16.7 의 관측 계약을 이행한 **Decision 라운드**다.
> §0·§8·§13·§14·§15·§16 원문은 소급 수정하지 않는다.

### 17.1 판정 (고정)

> ⚠ **이 절의 `AdSense = HOLD` 는 2026-09-22 결정으로 대체됐다.** 당시 기록으로 보존하며
> 소급 수정하지 않는다. 09-22 Caddy 로그 첫 판독에서 verified Search Googlebot 29건과
> Mediapartners-Google 5건이 확인돼 기술적 차단 가설이 배제됐고, preflight 8항 PASS 후
> **4차 재신청이 2026-09-22 23:30 KST 에 제출됐다 (UNDER REVIEW).**
> 현재 AdSense 상태의 정본은 `docs/SESSION-HANDOFF.md` 와
> `docs/worklogs/CADDY-LOG-FIRST-READING-20260922.md` 다.

```
Stage-1 discovery                DISCOVERY STARTED   유지
Crawl                            NOT OBSERVED — 6회차 연속 0 / 14
Crawled / Indexed progression    NOT OBSERVED
AdSense                          HOLD
RT-2 확대                         HOLD
decision anchor                  T0 2026-09-07 13:28 KST · 14/14 UNKNOWN   (불변)
anchor 대비 UNKNOWN 이탈           11 / 14
현재 snapshot                     Discovered 11 / UNKNOWN 3
기록 품질                          완전 — verdict 미수집 0 / 14
외부 write                        0
```

**AdSense = HOLD 근거.** §15.6b 가 정한 조기 재판정 조건 —
`lastCrawlTime` 또는 의미 있는 `Indexed progression` 발생 — 이
T0 이후 14일 동안 **한 번도 성립하지 않았다.**

**RT-2 확대 = HOLD 근거. 🚫 AdSense 때문이 아니다.**
RT-2 확대는 AdSense 와 **독립된 gate** 이며(2026-09-14 확정),
**색인 부진을 RT-2 확대의 근거로도 반대 근거로도 사용하지 않는다.**
이번 HOLD 사유는 오직 하나 — **확대 자체를 정당화할 제품 근거가 아직 부족하다.**
자연 운행시간대 B 화면이 Production 에서 관측되지 않았고(§ WATCH 유지),
현재 실시간 적용 범위는 KO 01009 한 페이지뿐이다.
"색인이 안 되니 다른 걸 하자" 는 확대 사유가 될 수 없다.

### 17.2 T+14d 실측 — 2026-09-21 16:57~17:00 KST

관측 전 오프라인 QA **26항 전항 PASS** 선행 확인(계약 순서 준수).
scope = `webmasters.readonly` 단독 · URL Inspection 14 URL 각 정확히 1회.

계약 시각(13:30 전후) 대비 약 3.5시간 늦게 실행했다. T+14d 경계 안이며 판정에
영향은 없으나 사실로 기록한다.

```
제1  lastCrawlTime        0 / 14
제2  coverageState        Discovered 11 / UNKNOWN 3     ← 그 시점 snapshot
       decision anchor(T0) 대비 UNKNOWN 이탈  11 / 14   ← 전체 판정 축
제3  verdict              14 / 14 NEUTRAL · 미수집 0
제4  Crawled / Indexed    0 / 14
```

UNKNOWN 으로 보고된 3건

```
/en/stops/01013-jongno-2-ga
/ko/stops/01013-jongno-2-ga
/ko/stops/01014-jongno-2-ga
```

직전 회차(09-17 T+10d) 대비 변동 — **관측 사실로만 기록한다**

```
U→D 1   /en/stops/01010-gwanghwamun-station
D→U 2   /ko/stops/01013-jongno-2-ga · /ko/stops/01014-jongno-2-ga
동일 11
```

**이번 회차부터 러너의 comparison baseline 이 직전 공식 관측을 가리킨다.**
§16.8 housekeeping(commit `fc611e1`) 이 실데이터에서 검증됐다 —
러너가 `comparison baseline = 2026-09-17T15:09+09:00` 을 출력했고,
09-17 회차에서 필요했던 손계산 보정이 이번에는 불필요했다.

```
runner comparison baseline    2026-09-17 T+10d   ← 러너 출력 = 공식 직전 snapshot (일치)
decision anchor               2026-09-07 T0      ← 전체 판정 기준점
```

### 17.3 해석 — 넘지 않는 선

```
허용 표현   "Search Console 이 09-17 과 09-21 에 서로 다른 coverageState 를 보고했다"
🚫 금지     "발견이 취소됐다" · "discovery 가 후퇴했다" · "나빠졌다" ·
            "페이지 결함이 생겼다" · "내부 파이프라인이 되돌아갔다"
```

- **snapshot 11/14 와 U→D 1 · D→U 2 를 regression 으로도 개선 추세로도 판정하지 않는다.**
- **Search Console 만으로 "실제 Googlebot 접근 자체가 없었다" 고 단정하지 않는다.**
  실측한 것은 "Search Console 이 `lastCrawlTime` 을 14/14 에서 보고하지 않았다" 까지다.
  서버 측 독립 확인 수단은 §15.3 대로 **현재 존재하지 않는다**(Caddy log 지시자 0건).
- 원인을 **crawl budget 으로 확정하지 않는다.** 배제되지도 않았으며 가설 중 하나다.
- 특정 URL 의 UNKNOWN 복귀만으로 페이지 결함을 판정하지 않는다.
  **preflight 14/14 PASS 는 유효하다.**
- 전체 discovery 판정의 비교 대상은 직전 회차가 아니라 decision anchor(T0) 다 → 11/14.

### 17.4 sitemap

```
lastSubmitted    2026-09-07 13:28 KST     유지 (재제출 0회)
lastDownloaded   2026-09-14 14:02 KST     유지
reported URLs    69     errors / warnings 0 / 0     contents indexed 0
이력             09-07 13:28(우리 제출) → 09-08 16:55 → 09-14 14:02 → (이후 없음)
```

**2026-09-14 이후 현재까지 7일간 새 다운로드 기록이 없다는 사실까지만 기록한다.**
패턴도 원인도 주장하지 않는다. "Google 이 사이트를 덜 크롤한다" 로 읽지 않는다.

### 17.5 §15.6 조건 성립 기록

§15.6 이 정한 **"`lastCrawlTime` 0/14 가 유지되면 그때 다음 단계 후보를 별도 판단한다"**
조건이 **성립했다.** 이 판단을 이번 라운드에서 수행했고 결과는 §17.6 이다.

조건이 성립했다는 것은 **후보를 판단한다**는 뜻이지 **후보를 실행한다**는 뜻이 아니다.
route recrawl · Request Indexing · sitemap 재제출 · 내부링크 변경은 이번에도 0 건이다.

### 17.6 다음 라운드 — 우선 후보 확정

> ⚠ **이 절은 이미 이행됐다 (2026-09-21~22).** Caddy access-log observability 는 조사·적용·
> graceful reload·첫 판독까지 완료됐다 — 정본 `CADDY-ACCESS-LOG-OBSERVABILITY-20260921.md` ·
> `CADDY-LOG-FIRST-READING-20260922.md`. **재조사·재적용 금지.**
> 아래는 당시 계약 기록이며 현재 지시가 아니다. 현재 NEXT 는 `docs/SESSION-HANDOFF.md` 를 본다.

```
다음 라운드   Caddy access-log observability — READ-ONLY discovery / 설계
범위 밖       실제 Caddyfile 수정 · validate/reload 실행 · 배포
```

**왜 촉진 수단보다 계측이 먼저인가.** 지금 촉진 수단(Request Indexing 등)을 먼저 쓰면
이후 Googlebot 이 들어와도 **어떤 변화 때문에 들어왔는지 분리할 수 없다.** 게다가 현재
crawl 근거는 Search Console 단일 출처이고 서버 쪽에서는 **영원히 답할 수 없는 구조**다.
따라서 현재 가장 큰 공백은 색인 촉진책 부족이 아니라 **서버 측 독립 관측 수단 부재**다.
순서는 **계측기 먼저, 촉진 나중.**

READ-ONLY discovery 에서 실측할 항목

```
현재 Caddyfile 구조 · log 지시자 유무 · 전역/사이트 블록 경계
seoulautonomous 단일 도메인만 격리해 기록 가능한지
로그 위치 · 포맷 · rotation · 보존기간 · 디스크 영향
validate → reload 절차와 rollback 경로 (전문 백업 포함)
6도메인·9컨테이너 공유 Caddy 에 대한 영향 범위
```

구현 여부는 **그 조사 결과를 보고 다시 승인**한다. 공유 Caddy 는 운영 사고 이력이 있는
영역이므로 조사와 구현을 같은 라운드에 섞지 않는다.

**discovery/crawl 촉진 수단은 계측 확보 이후 별도 판단한다.**

```
🚫 계속 금지 (자동 실행 0)
   Request Indexing · sitemap 재제출 · route recrawl · 내부링크 변경 ·
   그 밖의 모든 외부 write. 별도 GPT 판단 + 사용자 승인 없이 실행하지 않는다.
```

### 17.7 이번 회차에서 하지 않은 것

```
GSC/GA4 write 0 · sitemap 재제출 0 · Request Indexing 0 · route recrawl 0
Caddy 접촉 0 (조사·수정·validate·reload 전부) · Production 0 · 서버 파일 0
제품 코드 0 · 관측 runner 0 · OBSERVATION_HISTORY 0 · 내부링크 0
RT-2 확장 0 · RT-3 0 · EN realtime 0 · AdSense 재신청 0
```

### 17.8 CC 이견 및 아이디어

**이견 1 — 14일 0/14 는 이제 "아직 이르다" 로 설명하기 어렵다.** 다만 그 다음 문장을
조심해야 한다. 근거는 여전히 **Search Console 단일 출처**이고, 서버 로그는 구조상 답을
줄 수 없다. 정확한 서술은 "크롤이 없었다" 가 아니라 **"크롤 기록을 확인할 수단이 한 곳뿐이고
그 한 곳이 0 을 보고한다"** 까지다. 이 구분이 §17.6 의 순서(계측 먼저)를 정당화한다.

**이견 2 — sitemap 무재수집 공백이 이번에 표본 네 점째가 됐다.** 09-07→09-08(1일) ·
09-08→09-14(6일) · 09-14→현재(7일 경과·진행중). **관측된 것 중 가장 긴 공백이 갱신 중**
이라는 사실은 Decision 입력으로 기록할 가치가 있다. 그러나 네 점으로도 패턴 주장은 못 하며
원인 해석은 하지 않는다.

**이견 3 — RT-2 확대 HOLD 의 사유 분리가 이번 판정에서 가장 중요한 기록이다.**
"AdSense 가 HOLD 니까 RT-2 도 HOLD" 로 요약되면 2026-09-14 에 확정한 독립 gate 구조가
한 라운드 만에 무너진다. §17.1 에 사유를 명시적으로 분리해 적은 이유다.

**아이디어 — 없다.** 다음 라운드는 Caddy READ-ONLY 조사 하나이며, 그 전까지 새 작업을
열지 않는다.
