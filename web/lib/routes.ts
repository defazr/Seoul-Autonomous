import routesData from '../data/routes.json';
import type { FixedRoute, OnDemandService } from './types/route';

const fixedRoutes = routesData.fixedRoutes as FixedRoute[];
const onDemandServices = routesData.onDemandServices as OnDemandService[];

const FEATURED_IDS = [
  'cheonggye-a01',
  'cheongwadae-a01',
  'sangam-a21',
  'simya-a21',
];

export function getVerifiedRoutes(): FixedRoute[] {
  return fixedRoutes.filter(
    (r) =>
      r.verificationLevel === 'kakao_seoul_verified' ||
      r.verificationLevel === 'official_confirmed',
  );
}

export function getFeaturedRoutes(): FixedRoute[] {
  return FEATURED_IDS.map((id) => fixedRoutes.find((r) => r.id === id)).filter(
    Boolean,
  ) as FixedRoute[];
}

export function getRouteById(id: string): FixedRoute | undefined {
  return fixedRoutes.find((r) => r.id === id);
}

export function getOnDemandServices(): OnDemandService[] {
  return onDemandServices;
}

export function getLatestVerifiedDate(): string {
  const routes = getVerifiedRoutes();
  if (routes.length === 0) return '';
  return routes.reduce((latest, r) =>
    r.lastChecked > latest ? r.lastChecked : latest,
    routes[0].lastChecked,
  );
}
