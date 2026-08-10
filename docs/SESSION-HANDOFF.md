# Session Handoff

> 마지막 업데이트: 2026-08-11 (AdSense Final Gate APPLY-NOW / 3차 재신청 실행 / 심사 대기)
> 다음 세션은 **이 파일을 가장 먼저** 읽고 시작한다.

## 현재 위치

**AdSense 3차 재신청 실행 완료 — 심사 대기 중.** 2026-08-11 read-only Final Gate Audit이 **APPLY-NOW / P0 0 / P1 0 / 수정 필수 0**으로 나왔고, 포그린이 같은 날 재신청을 실행했다. Round 26(콘텐츠·운영정보)과 Round 27(노선도 전체화면 제스처)은 그 전에 구현·배포·문서화까지 전부 닫혀 있다.

**Round 26·27 재구현·재조사·재감사·재배포 전부 금지.** 그리고 지금은 **심사 기간**이라 별도의 착수 금지 규칙이 하나 더 걸려 있다(아래 §심사 기간 운영 원칙).

```
AdSense Final Gate      APPLY-NOW  (2026-08-11)
P0 / P1 / 수정 필수      0 / 0 / 0
3차 재신청              2026-08-11 포그린 실행
코드·서버 변경           0
Round 26 / 27           CLOSED (DEPLOY PASS)
```

## 다음 세션 첫 작업 — **심사 대기 상태 유지 + docs-only 커밋 승인 여부**

이번 세션 docs 3건(감사 정본·HANDOFF-20260811·이 파일)은 **미커밋 상태**다. docs-only 단독 커밋은 포그린 승인 후에만 한다. 그 외에는 **아무것도 착수하지 않는 것이 정상 상태**다.

## ⚠ 심사 기간 운영 원칙 (포그린 확정, 2026-08-11)

```
심사 중에는 사이트를 크게 뜯어고치지 않는다.
지금 검증된 상태를 안정적으로 유지하는 것이 최우선이다.
```

심사 결과가 나오기 전까지 **착수 금지**:

```
후속 후보 3건 (fs 버튼 겹침 / viewBox 드리프트 / 데스크톱 종료 토글)
Pretendard 4.3MB · OG 이미지 941KB · sitemap lastmod
캐시 정책 · HSTS · schema · IndexNow · llms.txt
신규 영어 콘텐츠 · 페이지 추가
추가 SEO 감사
```

기술 부채는 사라지지 않는다 — 심사 종료 후 별도 라운드로 처리한다.
심사 중 긴급 수정이 필요한 사안이 생기면 **착수 전 포그린 승인**을 받는다.

## 좌표

```
local HEAD          a11e904                  (docs 커밋이 쌓이면 이보다 새로워질 수 있음)
origin/main         a11e904
server checkout     abb0ba7
runtime revision    abb0ba7                  ← OCI label로 직접 증명 가능
live image ID       sha256:23bfedc2ba78fe511b6909dfecfd3663bc0b3e05601ef82aa0f49cd47bfe1ee3
immutable image     seoul-autonomous-web:abb0ba7
latest              동일 image ID
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

## AdSense 이력

```
1차 거절     2026-07-10   "가치가 별로 없는 콘텐츠"
2차 거절     2026-07-29   색인 완료 상태에서 동일 사유 재차 거절
Round 26     2026-08-03   배포 — 거절 원인 3건 수리
                          (얇은 템플릿 22페이지 / 근거 없는 "Verified" 주장 /
                           영문 페이지 한글 정류장명)
Final Gate   2026-08-11   APPLY-NOW / P0 0 / P1 0
3차 재신청    2026-08-11   포그린 실행 (배포 8일차)
현재         심사 대기
```

CC는 배포 8일차라 기존 기준(2~3주)의 하한(08-17)에 미달함을 근거로 08-17 이후를 권고했고, 포그린은 GSC 재크롤 확인을 근거로 즉시 재신청을 결정했다. **결정권은 포그린**이며 그대로 실행됐다.

**심사 결과 수신 후 분기**

```
승인 → 광고 배치·CMP·Consent Mode 라운드 설계 (현재 광고 슬롯 0개, Auto ads 0)
거절 → 거절 사유 원문 확보가 먼저. 사유 없이 추측 수리 착수 금지
```

## Final Gate Audit 결과 요약 (2026-08-11)

정본: `docs/worklogs/ADSENSE-FINAL-GATE-AUDIT-20260811.md` / 핸드오프: `docs/handoff/HANDOFF-20260811.md`

```
주요 URL 16건        전건 정상 (/ → /en 307 1회는 의도된 동작, 5xx 0, loop 0)
robots.txt          Disallow 지시자 0건 — robotparser 정식 파싱으로 UA×경로 매트릭스 판정
  Googlebot / Mediapartners-Google / AdsBot-Google  전 경로 allow
