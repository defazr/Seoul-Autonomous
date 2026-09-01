# RT-2 Implementation Preflight (READ-ONLY)

> **목적**: v2 설계가 현재 코드에 **그대로 들어갈 수 있는지 충돌만 확인**한다. 새 설계를 만들지 않는다.
> **판정**: **CONDITIONAL — 코드 충돌 0 · 운영 BLOCK 1건**
> **변경**: 코드 0 · dependency 0 · Production 0 · commit 0 · push 0 · API 호출 0
> **작성**: 2026-09-01 · 좌표 HEAD `7fc1532` (ahead 2) 불변
>
> ---
> **STATUS — Resolved after RT-2 KO 01009 Production deployment (2026-09-01).**
> 이 문서는 **preflight 시점의 판단을 그대로 보존**한다. 당시의 BLOCK 은 지우지 않으며,
> 해소 결과를 `Resolved after …` 로 연결한다.
> 최종 판정 `RT-2 KO 01009 = CLOSED / Production Live Approved`.
> 배포 기록 `RT2-PRODUCTION-DEPLOYMENT-20260901.md` · 감사 `RT2-POST-LAUNCH-AUDIT-20260901.md`.

---

## 0. 결론

| 항목 | 결과 |
|---|---|
| v2 설계 ↔ 현재 코드 충돌 | **0** |
| 정적 운행시간 재사용 | **가능 — 이미 필요한 데이터가 스코프 안에 있다** |
| Route Handler 관례 | **전례 0** (첫 사례가 된다) |
| 클라이언트 network fetch 관례 | **전례 0** (첫 사례가 된다) |
| middleware `/api` 간섭 | **없음** |
| CSP / connect-src | Next 레벨 **없음** · **Caddy 레벨 미확인** |
| Production 토폴로지 | **단일 컨테이너 · 단일 프로세스** → process-local 캐시 오늘은 사실상 global |
| **🔴 BLOCK** | **컨테이너에 ServiceKey를 주입할 경로가 현재 없다** |

---

## 1. Stop 페이지 render 경로

```
web/app/[locale]/stops/[slug]/page.tsx        376줄 · Server Component · SSG
  generateStaticParams()      → APPROVED_STOPS 7개 × locale 2 = 14
  generateMetadata()          → title/description (Stop-1F 어순 계약)
  StopDetailPage()            → 렌더
    buildStopPageData(stopId) → transitGraph 조회 + getRouteById()
```

`page.module.css` 1개. **관련 파일은 이 2개가 전부**다.

---

## 2. ArrivalCard 최소 삽입점

현재 렌더 순서 (page.tsx 실측 행 번호):

```
247  <div className={styles.hero}>          공식명·ARS·다음 정류장 union
267  <section> 경유 노선 + 구조 역할 문장
293  <section> 노선별 위치 카드 (map)
331  <section> provenance
```

**삽입점 = 265행 부근** (hero `</div>` 직후, 267행 `<section>` 직전). 단일 지점 삽입이며
기존 JSX 구조를 재배치하지 않는다.

```jsx
</div>                              {/* hero 끝 — 247~265 */}

<ArrivalCard stopId={data.stopId} />   {/* ← 신규 Client Component */}
<StopServiceHours cards={data.cards} /> {/* ← 신규 정적 base layer */}

<section aria-labelledby="stop-routes-title">   {/* 기존 267행 */}
```

**SSG 영향 0** — 서버 컴포넌트는 `await fetch(실시간)`을 하지 않으므로
`generateStaticParams` 프리렌더가 그대로 유지된다(§2-1 계약 충족).

---

## 3. 정적 운행시간 SSOT 재사용 — **문제 없음** ✅

### 3-1. 이미 스코프 안에 있다

`buildStopPageData()`가 이미 각 방문 노선에 대해 `getRouteById(visit.routeId)`를 호출하고
`route` 객체를 손에 쥐고 있다(page.tsx 내부, 실측 확인).

```ts
const route = getRouteById(visit.routeId);   // ← 이미 존재
// route.firstBus / lastBus / headway / daysOfOperation / verificationLevel 전부 접근 가능
```

→ **새 데이터 모델·새 SSOT·새 파생 레이어가 필요 없다.** `StopRouteCard` 타입에 필드 몇 개를
추가하는 것으로 끝난다. `web/data/routes.json` **무수정** 계약도 지켜진다.

