import { Link } from '../../../i18n/navigation';
import styles from './ui.module.css';

/** 경로 표시(빵부스러기) — 내부 링크 겸 뒤로가기. 마지막 항목은 현재 페이지(링크 없음). */
export function Crumbs({ items, label }: { items: { href?: string; label: string }[]; label: string }) {
  return (
    <nav className={styles.crumbs} aria-label={label}>
      <ol>
        {items.map((it, i) => (
          <li key={`${it.href ?? ''}-${it.label}`}>
            {it.href && i < items.length - 1 ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
