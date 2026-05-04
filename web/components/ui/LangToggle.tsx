'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../i18n/navigation';
import styles from './LangToggle.module.css';

export function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className={styles.container}>
      {(['en', 'ko'] as const).map((lang) => (
        <button
          key={lang}
          className={`${styles.button} ${locale === lang ? styles.active : ''}`}
          onClick={() => handleChange(lang)}
          type="button"
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
