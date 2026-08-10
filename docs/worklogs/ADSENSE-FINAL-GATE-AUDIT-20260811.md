# AdSense 재신청 직전 Read-only Final Gate Audit

- **판정: APPLY-NOW**
- 실행일: 2026-08-11
- 대상: https://seoulautonomous.com (공개 Production만)
- 성격: READ-ONLY / 코드·문서·Git·서버·Docker·Caddy 변경 0
- 범위: AdSense 재신청을 막을 P0/P1 기술 결함 유무만 판정 (SEO 전수감사·콘텐츠 재평가 아님)

---

## 1. 판정

**APPLY-NOW — 현재 Production에서 AdSense 재신청을 막는 P0/P1 기술 결함 0건.**

BLOCK 조건 12개 중 실제 재현된 항목 0건.

---

## 2. Git 기준점

```
branch              main
HEAD                a11e904
origin/main         a11e904
ahead / behind      0 / 0
tracked 변경         0
untracked           7건 (기존 보존 대상, 무접촉)
reflog 최상단        a11e904 (신규 git 작업 0)
```

Production runtime `abb0ba7` ≠ Git HEAD `a11e904`는 docs-only 커밋 차이로 정상이며,
계약대로 이번 감사에서 재증명하지 않았다.

---

## 3. 주요 URL HTTP 결과

| 경로 | first | final | redirect | bytes |
|---|---|---|---|---|
| `/` | 307 | 200 | 1 → `/en` | 65,011 |
| `/ko` | 200 | 200 | 0 | 67,922 |
| `/en` | 200 | 200 | 0 | 65,011 |
| `/ko/routes` | 200 | 200 | 0 | 72,225 |
| `/en/routes` | 200 | 200 | 0 | 68,139 |
| `/ko/night-bus-map` | 200 | 200 | 0 | 143,263 |
| `/en/night-bus-map` | 200 | 200 | 0 | 58,422 |
| `/ko/about` | 200 | 200 | 0 | 49,911 |
| `/en/about` | 200 | 200 | 0 | 46,519 |
| `/ko/data-source` | 200 | 200 | 0 | 63,948 |
| `/en/data-source` | 200 | 200 | 0 | 60,948 |
| `/ko/privacy` | 200 | 200 | 0 | 98,277 |
| `/en/privacy` | 200 | 200 | 0 | 92,953 |
| `/sitemap.xml` | 200 | 200 | 0 | 18,477 |
| `/robots.txt` | 200 | 200 | 0 | 183 |
| `/ads.txt` | 200 | 200 | 0 | 59 |

redirect loop 0 · 5xx 0 · 빈 HTML 0 · production error page 0.
`/` → `/en` 1회 307은 의도된 동작.

---

## 4. robots.txt 판정 — PASS

실제 파일 (그룹 1개, Disallow 지시자 0건):

```
User-Agent: *
Allow: /

Sitemap: https://seoulautonomous.com/sitemap.xml

#DaumWebMasterTool:051e36391cd6ec53ad23440a51f2b96bca7103d0863e65384aa32ae8716cd2e0:...
```

문자열 grep이 아니라 `urllib.robotparser`로 규칙 상속·우선순위를 정식 파싱해
UA × 경로 매트릭스로 판정.

| User-agent | 검사 경로 12개 결과 |
|---|---|
| **Googlebot** | 전부 allow |
| **Mediapartners-Google** | 전부 allow |
| **AdsBot-Google** | 전부 allow |
| AdsBot-Google-Mobile | 전부 allow |
| Googlebot-Image | 전부 allow |
| `*` | 전부 allow |

검사 경로: `/` `/ko` `/en` `/ko/routes` `/en/routes` `/ko/night-bus-map`
`/ko/about` `/en/about` `/ko/data-source` `/ko/privacy` `/sitemap.xml` `/ads.txt`

- **Mediapartners-Google 판정: 차단 없음 (allow).** AdSense 심사 크롤러가 핵심 공개 콘텐츠 전 경로 접근 가능.
- **AdsBot-Google 판정: 차단 없음 (allow).** 사이트 전체에 Disallow가 0건이라, `*` 그룹을 무시하는 AdsBot 계열 특수 동작과 무관하게 차단이 성립하지 않음.

---

## 5. noindex / X-Robots-Tag 판정 — PASS

sitemap 공개 URL **53건 전수** 검사:

```
noindex / nofollow meta 보유 페이지    0 / 53
X-Robots-Tag 응답 헤더 보유 페이지      0 / 53
```

