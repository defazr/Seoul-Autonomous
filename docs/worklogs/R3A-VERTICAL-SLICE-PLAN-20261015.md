# R3a — 대표 수직 슬라이스 구현 계획 (2026-10-15 · CC 단독 결정 · GPT 조언 반영)

> 이 문서는 **압축·/clear 후에도 이어갈 수 있는 정본**이다. 새 세션은 `docs/SESSION-HANDOFF.md` → 이 문서 → §6 체크리스트 순서로 재개한다.
> 선행 정본: `SITE-REBIRTH-ANALYSIS-20261015.md`(§4.7 R0 13항) · `R1-NIGHT-BUS-DATA-20261015.md` · `R2-PROTOTYPE-20261015.md` · `GPT-BRIEF-20261015.md`
> 포그린 2026-10-15: "전체적으로 만족한다 · GPT 조언은 참고하되 CC 주관대로 · 알기 쉽게 설명하고 시작".

## 1. GPT 조언 반영 결정 (채택 / 수정 / 보류)

```
채택  R3 를 R3a(수직 슬라이스) → R3b(전량 확장)으로 분할. 과대구현 리스크 동의
채택  신뢰층(운영자·출처·갱신 기준·"왜 이 결과인지"·업데이트 이력·오류 제보)을 R5 → R3a 로 당김
채택  홈은 입력 전에도 가치가 보이게: 상태줄(오늘 밤 첫차/운행 중) + 질문 카드 + 많이 찾는 노선·허브 바로가기 (시안 구조 유지, 순서만 보강)
채택  노선 페이지 = 도식 노선도 기본 / 허브·정류장 페이지 = 지리 지도 기본 (시안 v2.3 의 허브 기본값을 지리로 변경)
채택  보간 정류장 점은 "노선 순서 기준 개략 위치" 라벨 필수 · 차량 위치도 노선도에서는 "노선 진행 위치" 표현
채택  필드별 source / license / fetchedAt 메타 (SSoT _meta 에 이미 있음 → 화면 출처 표기까지 연결)
채택  지도 타일 공급자 확정: OpenFreeMap(벡터·무료·키 없음·OSM 출처표기) — OSM 표준 타일은 쓰지 않음 · 오프라인 캐시는 자체 노선도만
채택  SEO 제목 패턴: "N61 심야버스 노선·첫차 막차｜강남·홍대·노원" 처럼 노선번호 → 핵심 질문 → 대표 지역. 페이지 상단 순서 = 오늘 밤 운행 상태 · 주요 경유지 · 첫차·막차 · 어디서 타는지 · 실시간
채택  수익화는 사용량 먼저. UI 에 광고·제휴 안 얹음 (AdSense 목표 작업 금지 유지)
수정  브랜드명 교체("Seoul Night Mobility")는 보류 — 도메인·4개월 네이버 노출·기존 유입이 "Seoul Autonomous" 에 묶여 있음.
      대신 태그라인 "서울 심야 이동 안내" 를 헤더·메타에 전면 배치, 제목은 검색어 우선 · 브랜드 후미
보류  허브 16 전량·노선 14 전량 → R3b. R3a 는 노선 5(N15·N61·N31·N13·N16 = 네이버 롱테일 상위) + 허브 3(강남역·홍대입구역·동대문역)
```

## 2. R3a 범위 (Production 수준으로 완성 후 실제 행동 관측)