```ts
type StopRouteCard = {
  routeId, routeName, seq, total,
  previousStopId, previousNameKo, nextStopId, nextNameKo, lastChecked,
  // ↓ 추가 후보 (Route 수준 값임이 타입 주석에 드러나야 함)
  routeFirstBus, routeLastBus, routeDaysOfOperation, routeVerificationLevel
};
```

**필드명에 `route` 접두를 붙이는 것을 권한다** — 코드를 읽는 사람이 "Stop의 첫차"로 오해하지 않게 하는
1차 방어선이다(설계 §3-2의 표현 제한을 타입 레벨에서 보조).

### 3-2. 기존 렌더 관례

Route 상세 페이지에 `formatHours(first, last)` 헬퍼가 있으나 **`routes/[id]/page.tsx` 내부 로컬 함수**다
(공유 lib 아님). Stop 페이지에서 쓰려면 **공유 위치로 올리거나 별도 표기를 만들어야** 한다.

⚠️ **주의**: Route 페이지의 `formatHours` 결과를 그대로 Stop 페이지에 쓰면 **문맥이 사라진다.**
설계 §3-2가 요구하는 "노선 운행 기준"임이 드러나는 문구는 **별도 i18n 키**로 새로 만들어야 한다.
기존 `routeDetail.info.hours` 재사용은 부적절하다.

### 3-3. 잠금 계약 승계

`verificationLevel`이 카드에 함께 오므로 기존 계약 —
*"운영정보는 `official_confirmed` + `confirmed` 조합만 화면 표시"*, *"`reverification_required`에서 금액 표시 금지"* —
을 Stop 페이지에서도 동일하게 적용할 수 있다. **새 예외를 만들 필요가 없다.**

---

## 4. Route Handler — 전례 0, 그러나 장애물도 0

```
web/app/api/          존재하지 않음 (신규 생성)
route.ts 파일          프로젝트 전체 0건
```

**middleware 간섭 없음** (실측):

```ts
// web/middleware.ts
export const config = { matcher: ['/', '/(en|ko)/:path*'] };
```

`/api/arrivals/…`는 matcher에 걸리지 않는다 → **locale prefix 리다이렉트가 발생하지 않는다.**
`/api` 경로를 별도로 제외할 필요도 없다.

**`output: 'standalone'`과의 관계**: Route Handler는 standalone 번들에 포함되며 동적으로 실행된다.
다른 페이지의 SSG에 영향을 주지 않는다.

---

## 5. server-only env — 관례는 있으나 **주입 경로가 없다** 🔴

### 5-1. 기존 관례

```
web/scripts/collect-stop-names.mjs
  process.env.SEOUL_OPENAPI_KEY  ← Node 스크립트에서만 사용 (빌드 타임/수동 실행)
  web/.env.local 에서 읽음 · .gitignore 처리됨 (web/.gitignore:34)
```

`NEXT_PUBLIC_` 접두 변수는 **0건** — 클라이언트 노출 관례가 없다는 점은 좋은 신호다.

### 5-2. 🔴 BLOCK — 런타임 컨테이너에 키가 들어갈 길이 없다

> ✅ **Resolved after 2026-09-01**: `/etc/seoul-autonomous/secrets/realtime.env`
> (`root:root 600`, 상위 `secrets/` 는 `root:root 700`)를 생성하고 `docker run --env-file` 로 주입했다.
> 키 값은 사용자가 SSH 터미널 hidden input 으로 직접 입력했으며 CC 는 값을 확인하지 않았다.
> 이미지 bake 는 하지 않았다(`Config.Env` 에 `NODE_ENV` 만 존재).
> **rollback 계약**: pre-RT2 이미지는 legacy `docker run` 유지(`--env-file` 강제 금지),
> RT2-capable 이미지부터 secret preflight + `--env-file`.

현재 Production 실행 (배포 계약 실측):

```
docker run --network apps-newsforgreens_default --restart unless-stopped \
           -e NODE_ENV=production --hostname 0.0.0.0 …  seoul_autonomous_web
```

**`-e` 로 전달되는 것은 `NODE_ENV` 하나뿐이다.**

