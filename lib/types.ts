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
  fare: string;
  operator: string;
  reservationRequired: string;
  appRequired: string;
  lastChecked: string;
  verifiedBy: string;
  verificationLevel: 'kakao_seoul_verified' | 'official_confirmed' | 'official_pending' | 'community_reported';
  kakaoMapVerified: boolean;
  sourceUrls: string[];
  sourceNote: string;
  disclaimer: string;
  stops?: Stop[];
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
  appRequired: boolean;
  appName: string;
  operatingHours: string;
  operatingDays: string;
  fare: string;
  operator: string;
  officialServiceUrl: string;
  lastChecked: string;
  verifiedBy: string;
  verificationLevel: string;
  kakaoMapVerified: boolean;
  sourceUrls: string[];
  sourceNote: string;
  disclaimer: string;
};

export type RoutesData = {
  version: string;
  lastUpdated: string;
  fixedRoutes: FixedRoute[];
  onDemandServices: OnDemandService[];
};
