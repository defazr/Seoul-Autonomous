# Codex read-only 감사 — R3a §12 V4 피드백 · V5 노선도 액자 · V6 신뢰층 · V7 성능 (2026-10-16)

실행: `codex exec --sandbox read-only` · 프롬프트 범위는 R3A 문서 §12.8 참조. 아래는 Codex 원문. CC 처리: FIX 2건 반영(useTouchZoom ref 갱신 → useLayoutEffect · Hook 의존성 경고 4건 정리 → NightBusMap lint 0) · BLOCK 0.

요약 1/5 — 배포 차단급 문제는 발견하지 못했습니다.
요약 2/5 — 금지 데이터 3종은 무수정이며 외부 API 직접 호출·브랜드색·브랜드 로고·추정값 노출도 발견되지 않았습니다.
요약 3/5 — 역 카드 112개 역의 anchor/node·정류소·방면 조립은 누락과 중복 없이 일치했습니다.
요약 4/5 — V7 클라이언트 번역 provider 배치는 모두 충족했고, `messages={{}}`는 전체 메시지를 상속하지 않습니다.
요약 5/5 — TypeScript는 통과했고 ESLint 오류는 0개지만, 터치 ref 갱신에 작은 동작 회귀 가능성과 Hook 경고 4개가 남았습니다.

## BLOCK

없음.

## FIX

- 터치 이동 중 최신 `viewBox`를 읽는 ref가 커밋 직후 `useEffect` 실행 전까지 한 렌더 뒤처질 수 있습니다. 연속 `touchmove` 또는 모바일 breakpoint 전환 직후 이벤트가 그 틈에 들어오면 이전 `vb`/`baseVB`로 이동량을 계산할 가능성이 있습니다. 기존 렌더 중 ref 대입과 완전히 같은 동작이라고 보기는 어렵습니다. `useLayoutEffect` 또는 이벤트 시 최신 값을 보장하는 구조가 안전합니다. 근거: `web/app/[locale]/night-bus-map/NightBusMap.tsx:172-177`, `:194`, `:212`, `:228-231`.
- ESLint의 실제 코드 경고 4개를 정리하는 편이 맞습니다. 특히 터치 이벤트 effect의 `setVb`, `stageRef` 누락 의존성 경고는 위 ref 문제와 같은 영역입니다. 나머지는 `allDirectRoutes` 불안정 참조, 불필요한 `sel`, `isMobile` 의존성입니다. 근거: `web/app/[locale]/night-bus-map/NightBusMap.tsx:246`, `:714-752`, `:783`, `:828-834`.

## NOTE

- `SearchBox`의 렌더 중 파생 상태 갱신은 React가 허용하는 이전 props 비교 패턴이며, 선택 표시 결과는 기존 effect 방식과 동일했습니다. 근거: `web/app/[locale]/night-bus-map/NightBusMap.tsx:281-295`.
- `focusedDirect`와 `hiddenLegs` 리셋은 확인된 모든 `jFrom`/`jTo` 변경 경로에 포함됩니다: 헤더 검색, 역 선택, 카드 출발·도착 지정, 노선 토글, 전체 초기화. 근거: `web/app/[locale]/night-bus-map/NightBusMap.tsx:754-765`, `:1007`.
- RouteExplorer 정류장명은 네이티브 `button`이라 Enter/Space 키보드 동작을 제공하고 `aria-expanded`도 있습니다. 펼쳐진 지도 링크에는 모두 `target="_blank"`와 `rel="noopener noreferrer"`가 있습니다. 근거: `web/components/night-bus/RouteExplorer.tsx:63-69`.
- `npx tsc --noEmit` 자체는 read-only 환경에서 `tsconfig.tsbuildinfo` 기록을 시도해 EPERM으로 중단됐습니다. 동일 검사를 `npx tsc --noEmit --incremental false`로 다시 실행해 성공했습니다.
- ESLint에 CSS 파일도 전달했으나 설정상 CSS 6개는 “matching configuration 없음” 경고로 무시됐습니다. 코드·스크립트 파일은 오류 0개였습니다.
- “실시간”, “추정” 문자열은 신뢰 정책과 비실시간 고지 문맥에는 존재합니다. 실제 실시간처럼 보이는 상태 표현이나 추정 수치 노출은 찾지 못했습니다. 예: `web/messages/ko.json:258`, `:273-274`, `:297`, `:306`.
- `qa-links.mjs`는 로컬 실행 서버를 요구하므로 이번 정적 감사에서는 실행하지 않았습니다. 스크립트의 fetch 대상은 전달된 로컬 base URL과 그 sitemap 내부 링크뿐입니다. 근거: `web/scripts/qa-links.mjs:3-22`.

