# R3b 배포 전 점검 — read-only 감사 에이전트 3개 결과와 CC 처리 (2026-10-18)

정본 R3B-STOP-MERGE-DESIGN-20261016.md §8.6 의 상세. 대상 = 빌드 26(127.0.0.1:3123 · 코드 bce17fd · HEAD e2d4ee5)과 저장소. 지난 배포 전 점검(R3A-PREDEPLOY-AGENT-AUDITS-20261016.md)과 같은 형식으로 각 에이전트가 직접 실측한 BLOCK/FIX 를 옮기고, CC 처리를 ✅(반영 · 빌드 30) · ⛔(미해결) · 🔸(포그린 결정) · ▫(미반영·이월) 로 표시한다. 원시 산출물은 세션 scratchpad 의 audit-20261018/agent-policy · agent-seo · agent-a11y (임시 폴더). 모델 = Fable 5.1(10-18 14시 복원 후).

세 에이전트 모두 **BLOCK 0**. FIX 는 ① 5 · ② 6 · ③ 7. 아래 처리 뒤 재빌드(27~30)·전수 QA 는 §4.

## ① 정책 · 잠금 계약 · 콘텐츠 가치

요약: SESSION-HANDOFF 잠금 절 + STOP-URL-POLICY §17 전 조항 대조표 **전부 준수**(EN 정류장명 55/55 SSoT 일치 · endPoint 미사용 · outbound/inbound/loop 0 · 운영정보 복제 = ko 01009 운행 시간 카드 1곳뿐 · API 7+허브 · 01020/99999/02128/13021 404 · 옛 URL 16 → 308 1회 · sitemap 옛 URL 0 · 환승 단정 0 · 실시간 표현 0 · 로고 0 · 브라우저→서울시 API 0 · routes.json·night-bus-data.ts 무수정 · validate-graph PASS). 저장 원문 7건 대조 사실 문장 전부 일치 · 삭제한 "세 번째 확대" 잔존 0.

FIX
1. 장소 페이지 콘텐츠 밀도 — 설계 §2.9 목표 2개 미달: 템플릿 6-gram 비율 ko 0.53~0.62 · en 0.64~0.70(목표 50% 미만 0/4) · ko 본문 1,200자 이상 1/4(공백 제외 1,206·1,123·1,084·949). §8.5 의 0.48~0.55 는 측정 방법(innerText vs main 정규식) 차이로 재현 안 됨 — 둘 다 "50% 중반" 이라는 결론은 같다. 라이브(14쪽 · 425~558자 · Jaccard 0.49/0.66)보다는 분명히 개선. → 🔸 **포그린 결정: 이 상태로 배포(CC 추천) / D4 현장 문장 확보 뒤 배포**. 남은 겹침은 네 장소가 같은 종로 축 이웃이라 노선·방면·이웃이 실제로 같아서 생긴다(§8.3).
2. 로보택시 19대 글 "탑승 전 확인사항" 불릿 2개("차량당 최대 승객 3명, 시험운전자 1명 상시 동승" · "일부 좁은 구간은 수동 운전 (공식 안내 기준)")가 저장 원문 2건(516542 · 464205)에 없음. 464205 는 오히려 "교통약자 보호구역 내 수동운전 의무가 폐지" 라고 적는다. → ✅ 두 불릿 삭제, 464205 근거 불릿 1개로 교체("보호구역 안 수동운전 의무는 2026년 1월 규정 개정으로 없어졌고 … 단계적으로 넓힐 계획 (2026년 8월 발표)" · en 동일 취지). R3b 이전부터 있던 문장(라이브에도 있음).
3. A504 글 요금·운행일 문장(원문 일치)과 routes.json A504(fare unverified · daysOfOperation Unknown) 불일치 — 위반 아님(글에 "발표 시점 내용·공식 안내 우선" 고지). → 🔸 D6(포그린 확인 후 routes.json 갱신 · R3B §8.4) 적용 시 해소.
4. 02128 정류소 이름 ko "소공동주민센터" / en "City hall front"(공식 EN · 공식 KO 는 "시청앞") — 독자가 다른 장소로 읽을 수 있음 → ✅ 양쪽에 "(정류소 02128)" / "(stop 02128)" 병기. 같은 글 "일반 시내버스 첫차보다 30분 일찍" 의 근거(내 손안에 서울 2017838 · 2026-04-15)가 출처 목록에 없음 → ✅ extraSources 추가.
5. 404 셸(이월 ⛔) — SSR HTML 빈 body · title 빈 문자열 → ✅ §3 참조(정적 전역 404 로 해소).

