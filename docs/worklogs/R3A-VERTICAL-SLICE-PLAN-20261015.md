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
[ ] B1 토큰 v2 + globals.css                              [ ] B2 헤더/푸터/카드 재조판                                   [ ] B3 기존 페이지 회귀 확인
[ ] C1 홈 v2 (상태줄·질문 카드·무대·바로가기)             [ ] C2 탐색 엔진 클라이언트 번들                               [ ] C3 버스 연출 컴포넌트
[ ] D1 노선 페이지 템플릿 + NightSchematic                [ ] D2 노선 5 콘텐츠(경유지·방면·FAQ)                          [ ] D3 sitemap/metadata
[ ] E1 허브 페이지 템플릿(지리 기본)                       [ ] E2 허브 3 콘텐츠                                            [ ] E3 sitemap/metadata
[ ] F1 arrivals 프록시 허브 게이트                         [ ] F2 허브 보드 UI(탭 시 조회·기준 시각)                       [ ] F3 예산·로그 확인
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

## CC 이견 및 아이디어

1 GPT 의 브랜드명 교체 제안에는 반대 — 도메인 변경 없이 이름만 바꾸면 검색 결과에 두 이름이 섞여 신뢰가 떨어진다. 태그라인으로 해결.
2 GPT 의 "허브 페이지 = 지리 지도 기본" 은 수용 — 허브는 "길 어느 쪽에서 타나" 가 핵심이라 실좌표가 맞다.
3 리스크: 디자인 시스템 v2 를 전역 토큰으로 적용하면 기존 25개 페이지가 한꺼번에 바뀐다. 배포 전 스크린샷 회귀(기존 11장 vs 신규)를 I1 에 포함.
4 아이디어: 노선 페이지의 "오늘 밤 운행 상태" 줄은 정적 빌드에서도 클라이언트 시각으로만 계산하므로 서버 비용 0.