```
A 데이터·엔진     web/lib/night-bus/core.mjs (SSoT 로더 · 방면 분할 · 물리 그룹 · 직통/1회 환승 탐색 · 허브) — validator·앱 공용
                 web/data/night-bus-hubs.json (허브 16 등록부 · R3a 노출은 3) · web/data/night-bus-schematic-anchors.json (노선도 115 역 ↔ 정류장 매핑)
                 web/scripts/build-night-bus-derived.mjs (위 두 JSON 생성 · 재현 가능) · validate-night-bus.mjs 에 파생 검증 추가
B 디자인 시스템 v2  globals.css 토큰 재정의(밤 잉크 네이비 · 노선 14색 · 시안 포인트) · 글꼴 Gothic A1/Plex 자체 호스팅 또는 Pretendard 유지 결정 · 헤더/푸터/카드 공통 컴포넌트 재조판
                 ⚠ 기존 페이지(노선 11 · 정류장 14 · 가이드 · FAQ · 소개 등)는 토큰·공통 컴포넌트 변경으로 자동 재조판. 내용·URL 불변
C 홈 v2          /[locale]/page.tsx 교체: 상태줄 → 질문 카드(기기 내 탐색) → 결과 무대(버스 연출) → 많이 찾는 노선·허브 → 노선 갤러리 → 가이드 → A21 → 출처
D 노선 페이지     /[locale]/night-bus/[no] (R3a: n15 n61 n31 n13 n16) — 상단 순서 §1 SEO 패턴 · 도식 노선도 기본 + 보간 정류장("노선 순서 기준") · 방면 토글 · 정류장 타임라인(ARS · 만나는 N노선) · 실제 경로 탭(지리)
E 허브 페이지     /[locale]/hubs/[slug] (R3a: gangnam-station hongdae-entrance dongdaemun-station) — 지리 지도 기본 · 정류소별 승강장·방면 · 노선 보드 · 도착(F)
F 라이브 보드     기존 /api/arrivals/[stopId] 프록시의 승인 Stop 게이트를 허브 ARS 로 확장 · 운행 시간대에만 · 사용자 탭 시 조회 · 20~30초 캐시 · 공용 개발키 예산(300/day) 안에서 파일럿
                 ⚠ 전용 키 확보 전까지 허브 3곳 한정. 신규 인증키 발급 중단 공지 상태 확인은 R4 선행 과제
G 신뢰층         소개(운영자·목적·방법) · 데이터 출처 페이지에 필드별 출처·라이선스·갱신일 · "왜 이 결과인지" 설명 블록 · 업데이트 이력 · 오류 제보 경로(메일 + 정류장별 제보 링크)
H 기존 노선도     /ko/night-bus-map 유지 · 새 프레임으로 재조판 · 역 카드에 정류소 번호·방면 (anchors.json) · 탐색을 core.mjs 엔진으로 교체(그림 무수정)
I 검증·배포       validate 2종 PASS · next build · standalone 로컬 QA(데스크톱/모바일 · 콘솔 0 · overflow 0 · sitemap 증가분 확인) · Codex read-only 감사 → 포그린 승인 → deploy-safety 계약대로 배포
```

범위 밖(R3b 이후): 노선 9·허브 13 추가, 공항 심야 페이지, EN 확장, MapLibre 차량 위치, PWA.

## 3. 아키텍처 결정

```
SSoT 불변   web/data/routes.json(자율주행) · night-bus-routes.json(N버스 원본 사본) · night-bus-data.ts(노선도 작도 · 읽기 전용)
파생 층     core.mjs 가 유일한 계산원 (validator·빌드 스크립트·앱 공용). 생성 JSON 은 hubs·anchors 두 개만 커밋(등록부 성격)
등록부     lib/night-bus/registry.ts = R3a 노출 노선 5 · 허브 3 (APPROVED_STOPS 와 같은 성격 · 넓히는 건 R3b 결정)
URL        /[locale]/night-bus/[no](소문자 n61) · /[locale]/hubs/[slug] · 기존 69 URL 무변경 · sitemap 에 R3a 분만 추가
탐색       기기 내 결정론적 (직통 → 물리 그룹 기준 1회 환승). 클라이언트 데이터 ≈ 100KB (노선 14 압축본) — 홈에서만 로드
실시간     서버 프록시만 · "HH:MM 기준" 고정 · 운행 시간 밖은 "운행 전 · 첫차 HH:MM"
지도       도식 = 기존 night-bus-data 를 SVG 로 렌더하는 공용 컴포넌트(NightSchematic) · 지리 = MapLibre + OpenFreeMap (R3a 에서는 정적 캔버스 선도로 대체 가능)
글꼴       1차: 기존 Pretendard + Geist 유지(Next 폰트 파이프라인 존재) · 번호·시각만 Geist Mono tabular. Gothic A1 도입은 self-host 검토 후 R3b
```