NOTE: EN 장소 페이지의 올빼미 방면·근처 정류소 일부는 한국어(lang=ko 표식 · 공식 EN 명 없음 · 계약상 허용) · 6/6 의 5항 "구조 역할" 은 이 8플랫폼이 기·종점·반환점이 아니라 방면·순서로 대체 · RouteCard·홈 a21 의 startPoint→endPoint 표시는 R3b 이전 그대로(범위 밖).

## ② 기술 SEO

요약: sitemap 71 · XML 정상 · 중복 0 · 옛 URL 0 · lastmod = 장소 2026-05-01(두 플랫폼 노선 합집합 lastChecked 최대 ✓ · 현재 날짜 미사용) · 업데이트 = dateModified ✓ · 71쪽 200 · x-nextjs-prerender 1 · title/description 고유 71/71 · canonical 자기참조 71/71 · hreflang 58쌍 + x-default · h1 1 · noindex 0 · JSON-LD 84개 파싱 · EN 장소 title 형식 4/4 · breadcrumb 3단계 8/8 · 옛 URL 16 → 308 1회 → 200(2회 이동 0 · fragment 보존 · 렌더 71쪽에 옛 경로 잔존 0) · 내부 href 깨진 0 · 고아 0 · robots Disallow 0 · ads.txt = client ID.

FIX
1. 404 서버 HTML 에 셸 없음(이월 ⛔ · `<html id="__next_error__">` + 빈 body · title 0) → ✅ §3.
2. meta description 160자 초과 12건 — 장소 EN 4(313~412자 · 방면 목록·노선 전부·올빼미 전부 나열) · /en 222 · 재탄생 글 EN 280 · /en/about 192 · 묶음 EN 185/187 · a504 EN 177 · 로보택시 19대 EN 166 · 장소 ko 종로2가 162 → ✅ 장소 템플릿(ko/en)을 "정류소 두 개 + 노선 번호(A160 …) + 올빼미 번호" 로 바꾸고(방면 목록은 본문에) 나머지는 문장 축약 — 71쪽 전부 160 이하(최대 159).
3. a504 EN title = h1 106자 → ✅ "Saebyeok A504 Early-morning Autonomous Bus: Geumcheon-gu Office to City Hall"(76 · ", Times, Stops and How to Ride" 삭제). 재탄생 글 EN 제목 91 → 77 로 같이 축약(▫ 두 번 이월된 것).
4. 업데이트 글 og:type=website 인데 JSON-LD 는 Article · Article description 없음 → ✅ buildPageMetadata 에 type 옵션(업데이트 = article) · Article JSON-LD 일반 분기에 description(summary) 추가.
5. 미사용 자산 2건이 배포에 실림(/og/seoul-autonomous-og.png 963KB · /images/hero-bus-night.webp 149KB · 참조 0) → ✅ 삭제(404 영향 0).
6. apple-touch-icon · manifest 404(이월 ▫) → ✅ app/apple-icon.png(512px · Next 가 `<link rel="apple-touch-icon">` 자동 삽입) · ▫ manifest 는 PWA(R6) 때.

NOTE: EN title 60자 초과 7 중 장소 4(71~109)는 잠금 형식 `{name} stops {a} & {b}: which side to board — Seoul Autonomous` + 공식 EN 명 보존의 결과 → 포그린 판단 사항(형식 유지 시 불가피) · 올빼미 노선 5쪽 `<title>` 51~74개 = 노선도 SVG 툴팁(문서 제목 아님) · 루트 / 307(미들웨어 · 의도) · JSON-LD 없는 3쪽(/en/night-bus-map · /ko/after-last-train · /ko/night-bus-fare ▫) · "hreflang 없는 13 = 한국어 전용" 은 /en/night-bus-map 1건이 EN 이라 표현만 부정확.

## ③ 접근성 · 모바일 사용성

요약: 20 URL(장소 8 · 묶음 4 · 업데이트 4 · 앵커 4) × Chromium 1280/375 + WebKit iPhone 15 = 62회 로드 — h1 1 · 헤딩 단계 건너뜀 0 · 랜드마크 · nav 라벨 5/5 · lang 일치 · 가로 넘침 0/16 · 색 대비 미달 0(올빼미 칩 최저 N37 5.39:1 · 보조 텍스트 4.59:1) · 포커스 링 누락 0 · 앵커 보정 4 URL 모두 top 84 at 0.1/1.5/3.5s(1초 뒤 사용자 탭 → 재이동 없음 · 2.5초 타이머 실증) · 잘못된 해시 6건 pageerror 0 · aria-live 남용 0 · 콘솔 오류 0 · 하이드레이션 0.

