/**
 * 정류장 장소(place) 등록부 — R3b-1 (2026-10-16 · 포그린 결정 B · CC 결정 D1·D2).
 *
 * 계약 (docs/strategy/STOP-URL-POLICY-20260826.md 2026-10-16 개정 · docs/worklogs/R3B-STOP-MERGE-DESIGN-20261016.md §2):
 *   - URL 단위 = 장소(같은 이름의 방향쌍 ARS 집합). 한 장소 = 한 페이지, ARS 는 페이지 안 절(#ars-XXXXX)의 identity 다.
 *   - 이 목록은 Graph 에서 파생하지 않는다 — Stage 1 심사로 승인된 7 ARS + 같은 장소의 반대편 01020(D2)만 둔다.
 *     파생하면 심사 결과가 아니라 데이터 조건이 URL 을 만들게 되어 정책 §4·§5 를 위반한다.
 *   - slug 는 표시용 리터럴이다. 런타임 slugify 로 재생성하지 않는다 (공식명 개칭 시에도 URL 안정).
 *   - 링크 함수(getApprovedStopPath)와 도착정보 API 허용 술어(ARRIVAL_STOP_IDS)는 분리한다 (Codex BLOCK 2) —
 *     01020 은 장소 페이지의 절이지만 도착정보 허용 범위에는 들어가지 않는다.
 *   - 여기 없는 slug·ARS 는 페이지·링크를 만들지 않는다 (notFound). Stage 2 는 미승인 — 이 배열을 넓히는 것은 별도 승인 사항이다.
 *   - 옛 ARS URL(/stops/01009-gwanghwamun-station 등 7×2)은 data/legacy-redirects.json 에서 장소 URL#ars 로 영구 이동한다.
 */

export type StopPlace = {
  /** `/[locale]/stops/<slug>` */
  slug: string;
  /** 플랫폼 공통 공식 한국어명 (빌드 시 Graph 와 대조 — 다르면 실패) */
  nameKo: string;
  /** routes.json 형식 5자리 ARS. 표시 순서 = 페이지의 절 순서(ARS 오름차순) */
  platforms: readonly string[];
};

export const STOP_PLACES: readonly StopPlace[] = [
  { slug: 'gwanghwamun-station', nameKo: '광화문역', platforms: ['01009', '01010'] },
  { slug: 'jongno-2-ga', nameKo: '종로2가', platforms: ['01013', '01014'] },
  { slug: 'seoul-museum-of-history-gyeonghuigung-palace', nameKo: '서울역사박물관.경희궁앞', platforms: ['01007', '01008'] },
  { slug: 'jongno-5-ga-gwangjang-market', nameKo: '종로5가.광장시장', platforms: ['01019', '01020'] },
] as const;

/**
 * 도착정보 API(/api/arrivals) 허용 범위 — RT-2·Stage 1 승인 7 ARS 리터럴 (허브 ARS 는 API 쪽에서 따로 더한다).
 * 장소 등록부에서 파생하지 않는다: 01020 을 장소에 넣는 것이 API 허용 범위 확대가 되면 안 된다.
 */
export const ARRIVAL_STOP_IDS: ReadonlySet<string> = new Set(['01009', '01010', '01013', '01014', '01007', '01008', '01019']);

const bySlug = new Map(STOP_PLACES.map((place) => [place.slug, place]));
const byArs = new Map(STOP_PLACES.flatMap((place) => place.platforms.map((ars) => [ars, place] as const)));

/** slug 가 등록부에 정확히 있을 때만 반환한다. */
export function getPlaceBySlug(slug: string): StopPlace | undefined {
  return bySlug.get(slug);
}

export function getPlaceByArs(ars: string): StopPlace | undefined {
  return byArs.get(ars);
}

/** 장소 페이지 안 플랫폼 절의 id (#ars-01009). 옛 URL 리다이렉트 목적지와 같은 모양이다. */
export const platformAnchor = (ars: string) => `ars-${ars}`;

/** 정류장 링크(노선 페이지·묶음 페이지용) — 장소 URL + 플랫폼 앵커. 등록부 밖 ARS 는 undefined (링크를 만들지 않는다). */
export function getApprovedStopPath(stopId: string): string | undefined {
  const place = byArs.get(stopId);
  return place ? `/stops/${place.slug}#${platformAnchor(stopId)}` : undefined;
}
