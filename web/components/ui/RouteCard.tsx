import Link from 'next/link';
import type { FixedRoute } from '../../lib/types/route';
import { Pill, StatusDot } from './Pill';
import styles from './RouteCard.module.css';

type RouteCardProps = {
  route: FixedRoute;
  locale?: string;
  verifiedLabel?: string;
};

function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--color-fg-2)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={4} y={4} width={16} height={14} rx={2} />
      <circle cx={8} cy={20} r={1.5} />
      <circle cx={16} cy={20} r={1.5} />
      <path d="M4 12h16M9 4v8M15 4v8" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function StatusPill({ level, verifiedLabel }: { level: string; verifiedLabel: string }) {
  if (level === 'official_confirmed') {
    return (
      <Pill variant="success">
        <StatusDot color="var(--color-success)" size={5} />
        <span>OFFICIAL</span>
      </Pill>
    );
  }
  return (
    <Pill variant="accent">
      <StatusDot color="var(--color-accent)" size={5} />
      <span>{verifiedLabel}</span>
    </Pill>
  );
}

export function RouteCard({ route, locale = 'en', verifiedLabel = 'VERIFIED' }: RouteCardProps) {
  const isKo = locale === 'ko';

  const name = isKo ? route.displayNameKo : route.displayName;
  const subName = isKo ? route.displayName : route.displayNameKo;
  const start = isKo ? route.startPointKo : route.startPoint;
  const end = isKo ? route.endPointKo : route.endPoint;

  return (
    <Link href={`/${locale}/routes/${route.id}`} className={styles.card}>
      <div className={styles.row}>
        <div className={styles.modeGlyph}>
          <BusIcon />
        </div>
        <div className={styles.content}>
          <div className={styles.topRow}>
            <span className={styles.name}>{name}</span>
            <StatusPill level={route.verificationLevel} verifiedLabel={verifiedLabel} />
          </div>
          <div className={styles.subName}>{subName}</div>
          <div className={styles.routeLine}>
            {start} → {end}
          </div>
          <div className={styles.meta}>
            <span className={styles.metaText}>
              {route.firstBus} – {route.lastBus}
            </span>
            {route.headway !== 'Unknown' && (
              <>
                <span className={styles.metaDot} />
                <span className={styles.metaText}>{route.headway}</span>
              </>
            )}
          </div>
        </div>
        <div className={styles.chevron}>
          <ChevronRight />
        </div>
      </div>
    </Link>
  );
}
