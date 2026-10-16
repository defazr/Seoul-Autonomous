import type { CSSProperties, ElementType, ReactNode } from 'react';
import styles from './ui.module.css';

type Props = { as?: ElementType; variant?: 'surface' | 'glass' | 'tile'; hover?: boolean; className?: string; style?: CSSProperties; children: ReactNode; [k: string]: unknown };

/** 표면 카드. surface = 보드·목록, glass = 지도 위 질문 카드, tile = 설명 타일. */
export function Card({ as: Tag = 'div', variant = 'surface', hover = false, className, style, children, ...rest }: Props) {
  const v = variant === 'glass' ? styles.glass : variant === 'tile' ? styles.tile : styles.card;
  return <Tag className={[v, hover ? styles.hover : '', className ?? ''].filter(Boolean).join(' ')} style={style} {...rest}>{children}</Tag>;
}