FIX
1. EN 페이지 한글 텍스트 lang="ko" 누락 9곳(묶음 2쪽 7 · 업데이트 2쪽 2) → ✅ RouteCard·RobotaxiCard 보조줄 lang · 운영사 dd · 출처 발행처 span · 묶음 출처 링크 `<a lang="ko">` · 업데이트 EN 본문은 lib/v2/ko-spans.tsx(한글 조각을 `<span lang="ko">` 로 감쌈 · en 분기에만 적용).
2. 건너뛰기 링크 없음(16/16) → ✅ 헤더 맨 앞 `.v2-skip`(포커스 시 표시) + `<main id="main">` + shell.skip(ko "본문으로 건너뛰기" / en "Skip to content") — Chromium 실측: Tab 1회 → 표시(top 10) → Enter → #main → 다음 Tab 이 main 안.
3. 지도 링크 이름 중복(플랫폼마다 카카오맵·네이버지도 2개 · 그룹 라벨 동일) → ✅ MapLinks 그룹 aria-label 에 정류소 번호("외부 지도에서 위치 보기 · 01009").
4. 새 창 표식 없음 → ✅ 마우스 기기용 지도 링크·묶음 페이지 출처 링크에 숨은 글자 "(새 창)" / "(new tab)"(pages.map.newTab) · ▫ 그 밖의 서울시 출처 링크(업데이트·노선 페이지)는 다음 라운드.
5. 11px 글자(이월 ▫) → ✅ 푸터 그룹 제목 · 로보택시 카드 "Robotaxi" 유형 라벨 12px(OFFICIAL 배지는 Pill 공통 부품 · ▫).
6. 44px 미만 터치 타깃(이월 ▫ · 2.5.8 실패 0) → ✅ 올빼미 칩 패딩 3→7px · 자율주행 칩 4→5px · 지도 링크 2→6px(계산상 세로 ≥32px) · 나머지(크럼 · 푸터 메일 · 메뉴 버튼 40px) ▫.
7. 업데이트 크럼 3줄(iPhone · '›' 가 둘째 줄 머리) → ✅ 구분자를 앞 항목 뒤(::after)로 옮김 — 현재 항목 1줄 말줄임(nowrap)은 flex 항목 폭을 키워 업데이트 4쪽 모바일 가로 넘침 12~71px 을 만들어(빌드 29 qa-v2-all 실측) 되돌렸다 · 제목은 그대로 줄바꿈(2줄).

NOTE: EN h1 "Jongno 5(o)-ga.Gwangjang Market" 하이픈 줄바꿈(공식명 그대로 · 수정 불필요) · 도착정보 카드 B(표시) 상태는 로컬 503 으로 미실측(headingLevel=3 소스 확인) · Chromium "preload CSS 미사용" 경고 3건(a11y 무관).

## 3. 404 셸 — 원인과 해법 (R3b-4 · 10-16 ⛔ 해소)