## 4. 품질 기준 (완료 정의)

```
노선 페이지 1장 = 본문 600단어 이상 상당의 고유 정보(정류장 전수 · 방면 · 첫막차 · 만나는 노선 · 허브 · 출처) · 이미지/SVG 2개 이상 · FAQ 는 노선 고유 질문만
허브 페이지 1장 = 정류소별 승강장 번호 · 방면 · 노선 보드 · 지도 · 탑승 요령 · 출처
홈 = 입력 없이도 상태·바로가기·노선 갤러리가 보임 · 카드가 콘텐츠를 가리지 않음 · 자동 위치 요청 없음
전 페이지 = 운영자·출처·갱신일·제보 경로 도달 2클릭 이내 · 실시간 표현은 실데이터에만
```

## 5. 재개 절차 (압축 · /clear 후)

```
1 cd web && node scripts/project-status.mjs            좌표 실측
2 docs/SESSION-HANDOFF.md → 이 문서 §6 체크리스트     어디까지 됐는지
3 cd web && node scripts/validate-night-bus.mjs        데이터 PASS 확인
4 node scripts/build-night-bus-derived.mjs             파생 JSON 재생성(있으면 diff 0)
5 §6 의 다음 미완 항목부터. 커밋·푸시·배포는 포그린 승인
```

## 6. 체크리스트 (진행 상태는 이 표만 갱신)

```
[x] 0 계획 문서 · 시안 소스 보존(docs/prototypes) · Codex 결과 보존 · 메모리 갱신
[x] A1 core.mjs (로더·방면·그룹·탐색·허브)            [x] A2 build-night-bus-derived.mjs → hubs.json · anchors.json   [x] A3 validator 파생 검증 (+ registry.ts R3a 노출 등록부)
[x] B1 토큰 v2 + globals.css (값만 교체 · 노선색 토큰 추가)                              [ ] B2 헤더/푸터/카드 재조판                                   [ ] B3 기존 페이지 회귀 확인
[ ] C1 홈 v2 (상태줄·질문 카드·무대·바로가기)             [ ] C2 탐색 엔진 클라이언트 번들                               [ ] C3 버스 연출 컴포넌트
[x] D1 노선 페이지 템플릿 (/night-bus/[no] · RouteExplorer · ServiceStatus)                [x] D2 노선 5 에디토리얼(CC 초안 → Codex 사실 대조 FIX 4·NOTE 2 반영 · 포그린 교정은 배포 전 선택)                          [x] D3 sitemap/metadata (5 URL · ko 전용 · EN 폴백 nav)
[x] E1 허브 페이지 템플릿(지리 기본 · /hubs/[slug])                       [x] E2 허브 3 (승강장·방면 데이터 생성)                                            [x] E3 sitemap/metadata (3 URL · ko 전용)
[x] F1 arrivals 프록시 허브 ARS 게이트 + 올빼미 busRouteId 14                         [x] F2 HubArrivals(승강장 선택 → 탭 시 1회 조회 · 기준 시각 · 자동 갱신 없음)                       [ ] F3 예산·로그 확인
[ ] G1 소개·출처 페이지 개편                              [ ] G2 "왜 이 결과" 블록 · 제보 경로                            [ ] G3 업데이트 이력 글
[ ] H1 night-bus-map 재조판                              [ ] H2 역 카드 ARS·방면                                          [ ] H3 탐색 엔진 교체
[ ] I1 validate·build·standalone QA                       [ ] I2 Codex 감사                                               [ ] I3 포그린 승인 → 배포
```

## 7. A 단계 기록 (2026-10-15)

