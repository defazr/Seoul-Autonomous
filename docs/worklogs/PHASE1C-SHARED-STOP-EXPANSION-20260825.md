# Phase 1C — Shared-stop Graph Expansion (정본)

- 일자: 2026-08-25
- 판정: **Phase 1C = APPROVED / PRODUCTION LIVE / CLOSED**
  (선점검 → 구현 → 로컬 QA → 사용자 로컬 승인 → commit·push → pre-deploy 게이트 → 배포
   → Live QA → 사용자 라이브 승인 → latest 정렬 → post-expansion audit KEEP+BACKLOG)
- 커밋: **`f693e019bcc359b08a5271288d00bc051ca8a7aa`** "feat: Expand shared-stop route links"
- 상위 정본: PHASE0·PHASE1A·PHASE1B worklog (전부 소급 수정 없음)

## A. 목적과 결과

Phase 1B에서 A21에만 격리했던 shared-stop UX의 **A21 전용 게이트를 정리형으로 제거**해,
Graph relation이 실제 존재하는 노선에서만 자연 노출되게 했다. 이로써 CTG가 처음으로
**사이트 전체의 양방향 구조**가 됐다.

```
변경           web/app/[locale]/routes/[id]/page.tsx 1파일 (+20/-22)
               — showSharedStops 변수·조건 제거 + Phase 1C 주석 (whitelist 없음)
비수정          Graph Core 0 · StopsList 0 · CSS 0 · i18n 0 · data 0 · 신규 URL 0
잔존 게이트      A21 Night Bus Map CTA (route.id === 'simya-a21' && locale === 'ko') — 별개 기능, 유지
```

## B. 확장된 Graph 범위

실관계 4노선에 자동 적용, 양방향 성립:

```
A160 ↔ A148 · A160 ↔ A741 · A160 ↔ A21 · A741 ↔ A21
없는 관계 (링크 0 유지): A148 ↔ A741 = 0 · A148 ↔ A21 = 0
나머지 7 fixed routes: shared 0 → UI 0 (요약·행·칩 자동 미생성, 실측 7/7)
```

## C. 최종 relation 수치 (Graph Core 재계산 + 라이브 렌더 이중 검증)

| route | visits | shared | single | 연결 |
|---|---|---|---|---|
| saebyeok-a160 | 87 | **33** | 54 | A148 16 · A21 17 · A741 5 |
| saebyeok-a148 | 41 | 16 | 25 | A160 16 |
| saebyeok-a741 | 34 | 5 | 29 | A160 5 · A21 5 (전부 3-route) |
| simya-a21 | 40 | 17 | 23 | A160 17 · A741 5 — Phase 1B와 불변 |

pair matrix:

```
          A160  A148  A741  A21
A160        -    16     5   17
A148       16     -     0    0
A741        5     0     -    5
A21        17     0     5    -
```

A160의 33행은 전 구간 산포가 아니라 **연속 클러스터 5블록 [4·4·8·9·8]**
(쌍문~미아 A148 회랑 왕복 + 종로4가~충정로 A21 회랑 왕복, 반환점 인근 무공유).

## D. UX 결과

A160 summary 33(칩 A148·A741·A21) / A148 summary 16(A160 단독) / A741 summary 5(행마다 2칩) /
**A21은 Phase 1B와 렌더 동일(17행/24칩 — regression 0)** / 무공유 노선 UI 0 /
locale-aware Link 유지 / "환승" 단정 표현 0 / outbound·inbound 노출 0 / 행당 칩 최대 2.
링크 총량: A160 41 · A148 17 · A741 12 · A21 24 (locale당) — 신규 +70/locale, 전부 실관계·가시.

## E. QA (commit 전 로컬 — 전항 PASS)

validate-graph 21항 · stop-names · 56/56 · tsc · build 전부 exit 0 /
lint = baseline **5 errors / 27 warnings 완전 동일**(신규 회귀 0) / sitemap 53 · 신규 URL 0 /
visual: A160 KO·EN / A148 / A741 / A21 / A504 / 390px overflow 0 / 양방향 6경로+EN 1경로 실클릭.

## F. Production 배포 (2026-08-25) — DEPLOY PASS

