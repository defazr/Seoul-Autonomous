# Round 26 통합 Pre-Deploy Local Audit 보고서

작성일 2026-08-03 · Claude Code · 저장소·라이브 무변경 · 판정 PASS

---

## A. 좌표와 작업 트리

```
branch      main
HEAD        1682447
origin/main 6ce1c70
ahead       5 commits
live        ef0274a
push        0
deploy      0
```

검증 대상 5커밋

```
1682447  C3   노선별 콘텐츠·FAQ q1 재설계
7364d42  C2O  운영정보 상태 모델
b36ed11  C2E  영문 정류장 화면 연결
c6d7290  C1E  공식 영문 정류장 데이터 파이프라인
a5307b3  26-B/B.1 콘텐츠 신뢰·locale navigation
```

코드 미커밋 0건. 루트 `data/routes.json`과 `web/data/routes.json` 미커밋 0건.
오디트 전후 `git status --short` 완전히 동일.
작업 트리에는 기존 문서만 존재 (SESSION-HANDOFF.md 수정분, 미추적 문서 6건, round19 지시서, route/).

---

## B. typecheck와 build

`.next`를 삭제하고 fresh build 실행. 삭제 전 안전 확인으로 `.gitignore` 17행에 `/.next/` 등재, 추적 파일 0개를 확인했다.

```
npx tsc --noEmit   exit 0   출력 0줄
npm run build      exit 0
신규 warning        0건
BUILD_ID           obQBehmISEWW-G-Cngarb
라우트              20개
```

`middleware 파일 규약 deprecated` 경고 1건은 origin 이전부터 있던 Next.js 프레임워크 경고이며 이번 릴리스와 무관하다.

---

## C. 공개 URL·SEO·404

```
sitemap URL      53개
중복 URL         0
design-preview   미포함
HTTP 200         53/53
5xx              0
```

404 매트릭스

```
404  /en/nonexistent
404  /ko/nonexistent
404  /nonexistent
404  /en/routes/nonexistent
```

design-preview는 `web/app/design-preview/layout.tsx`가 production에서 `notFound()`를 호출하는 의도된 차단이다.

```
404  /design-preview
308  /design-preview/
```

53개 전 페이지 검사 결과 canonical 정확히 1개, title 누락 0, description 누락 0.

### hreflang 없는 페이지 5건 — 회귀 아님

```
/ko/updates/night-bus-map-launch
/ko/night-bus-map
/en/night-bus-map
/ko/night-bus-fare
/ko/after-last-train
```

origin 소스와 대조한 결과 `languages` 설정이 origin에도 없었다(3개 파일 모두 origin 0 / HEAD 0). `night-bus-map/page.tsx` 19행에 "Metadata: ko only, no en alternates", 26행에 "EN guide metadata: self-canonical, no hreflang link to ko"로 의도가 코드에 명시돼 있다.

실제로 en 대응 URL이 404다.

```
404  /en/night-bus-fare
404  /en/after-last-train
404  /en/updates/night-bus-map-launch
```

`/en/night-bus-map`은 200이지만 같은 slug의 별도 영문 텍스트 가이드로, 상호 hreflang 없음이 25-E에서 확정된 설계다.

---

## D. 26-B/B.1 계약

53개 전 페이지의 사용자 가시 영역에서 금지 문자열 노출 0건.

```
Unknown            0
Not confirmed      0
undefined          0
NaN                0
[object Object]    0
```

ko/en 공통 페이지 12개 전부 200. locale 전환과 ko 전용 페이지의 en 토글 정상.

---

## E. C1E·C2E 통합

### 데이터 계약

```
정류장 레코드        307
고유 stopId          267
SSOT lookup          267/267
공식 영문명           261
fallback stopId       6
렌더 fallback 행       7   (02247이 cheonggye-a01에 2회)
routes.json nameEn non-null   0
```

fallback stopId

```
02247  06510  13243  13257  14628  20169
```

### 화면 검증 (22개 노선 페이지 전수)

```
한국어 307행   보조줄 0
영어   307행   펼침 목록 보조줄 0
표시명 불일치   0
```

### StopsList 계약

```
use client              0
DISCLOSURE_THRESHOLD    5
PREVIEW_LIMIT           3
<details>               1
<summary>               1
<ol>                    3
```

A160 영어 페이지

```
총 행     90  (전체 87 + 미리보기 3)
닫힘 가시  3
열림 가시  87
화면 중복  0
```

---

## F. C2O 통합

### 48셀