```
core.mjs        loadNightBus(방면 분할·반환점 대칭) · physicalGroups(1,062) · resolveQuery(허브 펼침·초성) · findJourney(직통 → 그룹 기준 1회 환승, 가상 제외 정류장 수) · isRunning · nextFirstBus
hubs.json       16 허브 (강남역 6노선 · 홍대입구역 6 · 신촌 6 · 동대문역 6 · 종로2가·종각 5 · 시청·을지로입구 5 · 서울역 4 · … · 청량리역 3)
anchors.json    14노선 × 방면 2 · 미매칭 26건 = 대부분 도심 편도 순환 구간(을지로입구·시청 등 한 방면에만 정류)과 그림 전용 노드(N73 구의역 · N75 새절역 · N72 삼각지역) → R3b 수동표(MANUAL)로 확정
스모크          홍대입구역→강남역 N75 직통 · 사당자동차학원→청량리역환승센터 N15→N26 환승(종로2가 01013) · 초성 ㅎㄷㅇㄱㅇ→서울역 동작
validator       데이터 PASS + derived registries OK
```

## 8. B·D 단계 기록 (2026-10-15)

```
B1   globals.css 토큰 값 교체(잉크 네이비 바탕 · 경계 · 보조 글자색) + --nb-n13~n75·a21·n72-display 추가. 변수 이름 불변 → 기존 25페이지 자동 재조판
D1   app/[locale]/night-bus/[no]/page.tsx (ko 전용 · 등록부 5 · dynamicParams=false → n99·/en 은 404)
     components/night-bus/RouteExplorer.tsx (client: 방면 토글 · 노선도 SVG(해당 노선 강조 · 앵커 흰 점+라벨 · 보간 정류장 점 · 한강 stroke) · 정류장 타임라인(ARS·만나는 노선 칩·허브 링크))
     components/night-bus/ServiceStatus.tsx (client: 운행표 기준 시간대 · SSR 비움 · 30초 갱신 · "도착 시각 아님" 고정 문구)
     lib/night-bus/data.ts(서버 로더) · schematic.ts(작도 데이터 파생: 경로 d · bbox · 보간) · messages nightBus(ko/en) · nav KO_ONLY_EN_FALLBACK 5건
D3   sitemap +5 (/ko/night-bus/n13 n15 n16 n31 n61 · lastmod 2026-09-02) · 메타: 제목 "N61 심야버스 노선·첫차 막차｜신정동~상계동 올빼미버스" · FAQPage·Breadcrumb JSON-LD
QA   next build OK(81 static) · standalone 127.0.0.1:3123 · n61 200 / n99 404 / en 404 · 본문 837단어 · 보간 점 205 · 방면 토글 OK
     콘솔 오류 0 · 390px overflow 0 · 기존 홈·심야A21·노선도 페이지 새 토큰에서 정상 · 캡처 27~30
미완  D2 노선 5 고유 콘텐츠(경유지 설명·방면 안내 문장은 데이터 생성 · 에디토리얼 보강은 R3b) · 헤더/푸터(B2) · 홈(C) · 허브(E) · 라이브(F) · 신뢰층(G) · 노선도 페이지 재조판(H)
```

## 9. D2·E·F 단계 기록 (2026-10-15)

```
D2   web/data/night-bus-editorial.ts — 5노선 areas(제목 지역 3)·summary·useCases·cautions 초안. 페이지 섹션 "이 노선은 이럴 때 / 주의할 점" 추가.
     제목 패턴 적용: "N61 심야버스 노선·첫차 막차｜강남·건대·노원 올빼미버스". Codex 사실 대조 결과는 §10 에 기록 예정
E    app/[locale]/hubs/[slug] (ko 전용 · 등록부 3 · dynamicParams=false) · lib/night-bus/hubs.ts(승강장별 노선·방면 · 반경 2.2km 실좌표 지도 · 관련 허브)
     제목 "강남역 심야버스 어디서 타나｜N13·N31·N37 정류장" · 구성: 승강장과 방면(ARS 카드) → 도착정보 → 노선 보드 → 실제 위치(SVG, 타일 없음) → 관련 허브 → 근거
F    /api/arrivals/[stopId]: 게이트 = 자율주행 Stop 7 + R3a 허브 ARS(13) · 응답 필터 = 자율주행 11 + 올빼미 14 busRouteId · 나머지 계약(서버 전용·20초 캐시·예산 300/day·fail-closed) 불변
     HubArrivals(client): 승강장 select → 버튼 1회 호출 → "{HH:MM} 기준 · 서울시 버스도착정보" + 원문(arrmsg) · 오류 시 전광판 안내 · 자동 갱신 없음
QA   build OK(84 static) · standalone: /ko/hubs/gangnam-station 200 · sinchon(미노출) 404 · en 404 · /api/arrivals/23284 → 503 CONFIG_ERROR(로컬 키 없음 = 게이트 통과 확인) · 99999 → 404 · sitemap +3
```

