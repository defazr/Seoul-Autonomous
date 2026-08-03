# Round 27 — /ko/night-bus-map 더블클릭·더블탭 전체화면 (감사 추적 정본)

**작성**: 2026-08-03 / **판정**: Production DEPLOY PASS / **커밋**: `abb0ba7`

---

## A. 목적과 확정 요구사항

포그린 확정 사양 (Phase 0 지시서):

- PC: 지도 영역을 마우스 **왼쪽 버튼 더블클릭** → 기존 CSS 오버레이 전체화면 진입
- 스마트폰: **한 손가락으로 빠르게 두 번 탭** → 같은 전체화면 진입 (두 손가락 아님)
- 기존 "크게 보기" 버튼 유지 — 버튼·더블클릭·더블탭이 **동일한 기존 진입 함수** 사용
- 더블클릭·더블탭은 **진입만** 추가. 종료 제스처는 추가하지 않음 (닫기는 ✕·Esc)
- 단일 탭·스크롤·스와이프·핀치를 진입으로 오인 금지
- 전역 확대 차단류(`user-scalable=no`·전역 `touch-action` 등) 금지
- `/ko/night-bus-map`만 대상. `/en/night-bus-map`(25-E 텍스트 가이드) 비대상

## B. 착수 전 기준점

```
HEAD = origin/main = 2b1463f (Round 26 docs 커밋) / tracked 0 / 미추적 7건 보존
Production runtime ba058ee / live image sha256:f2674161ee68…
대상 파일 착수 전 SHA-256 d0b8085cda18be5d14e93795ca657cbc12148957fcd4a3ee4587efdd72bee769
```

## C. 실제 기존 전체화면 구조 (Phase 0 실측)

- CSS 오버레이 단독(`obOverlay` fixed inset:0 z-9999) — **Fullscreen API 저장소 전체 0건**
- 진입: "크게 보기" 버튼 → `openFullscreen`(body overflow 저장→hidden, fsVb 리셋, 힌트, state)
- 닫기: ✕(포커스 이동)·Esc. PNG 저장·초기화·body scroll lock 복원 존재
- **핵심 발견**: 인라인 지도의 모바일 더블탭에는 이미 주인이 있었다 — `useDoubleTap` 훅이 탭 지점 ×2 줌/리셋을 수행(stage `onClick` binding). 요구 구현 시 이 기능은 교체될 수밖에 없음 → 선보고 이견으로 보고, **포그린이 "의도적 재배정"으로 확정(A안)**. 줌 수단은 인라인 핀치 + 전체화면 내 더블탭으로 유지됨

## D. 구현 설계

- 데스크톱: `.obStage`에 React `onDoubleClick`. `e.button===0` / 터치 파생 합성 dblclick 700ms 억제(`lastTouchAtRef`) / target guard는 `e.currentTarget.querySelector(':scope > svg')`로 인라인 지도 SVG 판별 — **PNG용 공용 `svgRef` 미사용**(오버레이와 ref 혼동 위험 차단). 텍스트 선택은 `onMouseDown`에서 `detail>1 && button===0 && SVG 위`일 때만 `preventDefault`(CSS 무변경)
- 터치: React Pointer Event 4종(`onPointerDown/Move/Up/Cancel`). `pointerType==='touch'`만(pen·mouse 제외), **폭 기반 `isMobile` 분기 비의존**. 계약: 300ms / 40px / 이동 8px(기존 DRAG_THRESHOLD와 동일). 두 번째 손가락·8px 초과 이동·`pointercancel`·SVG 밖 터치는 진행 탭+첫 탭 후보 전부 취소. 느리거나 먼 유효 탭은 새 첫 탭 후보로 재설정. **터치 handler `preventDefault()` 0** — 기존 스크롤·핀치·`touch-action` 계약 보존
- 중복 방지: 동기 `fsOpenLockRef` 단일 게이트(`beginFullscreenEntry`)를 **3경로 전부** 통과. 잠금은 `openFullscreen()` 호출·예약 전 선점. 더블탭은 `setTimeout(0)`으로 **다음 task 1회 예약** — 같은 터치의 합성 click/dblclick이 오버레이 더블탭 확대까지 연쇄되는 것 차단. `closeFullscreen`·unmount cleanup에서 잠금·타이머 해제
- 제거: 인라인 `const onDoubleClick = useDoubleTap(...)` 호출과 stage `onClick` binding. 훅 정의와 전체화면용 `onFsDoubleClick`은 유지

## E. 변경 파일과 diff

```
web/app/[locale]/night-bus-map/NightBusMap.tsx  1개 파일  +120 / −5
변경 후 SHA-256 f1393cf3b60df4c2f0a7b9825c78d36aaafe7cd99b20e8b57e29b8ce7593ce35
CSS·page.tsx·데이터·package·의존성 diff 0
```

## F. Phase 1 로컬 QA

