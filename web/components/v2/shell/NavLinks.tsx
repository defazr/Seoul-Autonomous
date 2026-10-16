'use client';

import { Link, usePathname } from '../../../i18n/navigation';
import styles from './Shell.module.css';

export type NavItem = { href: string; label: string };

function isCurrent(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

/** 데스크톱 상단 내비. 현재 경로 표시만 클라이언트에서 계산한다. */
export function NavLinks({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label={label}>
      {items.map((it) => (
        <Link key={it.href} href={it.href} className={styles.navLink} aria-current={isCurrent(pathname, it.href) ? 'page' : undefined}>
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

export { isCurrent };
