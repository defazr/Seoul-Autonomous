/**
 * 외부 지도 텍스트 링크 (로고 사용 안 함 — 금지선 5). 좌표가 있으면 카카오맵은 좌표 마커 링크, 없으면 이름 검색.
 * 네이버지도는 이름 검색만 쓴다(좌표 URL 형식이 공식 문서로 확인되지 않아 미사용).
 */
export const kakaoMapLink = (name: string, lat?: number, lon?: number) =>
  lat !== undefined && lon !== undefined ? `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lon}` : `https://map.kakao.com/?q=${encodeURIComponent(name)}`;
export const naverMapLink = (name: string) => `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