noindex / X-Robots  53건 전수 0 / 0
canonical           53건 전수 자기참조, 누락·중복·타호스트 0
sitemap             53 URL / unique 53 / 중복 0 / non-200 0
404 매트릭스         4/4 실제 404 (soft-404 아님)
내부 링크            고유 타겟 53개 전수 200, broken 0
신뢰 경로            privacy·about·data-source 6페이지 200, 푸터 inbound 25~28
ads.txt             200 / text/plain / pub-7976139023602789 / HTML error 아님
AdSense script      페이지당 정확히 1개 (53/53), client ID 단일, 중복 0
Chromium runtime    4페이지 × desktop·390 = 8조합, hydration 0 / exception 0 / blank 0
모바일 390px         horizontal overflow 0
```

**publisher ID 3중 일치**: 라이브 ads.txt = `web/public/ads.txt` = `web/app/[locale]/layout.tsx:59`(`ca-pub-7976139023602789`)

**결함 아님으로 종결한 관찰 2건** — ① googleads 403은 승인 전 광고 요청 거절로 정상이며 Round 26 기준선과 동일(오히려 스크립트가 올바른 ID로 발화 중이라는 방증) ② `?_rsc=` prefetch ERR_ABORTED는 클라이언트 취소로, 서버 직접 요청 시 `200 text/x-component`.

## 완료 요약 (Round 26 · 27)

- **26-B/B.1 (`a5307b3`)**: 무범위 "검증됨" → 확인 범위 명시형 전면 교체 · q4 정보 범위 FAQ · 원시 Unknown/앱 단정 제거 · 홈·About·Data Source 정체성 정합 · 전역 내비 심야버스 링크 · ko 전용 페이지 EN 토글 404 수리
- **26-C1E (`c6d7290`)**: OA-12830 공식 영문 정류소명 SSOT 267건(공식 영문 261 / 한국어 fallback 6). `routes.json` 무변경
- **26-C2E + C2E.1 (`b36ed11`)**: 공식 영문 정류장 렌더 연결. 표시 계약 = `getOfficialStopNameEn` 단독, 미스는 `nameKo`로만 대체, `routes.json.nameEn`은 표시 경로 영구 배제. 보조줄 C안 · `DISCLOSURE_THRESHOLD=5` · `PREVIEW_LIMIT=3`
- **26-C1O 공식 조사**: 48셀 = 공식확인 7 / 보도참고 3 / 미확인 38. A160 요금 미확인 확정(1,200원은 조조할인가, 단일 요금 표기 금지). 유상전환 예고 시점 도래 노선 4개 발견
- **26-C2O (`7364d42`)**: 운영정보 상태 모델. `verificationGrade` × `currentState` 별개 축. `official_confirmed`+`confirmed` 조합만 value non-null. client DTO 격리
- **26-C3 + C3.1·C3.2 (`1682447`)**: 노선별 콘텐츠·FAQ q1 재설계. q1은 stop 배열 구조로만 3분기(노선 id 하드코딩 0)
- **Round 26 배포 (`ba058ee`, 2026-08-03)**: DEPLOY PASS, 실측 중단 3초
- **Round 27 (`abb0ba7`, 2026-08-03)**: `/ko/night-bus-map` PC 더블클릭·모바일 더블탭 전체화면 진입. 기존 "크게 보기" 버튼 유지. DEPLOY PASS, 실측 중단 2초, 포그린 iPhone Safari 라이브 승인
- **Round 27 docs (`a11e904`)**: push 완료 — Round 27 완전 종료

## 잠금 계약 (이후 라운드에서 깨면 안 됨)

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
--- Round 27 ---
더블클릭·더블탭은 전체화면 진입만 담당 (종료 제스처는 사양에 없음)
기존 크게 보기 버튼 유지
/ko/night-bus-map 만 인터랙티브 대상, /en 은 텍스트 가이드 유지
CSS 오버레이 구조 유지, Fullscreen API 추가 금지
인라인 핀치·팬 유지, 전체화면 내부 더블탭 확대 유지
전역 viewport·touch-action 정책 변경 금지
--- AdSense ---
ads.txt publisher ID = pub-7976139023602789 (layout.tsx client ID와 항상 일치 유지)
robots.txt 에 Disallow 추가 금지 — Mediapartners-Google 차단은 심사 실패로 직결
심사 중 사이트 대규모 변경 금지
```

## 협업 규칙 (필수)

