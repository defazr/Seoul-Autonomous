# Stage 1 Stop Pages — 구현·배포·종료 정본 (Phase Stop-1E + Stop-1F)

- 라운드: Phase Stop-1E(구현·배포) + Phase Stop-1F(EN metadata polish)
- 종료일: 2026-08-27
- **상태: Stage 1 Stop Pages CLOSED**
- 관련 정본: 설계 `STAGE1-STOP-PAGE-DESIGN-20260826.md` / 정책 `docs/strategy/STOP-URL-POLICY-20260826.md` /
  감사 `STAGE1-STOP-PAGES-POST-LAUNCH-AUDIT-20260827.md` · `STOP-1F-EN-METADATA-POST-LAUNCH-AUDIT-20260827.md`

---

## 1. 최종 좌표

```
Git local = origin/main = server checkout = runtime revision
                          19ebf0eafd3450484959465946f5fa89a80c9ff8
Production image = latest 2e6545253cc4
live sitemap              69   (기존 55 + Stage 1 신규 14)
Stop URL                  14   (7 stop × ko/en)
```

**Stage 1 코드 커밋 2건**

| 커밋 | 내용 | 범위 |
|---|---|---|
| `f34ede8` | `feat: Add Stage 1 stop detail pages` | 9파일 +894/-5 (신규 3 · 수정 6) |
| `19ebf0e` | `fix: Front-load ARS id in English stop metadata` | 1파일 2키 +2/-2 |

**rollback 기준 (삭제·prune 금지)**

```
rollback-f34ede8  → dd19df584b62   (Stop-1F 직전 runtime)
backup 컨테이너    seoul_autonomous_web_backup_f34ede8_20260827-212828
rollback-8e3c9f8  → f13663508dc2   (Stage 1 직전 runtime)
backup 컨테이너    seoul_autonomous_web_backup_8e3c9f8_20260827-193733
그 외 기존 rollback 태그 15개 · backup 컨테이너 7개 전부 보존 (삭제 0)
```

## 2. 구현 범위 (Stop-1E)

신규 3 — `web/lib/stop-pages.ts`(승인 7건 리터럴 registry) ·
`web/app/[locale]/stops/[slug]/page.tsx` · `page.module.css`
수정 6 — `StopsList.tsx`(+`.module.css`) · `routes/[id]/page.tsx` · `sitemap.ts` ·
`messages/ko.json` · `messages/en.json`

신규 dependency 0 · `routes.json`(양쪽)·`stop-names`·Graph Core·validator 수정 0.
관계·순서·이웃은 전부 Graph Core 파생이며, 페이지가 아는 리터럴은 stopId/slug뿐이다.

**승인 7 Stop** (Stage 1 = "최대 33 심사"의 결과, 생성 목표가 아님)

| stopId | 공식명 | slug | 경유 노선 |
|---|---|---|---|
| 01009 | 광화문역 | `01009-gwanghwamun-station` | A160·A741·A21 |
| 01010 | 광화문역 | `01010-gwanghwamun-station` | A160·A741·A21 |
| 01013 | 종로2가 | `01013-jongno-2-ga` | A160·A741·A21 |
| 01014 | 종로2가 | `01014-jongno-2-ga` | A160·A741·A21 |
| 01007 | 서울역사박물관.경희궁앞 | `01007-seoul-museum-of-history-gyeonghuigung-palace` | A160·A741·A21 |
| 01008 | 서울역사박물관.경희궁앞 | `01008-seoul-museum-of-history-gyeonghuigung-palace` | A160·A21 |
| 01019 | 종로5가.광장시장 | `01019-jongno-5-o-ga-gwangjang-market` | A160·A21 |

## 3. 배포 기록

| | Stop-1E | Stop-1F |
|---|---|---|
| 커밋 | `f34ede8` | `19ebf0e` |
| 새 이미지 | `dd19df584b62` | `2e6545253cc4` |
| **실측 중단** | **0.21초** (502 1회) | **0.18초** (502 1회) |
| rollback 실행 | 없음 | 없음 |
| candidate 선검증 | PASS | PASS |
| latest 이동 | 사용자 라이브 승인 후 | 사용자 라이브 승인 후 |

