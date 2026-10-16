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

### 12.1 체크리스트 (진행 상태는 이 표만 갱신)

```
[x] V0 준비        시안 template.html · R2 §4.1~4.2 · §12 읽기 (2026-10-15 새 세션)
[x] V1 디자인 시스템 v2  web/styles/v2/tokens.css · base.css · legacy-bridge.css(전환기 전용) · lib/v2/fonts.ts(Gothic A1 800/900 · IBM Plex Sans KR 400/500/600 · Geist Mono · Pretendard 로컬 폴백) · lib/v2/route-color.ts(표시색·휘도 글자색)
                  components/v2/shell(Header·NavLinks·LangToggle·MobileMenu·Footer) · components/v2/ui(Section·PageHero·Card·RouteChip·Button·Pill·SourceBlock·ReportLine) · components/v2/night(useNightStatus·StatusLine)
[x] V2 루트 셸     app/layout.tsx(v2 스타일 3종만 import · 옛 globals.css 미참조) · app/[locale]/layout.tsx(Header → main.v2-main → Footer · GA·AdSense 스크립트 유지) · messages shell(ko/en)
[x] V3 홈 v2       app/[locale]/page.tsx · components/v2/home(SearchContext·HeroMap·AskCard·ResultStage·HubCardActions·home.module.css) · lib/night-bus/client-model.ts·client-doc.ts · app/api/night-bus/client(force-static) · messages nightHome(ko/en)
                  → 로컬 127.0.0.1:3123 · 캡처 36~44 · 포그린 피드백 대기 (여기서 멈춤)
[x] V4 재조판      (2026-10-16) 전 페이지 프레임 → PageHero·Section·Crumbs · 옛 토큰 이름 → v2 이름 전면 치환 · components/v2/transit(노선·로보택시·묶음 카드·검색·필터) · lib/transit-items.ts · MapLinks(카카오맵·네이버지도 텍스트 링크)
                  옛 components/common·ui·home·layout · app/globals.css · legacy-bridge.css · design-preview · lib/fonts.ts · lib/design · routes/SearchBar 삭제 · 기록 §12.4 · 포그린 육안 승인 대기
[x] V4 피드백      (2026-10-16 아침) 포그린 2건 — 히어로 헤드라인 가독성 → 질문 카드와 같은 유리 패널 · 허브 지도 팝업 글자색 → 기록 §12.5 · 캡처 25~32 · "나머지는 CC 추천대로" → V5 진행
[x] V5 노선도      (2026-10-16) /ko/night-bus-map 을 v2 액자(어두운 틀 안의 밝은 종이 지도)로 · 역 카드에 정류소 번호·방면 + 카카오맵·네이버지도 텍스트 링크(anchors.json 파생 · 작도 데이터 무수정) · 경로 바의 카카오 노란 버튼 제거 · 허브 16 카드(내부 허브 페이지 + 지도 링크) · 노선 카드 → 노선 상세 링크 · N노선 타임라인 정류장명 탭 → 지도 링크 · NightBusMap 옛 lint 오류 5 → 0 · 기록 §12.6
[x] V6 신뢰층      (2026-10-16) 소개(운영자·목적·방법·이력·제보) · 데이터 출처(필드별 9행 출처·라이선스·기준일) · 업데이트 글 「올빼미버스 중심으로 다시 만들었습니다」(ko/en) · 노선·허브 제보 mailto(제목 자동) · 자율주행 상세 노란 경고 줄 → 근거 줄 · 기록 §12.7
[x] V7 검증        (2026-10-16) standalone 빌드 11 · sitemap 79 URL × 데스크톱·모바일 158 검사: 콘솔 오류 0 · overflow 0 · 하이드레이션 0 · h1 1 · 푸터 1(예외 /ko/stops/01009 = 로컬 도착 API 키 없음 → 503 폴링 · 기존) · 내부 href 81 전부 200 · 깨진 링크 0 · 리다이렉트 0 · canonical 불일치 0 · robots/ads/sitemap 200 · 404 응답 정상 · 저장소 eslint 오류 0 · 홈 messages 축소 · Codex BLOCK 0 · FIX 2 반영 · 기록 §12.8
[x] V8 배포        (2026-10-16 14:39:55 KST) 73b0fa0 라이브 · 중단 1.94초 · candidate·라이브 QA 전항 PASS · latest 이동만 포그린 라이브 승인 대기 · 기록 §12.12
```

### 12.2 V1~V3 기록 (2026-10-15)

```
구조     옛 뼈대는 한 줄도 고치지 않았다. 새 토큰 이름(--bg·--fg·--accent·--nb-*)으로 백지에서 만들고, 아직 재조판 전인 옛 페이지는 styles/v2/legacy-bridge.css 가
         옛 변수 이름(--color-*·--radius-xl 등)을 v2 값으로 이어 주며 옛 페이지가 본문 안에 넣는 옛 푸터(.v2-main footer)를 숨긴다. V4 끝에 bridge·옛 부품을 함께 삭제
헤더     브랜드 + 태그라인 "서울 심야 이동 안내"(§1 채택) · 데스크톱 내비 5(노선도·자율주행 노선·이용 방법·FAQ·업데이트) · KO/EN · 모바일 시트 메뉴(안내·심야버스·사이트 3묶음 + 언어)
푸터     링크 3묶음 + 근거 줄(정류장 2026-09-02 · 운행표 2026-03-20 · 자율주행 확인일 · 노선도 자체 제작 — 값은 SSoT _meta 에서) + 제보 메일. 어느 페이지든 출처·제보 1클릭
홈       시안 v2.3 그대로: 상태줄(운행표 기준 n/14 · 기준 HH:MM KST · 기기 시각만) → 질문 카드(추천 목록 8·초성·허브 우선 · 「내 위치」는 탭 시에만 권한 요청 → 기기 내 최근접 정류장)
         → 결과 무대(버스 SVG 가 노선색·번호를 입고 들어옴 · 걷기/탑승/환승/하차 단계 · 노출 노선·허브 페이지 링크) → 많이 찾는 노선 5·허브 3 → 허브 보드 16(「여기서 출발」· 노출 3곳만 페이지 링크)
         → 노선 갤러리 14(노출 5 → 노선 페이지 · 나머지 → 노선도) → 막차 3가지 → A21(routes.json 값·확인일) → 근거(SourceBlock) + 제보
히어로   포그린 노선도(night-bus-data.ts) 무보정 SVG 2벌(데스크톱 meet 우측 정렬 · 모바일 slice) · 운행 시간대 노선만 lit(.96) 나머지 dim(.14) · SSR·운행 전은 soft(.7) · 허브 라벨 15(종로5가·광장시장은 작도에 역이 없어 라벨 없음)
탐색     core.mjs 를 그대로 클라이언트에서 사용 (서버 페이지와 같은 계산원). 데이터 = /api/night-bus/client (빌드 시 정적 · 131KB/≈37KB gz · 가상 정류소 포함 · 좌표 5자리) 를 유휴 시점 또는 첫 상호작용에 1회 fetch
결정     ① 결과 무대는 검색 후에만 (시안의 기본 예시 대신 예시 칩 3개 = 엔진 스모크로 검증한 쌍) ② 검토용 고정 시각 ?at=HH:MM (UI 없음 · 상태줄에 "고정 시각" 표시) ③ EN 홈 = 같은 구조 · 정류장명 한국어 그대로 · 허브 nameEn · 노선·허브 페이지 링크는 ko 로
         ④ 모바일 메뉴는 body 포털 (헤더 backdrop-filter 가 fixed 기준 상자가 되어 시트가 잘리던 문제) ⑤ 혼합 한글 줄(배차·정류소 수)은 본문 글꼴 + tabular-nums, 모노는 번호·시각만
QA       next build OK(85 static · 경고 0) · standalone 127.0.0.1:3123 · 데스크톱 1440/모바일 390: 콘솔 오류 0 · overflow 0 · 하이드레이션 경고 0 · 글꼴 3종 로드 확인
         엔진 스모크 8건(직통 6·환승 2·초성 1 포함) · 내 위치 테스트(홍대 좌표 → 동교동삼거리 14061 · 약 40m → N75 강남역 직통) · 모바일 메뉴 열림 · 옛 페이지(FAQ·N61) 새 셸 아래 푸터 1개
         캡처 ~/Desktop/seoul-shots/2026-10-15-site-analysis/36~44 (v2-home now/night/search/menu/en · legacy n61)
후속     홈 HTML 264KB — NextIntlClientProvider 에 messages 전체가 직렬화됨(옛 클라이언트 부품이 common·routes·status·stopDetail 을 써서 지금은 제한 불가 → V4 후 shell·nightHome 만 전달) · 허브 16 중 13 은 페이지 없음(「여기서 출발」만) · 공항 심야 N6xxx 는 official 없어 홈 제외
Codex    read-only 감사 → §12.3
```

