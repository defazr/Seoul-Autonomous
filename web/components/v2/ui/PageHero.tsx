import type { CSSProperties, ReactNode } from 'react';
import styles from './ui.module.css';

type Props = { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; no?: string; color?: string; crumbs?: ReactNode; children?: ReactNode };

/** 상세 페이지 머리 — 노선색이 있으면 위쪽에 18% 로 번진다 (시안 .rhero). */
export function PageHero({ eyebrow, title, lead, no, color, crumbs, children }: Props) {
  return (
    <header className={styles.hero} style={color ? ({ '--hero-c': color } as CSSProperties) : undefined}>
      <div className={`v2-wrap ${styles.heroWrap}`}>
        {crumbs}
        {eyebrow && <p className="v2-eyebrow">{eyebrow}</p>}
        {no && <div className={styles.heroNo} aria-hidden="true">{no}</div>}
        <h1 className={styles.heroTitle}>{title}</h1>
        {lead && <p className={styles.heroLead}>{lead}</p>}
        {children}
      </div>
    </header>
  );
}
