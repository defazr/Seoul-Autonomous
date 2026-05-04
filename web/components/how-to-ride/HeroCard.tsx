import styles from './HeroCard.module.css';

type HeroCardProps = {
  title: string;
  description: string;
  bullets: string[];
};

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="var(--color-accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={3} y={3} width={7} height={7} rx={1} />
      <rect x={14} y={3} width={7} height={7} rx={1} />
      <rect x={3} y={14} width={7} height={7} rx={1} />
      <path d="M14 14h3v3h-3zM20 14v7h-3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function SensorIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="var(--color-accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={3} />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

const BULLET_ICONS = [<QRIcon key="qr" />, <CheckIcon key="check" />, <SensorIcon key="sensor" />];

export function HeroCard({ title, description, bullets }: HeroCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.badge}>
        <SparkleIcon />
        <span className={styles.badgeText}>START HERE</span>
      </div>
      <div className={styles.title}>{title}</div>
      <p className={styles.desc}>{description}</p>
      <div className={styles.bullets}>
        {bullets.map((text, i) => (
          <div key={i} className={styles.bulletRow}>
            <div className={styles.bulletIcon}>
              {BULLET_ICONS[i] || BULLET_ICONS[0]}
            </div>
            <span className={styles.bulletText}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
