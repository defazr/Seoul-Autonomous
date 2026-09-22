# Caddy Access-Log 첫 판독 — verified Google-origin crawler 확인 / Stop Search crawl 0건 (2026-09-22)

> **판정: VERIFIED GOOGLE-ORIGIN CRAWLERS CONFIRMED · STOP SEARCH CRAWL NOT OBSERVED (28.7h 창)**
> 계약상 첫 판독은 2026-09-24 였으나 포그린 판단으로 **조기 실행**했다(읽기 전용·위험 0).
> 선행 정본 `CADDY-ACCESS-LOG-OBSERVABILITY-20260921.md` §7.1 의 6단계 순서를 그대로 따랐다.
> 이 문서는 **판독 결과 기록**이며 후속 조치 지시가 아니다.

---

## 0. 한 줄 요약

**"구글이 우리 사이트를 읽기는 하는가" 가 28.7시간치 서버 로그로 갈렸다.**

```
Google-origin crawler 는 온다      verified Google-origin requests 54건 · 공식 IP 6개
  ├ Search Googlebot (D+S)        29건
  ├ Google-adstxt                 20건
  └ Mediapartners-Google           5건   ← AdSense crawler (Search 와 별개)

Stop 페이지 Search crawl           0건   (관측창 28.7시간 기준)
```

⚠ **Search Googlebot 과 ads.txt·AdSense crawler 를 하나의 "Googlebot" 총계로 묶지 않는다.**
Google 은 Mediapartners-Google 을 별도 AdSense crawler 로 명시한다.

**"구글이 사이트에 오지 않는다" 는 관측창 안에서 성립하지 않는다** — robots.txt·ads.txt·
sitemap.xml·노선 페이지를 정상 크롤하고 있다.

⚠ **서버 access log 는 2026-09-21 17:56 이후만 존재한다.** 관측창에서는 Stop URL 의
Search crawl 0건으로 GSC 보고와 **일치**했으나, **09-21 이전 14일 전체는 서버 로그로
소급 검증할 수 없다.** 과거 14일의 보고 지연·GSC 결함 여부는 이 로그로 확정하지 않는다.

---

## 1. 판독 창구간 · 표본

```
스냅샷 고정   2764 라인 · 4,258,241 bytes   (판독 중 로그가 계속 자라므로 단일 스냅샷으로 고정)
창구간        2026-09-21 17:56:41 ~ 2026-09-22 22:38:50 KST   (28.7 시간)
총 요청       2,764 건
self-test 제외  2 건 (계약 §6.1) → 분석 대상 2,762 건
고유 IP       280 · 고유 UA 130
status 분포   200:1339 · 404:1071 · 308:210 · 307:134 · 304:8 · 206:2
```

⚠ **28.7시간 단일 표본이다.** 아래 모든 수치는 이 창에 한정되며 장기 경향이 아니다.

---

## 2. 판독 순서 이행 (§7.1 6단계)

### 2.1 ① 로그 정상 기록 확인 — PASS

첫 줄 09-21 17:56:41(계측 시작), 마지막 줄 09-22 22:38:50. JSON parse 실패 **0건**.
크기·라인 모두 증가 중. 계측기는 정상 가동한다.

### 2.2 ② self-test UA 2건 제외 — 완료

```
caddy-baseline-check/20260921            1건 제외
seoul-autonomous-caddy-log-smoke/20260921  1건 제외
```

⚠ 판독 과정에서 CC 가 검증용으로 보낸 `seoul-autonomous-log-reading/20260922` 2건이
`/stops/` 집계에 섞여 있다. 아래 §4 에서 별도 차감했다.

### 2.3 ③ remote_ip 보존 확인 — **PASS**

계약 §6.2 가 "Googlebot 검색보다 먼저 확인하라" 고 지정한 항목이다.

```
고유 IP          280 개
서버 자기 IP      0 건   (158.247.252.172 — smoke 때와 달리 외부 트래픽에는 없음)
상위 IP          104.155.237.251 471건 · 45.138.12.52 300건 · 34.65.124.80 278건 …
```