### 12.3 Codex 감사 (V1~V3 · 2026-10-15) — 정본 docs/worklogs/R3A-V2-SHELL-CODEX-REVIEW-20261015.md

```
BLOCK 2  ① 같은 허브의 다른 별칭(종로2가 ↔ 종각)을 출발·도착으로 넣으면 허위 경로 → 반영: plan() 이 허브 동일성·방문 집합 동일성까지 "같은 곳"으로 판정
         ② 모바일 메뉴 dialog 에 초기 포커스·포커스 트랩·닫은 뒤 트리거 복원 없음 → 반영: 열리면 닫기 버튼으로 포커스 · Tab 순환 · 닫히면 메뉴 버튼으로 복원
FIX 반영  콤보박스 aria-activedescendant + option id · 추천 선택 onClick(onMouseDown 은 blur 방지만) · 위치 성공 후 데이터 실패를 "권한 거절" 로 오안내하던 분기 수정
         StatusLine 의 aria-live 제거(30초마다 낭독 방지) · 영어 허브명(Gangnam…) 으로도 허브 추천 · 클라이언트 문서 런타임 형태 검사(isClientDoc) · 미사용 키 3개 삭제(ask.swap·ask.clear·steps.alightTitle)
FIX 이월  타이머 합치기(허브 16 + 상태줄 + 지도 + 캡션 각자 30초) · 히어로 SVG 2벌 → 1벌 · 클라이언트 provider 에 messages 전체 직렬화(옛 클라이언트 부품이 common·routes·status·stopDetail 사용 → V4 후 제한)
         `.v2-main footer` 전역 선택자(현재 숨기는 건 SiteFooter 뿐 · V4 끝에 bridge 삭제) · HUB_NODE 중복(HubSchematic.tsx 는 V4 재조판 때 lib 판으로 교체) · core.mjs 반환 타입 단언(V4 에서 core 타입 선언 파일 추가 검토)
검증된 사실  금지 데이터 3종(night-bus-data.ts · routes.json · night-bus-routes.json) 무수정 · 신규 클라이언트 네트워크 호출은 내부 정적 /api/night-bus/client 1곳 · ko/en 키 집합 동일 · ICU 오류 0 · useNightStatus 하이드레이션 경로 안전
전체 lint   저장소 전체 eslint 는 기존 NightBusMap.tsx 오류로 실패(이번 라운드 이전부터 · V5 에서 다룸) — 신규 범위는 0
```

### 12.4 V4 재조판 기록 (2026-10-16)

```
틀       모든 페이지 = PageHero(경로 표시 Crumbs · eyebrow · h1 · lead · 보조 정보) → Section(또는 v2-wrap.v2-body) → 셸 푸터. 옛 PageContainer·PageTopBar·SiteFooter 호출 0
부품     components/v2/transit: RouteCard(자율주행 고정 노선 · A코드 배지) · RobotaxiCard(26-C2O 불변식 그대로 이식) · GroupCard(새벽·심야 묶음) · Controls(SearchBar·SegmentedControl)
         components/v2/ui: Crumbs(next-intl Link · 마지막 항목 aria-current) · MapLinks(카카오맵 /link/map/이름,위도,경도 · 네이버지도 이름 검색 · 새 탭 noopener · 로고 없음) · Section width="text"(긴 글 720px) · PageHero crumbs 슬롯
         lib/transit-items.ts(노선·로보택시 화면 투영 — /routes 와 /routes/late-night 공용) · lib/v2/map-links.ts
페이지   routes(목록·새벽·심야) · routes/[id] · stops/[slug](정류소 번호 옆 지도 링크 2개) · night-bus/[no] · hubs/[slug](승강장 카드마다 좌표 지도 링크) · how-to-ride · faq · about · data-source · updates(목록·상세 2분기) · privacy · terms · night-bus-map(틀만 · NightBusMap 내부 무수정) · night-bus-fare · after-last-train · EN night-bus guide
토큰     옛 이름(--color-* · --font-sans/kr) 참조 0. 정당한 세부 척도(--radius-xs~2xl · --shadow-sm/md/lg/glow · --space-screen/card/section-gap · --accent-hi/lo/glow · --info)는 tokens.css 로 편입
삭제     components/common·ui·home·layout · app/globals.css · styles/v2/legacy-bridge.css · app/design-preview · lib/fonts.ts · lib/design/tokens.ts · components/routes/SearchBar.* · 옛 홈 page.module.css · early/late page.module.css · privacy/terms page.module.css(미사용)
         각 page.module.css 의 죽은 클래스(topBar·backBtn·heading 등 옛 프레임 잔재) 제거 — 사용 클래스 누락 0 확인 · messages 에서 옛 네임스페이스(globalHeader·siteFooter·home·common) 제거
내부 링크 Crumbs(홈 › 노선 › …) · 노선 목록 하단 올빼미버스 배너(노선도 + 홈 경로 찾기) · A21 상세 → 동대문역 허브 · 허브 ↔ N노선 ↔ 홈 · EN 홈의 N노선·허브 칩은 locale="ko" 로 ko 페이지에 연결(Codex BLOCK 반영)
Codex    정본 docs/worklogs/R3A-V4-REFRAME-CODEX-REVIEW-20261016.md — BLOCK 1(EN 홈 노선 칩 404) 반영 · FIX 3(검은 경계선 → --line · 옛 네임스페이스 정리 · 죽은 CSS 제거) 반영 · NOTE(formatDate 중복 · 단언)는 이월
         검증된 사실: 금지 데이터 3종 무수정 · metadata·canonical·OG·JSON-LD 의미 변경 없음 · 삭제 모듈 참조 0 · h1 중복 0 · 지도 링크 보안 속성 OK
QA       next build OK(정적 84) · sitemap 77 URL × 데스크톱·모바일 전수: 콘솔 오류 0 · overflow 0 · 하이드레이션 경고 0 · h1 1 · 푸터 1 (예외: /ko/stops/01009 는 로컬에 도착 API 키가 없어 503 → 재시도 폴링으로 networkidle 미도달 — 'load' 기준으로는 정상 · 배포 환경에서는 키 있음)
         허브 페이지 경고 1건 = OpenFreeMap 스타일 wood-pattern 이미지 누락(이전부터 · 지도 라이브러리 측)
남은 것   V5 노선도 페이지 액자(역 카드에 정류소 번호·방면) · V6 신뢰층 · V7 전수 캡처 회귀(캡처는 scripts/qa-v2-shots.mjs · 전수 검사는 scratchpad qa-all.mjs 를 repo 로 옮길 것) · 홈 messages 축소(이제 옛 클라이언트 부품이 없어 가능)
```

