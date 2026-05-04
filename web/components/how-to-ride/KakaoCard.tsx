import styles from './KakaoCard.module.css';

type KakaoCardProps = {
  title: string;
  titleKr?: string;
  steps: string[];
  note: string;
  isKo?: boolean;
};

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="var(--color-accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={6} y={2} width={12} height={20} rx={2.5} />
      <path d="M11 18h2" />
    </svg>
  );
}

export function KakaoCard({ title, titleKr, steps, note, isKo }: KakaoCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <PhoneIcon />
        </div>
        <div className={styles.headerText}>
          <div className={styles.title}>{title}</div>
          {titleKr && !isKo && (
            <div className={styles.titleSub}>{titleKr}</div>
          )}
        </div>
      </div>
      <div className={styles.steps}>
        {steps.map((step, i) => (
          <div key={i} className={styles.stepRow}>
            <div className={styles.stepNum}>
              <span className={styles.stepNumText}>{i + 1}</span>
            </div>
            <span className={styles.stepText}>{step}</span>
          </div>
        ))}
      </div>
      <p className={styles.note}>{note}</p>
    </div>
  );
}