**실제 클라이언트 IP 가 보존된다.** 앞단 프록시가 IP 를 뭉개지 않는다.
→ Googlebot IP 검증이 **가능한 상태**임이 실증됐다.

### 2.4 ④⑤ Googlebot 후보 검색 + IP 검증

rDNS → 정방향 재확인(Google 공식 절차)을 7개 후보 IP 전부에 적용했다.

```
66.249.70.96    crawl-66-249-70-96.googlebot.com     VERIFIED
66.249.70.105   crawl-66-249-70-105.googlebot.com    VERIFIED
66.249.70.106   crawl-66-249-70-106.googlebot.com    VERIFIED
66.249.70.107   crawl-66-249-70-107.googlebot.com    VERIFIED
66.249.70.110   crawl-66-249-70-110.googlebot.com    VERIFIED
74.125.151.105  rate-limited-proxy-74-125-151-105.google.com   VERIFIED
104.155.237.251 251.237.155.104.bc.googleusercontent.com       ★ REJECTED
```

### 2.5 ⑥ 판정

```
verified Google-origin requests   54 건 (IP 6개)
  Search Googlebot Desktop        20 건
  Search Googlebot Smartphone      9 건   → Search Googlebot 소계 29 건
  Google-adstxt                   20 건
  Mediapartners-Google             5 건   (AdSense crawler)
Google crawler 검증 미통과 IP      1 개
```

**AdSense 조기 재판정 조건("verified Googlebot 확인")은 Search Googlebot 29건만으로도
이미 충족한다.** ads.txt·AdSense crawler 를 더하지 않아도 성립한다.

---

## 3. verified Google-origin crawler 가 실제로 한 일

UA 원문 전수

```
20  Google-adstxt                                    ← ads.txt 전용 페처
20  Mozilla/5.0 (compatible; Googlebot/2.1; …)       ← Googlebot desktop
 9  Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X …)   ← Googlebot smartphone
 5  Mediapartners-Google                             ← AdSense 크롤러
```

요청 URI 전수

```
20  /ads.txt
19  /robots.txt
 1  /sitemap.xml
 1  /ko/routes/saebyeok-a504
 1  /ko/routes/simya-a21
 1  /ko/routes/sangam-a21
 1  /ko/night-bus-map
 1  /ko/how-to-ride
 9  /_next/static/chunks/*   (css·js 5종)
---
 0  /stops/*        ★
```

status / 프로토콜

```
200:30 · 308:16 · 304:8
HTTPS 38 / HTTP 16
```

**308 의 정체 = HTTP→HTTPS 자동 리다이렉트다.** 로그의 `request.tls` 필드로 확인했다 —
308 인 요청은 전부 `tls` 없음(평문 80 포트)이다. Caddy 의 auto-HTTPS 동작이며 **결함이 아니다.**
Googlebot 이 간헐적으로 `http://` 로 요청하는 정상 패턴이다.

### 3.1 특기 — AdSense 계열이 이미 활발하다

```
Google-adstxt        20건 — 약 4시간 주기로 /ads.txt 를 반복 수집
Mediapartners-Google  5건 — 2026-09-22 08:59 에 /ko/routes/sangam-a21 + static 4종
```

`Mediapartners-Google` 은 Google 이 **별도 AdSense crawler** 로 명시한 것이다.
**Search Googlebot 과 다른 크롤러**이며, 사이트를 이미 방문하고 있다.

⚠ 이것을 "AdSense 심사가 진행 중" 으로 읽지 않는다. 실측한 것은
**"AdSense 계열 크롤러가 사이트에 접근했다"** 까지다.

---

## 4. ★ Stop 페이지 Search crawl 0건 — 핵심 발견

```
verified Search Googlebot 의 /stops/ 접근   0 건
전체 트래픽의 /stops/ 접근             22 건 (전부 status 200)
   SERankingBacklinksBot               14건
   정체불명 Android UA                   4건
   bingbot                              2건
   CC 판독용 요청(log-reading UA)         2건  ← 차감 대상
→ 외부 봇의 실제 /stops/ 접근 = 20건, 그중 구글 0건
```

