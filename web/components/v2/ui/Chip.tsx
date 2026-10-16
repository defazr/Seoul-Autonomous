import { Link } from '../../../i18n/navigation';
import { onColor, routeDisplayColor } from '../../../lib/v2/route-color';
import styles from './ui.module.css';

type Props = { no: string; color?: string | null; href?: string; locale?: 'ko' | 'en'; size?: 'sm' | 'lg'; title?: string };

/** 노선 번호 칩 — 노선색 바탕, 휘도에 따라 잉크/밝은 글자. href 가 있으면 링크. */
export function RouteChip({ no, color, href, locale, size = 'sm', title }: Props) {
  const bg = routeDisplayColor(no, color);
  const cls = `${styles.chip}${size === 'lg' ? ` ${styles.chipLg}` : ''}`;
  const style = { background: bg, color: onColor(bg) };
  return href ? <Link href={href} locale={locale} className={cls} style={style} title={title}>{no}</Link> : <span className={cls} style={style} title={title}>{no}</span>;
}
