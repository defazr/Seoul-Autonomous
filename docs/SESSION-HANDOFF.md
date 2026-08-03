# Session Handoff

> 마지막 업데이트: 2026-08-03 (Round 27 CLOSED / Production DEPLOY PASS)
> 다음 세션은 **이 파일을 가장 먼저** 읽고 시작한다.

## 현재 위치

**Round 27 CLOSED — Production DEPLOY PASS.** `/ko/night-bus-map` 노선도에 **PC 더블클릭 전체화면 진입**과 **스마트폰 한 손가락 더블탭 전체화면 진입**이 라이브 완료됐다. **기존 "크게 보기" 버튼은 유지**되며, 세 진입 경로가 같은 전체화면을 연다. Round 26(콘텐츠·운영정보)도 그 전에 완료·배포·문서화까지 닫혀 있다.

**Round 27 재구현·재감사·재배포 금지.** 실행 중인 애플리케이션과 Git 좌표가 모두 `abb0ba7`로 일치한다.

```
Round 27 배포 판정      DEPLOY PASS  (2026-08-03)
자동 기술 QA           PASS (라이브 32/32 · sitemap 53/53 · 404 4/4)
iPhone Safari 라이브    포그린 직접 승인
실측 중단              2초
rollback               미실행
Caddy 변경             0
다른 8개 컨테이너       재시작 0
삭제·prune             0
```

## 다음 세션 첫 작업 — **Round 27 docs-only push 여부 판단**

남은 Round 27 작업은 **배포 결과 docs-only push 1건**뿐이며, 그것도 **사용자 별도 승인**이 필요하다. push와 deploy는 계속 분리다. 서버·Docker·Caddy는 더 건드리지 않고, rollback 자산 정리도 별도 승인 전 금지다.

## 좌표

```
local HEAD          abb0ba7                  (docs 커밋이 쌓이면 이보다 새로워질 수 있음)
origin/main         abb0ba7
server checkout     abb0ba7
runtime revision    abb0ba7                  ← OCI label로 직접 증명
live image ID       sha256:23bfedc2ba78fe511b6909dfecfd3663bc0b3e05601ef82aa0f49cd47bfe1ee3
immutable image     seoul-autonomous-web:abb0ba7
latest              동일 image ID (iPhone 라이브 승인 후 이동)
RestartCount        0
previous runtime    ba058ee (이미지 f2674161ee68) ← 역사 기준점
```

**docs-only 커밋이 쌓이면 Git HEAD는 `abb0ba7`보다 새로워진다. 그래도 실행 중인 애플리케이션 코드는 계속 `abb0ba7`다.** 라이브 판정은 컨테이너 라벨로 한다.

```bash
docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' seoul_autonomous_web
```

보존 자산 — **삭제·prune 금지**

```
R27 backup    seoul_autonomous_web_backup_ba058ee_20260803-210527  (exited)
R27 rollback  seoul-autonomous-web:rollback-ba058ee → sha256:f2674161ee68c058cbe6fc8a464fc1778d5cd756ab7cb30ba46cccf816f5162f
R26 backup    seoul_autonomous_web_backup_ef0274a_20260803-183544  (exited)
R26 rollback  seoul-autonomous-web:rollback-ef0274a → sha256:6d878d66110ec6444f27447f04e054d922b45b6b3d63883b204c26d4d26a2406
```

작업 트리 비접촉 대상: 미추적 보존 2건(`round19-final-이식지시서.md`, `route/`) · 기존 미추적 문서 5건 · `.env.local`

## 완료 요약