faq · how-to-ride · updates · route detail 포함 전 페이지 clean.
경로는 추측하지 않고 실제 sitemap.xml에서 도출.
404 페이지에만 noindex 존재 — 정상.

---

## 6. Canonical 대표 샘플 — PASS

10개 대표 URL 전부 자기 URL 자기참조:

```
/ko                 → https://seoulautonomous.com/ko                 OK
/en                 → https://seoulautonomous.com/en                 OK
/ko/routes          → https://seoulautonomous.com/ko/routes          OK
/en/routes          → https://seoulautonomous.com/en/routes          OK
/ko/night-bus-map   → https://seoulautonomous.com/ko/night-bus-map   OK
/en/night-bus-map   → https://seoulautonomous.com/en/night-bus-map   OK
/ko/about           → https://seoulautonomous.com/ko/about           OK
/en/about           → https://seoulautonomous.com/en/about           OK
/ko/data-source     → https://seoulautonomous.com/ko/data-source     OK
/en/data-source     → https://seoulautonomous.com/en/data-source     OK
```

53건 전수 기준:

```
canonical 누락                 0
중복 canonical                 0
localhost/staging/vercel 호스트  0
자기 URL 불일치                 0
```

hreflang은 계약대로 검사·변경하지 않음.

---

## 7. Sitemap 무결성 — PASS

```
XML 파싱            OK (urlset)
공개 URL            53
unique              53
중복                0
localhost/staging   0
non-200             0   (53/53 = 200)
```

기존 기준 53개와 동일.
lastmod · changefreq · priority · x-default는 계약대로 검사 대상 제외.

---

## 8. 404 매트릭스 — 4/4 PASS

```
/nonexistent                    404   (29,025 B)
/en/nonexistent                 404   (8,476 B)
/ko/nonexistent                 404   (8,476 B)
/en/routes/nonexistent-route    404   (29,771 B)
```

soft-404 아님 — 실제 404 status + `<h1>404</h1>` + noindex.
sitemap 53건 전수에서도 5xx 0건.

---

## 9. 내부 링크 — PASS

53개 공개 페이지 전부에서 `<a>` 추출 → 고유 내부 타겟 53개 전수 status 검사.

```
broken 내부 링크            0
localhost/staging href      0
locale 오연결               0
sitemap 밖 링크 타겟         0
내부 링크 0인 sitemap URL    0
```

---

## 10. Privacy / About / Data Source 접근성 — PASS

전부 200 · 정상 렌더 · 빈 페이지 아님.
푸터 경유로 사이트 전역에서 도달 가능.

```
/ko/privacy       inbound 내부 링크 28
/en/privacy       inbound 내부 링크 25
/ko/about         inbound 내부 링크 28
/en/about         inbound 내부 링크 25
/ko/data-source   inbound 내부 링크 28
/en/data-source   inbound 내부 링크 25
```

내용 재평가·재작성은 하지 않음.
E-E-A-T · 운영자 소개 · Organization schema는 이번 게이트의 BLOCK 조건이 아님.

---

## 11. ads.txt 실제 상태 — 이상 없음

```
HTTP status       200
Content-Type      text/plain; charset=UTF-8
Content-Length    59
body              google.com, pub-7976139023602789, DIRECT, f08c47fec0942fa0
HTML error page   아님 (평문 1줄, 형식 정상)
```

publisher ID `pub-7976139023602789`가 다음 3곳에서 **완전 일치**:

```
라이브 ads.txt                        pub-7976139023602789
web/public/ads.txt                    pub-7976139023602789
web/app/[locale]/layout.tsx:59        ca-pub-7976139023602789
```

잘못된 publisher ID · 불일치 · HTML 오류 응답 어느 것도 없음.

---

## 12. AdSense script 최소 점검 — 이상 없음

```
<script src=...adsbygoogle.js> 태그       페이지당 정확히 1개 (53/53)
검출된 client ID                          ca-pub-7976139023602789 단일 (53/53)
중복 삽입                                 0
localhost/staging publisher 설정           0
load error                                0 (스크립트 자체 정상 로드)
<ins class="adsbygoogle"> 광고 슬롯        0
inline adsbygoogle.push                   0
```

초기 문자열 스캔에서 페이지당 2회가 나왔으나 실물 태그로 재검증한 결과
**실제 script 태그는 1개**이고 나머지 1회는 Next.js RSC 페이로드 내 문자열이었음
(도구 오판이며 중복 삽입 아님).

