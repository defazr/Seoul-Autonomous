'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './MobileDrawer.module.css';

type DrawerLink = {
  href: string;
  label: string;
  separator?: boolean;
};

type MobileDrawerProps = {
  links: DrawerLink[];
  openLabel: string;
  closeLabel: string;
};

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function MobileDrawer({ links, openLabel, closeLabel }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        type="button"
      >
        <MenuIcon />
      </button>

      {open && (
        <div className={styles.overlay} onClick={close}>
          <nav
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <button
                className={styles.closeBtn}
                onClick={close}
                aria-label={closeLabel}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            <div className={styles.drawerLinks}>
              {links.map((link) => (
                <React.Fragment key={link.href}>
                  {link.separator && <hr className={styles.drawerSeparator} />}
                <a
                  href={link.href}
                  className={styles.drawerLink}
                  onClick={close}
                >
                  {link.label}
                </a>
                </React.Fragment>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
