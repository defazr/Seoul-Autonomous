# Round 22A 오디트 보고서

> 작성일: 2026-06-28
> 작성자: Claude Code (Opus 4.6)
> 목적: Round 22 수정 전 라이브 페이지의 검색 신호·문서 구조·코드 상태를 사실로 확정
> 상태: 조사 완료. 코드 수정 0건.

---

## A. 확정 사실

### 지도 페이지 (`/ko/night-bus-map`)

| 항목 | 현재 값 |
|------|---------|
| title | `서울 심야버스 노선도 \| N버스·올빼미버스 환승 지도` (29자) |
| meta description | `서울 심야버스 노선과 노선도를 한눈에. N버스·올빼미버스 주요 환승 허브와 야간 이동 경로를 정리한 서울 밤버스 시각 가이드입니다.` |
| H1 | `서울 심야버스 노선도` |
| subtitle | `대리기사·야간근무자·심야 귀가자를 위한 서울 밤버스 이동 지도` |
| intro | `서울 심야버스 노선을 한눈에 볼 수 있도록 정리한 노선도입니다. 올빼미버스(N버스) 14개와 자율주행 심야A21까지, 서울 야간버스의 주요 환승 허브를 시각 가이드로 제공합니다.` |
| OG title | title과 동일 |
| OG description | meta description과 동일 |
| Twitter title/desc | title·meta description과 동일 |
| canonical | `https://seoulautonomous.com/ko/night-bus-map` |
| hreflang | 없음 (HTTP Link 헤더·HTML 모두) |
| robots meta | 없음 |
| html lang | `ko` |
| sitemap | `/ko/night-bus-map` 1건 (ko only, en alternate 없음, priority 0.7) |
| JSON-LD | **없음** (어떤 타입도 없음) |

### 업데이트 글 (`/ko/updates/night-bus-map-launch`)

| 항목 | 현재 값 |
|------|---------|
| title | `서울 심야버스 노선도로 보는 올빼미버스 N버스 환승 지도` (31자, 템플릿 suffix 없음) |
| meta description | `서울 올빼미버스와 자율주행 심야버스 A21 노선을 한 장에 정리한 인터랙티브 노선도입니다. 노선 선택, 환승 경로 검색, 크게 보기를 지원합니다.` |
| H1 | title과 완전 동일 (31자) |
| OG title | title과 동일 |
| OG description | meta description과 동일 |
| Twitter title/desc | title·meta description과 동일 |
| canonical | `https://seoulautonomous.com/ko/updates/night-bus-map-launch` |
| hreflang | 없음 |
| robots meta | 없음 |
| html lang | `ko` |
| sitemap | `/ko/updates/night-bus-map-launch` 1건 (ko only, priority 0.6) |
| JSON-LD | Article + FAQPage + BreadcrumbList (3개) |
| datePublished | 2026-06-14 |
| dateModified | 2026-06-14 |
| image | 절대 URL (`https://seoulautonomous.com/images/updates/updates-night-bus-map-01-full.jpg`) |
| FAQ | 8개 Q&A — 화면 표시 문장과 JSON-LD 일치 확인 |
| canonical = JSON-LD URL | 일치 확인 |

### 함께 확인한 주요 페이지 메타

| 페이지 | title | H1 | 지도 본문 링크 |
|--------|-------|-----|---------------|
| `/ko` (홈) | `Seoul Autonomous` | `서울의 자율주행 미래를 경험하세요.` | **없음** |
| `/ko/routes` | `노선 — Seoul Autonomous` | `노선` | `서울 심야버스 전체 노선도 보기 →` |
| `/ko/updates` | `업데이트` (suffix 없음!) | `업데이트` | 업데이트 글로만 링크 |
| `/ko/how-to-ride` | `서울 자율주행버스 타는 법 — Seoul Autonomous` | `서울 자율주행버스 타는 법` | **없음** |
| `/ko/faq` | `자주 묻는 질문 — Seoul Autonomous` | `자주 묻는 질문` | **없음** |
| `/ko/routes/simya-a21` | `심야A21 — Seoul Autonomous` | `심야A21` | `서울 심야버스 전체 노선도 보기 →` |

---

## B. 네이버 검색 결과 — 포그린 수동 확인 필요

