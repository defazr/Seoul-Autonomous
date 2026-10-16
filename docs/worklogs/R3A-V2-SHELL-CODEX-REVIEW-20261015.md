요약 5줄  
BLOCK 2건: 동일 허브 내 별칭 경로 오판, 모바일 메뉴의 불완전한 모달 포커스 처리.  
금지 데이터 3종은 git 기준 무수정이며, 신규 클라이언트의 네트워크 호출은 내부 정적 API 1곳뿐이다.  
`useNightStatus`의 SSR 초기값은 결정적이어서 직접적인 하이드레이션 불일치는 확인되지 않았다.  
i18n 키·ICU·rich 태그는 일치하지만 영어 탐색은 한국어 입력을 전제로 한다.  

## BLOCK

- 동일 복합 허브의 다른 이름(예: `종로2가`→`종각`)은 같은 방문 집합인데 문자열만 비교해 “같음”으로 처리하지 않아 허위 경로가 생길 수 있다.  
  근거: `web/lib/night-bus/client-model.ts:78-82`, `web/lib/night-bus/core.mjs:63-70`

- 모바일 dialog는 초기 포커스·포커스 트랩·닫은 뒤 트리거 복원이 없어 Tab으로 배경 페이지에 진입할 수 있다. Esc·스크롤 잠금·포털만 구현됐다.  
  근거: `web/components/v2/shell/MobileMenu.tsx:33-40`, `web/components/v2/shell/MobileMenu.tsx:44-66`

## FIX

- 콤보박스가 활성 옵션을 `aria-activedescendant`로 노출하지 않고 option에도 `id`가 없어 키보드 강조 상태를 보조기기가 알 수 없다.  
  근거: `web/components/v2/home/AskCard.tsx:39-45`, `web/components/v2/home/AskCard.tsx:64-70`, `web/components/v2/home/AskCard.tsx:83-94`

- 추천 선택이 `onMouseDown`에만 연결되어 터치·보조기기 click 활성화가 보장되지 않는다. `onClick` 기반 선택을 제공해야 한다.  
  근거: `web/components/v2/home/AskCard.tsx:66`

- 영어 허브명은 문서와 모델에 저장하지만 `suggest`·`resolveQuery`는 한국어 `name`만 검색한다. 영어 UI도 한국어 입력을 요구한다.  
  근거: `web/lib/night-bus/client-model.ts:30`, `web/lib/night-bus/client-model.ts:43-46`, `web/messages/en.json:562-566`

- `StatusLine` 전체가 `aria-live`이고 30초 타이머로 기준 시간이 계속 갱신돼 주기적 상태 낭독을 유발할 수 있다. 의미 있는 상태 변화만 알리는 편이 안전하다.  
  근거: `web/components/v2/night/StatusLine.tsx:22-24`, `web/components/v2/night/useNightStatus.ts:50-54`

- 허브 16개 각각에 30초 interval이 생기며 상태줄·지도·캡션까지 별도 timer를 가진다. 공용 KST clock/provider 하나로 합치는 것이 적절하다.  
  근거: `web/app/[locale]/page.tsx:58-66`, `web/app/[locale]/page.tsx:85-94`, `web/components/v2/home/HubCardActions.tsx:11-17`

- Hero SVG 본문을 데스크톱·모바일 두 벌로 그대로 렌더해 모든 path/node/text가 HTML에 중복된다. 단일 SVG의 반응형 viewBox 전략을 권장한다.  
  근거: `web/components/v2/home/HeroMap.tsx:26-38`

- locale 전체 messages를 최상위 클라이언트 provider에 전달해 모든 페이지 HTML/RSC에 직렬화한다. 필요한 네임스페이스만 하위 provider로 제한해야 한다.  
  근거: `web/app/[locale]/layout.tsx:29-38`

- `.v2-main footer`는 SiteFooter뿐 아니라 본문 안의 모든 의미론적 footer를 숨기는 과도한 전역 선택자다. 전용 클래스 또는 구형 footer 클래스만 대상으로 해야 한다.  
  근거: `web/styles/v2/legacy-bridge.css:17-19`

