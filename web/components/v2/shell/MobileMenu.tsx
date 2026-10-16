'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, usePathname } from '../../../i18n/navigation';
import { LangToggle } from './LangToggle';
import { isCurrent, type NavItem } from './NavLinks';
import styles from './Shell.module.css';

export type NavGroup = { title: string; items: NavItem[] };
type Labels = { open: string; close: string; title: string; language: string; enGuideTitle: string };

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/** 모바일 전체 메뉴 — 오른쪽 시트. 헤더의 backdrop-filter 가 fixed 의 기준 상자가 되므로 body 포털로 띄운다. 링크를 누르면 닫히고, Esc 로 닫히며, 열려 있는 동안 본문 스크롤을 잠근다. */
export function MobileMenu({ groups, labels }: { groups: NavGroup[]; labels: Labels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      // 포커스 트랩 — 시트 안의 포커스 가능한 요소 사이에서만 순환
      const items = [...sheetRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); trigger?.focus({ preventScroll: true }); };
  }, [open]);

  return (
    <>
      <button ref={triggerRef} type="button" className={styles.menuBtn} aria-label={labels.open} aria-expanded={open} onClick={() => setOpen(true)}>
        <MenuIcon />
      </button>
      {open && createPortal(
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div ref={sheetRef} className={styles.sheet} role="dialog" aria-modal="true" aria-label={labels.title} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHead}>
              <span className={styles.sheetTitle}>{labels.title}</span>
              <button ref={closeRef} type="button" className={styles.closeBtn} aria-label={labels.close} onClick={() => setOpen(false)}><CloseIcon /></button>
            </div>
            {groups.map((g) => (
              <nav key={g.title} className={styles.group} aria-label={g.title}>
                <p className={styles.groupTitle}>{g.title}</p>
                {g.items.map((it) => (
                  <Link key={it.href} href={it.href} className={styles.sheetLink} aria-current={isCurrent(pathname, it.href) ? 'page' : undefined} onClick={() => setOpen(false)}>{it.label}</Link>
                ))}
              </nav>
            ))}
            <div className={styles.sheetLang}><span>{labels.language}</span><LangToggle enGuideTitle={labels.enGuideTitle} label={labels.language} inline /></div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
