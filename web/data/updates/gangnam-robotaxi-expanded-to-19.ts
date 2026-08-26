import type { UpdateEntry } from '../../lib/types/update';

const entry: UpdateEntry = {
  slug: 'gangnam-robotaxi-expanded-to-19',
  date: '2026-08-26',
  eventDate: '2026-08-19',
  sourcePublishedAt: '2026-08-19',
  titleEn: 'Gangnam Late-night Robotaxi Expanded to 19: Hours, Zone, How to Call',
  titleKo: '강남 심야 자율주행택시 19대 확대 운행시간 구역 호출방법',
  summaryEn:
    'From 20 August 2026 Seoul runs 19 late-night robotaxis across the entire Gangnam pilot zone. Operating hours, service area, Kakao T call steps and fares in one guide.',
  summaryKo:
    '2026년 8월 20일부터 강남 심야 자율주행택시가 19대로 늘었습니다. 운행시간, 운행구역, 카카오T 호출 방법, 시간대별 요금을 한 번에 정리했습니다.',
  relatedRouteIds: ['gangnam-robotaxi'],
  sourceUrl: 'https://www.seoul.go.kr/news/news_report.do?nttNo=464205',
  articleSections: [
    {
      heading: {
        ko: '강남 심야 자율주행택시 19대 확대',
        en: 'Gangnam Late-night Robotaxi Expanded to 19 Vehicles',
      },
      paragraphs: {
        ko: [
          '서울시가 2026년 8월 19일, 강남 심야 자율주행택시를 8월 20일 밤 10시부터 7대에서 19대로 확대한다고 발표했습니다. 에스더블유엠(SWM)이 13대, 카카오모빌리티가 6대를 운행합니다.',
          '이 서비스는 단계적으로 커져 왔습니다. 2024년 9월 3대 무료 시범으로 시작해 2026년 3월 7대로 늘었고, 같은 해 4월 유료로 전환된 뒤 이번이 세 번째 확대입니다.',
        ],
        en: [
          'On 19 August 2026 Seoul announced that its Gangnam late-night autonomous taxi fleet grows from 7 to 19 vehicles starting 20 August at 22:00. SWM operates 13 vehicles and Kakao Mobility 6.',
          'The service has grown in stages: it launched in September 2024 as a free pilot with 3 vehicles, expanded to 7 in March 2026, switched to paid service that April, and now reaches 19.',
        ],
      },
    },
    {
      heading: {
        ko: '강남 자율주행 시범운행지구 20.4㎢',
        en: 'Gangnam Autonomous Driving Pilot Zone: 20.4 km²',
      },
      paragraphs: {
        ko: [
          '운행 구역은 강남 자율주행자동차 시범운행지구 전역, 약 20.4㎢입니다.',
          '정해진 노선을 도는 버스형 서비스가 아닙니다. 구역 안에서 출발지와 목적지를 직접 지정하면 로보택시가 그 지점으로 이동하는 목적지 지정 방식입니다.',
        ],
        en: [
          'The service covers the entire Gangnam autonomous driving pilot zone — approximately 20.4 km².',
          'It is not a fixed-route bus service. You set your own pick-up point and destination inside the zone, and the robotaxi drives there on demand.',
        ],
      },
    },
    {
      heading: {
        ko: '평일 밤 10시부터 새벽 5시 운행시간',
        en: 'Operating Hours: Weekdays 22:00–05:00',
      },
      paragraphs: {
        ko: [
          '운행시간은 평일(월~금) 밤 10시부터 다음 날 새벽 5시까지입니다. 주말에는 운행하지 않습니다.',
          '지하철과 시내버스가 끊긴 심야 시간대를 채우는 서비스로, 막차 이후 강남 안에서의 이동 수단이 하나 더 생기는 셈입니다.',
        ],
        en: [
          'The service runs on weekdays (Mon–Fri) from 22:00 to 05:00 the next morning. There is no weekend service.',
          'It covers the late-night window after subways and regular buses stop — one more way to move within Gangnam after the last train.',
        ],
      },
    },
    {
      heading: {
        ko: '카카오T 서울자율차 호출방법',
        en: "How to Call 'Seoul Autonomous Car' in Kakao T",
      },
      paragraphs: {
        ko: ['호출은 카카오 T 앱에서 합니다. 순서는 다음과 같습니다.'],
        en: ['You request a ride in the Kakao T app (Korean app). The steps are:'],
      },
      bullets: {
        ko: [
          '카카오 T 앱에서 ‘택시’ 선택',
          '구역 내에서 출발지와 목적지 지정',
          '차량 종류에서 ‘서울자율차’ 선택',
          '결제수단 선택 후 호출',
        ],
        en: [
          "Open Kakao T and tap 'Taxi'",
          'Set a pick-up point and destination inside the zone',
          "Choose 'Seoul Autonomous Car (서울자율차)' as the vehicle type",
          'Select a payment method and call',
        ],
      },
    },
    {
      heading: {
        ko: '시간대별 자율주행택시 요금',
        en: 'Robotaxi Fares by Time Band',
      },
      paragraphs: {
        ko: [
          '요금은 거리·시간과 무관한 기본요금제이며 심야할증이 적용됩니다. 이번 19대 확대로 요금은 바뀌지 않았습니다.',
        ],
        en: [
          'Fares are a flat base fare independent of distance and duration, with a late-night surcharge applied. Fares did not change with this expansion.',
        ],
      },
      bullets: {
        ko: [
          '22:00~23:00 — 5,800원',
          '23:00~02:00 — 6,700원',
          '02:00~04:00 — 5,800원',
          '04:00~05:00 — 4,800원',
        ],
        en: [
          '22:00–23:00 — KRW 5,800',
          '23:00–02:00 — KRW 6,700',
          '02:00–04:00 — KRW 5,800',
          '04:00–05:00 — KRW 4,800',
        ],
      },
    },
    {
      heading: {
        ko: '탑승 전 확인사항',
        en: 'Before You Ride',
      },
      paragraphs: {
        ko: [
          '이용 전에 알아두면 좋은 조건들입니다. 이 사이트는 실시간 정보를 제공하지 않으므로, 이동 전 카카오 T 앱에서 최신 이용 가능 여부를 확인하세요.',
        ],
        en: [
          'A few conditions to know before riding. This site does not provide real-time information — check the Kakao T app for current availability before heading out.',
        ],
      },
      bullets: {
        ko: [
          '차량당 최대 승객 3명, 시험운전자 1명 상시 동승',
          '일부 좁은 구간은 수동 운전으로 운행 (공식 안내 기준)',
          '평일에만 운행 — 주말 미운행',
          '발표 기준 2024년 9월 이후 누적 15,140건, 유료 전환 이후 6,176건 운행',
        ],
        en: [
          'Up to 3 passengers per vehicle; a safety driver is always on board',
          'Some narrow sections are driven manually, per the official notice',
          'Weekdays only — no weekend service',
          'Per the announcement: 15,140 cumulative rides since September 2024, 6,176 since paid service began',
        ],
      },
    },
  ],
};

export default entry;
