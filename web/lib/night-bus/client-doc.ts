/** 서버: SSoT → 홈 질문 카드용 압축 문서. 가상 정류소 포함(서버 모델과 반환점 계산이 같도록) · 좌표 5자리. */
import { getNightBus, HUBS, NIGHT_META } from './data';
import type { ClientDoc, CompactStop } from './client-model';

export function buildClientDoc(): ClientDoc {
  const nb = getNightBus();
  const routes = nb.routes.filter((r) => r.category === 'owl' && r.official).map((r) => {
    const o = r.official!;
    return {
      no: r.no, color: r.color,
      official: { ends: o.ends, firstBus: o.firstBus, lastBus: o.lastBus, headway: o.headway, vehicles: o.vehicles, distanceKm: o.distanceKm, asOf: o.asOf },
      stops: r.stops.map((s): CompactStop => [s.seq, s.arsId, s.nameKo, +s.lat.toFixed(5), +s.lon.toFixed(5)]),
    };
  });
  return {
    v: NIGHT_META.stopsSource.snapshot,
    meta: { stopsSnapshot: NIGHT_META.stopsSource.snapshot, scheduleRevisedOn: NIGHT_META.scheduleSource.revisedOn },
    routes,
    hubs: HUBS.map((h) => ({ slug: h.slug, nameKo: h.nameKo, nameEn: h.nameEn, routes: h.routes, ars: h.ars, lat: h.lat, lon: h.lon })),
  };
}
