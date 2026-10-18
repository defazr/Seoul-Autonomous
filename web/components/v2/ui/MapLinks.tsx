import { kakaoMapAppLink, kakaoMapLink, naverMapLink } from '../../../lib/v2/map-links';
import styles from './ui.module.css';

/** 정류장·정류소를 외부 지도에서 찾는 텍스트 링크 두 개 (카카오맵 · 네이버지도). 새 탭. ars(정류소 번호)가 있으면 네이버는 번호 검색. */
export function MapLinks({ name, lat, lon, ars, labels }: { name: string; lat?: number; lon?: number; ars?: string; labels: { kakao: string; naver: string; aria: string; newTab?: string } }) {
  // 같은 페이지에 정류소가 둘이면 그룹 이름에 번호를 붙여 링크 목록에서 구분되게 한다 · 새 탭 링크는 숨은 글자로 알린다 (접근성 감사 10-18 FIX 3·4)
  const nt = labels.newTab ? <span className="v2-sr"> {labels.newTab}</span> : null;
  return (
    <span className={styles.mapLinks} role="group" aria-label={ars ? `${labels.aria} · ${ars}` : labels.aria}>
      {/* 터치 기기: 앱으로 바로 · 같은 탭(빈 창 없음) / 마우스 기기: 핀이 찍히는 웹 지도 · 새 탭 — 분기는 styles/v2/base.css 의 v2-touch-only · v2-pointer-only */}
      <a className="v2-touch-only" href={kakaoMapAppLink(name, ars)}>{labels.kakao}</a>
      <a className="v2-touch-only" href={naverMapLink(name, ars)}>{labels.naver}</a>
      <a className="v2-pointer-only" href={kakaoMapLink(name, lat, lon)} target="_blank" rel="noopener noreferrer">{labels.kakao}{nt}</a>
      <a className="v2-pointer-only" href={naverMapLink(name, ars)} target="_blank" rel="noopener noreferrer">{labels.naver}{nt}</a>
    </span>
  );
}
