'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../../i18n/navigation';
import { KO_ONLY_EN_FALLBACK } from '../../../lib/nav';
import styles from './Shell.module.css';

/** KO/EN 전환. 한국어 전용 페이지에서 EN 은 lib/nav.ts 의 대체 목적지(영어 가이드)로 보낸다. */
export function LangToggle({ enGuideTitle, inline = false, label = 'Language' }: { enGuideTitle: string; inline?: boolean; label?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const enFallbackPath = KO_ONLY_EN_FALLBACK[pathname];

  const go = (next: 'en' | 'ko') => {
    if (next === locale) return;
    if (next === 'en' && enFallbackPath) { router.replace(enFallbackPath, { locale: 'en' }); return; }
    router.replace(pathname, { locale: next });
  };

  return (
    <div className={styles.lang} role="group" aria-label={label} style={inline ? { display: 'inline-flex' } : undefined}>
      {(['ko', 'en'] as const).map((lang) => {
        const fallback = lang === 'en' && Boolean(enFallbackPath);
        return (
          <button key={lang} type="button" className={styles.langBtn} aria-pressed={locale === lang} onClick={() => go(lang)} title={fallback ? enGuideTitle : undefined}>
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
