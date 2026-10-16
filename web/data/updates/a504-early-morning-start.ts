import type { UpdateEntry } from '../../lib/types/update';

// R3b-2 (2026-10-16) — 공지형("확인 필요" 목록) → 콘텐츠형 재작성. URL·게시일 유지, 수정일 추가.
// 근거: 서울시 보도자료 nttNo=456975(2026-04-27) · 내 손안에 서울 2017965(같은 날 · 노선별 운행 개요 표) ·
// 정차 순서 = routes.json(카카오맵 2026-05-01) · 올빼미 정류소 대조 = night-bus-routes.json(OA-1095 2026-09-02).
// 운행 요일·요금은 발표 시점 내용이며 routes.json 값은 바꾸지 않았다(포그린 지시 사항).
const entry: UpdateEntry = {
  slug: 'a504-early-morning-start',
  date: '2026-05-09',
  dateModified: '2026-10-16',
  eventDate: '2026-04-29',
  sourcePublishedAt: '2026-04-27',
  titleEn: 'Saebyeok A504 Early-morning Autonomous Bus: Geumcheon-gu Office to City Hall, Times, Stops and How to Ride',
  titleKo: '새벽동행 자율주행버스 A504 금천구청~시청역 운행시간 정류소 탑승방법',
  summaryEn:
    'Saebyeok A504 started on 29 April 2026: a 03:30 weekday departure from Geumcheon-gu Office, 32 express stops to City Hall, boarding rules, and the owl night-bus stops it shares.',
  summaryKo:
    '2026년 4월 29일 운행을 시작한 새벽동행 자율주행버스 A504의 노선, 평일 새벽 3시 30분 출발, 주요 정류소 32곳 급행 정차, 탑승 규칙, 올빼미버스와 같은 정류소를 정리했습니다.',
  relatedRouteIds: ['saebyeok-a504'],
  sourceUrl: 'https://www.seoul.go.kr/news/news_report.do?nttNo=456975',
  extraSources: [
    {
      url: 'https://mediahub.seoul.go.kr/archives/2017965',
      publishedAt: '2026-04-27',
      label: { ko: '내 손안에 서울 · 노선별 운행 개요 표', en: 'Seoul city news portal · route overview table' },
    },
  ],
  articleSections: [
    {
      heading: {
        ko: '금천구청~시청역 새벽 자율주행버스 A504',
        en: 'Saebyeok A504: Geumcheon-gu Office to City Hall',
      },
      paragraphs: {
        ko: [
          '서울시는 2026년 4월 29일부터 새벽동행 자율주행버스 A504를 운행하고 있습니다. 평일 새벽 3시 30분 금천구청을 출발해 신림역·노량진역·서울역을 거쳐 시청역까지 17.6km 구간을 한 번 왕복합니다.',
          'A504는 A160(2024년), A741(2026년 3월), A148(2026년 4월)에 이은 네 번째 새벽동행 노선입니다. 기존 504번 시내버스와 달리 금천구청~독산고개 구간도 지납니다.',
        ],
        en: [
          'Since 29 April 2026 Seoul has run the Saebyeok A504 autonomous bus. On weekdays it leaves Geumcheon-gu Office at 03:30 and runs via Sillim, Noryangjin and Seoul Station to City Hall Station, making one round trip over a 17.6 km route.',
          'A504 is the fourth Saebyeok route, after A160 (2024), A741 (March 2026) and A148 (April 2026). Unlike regular city bus 504, it also covers the Geumcheon-gu Office – Doksangogae section.',
        ],
      },
    },
    {
      heading: {
        ko: '주요 정류소 32곳만 서는 급행 정차',
        en: 'Express Pattern: 32 Main Stops Only',
      },
      paragraphs: {
        ko: [
          '모든 정류소에 서지 않고, 첫차 이용이 많은 주요 정류소 32곳에만 섭니다. 평소 504번을 타던 정류소라도 A504는 서지 않을 수 있습니다.',
          '이 사이트의 A504 노선 페이지에 카카오맵에서 확인한 정차 순서 32곳을 정리해 두었습니다. 서울시는 네이버·카카오 지도에서 ‘새벽 A504’ 또는 ‘A504’로 검색해 정차 위치를 미리 확인하라고 안내합니다.',
        ],
        en: [
          'It does not stop everywhere — only at the 32 main stops with the most first-bus riders. A stop you use for bus 504 may not be an A504 stop.',
          'Our A504 route page lists all 32 stops in order, as checked on Kakao Map. Seoul advises searching "새벽 A504" or "A504" in Naver or Kakao maps to confirm stop locations before you go.',
        ],
      },
      links: [{ href: '/routes/saebyeok-a504', label: { ko: 'A504 정류장 32곳 보기', en: 'See all 32 A504 stops' } }],
    },
    {
      heading: {
        ko: '평일 새벽 3시 30분 한 번 출발',
        en: 'One Departure: Weekdays at 03:30',
      },
      paragraphs: {
        ko: [
          'A504는 하루 한 번, 평일 새벽 3시 30분 금천구청에서 출발합니다. 서울시는 새벽동행 버스를 일반 시내버스 첫차보다 30분 일찍 출발하는 버스로 소개합니다.',
          '3시 30분은 기점 출발 시각입니다. 이번에 확인한 서울시 발표에는 정류소마다 버스가 지나는 시각이 없어, 이 사이트는 정류소 도착 시각을 계산해 보여 주지 않습니다.',
        ],
        en: [
          'A504 departs once a day, at 03:30 on weekdays from Geumcheon-gu Office. Seoul describes the Saebyeok buses as leaving 30 minutes before the regular first city buses.',
          '03:30 is the departure time at the starting stop. The Seoul announcements checked for this page do not list passing times for each stop, so this site does not estimate arrival times at stops.',
        ],
      },
    },
    {
      heading: {
        ko: '요금과 탑승 규칙',
        en: 'Fare and Boarding Rules',
      },
      paragraphs: {
        ko: ['서울시 개통 발표(2026년 4월 27일)에 담긴 탑승 조건입니다.'],
        en: ['Boarding conditions from Seoul’s launch announcement (27 April 2026):'],
      },
      bullets: {
        ko: [
          '서비스가 안정될 때까지 당분간 무료로 운행합니다.',
          '무료라도 타고 내릴 때 일반 시내버스처럼 교통카드를 태그합니다.',
          '안전을 위해 남은 좌석이 없으면 태우지 않습니다. 좌석은 31석입니다.',
          '빈자리는 정류소 안내 전광판(BIT)이나 버스 앞면 LED 좌석표시기로 확인합니다.',
        ],
        en: [
          'Free for now, until the service stabilises.',
          'Even while free, tap your transit card when boarding and alighting, as on regular city buses.',
          'For safety the bus takes no passengers once every seat is taken. It has 31 seats.',
          'Check for free seats on the bus information display (BIT) at the stop or the LED seat indicator on the front of the bus.',
        ],
      },
    },
    {
      heading: {
        ko: '새벽동행 자율주행버스 4개 노선',
        en: 'All Four Saebyeok Autonomous Bus Routes',
      },
      paragraphs: {
        ko: ['서울시 발표 기준 네 노선의 운행 지역과 운행 시작일입니다. 네 노선 모두 평일 새벽 3시 30분에 기점을 출발해 한 번 왕복합니다.'],
        en: ['Service areas and start dates of the four routes, per Seoul’s announcement. All four leave their starting stop at 03:30 on weekdays and make one round trip.'],
      },
      bullets: {
        ko: [
          'A160 — 도봉산역~종로~여의도~영등포역 · 2024년 11월 26일 운행 시작',
          'A741 — 구파발역~종로~한남대교~양재역 · 2026년 3월 30일 운행 시작',
          'A148 — 상계역~미아사거리~압구정~고속터미널 · 2026년 4월 16일 운행 시작',
          'A504 — 금천구청~신림역~한강대교~세종로 · 2026년 4월 29일 운행 시작',
        ],
        en: [
          'A160 — Dobongsan Stn – Jongno – Yeouido – Yeongdeungpo Stn · since 26 November 2024',
          'A741 — Gupabal Stn – Jongno – Hannam Bridge – Yangjae Stn · since 30 March 2026',
          'A148 — Sanggye Stn – Mia-sageori – Apgujeong – Express Bus Terminal · since 16 April 2026',
          'A504 — Geumcheon-gu Office – Sillim Stn – Hangang Bridge – Sejong-ro · since 29 April 2026',
        ],
      },
      links: [
        { href: '/routes/saebyeok-a160', label: { ko: 'A160', en: 'A160' } },
        { href: '/routes/saebyeok-a741', label: { ko: 'A741', en: 'A741' } },
        { href: '/routes/saebyeok-a148', label: { ko: 'A148', en: 'A148' } },
        { href: '/routes/saebyeok-a504', label: { ko: 'A504', en: 'A504' } },
        { href: '/routes/early-morning', label: { ko: '새벽 노선 한눈에 비교', en: 'Compare the early-morning routes' } },
      ],
    },
    {
      heading: {
        ko: '올빼미버스와 같은 정류소',
        en: 'Stops Shared with Owl Night Buses',
      },
      paragraphs: {
        ko: [
          'A504 정류소 32곳 가운데 30곳은 올빼미버스도 서는 정류소 번호입니다. 노량진역3번출구에는 N15가, 숙대입구역과 서울역버스환승센터에는 N15·N75가, 소공동주민센터에는 N16·N51·N62·N73·N75가 섭니다. 올빼미버스가 서지 않는 두 곳은 독산고개와 노량진역2번출구입니다.',
          '올빼미버스 막차는 기점 출발 기준 03:10~04:10이고, A504는 03:30에 기점을 출발합니다. 같은 정류소에서 어느 버스가 먼저 지나는지는 확인한 자료에 정류소별 통과 시각이 없어 알 수 없습니다.',
        ],
        en: [
          'Of A504’s 32 stops, 30 share their stop number with owl night buses. N15 stops at Noryangjin Station (Exit 3); N15 and N75 stop at Sookmyung Women’s Univ. station and Seoul Station Bus Transfer Center, Site of Kang Woo-kyu; N16, N51, N62, N73 and N75 stop at City hall front. The two stops without owl buses are Doksangogae and Noryangjin Station (Exit 2).',
          'The last owl buses leave their starting stops between 03:10 and 04:10; A504 leaves its starting stop at 03:30. Which bus passes a shared stop first cannot be told from the materials checked, as they do not list passing times per stop.',
        ],
      },
      links: [{ href: '/night-bus-map', label: { ko: '올빼미버스 노선도', en: 'Owl bus route map' } }],
    },
    {
      heading: {
        ko: '출처와 확인일',
        en: 'Sources and Check Dates',
      },
      paragraphs: {
        ko: [
          '노선·정차 방식·요금·탑승 규칙은 서울시 보도자료 「새벽을 여는 ‘A504(금천~시청)’ 노선 29일(수) 개통」(2026년 4월 27일)과 같은 날 내 손안에 서울에 실린 노선별 운행 개요 표를 따랐습니다. 정차 순서 32곳은 카카오맵에 표시된 서울시 제공 노선 정보(2026년 5월 1일 확인), 올빼미버스 정류소 대조는 서울열린데이터광장 「서울시 버스노선별 정류소정보」(2026년 9월 2일 스냅샷) 기준입니다.',
          'Seoul Autonomous가 위 자료를 대조해 2026년 10월 16일 다시 썼습니다. 요금처럼 발표 뒤 바뀔 수 있는 내용은 공식 안내가 우선합니다.',
        ],
        en: [
          'Route, stop pattern, fare and boarding rules follow Seoul’s press release on the A504 launch (27 April 2026) and the route overview table published the same day on the Seoul city news portal. The order of the 32 stops follows Seoul route data shown on Kakao Map (checked 1 May 2026); the owl-bus stop match uses the Seoul Open Data Plaza bus route stop dataset (2 September 2026 snapshot).',
          'Seoul Autonomous rewrote this article on 16 October 2026 after checking the sources above. For details that can change after an announcement, such as fares, the official notice takes precedence.',
        ],
      },
    },
  ],
};

export default entry;