- **26-B/B.1 (`a5307b3`)**: 무범위 "검증됨" → 확인 범위 명시형 전면 교체 · q4 정보 범위 FAQ · 원시 Unknown/앱 단정 제거 · 홈·About·Data Source 정체성 정합 · 전역 내비 심야버스 링크 · ko 전용 페이지 EN 토글 404 수리
- **26-C1E (`c6d7290`)**: OA-12830 공식 영문 정류소명 SSOT 267건 + 수집기·검증기·오프라인 테스트. **공식 영문 261 / 한국어 fallback 6**. `routes.json` 무변경. 코덱스 감사 5회 하드닝 후 P0·P1 0으로 통과
- **26-C2E + C2E.1 (`b36ed11`, web 6파일 +172 −65)**: 공식 영문 정류장 렌더 연결 완료
  - **표시 계약(고정)**: 영문 = `getOfficialStopNameEn` **단독**, 미스는 `nameKo`로만 대체, `routes.json.nameEn`은 표시 경로에서 **영구 배제**(C2E.1). ko는 `nameKo` 그대로·영문 보조줄 없음
  - **보조줄 C안**: 닫힘 미리보기 3개·5개↓ 인라인만 병기 / 펼친 전체 목록은 영문 단독 / fallback은 한국어 한 줄. `DISCLOSURE_THRESHOLD=5` · `PREVIEW_LIMIT=3` · 서버 컴포넌트 + 네이티브 `<details>` + `<ol>/<li>`
  - **검증**: typecheck·build 0(warning 0) · 53 URL 200 · 한국어 307개 불변 · 영어 307행 기대값 전건 일치 · 닫힘 가시 3/열림 87·중복 0 · 모바일 320/360/390 overflow 0 · 번들 SSOT 유출 0 · hydration 0 · **Codex P0/P1/P2 0**
  - 캡처 정본 9장 `~/Desktop/seoul-shots/4_C2E_최종구현/` — 포그린 승인 완료, **재제작 불필요**
- **26-C1O 공식 조사 완료** (`docs/worklogs/ROUND-26C1O-OFFICIAL-RESEARCH-20260803.md`)
  - **48셀 = 공식확인 7 / 보도참고 3 / 미확인 38** (고정노선 44 + 강남 로보택시 4, 누락 0)
  - 공식확인: A741 fare · A148 fare·operator(㈜에스유엠) · 로보택시 4항목 전부(요금 4,800/5,800/6,700원 시간대별 · 에스더블유엠+카카오모빌리티 · 카카오T 필수 · 사전예약 아닌 앱 호출)
  - **A160 요금은 미확인 확정** — 2026-01 보도(1,200원 조조할인, 행정절차 완료)는 있으나 현재 시행 공식 근거 없음. 1,200원은 조조할인가라 단일 요금 표기 금지
  - **신규 발견**: 유상 전환 예고 시점이 도래한 노선 4개(`dongjak-a01` 상반기 / `cheonggye-a01`·`dongdaemun-a01`·`seodaemun-a01` 하반기) — 공식 문서가 스스로 유효기간 끝을 예고했고 그 시점이 지남. 단순 미확인과 구분 필요
  - 운영사 표기 `㈜SUM`·`㈜에스유엠`·`에스더블유엠`은 **동일시 금지, 원문 보존**
- **26-C2O (`7364d42`, web 13파일 +1121 −102)**: 운영정보 상태 모델
  - **검증등급과 현재성은 다른 축**. `verificationGrade`(official_confirmed/media_reference/unverified) × `currentState`(confirmed/reverification_required/unverified)
  - **불변식**: `official_confirmed` + `confirmed` 조합만 value non-null, 그 외 전부 null
  - 48셀 = 등급 7/3/38, 상태 confirmed 7 / reverification_required 5 / unverified 36
  - `"Unknown"` sentinel은 운영정보 4필드에서만 폐기(`daysOfOperation`·`headway`는 유지)
  - **client DTO 격리**: `RouteListItem`(10필드)·`RobotaxiListItem`으로 좁혀 고정노선 출처가 client payload에 안 나감
  - 로보택시 `verificationLevel` → `official_confirmed`, `sourceUrls` → 서울시 공식 URL 1건 정정
  - 캡처 12장 `~/Desktop/seoul-shots/5_C2O_운영정보/`
- **26-C3 + C3.1·C3.2 (`1682447`, web 7파일 +312 −54)**: 노선별 콘텐츠·FAQ q1 재설계
  - `RouteContext` = `overview` + `routePattern` + `keyStopIds`(3~5) + `useCase`. ko/en `keyStopIds` 완전 동일
  - **FAQ q1은 stop 배열 구조로만 3분기** — 첫·마지막 stopId 동일 2 / 이름만 동일 5 / 서로 다름 4. 노선 id 하드코딩 0
  - 빈 stops·반환점 ≠1이면 즉시 throw (조용한 fallback 금지)
  - 콘텐츠 평가 형용사 전량 제거("짧다·수월·편리·Useful·Handy·easy"). "급행 방식/limited-stop"은 서울시 보도자료 근거로 유지
  - 캡처 26장 `~/Desktop/seoul-shots/6_C3_노선콘텐츠/`