네이버 검색은 Claude Code 도구로 접근 불가. 8개 검색어에 대해 포그린 수동 확인 필요.

**검색어 목록:**
1. 서울 심야버스 노선
2. 서울 심야버스 노선도
3. 서울 n버스 노선도
4. 서울 심야버스 노선 지도
5. 서울 심야버스 환승
6. 서울역 심야버스
7. 홍대 심야버스 노선
8. 서울 올빼미버스

**검색어별 확인 항목:**
- PC/모바일 노출 여부
- 지도 페이지 vs 업데이트 글 중 어느 것 노출
- 두 페이지 동시 노출 여부
- 대략적 순위
- 표시 title·snippet
- 고지문이 snippet으로 뽑혔는지

---

## C. 검색 의도 중복표

### 키워드 빈도 카운트

| 키워드 | 지도 title | 지도 H1 | 지도 첫500자 | 지도 전체본문 | 업뎃 title | 업뎃 H1 | 업뎃 첫500자 | 업뎃 전체본문 |
|--------|-----------|---------|-------------|-------------|-----------|---------|-------------|-------------|
| 서울 심야버스 노선도 | 1 | 1 | 0 | 2 | 1 | 1 | 1 | 3 |
| 서울 심야버스 노선 | 1 | 1 | 1 | 6 | 1 | 1 | 2 | 5 |
| N버스 | 1 | 0 | 1 | 4 | 1 | 1 | 1 | 2 |
| 올빼미버스 | 1 | 0 | 1 | 4 | 1 | 1 | 2 | 10 |
| 환승 지도 | 1 | 0 | 0 | 0 | 1 | 1 | 0 | 1 |
| 환승 노선도 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 출발역 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 5 |
| 도착역 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 6 |
| 직통 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| 환승 경로 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 |
| 대리운전 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 2 |
| 야간근무 | 0 | 0 | 1 | 2 | 0 | 0 | 0 | 0 |
| 막차 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 5 |

### 카니발라이제이션 위험 요소

- **"서울 심야버스 노선도"**: 두 페이지 title·H1 모두 포함 — 핵심 키워드 완전 중복
- **"서울 심야버스 노선"**: 두 페이지 title에 동일 포함
- **"N버스", "올빼미버스"**: 두 페이지 title 모두 포함
- **"환승 지도"**: 두 페이지 title 모두 포함
- 업데이트 글 title이 지도 페이지 title의 상위 호환 (같은 키워드 + 추가 단어)

### 검색 의도 분류

| 페이지 | 분류 | 근거 |
|--------|------|------|
| 지도 페이지 | **도구 사용 페이지** | H1="서울 심야버스 노선도", 첫 문장="노선을 한눈에 볼 수 있도록 정리한 노선도", SVG 인터랙티브 지도, 출발/도착 검색 UI |
| 업데이트 글 | **발표 글 + 이용 방법 글** | H1="노선도로 보는…환승 지도", 첫 문장="막차가 끊긴 뒤…필요합니다", CTA="바로 보기 →" (다른 페이지로 보냄), FAQ 8개 |

---

## D. DOM 순서표

서버 렌더링 HTML 기준 (`page.tsx` JSX 순서 = DOM 순서, 서버 컴포넌트).

