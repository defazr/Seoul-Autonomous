import type { ReactNode } from 'react';
import styles from './ui.module.css';

/** 근거 블록 — 항목마다 '무엇 / 어디서 · 언제'. 날짜는 호출부가 SSoT _meta 에서 넣는다. */
export function SourceBlock({ items }: { items: { label: string; text: ReactNode }[] }) {
  return (
    <div className={styles.sources}>
      {items.map((it) => <div key={it.label}><b>{it.label}</b>{it.text}</div>)}
    </div>
  );
}

/** 제보 경로 한 줄 — 모든 상세 페이지 근거 섹션 끝에 붙는다. */
export function ReportLine({ label, mail }: { label: string; mail: string }) {
  return <p className={styles.report}><span>{label}</span><a className={styles.mail} href={`mailto:${mail}`}>{mail}</a></p>;
}