- **배포 전 통합 오디트 PASS** (`docs/worklogs/AUDIT-ROUND26-PREDEPLOY-20260803.md`)
  - `.next` 삭제 후 fresh typecheck·build 0, 신규 warning 0
  - 53 URL 200 · sitemap 53 · 404 매트릭스 유지 · canonical·hreflang 회귀 0
  - 모바일 17페이지 × 320/360/390 = 51조합 overflow 0 · hydration 0 · console 오류 googleads 403 외 0
  - **Codex 통합 감사 P0/P1/P2 전부 clean**, 12개 통합 항목 clean
  - hreflang 없는 5페이지는 ko 전용 의도 설계로 회귀 아님(origin 소스 대조 확인)
  - **사용자 로컬 전체 화면 검수 승인 완료 (2026-08-03)**

## Round 27 배포 결과 (2026-08-03)

정본: `docs/worklogs/ROUND-27-NIGHT-BUS-MAP-FULLSCREEN-20260803.md` / 상세 핸드오프: `docs/handoff/HANDOFF-20260803_2.md`

```
판정              DEPLOY PASS
서버 Git          ba058ee → abb0ba7 (--ff-only)
새 이미지          sha256:23bfedc2ba78fe51... / OCI revision abb0ba7
실측 중단          2초 (T0=기존 컨테이너 중지 직전 → T1=Caddy 내부 /ko 최초 200)
rollback          미실행
Caddy             수정·reload·restart 0
다른 8개 컨테이너    재시작 0 (StartedAt 2026-07-20 유지)
6개 도메인         기준선 동일 (200/307/301/200/200/200)
sitemap           53/53 = 200, 중복 0, 5xx 0
404 매트릭스       4/4
Round 27 기능      라이브 32/32 PASS (데스크톱·390·844·/en 무영향)
```

Round 26 안전 계약 그대로 + **이번 라운드 추가 게이트**: `latest` 이동을 자동 QA 통과 후가 아니라 **포그린 iPhone Safari 라이브 승인 뒤로** 미뤘다(승인 전 실패 시 latest는 애초에 무변경). 검증 체인: 빈 컨텍스트 대체 독립 감사 AUDIT PASS(P0/P1/신규P2 0) → 로컬 iPhone 실기기 승인 → 커밋·push → 선점검 → 배포 → 자동 라이브 QA → **라이브 iPhone 승인** → latest 이동.

## 남은 로드맵

```
Round 27 배포 결과 docs-only 커밋 (이 커밋)
→ 사용자 push 승인 → docs-only push → Round 27 완전 종료
→ (2~3주 후, 배포일 2026-08-03 기준) Search Console 색인 갱신 확인 → AdSense 재신청 판단
→ 후속 후보 3건은 별도 라운드: ① fs 확대 시 전체보기/✕ 버튼 겹침 ② 초기화 viewBox 드리프트 ③ 데스크톱 전체화면 더블클릭 종료 토글
```

서버·Docker·Caddy 추가 변경 없음. rollback 자산 정리도 별도 승인 전에는 하지 않는다.

### push와 deploy는 실제로 분리된다

2026-08-03 read-only 점검 결과, 이 저장소에는 GitHub webhook 0, GitHub Deployments 0, CI 상태 체크 0, Vercel 설정 0이다. 배포는 Vultr 158.247.252.172 서버에서 수동 Docker 실행으로만 이뤄지므로 **main push는 원격 저장소만 갱신하고 라이브에 영향이 없다.**

**push·deploy는 각각 별도 승인이며 자동 실행 금지.**

### AdSense 재신청은 배포 직후가 아니다

배포 후 최소 2~3주 두고 Search Console에서 색인 갱신을 확인한 뒤 판단한다. 2차 거절은 색인 완료 상태에서 **실제 페이지를 보고** 난 것이므로, 옛 색인이 남은 채 재신청하면 고친 내용을 보지도 못한 채 3차 거절이 난다.

### 잠금 계약 (이후 라운드에서 깨면 안 됨)