- `web/.env.local`은 **빌드 컨텍스트에 없고**(gitignore), 이미지에도 들어가지 않는다 — 들어가면 안 된다
- 따라서 **현재 배포 방식으로는 Route Handler가 런타임에 ServiceKey를 얻을 수 없다**
- 로컬 `next dev`/`node .next/standalone/server.js`에서는 `.env.local`로 동작하므로 **pilot QA는 가능**하다

→ **이것은 코드 충돌이 아니라 운영 충돌이다.** 배포 시 `docker run`에 `-e BUS_API_SERVICE_KEY=…`를
추가해야 하며, 이는 **배포 안전 계약의 실행 명령 변경**이다. **별도 승인 사항**이다.

**추측으로 처리하지 않고 BLOCK으로 올린다.** 이미지에 키를 굽는 방식(`ARG`/`ENV`)은
**절대 채택하면 안 된다** — 이미지 레이어에 영구 기록되고 rollback 태그 13개에 전부 남는다.

---

## 6. CSP / 네트워크 제약

> ✅ **Resolved after 2026-09-01**: Production 컨테이너 **내부에서** egress 를 실측했다.
> `DNS=PASS 175.193.202.140` · `TCP80=PASS` · `HTTP=PASS status=302`.
> 이후 candidate 와 Production 에서 실제 `ws.bus.go.kr` 호출이 200 으로 성공했다.

| 레벨 | 결과 |
|---|---|
| `next.config.ts` | `headers()` **미설정** · `output: 'standalone'` · turbopack root만 |
| middleware | locale 처리만, 헤더 조작 없음 |
| **Caddy (서버)** | **미확인** — SSH 필요, 이번 라운드 범위 밖 |

**서버 → upstream 호출은 CSP의 대상이 아니다**(CSP는 브라우저 정책). 따라서 Route Handler가
`ws.bus.go.kr`을 부르는 것은 CSP와 무관하다.

다만 **아웃바운드 방화벽·egress 제한**이 서버에 있다면 막힐 수 있다. Caddy는 리버스 프록시라
egress를 막지는 않지만, **컨테이너 네트워크(`apps-newsforgreens_default`)의 외부 http(80) 아웃바운드**는
pilot 배포 전에 실측이 필요하다. (RT-1 호출은 전부 **로컬 맥**에서 나갔고 **서버에서 나간 적이 없다.**)

> ⚠️ 이건 코드가 아니라 **런타임 환경 검증** 항목이다. §5 BLOCK과 함께 배포 게이트에서 확인해야 한다.

---

## 7. logging / error utility

```
전용 logger 없음. lib/ 아래 로깅 유틸 0건.
lib/seo/{config,jsonld,metadata}.ts · lib/types/*.ts 만 존재.
```

→ **재사용할 기존 유틸이 없다.** 설계 §5-4의 "서버 이상징후 기록"은 v1에서
**`console.warn`/`console.error` + 구조화된 prefix**로 시작하는 것이 관례에 맞다
(`docker logs seoul_autonomous_web`로 확인 가능). **신규 로깅 dependency 도입 금지.**

---

## 8. 클라이언트 컴포넌트 관례

```
'use client' 전례      9개 파일 (LangToggle · SegmentedControl · FAQItem ·
                       BackToTopButton · RoutesList · MobileDrawer ·
                       HowToRideClient · design-preview · NightBusMap)
클라이언트 network fetch  0건 ← 위 9개 전부 fetch( 0회. useEffect 는 UI 상태 전용
```

→ **`ArrivalCard`가 이 프로젝트 최초의 "클라이언트에서 네트워크를 부르는 컴포넌트"가 된다.**
설계상 문제는 없으나, **로딩/에러/취소 패턴의 사내 전례가 없다**는 뜻이므로
pilot에서 그 패턴 자체가 리뷰 대상이다.

---

## 9. QA 관례

```
package.json scripts   dev · build · start · lint   (테스트 러너 없음)
QA 방식                web/scripts/*.mjs 자체 검증 스크립트
                       validate-graph.mjs (21항 자동 대조, 불일치 시 exit 1)
                       validate-stop-names.mjs · test-stop-names.mjs
dependencies           @next/third-parties · next · next-intl · react · react-dom  (5개)
```

→ **기존 관례 = "검증 스크립트 + 로컬 standalone 실행 + 시각 확인"**이다. RT-2도 같은 방식을 따른다.
**테스트 러너 도입은 dependency 추가이므로 금지.**

---

## 10. 01009 pilot 최소 변경 파일 목록