standalone(`node .next/standalone/server.js`) + npx 캐시 playwright(CDP 실이벤트). **39/39 PASS** — 데스크톱 16(단일 0/좌더블 1/우클릭 0/SVG밖 0/카드·바 0/버튼/재진입/PNG/초기화/Esc·overflow) · 모바일 390 17(단일 0/90ms 더블탭 1/연쇄 확대 없음/fs 확대 유지/450ms·80px·스와이프·핀치 0/재진입) · 가로 844 3(**폭≥768 touch 진입 = 폭 분기 비의존**) · /en·SEO 3. 정적: typecheck 0 / build 0 / **baseline lint non-clean(error 5·warning 8, HEAD와 1:1 동일) / 신규 lint 회귀 0**.

QA 도구 결함 4건을 배포 결함과 분리(오버레이 셀렉터 과매칭·obBtnRow 오클릭·스크롤 변위 좌표·actionability 아티팩트) — 전부 스크립트 수정으로 해소, 구현 결함 0.

## G. Phase 1A 표적 재검증

GPT 재검토 지적(두 줄 잔존 의혹)은 **변경 전 스냅샷 오독으로 판명**(정적 검색 0건·diff 제거 라인 증빙). 단 "인라인 viewBox를 안 쟀다"는 QA 공백 지적은 정당 → **3점 동일성**(진입 직전 = 열림 중 = 닫힘 직후) 기준으로 전 시나리오 재측정, 이중 동작 부재 실증. 이 과정에서 기존 결함 2건을 발견·분리(§Q). 파일 무변경(SHA 동일).

## H. 대체 독립 감사

**명칭: 빈 컨텍스트 대체 독립 감사.** Codex는 사용량 한도(2026-08-08까지)로 실행 불가 → 포그린 승인으로 대체. 구현 보고서·QA 스크립트·판정문을 전달받지 않은 별도 빈 컨텍스트 에이전트가 실제 diff 전수·정적 검증(tsc·build·eslint 독립 실행)·**자체 설계** 브라우저 QA(CDP 실이벤트)를 수행.

```
AUDIT PASS / P0 0 / P1 0 / 신규 P2 0
계약 (a)공통 잠금 (b)데스크톱 (c)터치 (d)보존 (e)제거 전부 PASS
추가 실증: 진입 550ms 후 자동 확대 없음 · 스와이프 직후 탭 결합 진입 없음 · 연속 더블클릭 중복 0
기존 위험 2건을 독자적으로 같은 원인까지 특정해 분리 (animateVB clampVB base 누락)
```

## I. 사용자 로컬 iPhone 승인

포그린이 같은 Wi-Fi에서 `http://172.30.1.46:3000/ko/night-bus-map`을 **iPhone Safari 실기기**로 직접 조작 — 탭/더블탭/스크롤/핀치/재진입/버튼 전항 확인, 이상 0. (라이브 승인과 별개 게이트)

## J. 커밋·push

```
Phase 4  commit abb0ba7 "Add map fullscreen gestures" — 명시 stage 1파일, hook 자동수정 0
Phase 5  push 2b1463f..abb0ba7 (fast-forward, 커밋 1개·파일 1개 검증 후). push ≠ deploy — 라이브 무영향 확인
```

## K. Vultr 배포 전 선점검 (Phase 6, read-only)

**DEPLOY-READY.** 서버 HEAD ba058ee·porcelain "?? Dockerfile" 단독·Dockerfile SHA `01429bd8…` 불변·remote abb0ba7·FF exit 0(delta = docs-only 2b1463f + 코드 abb0ba7). 라이브 3자 image ID 일치(실행=`:ba058ee`=latest=`f2674161`). 이름 충돌 0(rollback-ba058ee·image abb0ba7·candidate 전부 ABSENT). 디스크 37G·mem 2.4Gi·load 0.09. Caddy validate Valid·upstream 이름 기반·Caddyfile SHA `c35aa1c0…` 기록. 기준선(8컨테이너 StartedAt 2026-07-20·6도메인·7경로 200) 저장. 주의: seoul 로그 grep에 걸린 14건은 전부 ACME/TLS 로그 — 실제 upstream 오류 0(이후 QA 필터에서 TLS logger 분리).

## L. Production 배포 실행 (Phase 7)

```
A 재확인      전항 일치 (3자 image ID 포함)
B rollback    rollback-ba058ee 신규 생성 — 실행 중 실제 image ID(f2674161) 기준, 3자 대조 MATCH
C pull        fetch → FF_OK → --ff-only → 서버 HEAD abb0ba7, Dockerfile 불변
D build       21:03:59~21:04:36 (37s) exit 0, static 60/60
              새 이미지 sha256:23bfedc2ba78fe511b6909dfecfd3663bc0b3e05601ef82aa0f49cd47bfe1ee3
              라벨 revision=abb0ba7 / source=https://github.com/defazr/Seoul-Autonomous, latest 미이동
E candidate   seoul_autonomous_web_candidate_abb0ba7 — 2초 ready, 5경로 200(ko·en night-bus-map 포함),
              이미지·라벨·rc 일치, 로그 0, ko obStage 1 / en obStage 0 → 중단 전 stop+rm(이미지 보존)
F 승격        backup rename: seoul_autonomous_web_backup_ba058ee_20260803-210527 (rm 금지)
              → :abb0ba7 로 원래 이름 기동 → 실측 중단 2초 (T0=1785758727 → T1=1785758729)
```

