# 배포 전 점검 — read-only 감사 에이전트 3개 결과와 CC 처리 (2026-10-16)

정본 R3A-VERTICAL-SLICE-PLAN-20261015.md §12.9 의 상세. 로컬 127.0.0.1:3123(당시 빌드 11)·저장소를 대상으로 각 에이전트가 직접 실측한 결과를 BLOCK/FIX 중심으로 옮기고, CC 처리를 ✅(반영) · ⛔(미해결) · 🔸(포그린 결정) · ▫(미반영·이월) 로 표시한다. 원시 산출물은 세션 scratchpad 의 agent-policy/ · agent-seo/ · agent-a11y/ (임시 폴더 · 세션 종료 후 사라질 수 있음).

## ① AdSense 정책 · 콘텐츠 가치 감사

요약: ads.txt = layout client ID 일치 · 79 URL 전부 AdSense·GA·방침·약관·소개·메일 링크 · 방침에 AdSense·제3자 쿠키·GA4·광고 설정 명시 · 카카오/네이버 로고 0 · 고아 URL 0 · 내부 404 링크 0.

BLOCK
1. 「준비 중」 라벨 8페이지(N노선 5·허브 3: hubsSoon·liveSoon·routeSoon) → ✅ 노선도 링크 「노선도에서 보기 →」로 교체, liveSoon 문장 삭제(허브 도착정보와 모순)
2. 정류장 페이지 14개(7×2언어) 본문 425~558자 · 템플릿 6-gram 62~70% · 양방향 쌍 유사도 0.57~0.77 → 🔸 Stop URL 정책(docs/strategy/STOP-URL-POLICY-20260826.md §12)이 noindex·사이트맵 제외를 금지(잠금 계약) → 포그린 결정: 계약 유지 / 양방향 통합+보강 / 임시 예외
3. 셸 없는 404(헤더·푸터·lang 없음) → ⛔ app/[locale]/not-found.tsx · [...rest] 캐치올 · app/not-found.tsx(자기 html) 추가했으나 Next 가 notFound() 응답을 __next_error__ 문서(빈 body + RSC 페이로드 · 클라이언트 렌더)로 내보내 서버 HTML 에는 여전히 셸 없음(dev·standalone 동일). 다음 세션 조사

FIX
1. 정체성 불일치(홈 meta·WebSite JSON-LD·약관 §2·§3.3·FAQ 8문항 전부 자율주행·이용방법 meta/본문) → ✅ 홈 meta(ko/en)·JSON-LD·약관 §2/§3.3·FAQ 올빼미 6문항 선두 추가·이용 방법 올빼미 4단계 섹션+meta
2. "실시간" 자기모순(FAQ q5 · 정류장 카드 라벨 "실시간 도착") → ✅ FAQ 답 재작성(ko/en) · 라벨 "도착정보 (조회 시각 기준)" · 실패 문구
3. 자율주행 22페이지 요금 재확인 고지 + 기준일 2026-05-01 → ✅ 문구 완화(금액 미표시·공식 안내 확인) · 🔸 재확인(데이터 갱신)은 포그린
4. 소개 "(사업자명)" 괄호 → ✅ "다파라코프가 서울에서 독립적으로 운영"
5. 노선도 설명 사실 오류(N61 잠실 · N64 "짧은" · N73 구파발) → ✅ N51·N61·N64·N72·N73·N75 6건을 정류장 데이터로 검증한 역명으로 재작성
6. EN 홈 칩 → ko 전용 페이지 무표식 → ✅ 빠른 이동 칩 title "Korean page" · 허브 링크 "(KO)" · 허브 카드 칩 title
7. 방침 §10 링크 없음 → ✅ adssettings.google.com · policies.google.com/technologies/ads · aboutads.info/choices 본문 추가(ko/en)
8. 운행시간 표기 불일치(EN 23:00–06:00 · ko 23:30~05:00) → ✅ 데이터 기준 통일: 23:00~06:00 시간대 · 기점 첫차 23:10~00:00 · 막차 03:10~04:10
9. 허브 지도 미래형 문장 → ✅ 현재형("노선 선은 그리지 않고 정류소 위치만")
10. 짧은 업데이트 글 2건(05-09) → ▫ 이월

가장 약한 5페이지: 정류장 14 · EN/KO 이용방법(올빼미 1부 추가 ✅) · FAQ(올빼미 추가 ✅) · routes/early-morning·late-night(목록만 ▫) · 05-09 업데이트 2건(▫)
NOTE: 기본 로케일 en vs 한국어 수요(🔸 제품 결정) · 모바일 태그라인 미노출(▫) · hreflang alternateLinks:false(▫) · 영문 정류장명 원문 오타 각주(▫) · 문의 수단 메일 단일(충분)

## ② 기술 SEO 감사

요약: title 79 고유 · description 79 고유 · canonical 79/79 자기참조 · hreflang 67/67 · OG/twitter 79/79 · JSON-LD 94/94 파싱 · h1 1개 79/79 · 고아 0 · 라이브 69 URL 전부 신규 79 에 포함(리다이렉트 불필요) → BLOCK 0.