### 12.5 V4 포그린 피드백 반영 (2026-10-16 아침)

```
피드백   ① 히어로 헤드라인("밤 11시, 서울은 …")이 노선 위에 맨글자로 얹혀 가독성 저하 → "다른 방법 강구"  ② 허브 실제 지도의 정류소 팝업(이름 · ARS)이 흰 바탕에 흰 글씨 → "글씨 안보임"  ③ 나머지는 CC 추천대로
처리     ① components/v2/home/home.module.css — .heroSide 를 질문 카드와 같은 유리 패널(var(--bg-glass) · blur 14px · --line-2 테두리 · --radius-l · --shadow-card)로 바꾸고 위에 시안색 짧은 눈썹 줄, 텍스트 그림자 제거, .hero::after 에 패널 뒤 radial 안개 한 겹 추가. 모바일(≤860px)은 전폭 패널
         ② components/night-bus/HubMap.module.css — .map :global(.maplibregl-popup-content) 바탕 #F3F5FA · 글자 #0B0F1A(마커 알약과 같은 체계) · 꼬리색 8방향. 원인은 MapLibre 기본 흰 팝업이 본문 글자색(--fg)을 상속한 것. HubMap.tsx 무수정
         ③ scripts/qa-v2-shots.mjs 에 popup 옵션(마커 button.maplibregl-marker 클릭 + 지도 영역 -map.jpg 캡처)
검증     next build OK(빌드 8 · 정적 84) · standalone 127.0.0.1:3123 재기동(PID 교체 · 좀비 0) · 캡처 25~32(홈 낮·밤(?at=00:30)·EN · 허브 팝업 데스크톱·모바일): 콘솔 오류 0 · overflow 0 · 허브 경고 1 = 기존 wood-pattern
         반복 확인은 next dev(3124 · .next/dev 분리 출력)로 하고 끝에 종료 — 최종 판정은 standalone 만
세션     컨텍스트 요약(compaction) 직후라 여유 있음 → 같은 세션에서 V5 진행 권고. 클리어 시 첫 문구는 SESSION-HANDOFF 머리에 적어 둠
```

### 12.6 V5 노선도 액자 기록 (2026-10-16)

```
액자     app/[locale]/night-bus-map/page.tsx 의 .frame(bg-2 · line-2 · radius-l · shadow-card) 안에 NightBusMap. 틀 머리 = 눈썹(자체 제작) · 안내 문장 · 기준일(카카오맵 2026-06-08 · 정류소 서울시 {snapshot}) · 역 위치 권역 표시
         night-bus-map.module.css 의 틀(chrome)만 v2 토큰으로: 검색 입력(bg-3 · line-2 · accent 포커스) · 버튼(ghost/primary=accent · 브랜드색 0) · 범례(어두운 행 · 노선 칩 링 흰색) · 경로 바(bg-3) · 종이 지도(.obStage #f7f4ec)는 그대로
역 카드   NightBusMap props stationStops(노드 → [노선, 방면키, ARS, 이름, 위도, 경도] 튜플 · 112 노드 453건 ≈ 34KB) · towards(노선별 방면 이름) · routePaths(등록부 5 + A21). 카드 = 지나는 노선 칩 → 정류소 번호·방면(기본 펼침 · 데스크톱 236px 스크롤) → 카카오맵(좌표)·네이버지도(이름) 링크 → 노선 상세 링크 → 권역 표시 안내. 모바일은 position: relative(닫기 × 가 카드 안에)
         데이터는 page.tsx(서버)가 anchors.json + night-bus-routes.json 에서 조립 · night-bus-data.ts(작도)·NightBusMap 탐색 로직 무수정
금지선 5  경로 바의 카카오맵(#FEE500)·네이버(#03C75A) 버튼 → .obMapLinks 텍스트 링크(accent 테두리). 범례 버스 아이콘 색도 토큰으로
내부 링크  허브 섹션 = HUBS 16 카드(이름 · 노선 · 허브 페이지 →(3곳) · MapLinks) · 노선 카드마다 "노선 상세 — 전체 정류장·정류소 번호·첫차 막차 →"(등록부 5 + 심야A21 → /routes/simya-a21)
N노선     components/night-bus/RouteExplorer: 정류장 이름 = button(aria-expanded) → 카카오맵(좌표)·네이버지도 링크 펼침 · 안내 문장 nightBus.stopTap(ko/en)
lint     NightBusMap.tsx 옛 오류 5 → 0: useTouchZoom ref 쓰기 → useEffect 안으로(react-hooks/refs) · SearchBox 선택 동기화 → 렌더 중 파생 상태 패턴 · 경로 리셋 effect → setter 쪽 resetJourneyUi · 미사용 MIN_ZOOM/isDirectMulti 제거. 남은 경고 4(exhaustive-deps · 동작 영향 있어 보류)
QA       tsc OK · next build 9 OK · 캡처(노선도 낮·역 카드 데스크톱/모바일·전체화면·허브/노선 섹션·N61 정류장 탭): 콘솔 오류 0 · overflow 0. qa-v2-shots.mjs 옵션 추가: station · fs · stoptap
```

### 12.7 V6 신뢰층 기록 (2026-10-16)

```
소개     /about (ko/en · messages about 전면 교체): 누가(운영자 한 사람 · 독립 · 소속·제휴 없음 · 연락) → 왜(밤 11시 이후 "지금 어디서 무엇을" · 대상 · 실시간 앱 아님) → 어떻게(필드 6줄 · 날짜는 NIGHT_META·getLatestVerifiedDate 주입) → 갱신과 이력(/updates) → 오류 제보(mailto 제목 자동)
         운영자 이름·사진은 넣지 않았다(포그린 결정 사항 — §CC 이견)
출처     /data-source (ko/en · messages dataSource 전면 교체): 필드별 9행 dl(항목 · 출처(링크) · 라이선스·사용 방식 · 기준일) — 정류소(OA-1095 · 공공누리 1유형 · {snapshot}) · 운행표(서울시 공지 · 4유형 페이지 · 사실 수치만 · {revisedOn}) · 노선도(자체 작도 · ⓒ) · 허브 16(자체 선정 규칙) · 자율주행(카카오맵 표시 정보 수동 확인 · 최근 확인일) · 영문명(다국어 목록 · 2025-03-14) · 요금(서울시 · 2026-03-20) · 지도 타일(OpenFreeMap·OpenMapTiles·OSM ODbL) · 도착 정보(공개 API · 조회 시각)
         lib/night-bus/data.ts 의 NIGHT_META 타입에 url·dataset·title·publisher 추가(JSON 무수정)
업데이트  data/updates/site-rebirth-night-bus-first.ts (articleSections · ko/en · date 2026-10-16 — V8 컷오버일로 맞출 것) · updates/[slug] 는 게시일=발생일=자료일이면 날짜 1개만 · 목록 설명 심야 중심으로
제보     night-bus/[no] · hubs/[slug] 의 제보 줄 → mailto:CONTACT_MAIL?subject=[제보] {노선|허브} · 푸터 제보 줄 유지 → 모든 페이지에서 1클릭
근거 줄   routes/[id] 의 노란 "카카오맵 기반 정보입니다" → fg-2 "근거: 카카오맵에 표시된 서울특별시 제공 노선 정보를 수동으로 확인한 값입니다…"(ko/en) · metadata about/dataSource 설명 심야 중심
QA       tsc OK · eslint 신규 범위 0 · dev 캡처(소개·출처·업데이트 목록·재탄생 글·EN 출처·청계A01): 콘솔 오류 0 · overflow 0
미반영    §2 G 의 "왜 이 결과인지" 설명 블록(홈 결과 무대) — V7 성능 항목과 함께 이월
```