```
previous   runtime 2d380c9 / image fd10551bb9c6
new        runtime f693e01 / image 443ef571127094e1…(443ef5711270) · revision 라벨 full SHA
절차        rollback-2d380c9 박제 → git pull --ff-only → immutable f693e01 단독 빌드
           → candidate QA(--hostname 0.0.0.0, 7페이지 200·관계 정합) → 기존 컨테이너
           rename backup 보존 → 새 컨테이너 기동(--hostname 0.0.0.0) → live QA
교체 중단    실측 0.9초 (프로브 100회 중 502 2샘플)
무접촉      Caddy 변경 0 · 타 8컨테이너 restarts 0 · 이미지 prune 0
latest      live QA·사용자 승인 후 게이트에서 443ef5711270 로 정렬 (관례 유지)
```

배포 안전 계약 재확인: **candidate·Production standalone 공히 `--hostname 0.0.0.0` 필수** —
Phase 1C에서 양쪽 모두 정상 적용(1B의 실사고 재발 0).

## G. 최종 Production 좌표

```
runtime = f693e01 · image = 443ef5711270 · latest = 443ef5711270 (동일)
rollback-2d380c9 → fd10551bb9c6 · backup_2d380c9_20260825-214434 (exited, 보존)
기존 rollback/backup 자산(abb0ba7·ba058ee·ef0274a 계열) 전부 유지 — 삭제·prune 금지
```

## H. Live QA — 전항 PASS

A160 KO/EN(33행/41칩·요약 문구) · A148(16행, 금지칩 0) · A741(5행 2칩) · **A21 regression 0** ·
A504 신규 UI 0 · 390px overflow 0(KO·EN) · 양방향 6경로+EN locale 유지 실클릭 ·
6도메인 200 · sitemap 53/53 전수 200 · 404 4/4 · pageerror/hydration 0 · 로그 clean.
**사용자 라이브 승인: 2026-08-25 완료.**

## I. Post-expansion UX/SEO READ-ONLY audit — **KEEP + BACKLOG**

```
필수 수정 0 · 권장 개선 0 · 다음 기능 차단 0 · 현재 Production 유지 가능
```

핵심 판정: A160 33행 과밀 아님(칩 텍스트 본문 대비 6.7%, 정류장명 15px 주도·칩 12px 보조,
대비 16.1:1) · 8~9행 동일 칩 반복은 실제 공유 회랑의 표현으로 자연스럽게 읽힘(스팸성 없음) ·
link farm 인상 없음(전 링크 가시·실관계·의미 있는 노선명 앵커) · **low-value 위험 = 감소** ·
KO/EN 모바일 구조 문제 없음(EN 390 세로 밀도 높으나 정연) · 접근성 severity 결함 0
(키보드 focus-visible 실측 정상, 칩 26px ≥ WCAG 2.5.8 24px) · TTFB 81ms·에러 0.
감사 중 도구 오판 1건(programmatic focus의 outline none)을 실키보드 재검으로 기각.

## J. Backlog 3건 — 선택적 polish 후보로만 기록

```
① EN 모바일 "Other routes serving this stop" 반복 축약 검토
② summary 문구 "이 노선과 일부 정류장을 함께 지나는 노선" 계열 명확화 검토
③ 칩 tap target 44px(AAA) 상향 검토
```

**미수정 결함 아님 · 다음 기능 blocking 아님 · 즉시 작업 금지.**

## K. 다음 라운드 순서 (최신 확정)

```
Phase 1C docs 정본화 (이 문서)
→ Robotaxi Freshness  ← 독립 소형 freshness round (별도 승인 후 착수)
→ Stop URL 정책 READ-ONLY audit
→ 이후 후보: Night Bus Map ↔ CTG · static decision · N버스 통합
```

- **Robotaxi Freshness 범위 후보**: operatingHours Unknown → official_confirmed 승격 /
  serviceArea "약 20.4㎢" 보강 / 2026-08-19 공식 출처 추가 / 19대 확대 update 기사 검토.
  근거는 Phase 0 정본 §F(공식 URL 2건 확보). **Graph/Phase 1C 코드와 동시 수정 금지.**
- **static decision 선행 조건(로드맵 메모)**: daysOfOperation 미확인 7/11 ·
  headway 미확인 4/11 → "지금 운행 중인가" 기능 전 **C1O 공식 재조사 선행 필요.**