## 10. D2 Codex 검수 · 허브 QA 기록 (2026-10-15)

```
Codex D2  정본 docs/worklogs/R3A-D2-CODEX-REVIEW-20261015.md — summary·areas·useCases 교체 없음 · FIX 4(N61 막차 임박 추정 · N15 남태령 노선도 주장 · N31 대기시간 추정 · N31 동대문 편도 주장) · NOTE 2(N15 통과 시각 · N16 첫차 표현) 전부 반영
          검증된 사실: N61 거리·대수 단독 최대 · N31 배차 35~40 공동 최대 · N16 첫차 23:50 은 N26·N37(00:00) 다음 · 을지로입구역.광교 는 N15/N31 모두 한 방면에만 정차
허브 QA   하이드레이션 오류(React #418) 원인 = SVG <title> 안의 텍스트 노드 3개({name} {ars}) → 템플릿 문자열 1개로 교체 후 해소
          standalone: 강남역·홍대입구역 허브 데스크톱/모바일 콘솔 오류 0 · overflow 0 · 본문 470/451 단어 · 승강장 카드 7/4 · 도착정보 버튼 → 키 없는 로컬에서 안내 문구 정상
캡처      31~33 (허브 강남역)
```

## 11. 허브 지도 교체 (2026-10-15 포그린 피드백 "좌표 선도는 쓰레기 같다 · 카카오맵 같은 걸 넣자")

```
결정   실제 지도 = MapLibre GL 6.14.0 + OpenFreeMap "dark" 벡터 타일 (키·쿠키·호출 한도 없음 · 출처표기 필수 · 상업 이용 가능 — R0 결정 9 그대로)
       카카오맵 SDK 는 보류: 앱 키·도메인 등록이 필요하고 지도 안에 카카오 로고가 고정되어 금지선 5(브랜드 로고)와 충돌. 포그린이 원하면 교체 가능(키만 있으면 반나절)
구현   components/night-bus/HubMap.tsx(client · 노선 GeoJSON 선 + 반경 2.5km 정류장 점 + 허브 정류소 번호 마커·팝업 · 출처 컨트롤) · HubMapLoader(dynamic · ssr:false · 허브 페이지에서만 로드)
       MapTabs「실제 지도 | 노선도」 · HubSchematic(운영자 노선도에 허브 노선만 켜고 허브 역 강조) — 시안 v2.3 의 두 탭 구조 복원
       워커: 번들러가 maplibre 워커 URL 을 못 풀어 dist/maplibre-gl-worker.mjs 를 public/vendor/maplibre-gl-worker-6.14.0.mjs 로 제공(setWorkerUrl · 업그레이드 시 함께 교체)
의존성  package.json + maplibre-gl 6.14.0 (R0 결정 9 범위 · Phase 1A 의 "신규 dependency 0" 은 그래프 코어 한정이었음)
QA     홍대입구역 허브: 캔버스 렌더 · 타일 11건 수신 · 마커 4 · 출처 표시 · 콘솔 오류 0 · overflow 0 (데스크톱·모바일) · 캡처 34~35
```

## 12. 방향 전환 — 백지 v2 셸 재구축 (2026-10-15 포그린: "백지에서 새로 만들고 기존 걸 씌우자" · CC 동의)

진단: 기존 뼈대(헤더·푸터·카드·토큰) 위에 새 페이지를 끼워 넣는 점진 방식은 누더기를 만든다. 시안(docs/prototypes/r2-seoul-autonomous-v2/template.html)이
한 덩어리로 보였던 이유는 백지에 한 구조로 그렸기 때문. → **뼈대를 통째로 새로 만들고, 기존 페이지의 내용·데이터·메타데이터만 새 부품에 옮겨 심는다. URL·데이터·SSoT 불변.**

