'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../i18n/navigation';
import { KO_ONLY_EN_FALLBACK } from '../../lib/nav';
import styles from './LangToggle.module.css';

export function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // 한국어 전용 페이지: EN 버튼은 매핑된 영어 가이드로 이동 (완전한 번역본이 아님을 라벨로 표시)
  const enFallbackPath = KO_ONLY_EN_FALLBACK[pathname];

  const handleChange = (newLocale: string) => {
    if (newLocale === 'en' && enFallbackPath) {
      router.replace(enFallbackPath, { locale: 'en' });
      return;
    }
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className={styles.container}>
      {(['en', 'ko'] as const).map((lang) => {
        const isGuideFallback = lang === 'en' && Boolean(enFallbackPath);
        return (
          <button
            key={lang}
            className={`${styles.button} ${locale === lang ? styles.active : ''}`}
            onClick={() => handleChange(lang)}
            type="button"
            title={isGuideFallback ? 'Open the English night-bus guide' : undefined}
            aria-label={isGuideFallback ? 'Open the English night-bus guide' : undefined}
          >
            {isGuideFallback ? 'EN guide' : lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
