'use client';

import styles from './transit.module.css';

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className={styles.search}>
      <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx={11} cy={11} r={7} /><path d="M21 21l-4.3-4.3" /></svg>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
    </div>
  );
}

export function SegmentedControl({ options, value, onChange, label }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div className={styles.seg} role="radiogroup" aria-label={label}>
      {options.map((o) => <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className={styles.segBtn} onClick={() => onChange(o.value)}>{o.label}</button>)}
    </div>
  );
}
