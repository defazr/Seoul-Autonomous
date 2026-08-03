export type VerifiedRouteId =
  | 'saebyeok-a160'
  | 'saebyeok-a741'
  | 'saebyeok-a148'
  | 'saebyeok-a504'
  | 'simya-a21'
  | 'cheonggye-a01'
  | 'dongjak-a01'
  | 'dongdaemun-a01'
  | 'seodaemun-a01'
  | 'sangam-a21'
  | 'cheongwadae-a01';

export interface RouteContext {
  /** 노선이 연결하는 실제 이동 축과 권역 */
  overview: string;
  /** stop 배열로 확인되는 운행 구조 (왕복·순환·반환점 이후 별도 종점 등) */
  routePattern: string;
  /**
   * 주요 정류장 3~5개. 표시명은 서버에서 stop 배열과 대조해 해결한다.
   * 자유 작성한 영문 정류장명을 여기에 저장하지 않는다.
   */
  keyStopIds: readonly string[];
  /** 어떤 이동에 참고할 수 있는지 */
  useCase: string;
}

export type RouteContextMap = Record<VerifiedRouteId, RouteContext>;
