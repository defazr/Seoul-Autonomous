요약  
BLOCK 1건: EN 홈의 노선 칩이 존재하지 않는 EN 전용 URL로 연결됩니다.  
FIX 3건: i18n 전체 키 불일치, 다크 테마에서 사라지는 경계선, 대량의 죽은 CSS가 남았습니다.  
금지 데이터 3종과 metadata·canonical·OG·JSON-LD의 의미 변경은 발견하지 못했습니다.  
삭제 모듈 참조, h1 중복, 헤더 중첩, 지도 링크 보안 속성 문제는 발견하지 못했습니다.

## BLOCK

- EN 홈의 빠른 노선·허브 카드 칩이 locale을 상속하여 `/en/night-bus/n15` 같은 404로 이동합니다. `RouteChip`은 locale을 받을 수도 없습니다.  
  근거: `web/app/[locale]/page.tsx:77`, `web/app/[locale]/page.tsx:92`, `web/components/v2/ui/Chip.tsx:5-12`

## FIX

- `routes/[id]`의 검은 반투명 경계선은 새 네이비 배경에서 사실상 사라집니다. `--line` 계열로 치환해야 합니다.  
  근거: `web/app/[locale]/routes/[id]/page.module.css:165`, `web/app/[locale]/routes/[id]/page.module.css:341`

- 전체 메시지 키 집합은 불일치합니다: ko에 `siteFooter.nightBusFare`, `siteFooter.afterLastTrain`, en에 `home.mapPromo.*`만 존재합니다. 단, 신규 `pages` 네임스페이스 자체는 ko/en 동일합니다.  
  근거: `web/messages/ko.json:306-307`, `web/messages/en.json:44-47`

- 재조판 후에도 옛 프레임 CSS가 대량 잔존합니다. `container·topBar·backBtn·heading·footer*`는 해당 TSX에서 더 이상 참조되지 않습니다.  
  근거: `web/app/[locale]/about/page.module.css:1-41`, `web/app/[locale]/how-to-ride/page.module.css:1-41`, `web/app/[locale]/privacy/page.module.css:1-53`

## NOTE

- 기존 `formatDate` 로직과 신규 Robotaxi 포맷 함수가 중복됩니다. 공통 formatter 후보입니다.  
  근거: `web/components/v2/transit/RobotaxiCard.tsx:7-8`, `web/app/[locale]/routes/[id]/page.tsx:71`

- 신규 범위에도 비-null·형 단언이 남았습니다: 공식 운행정보 `official!`, API JSON `as ClientDoc`, CSS 변수 단언 등입니다.  
  근거: `web/app/[locale]/page.tsx:43`, `web/components/v2/home/SearchContext.tsx:48`, `web/components/v2/ui/PageHero.tsx:9`

- `--color-fg-2 → --fg`, `--color-fg-3 → --fg-2`는 오히려 더 밝아져 대비 저하는 확인되지 않았습니다. `--fg-3`의 11–12px 보조문구는 육안 회귀가 필요해 결과는 미확인입니다.  
  근거: `web/styles/v2/tokens.css:22-24`, `web/components/v2/ui/ui.module.css:43`, `web/components/v2/transit/transit.module.css:23-24`

## 검증된 사실

- `night-bus-data.ts`, `routes.json`, `night-bus-routes.json`의 git diff는 비어 있습니다.

- 페이지 diff에서 metadata의 title·description·canonical·OG 및 JSON-LD 값 변경은 발견되지 않았습니다. 홈 JSON-LD는 위치와 조판만 변경됐습니다.  
  근거: `web/app/[locale]/page.tsx:28-30`, `web/app/[locale]/page.tsx:55`

- 삭제된 `common·ui·home·layout`, `lib/fonts`, `lib/design`, 옛 `SearchBar`, `globals.css`, `legacy-bridge.css`의 활성 참조는 발견되지 않았습니다. 주석 속 옛 경로 1건만 남았습니다.  
  근거: `web/components/route-detail/MapLinkButton.tsx:28`

- Crumbs는 next-intl `Link`를 사용하고 `nav`에 접근 가능한 이름이 있습니다. PageHero의 h1도 페이지당 한 번이며 셸 header와 중첩되지 않습니다.  
  근거: `web/components/v2/ui/Crumbs.tsx:1-15`, `web/components/v2/ui/PageHero.tsx:9-18`

- Section은 제목이 있을 때 `${id}-title`로 연결합니다. 정적 검사에서 동일 페이지의 Section id 충돌은 발견되지 않았습니다.  
  근거: `web/components/v2/ui/Section.tsx:9-18`

- 모바일 메뉴는 초기 포커스, Tab 순환, Escape 닫기, 트리거 포커스 복원을 구현합니다.  
  근거: `web/components/v2/shell/MobileMenu.tsx:35-54`

- 카카오 링크는 `/link/map/{인코딩된 이름},{lat},{lon}`, 네이버는 검색 URL입니다. 새 탭 링크에 `noopener noreferrer`가 있으며 로고는 사용하지 않습니다.  
  근거: `web/lib/v2/map-links.ts:5-7`, `web/components/v2/ui/MapLinks.tsx:8-9`

- `pages` 네임스페이스의 ko/en 키 집합은 동일하고 EN `pages`에서 한국어 문자열은 발견되지 않았습니다. ICU 런타임 파싱은 읽기 전용 감사에서 미확인입니다.