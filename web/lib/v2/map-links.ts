/**
 * 외부 지도 텍스트 링크 (로고 사용 안 함 — 금지선 5). 좌표가 있으면 카카오맵은 좌표 마커 링크, 없으면 이름 검색.
 * 네이버지도: 정류소는 번호(ARS 5자리) 검색 — 네이버 "정류장번호 검색결과" 에서 서울 정류장이 첫 줄(2026-10-16 22011·01009·01020·13156 4건 확인).
 *   이름 검색은 지하철역·출구가 먼저 나와 정류장이 안 잡힌다(iPhone 실기기 피드백) · 번호+이름 조합은 결과 0 · 좌표 URL 형식은 공식 문서 미확인이라 미사용.
 */
export const kakaoMapLink = (name: string, lat?: number, lon?: number) =>
  lat !== undefined && lon !== undefined ? `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lon}` : `https://map.kakao.com/?q=${encodeURIComponent(name)}`;
/** 정류소는 번호, 아니면 이름. 허브처럼 "종로2가·종각" 으로 합친 이름은 앞부분만 (합친 이름은 지도 검색 결과가 없다). */
const query = (name: string, ars?: string) => (ars && /^\d{5}$/.test(ars) ? ars : name.split('·')[0].trim());
export const naverMapLink = (name: string, ars?: string) => `https://map.naver.com/p/search/${encodeURIComponent(query(name, ars))}`;
/**
 * 터치 기기(폰·태블릿)용 카카오맵 — 앱으로 바로 넘어가는 경로. 카카오맵 앱의 유니버설 링크 목록(AASA)이 /link/* 를 제외해서(NOT /link/*)
 * 기존 /link/map 링크는 앱이 깔려 있어도 웹을 거쳤다(iPhone 피드백 10-16). /actions/searchView 는 목록에 있어 앱이 있으면 앱, 없으면 모바일 웹 검색
 * — 정류소 번호 검색은 웹에서도 해당 서울 정류장이 첫 줄(22011 · 01009 확인).
 */
export const kakaoMapAppLink = (name: string, ars?: string) => `https://m.map.kakao.com/actions/searchView?q=${encodeURIComponent(query(name, ars))}`;