### 12.8 V7 검증 기록 (2026-10-16)

```
빌드     next build 10 → Codex FIX 반영 후 11 (정적 84 · 콘솔 경고 없음) · standalone 127.0.0.1:3123 재기동(좀비 0 · dev 3124 종료)
성능     app/[locale]/layout.tsx 의 NextIntlClientProvider messages={{}} (next-intl 4 는 undefined 일 때만 request config 전체 상속 — Codex 가 소스로 확인) · 클라이언트 부품이 있는 페이지만 lib/v2/client-messages.ts 로 자기 네임스페이스 provider: 홈 nightHome · /routes RoutesList routes · /stops/[slug] ArrivalCard stopDetail
         효과: 비홈 페이지 HTML 에서 ko.json 38KB·en.json 33KB 직렬화 제거(예: /ko/faq 에 홈 문구 0건) · 홈 264KB → 237KB · 노선도 252KB(역 카드 데이터 34KB 포함)
전수 회귀  scripts/qa-v2-all.mjs: sitemap 79 URL(재탄생 글 ko/en 추가로 77→79) × 데스크톱·모바일 = 158 검사 → bad 2 = /ko/stops/01009 데스크톱·모바일(로컬 도착 API 키 없음 → 503 재시도 폴링 → goto 45s 타임아웃 · 페이지 자체는 h1 1·푸터 1 정상 · V4 와 동일 · 배포 환경은 키 있음). 그 외 콘솔 오류 0 · overflow 0 · 하이드레이션 경고 0 · h1 1 · 푸터 1
링크·메타  scripts/qa-links.mjs(신규 · AdSense 사전 점검 입력): 79 페이지 전부 200 · 내부 href 81 전부 200 · 깨진 링크 0 · 리다이렉트 링크 0 · canonical 누락 0·불일치 0 · hreflang 없음 13 = ko 전용 페이지(N노선 5 · 허브 3 · 요금·막차 가이드 · 노선도 ko · 노선도 공개 글 등 — 설계대로 self-canonical) · /robots.txt·/ads.txt·/sitemap.xml 200 · / → 307 /en(기본 로케일) · 없는 경로 404
lint     저장소 전체 eslint 오류 0 · 경고는 public/vendor(maplibre 워커 · 이제 무시 목록) 와 옛 미사용 ChevronLeft/Section 정리 후 NightBusMap 경고 0
Codex    정본 docs/worklogs/R3A-V5V6-CODEX-REVIEW-20261016.md — BLOCK 0 · FIX 2 반영: ① useTouchZoom ref 갱신 useEffect → useLayoutEffect(연속 터치 이벤트 앞 flush 보장) ② Hook 의존성 경고 4 정리(allDirectRoutes useMemo · 불필요 sel/isMobile 제거 · setVb/stageRef 명시) · NOTE: 금지 데이터 3종 무수정 · 브랜드색 0 · 외부 API 직접 호출 0 · 역 카드 112 노드 누락 0 중복 0 · ko/en 키 동일 104 · ICU 오류 0
캡처     ~/Desktop/seoul-shots/2026-10-16-v2-shell/33~48 (V5 노선도·역 카드·전체화면·N61 정류장 탭 · V6 소개·출처·재탄생 글·청계A01 근거 줄)
작업 트리  수정 73 · 삭제 51 · 신규 묶음 25(이 라운드 외 기존 미추적 파일 포함) — 커밋은 정본만 명시 stage(`git add .` 금지)
이월     §2 G "왜 이 결과인지" 블록 · 영어 정류장명(공식 SSoT 없음) · 허브 16 중 13 페이지 없음(「여기서 출발」만) · HUB_NODE 중복 · 히어로 SVG 2벌 · 타이머 통합 · 운영자 이름·사진(포그린 결정)
```

### 12.9 배포 전 점검 (2026-10-16 · 포그린 "배포 전 점검은 CC 가" → CC 추천대로 전부 실행 · 배포 직전 정지)

