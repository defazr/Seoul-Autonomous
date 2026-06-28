# Seoul Autonomous — Round 22 최종 계획서

> 작성일: 2026-06-28
> 상태: Claude UI + GPT 100% 의견 일치 완료. Claude Code 지시서 작성 대기.
> 다음 세션 시작 시 이 문서부터 읽는다.

---

## 0. 한 줄 요약

지도 페이지(/ko/night-bus-map)를 검색 대표 페이지로 재정의하고 업데이트 글을 지원 문서로 분리한다. 그 전에 개인정보처리방침을 GA4 실제 운영에 맞게 정정한다.

---

## 1. 배포 순서 (확정)

| 차수 | 라운드 | 내용 | 다음 차수까지 간격 |
|------|--------|------|---------------------|
| 1차 | **Round 22-Privacy** | 개인정보처리방침 정정 (ko/en) | 몇 시간 ~ 다음 날 |
| 2차 | **Round 22** | 지도 페이지 + 업데이트 글 | 같은 날/다음 날 가능 |
| 3차 | **Round 23** | GA4 행동 이벤트 8개 | 같은 날/다음 날 가능 |
| 4차 | **Round 24** | AdSense 준비 + 스크립트 | 선행조건 충족 후 |

**D28 = title 재변경 금지 관찰 기간이지 Round 23·24 금지 기간 아님.**

---

## 2. Round 22-Privacy (1차 배포)

### 2.1 작업 범위

- /ko/privacy 본문 정정
- /en/privacy 본문 정정
- "본 앱" → "본 웹사이트"
- title·meta description·H1 점검 (audit에서 안 잡힌 부분)
- 시행일·최종 수정일 갱신

### 2.2 메타

**한국어:**
- title: `개인정보처리방침 Seoul Autonomous`
- H1: `개인정보처리방침`
- meta description: `Seoul Autonomous의 Google Analytics 및 쿠키 사용, 자동 처리 정보, 이용 목적, 보유 기간, 제3자 처리와 이용자 선택 방법을 안내합니다.`

**영어:**
- title: `Privacy Policy Seoul Autonomous`
- H1: `Privacy Policy`
- meta description: `Learn how Seoul Autonomous uses Google Analytics and cookies, what data is processed, why it is used, how long it is retained, and what choices users have.`

### 2.3 필수 고지 항목

1. **적용 대상** — seoulautonomous.com과 해당 언어 페이지
2. **직접 입력받는 정보** — 회원가입·결제 없음. 다만 GA4 자동 처리 정보 있음
3. **Google Analytics 사용** — GA4 측정 ID G-ND7JGQ62QX, Google이 제3자 서비스 제공자
4. **자동 처리 정보 8개:**
   1. 방문 페이지와 URL
   2. 페이지 제목과 이전 방문 페이지 또는 유입 경로
   3. 접속 일시와 세션 및 이용 통계
   4. 브라우저와 기기 유형 및 화면 정보
   5. 언어 설정
   6. 대략적인 국가 도시 또는 지역 정보
   7. 스크롤·이탈·링크 클릭·사이트 검색·양식·동영상·파일 다운로드 등 이용 이벤트
   8. 쿠키 또는 유사 식별자
5. **IP 주소** — "대략적인 지역 정보 산출 과정에서 처리될 수 있으나 개별 IP 주소는 Analytics에 기록·저장되지 않습니다"
6. **쿠키**
   - `_ga` / `_ga_*` (속성별)
   - 용도: 이용자 구분·세션 상태 유지·통계 측정
   - 기간: **기본 만료 2년, 브라우저 정책과 이용자 설정에 따라 더 짧아질 수 있음**
7. **이용 목적** — 방문자 통계·페이지 분석·유입 분석·오류 개선·UX 개선 (맞춤 광고 미기재)
8. **보유 기간**
   - 사용자 수준 데이터: **최대 14개월**
   - 이벤트 수준 데이터: **최대 2개월**
   - 새 사용자 활동 발생 시 사용자 식별자 보유 기간 재설정: 켜짐
   - 비집계 데이터에 적용됨을 명시 ("모든 데이터는 2개월 후 삭제됩니다" 금지)
