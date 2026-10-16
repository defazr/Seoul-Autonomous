import { kakaoMapLink, naverMapLink } from '../../../lib/v2/map-links';
import styles from './ui.module.css';

/** 정류장·정류소를 외부 지도에서 찾는 텍스트 링크 두 개 (카카오맵 · 네이버지도). 새 탭. */
export function MapLinks({ name, lat, lon, labels }: { name: string; lat?: number; lon?: number; labels: { kakao: string; naver: string; aria: string } }) {
  return (
    <span className={styles.mapLinks} role="group" aria-label={labels.aria}>
      <a href={kakaoMapLink(name, lat, lon)} target="_blank" rel="noopener noreferrer">{labels.kakao}</a>
      <a href={naverMapLink(name)} target="_blank" rel="noopener noreferrer">{labels.naver}</a>
    </span>
  );
}
