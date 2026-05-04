import styles from './InfoCard.module.css';

type InfoCardProps = {
  label: string;
  value: string;
  accent?: boolean;
};

export function InfoCard({ label, value, accent }: InfoCardProps) {
  const displayValue = value === 'Unknown' ? '\u2014' : value;

  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={`${styles.value} ${accent ? styles.valueAccent : ''}`}>
        {displayValue}
      </div>
    </div>
  );
}