9. **제3자·국외 처리** — Google 또는 Google 인프라를 통해 대한민국 외 지역에서 처리될 가능성. 구체 국가·서버 위치 단정 금지
10. **이용자 선택권** — 쿠키 차단·삭제, 추적 방지, GA 차단 부가기능
11. **Consent Mode 현황** — 공개 문안에 동의 기능 있는 것처럼 표현 금지. AdSense 도입 전 별도 라운드
12. **문의** — support@fazr.co.kr
13. **시행일·최종 수정일** — 실제 배포일

### 2.4 작성 금지 표현

- "본 앱"
- "어떠한 개인정보도 수집하지 않습니다"
- "제3자 분석 서비스를 사용하지 않습니다"
- "외부 서버로 정보를 전송하지 않습니다"
- "IP 주소를 저장합니다"
- "IP 주소를 전혀 처리하지 않습니다"
- "모든 데이터는 2개월 후 삭제됩니다"
- "Google signals를 사용하지 않으므로 추적하지 않습니다"
- "광고 개인 최적화를 사용하고 있습니다"
- "AdSense를 사용하고 있습니다"
- "법적 요구사항을 완전히 충족합니다"

### 2.5 GA4 실제 운영 상태 (방침 작성 근거)

- 측정 ID: G-ND7JGQ62QX
- 설치: `@next/third-parties/google` 의 `<GoogleAnalytics>` 컴포넌트 1회 설치 (web/app/[locale]/layout.tsx:57)
- Google Tag Manager: 미사용
- 쿠키 override: 없음
- Consent Mode: 미구현
- 동의 배너: 없음
- 커스텀 이벤트: 0개
- AdSense: 미설치
- Google Ads: 미연결
- Google signals: **꺼짐**
- 광고 개인 최적화: 켜짐 (그대로 둠 — Google Ads 미연결이라 실제 활용 없음)
- 향상된 측정: 스크롤·이탈 클릭·사이트 검색·양식·동영상·파일 다운로드 켜짐, 페이지 조회 꺼짐
- 자동 이벤트: page_view·session_start·user_engagement·first_visit·scroll·click

---

## 3. Round 22 (2차 배포) — 지도 페이지 + 업데이트 글

### 3.1 지도 페이지 (/ko/night-bus-map) 최종 메타

**title:**
```
서울 심야버스 노선과 N버스 환승 노선도
```

**H1:**
```
서울 심야버스 노선과 환승 노선도
```

**meta description:**
```
서울 심야버스 노선과 N버스 환승 경로를 한눈에 확인하세요. 올빼미버스 14개 노선과 심야A21의 주요 경유지와 환승역을 보고 출발역과 도착역을 선택해 직통 또는 환승 경로를 찾을 수 있습니다.
```

**subtitle:**
```
대리기사, 야간근무자, 막차 이후 귀가자를 위한 서울 심야버스 지도
```

(title은 장식용 구두점 제거 원칙 유지. subtitle·meta·본문은 정상적인 문장부호 사용.)

**상단 intro:**
```
서울 심야버스 노선과 환승 경로를 한눈에 확인할 수 있는 노선도입니다. 올빼미버스 N버스 14개 노선과 자율주행 심야버스 A21의 주요 경유지와 환승역을 보여줍니다. 출발역과 도착역을 선택하면 직통 또는 환승 경로를 찾을 수 있습니다. 대리운전이 끝난 뒤 귀가하거나 야간근무를 마치고 퇴근할 때 막차 이후 이동 경로를 찾는 데 활용할 수 있습니다.
```

**OG·Twitter title/description:** title·meta description과 동기화

### 3.2 지도 페이지 DOM 순서 (최종)

```
1. 뒤로가기
2. H1
3. subtitle
4. 상단 intro
5. 기준일
6. 짧은 기능 안내 (사용자 안내형)
7. NightBusMap (SVG·UI 전체)
8. H2: 서울 심야버스 노선도 한눈에 보기
9. 본문 1개 문단 (기본) — 페이지 역할·지도 범위·기능 안내·도식 한계
10. 축약된 정확성 고지 박스
11. 환승 허브 섹션
12. 노선별 핵심 경유지
13. 지도 앱에서 확인하는 방법
14. 이용 전 확인 사항
15. footer
```

**핵심:**
- 고지 박스 위치: SVG 후 + H2 + 본문 1개 문단 뒤
- H2 직후 본문은 **1개 문단 기본**, 정보가 다를 때만 2개로 분리
- 같은 키워드 반복하기 위해 문단 늘리지 않음

