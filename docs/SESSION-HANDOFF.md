# Session Handoff

> 마지막 업데이트: 2026-07-12 3차 (Round 25-E 홈 허브 + /en/night-bus-map 영문 가이드 배포 완료)
> 다음 세션은 **이 파일을 가장 먼저** 읽고 시작한다.

## 현재 위치

**AdSense가 2026-07-10 "가치가 별로 없는 콘텐츠"로 거절됨 (ads.txt 승인·소유권 확인은 정상, 특정 URL 지목 없음). 대응 체인: Round 25-A audit(채팅) → 25-C(사실 오류·표시 결함 정정) → 25-D(22페이지 노선별 안내 섹션) → 25-E(홈 가치 섹션 + /en/night-bus-map 영문 가이드 공개) 모두 배포 완료. 재신청 안 함. 다음 작업은 Round 25-F(한국어 실용 가이드 2개) 설계.**

## 마지막 커밋 (로컬 HEAD · origin/main · 서버 라이브 HEAD 모두 동일)

`5fd776f` — Round 25-E: add English night bus guide and home hub

## 커밋 이력

```
5fd776f  Round 25-E: 영문 심야버스 가이드 + 홈 허브 (배포됨, 2026-07-12)
3b26a4e  docs: record Round 25-D deployment and next steps (문서 전용)
c1781a1  Round 25-D: 노선 상세 22페이지 노선별 안내 섹션 (배포됨, 2026-07-12)
f27a08b  docs: record Round 25-C deployment and next steps (문서 전용)
6d11a47  Round 25-C: 요금·기종점 정정 + 03:30 표시 + 개수 분리 (배포됨, 2026-07-12)
86af374  Round 24-B: ads.txt + AdSense 연결 스크립트 (배포됨, 2026-06-30)
```

## 배포 상태 (라이브)

- seoulautonomous.com 라이브 (Docker + Caddy), 서버 HEAD `5fd776f`
- 라이브 이미지 **`a8f2cc4e6ae9`** (2026-07-12 R25-E 배포) / 직전 이미지 `49782f5a17ec`(R25-D)
- 롤백 태그: **`rollback-c1781a1`**(=`49782f5a17ec`, 직전) · `rollback-6d11a47`(=`c59830a89ecb`) · `rollback-86af374` · `rollback-be8d412` · `rollback-c5b8abc` · `rollback-0a27b2c` 전부 보존. 문서 전용 커밋은 롤백 태그를 만들지 않음
- **R25-E 라이브**: ① `/en/night-bus-map` 신규 공개 — 영문 텍스트 가이드 (14노선·140대·23:00–06:00·KRW 2,500·ko 지도 CTA), self-canonical·hreflang 없음·sitemap 독립 엔트리, 콘텐츠는 `web/data/night-bus-guide/` TS 모듈 ② ko/en 홈에 가치 섹션(FeaturedRoutes 다음, 3링크 카드) ③ en mapPromo → `/en/night-bus-map`, ko mapPromo 문구·기능 무변경(i18n 이동만) ④ 정적 생성 58/58
- **R25-D 라이브**: 노선 상세 22페이지(11 노선 × ko/en)에 "노선 안내"/"About this route" H2 + 노선별 overview·useCase 산문 (disclaimer 다음, 정류장 카드 앞, SSR 초기 HTML 노출). 콘텐츠는 `web/data/route-context/`의 타입 안전 모듈(`VerifiedRouteId` 11개 exact union + `RouteContextMap`), 동적 팩트(시간·배차·요금 등)는 중복 저장하지 않고 기존 정보 카드·FAQ가 담당. **verificationNote는 포그린 화면 확인 후 전면 삭제** (신뢰도 저하 인상 + FAQ와 중복 + 존재하지 않는 데이터 카드 설명이라 부정확)
- **R25-C 라이브 유지**: `/ko/night-bus-map` 요금 "카드 기준 2,500원(서울시 2026-03-20 기준)" · N15/N31/N61/N72/N75 "공식 기·종점" 정정 · 새벽 4노선 "03:30" 단일 표시 + 단일 출발 FAQ · 홈/routes "자율주행 버스 11개 노선 · 로보택시 1개 서비스" 분리 표기
- R24-B 유지: /ads.txt 200(1줄), ko/en `<head>` AdSense 연결 스크립트 1회, 광고 슬롯 0
- R24-A 유지: privacy §10 광고 · terms · design-preview 하드 404
- Round 22 유지: 지도 title/H1/meta/JSON-LD 무변경, `/en/night-bus-map` 404, sitemap ko 1건
- 기존 사이트 무손상: newsforgreens.com 200, fazr.co.kr 200 / **배포는 Caddy 완전 미접촉**(컨테이너 교체만)

## AdSense 상태 (2026-07-10 심사 결과)

