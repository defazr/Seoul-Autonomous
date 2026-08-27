/**
 * Phase Stop-1E — Stage 1 승인 Stop 페이지 registry.
 *
 * 계약 (docs/strategy/STOP-URL-POLICY-20260826.md,
 *       docs/worklogs/STAGE1-STOP-PAGE-DESIGN-20260826.md):
 *   - Stage 1 은 multi-route Stop 33개를 "심사"한 결과 승인된 7개만 URL 을 갖는다.
 *     따라서 이 목록은 Graph 에서 파생하지 않는다 — 파생하면 심사 결과가 아니라
 *     데이터 조건이 URL 을 만들게 되어 정책 §4·§5 를 위반한다.
 *   - URL identity 는 언제나 ARS stopId 다. slug 의 이름부는 공식 영문명에서 유도한
 *     표시용 문자열이며, 런타임 slugify 로 재생성하지 않는다 (공식명 개칭 시에도 URL 안정).
 *   - 여기 없는 stopId·slug 는 페이지를 만들지 않는다 (notFound).
 *   - Stage 2 는 미승인 상태다. 이 배열을 넓히는 것은 별도 승인 사항이다.
 */

export type ApprovedStop = {
  /** routes.json 형식 5자리 ARS 문자열 */
  stopId: string;
  /** `/[locale]/stops/<slug>` 의 slug. `<stopId>-<readable-name>` */
  slug: string;
};

export const APPROVED_STOPS: readonly ApprovedStop[] = [
  { stopId: '01009', slug: '01009-gwanghwamun-station' },
  { stopId: '01010', slug: '01010-gwanghwamun-station' },
  { stopId: '01013', slug: '01013-jongno-2-ga' },
  { stopId: '01014', slug: '01014-jongno-2-ga' },
  { stopId: '01007', slug: '01007-seoul-museum-of-history-gyeonghuigung-palace' },
  { stopId: '01008', slug: '01008-seoul-museum-of-history-gyeonghuigung-palace' },
  { stopId: '01019', slug: '01019-jongno-5-o-ga-gwangjang-market' },
] as const;

const bySlug = new Map(APPROVED_STOPS.map((stop) => [stop.slug, stop]));
const byStopId = new Map(APPROVED_STOPS.map((stop) => [stop.stopId, stop]));

/** slug 가 승인 목록에 정확히 있을 때만 반환한다. stopId 만 맞는 변형 slug 는 미승인이다. */
export function getApprovedStopBySlug(slug: string): ApprovedStop | undefined {
  return bySlug.get(slug);
}

/** 승인된 Stop 의 상세 URL. 미승인 stopId 는 undefined — 호출부가 링크를 만들지 않는다. */
export function getApprovedStopPath(stopId: string): string | undefined {
  const stop = byStopId.get(stopId);
  return stop ? `/stops/${stop.slug}` : undefined;
}