```
운영자     포그린 지시 "다파라코프(사업자명)" → 소개 「누가 만드나」(ko/en) · 푸터 저작권 줄 · 개인정보처리방침·이용약관 문의처 developer 필드(ko/en) 에 반영. JSON-LD 의 Organization 명은 Seoul Autonomous(브랜드) 유지
에이전트    read-only 감사 에이전트 3개 병렬: ① AdSense 정책·콘텐츠 가치(필수 페이지·ads.txt·얇은 페이지 5개·탐색·신뢰 신호·언어) ② 기술 SEO(title/description 중복·길이 · canonical/hreflang · OG 이미지 · JSON-LD · 제목 구조 · 이미지 alt · robots/sitemap/404 · 고아 페이지 · 크기) ③ 접근성·모바일(키보드·ARIA·대비·터치 타깃·모바일 레이아웃·reduced-motion) — 결과는 아래 「에이전트 결과」
CC 직접    라이브 sitemap(69) ↔ 로컬(79) 대조: 라이브에만 있는 URL 0 → 배포 후 404 없음 · 신규 10(허브 3 · N노선 5 · 재탄생 글 ko/en) · robots.txt 동일 · ads.txt pub-7976139023602789 = layout 의 AdSense client
          성능 실측(모바일 390 · 로컬): 홈 CLS 0.013 · 나머지 0 · DOM 1,277 · 요청 353(그중 글꼴 302) · 글꼴 2.5MB (Gothic A1 900 733KB · Plex 500 804KB · Plex 600 801KB · Plex 400 108KB) · JS 비압축 1.07MB(허브 2.55MB = maplibre) · HTML 은 gzip 적용(/ko 237KB → 45KB 전송)
고침 ①     글꼴 굵기 축소(lib/v2/fonts.ts): Gothic A1 900 만 · Plex 400·600 만 (CSS 의 500·800 은 가장 가까운 굵기로 자동 매칭 · 시각 변화 미미) → 홈 글꼴 1.03MB · 120 요청 (−59%)
고침 ②     정적 프리렌더: 모든 locale 페이지가 ƒ(요청마다 서버 렌더 · HTML 파일 0 · Cache-Control no-store) 였음(v2 이전부터). next-intl 요구대로 setRequestLocale(locale) 을 app/[locale]/layout.tsx + 페이지 20개에 추가 → 빌드 12 에서 전부 ●(SSG) · HTML 82장 · x-nextjs-prerender 1 · Cache-Control s-maxage=31536000. 페이지에 searchParams·headers·cookies 사용 0 확인
검증 빌드   next.config.ts distDir = NEXT_DIST_DIR || '.next' 로 .next-check 에 별도 빌드(12) → 127.0.0.1:3125 에서 검증(에이전트가 쓰는 3123 은 그대로): qa-links 79 페이지·81 링크 전부 200 · 깨진 0 · canonical 0 · 404 정상 · 콘솔 오류 0(새 경고 = CSS preload 미사용 2건 · Chrome 안내성) · qa-v2-all 전수 = 아래
에이전트 결과  (상세·처리 표시: docs/worklogs/R3A-PREDEPLOY-AGENT-AUDITS-20261016.md) ① 정책·콘텐츠: BLOCK 3 — 「준비 중」 라벨 8페이지(→ 노선도 링크로 교체·liveSoon 삭제 ✅) · 정류장 페이지 14개 얇음·근사중복(Stop URL 정책 §12 잠금: noindex 금지 → 포그린 결정 필요 ⛔) · 셸 없는 404(미해결 ⛔ 아래) / FIX 10 중 반영: 정체성 문구(홈 meta·WebSite JSON-LD·약관 §2·FAQ 올빼미 6문항·이용방법 올빼미 단계·how-to-ride meta) · 실시간 라벨·FAQ 모순 · 자율주행 요금 고지 완화 · 소개 괄호 · 노선도 설명 6건 데이터 검증 재작성 · EN 칩 (KO) 표식 · 방침 §10 링크 · 운행시간 문구 통일(첫차 23:10~00:00 · 막차 03:10~04:10) · 허브 지도 안내 현재형
          ② 기술 SEO: BLOCK 0 · FIX 반영: 한글 글꼴 preload:false(96 preload → 0) · OG PNG 964KB → JPG 210KB + alt · privacy/updates title 접미 · EN 정류장 description 꼬리 제거 · 허브 카드 칩 title · BreadcrumbList 현지화+정류장 Routes 단계 · Article publisher/image/mainEntityOfPage · sitemap lastmod 고정일·x-default · 푸터 h4 → p · EN how-to-ride h2 / 미반영: 루트 307(미들웨어가 처리 · 의도) · hreflang alternateLinks
          ③ 접근성: BLOCK 4 반영 — 노선도 검색 콤보박스(ArrowDown·Enter·role) 실측 통과 · 흰 역 카드 버튼 밝은 처방 · 전체화면 aria-modal·포커스 트랩·복귀 실측 통과 · 노선 칩 글자색 공용 onColor + 어두운 노선색 글자 routeTextColor(3:1) / FIX 반영: scroll-padding-top · aria-pressed(범례·카드·경로 칩) · 역 카드 닫기 이름·Esc·크기 · ServiceStatus aria-live 제거 · MapTabs 라벨·tabpanel·화살표 · select 16px · MapLibre 한국어 · 세그먼트 라벨 · FAQItem aria-expanded · LangToggle 라벨 · 장식 svg aria-hidden · reduced-motion 스크롤 · MapLinks role=group · EN 한글 lang
전수 회귀    최종 빌드 16(127.0.0.1:3123 · 감사 수정 전부 + 루트 레이아웃 복원): qa-v2-all 79 URL × 데스크톱·모바일 = 158 검사 → bad 2 = /ko/stops/01009 뿐(로컬 도착 API 키 없음 → 503 폴링 → goto 45s 타임아웃 · h1 1·푸터 1 정상 · 기존 예외). 그 외 콘솔 오류 0 · overflow 0 · 하이드레이션 0 · h1 1 · 푸터 1 · qa-links 79 페이지·81 링크 전부 200 · 키보드 실측(빌드 15) 통과
⛔ 미해결    404 셸: notFound() 응답이 Next 의 __next_error__ 문서(빈 body + RSC 페이로드, 클라이언트 렌더)로 나가 서버 HTML 에 헤더·푸터·lang 이 없음 — app/[locale]/not-found.tsx·[...rest] 캐치올·app/not-found.tsx(자기 html) 까지 넣어도 동일(dev 3124 실측). 다음 세션: Next 16 에서 notFound 의 SSR 문서 생성 조건 조사(글로벌 not-found 프리렌더 `/_not-found` 와 로케일 레이아웃 조합)
⛔ 다음 세션  ① 404 셸 조사·수정 ② 포그린 결정: 정류장 페이지 14개(계약 유지 / 보강 / 임시 noindex 예외) · 자율주행 요금 재확인 · 운영자 이름 ③ 재탄생 글 date → 컷오버일 ④ 커밋(코드 1 + docs 1) → 푸시 → 배포 승인 (최종 빌드 16 전수 회귀는 완료 · 위 줄)
심야버스 4개  포그린 질문 "4개 노선 추가": 데이터(2026-09-02 스냅샷)는 올빼미 14 + 공항 심야 4(N6000·N6002·N6701·N6703 · 운행표 출처 달라 official 없음 → 운행시간 표시 금지 규칙)뿐. 공개 검색(firecrawl 2회)에서 2026년 올빼미 신설 노선 근거 없음 — 서울시 가을 공지도 "14개 노선 · 23:10~06:00". 추가된 4개 = 공항 심야버스일 가능성. 노출하려면 공식 운행표 출처 확보 후 별도 그룹으로(R3b)
```

### 12.10 GPT 외부 검토 반영과 5차 신청 전 보강 계획 (2026-10-16 · 포그린 결정 B)

```
입력     GPT-BRIEF-20261016.md → GPT-REVIEW-20261016.md(원문). 포그린: "CC 이견 2개 동의 · A/B/C 중 B"
즉시 반영  ① 소개·푸터 운영 주체 문구(GPT 제안): "다파라코프가 서울시 공공데이터와 공식 공지를 바탕으로 직접 검증·가공해 운영하며, 오류 제보를 확인해 수정합니다"(ko/en · 소스만 반영 · 로컬 3123 은 빌드 16 그대로 → 다음 빌드에 포함)
         ② 기본 로케일: 바꾸지 않음 — `/` 는 이미 next-intl 미들웨어가 Accept-Language 로 보냄(실측: ko 브라우저 → /ko · en → /en · 없음 → /en). GPT 우려는 현 동작으로 충족
순서(CC 추천) ① V8 배포(포그린 승인 · deploy-safety) → ② 배포 후 4주 관측창 동안 R3b 보강 → ③ 재배포 → ④ AdSense 5차 (GPT: 배포 직후 신청 X · 안정 배포 후 약 4주)
R3b 보강   (큰 작업 → 설계 문서 먼저: docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md ✅ 작성(2026-10-16 · DRAFT · 결정 요청 D1~D7) · 분석→설계→구현 분리) ⚠ 아래 "14 → 7" 은 오기 — 승인 7 ARS = 방향쌍 3 + 단독 1 = 장소 4 → URL 14 → 8 (설계 문서 §1.1)
  B 정류장 통합  14 → 7(장소당 1페이지 · 양방향 섹션) — URL /{locale}/stops/{place-slug} 신설 + 옛 14 URL 301 리다이렉트(next.config redirects · 색인된 URL 보존) · sitemap 14 → 7/언어
              페이지 = 장소 머리(이름·정류소 번호 2개·위치) → 방향 A(정류소 번호 · 이 승강장에서 타는 노선과 방면 · 이전/다음 정류장 · 카카오맵/네이버 링크) → 방향 B(동일) → 「어느 쪽에서 타나」 판단 단락(사람 문장 · 데이터로 확인 가능한 사실만) → 근처 올빼미버스 정류소(좌표 300m 이내 · 노선·정류소 번호·방면 — 심야 이동 연결 = 사이트 정체성) → 출처·기준일 → 제보
              사람 문장 7곳×ko/en: CC 초안 → 포그린 검수(현장 사실은 포그린 확인) · routes.json 무수정(파생 층) · validate-graph 21항 PASS
              정책: STOP-URL-POLICY-20260826.md 의 slug·"1 ARS = 1 페이지" 조항을 포그린 결정 B 로 개정(색인·sitemap 포함·noindex 0 원칙은 유지)
  약한 페이지 4  업데이트 글 05-09 2건(본문 절반 "확인 필요") → 확인된 사실 중심으로 재작성 + 공식 출처 링크(또는 1건으로 통합) · routes/early-morning·late-night(목록만) → 묶음의 공통 성격(03:30 단일 출발·평일·회차·N버스 막차와의 접속) 2~3단락 또는 /routes 로 통합
  자율주행 재검증  11노선 정류장·표시 시각·요금을 카카오맵/공식 안내로 재확인 → lastChecked·요금 갱신(데이터 변경 = 포그린 지시 사항 · CC 는 대조표와 수정 초안만)
승인 후 항목  Auto ads 쓰면 404·오류·빈 화면에 광고 금지 설정 · EEA/영국/스위스 개인 맞춤 광고 시 Google 인증 CMP/TCF
404 셸     GPT: low-value 주범 아님(404 상태·noindex 정상) → 5차 차단 요인에서 제외 · 기술 부채로 R3b 에서 조사
```