### 3.3 지도 위 기능 안내 (변경)

**기존:**
```
노선 클릭=강조 · 역 클릭=경유 노선 · 2개 이상 선택=공유 환승역 깜빡 · 선은 직접 작도
```

**변경:**
```
노선을 선택하면 해당 경로가 강조됩니다. 출발역과 도착역을 입력하면 직통 또는 환승 경로를 확인할 수 있습니다.
```

**"선은 직접 작도" 처리:**
- 지도 위 사용법에서 삭제
- 저작권 고지 별도 이동 작업 안 함
- footer 저작권 표시 그대로 유지
- 제작 사실 caption은 필수 아님 (필요시 지도 아래 작은 글씨로 검토)

### 3.4 정확성 고지 박스 (축약)

```
이 노선도는 서울 심야버스의 주요 경유지와 환승 구조를 빠르게 파악하기 위한 도식입니다. 환승 지점은 권역 기준으로 표시되어 실제 정류장 사이에 이동이 필요할 수 있습니다. 탑승 전에는 정류장 위치와 운행 방향과 도착 시간을 네이버지도 카카오맵 또는 서울시 안내에서 확인하세요.
```

**삭제할 반복 표현:**
- "서울시 심야버스 전체 정보를 공식처럼 대체하지 않습니다"
- "정밀 재현한 지도가 아닙니다"
- "보장하지 않습니다"
- "자율주행 검증 노선은 A21만 해당합니다" (상단 intro·범례에 이미 있음)

### 3.5 JSON-LD 추가

지도 페이지에 다음 2개 추가:

**WebPage** (필수 속성)
- `@context`
- `@type`: WebPage
- `name`
- `description`
- `url`
- `inLanguage`: ko
- `isPartOf`:
  ```json
  "isPartOf": {
    "@type": "WebSite",
    "name": "Seoul Autonomous",
    "url": "https://seoulautonomous.com"
  }
  ```

**BreadcrumbList**
- 1번 항목 (홈): `https://seoulautonomous.com/ko`
- 2번 항목: `서울 심야버스 노선과 환승 노선도` → `https://seoulautonomous.com/ko/night-bus-map` (현재 지도 페이지 canonical)

**제외:**
- dateModified (자동 관리 SSOT 없음. 추후 별도 라운드)
- Article·BlogPosting·FAQPage·WebApplication·SoftwareApplication·Review·Rating

### 3.6 업데이트 글 (/ko/updates/night-bus-map-launch) 변경

**title:**
```
서울 올빼미버스 환승 지도 공개와 이용 방법
```

**H1:**
```
서울 올빼미버스 환승 지도 공개
```

**meta description:**
```
서울 올빼미버스 환승 지도를 공개했습니다. 지도에서 노선을 선택하고 출발역과 도착역을 입력해 직통과 환승 경로를 확인하는 방법을 안내합니다.
```

**CTA:**
```
서울 심야버스 노선과 환승 노선도 바로 보기
```

**유지 항목:**
- self-canonical
- index
- sitemap
- Article·FAQPage·BreadcrumbList JSON-LD
- datePublished
- 실제 수정일 기준 dateModified
- 절대 URL image

**금지:**
- 지도 페이지로 canonical 변경
- noindex
- 업데이트 글 삭제
- 지도 → 업데이트 역링크 추가
- title에 "서울 심야버스 노선도·N버스·올빼미버스·환승 지도" 동시 포함

기존 Article·FAQPage·BreadcrumbList의 headline·description·name은 변경된 title에 맞춰 동기화.

### 3.7 내부 링크 추가

**Round 22에서 추가:**

- **한국어 홈 (/ko)** → 지도 페이지 본문 **카드 또는 CTA 1개**
  - 앵커: `서울 심야버스 노선과 환승 노선도 보기`
  - 클릭 시 이동: `/ko/night-bus-map`
  - **형태 요구사항:**
    - 홈 본문에 시각적으로 인식되는 카드 또는 CTA 영역으로 배치
    - 단순 텍스트 한 줄 링크 처리 금지
    - 숨은 링크 처리 금지
    - 홈에 전체 노선도 SVG 직접 노출은 안 함 (홈 정체성 = 자율주행 교통 가이드 유지)
    - 기존 카드·CTA 컴포넌트 패턴 재사용 (새 디자인 체계 생성 금지)

