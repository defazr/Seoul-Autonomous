import type { ReactNode } from 'react';
import { Link } from '../../../i18n/navigation';
import { Chevron } from './RouteCard';
import styles from './transit.module.css';

/** 노선 묶음 카드 (새벽 노선 · 심야 노선) — 노선 목록 상단 바로가기. */
export function GroupCard({ href, icon, title, meta }: { href: string; icon: ReactNode; title: string; meta: string }) {
  return (
    <Link href={href} className={styles.group}>
      <span className={styles.glyph}>{icon}</span>
      <span><span className={styles.groupTitle}>{title}</span><span className={styles.groupMeta} style={{ display: 'block' }}>{meta}</span></span>
      <Chevron />
    </Link>
  );
}
