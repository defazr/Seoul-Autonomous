import type { UpdateEntry } from '../../lib/types/update';

const entry: UpdateEntry = {
  slug: 'gangnam-robotaxi-expanded',
  date: '2026-05-09',
  eventDate: '2026-03-16',
  sourcePublishedAt: '2026-04-06',
  titleEn: 'Gangnam Robotaxi service expanded',
  titleKo: '강남 로보택시 서비스 확대',
  summaryEn: 'The Gangnam Robotaxi pilot has expanded its fleet and coverage area.',
  summaryKo: '강남 로보택시 시범 서비스의 차량과 운행 구역이 확대되었습니다.',
  relatedRouteIds: ['gangnam-robotaxi'],
  sections: {
    whatChanged: {
      en: 'The Gangnam Robotaxi pilot service has expanded its fleet and coverage area. The service operates in Gangnam-gu and Seocho-gu during late-night hours via the Kakao T app.',
      ko: '강남 로보택시 시범 서비스의 차량 수와 운행 구역이 확대되었습니다. 강남구·서초구에서 심야 시간대에 카카오 T 앱을 통해 이용 가능합니다.',
    },
    confirmedInfo: {
      en: [
        'Service: Gangnam Robotaxi',
        'Area: Gangnam-gu, Seocho-gu (late-night)',
        'Status: CHECK BEFORE RIDING',
        'App required: Kakao T (Korean app)',
        'Verification: Kakao Map data',
      ],
      ko: [
        '서비스: 강남 로보택시',
        '운행 구역: 강남구, 서초구 (심야)',
        '상태: 탑승 전 확인',
        '필요 앱: Kakao T',
        '검증 출처: 카카오맵 데이터',
      ],
    },
    reportedInfo: {
      en: [
        'Fleet expanded from 3 to 7 vehicles on March 16',
        'Coverage area expanded to all of Gangnam (20.4 km²)',
        'Operating hours: 22:00–05:00 (extended by 1 hour)',
        'Additional Torres EVX vehicles planned',
        'Target: 20+ vehicles by end of year',
        'Cumulative 7,754 rides with no accidents reported',
      ],
      ko: [
        '3월 16일 3대에서 7대로 증차',
        '운행 구역 강남 전역 20.4km²로 확대',
        '운행 시간 22:00~05:00 (1시간 앞당김)',
        '토레스 EVX 추가 투입 예정',
        '연말 20대 이상 목표',
        '누적 7,754건 무사고 운행 보고',
      ],
    },
    checkBefore: {
      en: 'Check Kakao T app or official sources for the latest availability. This site does not provide real-time information.',
      ko: '탑승 전 카카오 T 앱 또는 공식 안내에서 최신 이용 가능 여부를 확인하세요. 이 사이트는 실시간 정보를 제공하지 않습니다.',
    },
  },
};

export default entry;