FIX
1. 404 → ⛔ (위와 동일)
2. 글꼴 preload 96개 864KB/페이지(한글 조각 전부 강제 선로딩) → ✅ Gothic A1·Plex preload:false(Geist Mono 만 preload) → preload 0
3. OG 이미지 PNG 964KB · alt 문구 구식 → ✅ JPG 210KB + alt "Seoul late-night travel guide…" (metadata.ts · after-last-train · night-bus-fare)
4. title/description 이상치(업데이트 단독 제목 · privacy 구분자 · EN 정류장 description 160자 초과 · 재탄생 글 제목 91자) → ✅ updates "— Seoul Autonomous" · privacy/terms 구분자 · EN 정류장 description "Next stops" 꼬리 제거 · ▫ 재탄생 글 제목 길이
5. EN→ko 링크 표식 → ✅ (①-6)
6. BreadcrumbList 'Home' 영어 리터럴 · 정류장 Routes 단계 누락 → ✅ jsonld.ts 에서 ko 현지화('홈'·'노선') · 정류장 Routes 단계 추가
7. Article JSON-LD publisher·mainEntityOfPage·image 누락 → ✅ 두 분기 모두 추가
8. sitemap lastmod = 빌드 시각 26건 · x-default 없음 → ✅ 정적 페이지 lastmod 2026-10-16 고정 · x-default 4 블록 추가
9. 루트 307 → ▫ next-intl 미들웨어의 언어 감지 리다이렉트라 307 이 맞다고 판단(app/page.tsx 는 제거 · 미들웨어가 / 처리)
10. 푸터 h4 → ✅ p.footH · EN how-to-ride 섹션 제목 h2 ✅
NOTE: 대문자 /ko/night-bus/N15 200(canonical 소문자 · 무해) · 얇은 페이지 목록(①) · JSON-LD 없는 3페이지(▫) · 미사용 hero-bus-night.webp 149KB(▫) · apple-touch-icon·manifest 없음(▫)

## ③ 접근성 · 모바일 사용성 감사

요약: 39회(13 URL×3 뷰포트) 실측 — h1 1 · 랜드마크 · lang · 가로 스크롤 0 · 포커스 링 · 모바일 메뉴 모달(트랩·Esc·복귀) · reduced-motion 통과.

BLOCK
1. 노선도 출발·도착 키보드 지정 불가(SVG 노드 비포커스 · 검색 추천 mousedown 전용) → ✅ SearchBox 를 콤보박스(role·aria-expanded·aria-activedescendant·ArrowDown/Up·Enter·Escape)로 — 실측: 「강남」 ArrowDown+Enter → 출발 확정 · 경로 바 생성 (SVG 노드 포커스는 ▫)
2. 흰 역 카드 안 버튼 대비 1.9:1·1.63:1 → ✅ .obCard .obBtn 밝은 바탕 처방(#374151 · 선택 #1d4ed8/#e6f0ff)
3. 전체화면 오버레이 포커스 트랩·aria-modal·복귀 없음 → ✅ aria-modal · Tab 순환 · 닫으면 「크게 보기」로 복귀 — 실측 Tab 12회 이탈 0 · 복귀 확인
4. 허브·N노선 칩 잉크 글자 고정(N75 1.72:1) · 큰 노선색 글자(N75 1.55:1) → ✅ 칩 글자색 공용 onColor 로 통일(허브·N노선·HubArrivals·RouteExplorer·노선도 칩) · 어두운 노선색 글자는 routeTextColor(색상 유지 · 3:1 까지만 밝힘 · 홈 갤러리·허브 .bno)

FIX(반영 ✅): scroll-padding-top 72px · 범례/카드/경로 칩 aria-pressed · N72 칩 표시색 · 역 카드 닫기 aria-label·36px·대비·Esc · 「역 위치는 권역 표시」 aria-expanded · ServiceStatus 카운트다운 aria-live 제거 · MapTabs aria-label·aria-controls·tabpanel·화살표 · 허브 select 16px · MapLibre 한국어 문자열 · SegmentedControl 라벨(이용방법·노선 목록) · FAQItem aria-expanded · LangToggle 라벨(shell.language) · 장식 svg aria-hidden 18곳 · 「내 위치」 aria-pressed 제거 · reduced-motion 시 smooth scroll 해제 · MapLinks role=group · EN 페이지 한글 lang="ko"(예시 칩·허브 한글명·노선 종점)
FIX(이월 ▫): 노선도 검색 placeholder 대비 4.04:1 · 역 카드 10~11px 글자 · 44px 미만 터치 타깃 전반(24px 간격 예외는 전부 통과) · 홈 role=status 조건부 삽입 · 결과 무대 포커스 안내 · 전체화면 힌트 겹침 · 11px 글자 목록 · 모바일 메뉴 외 live 영역 정리

## 적용 결과 검증 (빌드 16 · 127.0.0.1:3123 · 2026-10-16)

- tsc 0 · eslint 오류 0 경고 0(app·lib·components) · 전 locale 페이지 ●(SSG) · x-nextjs-prerender 1 · Cache-Control s-maxage
- qa-links: 79 페이지·내부 href 81 전부 200 · 깨진 0 · 리다이렉트 0 · canonical 불일치 0 · robots/ads/sitemap 200 · 없는 경로 404
- 키보드 실측(빌드 15): 콤보박스 선택·경로 생성 · 전체화면 트랩·복귀 · 역 카드 Esc 통과
- qa-v2-all 전수 회귀(빌드 16): 158 검사 중 bad 2 = /ko/stops/01009 데스크톱·모바일(로컬 도착 API 키 없음 → 503 폴링 타임아웃 · 기존 예외) · 나머지 콘솔 오류 0 · overflow 0 · 하이드레이션 0 · h1 1 · 푸터 1
