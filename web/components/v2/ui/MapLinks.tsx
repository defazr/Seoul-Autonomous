import { kakaoMapAppLink, kakaoMapLink, naverMapLink } from '../../../lib/v2/map-links';
import styles from './ui.module.css';

/** 정류장·정류소를 외부 지도에서 찾는 텍스트 링크 두 개 (카카오맵 · 네이버지도). 새 탭. ars(정류소 번호)가 있으면 네이버는 번호 검색. */
export function MapLinks({ name, lat, lon, ars, labels }: { name: string; lat?: number; lon?: number; ars?: string; labels: { kakao: string; naver: string; aria: string } }) {
  return (
    <span className={styles.mapLinks} role="group" aria-label={labels.aria}>
      {/* 터치 기기: 앱으로 바로 · 같은 탭(빈 창 없음) / 마우스 기기: 핀이 찍히는 웹 지도 · 새 탭 — 분기는 styles/v2/base.css 의 v2-touch-only · v2-pointer-only */}
      <a className="v2-touch-only" href={kakaoMapAppLink(name, ars)}>{labels.kakao}</a>
      <a className="v2-touch-only" href={naverMapLink(name, ars)}>{labels.naver}</a>
      <a className="v2-pointer-only" href={kakaoMapLink(name, lat, lon)} target="_blank" rel="noopener noreferrer">{labels.kakao}</a>
      <a className="v2-pointer-only" href={naverMapLink(name, ars)} target="_blank" rel="noopener noreferrer">{labels.naver}</a>
    </span>
  );
}
