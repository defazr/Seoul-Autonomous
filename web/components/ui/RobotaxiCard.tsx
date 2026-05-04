import type { OnDemandService } from '../../lib/types/route';
import { Pill, StatusDot } from './Pill';
import styles from './RobotaxiCard.module.css';

type RobotaxiCardProps = {
  service: OnDemandService;
  locale?: string;
  labels?: {
    appRequired: string;
    checkBeforeRiding: string;
  };
};

function TaxiIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--color-fg-2)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14l2-5h14l2 5" />
      <path d="M3 14v5h18v-5" />
      <circle cx={7} cy={18} r={1.5} />
      <circle cx={17} cy={18} r={1.5} />
      <path d="M9 7V5h6v2" />
    </svg>
  );
}

export function RobotaxiCard({ service, locale = 'en', labels }: RobotaxiCardProps) {
  const isKo = locale === 'ko';
  const isPending = service.verificationLevel === 'official_pending';

  const name = isKo ? service.displayNameKo : service.displayName;
  const subName = isKo ? service.displayName : service.displayNameKo;
  const area = isKo ? service.serviceAreaKo : service.serviceArea;

  const appLabel = labels?.appRequired ?? 'Kakao T (Korean app) required';
  const pendingLabel = labels?.checkBeforeRiding ?? 'CHECK BEFORE RIDING';

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={styles.modeGlyph}>
          <TaxiIcon />
        </div>
        <div className={styles.content}>
          <div className={styles.topRow}>
            <span className={styles.typeLabel}>ROBOTAXI</span>
            {isPending ? (
              <Pill variant="warning">
                <StatusDot color="var(--color-warning)" size={5} />
                <span>{pendingLabel}</span>
              </Pill>
            ) : (
              <Pill variant="success">
                <StatusDot color="var(--color-success)" size={5} />
                <span>OFFICIAL</span>
              </Pill>
            )}
          </div>
          <div className={styles.name}>{name}</div>
          <div className={styles.subName}>{subName}</div>
          <div className={styles.area}>{area}</div>
          {service.appRequired && (
            <div className={styles.appTag}>
              <span className={styles.appDot} />
              <span className={styles.appText}>{appLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
