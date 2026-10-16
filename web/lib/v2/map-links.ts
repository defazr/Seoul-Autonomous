/**
 * 외부 지도 텍스트 링크 (로고 사용 안 함 — 금지선 5). 좌표가 있으면 카카오맵은 좌표 마커 링크, 없으면 이름 검색.
 * 네이버지도: 정류소는 번호(ARS 5자리) 검색 — 네이버 "정류장번호 검색결과" 에서 서울 정류장이 첫 줄(2026-10-16 22011·01009·01020·13156 4건 확인).
 *   이름 검색은 지하철역·출구가 먼저 나와 정류장이 안 잡힌다(iPhone 실기기 피드백) · 번호+이름 조합은 결과 0 · 좌표 URL 형식은 공식 문서 미확인이라 미사용.
 */
export const kakaoMapLink = (name: string, lat?: number, lon?: number) =>
  lat !== undefined && lon !== undefined ? `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lon}` : `https://map.kakao.com/?q=${encodeURIComponent(name)}`;
export const naverMapLink = (name: string, ars?: string) =>
  ars && /^\d{5}$/.test(ars) ? `https://map.naver.com/p/search/${ars}` : `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