```
총 셀          48   (고정노선 11×4 + 로보택시 1×4)
official_confirmed   7
media_reference      3
unverified          38

confirmed                7
reverification_required  5
unverified              36

불변식 위반              0
운영정보 4필드 Unknown    0
```

### 화면

공식확인 노선

```
saebyeok-a741   당분간 무료 · 교통카드 태그 · 공식 출처
saebyeok-a148   당분간 무료 · 교통카드 태그 · ㈜에스유엠 · 공식 출처
```

재확인 5개 노선 (전부 재확인 문구 표시, 금액 노출 0)

```
saebyeok-a160    금액 0
cheonggye-a01    금액 0
dongjak-a01      금액 0
dongdaemun-a01   금액 0
seodaemun-a01    금액 0
```

A160의 1,200원 노출 0건.

로보택시

```
요금 4구간 표시     22:00–23:00 5,800 / 23:00–02:00 6,700 / 02:00–04:00 5,800 / 04:00–05:00 4,800
실시간 호출 표시     정상
OFFICIAL 배지       정상
official_pending    0
```

---

## G. C3 통합

### FAQ q1 유형 분포

```
첫·마지막 stopId 동일      2   cheonggye-a01, seodaemun-a01
이름 동일·stopId 다름      5   saebyeok-a160, saebyeok-a741, simya-a21, dongjak-a01, saebyeok-a504
첫·마지막 이름 다름        4   saebyeok-a148, dongdaemun-a01, sangam-a21, cheongwadae-a01
```

22개 페이지 전수에서 first·turnaround·last 정확, keyStopIds 렌더 일치, 반환점 전 노선 정확히 1개.

### ko/en 사실 일치

```
정류장 수치 불일치   0
keyStopIds 불일치    0
```

### FAQ 항목 수 6개인 노선 3건 — 결함 아님

```
saebyeok-a741   days=Unknown  headway=Unknown
saebyeok-a148   days=Unknown  headway=Unknown
saebyeok-a504   days=Unknown  headway=Unknown
```

`page.tsx` 498행의 조건부 렌더가 운행일과 배차가 모두 미확인이면 q3을 숨긴다. 26-B가 만든 정직성 설계이며 이번 라운드 변경이 아니다.

---

## H. 브라우저·접근성

```
Enter 로 disclosure 열림    정상
Space 로 닫힘               정상
summary 가 details 직접 자식  예
H1 개수                     1
헤딩 순서                   H1 > H2 > H3 > H3 > H3 > H3 > H2
모든 li 가 ol/ul 직계        예
```

JS 비활성은 실기기 검증이 아니다. 초기 서버 HTML에 네이티브 `<details>/<summary>`와 전체 정류장 목록이 포함되고 StopsList에 client 상태·이벤트 의존성이 없다는 근거로만 보고한다.

---

## I. 모바일

Playwright 모바일 에뮬레이션(`isMobile: true`, `hasTouch: true`), Chrome for Testing 1228.

```
검사 대상    17개 페이지 × 320/360/390 = 51조합
overflow 실패  0
scrollX       전부 0
googleads 403 외 console 오류   0
```

클래식 데스크톱 320px에서 나타나던 기존 GlobalHeader 스크롤바 현상은 실제 모바일 오버레이 조건과 구분해 기존 기술부채로 이월한다.

---

## J. client bundle 격리

`/routes` HTML과 `.next/static` 양쪽에서 0건

```
nttNo=455157             0 / 0
nttNo=456237             0 / 0
㈜에스유엠                0 / 0
transition_due           0 / 0
reverification_required  0 / 0
keyStopIds               0 / 0
OA-12830                 0 / 0
nameEnOfficial           0 / 0
```

`verificationGrade`가 static chunk 1건 검출됐으나 확인 결과 design-preview mock 청크(`09z2pdqgm3w~g.js`)이며 실제 노선 데이터는 없다.

```
saebyeok-a160        0
도봉산역광역환승센터     0
㈜에스유엠             0
nttNo                0
transition_due       0
cheonggye-a01        1  (mock 더미 id)
```

로보택시 공식 출처(516542)만 의도대로 `/routes`에 1건 노출된다.

---

## K. Codex 독립 통합 감사

```
P0   Clean
P1   Clean
P2   Clean
기존 기술부채   배포 차단 사유 없음
```

12개 통합 항목 전부 clean. Codex가 독립적으로 재확인한 수치가 본 보고서와 전부 일치한다.

주요 확인 사항