## M. 자동 라이브 QA (Phase 7 §9~11)

- 무결성: 신규 컨테이너 image=`23bfedc2ba78`·rev abb0ba7·rc 0·스펙 동일 / 앱 로그 0 / **Caddy 실제 upstream 오류 0**(TLS 분리) / 다른 8개 컨테이너 불변 / **latest 여전히 f2674161 유지 확인**
- 기술: 6도메인 기준선 동일 · 7경로 200 · sitemap 53/53·중복 0·5xx 0 · 404 4/4
- 기능(라이브 실측 **32/32 PASS**): 데스크톱 1440(단일 0/더블 1/FS_VB/버튼/재진입/카드·노선 단일 클릭 유지/overflow) · 모바일 390(단일 0/더블 1/지연 후 자동 확대 없음/**3점 동일성**/느림·멂·스와이프 결합 0/핀치 정상/fs 내부 더블탭 유지) · 844(width 844 진입 = 폭 분기 비의존) · /en(obStage 0·canonical·JSON-LD 2)
- 이 시점 판정: `DEPLOY TECH PASS / IPHONE LIVE QA PENDING` — **latest 이동 보류**

## N. iPhone Safari 라이브 승인 (Phase 7B)

포그린이 `https://seoulautonomous.com/ko/night-bus-map`을 iPhone Safari로 직접 확인 — 단일 탭 오인 없음/더블탭 진입/스크롤·스와이프 정상/핀치 유지/재진입/버튼 정상/로컬 승인본과 체감 차이 없음 → **PASS**. 이후에만 `latest → abb0ba7` 이동, 3자 일치 재검증. **최종 DEPLOY PASS.**

## O. 최종 Production 좌표

```
Git local/origin       abb0ba7
server checkout        abb0ba7
runtime revision       abb0ba7
live image ID          sha256:23bfedc2ba78fe511b6909dfecfd3663bc0b3e05601ef82aa0f49cd47bfe1ee3
immutable              seoul-autonomous-web:abb0ba7
latest                 동일 image ID
RestartCount           0 / rollback 미실행 / 삭제·prune 0 / Caddy 변경 0
```

## P. 보존 rollback 자산 (삭제·prune 금지)

```
R27 backup    seoul_autonomous_web_backup_ba058ee_20260803-210527  (exited)
R27 rollback  seoul-autonomous-web:rollback-ba058ee → sha256:f2674161ee68c058cbe6fc8a464fc1778d5cd756ab7cb30ba46cccf816f5162f
R26 backup    seoul_autonomous_web_backup_ef0274a_20260803-183544  (exited)
R26 rollback  seoul-autonomous-web:rollback-ef0274a → sha256:6d878d66110ec6444f27447f04e054d922b45b6b3d63883b204c26d4d26a2406
```

## Q. 기존 위험·후속 후보

**Round 27 신규 회귀가 아닌 기존 baseline 문제** (라이브에서도 재현, diff 무관 — 독립 감사도 동일 판정):

1. **전체화면 확대 상태에서 "전체 보기" 버튼이 ✕ 닫기 버튼을 일부 덮음** — 분류 **B**: 첫 탭이 전체 보기에 들어가 지도가 초기화될 수 있으나 이후 닫기 가능. 닫기 불가 아님 (겹침 실측 ~1480px², z 10001 vs 10000)
2. **`animateVB → clampVB` 호출의 base 인자 누락에 따른 viewBox 초기화 드리프트** — 모바일 예 `110 17 2200 1436 → 110 17 2200 1375`(DEFAULT_VB 종횡비로 클램프). fs 초기화 도착값이 FS_VB가 아닌 것도 같은 계열. 기존 라이브에서 바이트 동일 재현

**후속 후보 3건** (이번 라운드 미수정, 별도 라운드에서 read-only 선점검부터):

```
1. 모바일 전체화면 닫기/전체 보기 버튼 겹침
2. 인라인·전체화면 초기화 viewBox 드리프트
3. 데스크톱 전체화면 더블클릭 종료 토글
```

## R. 금지선과 잠금 계약 (이후 라운드에서 깨면 안 됨)

```
더블클릭·더블탭은 전체화면 진입만 담당
전체화면 종료 제스처는 이번 사양에 없음 (닫기는 ✕·Esc)
기존 크게 보기 버튼 유지
/ko/night-bus-map 만 인터랙티브 대상
/en/night-bus-map 은 텍스트 가이드 유지
CSS 오버레이 구조 유지
Fullscreen API 추가 금지
인라인 핀치·팬 유지
전체화면 내부 더블탭 확대 유지
전역 viewport·touch-action 정책 변경 금지
터치 판별은 pointerType 기반 (폭 분기 금지)
진입 3경로는 동기 잠금 단일 게이트 공용
latest 는 iPhone 라이브 승인 후에만 이동 (이번 라운드에서 확립된 게이트)
```