```
영어 정류장명은 getOfficialStopNameEn 단독, 미스는 nameKo fallback
routes.json.nameEn 은 표시 경로 사용 금지
endPoint 는 종점·마지막 정류장으로 사용 금지 (11개 중 10개에서 반환점과 일치)
반환점·마지막 정류장은 실제 stop 배열로 계산
운영정보는 official_confirmed + confirmed 조합만 화면 표시
reverification_required 상태에서는 금액 표시 금지
로보택시는 시간대별 요금 4구간·실시간 호출·카카오T 필수 계약 유지
FAQ q1 은 stop 배열 구조 기반 3분기 (노선 id 하드코딩 금지)
FAQ q4 는 C2O 상태 모델 기반 조건부
C2E disclosure 임계값 5·미리보기 3, 보조줄 C안 유지
비교 표현은 전 노선 데이터 대조 후에만
콘텐츠에 근거 없는 편의·성능 평가 금지
--- Round 27 추가 ---
더블클릭·더블탭은 전체화면 진입만 담당 (종료 제스처는 사양에 없음)
기존 크게 보기 버튼 유지
/ko/night-bus-map 만 인터랙티브 대상, /en 은 텍스트 가이드 유지
CSS 오버레이 구조 유지, Fullscreen API 추가 금지
인라인 핀치·팬 유지, 전체화면 내부 더블탭 확대 유지
전역 viewport·touch-action 정책 변경 금지
```

## 협업 규칙 (필수)

1. **지시서만 와도 요청 없이 이견 제시. 스스로 승인해 실행 금지**
2. GPT는 파일을 못 읽으므로, 지시서가 오답이면 **오디트 지시서를 역제안**하는 것도 임무
3. 조건부 게이트는 이진 판정 — 미결 1건이라도 있으면 정지
4. **코덱스는 부사수**: 구현·실증은 Claude Code, 완성 후 read-only 검사만. (코덱스는 `/tmp` 생성이 막혀 파일시스템 테스트 불가)
5. 선택 창 사용 금지 — 미결은 채팅에 A/B안으로
6. 캡처는 `~/Desktop/seoul-shots/<라운드폴더>/`에 번호+설명
7. 커밋·푸시·배포 각각 별도 승인 / 디버깅 5분 초과 시 중간 보고 / BLOCK 즉시 정지

## 운영 주의 (변동 없음)

- 서버에 untracked `Dockerfile` — `git pull --ff-only`만 / 배포 전 `rollback-<해시>` 태그 박제 / Caddy는 validate→reload만
- 로컬 최종 판정은 `node .next/standalone/server.js` (static·public 복사, 좀비 포트 확인)
- `routes.json`·`nameKo`·night-bus-data.ts·SVG 기하 수정 금지 / sitemap·canonical·hreflang 변경 금지
- **Track O 주의**: A160 요금은 서울시 공식(2024-12 무료)과 보도(2026-01 유료화)가 충돌 — 최신 공식 고시 확인 전 확정 금지. `endPoint`는 마지막 정류장이 아니라 **반환점**

## 새 세션 시작 시

1. [ ] 이 문서
2. [ ] `docs/handoff/HANDOFF-20260803_2.md` (Round 27 상세 — 구현 계약·검증 체인·배포 좌표)
3. [ ] `docs/worklogs/ROUND-27-NIGHT-BUS-MAP-FULLSCREEN-20260803.md` (Round 27 정본 A~R)
4. [ ] `docs/handoff/HANDOFF-20260803.md` (Round 26 정본 — 소급 수정 금지)
5. [ ] `docs/worklogs/PREFLIGHT-VULTR-DEPLOY-20260803.md` §M (Round 26 배포 결과)
6. [ ] MEMORY.md
7. [ ] 기준점 확인 — **runtime = server = origin/main = `abb0ba7`, 라이브 이미지 `23bfedc2ba78`**. Round 26·27 코드·배포는 전부 끝났다. **재구현·재조사·재감사·재배포 전부 금지.** 남은 것은 Round 27 docs-only push 1건뿐이며, 그것도 포그린 승인이 필요하다. 단 포그린이 다른 지시를 주면 그것이 우선

## 핸드오프 운영 규칙

- `docs/handoff/HANDOFF-YYYYMMDD.md` 날짜별 누적(삭제·통합·개명 금지), 같은 날 2회차는 `_2`
- `docs/SESSION-HANDOFF.md` 항상 최신 갱신
- 지시서는 `docs/worklogs/`에 정본 파일로 보존
- docs 변경은 배포 불필요, docs-only 단독 커밋(승인 후)

## 서버 정보

Vultr 158.247.252.172 / Docker 수동 run / 컨테이너 `seoul_autonomous_web` / `--network apps-newsforgreens_default --restart unless-stopped --hostname 0.0.0.0 -e NODE_ENV=production` / Caddy 6개 도메인 — docker restart 금지
