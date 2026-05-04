'use client';

import { useState } from 'react';
import styles from './FAQItem.module.css';

type FAQItemProps = {
  question: string;
  answer: string[];
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="var(--color-fg-2)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="var(--color-fg-2)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
    </svg>
  );
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.header}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className={styles.question}>{question}</span>
        <span className={styles.toggle}>
          {open ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>
      {open && (
        <div className={styles.body}>
          {answer.map((line, i) => (
            <p key={i} className={styles.answerLine}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
