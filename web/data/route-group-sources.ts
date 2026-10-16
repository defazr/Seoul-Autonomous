/**
 * R3b-2 (2026-10-16) — 노선 묶음 페이지 본문이 기대는 공식 발표 사실. routes.json 에 없는 값(경유 지역·운행 시작일)만 둔다.
 * 규칙: 서울시 보도자료 원문 또는 그 공식 게시물만 쓴다(시민기자·SNS·위키 제외). 요금·대수처럼 발표 뒤 바뀌는 값은 싣지 않는다 —
 * 요금·운행일은 routes.json(노선 카드·노선 페이지)이 유일한 표시 근거다.
 */
export type GroupSource = { title: string; publisher: string; url: string; publishedAt: string };

export const GROUP_SOURCES = {
  a741Launch: {
    title: "새벽동행 자율주행버스 'A741' 첫 시동…새벽 출근길 더 빨라진다",
    publisher: '서울특별시 보도자료',
    url: 'https://www.seoul.go.kr/news/news_report.do?nttNo=455157',
    publishedAt: '2026-03-29',
  },
  a148Launch: {
    title: "30분 일찍 출발! 새벽동행 자율주행버스 '상계~고속터미널' 노선 추가",
    publisher: '서울특별시 · 내 손안에 서울',
    url: 'https://mediahub.seoul.go.kr/archives/2017838',
    publishedAt: '2026-04-15',
  },
  a504Launch: {
    title: "새벽을 여는 'A504(금천~시청)' 노선 29일(수) 개통…동서남북 자율주행으로 연결",
    publisher: '서울특별시 보도자료',
    url: 'https://www.seoul.go.kr/news/news_report.do?nttNo=456975',
    publishedAt: '2026-04-27',
  },
  saebyeokOverview: {
    title: "금천~시청 빠르게…새벽 자율주행버스 'A504' 노선 29일 개통 (노선별 운행개요 표)",
    publisher: '서울특별시 · 내 손안에 서울',
    url: 'https://mediahub.seoul.go.kr/archives/2017965',
    publishedAt: '2026-04-27',
  },
} as const satisfies Record<string, GroupSource>;

/** 새벽동행 노선별 운행 지역·운행 시작일 — saebyeokOverview 표(2026-04-27) 그대로. */
export const SAEBYEOK_OVERVIEW: Record<string, { corridorKo: string; corridorEn: string; launchedOn: string }> = {
  'saebyeok-a160': { corridorKo: '도봉산역~종로~여의도~영등포역', corridorEn: 'Dobongsan Stn – Jongno – Yeouido – Yeongdeungpo Stn', launchedOn: '2024-11-26' },
  'saebyeok-a741': { corridorKo: '구파발역~종로~한남대교~양재역', corridorEn: 'Gupabal Stn – Jongno – Hannam Bridge – Yangjae Stn', launchedOn: '2026-03-30' },
  'saebyeok-a148': { corridorKo: '상계역~미아사거리~압구정~고속터미널', corridorEn: 'Sanggye Stn – Mia-sageori – Apgujeong – Express Bus Terminal', launchedOn: '2026-04-16' },
  'saebyeok-a504': { corridorKo: '금천구청~신림역~한강대교~세종로', corridorEn: 'Geumcheon-gu Office – Sillim Stn – Hangang Bridge – Sejong-ro', launchedOn: '2026-04-29' },
};