광고 슬롯 · Auto ads 미구현은 계약대로 BLOCK 사유로 삼지 않음.

---

## 13. Chromium runtime 결과 — PASS

`/en` `/ko` `/ko/routes` `/ko/night-bus-map` × desktop 1440 / mobile 390
(isMobile · hasTouch · iPhone UA)

```
status                 200 × 8
hydration failure      0
uncaught exception     0
React fatal error      0
blank screen           0   (본문 텍스트 854~4,174자 정상)
h1                     1 × 8
header/nav 링크         6 × 8
footer 링크             10~12
Application error      0
```

관찰된 2건은 실증 결과 **결함 아님**:

**① googleads 403 (1건)**
`googleads.g.doubleclick.net/pagead/ads?client=ca-pub-7976139023602789` → 403.
승인 전 계정이라 광고 요청이 거절되는 정상 동작.
Round 26 배포 QA 기준선("console 오류 googleads 403 외 0")과 동일.
오히려 AdSense 스크립트가 올바른 publisher ID로 실제 발화 중이라는 방증.

**② `?_rsc=` prefetch ERR_ABORTED**
클라이언트 prefetch 취소.
동일 URL을 서버에 직접 요청하면 `200 text/x-component` 정상 응답 (3건 표본 실측).

---

## 14. 모바일 390px 기본 렌더 — PASS

```
horizontal overflow        0 px (4/4 페이지)
scrollWidth ≤ clientWidth   전건 충족
```

---

## 15. P0 목록

**0건.**

---

## 16. P1 목록

**0건.**

---

## 17. P2 / 후속 후보

이번 게이트 범위에서 새로 발견된 P2 **0건**.

§14 무시 항목(Pretendard · lastmod · OG 이미지 · hreflang 구조 · x-default ·
schema · 캐시 · HSTS · IndexNow · llms.txt · Round 27 기능 재감사)은
열지 않았고 판정에 섞지 않음.

---

## 18. AdSense 재신청 전에 반드시 수정해야 할 것

**없음.**

§16-12(기록 모순 여부)는 A안대로 공개 HTTPS만으로 판정:

```
night-bus-map <svg> 요소            20개 (지도 정상 존재)
night-bus-map 전체화면 진입 단서     존재
A160 상세 raw "Unknown" 노출        0
A160 상세 단일요금 "1,200" 노출      0
A160 상세 무범위 "Verified" 단정     0
A160 상세 재확인·미확인 표현         존재 (C2O 상태 모델 반영)
A741 상세 공식확인 요금 표기         존재
routes 목록 구버전 "Last stop:"      0
```

기록과 모순되는 상태 관찰 **0건**.
runtime revision `abb0ba7`는 계약대로 재증명하지 않음.

---

## 19. 변경 0 확인

```
코드 변경           0
문서 변경           0
git 변경            0   (HEAD·origin 동일, tracked 변경 0, reflog 신규 항목 0)
서버 접속           0   (SSH · docker inspect · docker ps 전부 미실행)
Docker 변경         0
Caddy 변경          0
AdSense 신청        미실행
Search Console      미접속
sitemap 재제출      0
```

모든 산출물은 세션 scratchpad에만 기록.

---

## 검사 도구 안전선 적용 기록

계약 §6에 따라 다음을 적용했고, 실제로 도구 결함 2건을 잡아냈다.

```
① zsh 워드 분할 미적용으로 첫 URL 루프가 헛돌음
   → while read 방식으로 교체 후 재실행 (0건 판정으로 넘기지 않음)
② SSR one-line HTML에 grep -c 사용 금지
   → 개수는 정규식 findall / grep -o | wc -l, 텍스트는 파서로 처리
③ AdSense 스크립트 "페이지당 2회" 초기 수치
   → 실물 태그 재검증으로 1개임을 확인 (중복 오판 방지)
④ 403 · ERR_ABORTED 관찰 건도 결함 단정 전 서버측 응답으로 재실증
⑤ 축약 SHA와 full SHA 혼용 금지
⑥ set +e 로 셸 조기 종료 격리 (미검사 항목의 PASS 오처리 방지)
⑦ 존재하지 않는 추정 URL 검사 금지 — 전 URL을 실제 sitemap에서 도출
```

---

## 최종 결론

**APPLY-NOW — 현재 Production에서 AdSense 재신청을 막는 P0/P1 기술 결함 0건.**

계약 §18에 따라 AdSense 신청 자체는 실행하지 않았다.
재신청 실행 여부는 포그린이 별도로 결정한다.