```
5커밋 간 타입·데이터 계약 충돌      없음
C1E SSOT 와 C3 정류장명 resolver    동일 resolver 사용, 페이지 내 불일치 없음
C2O FAQ q4 와 C3 FAQ q1            독립 생성, 상호 간섭 없음
route-context stopId               타노선·미존재 0
endPoint 재사용                    boarding·turnaround 경로에 0 (카드·목록 요약에만 유지)
운영정보 비공식 값 노출              0
client payload 유출                0
ko/en 핵심 사실 불일치              0
Unknown 사용자 노출                 0
metadata·SEO 회귀                  없음
docs 가 코드 커밋에 혼입             5커밋 모두 0
루트 data/routes.json 변경          0
```

---

## L. 기존 기술부채 (이번 릴리스와 무관, 배포 차단 아님)

```
ko/en 메시지 키 비대칭 4건
  siteFooter.nightBusFare, siteFooter.afterLastTrain (ko만)
  home.mapPromo.title, home.mapPromo.description (en만)

모바일 320px 클래식 스크롤바 조건의 GlobalHeader 현상
  실제 모바일 오버레이 조건에서는 overflow 0

/ko/updates title suffix 누락

Next.js middleware 파일 규약 deprecated 경고
```

---

## M. 사용자 로컬 검수 순서

서버는 3000포트에 유지 중이다. 재기동이 필요하면 `web` 폴더에서 다음을 실행한다. 이미 빌드돼 있어 바로 뜬다.

```
node .next/standalone/server.js
```

### 1차 한국어

```
1   http://localhost:3000/ko
2   http://localhost:3000/ko/routes
3   http://localhost:3000/ko/routes/saebyeok-a148      공식 요금·운영사
4   http://localhost:3000/ko/routes/saebyeok-a160      재확인 요금·87 정류장
5   http://localhost:3000/ko/routes/cheonggye-a01      동일 stopId 순환
6   http://localhost:3000/ko/routes/sangam-a21         반환점 ≠ 마지막 정류장
7   http://localhost:3000/ko/routes/dongjak-a01        콘텐츠 보강 결과
8   http://localhost:3000/ko/routes/cheongwadae-a01    5개 정류장
9   http://localhost:3000/ko/routes/late-night         로보택시
10  http://localhost:3000/ko/data-source
11  http://localhost:3000/ko/faq
12  http://localhost:3000/ko/about
13  http://localhost:3000/ko/how-to-ride
14  http://localhost:3000/ko/night-bus-map
```

### 2차 영어

같은 순서를 `/en`으로 반복한다. 단 `night-bus-map`은 같은 slug의 별도 영문 가이드다.

### 3차 나머지 6개 노선

```
saebyeok-a741   simya-a21   dongdaemun-a01
seodaemun-a01   saebyeok-a504
```

ko/en 양쪽으로 확인한다.

### 4차 모바일 320 또는 실제 아이폰

```
/ko
/ko/routes/saebyeok-a148
/ko/routes/saebyeok-a160
/ko/routes/sangam-a21
/ko/routes/late-night
/ko/faq
```

### 체크 항목

```
문구 사실성            데이터에 없는 주장이 없는가
ko/en 의미 일치        같은 사실을 말하는가
정류장명               목록·한눈에보기·주요정류장·FAQ 가 같은 이름인가
반환점·마지막 정류장     구분되는가
요금·운영정보          확인된 것만 나오는가, 미확인이 빈 행으로 나열되지 않는가
줄바꿈                 긴 영문 정류장명이 깨지지 않는가
버튼·링크              카카오맵·내부 링크가 동작하는가
모바일 폭              가로 스크롤이 생기지 않는가
```

---

## N. 범위 확인

```
코드 변경    0
docs 변경    0
stage        0
commit       0
push         0
deploy       0
```

---

Round 26 전체 통합 로컬 기술 오디트를 완료했으며 저장소와 라이브에는 아무 변경도 하지 않았습니다. 로컬 서버를 사용자 최종 화면 검수용으로 유지하고 승인 전에는 push·deploy하지 않습니다.

---

## 후속 상태

```
2026-08-03  사용자 로컬 전체 화면 검수 완료 및 최종 승인
2026-08-03  로컬 서버(3000) 종료, 포트 해제 확인
2026-08-03  최종 read-only 확인 — HEAD 1682447 기준 코드 미커밋 0
```

위 오디트 결과와 수치는 검증 시점 그대로이며 소급 수정하지 않는다.