### 12.11 V8 커밋 전 재빌드·확인과 커밋 묶음 (2026-10-16)

```
재빌드     빌드 17 = BUILD_ID XTgPta3IYrcUjXah70Kaq (12:47) · 오류·경고 0 · 85/85 정적 생성 · ƒ 는 [...rest] 캐치올·/api/arrivals 뿐 · 3123 교체(PID 56202 · 옛 빌드 16 PID 54482 종료)
확인       /ko/about · /en/about · /ko · /en 서버 HTML: 200 · x-nextjs-prerender 1 · s-maxage · 옛 BUILD_ID 참조 0
          소개 「누가 만드나」 둘째 단락 = "다파라코프가 서울시 공공데이터와 공식 공지를 바탕으로 직접 검증·가공해 운영하며, 오류 제보를 확인해 수정합니다" / EN "Dapala Corp runs the site by checking and processing Seoul public data and official notices directly, and corrects errors reported by readers" ✅
          푸터 소개 줄 = "다파라코프가 서울시 공공데이터와 공식 공지를 직접 검증해 만드는 서울 심야 이동 안내입니다" / EN "built by Dapala Corp from Seoul public data and official notices, checked by hand" ✅ · 저작권 "© 2026 다파라코프 · Seoul Autonomous" / "© 2026 Dapala Corp · Seoul Autonomous" ✅ · 옛 "(사업자명)" 0
          캡처 ~/Desktop/seoul-shots/2026-10-16-v2-shell/49~52(소개 ko/en 데스크톱·모바일 전체) · 53~56(푸터 ko/en) · 콘솔 오류 0 · overflow 0
컷오버일   재탄생 업데이트 글 date = 2026-10-16 (web/data/updates/site-rebirth-night-bus-first.ts) — 배포가 다른 날로 밀리면 날짜 수정 + 재빌드 1회
커밋 묶음   ① 코드 1건 = git status 의 web/ 아래 전부(추적 수정·삭제 142 + 신규 50 · 다른 경로 0) ② docs 1건 = SESSION-HANDOFF.md · strategy/STOP-URL-POLICY-20260826.md(개정 예고) · 이 문서 · 신규 6(GPT-BRIEF-20261016 · GPT-REVIEW-20261016 · R3A-PREDEPLOY-AGENT-AUDITS-20261016 · R3A-V2-SHELL-CODEX-REVIEW-20261015 · R3A-V4-REFRAME-CODEX-REVIEW-20261016 · R3A-V5V6-CODEX-REVIEW-20261016)
stage 제외  .playwright-mcp/ · route/ · round19-final-이식지시서.md · docs/handoff/HANDOFF-20260608·0729·0802·0828·0828_2 · docs/worklogs/REALTIME-TRANSIT-API-PRECHECK-20260828 · ROUND-26B-FINAL-INSTRUCTION-20260729 · ROUND-26C2E-FINAL-INSTRUCTION-20260802 (이 라운드 산출물 아님 · 미추적 보존)
404 셸 파일  app/[locale]/not-found.* · app/[locale]/[...rest]/page.tsx · app/not-found.tsx 는 빌드 16·17 전수 회귀에 포함된 상태 그대로 커밋(서버 HTML 셸 미해결은 §12.9 ⛔ · R3b 기술 부채)
커밋 실행   포그린 "너 추천대로 진행" 승인 → 코드 `73b0fa0`(2026-10-16 · 192 파일 = 신규 50 · 수정 90 · 삭제 52 · +4,210 −5,843) · docs = 직후 docs-only 커밋(9 파일) · 푸시·배포는 각각 승인 대기
```

### 12.12 V8 배포 기록 (2026-10-16 · 포그린 "추천대로 가자")

```
푸시       1cc6d9e..43b14de → origin/main (local == origin · 0/0)
Phase 0    서버 실행 b10c7d3(d55dbf7d9afd) · checkout b10c7d3 · 작업 트리 = untracked Dockerfile 1건만 · Dockerfile SHA pin 01429bd8… 일치 · 디스크 여유 37G · secret 700/600 · Caddyfile(컨테이너 안) 7719a106f154… · 타 컨테이너 19개 재시작 0
rollback   rollback-b10c7d3 = d55dbf7d9afd (MATCH=PASS) · latest 미이동
build      checkout 73b0fa08757b… · --label revision=73b0fa08757b… -t seoul-autonomous-web:73b0fa0 → sha256:51f33d1f9c77… · 85/85 정적 생성 · 이미지 env 에 secret 0 · Dockerfile pin 3회 일치(Phase 0 · checkout 후 · build 후)
candidate  외부 트래픽 0 · 컨테이너 안 qa-links: 79 페이지 200 · 내부 href 81 · 깨진 0 · 리다이렉트 0 · canonical 0 · robots/ads/sitemap 200 · 404 정상 / 옛 라이브 69 URL 전부 200 / /api/arrivals 01009 · 22011(강남역 허브) 200(운행종료 = 주간 정상) · 99999 404 / 비밀 노출 0 / 소개 운영 주체 문구 / 서울시 API 호출 2회(budget 2/300) / 운영 컨테이너 무접촉
cutover    14:39:55 KST · HEALTH=PASS · 중단 1.94초(Caddy 경유 probe 4회 · 실패 시 자동 원복 스크립트) · backup = seoul_autonomous_web_backup_b10c7d3_20261016-143955 · revision 73b0fa0 · restart unless-stopped · candidate 제거
사후       Caddyfile 해시 불변 · 타 컨테이너 19개 재시작 0 · 같은 Caddy 의 다른 도메인 응답 정상 (opinet-proxy.fazr.co.kr 루트 404 = 정상 — API 전용 프록시라 /api/xxx.do 경로만 응답 · 포그린이 fuel.fazr 운영 쪽 확인 전달 10-16)
라이브 QA  qa-links https://seoulautonomous.com: 79 페이지 200 · 내부 href 81 · 깨진 0 · 리다이렉트 0 · canonical 0 / 옛 69 URL 전부 200 / / → 307 (ko 브라우저 /ko · 헤더 없음 /en) / /api/arrivals/01009 200 · 99999 404 / 정적 프리렌더 · s-maxage / 비밀 노출 0 / ads.txt pub-7976139023602789
캡처       ~/Desktop/seoul-shots/2026-10-16-v2-shell/57~66 (홈 ko·en · 소개 · 강남역 허브 · 노선도 × 데스크톱·모바일) · GA4·AdSense 요청 차단 상태로 촬영(관측 데이터 오염 방지) · 콘솔 오류 0 · overflow 0
남음       latest 이동 = 포그린 라이브 승인 후 · 이 기록 docs 커밋 = 승인 후 · 관측 T0 = 2026-10-16 14:39:55 KST
```