**빙은 왔고 구글은 안 왔다.**

### 4.1 배제된 가설

| 가설 | 검증 | 결과 |
|---|---|---|
| robots.txt 가 /stops/ 를 막는다 | 실물 조회 | **배제.** `User-Agent: *` / `Allow: /` · Disallow 0건 |
| Stop 페이지가 죽었다(5xx·404) | 실응답 + 로그 | **배제.** live 200 · 로그상 22/22 전부 200 |
| sitemap 에 Stop URL 이 없다 | sitemap 조회 | **배제.** `/stops/` 포함 줄 42건 |
| 구글이 sitemap 을 못 받았다 | 로그 | **배제.** 09-22 07:24:40 `/sitemap.xml` **status 200** 수집 완료 |
| 구글이 사이트에 안 온다 | 로그 | **관측창 내 배제.** Google-origin 54건 방문 |

### 4.2 확정 사실 — 여기까지만 쓴다

```
1  Google-origin crawler 가 /sitemap.xml 을 status 200 으로 수집했다 (09-22 07:24:40)
2  그 sitemap 에 Stop URL 이 포함돼 있다
3  그 뒤 관측창 15시간 동안 Search Googlebot 의 /stops/ 요청은 0 건이었다
4  sitemap 수집은 **모든 URL 의 crawl 을 보장하지 않는다** (Google 공식 문서)
5  queue · defer · priority 등 원인은 **미확정**
```

sitemap 수집 직후 다음 행동은 `/ko/routes/sangam-a21` 과 static chunk 였다.

🚫 **"URL 을 알면서 선택적으로 가져가지 않는다" 같은 의도·우선순위 해석을 하지 않는다.**

### 4.3 🚫 넘지 않는 선

```
🚫 crawl budget 으로 원인 확정 금지 — 배제되지 않았으나 가설 중 하나일 뿐이다
🚫 "페이지 품질이 낮아서" 단정 금지 — 근거 없음
🚫 "구글이 우리 사이트를 차단했다" 금지 — Google-origin 54건 크롤 중이다
🚫 "선택적으로 안 가져간다" 등 의도·우선순위 해석 금지 — queue/defer/priority 미확정
🚫 28.7시간 표본으로 장기 경향 주장 금지
🚫 09-21 이전 14일을 서버 로그로 증명했다는 표현 금지 — 로그가 존재하지 않는 구간이다
허용 표현  "sitemap 수집 이후 관측 창 안에서 Search Googlebot 의 Stop URL 요청이 0건이었다"
```

---

## 5. ⚠ UA 위장 1건 적발 — 보안 관측

```
IP        104.155.237.251
rDNS      251.237.155.104.bc.googleusercontent.com
판정      **Google Search crawler 검증 기준을 통과하지 않음 → REJECTED**
총 요청    471 건   ← 단일 IP 기준 1위
status    404:461 · 308:8 · 307:2
```

⚠ **운영 주체를 단정하지 않는다.** 확정 사실은 "rDNS 가 `*.bc.googleusercontent.com` 이고,
Google Search crawler 검증 기준(`.googlebot.com` / `.google.com` rDNS + 정방향 재확인)을
통과하지 않았다" 까지다. `googleusercontent.com` 이라는 이유만으로 Search Googlebot 이
아니며, 반대로 그 도메인이라고 해서 주체를 특정할 수도 없다.
**실제 Googlebot 으로 집계하지 않는다.**

사용한 UA 가 **여러 개로 돌아간다** — Googlebot 22건, KimiBot 26건, Meta-ExternalAgent 22건,
YiBot 18건, MistralAI-User 18건, DeepSeekBot 17건 등.

요청 대상

```
/.ssh/id_ed25519 · /gcp-key.json · /secrets.json · /secrets.yml · /.aws/config
/.env.prod · /.env.docker · /.env.prod.bak · /private/.env · /old/.env · /.pypirc
/actuator/heapdump · /actuator/mappings · /_image?href=/proc/self/environ
/@fs/home/ubuntu/.aws/credentials · /config/env/aws_credentials.env …
```