1. **지시서만 와도 요청 없이 이견 제시. 스스로 승인해 실행 금지** (read-only·감사도 예외 아님)
2. GPT는 파일을 못 읽으므로, 지시서가 오답이면 **오디트 지시서를 역제안**하는 것도 임무
3. 조건부 게이트는 이진 판정 — 미결 1건이라도 있으면 정지
4. **코덱스는 부사수**: 구현·실증은 Claude Code, 완성 후 read-only 검사만. (코덱스는 `/tmp` 생성이 막혀 파일시스템 테스트 불가)
5. 선택 창 사용 금지 — 미결은 채팅에 A/B안으로
6. 캡처는 `~/Desktop/seoul-shots/<라운드폴더>/`에 번호+설명
7. 커밋·푸시·배포 각각 별도 승인 / 디버깅 5분 초과 시 중간 보고 / BLOCK 즉시 정지

## 검사 도구 안전선 (누적)

```
zsh 는 unquoted 변수를 워드 분할하지 않는다 — for u in $URLS 는 1회만 돈다.
  다건 순회는 목록 파일 + while IFS= read -r 로 (2026-08-11 실사고)
SSR one-line HTML 에 grep -c 금지 — 줄 수를 세므로 전부 0/1 로 뭉개짐.
  개수는 findall 또는 grep -o | wc -l, 텍스트는 parser 로
축약 SHA 와 full SHA 혼용 금지 (git rev-parse 는 40자 반환)
set -e + [ ... ] && echo 는 첫 미매치에서 루프 전체를 죽인다 — set +e 나 || true 로 격리
존재하지 않는 추정 URL 검사 금지 — URL 은 sitemap·내부 링크 실물에서만 도출
예상 밖 수치(0 이든 2 든)가 나오면 결함 단정 전에 도구·selector 부터 재검증
redirect 는 최초 status 와 최종 URL·status 를 구분해 기록
```

## 운영 주의 (변동 없음)

- 서버에 untracked `Dockerfile` — `git pull --ff-only`만 / 배포 전 `rollback-<해시>` 태그 박제 / Caddy는 validate→reload만
- 배포 안전 계약: rollback 태그 → immutable SHA 태그 단독 빌드(+revision 라벨) → candidate 선검증 → 기존 컨테이너 rename 보존 → 전체 QA PASS 후에만 `latest` 이동
- 배포 시 수 초 502 불가피(실측 2~3초). 같은 Caddy가 6개 도메인·9개 컨테이너 담당 → 건드리지 않는다
- **이 프로젝트는 Vercel을 쓰지 않는다.** main push는 라이브에 영향 없음 — push와 deploy는 각각 별도 승인
- 로컬 최종 판정은 `node .next/standalone/server.js` (static·public 복사, 좀비 포트 확인)
- ⚠ 저장소 루트에 React Native, `web/`에 Next.js가 있어 **`data/routes.json`이 둘**이다. 스크립트는 반드시 절대경로로
- `routes.json`·`nameKo`·night-bus-data.ts·SVG 기하 수정 금지 / sitemap·canonical·hreflang 변경 금지
- **Track O 주의**: A160 요금은 서울시 공식(2024-12 무료)과 보도(2026-01 유료화)가 충돌 — 최신 공식 고시 확인 전 확정 금지. `endPoint`는 마지막 정류장이 아니라 **반환점**

## 새 세션 시작 시

1. [ ] 이 문서
2. [ ] `docs/handoff/HANDOFF-20260811.md` (AdSense Final Gate + 3차 재신청 — 최신)
3. [ ] `docs/worklogs/ADSENSE-FINAL-GATE-AUDIT-20260811.md` (감사 정본)
4. [ ] `docs/handoff/HANDOFF-20260803_2.md` (Round 27 상세)
5. [ ] `docs/handoff/HANDOFF-20260803.md` (Round 26 정본 — 소급 수정 금지)
6. [ ] MEMORY.md
7. [ ] 기준점 확인 — **runtime = server = `abb0ba7`, 라이브 이미지 `23bfedc2ba78`, Git = `a11e904`(+미커밋 docs 3건)**. Round 26·27은 전부 끝났고 **AdSense 심사 대기 중**이다. 심사 중 사이트 대규모 변경 금지. 단 포그린이 다른 지시를 주면 그것이 우선

## 핸드오프 운영 규칙

- `docs/handoff/HANDOFF-YYYYMMDD.md` 날짜별 누적(삭제·통합·개명 금지), 같은 날 2회차는 `_2`
- `docs/SESSION-HANDOFF.md` 항상 최신 갱신
- 지시서·감사 결과는 `docs/worklogs/`에 정본 파일로 보존
- docs 변경은 배포 불필요, docs-only 단독 커밋(승인 후)
- `git add .` · `git add -A` 금지 — 정본 파일만 명시 stage

## 서버 정보

Vultr 158.247.252.172 / Docker 수동 run / 컨테이너 `seoul_autonomous_web` / `--network apps-newsforgreens_default --restart unless-stopped --hostname 0.0.0.0 -e NODE_ENV=production` / Caddy 6개 도메인 — docker restart 금지
