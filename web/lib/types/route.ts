/**
 * 26-C2O 운영정보 상태 모델.
 *
 * 검증등급(verificationGrade)과 현재성(currentState)은 서로 다른 축이다.
 * 과거에 공식 확인됐더라도 그 문서가 예고한 전환 시점이 지났으면
 * currentState 만 reverification_required 로 내려간다.
 *
 * 불변식:
 *   official_confirmed + confirmed → value non-null, sources 1건 이상
 *   그 외 모든 조합                → value null (과거 값 화면 표시 금지)
 */
export type VerificationGrade =
  | 'official_confirmed'
  | 'media_reference'
  | 'unverified';

export type OperationalCurrentState =
  | 'confirmed'
  | 'reverification_required'
  | 'unverified';

export type OperationalReason =
  | 'transition_due'
  | 'secondary_only'
  | 'historical_only'
  | 'no_current_source'
  | 'conflicting_sources'
  | null;

export type OperationalSource = {
  title: string;
  publisher: string;
  url: string;
  publishedAt: string;
  effectiveAt: string | null;
};

export type OperationalField<T> = {
  value: T | null;
  verificationGrade: VerificationGrade;
  currentState: OperationalCurrentState;
  reason: OperationalReason;
  sources: OperationalSource[];
};

/** 한시 무료. 종료 조건과 교통카드 태그 필요 여부를 값에 함께 담는다. */
export type TemporaryFreeFare = {
  kind: 'temporary_free';
  cardTagRequired: boolean;
  condition: 'until_service_stabilizes';
};

/** 시간대별 기본요금. 구간을 합치거나 생략하지 않는다. */
export type TimeBandFare = {
  kind: 'time_bands';
  currency: 'KRW';
  distanceAndDurationIndependent: boolean;
  paymentCardRegistrationRequired: boolean;
  bands: Array<{ start: string; end: string; amount: number }>;
};

export type FareValue = TemporaryFreeFare | TimeBandFare;

export type OperatorRole =
  | 'transport_operator'
  | 'vehicle_operator'
  | 'platform_provider';

/** 표기가 유사한 법인명이라도 통합하지 않는다 (㈜SUM · ㈜에스유엠 · 에스더블유엠). */
export type OperatorValue = {
  entities: Array<{ name: string; roles: OperatorRole[] }>;
};

/** 공식 확인된 운영 시간창. days 어휘는 fixedRoutes.daysOfOperation('weekday')과 동일하게 유지한다. */
export type OperatingWindowValue = {
  days: 'weekday';
  start: string;
  end: string;
};

export type ReservationValue = {
  required: boolean;
  mode: 'advance_reservation' | 'realtime_call';
  appName: string | null;
};

export type AppRequirementValue = {
  required: boolean;
  appName: string | null;
  purposes: Array<'request' | 'payment'>;
};

/** 고정노선·온디맨드가 공유하는 운영정보 계약 */
export type OperationalInfo = {
  fare: OperationalField<FareValue>;
  operator: OperationalField<OperatorValue>;
  reservationRequired: OperationalField<ReservationValue>;
  appRequired: OperationalField<AppRequirementValue>;
};

export type FixedRoute = {
  id: string;
  displayName: string;
  displayNameKo: string;
  startPoint: string;
  startPointKo: string;
  endPoint: string;
  endPointKo: string;
  firstBus: string;
  lastBus: string;
  headway: string;
  daysOfOperation: string;
  fare: OperationalField<FareValue>;
  operator: OperationalField<OperatorValue>;
  reservationRequired: OperationalField<ReservationValue>;
  appRequired: OperationalField<AppRequirementValue>;
  lastChecked: string;
  verifiedBy: string;
  verificationLevel:
    | 'kakao_seoul_verified'
    | 'official_confirmed'
    | 'official_pending'
    | 'community_reported';
  kakaoMapVerified: boolean;
  sourceUrls: string[];
  sourceNote: string;
  disclaimer: string;
  stops?: Stop[];
};

/**
 * 26-C2O: 노선 목록(client) 전용 표시 타입.
 * 운영정보·출처·조사 상태·정류장 배열은 client boundary 를 넘지 않는다.
 * ko/en 양쪽 이름을 유지하는 이유는 검색과 보조명 표시가 두 언어를 모두 쓰기 때문이다.
 */
export type RouteListItem = {
  id: string;
  displayName: string;
  displayNameKo: string;
  startPoint: string;
  startPointKo: string;
  endPoint: string;
  endPointKo: string;
  firstBus: string;
  lastBus: string;
  headway: string;
};

/** 26-C2O: 로보택시 카드(client) 전용 표시 타입. 공개 표시값과 출처 1건만 담는다. */
export type RobotaxiListItem = {
  id: string;
  displayName: string;
  displayNameKo: string;
  serviceArea: string;
  serviceAreaKo: string;
  verificationLevel: string;
  fareBands: Array<{ start: string; end: string; amount: number }> | null;
  operatorNames: string[];
  reservation: { mode: 'advance_reservation' | 'realtime_call'; appName: string | null } | null;
  app: { appName: string | null; purposes: Array<'request' | 'payment'> } | null;
  /** 공식 확인된 운영시간의 표시 문자열 (caller 가 locale 로 조립). 미확인이면 생략/null */
  hoursText?: string | null;
  source: { publisher: string; url: string; publishedAt: string; effectiveAt: string | null } | null;
};

export type Stop = {
  seq: number;
  nameKo: string;
  nameEn: string | null;
  stopId: string;
  isTurnaround: boolean;
};

export type OnDemandService = {
  id: string;
  displayName: string;
  displayNameKo: string;
  serviceArea: string;
  serviceAreaKo: string;
  /** 26-C2O: 고정노선과 동일한 운영정보 계약을 쓴다 (원시 boolean 폐기) */
  appRequired: OperationalField<AppRequirementValue>;
  reservationRequired: OperationalField<ReservationValue>;
  appName: string;
  /** Robotaxi Freshness(2026-08-26): 평문 "Unknown"에서 C2O 계약으로 승격.
   *  구 operatingDays 평문 필드는 value.days 로 흡수돼 제거됐다 (consumer 0 확인). */
  operatingHours: OperationalField<OperatingWindowValue>;
  fare: OperationalField<FareValue>;
  operator: OperationalField<OperatorValue>;
  officialServiceUrl: string;
  lastChecked: string;
  verifiedBy: string;
  verificationLevel: string;
  kakaoMapVerified: boolean;
  sourceUrls: string[];
  sourceNote: string;
  disclaimer: string;
};