| # | 파일 | 성격 | 변경 |
|---|---|---|---|
| 1 | `web/app/api/arrivals/[stopId]/route.ts` | **신규** | 프록시 · 캐시 · single-flight · budget |
| 2 | `web/lib/realtime/arrival-registry.ts` | **신규** | busRouteId 11개 리터럴 + kind 분류 |
| 3 | `web/components/stop/ArrivalCard.tsx` | **신규** | Client Component (A/B/C/D 상태) |
| 4 | `web/components/stop/ArrivalCard.module.css` | **신규** | 스타일 |
| 5 | `web/components/stop/StopServiceHours.tsx` | **신규** | 정적 base layer |
| 6 | `web/components/stop/StopServiceHours.module.css` | **신규** | 스타일 |
| 7 | `web/app/[locale]/stops/[slug]/page.tsx` | **수정** | 삽입 2줄 + `StopRouteCard` 필드 4개 |
| 8 | `web/messages/ko.json` | **수정** | `stopDetail.realtime.*` · `stopDetail.serviceHours.*` 키 추가 |
| 9 | `web/messages/en.json` | **수정** | 동일 키 (EN 렌더는 게이트 전이므로 **정적 안내·상태 문구만**) |

**신규 6 · 수정 3.** `web/data/routes.json` 무수정 · `night-bus-data.ts` 무접촉 ·
`stop-pages.ts` 무수정 · 노선 선 기하 무접촉.

> `messages/en.json`에 키를 추가하는 것은 **EN Localization Gate 위반이 아니다.**
> 게이트가 막는 것은 **arrmsg 구조화 렌더**이지, "실시간 정보를 불러오지 못했습니다" 같은
> 상태 문구나 정적 운행 안내 라벨이 아니다. 다만 **arrmsg 원문은 EN에서도 원문 그대로** 두어야 한다.
> → 이 구분은 구현 지시서에서 명시적으로 확인받는 것이 좋다(§12 미결).

---

## 11. QA 계획 — D 3경로를 upstream 호출 없이 재현

포그린 지시대로 **실제 잘못된 ServiceKey를 서울시에 보내지 않는다.** 어댑터 경계에서 주입한다.

### 11-1. 경계 설계

Route Handler 안에 **upstream adapter를 함수 하나로 분리**하고, 그 함수만 테스트 시 대체한다.

```
fetchUpstream(arsId) → { ok, xml } | { error: REASON }
```

`REASON ∈ { AUTH_ERROR, UPSTREAM_QUOTA, TIMEOUT, APP_BUDGET_EXHAUSTED, UPSTREAM_ERROR }`

### 11-2. D 3경로

| 경로 | 재현 방법 | upstream 호출 |
|---|---|---|
| **invalid-auth** | 서울시가 반환하는 **인증 오류 XML을 fixture로 저장**해 어댑터가 그 문자열을 반환하도록 env 플래그로 전환 (`RT2_FAKE_UPSTREAM=auth`) | **0회** |
| **timeout** | 어댑터에서 `AbortController`를 즉시 abort (`RT2_FAKE_UPSTREAM=timeout`) | **0회** |
| **budget=0** | budget 상수를 0으로 설정 → adapter 도달 전 차단 | **0회** |

기존 `collect-stop-names.mjs`의 `STOP_NAMES_INJECT_FAILURE` env 관례와 **같은 패턴**이다(실측 확인).
새로운 방식이 아니라 **프로젝트에 이미 있는 관례를 따르는 것**이다.

⚠️ **주의**: 이 주입 플래그는 **개발 전용**이어야 하고, `NODE_ENV=production`에서는
**무시되도록 하드 가드**를 넣어야 한다. 아니면 Production에서 실시간을 끌 수 있는 백도어가 된다.

### 11-3. 전체 QA 매트릭스

