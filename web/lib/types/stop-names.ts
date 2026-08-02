/**
 * Round 26-C1E — 공식 영문 정류장명 SSOT 타입.
 *
 * 출처: 서울특별시 「서울시 버스 정류소 노선도 다국어 목록 정보」(OA-12830, 공공누리 제1유형).
 * 이 SSOT는 routes.json을 수정하지 않고 stopId로 조회하기 위한 별도 정본이다.
 */

export type StopNameMatchStatus =
  /** 공식 ID 일치 + 공식 한국어명이 현재 nameKo와 정확히 일치 */
  | 'exact'
  /** 공식 ID 일치, 한국어 표기 차이(축약·부가 시설명·개칭 가능성). 영문명 채택 가능 */
  | 'reviewed'
  /** 같은 한국어명의 다른 stopId와 공식 영문 표기 형식이 다름. 원문 그대로 보존 */
  | 'official_variant'
  /** 공식 영문명이 의미상 충돌해 자동 채택 보류. nameEnOfficial은 null */
  | 'conflict_hold'
  /** OA-12830에서 레코드가 반환되지 않음(다국어 검수 미완료 정류소) */
  | 'unmatched';

export type StopNameRecord = {
  /** routes.json 형식 5자리 숫자 문자열 (예: '01005') */
  stopId: string;
  /** 공식 형식 (예: '01-005') */
  officialId: string;
  /** 공식 한국어명. 참조용이며 화면 표시에 사용하지 않는다 */
  nameKoOfficial: string | null;
  /** 공식 영문명 원문. 정규화하지 않는다 */
  nameEnOfficial: string | null;
  matchStatus: StopNameMatchStatus;
  source: 'OA-12830';
};

export type StopNamesArtifacts = {
  /** 파일에 기록된 바이트의 SHA-256 */
  stopNamesSha256: string;
  reviewsSha256: string;
  /** 파싱 후 재직렬화한 의미 SHA-256 */
  stopNamesCanonicalSha256: string;
  reviewsCanonicalSha256: string;
};

export type StopNamesMeta = {
  dataset: string;
  datasetName: string;
  api: string;
  provider: string;
  datasetUrl: string;
  sourceUpdatedAt: string;
  license: string;
  licenseNote: string;
  extractionNote: string;
  totalInDataset: number;
  requestedStopIds: number;
  apiMatched: number;
  apiUnmatched: number;
  /** 매핑 내용에서 결정적으로 생성한 세대 식별자 (collectedAt 과 무관) */
  generationId: string;
  artifacts: StopNamesArtifacts;
  collectedAt: string;
};

export type StopNameReviewType =
  | 'ko_name_difference'
  | 'official_variant'
  | 'semantic_conflict'
  | 'oa12830_unmatched';

export type StopNameReview = {
  stopId: string;
  currentNameKo: string;
  officialNameKo: string | null;
  officialNameEn: string | null;
  reviewType: StopNameReviewType;
  decision: 'adopt_en' | 'hold' | 'pending_alternative_source';
  note: string;
};
