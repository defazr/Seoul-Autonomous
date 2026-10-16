/**
 * 자율주행 노선·로보택시의 화면 투영 (26-C2O). client boundary 를 넘기는 데이터는 표시 필드만 — 운영정보 원본·조사 상태·정류장 배열은 서버에 남는다.
 * /routes · /routes/late-night 가 같은 의미·순서로 쓴다.
 */
import type { FixedRoute, OnDemandService, RouteListItem, RobotaxiListItem } from './types/route';

export function toRouteItem(route: FixedRoute): RouteListItem {
  return { id: route.id, displayName: route.displayName, displayNameKo: route.displayNameKo, startPoint: route.startPoint, startPointKo: route.startPointKo, endPoint: route.endPoint, endPointKo: route.endPointKo, firstBus: route.firstBus, lastBus: route.lastBus, headway: route.headway };
}

/** hoursText 는 호출부가 locale 문구로 조립한다 (미확인이면 null). 카드 대표 출처는 최신 관련 공식 발표(운영시간) 우선, 없으면 요금 근거. */
export function toRobotaxiItem(svc: OnDemandService, hoursText: (start: string, end: string) => string): RobotaxiListItem {
  const fare = svc.fare.value; const hours = svc.operatingHours.value; const reservation = svc.reservationRequired.value; const app = svc.appRequired.value;
  const source = svc.operatingHours.sources[0] ?? svc.fare.sources[0] ?? null;
  return {
    id: svc.id, displayName: svc.displayName, displayNameKo: svc.displayNameKo, serviceArea: svc.serviceArea, serviceAreaKo: svc.serviceAreaKo, verificationLevel: svc.verificationLevel,
    fareBands: fare && fare.kind === 'time_bands' ? fare.bands : null,
    operatorNames: svc.operator.value?.entities.map((e) => e.name) ?? [],
    reservation: reservation ? { mode: reservation.mode, appName: reservation.appName } : null,
    app: app?.required ? { appName: app.appName, purposes: app.purposes } : null,
    hoursText: hours ? hoursText(hours.start, hours.end) : null,
    source: source ? { publisher: source.publisher, url: source.url, publishedAt: source.publishedAt, effectiveAt: source.effectiveAt } : null,
  };
}