**요청 형태는 credential 탐색이다. 461건이 404 로 응답했고 가져간 것은 없다.**
(행위 설명이며 운영 주체 단정이 아니다.) 인터넷에 공개된 서버가 상시로 받는 배경 노이즈이며
**우리 쪽 결함 징후가 아니다.** Google 은 UA 위장을 경고하며 Googlebot 검증을 rDNS 또는
공식 IP 범위로 하라고 명시한다 — 이번 건이 그 경고에 해당하는 사례다.

### 5.1 이 건이 남긴 교훈 — 계약이 실제로 값을 했다

CC 의 **1차 검증 스크립트가 이 IP 를 VERIFIED 로 판정했다.** 허용 도메인 목록에
`googleusercontent.com` 을 넣은 것이 원인이었다. `googleusercontent.com` 은 이번
Google Search crawler 검증에 허용한 `.googlebot.com` / `.google.com` suffix 가 아니므로,
**이 IP 를 Search Googlebot 으로 검증하지 않는다.**

`.googlebot.com` / `.google.com` 으로 좁혀 재검증한 결과 REJECTED 로 뒤집혔다.

```
UA 만 봤다면    → Googlebot 56건으로 집계 (22건 과대)
도메인 오설정   → 여전히 56건 (googleusercontent.com 을 허용했으므로)
정확한 검증     → Search Googlebot 29건 · Google-origin 전체 54건
```

**"UA 만으로 verified Googlebot 이라고 부르지 않는다"(§6.3) 는 계약이 없었으면 틀린 숫자를
보고할 뻔했다.** 안전선이 실제 사고를 막은 첫 사례로 기록한다.

---

## 6. 기타 관측 — 트래픽 구성

전체 2,762건(self-test 제외) 중 사람 방문으로 볼 만한 흔적은 확인되지 않았다.
**404 가 1,071건**으로 전체의 38.8% 인데, 대부분 위 스캐너 계열의 탐색 요청이다.

다른 크롤러

```
SERankingBacklinksBot  82건   ← /stops/ 를 실제로 14건 크롤
ClaudeBot              73건
ChatGPT-User           37건
bingbot                36건   ← /stops/ 2건 크롤
DaumBot                27건
Yeti (네이버)           19건
```

⚠ **AI 크롤러(ClaudeBot·ChatGPT-User·KimiBot·DeepSeekBot 등) 유입이 관측된다.**
이번 라운드의 판단 대상이 아니므로 사실만 기록한다.

---

## 7. 판정과 gate 영향

### 7.1 Stage-1 discovery

```
GSC lastCrawlTime 0/14       **관측창 안에서는** 서버 로그와 일치
                             ⚠ 09-21 이전 14일은 로그 부재로 소급 검증 불가 —
                                과거 보고 지연·GSC 결함 여부를 이 로그로 확정하지 않는다
Stop 페이지 Search crawl      NOT OBSERVED (28.7시간 창)
사이트 전체 크롤              OBSERVED — robots/ads/sitemap/route 페이지 정상
원인                         미확정. 배제된 가설은 §4.1, 확정 사실은 §4.2
```

### 7.2 AdSense — 조기 재판정 **조건 성립**

정본 `CADDY-ACCESS-LOG-OBSERVABILITY-20260921.md` §7.2 는
**"verified Googlebot 확인 시 AdSense gate 를 조기 재판정할 수 있다"** 고 정했다.

```
조건      verified Search Googlebot 확인 ✅ 성립 (29건 · 공식 IP)
          → ads.txt·AdSense crawler 를 더하지 않아도 충족한다
의미      **gate 를 다시 판단할 시점이 왔다는 것이지 자동 GO 가 아니다**
추가 입력  Mediapartners-Google (AdSense crawler) 방문 5건
          Google-adstxt 가 약 4시간 주기로 /ads.txt 수집 20건
현재 상태  **AdSense — HUMAN DECISION REQUIRED**
          technical crawl-access uncertainty substantially reduced
판정      **포그린 결정 사항.** 이 문서가 GO/HOLD 를 결정하지 않는다
```

