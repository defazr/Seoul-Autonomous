/**
 * R3a 노출 등록부 — 수직 슬라이스 범위 (R3A-VERTICAL-SLICE-PLAN-20261015.md §1·§2).
 * APPROVED_STOPS(stop-pages.ts) 와 같은 성격: Graph/데이터에서 파생하지 않고 결정으로만 넓힌다 (R3b).
 * URL identity = 노선번호 소문자(n61) · 허브 slug(night-bus-hubs.json).
 */
export const R3A_NIGHT_ROUTES = ['N15', 'N61', 'N31', 'N13', 'N16'] as const; // 네이버 롱테일 상위 5 (2026-10-15 데이터랩)
export const R3A_HUBS = ['gangnam-station', 'hongdae-entrance', 'dongdaemun-station'] as const;

export function nightRoutePath(no: string): string | undefined {
  return (R3A_NIGHT_ROUTES as readonly string[]).includes(no.toUpperCase()) ? `/night-bus/${no.toLowerCase()}` : undefined;
}
export function hubPath(slug: string): string | undefined {
  return (R3A_HUBS as readonly string[]).includes(slug) ? `/hubs/${slug}` : undefined;
}