| 순서 | 요소 | 태그 | CSS class | 실제 텍스트 요약 | 서버 HTML | SVG 전후 |
|------|------|------|-----------|-----------------|----------|---------|
| 1 | TopBar (뒤로가기) | `div > Link` | `topBar`, `backBtn` | ← (chevron icon) | 서버 | SVG 전 |
| 2 | **H1** | `h1` | `heading` | 서울 심야버스 노선도 | 서버 | SVG 전 |
| 3 | subtitle | `p` | `subtitle` | 대리기사·야간근무자·심야 귀가자를 위한 서울 밤버스 이동 지도 | 서버 | SVG 전 |
| 4 | intro | `p` | `intro` | 서울 심야버스 노선을 한눈에… | 서버 | SVG 전 |
| 5 | 기준일 | `p > time` | `datestamp` | 기준일: 2026-06-08 카카오맵 노선 검색 기준 | 서버 | SVG 전 |
| 6 | **고지 박스** | `div` | `noticeBox` | 안내 — 5줄 경고문 | 서버 | **SVG 전** |
| 7 | NightBusMap | `div.ob` | (client) | Header·Legend·SVG·Card·Journey 등 | SSR+hydration | — |
| 7a | — 사용법 문구 | `p` | `obHeadDesc` | 노선 클릭=강조 · 역 클릭=경유 노선… | SSR | SVG 전 (내부) |
| 7b | — 출발/도착 검색 | `input×2` | `obSearch` | 출발역 / 도착역 | SSR | SVG 전 (내부) |
| 7c | — 노선 칩 | `button×15` | `obChip` | N13…N75, 심야A21 | SSR | SVG 전 (내부) |
| 7d | — **SVG** | `svg` | `obSvg` | 노선도 (역명은 SVG text) | SSR | — |
| 8 | 첫 번째 H2 | `h2` | `h2` | 서울 심야버스 노선도 한눈에 보기 | 서버 | SVG 후 |
| 9 | 첫 번째 본문 | `p` | `bodyText` | 위 노선도는 서울 심야버스 노선 15개의… | 서버 | SVG 후 |
| 10 | H2: 환승 허브 | `h2` | `h2` | 서울 N버스와 올빼미버스 환승 허브 | 서버 | SVG 후 |
| 11 | 13개 허브 링크 | `a×13` | `hubLink` | 동대문 카카오맵에서 위치 보기… | 서버 | SVG 후 |
| 12 | H2: 노선별 경유지 | `h2` | `h2` | 노선별 핵심 경유지 | 서버 | SVG 후 |
| 13 | 노선 설명 ×15 | `div×15 > p` | `routeCard` | 심야A21은 동대문…(각 노선) | 서버 | SVG 후 |
| 14 | H2: 카카오맵 확인 | `h2` | `h2` | 카카오맵에서 위치 확인하는 방법 | 서버 | SVG 후 |
| 15 | H2: 이용 전 확인 | `h2` | `h2` | 심야버스 이용 전 확인할 점 | 서버 | SVG 후 |
| 16 | 체크리스트 | `ul > li×6` | `checkList` | 이 노선도는 추상 노선도이며… | 서버 | SVG 후 |
| 17 | Footer | `SiteFooter` | — | — | 서버 | SVG 후 |

### 핵심 확인 결과

- **고지 박스(순서 6)는 SVG(순서 7d)보다 앞** — 검색봇이 고지문을 intro 직후에 읽음
- **노선 설명은 SVG 뒤** — H2 "노선별 핵심 경유지" 이하 전부 SVG 후
- **SVG 내부 역명**: `<text>` 요소로 서버 HTML에 포함됨 (SSR)
- **시각적 순서 = DOM 순서**: CSS reorder 없음 (flex/grid order 미사용, position absolute/sticky 없음)

### H1 이후 SVG 시작 전까지 가시 텍스트 (서버 렌더 기준)

```
대리기사·야간근무자·심야 귀가자를 위한 서울 밤버스 이동 지도

서울 심야버스 노선을 한눈에 볼 수 있도록 정리한 노선도입니다. 올빼미버스(N버스) 14개와
자율주행 심야A21까지, 서울 야간버스의 주요 환승 허브를 시각 가이드로 제공합니다.

기준일: 2026-06-08 카카오맵 노선 검색 기준

안내
이 노선도는 실제 지리와 정류장 순서를 정밀 재현한 지도가 아니라, 야간 이동 구조를
이해하기 위한 추상 노선도입니다.
서울시 심야버스 전체 정보를 공식처럼 대체하지 않습니다.
환승 허브는 동일 정류장 환승을 보장하지 않으며, 노선 축이 모이는 주요 권역을 뜻합니다.
탑승 전 실제 정류장·운행 시간·방향은 카카오맵·네이버지도·서울시 안내에서 확인하세요.
자율주행 검증 노선은 심야A21만 해당합니다.

노선 클릭=강조 · 역 클릭=경유 노선 · 2개 이상 선택=공유 환승역 깜빡 · 선은 직접 작도
[출발역 입력] → [도착역 입력]
[전체 보기] [크게 보기] [PNG 저장]
올빼미버스 — N13 N15 N16 N26 N30 N31 N37 N51 N61 N62 N64 N72 N73 N75
심야A21 자율주행 심야 (별도)
```

