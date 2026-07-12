# Session Handoff

> 마지막 업데이트: 2026-07-12 5차 (Round 25-G.2 404 실험 BLOCK·보류·정리)
> 다음 세션은 **이 파일을 가장 먼저** 읽고 시작한다.

## 현재 위치

**AdSense 2026-07-10 거절("가치가 별로 없는 콘텐츠") 대응 체인 완료: 25-A audit → 25-C(사실 정정) → 25-D(22페이지 노선 안내) → 25-E(홈 허브+영문 가이드) → 25-F(한국어 실용 가이드 2개) → 25-F.1(상단 간격 9 URL) → 25-F.2(ko 푸터 노출) 전부 배포됨. 25-G 최종 오디트: 코드·콘텐츠 블로커 0. 25-G.2(브랜드형 404) 시도했으나 standalone 프로덕션에서 커스텀 404 미동작으로 BLOCK → 비차단 기술부채로 보류(실험 코드 전부 폐기, 라이브 무변화). 남은 것은 코드 아니라 포그린 수동: 색인 요청 → 확인 → AdSense 재신청. 재신청 아직 안 함.**

## 마지막 커밋

- local = origin: `c5bb5e5` (docs — Round 25-F 마감 문서. 이 위에 5차 핸드오프 docs 커밋 추가 예정)
- server 코드 HEAD = live: `ef0274a` (Round 25-F.2, F.1과 묶음 배포) / live image `6d878d66110e`
- **25-G.2 404 실험은 아무것도 커밋 안 함 — 좌표 무변화**

## 커밋 이력

```
ef0274a  Round 25-F.2: ko 푸터 실용 가이드 링크 2개 (배포됨, 2026-07-12)
b84cc10  Round 25-F.1: PageTopBar 상단 간격 9 URL (F.2와 묶음 배포)
1e4b013  Round 25-F: 한국어 실용 가이드 2페이지 (배포됨, 2026-07-12)
7c9a3e9  docs: record Round 25-E deployment and next steps (문서 전용)
5fd776f  Round 25-E: 영문 심야버스 가이드 + 홈 허브 (배포됨, 2026-07-12)
c1781a1  Round 25-D: 노선 상세 22페이지 노선별 안내 섹션 (배포됨, 2026-07-12)
6d11a47  Round 25-C: 요금·기종점 정정 + 03:30 표시 + 개수 분리 (배포됨, 2026-07-12)
```

## 배포 상태 (라이브)

- seoulautonomous.com 라이브, 서버 HEAD **`ef0274a`**, 라이브 이미지 **`6d878d66110e`**
- 롤백 태그: **`rollback-1e4b013`**(=`3e1e34ac1b63`, 직전) · `rollback-5fd776f` · `rollback-c1781a1` · `rollback-6d11a47` · `rollback-86af374` · `rollback-be8d412` · `rollback-c5b8abc` · `rollback-0a27b2c` 전부 보존
- **R25-F 라이브**: `/ko/night-bus-fare`(요금·결제·환승, 공식 요금표 카드/현금 3구분) + `/ko/after-last-train`(막차 이후 시나리오) — ko 전용·en 404·self-canonical·hreflang 0·sitemap 등록. 콘텐츠 `web/data/night-bus-guides/`. 공식 기준: 서울시 1706(2026-03-09)·transfer_discount(2026-02-02)·27974(2026-03-20)
- **R25-F.1 라이브**: `PageTopBar` 공통 컴포넌트로 9 URL(routes ko/en·그룹 4·updates ko/en·en 가이드) 상단 간격 8/24/0px → 76~84px 정규화
- **R25-F.2 라이브**: ko 푸터에 「심야버스 요금·환승」「막차 이후 이동」(업데이트 뒤) — en 푸터 무변경
- **R25-E 유지**: `/en/night-bus-map` 영문 가이드·홈 가치 섹션·en mapPromo / 정적 생성 60/60
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

