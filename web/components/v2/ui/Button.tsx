import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from '../../../i18n/navigation';
import styles from './ui.module.css';

type Variant = 'primary' | 'ghost' | 'link';
const V: Record<Variant, string> = { primary: styles.primary, ghost: styles.ghost, link: styles.linkBtn };

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; full?: boolean; children: ReactNode };
export function Button({ variant = 'primary', full = false, className, children, ...rest }: BtnProps) {
  return <button className={[styles.btn, V[variant], full ? styles.full : '', className ?? ''].filter(Boolean).join(' ')} {...rest}>{children}</button>;
}

type LinkProps = { href: string; variant?: Variant; full?: boolean; className?: string; children: ReactNode };
export function ButtonLink({ href, variant = 'ghost', full = false, className, children }: LinkProps) {
  return <Link href={href} className={[styles.btn, V[variant], full ? styles.full : '', className ?? ''].filter(Boolean).join(' ')}>{children}</Link>;
}
