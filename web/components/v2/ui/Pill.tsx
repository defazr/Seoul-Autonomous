import type { ReactNode } from 'react';
import styles from './ui.module.css';

/** 작은 상태 라벨 (모노). tone=ok 는 초록 점, accent 는 시안 테두리. */
export function Pill({ tone = 'neutral', dot = false, on = false, children }: { tone?: 'neutral' | 'accent' | 'ok'; dot?: boolean; on?: boolean; children: ReactNode }) {
  const cls = [styles.pill, tone === 'accent' ? styles.pillAccent : '', tone === 'ok' ? styles.pillOk : ''].filter(Boolean).join(' ');
  return <span className={cls}>{dot && <span className={`${styles.dot}${on ? ` ${styles.dotOn}` : ''}`} aria-hidden="true" />}{children}</span>;
}
export function StatusDot({ on }: { on: boolean }) { return <span className={`${styles.dot}${on ? ` ${styles.dotOn}` : ''}`} aria-hidden="true" />; }
