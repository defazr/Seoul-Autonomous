import styles from './BulletRow.module.css';

type BulletRowProps = {
  text: string;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function BulletRow({ text }: BulletRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.checkWrap}>
        <CheckIcon />
      </div>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