```
V0 준비      새 세션에서 읽을 것: 이 문서 §12 · 시안 소스(template.html = 디자인 스펙: 토큰·타이포·섹션 구조·버스 연출·탐색 UI) · R2 문서 §4.1~4.3
V1 디자인 시스템 v2   web/styles/v2/tokens.css(밤 잉크 팔레트·노선 14색·간격·라운드) · 글꼴 next/font/google Gothic A1(800/900 표시) + IBM Plex Sans KR(본문) + Geist Mono(수치) · Pretendard 폴백
             components/v2/: Shell(Header·Nav·Footer) · PageHero · Section · Card · Chip(노선색) · Button · Pill · StatusLine · SourceBlock · ReportLine
             기존 components/common·ui·home·layout 은 **삭제 대상**(v2 전환 완료 후 제거) — 고치지 않는다
V2 루트 셸    app/[locale]/layout.tsx 를 v2 Shell 로 교체 → 전 페이지가 즉시 새 헤더·푸터·바탕을 받는다 (내용은 아직 옛 조판)
V3 홈 v2     시안 그대로: 상태줄 → 질문 카드(core.mjs 탐색 · 허브 데이터 ≈100KB 클라이언트) → 결과 무대(SVG 버스 연출) → 많이 찾는 노선·허브 → 허브 보드 16 → 노선 갤러리 14 → 막차 3가지 → A21 → 출처
V4 재조판    N노선 5·허브 3(이미 v2 에 가까움 → 부품 교체) → 자율주행 노선 목록·상세 11·정류장 14 → 가이드 3·FAQ·소개·출처·업데이트·법적 2 → 각 페이지 내용·메타·JSON-LD 는 그대로
V5 노선도    /ko/night-bus-map: NightBusMap 내부 무수정 · v2 셸·액자(다크 안의 밝은 지도) · 역 카드에 정류소 번호·방면(anchors.json)
V6 신뢰층    소개(운영자·목적·방법) · 데이터 출처(필드별 출처·라이선스·갱신일) · 업데이트 글 1건(재탄생) · 제보 경로 — 모든 페이지 푸터에서 2클릭 이내
V7 검증      전 sitemap URL(84+) 데스크톱·모바일 캡처 회귀 · 콘솔 0 · overflow 0 · 하이드레이션 0 · lint 신규 0 · Codex read-only 감사 · 로컬 127.0.0.1:3123 으로 포그린 육안 승인
V8 배포      deploy-safety 계약(rollback 태그 → immutable 빌드 → candidate → rename 보존 → 승인 후 latest) · 한 번의 컷오버
품질 기준     "임시" 화면은 보고에 임시라고 적고, 보여드리기 전 CC 가 스크린샷을 먼저 본다 (10-15 교훈: 좌표 선도 placeholder · 누더기 조판)
지도         실제 지도 = MapLibre + OpenFreeMap dark (워커 public/vendor) · 정류장 직선 연결 금지 · 도로 경로는 서울시 노선경로 API(R4) 후
```

§6 체크리스트는 이 §12 의 V0~V8 로 대체한다 (A·D2·E·F 산출물은 V4 에서 재사용).

## CC 이견 및 아이디어

1 GPT 의 브랜드명 교체 제안에는 반대 — 도메인 변경 없이 이름만 바꾸면 검색 결과에 두 이름이 섞여 신뢰가 떨어진다. 태그라인으로 해결.
2 GPT 의 "허브 페이지 = 지리 지도 기본" 은 수용 — 허브는 "길 어느 쪽에서 타나" 가 핵심이라 실좌표가 맞다.
3 리스크: 디자인 시스템 v2 를 전역 토큰으로 적용하면 기존 25개 페이지가 한꺼번에 바뀐다. 배포 전 스크린샷 회귀(기존 11장 vs 신규)를 I1 에 포함.
4 아이디어: 노선 페이지의 "오늘 밤 운행 상태" 줄은 정적 빌드에서도 클라이언트 시각으로만 계산하므로 서버 비용 0.
