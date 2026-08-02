// Round 26-B: 전역 내비 심야버스 가이드 링크와 언어 토글 대응 경로의 SSOT.
// 라벨은 i18n 키 `nav.nightBusGuide`로 관리한다 (ko: 심야버스 가이드 / en: Night Bus Guide).

/** 헤더·드로어·푸터가 공통 참조하는 심야버스 가이드 경로 (locale prefix 제외). */
export const NIGHT_BUS_GUIDE_PATH = '/night-bus-map';

/**
 * 한국어 전용 페이지에서 EN 토글 시 이동할 영어 대체 목적지.
 * key/value 모두 locale prefix 제외 경로. 여기 없는 경로는 동일 경로 locale 전환.
 */
export const KO_ONLY_EN_FALLBACK: Record<string, string> = {
  '/night-bus-fare': NIGHT_BUS_GUIDE_PATH,
  '/after-last-train': NIGHT_BUS_GUIDE_PATH,
  '/updates/night-bus-map-launch': NIGHT_BUS_GUIDE_PATH,
};