두 배포 모두 확정된 안전 계약을 따랐다: rollback 태그 박제 → `git pull --ff-only` →
immutable SHA 태그 단독 빌드(+revision 라벨, latest 미이동) → candidate 컨테이너 선검증
(`--hostname 0.0.0.0` 필수) → 기존 컨테이너 **rename 보존** 교체 → 중단 프로브 실측 →
라이브 QA → **사용자 승인 후에만 latest 이동**. Caddy는 두 배포 모두 무접촉
(Caddyfile sha256 `c35aa1c06d48…` 불변, reload 0), 타 8컨테이너 restarts 0.

## 4. 라이브 QA 계약 (정답표 — 회귀 판정 기준)

```
신규 URL        14/14 200 · title·description 14개 전부 고유 ·
                canonical 자기참조 · ko↔en alternates · noindex 0 · X-Robots 없음 ·
                BreadcrumbList JSON-LD 각 1개(ListItem 2) · BusStop schema 0
sitemap         69 전수 200 · Stop 14 · 중복 0 · lastmod 2026-05-01(멤버 노선 lastChecked 최대)
404             /ko|en/stops · 비승인 01020 · 없는 stopId · malformed ·
                stopId정확+이름오기 = 7/7 404 · redirect 0
Route→Stop      A160 7 · A741 5 · A21 7 = 19 occurrence · 타 8노선 0 ·
                A741→01123 0 · A741→01008 0 · 행 자체는 비인터랙티브 유지
Stop→Route      칩 + 카드 링크 = routeCount×2 (3·3·3·3·3·2·2) · 01008 A741 링크 0
Stop→Stop       앵커 0 (v1 정책)
기존 CTG 회귀    A160 shared 33행·chip 41 / A21 17행·chip 24 — 불변
모바일           390 overflow 0 · pageerror 0
인프라           6도메인 200 · 타 컨테이너 restarts 0 · Caddy reload 0 · 로그 error 0
```

Stop-1E 라이브 QA 196항 ALL PASS, Stop-1F 라이브 QA 전항 PASS.

## 5. 결함 아님 기준선 (다음 라운드에도 승계)

- **googleads 403** = AdSense 승인 전 광고 요청 거절. 기존 route 페이지와 동일
- **`/[locale]/*` 라우트가 전부 `ƒ`(on-demand)** = 이 프로젝트의 기존 baseline. Stop 페이지도 동일
- **SiteFooter의 "환승"**(`심야버스 요금·환승` 링크) = 사이트 전역 기존 자산. Stop 콘텐츠 결함 아님
- **Stop URL의 sitemap lastmod가 과거일(2026-05-01)** = 멤버 노선 lastChecked 기반의 의도된 provenance.
  현재 날짜로 바꾸지 않는다

## 6. QA 도구 안전선 (이 라운드에서 실제 오탐이 발생한 항목)

- raw grep은 **next-intl messages 블롭 + RSC 페이로드**까지 센다 → `<script>` **비탐욕** 제거 후 판정
  (환승·outbound·inbound·BreadcrumbList가 전부 여기서 오탐)
- `/stops/` 문자열은 head의 **canonical·alternate·og:url**까지 잡는다 → **body 앵커만** 카운트
- 앵커 속성 순서가 `class→href`라 href 선행 정규식은 0을 반환한다
- 클릭 후 `waitForLoadState`는 이전 페이지에서 조기 반환될 수 있다 → **`waitForURL`** 사용
- canonical은 로컬에서도 **프로덕션 절대 URL**이다(SITE_URL 하드코딩) → 호스트 strip 비교 금지

## 7. 감사 결과 연결

