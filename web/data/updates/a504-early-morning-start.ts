import type { UpdateEntry } from '../../lib/types/update';

const entry: UpdateEntry = {
  slug: 'a504-early-morning-start',
  date: '2026-05-09',
  eventDate: '2026-04-29',
  sourcePublishedAt: '2026-05-06',
  titleEn: 'Saebyeok A504 early morning service launched',
  titleKo: '새벽동행 A504 새벽 운행 시작',
  summaryEn: 'The route stops and listed departure time were checked. Reported fare or operating details are not presented as confirmed until verified separately through an official source.',
  summaryKo: '노선의 정류장과 화면에 표시된 출발 시각을 확인했습니다. 요금·운영 조건과 관련해 별도로 보도되거나 안내된 내용은 공식 확인 전까지 확정 정보로 표시하지 않습니다.',
  relatedRouteIds: ['saebyeok-a504'],
  sections: {
    whatChanged: {
      en: 'Saebyeok A504 has been added to the listed routes with checked stops and listed times. This early morning autonomous bus connects Geumcheon-gu Office to Seoul City Hall, departing at 03:30.',
      ko: '새벽동행 A504가 정류장·표시 시각을 확인한 노선 목록에 추가되었습니다. 금천구청에서 서울시청까지 운행하는 새벽 자율주행 버스로, 03:30에 출발합니다.',
    },
    confirmedInfo: {
      en: [
        'Route: Saebyeok A504',
        'Departure: Geumcheon-gu Office (03:30)',
        'Destination: Seoul City Hall',
        'Stops & listed departure time checked: May 1, 2026',
        'Source: Kakao Map, Seoul Metropolitan Government data',
      ],
      ko: [
        '노선: 새벽동행 A504',
        '출발: 금천구청 (03:30)',
        '도착: 서울시청',
        '정류장·표시 출발 시각 확인: 2026.05.01 기준',
        '확인 출처: 카카오맵, 서울특별시 제공 데이터',
      ],
    },
    reportedInfo: {
      en: [
        'Service started April 29, 2026',
        'Operates once on weekdays',
        'Round trip approximately 35.2 km, about 2 hours',
        '32 stops selected from regular route 504',
        'Free during 1-year pilot period',
        'Safety operator on board',
        'Manual driving in some sections (school zones, Sillim intersection)',
      ],
      ko: [
        '2026년 4월 29일 운행 시작',
        '평일 1회 운행',
        '왕복 약 35.2km, 약 2시간 소요',
        '일반 504번 중 32개 정류장 선별',
        '시범 운행 1년간 무료',
        '안전관리자 탑승',
        '일부 구간 수동 운전 (어린이보호구역, 신림 사거리)',
      ],
    },
    checkBefore: {
      en: 'Check Kakao Map or official sources for the latest schedule before riding. This site does not provide real-time information.',
      ko: '탑승 전 카카오맵 또는 공식 안내에서 최신 시간표를 확인하세요. 이 사이트는 실시간 정보를 제공하지 않습니다.',
    },
  },
};

export default entry;