### 12.13 V8 후속 — iPhone 실기기 피드백 5건 수정 (2026-10-16 · 빌드 18~20 · 코드 커밋 `0061274` · 포그린 "추천대로 · 배포해서 확인하자" 승인)

```
입력    포그린 iPhone(Safari) 라이브 확인: ① 헤더 이상 ② 네이버지도에서 정류장 안 나옴 ③ 제목 줄바꿈 이상 + 홈 첫 화면 카드 잘림(캡처) ④ 허브 지도가 두 손가락으로만 움직임(bakwijaguk.com 처럼 한 손가락으로)
재현    Playwright WebKit(webkit-2191 · iPhone 15 393px)로 라이브 재현 — 캡처 67~69
1 헤더   메뉴 버튼이 브랜드 옆 → 원인: 모바일에서 .nav 를 숨겨도 ".nav + .actions { margin-left: 0 }" 이 남음 (크롬 캡처 58 에도 같은 모습 — 육안 검토 누락) → 모바일 쿼리에 margin-left:auto · 메뉴 오른쪽 끝 241 → 377px
2 홈 카드 iPhone 에서만 오른쪽 잘림 → 원인: WebKit 은 <input> 기본 폭(≈344px)을 최소 폭으로 계산 → 출발 줄 416 → 카드 462 → 히어로 1fr 트랙 확장 (Chromium 은 input 을 작게 계산해 자동 QA 미검출) → .input · .search input = flex:1 1 0 · width:0 · min-width:0 / heroWrap · stageWrap · footTop = minmax(0,1fr) / heroLeft min-width:0 / 예시 버튼 white-space:normal / 상태 줄 wrap → 카드 462 → 361px
3 줄바꿈  제목·본문 글자 단위("노/선과") → styles/v2/base.css :lang(ko) { word-break: keep-all; overflow-wrap: anywhere } → "서울 심야버스 / 노선과 환승 노선도"
4 네이버  정류소 공식명 이름 검색 = 지하철역·출구가 먼저 나와 정류장 미검출 → 정류소 번호(ARS) 단독 검색 (네이버 "정류장번호 검색결과" 서울 정류장 첫 줄 4/4: 22011·01009·01020·13156 · 번호+이름 조합은 결과 0) · 노선도 역 카드 · N노선 정류장 · 허브 승강장 · 정류장 페이지 4곳 / 노선도 허브 목록(장소)은 이름 검색 유지 / 카카오맵 무변경
5 지도    허브 실제 지도 cooperativeGestures 제거 → 한 손가락 이동 · 두 손가락 확대 · 데스크톱 휠 확대 (MapLibre 기본) · CDP 터치 드래그 대조: 라이브 마커 이동 0 + "두 손가락" 안내 / 빌드 20 −121px
부수    app/not-found.tsx <a> 3개 → next/link (eslint 21 오류) — §12.9 의 "eslint 오류 0" 은 404 셸 파일 추가 전 수치였다(정정)
검증    tsc 0 · eslint 0 · 85/85 SSG · WebKit iPhone 15 전수 79 URL: 넘침 0 · 메뉴 위치 0 · keep-all 0 · 오류 0 (빌드 19) · Chromium qa-v2-all 158 중 bad 2 = /ko/stops/01009 로컬 API 키(기존 예외) · qa-links 79 페이지 · 81 링크 전부 200 · 허브 3 재확인(빌드 20) 오류 0 · 넘침 0 · 경고 1 = OpenFreeMap 스타일 "wood-pattern" 이미지 누락(외부 · 기존)
캡처    ~/Desktop/seoul-shots/2026-10-16-v2-shell/67~69 라이브 재현 · 70~74 수정 후(WebKit iPhone 15) · 75~80 허브 3(크롬)
코드    13 파일 — Shell.module.css · home.module.css · transit.module.css · StatusLine.module.css · styles/v2/base.css · lib/v2/map-links.ts · v2/ui/MapLinks.tsx · NightBusMap.tsx · RouteExplorer.tsx · hubs/[slug]/page.tsx · stops/[slug]/page.tsx · HubMap.tsx · app/not-found.tsx
교훈    자동 QA 에 WebKit(iPhone) 전수 측정을 상시 포함한다 — Chromium 만으로는 iPhone 결함(입력창 폭)을 놓친다
```

### 12.14 V8.1 재배포 기록 (2026-10-16 15:37 KST · 코드 0061274 · docs bfb37bb · 포그린 "추천대로 · 배포해서 확인하자")

```
푸시       43b14de..bfb37bb (코드 0061274 + docs bfb37bb · local == origin)
Phase 0    운영 73b0fa0(51f33d1f9c77) · 작업 트리 untracked Dockerfile 1건만 · Dockerfile pin 일치 · Caddyfile 7719a106f154… · 디스크 여유 36G · 타 컨테이너 재시작 0 · 다른 도메인 응답 배포 전 기록(/root/domains-before-0061274.txt · 404 = opinet-proxy 루트뿐 = 정상)
rollback   rollback-73b0fa0 = 51f33d1f9c77 (MATCH=PASS) · latest 여전히 d55dbf7d9afd(b10c7d3)
build      0061274… → sha256:a7875f34c6a1… · 85/85 · 에러 0 · secret 0 · Dockerfile pin 3회 일치
candidate  qa-links 79 페이지 · 81 링크 정상 · 옛 79 URL 전부 200 · /api/arrivals 01009·22011 200 · 99999 404 · 비밀 노출 0 · 네이버 번호 링크 있음 · "두 손가락" 안내 없음 · 운영 무접촉
cutover    15:37:26 · HEALTH=PASS · 중단 1.54초 · backup = seoul_autonomous_web_backup_73b0fa0_20261016-153726 · candidate 제거
사후       Caddyfile 불변 · 타 컨테이너 재시작 0 · 다른 도메인 응답 배포 전 == 후
라이브 QA  qa-links 79·81 정상 · 허브 지도 CDP 한 손가락 드래그 마커 −121px · WebKit iPhone 15 전수 79 URL 문제 0 · 캡처 81~83 (홈 · 노선도 · 홍대입구 허브 · 메뉴 오른쪽 끝 · 오류 0)
남음       포그린 실기기 확인 → 라이브 승인 → latest 이동 / 지도 위 스와이프 시 페이지 스크롤 = bakwijaguk.com 방식 조사 후 다음 배포 / 이 기록 docs 커밋 = 승인 후
```

### 12.15 허브 지도를 bakwijaguk.com 방식에 맞춤 (2026-10-16 · 빌드 21 · 코드 `e8aa58e` 에 포함)