```
Stop-1E post-launch audit   IMPROVE   필수 수정 0 · low-value risk DECREASED
  개선 ①  EN 방향쌍 title/desc prefix 동일  → Stop-1F에서 수정
  개선 ②  01008 카드 이웃 완전 중복          → backlog (표시 정책 사안, 데이터는 정확)
  개선 ③  데스크톱 카드·provenance 여백      → backlog (CSS)
Stop-1F targeted audit      CLOSED    개선 ① 종결
  title split  29→8 · 22→9 · 56→9
  desc  split  55→8 · 48→9 · 82→9
  자연스러움 ACCEPTABLE · 공식 EN명 7/7 원문 보존 · KO/본문/SEO 불변
```

## 8. Stage 1 CLOSED 근거

구현 완료 · 로컬 QA 완료 · 사용자 visual 승인 · commit·push 완료 · Production 배포 완료 ·
라이브 QA 완료 · latest 정렬 완료 · post-launch audit 완료 · 발견된 개선 ① 수정 완료 ·
표적 재감사 CLOSED · **필수 수정 0 · BLOCK 0 · Production 추가 수정 필요 없음.**

> **CLOSED는 "향후 개선이 전부 끝났다"는 뜻이 아니다.**
> 아래 backlog와 Search Console 후속 감사는 별도로 살아 있다.

## 9. 남은 backlog (미해결 — 이번 라운드에서 해결하지 않음)

1. **01008 카드 간 prev/next 완전 중복** — 두 카드의 이전·다음이 `광화문역 → 서대문역사거리`로
   동일(seq 33 vs 9만 다름). 데이터는 정확하므로 표시 정책 변경 사안이며 정책 승인 필요.
   V3 26개 재심사 설계와 함께 다루는 편이 낫다
2. **데스크톱 카드·provenance 여백** — 1280px에서 라벨↔값 이격, 밀도 저하 (CSS 수준)
3. **tap target 44px(AAA)** — Phase 1C backlog와 통합
4. **Phase 1C 기존 backlog 3건** — EN 라벨 반복 축약 · summary 문구 · 칩 tap
5. **Search Console 후속 감사** (아래 §10)

## 10. Search Console 후속 감사 (예약 — 배포 후 약 2~3주)

확인 항목: index coverage · 14 URL 실제 색인 여부 · impressions · duplicate/canonical 신호 ·
방향쌍 페이지에 대한 검색엔진 처리 · route→stop discovery · crawl activity.

**현재 시점에서는 판정하지 않는다.** Stop-1F의 CLOSED는 *문자 기준 prefix 구분이 해소됐다*는
판정이며, "Google이 두 페이지를 다르게 취급한다"는 확인이 아니다.

## 11. Stage 2 = 미결정

Stage 1 결과는 Stage 2 판단의 **입력일 뿐**이다. 본 문서는 다음을 하지 않는다:
V3 26개 승인 · Stage 2 수량 확정 · 다음 Stop URL 선정 · 구현 지시.
Stage 2는 별도 사용자 결정 게이트다 (정책 §11: 자동 진행 금지, Stage 2 미승인 유지).

Stage 2 판단에 제공되는 근거: 방향 차별 장치(ARS + 노선별 next-stop union)가 라이브 실데이터로
작동함이 확인됐다(ATF 6쌍 전부 DISTINCT, next 교집합 0). 다만 확대 시 방향쌍 유사도
(core cosine 0.95+)와 카드 중복이 페이지 수에 비례해 누적될 수 있다.

## 12. AdSense

Stage 1이 Production에 반영됐다는 사실만 기록한다.
**재신청 금지 상태는 그대로 유지**되며, 재신청 시점·승인 가능성은 이 문서에서 판단하지 않는다.
기존 상위 정책을 덮어쓰지 않는다.

## 13. 향후 조사 후보 (Stage 1에 포함되지 않음)

아래는 **향후 별도 조사 후보**일 뿐이며, 가용성·구현 가능성·정확성은 아직 확정하지 않았다.

1. 서울시 실시간 교통 API READ-ONLY 조사
2. 정류장별 실시간 버스 도착시간
3. 차량 위치 지도 표시

현행 아키텍처는 STATIC-FIRST이고 "실시간 데이터처럼 보이는 표현 금지"가 잠금 계약이므로,
이 후보들은 조사 라운드를 거쳐 별도 승인된 뒤에야 설계 대상이 된다.