- 클라이언트 문서를 런타임 검증 없이 단언하고, `core.mjs` 반환값도 `unknown as Nb`로 우회한다. API 계약 변경 시 조용히 잘못되거나 런타임 실패한다.  
  근거: `web/lib/night-bus/client-model.ts:21-29`, `web/components/v2/home/SearchContext.tsx:46-50`

- 위치 성공 후 모델 로드 실패와 실제 위치 권한 거절을 모두 `denied`로 표시해 오류 원인을 잘못 안내한다.  
  근거: `web/components/v2/home/AskCard.tsx:54-59`

- `HUB_NODE`가 두 곳에 완전히 중복되어 향후 허브 추가 시 불일치 위험이 있다. 공용 `schematic.ts` 정의만 사용해야 한다.  
  근거: `web/lib/night-bus/schematic.ts:46-52`, `web/components/night-bus/HubSchematic.tsx:4-10`

- 번역 키 `ask.swap`, `ask.clear`, `stage.steps.alightTitle`은 ko/en 모두 정의됐지만 신규 컴포넌트에서 사용되지 않는다.  
  근거: `web/messages/ko.json:575-580`, `web/messages/ko.json:611`, `web/components/v2/home/AskCard.tsx:75-110`

## NOTE

- `useNightStatus`는 서버·클라이언트 첫 렌더 모두 `EMPTY`를 사용하고 시각·`window`·`Set` 계산은 effect 안에서 수행하므로 해당 훅의 hydration 경로는 안전하다.  
  근거: `web/components/v2/night/useNightStatus.ts:27-34`, `web/components/v2/night/useNightStatus.ts:40-55`

- `countStops`는 가상 정류소를 제외하며 core가 보장하는 진행 방향 인덱스에 사용된다. 직통·환승 두 leg의 합산도 계약과 일치한다.  
  근거: `web/lib/night-bus/core.mjs:78-92`, `web/lib/night-bus/client-model.ts:83-92`

- `nearestStop`은 가상 정류소를 제외하지만 동일 물리 정류소 중복 방문을 매번 순회한다. 정확성 문제는 없고 계산량만 중복된다.  
  근거: `web/lib/night-bus/client-model.ts:57-64`

- 현재 기존 페이지에서 확인된 `<footer>`는 `SiteFooter`이므로 bridge 규칙이 다른 footer를 실제로 숨기는 사례는 미확인이다.  
  근거: `web/components/common/SiteFooter.tsx:54`, `web/app/[locale]/routes/page.tsx:102`

- 실제 홈 전송 HTML 크기와 압축 후 절감치는 빌드 산출물을 만들 수 없는 read-only 환경이라 미확인이다. 원본 messages 크기는 ko 약 38KB, en 약 34KB다.  
  근거: `web/app/[locale]/layout.tsx:29-34`

## 검증된 사실

- `night-bus-data.ts`, `web/data/routes.json`, `web/data/night-bus-routes.json`은 `git status`와 `git diff` 모두 변경 없음이다.
- 신규 클라이언트의 `fetch`는 `/api/night-bus/client`만 사용하며 외부 API 직접 호출은 없다. 근거: `web/components/v2/home/SearchContext.tsx:42-50`
- 해당 API는 `force-static`이고 서버 SSoT에서 문서를 만든다. 근거: `web/app/api/night-bus/client/route.ts:4-8`
- ko/en의 `shell`·`nightHome` 키 집합은 동일하고 ICU parser 오류도 0건이며 `<b>` rich 사용처가 존재한다. 근거: `web/components/v2/night/StatusLine.tsx:15-24`
- 신규 감사 범위만 대상으로 한 ESLint는 오류·경고 없이 통과했다. 전체 저장소 lint는 기존 `NightBusMap.tsx` 오류로 실패했다.
- `git diff --check`는 공백 오류 없이 통과했다.