- **거절: "광고 게재가 준비되지 않은 사이트" / 사유: 가치가 별로 없는 콘텐츠**
- ads.txt 승인됨 · 사이트 소유권 확인됨 · 특정 URL 지목 없음
- **재신청 안 함** — 25-D 이후 콘텐츠 보강 완료 + 색인 확인 후 재신청 판단
- 25-A audit 결론: 주원인은 산문형 고유 콘텐츠 부족(실질 콘텐츠 페이지 4/45) + 노선 상세 22페이지 템플릿 패턴. 기술 연결(ads.txt·스크립트·소유권)은 문제 아님
- 미승인 상태의 외부 광고 요청 403(googleads.g.doubleclick.net)은 앱 오류 아님 — 승인 전까지 정상

## 다음 세션 할 것 — Round 25-F

1. **Round 25-F** (GPT 지시서 대기, 단독 착수 금지): 한국어 실용 가이드 2개
   - ① 요금·결제·환승 안내 ② 막차 이후 이동 시나리오
   - 공식 확인된 사실만 사용 (미확인: 현금/청소년 요금, 환승 할인 규칙 — 공식 재확인 필요)
2. **Round 25-G**: 최종 라이브 audit → 색인 상태 확인 → 통과 후 포그린이 AdSense 수동 재신청
4. 참고 데이터: 25-A audit·공식 노선 기준선(서울시 2026-03-20, 14개 노선·기종점·카드 2,500원)은 2026-07-12 세션 채팅에 있음. 공식 출처: news.seoul.go.kr/traffic/archives/27974

## 협업 절차 (2026-07-12 현재)

1. GPT가 지시서 초안 작성
2. CoWork가 기술 이견과 쉬운 설명 제공
3. GPT가 이견을 검토해 최종본 확정
4. 이견이 없으면 GPT 초안을 그대로 Claude Code에 전달
5. Claude Code는 **편집 전 실제 코드와 지시를 대조** (이견 있으면 보고 후 중단)
6. 커밋·푸시·배포는 **각각 별도 승인**
- 데이터 문구 지시는 "완성 문장 재작성" 대신 **저장소 원문 진본 + 공식값 + 최소 변환 규칙** 방식 (2026-07-12 확립)

## 핵심 경고 / 운영 주의

- **서버에 추적 밖 `Dockerfile`(untracked) 존재** — 수동 Docker 빌드가 의존. `git pull --ff-only`만 사용. 저장소엔 미커밋
- **롤백**: 배포는 `:latest`를 덮음 → 배포 전 현재 이미지를 `rollback-<해시>` 태그로 박제. 현재 직전 = `rollback-c1781a1`. 라이브 배포된 적 없는 문서 전용 커밋은 롤백 태그를 만들지 않음
- **Caddy 절대 미변경** (validate→reload만, restart 금지)
- **night-bus-data.ts 읽기 전용 / SVG 기하 보정 금지 / routes.json 노선 추가·삭제 금지(필드 추가는 지시서로만)**
- **alternateLinks: false 유지** (true 복귀 시 GSC 404 부활)
- **묶음 배포 금지** — 라운드 단독 배포·검증 후 다음
- `.claude/`는 저장소 .gitignore 대상이 아닙니다. 실행 환경의 전역·로컬 excludes 설정에 따라 git status --short에 ?? .claude/로 표시되거나 표시되지 않을 수 있습니다. untracked 항목 수를 고정값으로 판정하지 말고, 작업 시작 시점의 실제 git status --short 결과를 진본으로 삼아 기존 항목을 모두 보존합니다. 건드리지 않는 미추적: `docs/handoff/HANDOFF-20260608.md`, `round19-final-이식지시서.md`, `route/`
- `.git/index.lock` 스테일 락은 실행 중 git 프로세스 없음 + 0바이트 + 시간 경과 확인 후에만 제거
- 노선 데이터 의문점(N15 남태령역, N61 개봉역)은 공식 정류장 자료 미확보 — **추정 수정 금지**, 확인 후 별도 라운드
- 보류(정직성): 운영자 실명·법적주체, 국외이전 정식 고지 → 별도 법률 점검 라운드

## 새 세션 시작 시

1. [ ] 이 문서(`docs/SESSION-HANDOFF.md`) 읽기
2. [ ] 최신 날짜별 핸드오프 `docs/handoff/HANDOFF-20260712_3.md` 읽기
3. [ ] MEMORY.md 확인
4. [ ] 라이브 확인: https://seoulautonomous.com/en/night-bus-map (영문 가이드), /ko ("이 사이트에서 확인할 수 있는 것" 섹션), /ko/night-bus-map (요금 2,500원), /ads.txt
5. [ ] Round 25-F GPT 지시서 유무 확인 — 없으면 대기, 단독 착수 금지

## 핸드오프 운영 규칙

- `docs/handoff/HANDOFF-YYYYMMDD.md` — 날짜별 이력 누적(삭제·통합·개명 금지). 같은 날 2회차는 `_2` 신규
- `docs/SESSION-HANDOFF.md` — 항상 최신 갱신, 다음 세션 시작점
- docs 변경은 서버 배포 불필요, docs-only 단독 커밋

## 서버 정보

- Vultr 158.247.252.172, Docker 수동 docker run(compose 아님), 컨테이너 `seoul_autonomous_web`
- 실행 조건: `--network apps-newsforgreens_default --restart unless-stopped --hostname 0.0.0.0 -e NODE_ENV=production`
- Caddy 6개 도메인 블록 — docker restart 금지