| # | 케이스 | 재현 | upstream |
|---|---|---|---|
| 1 | **B** 의미 있는 arrival | 야간 실행 **또는** fixture(RT-1 실측 XML 보존) | 1 또는 0 |
| 2 | **C** 전부 운행종료 | 주간 실호출 (자연 발생) | 1 |
| 3 | **partial** ended + active 혼합 | RT-1 야간 A741 응답 fixture | 0 |
| 4 | **0-route** 승인 노선 0개 | 필터 레지스트리를 빈 배열로 (테스트 전용) | 0 |
| 5 | **cache hit** | 연속 2회 요청 → `fetchedAt` 동일 확인 | 1 |
| 6 | **TTL expiry** | 21초 대기 후 재요청 → `fetchedAt` 변경 | 2 |
| 7 | **single-flight** | 동시 5요청 → upstream 카운터 **+1만** | 1 |
| 8 | **stale 5분** | `fetchedAt` 조작 또는 5분 대기 → stale 표시 | 0 |
| 9 | **manual refresh** | 버튼 클릭 → 재요청, TTL 내면 동일값(정상) | 0~1 |
| 10 | **D-1 invalid-auth** | fixture 주입 | **0** |
| 11 | **D-2 timeout** | abort 주입 | **0** |
| 12 | **D-3 budget=0** | 상수 0 | **0** |
| 13 | **key leakage 0** | 빌드 산출물·HTML·JS 번들 전문 grep | 0 |
| 14 | **CLS (01009)** | Lighthouse / PerformanceObserver 실측 | 0 |
| 15 | **static shell 독립** | D 상태에서 정적 콘텐츠 100% 정상 | 0 |

**총 upstream 호출 ≈ 5회** (budget 300 대비 1.7%).

### 11-4. 회귀 확인 (기존 계약)

```
sitemap 69 불변 · canonical 불변 · JSON-LD 불변 · metadata 불변 (Stop-1F 어순 포함)
방향쌍 차별성 유지 · lint baseline 5err/27warn 회귀 0
node scripts/validate-graph.mjs 21항 PASS
정적 운행 안내가 Stop-specific 첫/막차로 읽히지 않는지 (설계 §3-2)
```

---

## 12. 미결 — 구현 지시서에서 확정 필요

| # | 항목 | CC 의견 |
|---|---|---|
| **1** | ✅ **해소** — 컨테이너 ServiceKey 주입 (§5-2) | `--env-file /etc/seoul-autonomous/secrets/realtime.env` 로 확정. 이미지 bake 0 |
| **2** | ✅ **해소** — 서버 아웃바운드 http(80) (§6) | 컨테이너 내부 실측 3/3 PASS |
| 3 | ✅ **결정** — `messages/en.json` (§10) | 키는 추가하되 **EN 렌더는 0**. pilot gate 가 `isKo && stopId === '01009'` 이므로 EN 페이지에 아무것도 나타나지 않음을 live 에서 확인. **"EN unchanged" 의 이번 gate 의미 = 렌더/UI 동작 무변경**(source 는 키 추가로 변경됨) |
| 4 | ✅ **결정** — `formatHours` | **별도 표기 신설**. `stopDetail.serviceHours.*` i18n 키를 새로 만들었다 |
| 5 | ✅ **구현·검증됨** — fixture production 가드 | `NODE_ENV === 'production'` 에서 fail-closed. standalone 에 `RT2_FAKE_UPSTREAM=b` 를 넣어도 fake·실호출 **둘 다 하지 않고** `CONFIG_ERROR` 반환함을 실측 |

---

## CC 이견 및 아이디어

### ① 300 / day budget에 대한 의견

**적절하다. 오히려 넉넉한 편이다.**

pilot QA 총 upstream 호출이 **약 5회**로 추정되고(§11-3), 실사용에서도:
- 자동 polling 없음 → **페이지뷰당 최대 1회**
- TTL 20초 → 같은 Stop 20초 내 재방문은 0회
- Stop 7개가 각각 다른 캐시 키

→ 300회는 **하루 300 PV 수준의 실시간 조회**를 감당한다. 현재 사이트 트래픽 규모를 생각하면
여유가 크고, **공용 키의 나머지 70%를 다른 서비스에 남겨두는 것**이 이 수치의 진짜 목적이다.

**다만 한 가지 짚는다**: 300은 **상한이지 목표가 아니다.** 300에 근접하기 시작하면
그건 "성공"이 아니라 **캐시가 제대로 안 듣고 있다는 신호**일 가능성이 높다.
→ **소진률을 로그로 남겨** 나중에 판단 근거로 쓸 것을 권한다.

### ② process-local counter의 한계

**"global hard quota guarantee가 아니다"는 표현이 정확하다.** 실측으로 보강하면:

```
현재 Production   컨테이너 seoul_autonomous_web 1개 · docker run 수동 · replicas 없음
→ 오늘 기준       process-local = 사실상 global
```

