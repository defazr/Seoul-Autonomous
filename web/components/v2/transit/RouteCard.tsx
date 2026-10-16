import { Link } from '../../../i18n/navigation';
import type { RouteListItem } from '../../../lib/types/route';
import styles from './transit.module.css';

function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x={4} y={4} width={16} height={14} rx={2} /><circle cx={8} cy={20} r={1.5} /><circle cx={16} cy={20} r={1.5} /><path d="M4 12h16M9 4v8M15 4v8" />
    </svg>
  );
}
export function Chevron() {
  return <svg className={styles.chev} viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>;
}
/** 노선 이름의 끝 코드(A01·A21·A160 …)를 뽑아 배지로 쓴다. 없으면 버스 아이콘. */
export const routeCode = (name: string) => name.match(/\bA\d{2,3}\b/)?.[0] ?? null;

/** 자율주행 고정 노선 카드 — 이름·구간·표시 시각. 데이터는 RouteListItem(표시 필드만). */
export function RouteCard({ route, locale = 'en' }: { route: RouteListItem; locale?: string }) {
  const ko = locale === 'ko';
  const name = ko ? route.displayNameKo : route.displayName;
  const sub = ko ? route.displayName : route.displayNameKo;
  const code = routeCode(route.displayName);
  return (
    <Link href={`/routes/${route.id}`} className={styles.card}>
      <span className={styles.glyph}>{code ? <span className={styles.code}>{code}</span> : <BusIcon />}</span>
      <span>
        <span className={styles.name}>{name}</span>
        <span className={styles.sub}>{sub}</span>
        <span className={styles.line}>{ko ? route.startPointKo : route.startPoint} → {ko ? route.endPointKo : route.endPoint}</span>
        <span className={styles.meta}>
          <b>{route.firstBus === route.lastBus ? route.firstBus : `${route.firstBus} – ${route.lastBus}`}</b>
          {route.headway !== 'Unknown' && <><span className={styles.dot} aria-hidden="true" /><span>{route.headway}</span></>}
        </span>
      </span>
      <Chevron />
    </Link>
  );
}
