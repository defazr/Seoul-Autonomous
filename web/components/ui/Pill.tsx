import styles from './Pill.module.css';

type PillVariant = 'default' | 'accent' | 'success' | 'warning';

type PillProps = {
  children: React.ReactNode;
  variant?: PillVariant;
};

export function StatusDot({
  color = '#00D4FF',
  size = 6,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <span
      className={styles.dot}
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
}

export function Pill({ children, variant = 'default' }: PillProps) {
  return (
    <span className={`${styles.pill} ${styles[variant]}`}>
      {children}
    </span>
  );
}
