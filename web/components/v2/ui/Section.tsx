import type { ReactNode } from 'react';
import styles from './ui.module.css';

type Props = { id?: string; eyebrow?: string; title?: ReactNode; lead?: ReactNode; action?: ReactNode; tone?: 'default' | 'band'; size?: 'default' | 'tight'; width?: 'default' | 'text'; children?: ReactNode; ariaLabel?: string; className?: string };

/** 홈·상세 공통 블록. 제목 머리(eyebrow·h2·lead·action) + 내용. wrap 포함. */
export function Section({ id, eyebrow, title, lead, action, tone = 'default', size = 'default', width = 'default', children, ariaLabel, className }: Props) {
  const cls = [styles.block, tone === 'band' ? styles.band : '', size === 'tight' ? styles.tight : '', className ?? ''].filter(Boolean).join(' ');
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={cls} aria-labelledby={title && titleId ? titleId : undefined} aria-label={!title ? ariaLabel : undefined}>
      <div className={`v2-wrap${width === 'text' ? ` ${styles.text}` : ''}`}>
        {(eyebrow || title || lead || action) && (
          <div className={styles.head}>
            <div>
              {eyebrow && <p className="v2-eyebrow">{eyebrow}</p>}
              {title && <h2 id={titleId}>{title}</h2>}
              {lead && <p className={styles.lead}>{lead}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