**즉 오늘은 문제가 없다.** 위험은 두 가지 경로로만 온다:

1. **재배포 시 counter 리셋** — 배포는 하루 1~2회 수준이고 중단이 0.2초대이므로,
   최악의 경우 하루 budget이 **2~3배**로 늘어날 수 있다. 300 × 3 = 900 < 1,000이라
   **현재 수치에서는 아슬아슬하게 안전**하다. budget을 올리면 이 여유가 사라진다.
2. **인스턴스 증설** — 인스턴스 N개면 실질 상한이 300 × N이 된다. **배포 토폴로지 변경 시
   반드시 재검토**해야 하며, 이를 배포 안전 계약에 연결해두는 것을 권한다.

→ **counter 리셋 배수까지 고려하면 300이 잘 잡힌 수치**다. 이건 우연이 아니라
1,000의 30%라는 선택이 만들어낸 여유다.

### ③ 최소 변경 파일에 대한 의견

**9개(신규 6 · 수정 3)는 pilot 치고 작지 않다.** 다만 줄일 여지는 거의 없다:
- CSS Module 2개는 프로젝트 관례상 필수(전역 스타일 금지)
- 레지스트리를 별도 파일로 빼는 것은 `stop-pages.ts` 패턴 승계이며 **합칠 이유가 없다**
- `page.tsx` 수정이 **삽입 2줄 + 타입 필드 4개**로 끝나는 것이 중요하다 — 기존 렌더 로직 무손상

**가장 위험한 파일은 `page.tsx`**다. 여기에 sitemap·canonical·JSON-LD·metadata가 전부 걸려 있다.
→ **이 파일의 diff를 최소로 유지하는 것이 pilot 성공의 핵심**이며, QA에서 이 4가지를 반드시 재확인해야 한다.

### ④ 기존 코드와 v2 설계의 충돌 여부

**코드 레벨 충돌 0건이다.** 오히려 예상보다 잘 맞는다:

1. **정적 운행시간이 이미 스코프 안에 있다**(§3-1). 새 SSOT·새 파생 레이어가 불필요하다.
   이건 설계 §3을 쓸 때 제가 확신하지 못했던 부분인데, 실제 코드가 더 유리했다.
2. **middleware가 `/api`를 안 건드린다**(§4). locale prefix 문제를 걱정했는데 실측으로 해소됐다.
3. **`STOP_NAMES_INJECT_FAILURE` 관례가 이미 있다**(§11-2). D 3경로 주입이 새 발명이 아니라
   **프로젝트에 있는 패턴의 재사용**이 된다.

**진짜 충돌은 코드가 아니라 운영에 있었다** — §5-2의 ServiceKey 주입 경로 부재.
설계 문서에서는 "ServiceKey는 서버에만"이라고만 썼지, **그 서버에 어떻게 들어가는지**는 다루지 않았다.
이건 제 설계의 공백이었고, preflight의 가장 큰 수확이다.

### ⑤ 추가로 짚는 리스크

- **RT-1의 모든 호출은 로컬 맥에서 나갔다. 서버에서 나간 적이 없다.**
  Vultr 컨테이너의 외부 http(80) 아웃바운드가 가능한지는 **완전히 미검증**이다(§6).
  코드가 완벽해도 여기서 막히면 pilot이 서버에서 안 돈다. **배포 게이트에서 최우선 확인 항목**이다.
- **이 프로젝트 최초의 클라이언트 network fetch**가 된다(§8). 로딩·에러·취소 패턴의 전례가 없으므로
  pilot 리뷰에서 **패턴 자체**를 봐야 한다.
- **fixture 주입 플래그의 production 가드**(§11-2)를 빼먹으면 Production에서 실시간을 끌 수 있는
  백도어가 생긴다. 구현 시 최우선 체크 항목이다.

### ⑥ 이견 없음 아님

**§5-2는 BLOCK이다.** 코드는 지금 당장 쓸 수 있지만, **서버에 배포하려면 배포 명령이 바뀐다.**
pilot을 로컬까지만 할 것인지, 배포까지 갈 것인지에 따라 이 BLOCK의 시급도가 달라진다.
→ **로컬 pilot은 지금 바로 가능하다**(`.env.local`로 동작). 배포는 별도 승인 사항이다.
