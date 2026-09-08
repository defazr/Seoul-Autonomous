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
