/**
 * R3b-2 (2026-10-16) — 자율주행 노선 묶음(/routes/early-morning · /routes/late-night) 본문의 파생 수치.
 * 원본(routes.json · night-bus-routes.json)은 읽기만 한다. 숫자를 글에 손으로 적지 않고 여기서 계산한다.
 * 올빼미 겹침 = 같은 정류소 번호(ARS)에 올빼미버스(category 'owl')가 서는지만 본다 — 이름·거리 근사 없음 · "환승" 단정 없음.
 */
import { getNightBus } from './night-bus/data';
import { getApprovedStopPath } from './stop-pages';
import { getOfficialStopNameEn } from './stops';
import type { FixedRoute } from './types/route';

export type OwlOverlap = { total: number; shared: number; owlRoutes: string[] };

function owlRouteNos(): Set<string> {
  return new Set(getNightBus().routes.filter((r) => r.category === 'owl').map((r) => r.no));
}

/** 노선의 고유 정류소 번호 가운데 올빼미버스도 서는 번호의 수와 그 올빼미 노선들. */
export function owlOverlap(route: FixedRoute): OwlOverlap {
  const nb = getNightBus();
  const owl = owlRouteNos();
  const ars = [...new Set((route.stops ?? []).map((s) => s.stopId))];
  const routes = new Set<string>();
  let shared = 0;
  for (const a of ars) {
    const nos = (nb.byArs.get(a) ?? []).map((v) => v.routeNo).filter((no) => owl.has(no));
    if (nos.length > 0) {
      shared += 1;
      for (const no of nos) routes.add(no);
    }
  }
  return { total: ars.length, shared, owlRoutes: [...routes].sort() };
}

/** 밤 시각을 자정 넘김까지 이어지는 분으로 (12시 전은 다음 날로 본다). */
const nightMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return (h < 12 ? h + 24 : h) * 60 + m;
};
const fmt = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** 공식 운행표가 있는 올빼미버스의 첫차·막차 범위(기점 출발 기준). */
export function owlScheduleRange(): { count: number; firstMin: string; firstMax: string; lastMin: string; lastMax: string } {
  const owl = getNightBus().routes.filter((r) => r.category === 'owl' && r.official);
  const firsts = owl.map((r) => nightMin(r.official!.firstBus)).sort((a, b) => a - b);
  const lasts = owl.map((r) => nightMin(r.official!.lastBus)).sort((a, b) => a - b);
  return { count: owl.length, firstMin: fmt(firsts[0]), firstMax: fmt(firsts[firsts.length - 1]), lastMin: fmt(lasts[0]), lastMax: fmt(lasts[lasts.length - 1]) };
}

/**
 * 표시된 첫차·막차·배차("140 min")가 정확히 맞아떨어질 때만 기점 출발 시각 목록을 만든다(최대 8회).
 * 맞지 않으면 null — 추정으로 시각표를 만들지 않는다.
 */
export function departuresFromHeadway(first: string, last: string, headway: string): string[] | null {
  const m = headway.match(/^(\d+)\s*min$/);
  if (!m) return null;
  const step = Number(m[1]);
  const start = nightMin(first);
  const end = nightMin(last);
  if (step <= 0 || end <= start || (end - start) % step !== 0) return null;
  const n = (end - start) / step + 1;
  if (n > 8) return null;
  return Array.from({ length: n }, (_, i) => fmt(start + i * step));
}

/** 노선이 지나는 정류장 페이지(승인 등록부만) — 같은 이름은 처음 지나는 번호 하나로. */
export function stopPagesOnRoute(route: FixedRoute, ko: boolean): { href: string; name: string }[] {
  const seen = new Set<string>();
  const out: { href: string; name: string }[] = [];
  for (const s of route.stops ?? []) {
    const href = getApprovedStopPath(s.stopId);
    if (!href || seen.has(s.nameKo)) continue;
    seen.add(s.nameKo);
    out.push({ href, name: ko ? s.nameKo : getOfficialStopNameEn(s.stopId) ?? s.nameKo });
  }
  return out;
}

/** 올빼미 노선 번호 묶음 표시 — 4개까지는 전부, 넘으면 앞 3개 + 나머지 수. */
export function owlRoutesLabel(nos: string[], ko: boolean): string {
  if (nos.length <= 4) return nos.join(ko ? '·' : ', ');
  const head = nos.slice(0, 3).join(ko ? '·' : ', ');
  return ko ? `${head} 외 ${nos.length - 3}개 노선` : `${head} and ${nos.length - 3} more`;
}