## 다음 할 것 — 포그린 수동 작업 (코드 작업 없음)

1. GSC + 네이버 서치어드바이저에서 신규 URL 수집/색인 요청: `/ko/night-bus-fare` · `/ko/after-last-train` · `/en/night-bus-map`
2. 색인 현황 확인 (Google은 홈·routes·faq·about·privacy·**ko/night-bus-map** 색인 확인됨 — 2026-07-12 site: 검색 실측. 네이버는 계정 확인 필요)
3. 색인 반영 확인 후 **AdSense 수동 재신청 (포그린 직접)** — 아직 미실행
4. 보류 항목(코드, 전부 비차단):
   - **기본 404 UI** — 25-G.2에서 시도했으나 `output: 'standalone'`에서 커스텀 not-found 미동작으로 BLOCK. **영구 백업: `/Users/dapala.corp/seoul-autonomous-backups/20260712-round25g2-404/`** (`~/seoul-autonomous-backups/20260712-round25g2-404/`, tar SHA-256 `5ac27d27…f2340`, README·SHA256SUMS 포함). `/tmp` 사본은 임시. root layout·배포 구조 변경 없이는 미해결. 상세: `HANDOFF-20260712_5.md`
   - ko/en 홈 title 동일("Seoul Autonomous"), /ko/updates title suffix, 홈 가치 섹션에 가이드 링크 추가 여부(IA A안)

## ⚠ 이번 세션 실수·교훈 (다음 세션 반복 금지)

1. **20분 무보고 디버깅** → 디버깅 5분 넘으면 중간 보고(확인 중/사실/미해결/다음 실험/예상시간), 10분 무설명 금지, BLOCK 도달 즉시 멈춤
2. **좀비 서버 오염** → 검증 전 포트 PID·실행명령 확인 → kill → 새 빌드 PID 재확인. `lsof -ti :4099 | xargs kill -9` 후 listen 0
3. **next start ≠ 프로덕션** → 이 프로젝트는 `output: 'standalone'`. 최종 판정은 `node .next/standalone/server.js`로 (static·public 복사 필요). `next start`는 경고 내고 경계 동작이 다름
4. **성급한 "프레임워크 버그" 단정 금지** → 오염 신호로 결론 내지 말 것. 재현 조건만 사실로 기록
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
2. [ ] 최신 날짜별 핸드오프 `docs/handoff/HANDOFF-20260712_5.md` 읽기 (그 전 4·3·2차도 필요시)
3. [ ] MEMORY.md 확인
4. [ ] 라이브 확인: https://seoulautonomous.com/ko/night-bus-fare (요금표), /ko/after-last-train, /ko 푸터(가이드 링크 2), /en (한국어 링크 없어야 정상)
5. [ ] AdSense 재신청 여부·색인 요청 진행 상황을 포그린에게 확인 — 재신청 전이면 대기
6. [ ] 404 재개 시: 영구 백업 `~/seoul-autonomous-backups/20260712-round25g2-404/`(진본, README 참조) 사용. standalone 서빙 문제부터. 로컬 검증은 반드시 `node .next/standalone/server.js`

## 핸드오프 운영 규칙

- `docs/handoff/HANDOFF-YYYYMMDD.md` — 날짜별 이력 누적(삭제·통합·개명 금지). 같은 날 2회차는 `_2` 신규
- `docs/SESSION-HANDOFF.md` — 항상 최신 갱신, 다음 세션 시작점
- docs 변경은 서버 배포 불필요, docs-only 단독 커밋

## 서버 정보

- Vultr 158.247.252.172, Docker 수동 docker run(compose 아님), 컨테이너 `seoul_autonomous_web`
- 실행 조건: `--network apps-newsforgreens_default --restart unless-stopped --hostname 0.0.0.0 -e NODE_ENV=production`
- Caddy 6개 도메인 블록 — docker restart 금지