- **한국어 how-to-ride** → 지도 페이지 본문 링크 1개
  - 앵커: `서울 심야버스 노선도에서 환승 경로 확인하기`
  - 클릭 시 이동: `/ko/night-bus-map`
  - **형태:** 심야 이동 확인 또는 탑승 전 경로 확인 문맥 안의 본문 링크

**Round 22에서 추가 안 함:**
- 모든 노선 상세 (simya-a21 제외)
- FAQ
- updates 목록 (지도 직접 링크)
- footer
- 전역 header
- /en 홈 (영문판 노선도 별도 라운드)

**기존 유지:**
- routes 배너
- simya-a21 CTA
- 업데이트 글 CTA

### 3.8 회귀검증 항목

- title
- meta
- H1
- OG·Twitter
- canonical
- JSON-LD
- DOM 순서
- 내부 링크
- /en/night-bus-map 404
- HTTP Link hreflang 미발생
- 전체화면
- 노선 칩
- 역 클릭
- 출발·도착 검색
- 직통 경로
- 환승 1회 경로
- 환승 2회 경로
- PNG 저장
- 모바일 pinch zoom

### 3.9 배포 후

- 네이버·구글 두 URL 재수집 요청
- 변경 반영일 기록
- D7·D14·D28 측정 (반영일 기준)
- **최소 D28까지 title 다시 변경 금지**

---

## 4. Round 23 (3차 배포) — GA4 행동 이벤트 8개

### 4.1 이벤트 목록

1. `night_bus_route_select`
2. `night_bus_station_select`
3. `night_bus_journey_request`
4. `night_bus_journey_result`
5. `night_bus_external_map_click`
6. `night_bus_fullscreen_open`
7. `night_bus_png_download`
8. `night_bus_reset`

### 4.2 journey_request 발화 조건

- 출발역·도착역이 모두 데이터에 존재하는 **유효한 station ID**로 확정
- 직전에 계산한 출발·도착 조합과 **다를 때**
- 경로 계산 시작 직전에 **1회** 발화
- 입력창에 글자만 친 상태에서는 발화 X
- 자동완성 후보 선택이나 유효 역 확정 뒤에만 발화

### 4.3 journey_result 발화 조건

- request에 대한 경로 계산 끝난 뒤 1회
- 결과 없어도 발화 (no_route)
- 결과 화면 재렌더 시 중복 발화 X

### 4.4 result_type 4종

- `direct`
- `one_transfer`
- `two_transfer`
- `no_route`

### 4.5 이벤트별 파라미터

**night_bus_route_select**
- `route_id`
- `action`: select | deselect

**night_bus_station_select**
- `station_id`
- `selection_context`: map | origin | destination

**night_bus_journey_request**
- `origin_station_id`
- `destination_station_id`

**night_bus_journey_result**
- `origin_station_id`
- `destination_station_id`
- `result_type`: direct | one_transfer | two_transfer | no_route
- `transfer_count`
- `route_sequence` (문자열)
  - 직통: `N16`
  - 환승 1회: `N16>N62`
  - 환승 2회: `N16>N62>N75`
  - 경로 없음: 빈 문자열 또는 미전송
  - **GA4에는 배열이 아닌 문자열로 전송**

**night_bus_external_map_click**
- `provider`: kakao | naver
- `target_type`: station | hub
- `target_id`

**night_bus_fullscreen_open** — 별도 필수 파라미터 없음

**night_bus_png_download** — 별도 필수 파라미터 없음

**night_bus_reset** — 별도 필수 파라미터 없음

### 4.6 운영 원칙

- 자유 입력 텍스트 및 역 검색창 원문 GA4 전송 금지
- 중복 방지: 컴포넌트 내부 ref 또는 출발·도착 조합 비교
- 분석용 고유 request ID GA4 전송 금지
- 개인정보 미전송
- DebugView로 중복 발화 확인 후 배포

---

## 5. Round 24 (4차 배포) — AdSense

### 5.1 선행 조건 (전부 충족 시 진행)