→ 고지 5줄이 intro 바로 다음, SVG 앞에 위치. 네이버가 이 경고문을 스니펫으로 뽑을 가능성 있음 (이전에 실제로 뽑힌 적 있음).

---

## E. 내부 링크표

### 본문 링크 (header/footer 제외)

| # | 출발 페이지 | 소스 파일 (line) | 위치 | 앵커 문구 | 조건 | nofollow | 서버 렌더 |
|---|-----------|-----------------|------|----------|------|---------|----------|
| 1 | `/ko/routes` | `routes/page.tsx:37` | body 배너 카드 | `서울 심야버스 전체 노선도 보기 →` | `locale==='ko'` | No | Yes |
| 2 | `/ko/routes/simya-a21` | `routes/[id]/page.tsx:313` | body CTA (하단) | `서울 심야버스 전체 노선도 보기 →` | `id==='simya-a21' && ko` | No | Yes |
| 3 | `/ko/updates/night-bus-map-launch` | `NightBusMapLaunch.tsx:33` | body CTA (들어가며) | `서울 심야버스 노선도 바로 보기 →` | 항상 | No | Yes |

### 본문 링크 없는 페이지

| 페이지 | 지도 링크 |
|--------|----------|
| `/ko` (홈) | **없음** |
| `/ko/updates` (목록) | 업데이트 글로만 링크 (지도 직접 X) |
| `/ko/how-to-ride` | **없음** |
| `/ko/faq` | **없음** |
| 기타 노선 상세 (simya-a21 제외) | **없음** |

### 참고: header/footer의 night-bus-map 링크

- **GlobalHeader**: night-bus-map 링크 **없음** (nav에 미포함)
- **SiteFooter**: night-bus-map 링크 **없음**
- **layout.tsx**: night-bus-map 참조 **없음**

---

## F. JSON-LD표

| 페이지 | JSON-LD 타입 | 핵심 속성 | 화면 내용 일치 | 문제 여부 |
|--------|------------|----------|-------------|----------|
| 지도 페이지 | **없음** | — | — | WebPage/BreadcrumbList 없음 |
| 업데이트 글 | Article | headline=title, datePublished/Modified=2026-06-14, author=Seoul Autonomous, image=절대URL | 일치 | 없음 |
| 업데이트 글 | FAQPage | 8개 Q&A (mainEntity) | 화면 FAQ와 동일 문장 | 없음 |
| 업데이트 글 | BreadcrumbList | Home → 업데이트 → 글 제목 (3단계) | 일치 | 없음 |

### 업데이트 글 JSON-LD 상세