**Search Googlebot 과 AdSense crawler 는 별개다.** Google 이 Mediapartners-Google 을
별도 AdSense crawler 로 명시한다.

🚫 **따라서 Stop 페이지의 Search crawl 0건을 AdSense 재신청의 자동 HOLD 조건으로 만들지 않는다.**
두 사안은 연결되지 않는다.

### 7.3 이번 판독이 바꾸지 않은 것

```
RT-2 확대        HOLD 유지 — 제품 근거 부족이 사유. 이번 로그와 무관
RT-3 지도        미승인 유지
EN realtime      미승인 유지
Stage 2          미승인 유지
```

---

## 8. 이번 라운드에서 하지 않은 것

```
Caddy 설정 변경 0 · reload 0 · restart 0 · Production 0 · 서버 파일 생성 0(스냅샷은 /tmp)
제품 코드 0 · GSC/GA4 호출 0 · sitemap 재제출 0 · Request Indexing 0 · route recrawl 0
내부링크 변경 0 · AdSense 신청 0 · robots.txt 변경 0
```

서버에서는 **읽기 명령과 검증용 HTTP GET 소수**만 실행했다.

---

## 9. CC 이견 및 아이디어

**이견 1 — 가장 큰 산출물은 "원인 후보가 좁혀진 것" 이다.** 그동안 우리는 "구글이 오긴 오는가"
조차 몰랐다. 이제 관측창 안에서 온다는 것과, robots·sitemap·페이지 응답 어디에도 기술적
차단이 없다는 것이 확인됐다. 남은 질문은 **"sitemap 수집 후에도 Stop URL 요청이 왜 0건인가"**
이고, 이건 서버 쪽에서는 더 파낼 수 없는 영역이다.

**이견 2 — 표본이 28.7시간뿐이다.** Googlebot 의 노선 페이지 크롤은 하루 1~2건 수준이었다.
이 속도라면 Stop 페이지 14개가 순번상 아직 안 온 것일 가능성도 배제할 수 없다.
**"안 가져간다" 와 "아직 안 가져갔다" 를 이 표본으로 구분할 수 없다.** 며칠 더 쌓으면
갈린다 — 09-28 재판독의 실익이 여기 있다.

**이견 3 — AdSense 대기의 기술적 사유는 상당 부분 해소됐다.** 그동안 "구글이 우리 사이트를
실제로 못 읽는 것 아닌가" 가 대기의 핵심 근거였는데, 관측창 안에서 Search Googlebot 방문과
AdSense crawler 방문이 모두 확인됐고 기술적 차단도 발견되지 않았다.

다만 **Stop 페이지 Search crawl 0건은 여전히 미해결**이다. 두 사실이 서로 다른 방향을
가리키지만, **Search crawl 과 AdSense 심사는 별개 크롤러·별개 경로**이므로 전자를 후자의
선행조건으로 둘 근거는 약하다. 그래도 이번 판독이 재신청을 **자동으로 정당화하지는 않는다.**
판단은 포그린 몫이다.

**이견 4 — 위장 IP 건은 조치 대상이 아니라고 본다.** 461건 전부 404 고 가져간 것이 없다.
차단(fail2ban·Caddy rate limit)을 검토할 수는 있으나 공유 Caddy 라 별도 라운드이며,
지금 트래픽량은 서버에 부담을 주는 수준이 아니다. **후보로만 남긴다.**

**아이디어 — 판독 스크립트를 도구로 만들 시점이 됐다.** 이번 판독에서 CC 가 오류를 두 번 냈다
(f-string 백슬래시 · googleusercontent 허용). 09-28 이후로도 반복할 작업이므로
`web/scripts/read-access-log.mjs` 같은 형태로 검증 로직을 고정하고 오프라인 QA 를 붙이면
회차 간 결과 일관성이 보장된다. **별도 승인 사항으로 후보 등록.**
