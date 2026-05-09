import styles from './RouteGroupCard.module.css';

type RouteGroupCardProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  meta: string;
};

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function RouteGroupCard({ href, icon, title, meta }: RouteGroupCardProps) {
  return (
    <a href={href} className={styles.card}>
      <div className={styles.row}>
        <div className={styles.iconBox}>
          {icon}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.meta}>{meta}</div>
        </div>
        <div className={styles.chevron}>
          <ChevronRight />
        </div>
      </div>
    </a>
  );
}
