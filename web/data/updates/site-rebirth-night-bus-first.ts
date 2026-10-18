import type { UpdateEntry } from '../../lib/types/update';

/**
 * 재탄생(v2) 공지 — R3a §12 V6. 올빼미버스 중심으로 사이트 구조·디자인·데이터 층을 다시 만든 내용.
 * date 는 컷오버(V8 배포) 날짜로 맞춘다. 실시간처럼 보이는 표현 금지 · 확인한 것만 적는다.
 */
const entry: UpdateEntry = {
  slug: 'site-rebirth-night-bus-first',
  date: '2026-10-16',
  eventDate: '2026-10-16',
  sourcePublishedAt: '2026-10-16',
  titleEn: 'Rebuilt around the Owl Bus: route finder, 16 hubs and stop numbers on the map',
  titleKo: '올빼미버스 중심으로 다시 만들었습니다 — 경로 찾기, 허브 16곳, 노선도 정류소 번호',
  summaryEn: 'The site now starts from one question — where do you want to go after 11 pm? Direct and one-transfer Owl Bus routes, hubs and stop numbers on every route page.',
  summaryKo: '밤 11시 이후 "어디로 가고 싶으세요?" 한 질문에서 시작하도록 사이트를 다시 만들었습니다. 올빼미버스 직통·1회 환승 경로를 서울시 정류소 데이터로 찾고, 허브와 노선 페이지에 정류소 번호·방면을 넣었습니다.',
  relatedRouteIds: [],
  articleSections: [
    {
      heading: { en: 'What changed', ko: '무엇이 달라졌나' },
      paragraphs: {
        en: ['The home page is now a route finder. Enter a departure and a destination (or tap "My location") and the site finds direct and one-transfer Owl Bus trips across 14 routes and 2,078 stops, with the boarding stop number and direction. The search runs on your device from an official stop dataset; nothing is sent to a server.'],
        ko: ['홈은 경로 찾기 화면이 됐습니다. 출발·도착을 넣거나 「내 위치」를 누르면 올빼미버스 14개 노선 2,078개 정류장에서 직통과 1회 환승 경로를 찾고, 타는 정류소 번호와 방면을 보여줍니다. 계산은 서울시 정류소 데이터로 기기 안에서 하며 서버로 보내는 것이 없습니다.'],
      },
      bullets: {
        en: [
          'Hub board: 16 places where three or more Owl Bus routes meet. Gangnam Station, Hongik Univ. Station and Dongdaemun Station have dedicated hub pages with platform stop numbers and a real map.',
          'Route pages for N13, N15, N16, N31 and N61: full stop lists by direction with stop numbers, meeting routes, and map links that open when you tap a stop name.',
          'Route map: tapping a station now lists the stop numbers and directions for every route passing it, with Kakao Map and Naver Map links.',
          'New dark design across every page, with the same header, footer and source line everywhere.',
        ],
        ko: [
          '허브 보드: 올빼미버스 3개 노선 이상이 만나는 16곳. 강남역·홍대입구역·동대문역은 승강장별 정류소 번호와 실제 지도를 담은 허브 페이지가 있습니다.',
          'N13·N15·N16·N31·N61 노선 페이지: 방면별 전체 정류장 목록에 정류소 번호, 만나는 노선, 정류장 이름을 누르면 열리는 지도 링크를 넣었습니다.',
          '노선도: 역을 누르면 그 역을 지나는 모든 노선의 정류소 번호와 방면이 카카오맵·네이버지도 링크와 함께 나옵니다.',
          '모든 페이지가 같은 어두운 바탕의 새 디자인과 같은 머리·꼬리·근거 줄을 씁니다.',
        ],
      },
    },
    {
      heading: { en: 'Why we rebuilt it', ko: '왜 다시 만들었나' },
      paragraphs: {
        en: [
          'Most real use of this site was Korean, on a phone, arriving from Naver, and landing on the Owl Bus route map. The site had been framed as an autonomous-vehicle guide for visitors, which did not match how people actually used it.',
          'So the identity changed: Seoul Autonomous is a guide to late-night travel in Seoul. Owl Bus routes, stops and transfers come first; the autonomous night and early-morning routes stay as a secondary track with their own pages.',
        ],
        ko: [
          '실제 이용의 대부분은 한국어, 모바일, 네이버 검색을 거쳐 올빼미버스 노선도에 도착하는 흐름이었습니다. 사이트는 외국인 방문객용 자율주행 안내로 짜여 있어 실제 쓰임과 맞지 않았습니다.',
          '그래서 정체성을 바꿨습니다. Seoul Autonomous 는 서울의 심야 이동 안내 사이트입니다. 올빼미버스 노선·정류소·환승이 중심이고, 자율주행 심야·새벽 노선은 보조 축으로 각자의 페이지를 유지합니다.',
        ],
      },
    },
    {
      heading: { en: 'Data and evidence', ko: '데이터와 근거' },
      paragraphs: {
        en: ['Every figure on the site is shown with its source and reference date. The data-source page lists, field by field, where each value comes from and under which license it is used.'],
        ko: ['사이트의 모든 수치는 출처와 기준일을 함께 표시합니다. 데이터 출처 페이지에 필드별로 어디서 가져와 어떤 라이선스로 쓰는지 정리했습니다.'],
      },
      bullets: {
        en: [
          'Owl Bus stops, order, coordinates and stop numbers: Seoul Open Data Plaza bus-route stop dataset, 2026-09-02 snapshot (KOGL Type 1).',
          'Owl Bus timetable: factual figures only from the Seoul Metropolitan Government notice revised 2026-03-20.',
          'Route map: drawn in-house from that data. Station positions are area markers; the exact stop is in the map links.',
          'Autonomous routes: Seoul-provided information as shown in Kakao Map, checked manually with the check date.',
          'No real-time-looking wording. Arrival information appears only where it is actually fetched, with the time of the query.',
        ],
        ko: [
          '올빼미버스 정류장·순서·좌표·정류소 번호: 서울열린데이터광장 서울시 버스노선별 정류소 정보, 2026-09-02 스냅샷(공공누리 제1유형).',
          '올빼미버스 운행표: 서울특별시 공지(2026-03-20 개정)의 사실 수치만 인용.',
          '노선도: 그 데이터로 자체 작도. 역 위치는 권역 표시이며 정확한 정류장은 지도 링크에서 확인.',
          '자율주행 노선: 카카오맵에 표시된 서울특별시 제공 정보를 수동 확인하고 기준일을 함께 표시.',
          '실시간처럼 보이는 표현은 쓰지 않습니다. 도착 정보는 실제로 조회한 곳에서만 조회 시각과 함께 나옵니다.',
        ],
      },
    },
    {
      heading: { en: 'What comes next', ko: '다음에 할 것' },
      paragraphs: {
        en: ['Road-following route shapes on the real map once the official route-path data is in place, arrival information for more hub platforms, English stop names where an official source exists, and pages for the remaining Owl Bus routes. Changes will be logged here.'],
        ko: ['서울시 노선경로 데이터를 받은 뒤 실제 지도에 도로를 따르는 노선 경로를 그리고, 허브 승강장 도착 정보를 넓히고, 공식 출처가 있는 범위에서 영어 정류장명을 넣고, 나머지 올빼미버스 노선 페이지를 만듭니다. 바뀌는 것은 이 업데이트에 기록합니다.'],
      },
    },
  ],
};

export default entry;
