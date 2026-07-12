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
  overview: string;
  useCase: string;
}

export type RouteContextMap = Record<VerifiedRouteId, RouteContext>;
