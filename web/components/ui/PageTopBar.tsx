import { Link } from '../../i18n/navigation';
import styles from './PageTopBar.module.css';

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function PageTopBar({
  href,
  ariaLabel,
}: {
  href: string;
  ariaLabel: string;
}) {
  return (
    <div className={styles.topBar}>
      <Link href={href} className={styles.backBtn} aria-label={ariaLabel}>
        <ChevronLeft />
      </Link>
    </div>
  );
}