실측(빌드 26 · Next 16.2.4):
- `/ko/nothing` · `/ko/stops/nope` · `/en/night-bus-fare`(ko 전용) · `/nothing` · `/api/nope` 전부 `<html id="__next_error__">` + 빈 body + RSC 페이로드(`ERROR_FALLBACK;404`). 페이로드 안에는 레이아웃·not-found 트리가 있어 JS 실행 뒤에는 셸이 보인다.
- 원인 1: **요청 시점에 던진 notFound()** 는 Next 가 빈 error 문서로 내보낸다(정적 프리렌더 `/_not-found.html` 은 full HTML). `[...rest]` catch-all 과 `dynamicParams` 기본값(true) 때문에 모든 없는 주소가 요청 시점 렌더였다. `[locale]` 가 `/nothing` 의 locale 로 매칭돼 `/api/nope` 조차 catch-all 로 떨어졌다(`"rest","nope"`).
- 해법: `app/[locale]/layout.tsx` + ko 전용·동적 페이지 5(night-bus-fare · after-last-train · night-bus-map · routes/[id] · updates/[slug])에 `export const dynamicParams = false` · catch-all 삭제 → 생성 목록 밖 경로는 라우터 단계 404 → 정적 `/_not-found.html`(status 404 · noindex · title · 셸).
- 원인 2(해법 과정에서 발견): **루트 not-found 컴포넌트는 모든 페이지 렌더에 함께 실행된다**(not-found 경계의 prop 으로 Flight 가 렌더). 거기서 `getLocale()`(headers 읽음)을 쓰자 **전 페이지가 동적(ƒ · 프리렌더 78 → 6)**이 됐고, `setRequestLocale('en')` 을 쓰자 **ko 페이지의 next-intl 링크가 전부 /en 으로** 바뀌었다(둘 다 빌드 27·28 실측). `NextIntlClientProvider` 서버 래퍼도 formats/timeZone/now 를 headers 로 읽는다.
- 최종(빌드 30): `app/not-found.tsx` 는 next-intl 서버 API·클라이언트 provider 없이 en 메시지 JSON 을 직접 읽고 next/link 만 쓰는 **순수 정적 셸**(브랜드 · 내비 5 · KO/EN 링크 · 한·영 본문 · FooterView). Footer 는 `Footer()`(요청 문맥) + `FooterView({locale, t})`(문맥 불필요 · next/link + 접두사)로 분리. Header 의 클라이언트 부품(NavLinks·MobileMenu·LangToggle)은 next-intl 훅이 필요해 404 에선 쓰지 않는다(모바일 404 헤더 = 브랜드만 · 본문에 홈·노선도 링크).
- 검증: 15경로(/nothing · /api/nope · /nothing/deeper · /ko/nothing · /ko/stops · /en/stops · /ko/stops/nope · /en/night-bus-fare · /en/after-last-train · /en/night-bus/n15 · /en/hubs/gangnam-station · /ko/routes/nope · /ko/updates/nope · /en/updates/night-bus-map-launch · /robots-nope.txt) 전부 404 + `<html lang="en">` + header 1 · nav 4 · footer 1 · title 1 · noindex 1 · 프리렌더 78 유지(○ /_not-found · ● 19 라우트) · ko 페이지 링크 /ko 33 · /en 0.

## 4. 적용 결과 검증 (빌드 30 · 127.0.0.1:3123 · 2026-10-18)

- tsc 0 · eslint 0 errors(경고 6 = 옛 스크립트 3개 · 변동 없음 · `.next-check/**` 린트 제외 추가) · validate-graph PASS · 프리렌더 78 · x-nextjs-prerender 1
- qa-links: sitemap 71 · 71쪽 200 · 내부 href 74 · 깨진 0 · 리다이렉트 경유 0 · canonical 불일치 0 · hreflang 없음 13(변동 없음) · 옛 URL 16 → 308 1회 → 200 · 없는 경로 404
- 71쪽 meta description 전부 160자 이하(최대 159) · title 최대 109(장소 EN 잠금 형식)
- 404 매트릭스 15경로 전부 셸 포함(§3) · 앵커 WebKit iPhone 15 4경로 top 84 유지 · 건너뛰기 링크 실측 통과
- 렌더 확인: 지도 링크 그룹 라벨 "… · 01009/01010" · 숨은 "(새 창)/(new tab)" 각 4 · EN lang=ko span(새벽 · 서울자율차 · 심야A21 · 에스더블유엠, 카카오모빌리티 · 서울특별시 · 출처 제목 4) · 로보택시 옛 불릿 잔존 0 · 02128 병기 ko/en · 2017838 출처 · og:type article · Article description · apple-touch-icon link · 삭제 자산 404 · jpg·apple-icon 200
- qa-v2-all 71 URL × 데스크톱·모바일: (아래 §4.1)
- 캡처 ~/Desktop/seoul-shots/2026-10-16-v2-shell/105(404 iPhone) · 106(광화문역 칩) · 107(a504 크럼) · 108(EN 심야 묶음 lang) · 109(건너뛰기 링크 포커스)

### 4.1 qa-v2-all (빌드 30 · 2026-10-18)

71 URL × 데스크톱·모바일 = 142 검사 → bad 2 = /ko/stops/gwanghwamun-station 두 화면(로컬 도착 API 키 없음 → 503 재시도로 networkidle 미도달 · 빌드 26 과 같은 기존 예외 · h1 1 · 푸터 1 정상). 그 외 콘솔 오류 0 · 하이드레이션 0 · overflow 0 · h1 1 · 푸터 1. 빌드 29 에서 크럼 말줄임이 만든 업데이트 4쪽 모바일 넘침(12~71px)은 되돌린 뒤 0 (별도 실측 6쪽 overflow 0 · 크럼 2줄).

빌드 31(D6 routes.json 적용 후 · data 커밋 3a96318): 같은 검사 142 → bad 2(같은 로컬 예외) · qa-links 71/71 · 깨진 0 · legacy 16 · 프리렌더 78 · 코드 커밋 32454da(빌드 30 반영분).
