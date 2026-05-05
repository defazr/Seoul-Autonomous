import type { FAQItem } from '../../lib/types/faq';
import styles from './FAQList.module.css';

type FAQListProps = {
  items: FAQItem[];
};

export function FAQList({ items }: FAQListProps) {
  return (
    <dl className={styles.list}>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <dt className={styles.question}>{item.question}</dt>
          <dd className={styles.answer}>{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}