1. GA4 개인정보처리방침 정정 완료 (Round 22-Privacy)
2. AdSense 반영 개인정보처리방침 추가 정정안 준비
3. ads.txt 준비
4. 공개 layout 범위 확인
5. design-preview 제외
6. 중복 로드 방지
7. EEA·영국·스위스 CMP 준비
8. Consent 처리 검증

### 5.2 보관 중

AdSense 사이트 소유권 확인 스니펫 (애드센스 코드 통합형) — 신청 시 `[locale]/layout.tsx` `<head>` 박는 형태로 검토

---

## 6. 금지선 (전 라운드 공통)

- routes.json 변경 금지
- middleware.ts 변경 금지
- Caddy 변경 금지
- night-bus-data.ts 변경 금지 (노선 SVG 기하·좌표 1px도 보정 X)
- 실시간 표현 금지 ("Operating now", "Arriving in N min", "Real-time", "Currently running" 등)
- 추측·"최초"·"최단"·"최적" 등 검증 불가 표현 금지
- 통과분(라이브) 재수정 시 title/canonical/verification 안 건드리는 부분만
- alternateLinks: false 유지 (Round 16B)
- 노선도 ko 전용 (/en/night-bus-map, /en/updates/night-bus-map-launch 404 유지)
- "단계 분리·별 커밋·별 배포" 원칙 — 라운드 묶음 배포 금지

---

## 7. 보류 항목 (Round 22 차단 사유 아님)

- **/ko/updates title suffix 누락** — 별도 메타 일관성 audit 라운드
- **SSOT 체크리스트 추가** — Round 22 검증 완료 후 별도 docs only 커밋
- **네이버 수동 캡처 8개** — Round 22 배포 전 포그린 작업 (필수 3개 검색어: 서울 심야버스 노선 / 서울 심야버스 노선도 / 서울 n버스 노선도)
- **경로탐색 audit** (온수→양천·시흥동→개봉·연신내→신림동) — 별 라운드. 환승점 선택 로직 vs 환승 횟수 부족 audit 필요
- **TOPIS/길찾기 UX 결정** — Round 23 이벤트 1~2주 수집 후 판단
- **검색 결과 8개 제한 해제, 크롬 다크톤, 페르소나 롱테일 본문, 안드로이드 하드웨어 back, 영문판 노선도** — 후속

---

## 8. 다음 세션 진행 순서

1. **이 문서 먼저 읽기**
2. Privacy 문안 한·영 작성 (GPT 작성 → 검수)
3. Privacy Claude Code 지시서 작성
4. 구현 → 검증 → 배포 (1차)
5. Round 22 Claude Code 지시서 작성
6. 구현 → 검증 → 배포 (2차)
7. 네이버·구글 재수집 요청
8. Round 23 Claude Code 지시서 작성
9. 구현 → DebugView 검증 → 배포 (3차)
10. Round 24 선행 조건 충족 시 진행

---

## 9. 의사결정 기록 (참고)

- 광고 개인 최적화 토글: **그대로 둠.** 광고 개인 최적화 설정은 켜져 있으나 Google Ads 등 연결된 광고 제품은 현재 확인되지 않는다. 설정은 당장 변경하지 않고 유지하되 Round 24 시작 전에 광고 제품 연결 상태와 개인정보처리방침 및 동의 처리 범위를 다시 audit한다. Privacy 문서에는 현재 맞춤 광고를 제공한다고 쓰지 않는다.
- 1차 배포 후 2~3일 대기: **불필요** (몇 시간 ~ 다음 날로 단축)
- Round 23 D28 대기: **불필요** (D28은 title 재변경 금지 기간이지 다른 라운드 금지 아님)
- H2 아래 본문 2개 강제: **삭제** (1개 기본)
- "선은 직접 작도" 저작권 이동: **불필요** (제작 방식 문구지 저작권 아님)
- 쿠키 만료 vs 데이터 보유: **구분 표기**
- Consent Mode·CMP·ads.txt: **AdSense 신청 시 처리**

---

## 10. 협업 체제 (참고)

- 포그린: 총감독·작도·최종결정
- Claude UI: 지시서·진행 컨트롤·반려 판단
- Claude Code: 코딩 실행 (지시서만 따름, 독자 결정 금지)
- GPT: 태클·검토
- 디자인 Claude: 시각 시안·프로토타입

**원칙:** 의견 먼저 → 포그린 승인 → 작업. 커밋·푸시·배포 별도 명시적 승인.