```
입력     포그린: "바퀴자국(bakwijaguk.com)은 한 손가락 이동과 스크롤이 다 정상 — 그것처럼"
조사     bakwijaguk.com/routes/hangang (읽기 전용 · CDP 터치): MapLibre · cooperativeGestures 꺼짐 · 지도 위 한 손가락 세로·가로 스와이프 모두 지도가 받고 페이지 스크롤 0 = 우리 V8.1 과 같은 동작 / 차이 2 = 지도 박스 높이 고정(h-[420px] sm:h-[500px] lg:h-[600px]) · 전체화면 버튼(MapLibre FullscreenControl) / 지도 전용 커스텀 터치 처리 코드는 번들에서 발견되지 않음
반영     HubMap.module.css 높이 420 / 500(≥640) / 600(≥1024) — 로더 자리 표시도 같은 클래스라 동일 · HubMap.tsx FullscreenControl 추가 + 한국어 라벨("전체화면으로 보기" / "전체화면 끝내기")
검증     WebKit iPhone 15: 지도 420px · Fullscreen API 를 지운 상태(= iPhone Safari)에서 버튼 → MapLibre 화면 덮기(pseudo fullscreen) 393×659 · 끝내기 → 420 복귀 · 오류 0 / Chromium 768px 500 · 1440px 600 / 한 손가락 드래그 마커 −121px 유지
캡처     84 전체화면 · 85 일반 (iPhone 15)
계약     Round 27 "Fullscreen API 금지 · CSS 오버레이 유지" 는 /ko/night-bus-map 자체 노선도 전용 — 허브 실제 지도의 MapLibre 표준 컨트롤은 대상 아님(iPhone 에서는 API 없이 화면 덮기로 동작)
```

### 12.16 iPhone 실기기 피드백 2차 — 카카오맵 웹 경유·빈 창 · 자동 밑줄 (2026-10-16 · 빌드 22 · 코드 `e8aa58e` · 포그린 "해" 승인)

```
입력     포그린(iPhone · Chrome): ① 카카오맵을 누르면 웹(m.map.kakao.com)을 거치고 새 빈 창이 하나 뜸(노선도 허브 목록 "종로2가·종각") ② "신내동 방면 · 구산동 방면 · 14016" 점선 밑줄을 누르면 구글 지도로 감
원인 ①  카카오맵 앱의 유니버설 링크 목록(m.map.kakao.com/.well-known/apple-app-site-association)이 "NOT /link/*" 로 /link/ 경로를 일부러 제외 → 우리 /link/map 링크는 앱이 있어도 웹 · target=_blank 라 Chrome 에 빈 탭이 남음
원인 ②  iOS 데이터 자동 인식(주소·전화번호) — 우리가 만든 링크가 아님
반영 ①  터치 기기(hover:none + pointer:coarse = 폰·태블릿): 카카오 = https://m.map.kakao.com/actions/searchView?q={정류소 번호} (목록에 있는 경로 · 앱 있으면 앱, 없으면 모바일 웹 검색 · 웹에서도 22011·01009 해당 서울 정류장이 첫 줄) · 네이버 = 번호 검색 · 둘 다 같은 탭(빈 창 없음) / 마우스 기기: 기존 그대로(카카오 좌표 핀 /link/map · 네이버 번호 검색 · 새 탭) / 분기 = styles/v2/base.css .v2-touch-only · .v2-pointer-only (JS 없음) / 허브 목록의 합친 이름은 앞부분으로 검색("종로2가·종각" → 종로2가) / 적용 4곳 = MapLinks(허브 승강장·정류장 페이지·노선도 허브 목록) · 노선도 역 카드 · N노선 정류장
반영 ②  app/[locale]/layout.tsx metadata formatDetection { telephone: false, address: false, email: false } → <meta name="format-detection" content="telephone=no, address=no, email=no">
보류     네이버 앱 직접 열기 — 네이버 지도 유니버설 링크는 /launchApp/* 뿐이고 형식이 공식 문서로 확인되지 않음(nmap:// 스킴은 앱이 없을 때 폴백 문제) → 웹 번호 검색 유지
검증     보이는 링크: iPhone 15 WebKit · Android 크롬 에뮬 = 앱 링크 · 같은 탭 / 데스크톱 = 웹 · 새 탭 · WebKit iPhone 전수 79 URL 문제 0 · tsc 0 · eslint 0 · 85/85
코드     빌드 21(§12.15) + 22 합계 8 파일 — HubMap.tsx · HubMap.module.css · lib/v2/map-links.ts · v2/ui/MapLinks.tsx · NightBusMap.tsx · RouteExplorer.tsx · styles/v2/base.css · app/[locale]/layout.tsx
```

### 12.17 V8.2 재배포 기록 (2026-10-16 16:16 KST · 코드 e8aa58e · docs 5dfc486 · 포그린 "해")

```
푸시       bfb37bb..5dfc486 (local == origin)
Phase 0    운영 0061274(a7875f34c6a1) · 작업 트리 untracked Dockerfile 1건만 · Dockerfile pin 일치 · Caddyfile 7719a106f154… · 디스크 여유 35G · 타 컨테이너 재시작 0 · 다른 도메인 404 = opinet-proxy 루트뿐(정상)
rollback   rollback-0061274 = a7875f34c6a1 (MATCH=PASS) · latest 여전히 d55dbf7d9afd(b10c7d3)
build      e8aa58e… → sha256:d90945140ec5… · 85/85 · secret 0 · Dockerfile pin 3회 일치
candidate  qa-links 79·81 정상 · 옛 79 URL 전부 200 · /api/arrivals 01009·22011 200 · 99999 404 · 비밀 노출 0 · 카카오 앱 링크 · 네이버 번호 링크 · format-detection 있음 · 운영 무접촉
cutover    16:16:37 · HEALTH=PASS · 중단 1.67초 · backup = seoul_autonomous_web_backup_0061274_20261016-161637 · candidate 제거
사후       Caddyfile 불변 · 타 컨테이너 재시작 0 · 다른 도메인 배포 전 == 후
라이브 QA  qa-links 79·81 정상 · format-detection telephone=no, address=no, email=no · 보이는 지도 링크 iPhone 15 WebKit·Android = 카카오 m.map.kakao.com/actions/searchView?q={번호} 같은 탭 / 데스크톱 = /link/map 핀 새 탭 · 허브 지도 420px · 전체화면(iPhone 방식 화면 덮기) 393×659 → 끝내기 420 복귀 · 한 손가락 드래그 −121px · WebKit iPhone 전수 79 URL 문제 0
남음       포그린 실기기 확인 → 라이브 승인 → latest 이동 · 이 기록 docs 커밋(승인 후)
```

## CC 이견 및 아이디어

1 GPT 의 브랜드명 교체 제안에는 반대 — 도메인 변경 없이 이름만 바꾸면 검색 결과에 두 이름이 섞여 신뢰가 떨어진다. 태그라인으로 해결.
2 GPT 의 "허브 페이지 = 지리 지도 기본" 은 수용 — 허브는 "길 어느 쪽에서 타나" 가 핵심이라 실좌표가 맞다.
3 리스크: 디자인 시스템 v2 를 전역 토큰으로 적용하면 기존 25개 페이지가 한꺼번에 바뀐다. 배포 전 스크린샷 회귀(기존 11장 vs 신규)를 I1 에 포함.
4 아이디어: 노선 페이지의 "오늘 밤 운행 상태" 줄은 정적 빌드에서도 클라이언트 시각으로만 계산하므로 서버 비용 0.
