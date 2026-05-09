'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import styles from './BackToTopButton.module.css';

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function BackToTopButton() {
  const t = useTranslations('common');
  const [visible, setVisible] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Observe footer to fade out when near
    const footer = document.querySelector('footer');
    if (footer) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => setNearFooter(entry.isIntersecting),
        { rootMargin: '100px 0px 0px 0px' },
      );
      observerRef.current.observe(footer);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      className={`${styles.button}${nearFooter ? ` ${styles.hidden}` : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('backToTop')}
      type="button"
    >
      <ArrowUpIcon />
    </button>
  );
}