**Article:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "서울 심야버스 노선도로 보는 올빼미버스 N버스 환승 지도",
  "datePublished": "2026-06-14",
  "dateModified": "2026-06-14",
  "author": { "@type": "Organization", "name": "Seoul Autonomous" },
  "image": "https://seoulautonomous.com/images/updates/updates-night-bus-map-01-full.jpg"
}
```

**FAQPage:** 8개 Q&A (NightBusMapLaunch.tsx의 FAQ 배열과 동일)

**BreadcrumbList:** Home → 업데이트 → 글 제목 (breadcrumbJsonLd 함수 사용)

---

## G. 모바일 title 길이표

| 이름 | 전체 텍스트 | 공백포함 | 공백제외 | 한글음절 | 첫20자 | 첫25자 | 앞부분만 보일 때 남는 의미 |
|------|------------|---------|---------|---------|--------|--------|------------------------|
| 지도 현재 | `서울 심야버스 노선도 \| N버스·올빼미버스 환승 지도` | 29 | 23 | 20 | `서울 심야버스 노선도 \| N버스·올빼` | `…N버스·올빼미버스 환` | 노선도 + N버스까지 |
| 업데이트 현재 | `서울 심야버스 노선도로 보는 올빼미버스 N버스 환승 지도` | 31 | 24 | 23 | `서울 심야버스 노선도로 보는 올빼미버` | `…올빼미버스 N버스` | "보는" 의미 불완전 |
| 후보A | `서울 심야버스 노선과 N버스 올빼미버스 환승 노선도` | 28 | 22 | 21 | `서울 심야버스 노선과 N버스 올빼미버` | `…올빼미버스 환승 ` | 노선 + N버스까지 |
| 후보B | `서울 심야버스 노선과 환승 노선도 N버스 올빼미버스` | 28 | 22 | 21 | `서울 심야버스 노선과 환승 노선도 N` | `…노선도 N버스 올빼` | 노선 + 환승 노선도 |
| 후보C | `서울 심야버스 노선과 환승 경로 올빼미버스 N버스 노선도` | 31 | 24 | 23 | `서울 심야버스 노선과 환승 경로 올빼` | `…경로 올빼미버스 N` | 노선 + 환승 경로 |
| 업뎃 후보 | `서울 올빼미버스 환승 지도 공개와 이용 방법 안내` | 27 | 20 | 20 | `서울 올빼미버스 환승 지도 공개와 이` | `…공개와 이용 방법 ` | 환승 지도 공개 |

**참고:** 네이버 모바일 정확한 잘림 길이는 단정 불가. 실제 네이버 캡처로만 판단 가능.

---

## H. DOM 이동 회귀 위험 — 고지 박스 SVG 후 이동

### 코드 구조 분석

| 항목 | 판정 | 근거 |
|------|------|------|
| 같은 파일? | Yes | `page.tsx:211~223` (고지) / `page.tsx:226` (NightBusMap) |
| 단순 JSX 블록 순서 변경? | **Yes** | 고지 = 순수 JSX div, NightBusMap = self-closing 컴포넌트 태그 |
| state/hook/ref 공유? | **No** | 고지는 정적 텍스트, NightBusMap은 독립 client component |
| CSS sibling selector? | **No** | page.module.css에 `+`, `~` 없음 |
| position sticky/absolute? | **No** | noticeBox = 일반 block flow (margin-bottom만) |
| focus 순서 영향? | **낮음** | 고지에 interactive 요소 없음 |
| 모바일 레이아웃 영향? | **없음** | 고지 = 단순 margin-bottom block |
| 전체화면 overlay 영향? | **없음** | overlay는 NightBusMap 내부, 고지는 외부 |
| PNG 저장 영향? | **없음** | PNG = SVG 클론 기반, 고지 미포함 |
| hydration 영향? | **없음** | 고지 = 서버 컴포넌트, NightBusMap = client boundary |
| 서버/클라이언트 경계? | **없음** | 순서 변경은 서버 컴포넌트(page.tsx) 내부 JSX 재배치 |

### 기존 기능 영향

| 기능 | 영향 |
|------|------|
| 노선 칩 선택/해제 | 없음 (NightBusMap 내부) |
| 역 클릭 | 없음 |
| 출발/도착 검색 | 없음 |
| 직통/환승 1회/2회 경로 | 없음 |
| 전체화면 | 없음 |
| PNG 저장 | 없음 |
| 초기화 | 없음 |
| 모바일 pinch zoom | 없음 |

### 최종 판정

**단순 JSX 이동** — `page.tsx`에서 `<div className={styles.noticeBox}>…</div>` 블록을 `<NightBusMap />` 아래로 옮기면 됨. 회귀 위험 없음.

---

## I. 개인정보처리방침 모순 여부

### 현재 개인정보처리방침 핵심 주장

| 항목 | ko | en |
|------|-----|-----|
| title | `개인정보처리방침 — Seoul Autonomous` | `Privacy Policy — Seoul Autonomous` |
| meta desc | `Seoul Autonomous 개인정보처리방침. 개인정보를 수집하지 않습니다.` | `Privacy policy for Seoul Autonomous. We do not collect any personal data.` |
| H1 | `개인정보처리방침` | `Privacy Policy` |
| 핵심 주장 | "제3자 분석 또는 추적 서비스 사용하지 않음" | "does not use third-party analytics or tracking services" |
| 시행일 | 2026-05-02 | 2026-05-02 |
| 문의 | support@fazr.co.kr | support@fazr.co.kr |
| 쿠키 | 언급 없음 | 언급 없음 |
| GA4 | 언급 없음 | 언급 없음 |
| 문체 | "본 앱은…" (앱 기준) | "The App does not…" (앱 기준) |

### 실제 라이브 추적 도구

| 요소 | 존재 여부 | 상세 |
|------|----------|------|
| GA4 측정 ID | **있음** | `G-ND7JGQ62QX` — 모든 페이지에 로드 |
| GA4 설치 방식 | `<GoogleAnalytics gaId="..." />` | `@next/third-parties/google`, layout.tsx:57 |
| gtag.js | Next.js 컴포넌트가 런타임 주입 | 명시적 script 태그 아님 |
| Google Tag Manager | **없음** | |
| 쿠키 override | **없음** | 기본값 (만료 2년) |
| Consent Mode | **미구현** | consent 관련 코드 0줄 |
| 동의 배너 | **없음** | |
| 커스텀 이벤트 | **0개** | 자동 이벤트만 |
| Google signals | **꺼짐** | |
| 광고 개인 최적화 | **켜짐** (307/307) | Google Ads 미연결 |
| AdSense | **없음** | |
| 기타 분석·광고 스크립트 | **없음** | |
| google-site-verification | 있음 | `XVe25p6uT1qMSLHgXPUlsGdXvp3vOZYbzJWVdebe2IE` |
| naver-site-verification | 있음 | `e76930efabe656cabb6d52a1245c8cf96b150e53` |

### 모순 판정: **있음 — 직접 모순 4건**

1. **방침: "제3자 분석 미사용"** ↔ 실제: GA4(Google) 로드 중
2. **방침: 쿠키 언급 없음** ↔ 실제: GA4가 `_ga`, `_ga_*` 쿠키 설정
3. **방침: "외부 서버 네트워크 요청 안 함"** ↔ 실제: GA4가 Google 서버로 데이터 전송
4. **방침 문체: "본 앱"** ↔ 실제: 웹사이트

---

## J. GA4 코드 오디트 (5개 항목)

### 1. 쿠키 설정 override

코드 전체 검색 결과:
- `cookie_expires`: **없음**
- `cookie_update`: **없음**
- `cookie_domain`: **없음**
- `cookie_prefix`: **없음**

→ **GA4 기본값 그대로** (쿠키 만료 2년, 자동 갱신)

### 2. Consent Mode 설정

코드 전체 검색 결과:
- `consent`: **없음**
- `analytics_storage`: **없음**
- `ad_storage`: **없음**
- `ad_user_data`: **없음**
- `ad_personalization`: **없음**

→ **Consent Mode 미구현** — 동의 배너 없이 GA4가 즉시 로드

### 3. 커스텀 이벤트 구현 여부

코드 전체 검색 결과:
- `gtag(` 직접 호출: **없음**
- `sendGAEvent`: **없음**
- `dataLayer`: **없음**

→ **커스텀 이벤트 코드 0건** — GA4 콘솔의 6개 이벤트는 전부 자동 수집:
  - page_view: 1,013
  - session_start: 474
  - user_engagement: 390
  - first_visit: 339
  - scroll: 191
  - click: 107

### 4. GA4 설치 방식

```typescript
// web/app/[locale]/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

// line 57 (</body> 직후, </html> 직전)
<GoogleAnalytics gaId="G-ND7JGQ62QX" />
```

- **방식**: Next.js 공식 `@next/third-parties/google` 컴포넌트
- **위치**: `web/app/[locale]/layout.tsx:57`
- **측정 ID**: `G-ND7JGQ62QX` 하드코딩
- **중복 설치**: **없음** — 프로젝트 전체에서 이 1곳만
- **GTM**: 미사용

### 5. page_view 수동 전송 로직

- `page_view`, `pageview` 문자열: **코드에 없음**
- **수동 전송 없음**
- GA4 콘솔에서 향상된 측정 "페이지 조회"가 꺼져 있어도 page_view 1,013개 잡힌 이유:
  - `<GoogleAnalytics>` 컴포넌트가 내부적으로 `gtag('config', ...)` 실행
  - `gtag('config')` 자체가 page_view를 자동 발생시킴
  - 이것은 GA4의 기본 동작이며 코드 문제 아님
  - 향상된 측정의 "페이지 조회"는 히스토리 변경 기반 추가 페이지뷰 측정이고, config 기반 기본 page_view와는 별개

### GA4 운영 상태 요약

| 설정 | 값 |
|------|-----|
| 측정 ID | G-ND7JGQ62QX |
| 설치 방식 | `@next/third-parties/google` 컴포넌트 1회 |
| 설치 위치 | layout.tsx:57 |
| GTM | 미사용 |
| 쿠키 override | 없음 (기본값 2년) |
| Consent Mode | 미구현 |
| 동의 배너 | 없음 |
| 커스텀 이벤트 | 0개 |
| Google signals | 꺼짐 |
| 광고 개인 최적화 | 켜짐 (Google Ads 미연결) |
| 향상된 측정 | 스크롤·이탈 클릭·사이트 검색·양식·동영상·파일 다운로드 켜짐, 페이지 조회 꺼짐 |
| 이벤트 데이터 보유 | 2개월 |
| 사용자 데이터 보유 | 14개월 |
| 재설정 | 켜짐 |

---

## K. 스니펫 후보 텍스트 오디트

지도 페이지에서 네이버가 snippet으로 선택할 수 있는 문단:

| # | 문단 | DOM 순서 | SVG 전후 | 핵심 키워드 포함 | 긍정/경고 |
|---|------|---------|---------|----------------|----------|
| 1 | meta description | (meta) | — | 심야버스 노선·노선도·N버스·올빼미버스·환승 허브 | 긍정 |
| 2 | subtitle | 3 | SVG 전 | 대리기사·야간근무자·밤버스 | 긍정 |
| 3 | intro | 4 | SVG 전 | 심야버스 노선·올빼미버스·N버스·환승 허브·시각 가이드 | 긍정 |
| 4 | 고지 1줄 | 6 | **SVG 전** | 추상 노선도·정밀 재현 아님 | **경고** |
| 5 | 고지 2줄 | 6 | **SVG 전** | 공식 대체 안 함 | **경고** |
| 6 | 고지 3줄 | 6 | **SVG 전** | 환승 허브·보장 안 함 | **경고** |
| 7 | 고지 4줄 | 6 | **SVG 전** | 카카오맵·네이버지도·서울시 | **경고** |
| 8 | 고지 5줄 | 6 | **SVG 전** | 자율주행·심야A21 | 중립 |
| 9 | H2 아래 첫 문단 | 9 | SVG 후 | 심야버스 노선 15개·경유 허브·추상화 | 긍정 |
| 10 | 환승 허브 소개 | 10~11 | SVG 후 | 심야버스 노선·환승·카카오맵 | 긍정 |
| 11 | 노선별 경유지 도입 | 12 | SVG 후 | 심야버스 노선 15개·경유지·귀가·출근 | 긍정 |
| 12 | 각 노선 설명 (×15) | 13 | SVG 후 | 개별 노선명·경유지·심야버스 | 긍정 |
| 13 | 카카오맵 확인 방법 | 14 | SVG 후 | 카카오맵·네이버지도·정류장 | 긍정 |
| 14 | 이용 전 확인 (×6) | 15~16 | SVG 후 | 추상 노선도·운행 시간·요금·환승 | 중립~경고 |

**문제점:** 고지 박스(경고형 5줄)가 SVG 전에 위치하여 검색봇이 intro 직후에 읽음. 네이버가 이전에 실제로 고지문을 스니펫으로 뽑은 이력 있음.

---

## L. 다음 결정이 필요한 항목

사실만 정리. 수정안 확정은 ROUND-22-FINAL-PLAN.md에서 완료됨.

1. **title/H1 카니발라이제이션** → 계획서에서 키워드 분리 확정
2. **고지 박스 위치** → 계획서에서 SVG 후 이동 확정 (안전 확인됨)
3. **지도 페이지 JSON-LD** → 계획서에서 WebPage + BreadcrumbList 추가 확정
4. **내부 링크 확대** → 계획서에서 홈(카드/CTA) + how-to-ride(본문) 추가 확정
5. **업데이트 글 title 역할 분리** → 계획서에서 "올빼미버스 환승 지도 공개" 확정
6. **개인정보처리방침 GA4 모순** → 계획서에서 Round 22-Privacy로 정정 확정
7. **`/ko/updates` title suffix** → 보류 (별도 메타 일관성 라운드)
8. **네이버 실제 snippet** → 포그린 수동 확인 대기