## 검증된 사실 (직접 확인한 것만 · 근거 포함)

- `git diff -- web/lib/night-bus-data.ts web/data/routes.json web/data/night-bus-routes.json` 결과는 비어 있었습니다.
- 감사 범위에서 `#FEE500`, `#03C75A` 사용은 0건이었고 카카오·네이버 로고 자산도 없었습니다. 지도는 텍스트 링크만 사용합니다. 근거: `web/lib/v2/map-links.ts:1-7`, `web/components/v2/ui/MapLinks.tsx:4-10`.
- 브라우저에서 외부 교통 API를 직접 호출하는 신규 코드는 없었습니다. 검색 UI 데이터는 내부 URL을 fetch하고, 허브 도착 정보도 `/api/arrivals/...`만 호출합니다. 외부 URL은 지도 링크 및 OpenFreeMap 타일 style입니다.
- anchors의 112개 사용 역 이름은 모두 `NODES` 키와 일치했습니다. 정류소 참조 누락 0건, `(노선, 방면, ARS)` 중복 0건이었습니다. 생성되는 `stationStops` JSON은 33,667바이트였습니다. 조립 코드: `web/app/[locale]/night-bus-map/page.tsx:204-224`.
- 방면은 `core.mjs`와 동일하게 `out = ends[1]`, `in = ends[0]`입니다. 페이지도 해당 `route.dirs`의 `toward`를 그대로 전달합니다. 근거: `web/lib/night-bus/core.mjs:32-37`, `web/app/[locale]/night-bus-map/page.tsx:211-219`.
- 데이터 원본의 올빼미버스 비가상 정류장 합계는 신규 글 주장과 같은 2,078개였습니다. 근거 주장: `web/data/updates/site-rebirth-night-bus-first.ts:21-22`.
- 신규 업데이트 글은 `UpdateEntry` 필수 필드를 모두 충족합니다. `generateStaticParams`는 `customRender`가 없는 이 글을 ko/en 모두 생성합니다. 목록은 `date` 내림차순으로 정렬됩니다. 근거: `web/lib/types/update.ts:12-34`, `web/app/[locale]/updates/[slug]/page.tsx:15-25`, `web/data/updates/index.ts:8-14`.
- hubs 페이지의 `hub` 변수는 `getHub(slug)`로 선언된 뒤 존재 검사를 거칩니다. mailto 제목은 `encodeURIComponent`로 인코딩됩니다. 근거: `web/app/[locale]/hubs/[slug]/page.tsx:36`, `:105`.
- about의 mailto 제목도 번역 문자열 전체를 `encodeURIComponent`로 인코딩합니다. 근거: `web/app/[locale]/about/page.tsx:74`, `:107`.
- 정류소 데이터셋은 실제 `_meta`의 OA-1095 “서울시버스노선별정류소정보”, 스냅샷 `2026-09-02`, 공공누리 제1유형과 일치합니다. 운행표는 `2026-03-20` 개정, 페이지 저작물 공공누리 제4유형으로 표시됩니다. 주입 위치: `web/app/[locale]/data-source/page.tsx:59-65`.
- `getLatestVerifiedDate()` 결과는 `routes.json`의 검증 대상 11개 노선 중 최댓값인 `2026-05-01`이었습니다. 구현 근거: `web/lib/routes.ts:51-57`.
- 요청된 ko/en 번역 하위 집합은 양쪽 모두 104개 leaf key로 동일했고, ICU parser 오류는 0건이었습니다.
- 삭제된 기존 `about.purpose`, `about.dataPolicy`, `about.verification`, `dataSource.sources` 키에 대한 코드 참조는 발견되지 않았습니다.
- `useTranslations`를 쓰는 클라이언트 파일은 총 7개였습니다. 홈의 5개는 `nightHome`, RoutesList는 `routes`, ArrivalCard는 `stopDetail` provider 아래에 있습니다. 서버 컴포넌트인 `StopServiceHours`의 `useTranslations`는 client provider와 무관합니다. 근거: `web/app/[locale]/page.tsx:55-57`, `web/app/[locale]/routes/page.tsx:38-40`, `web/app/[locale]/stops/[slug]/page.tsx:260-268`.
- next-intl 4 소스는 `messages === undefined`일 때만 request config의 전체 메시지를 읽습니다. `{}`는 그대로 client provider에 전달됩니다. 근거: `web/node_modules/next-intl/dist/esm/development/react-server/NextIntlClientProviderServer.js:21-24`, `web/node_modules/next-intl/dist/esm/development/shared/NextIntlClientProvider.js:5-15`.
- ESLint 결과는 오류 0개, 코드 경고 4개, CSS 무시 경고 6개였습니다. `npx tsc --noEmit --incremental false`는 종료 코드 0이었습니다.