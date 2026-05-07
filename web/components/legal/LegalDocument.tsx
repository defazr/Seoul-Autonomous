import type {
  LegalDocument as LegalDocumentType,
  LegalSection,
  LegalSubsection,
} from '../../lib/types/legal';
import styles from './LegalDocument.module.css';

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  if (parts.length === 1) {
    return <span className={styles.body}>{text}</span>;
  }
  return (
    <span className={styles.body}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className={styles.bold}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div className={styles.bulletList}>
      {items.map((item, i) => (
        <div key={i} className={styles.bulletRow}>
          <span className={styles.bulletDot}>{'\u2022'}</span>
          <span className={`${styles.body} ${styles.bulletText}`}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function SubsectionBlock({ sub }: { sub: LegalSubsection }) {
  return (
    <div className={styles.subsection}>
      <h3 className={styles.h3}>{sub.title}</h3>
      {sub.paragraphs?.map((p, i) => (
        <div key={i} className={styles.paragraph}>
          {renderBoldText(p)}
        </div>
      ))}
      {sub.bulletPoints && sub.bulletPoints.length > 0 && (
        <BulletList items={sub.bulletPoints} />
      )}
    </div>
  );
}

function SectionBlock({ section, index }: { section: LegalSection; index: number }) {
  const numberMatch = section.title.match(/^(\d+\.)\s(.+)$/);

  return (
    <div className={`${styles.sectionBlock}${index > 0 ? ` ${styles.sectionDivider}` : ''}`}>
      <h2 className={styles.h2}>
        {numberMatch ? (
          <>
            <span className={styles.sectionNumber}>{numberMatch[1]}</span>{' '}
            {numberMatch[2]}
          </>
        ) : (
          section.title
        )}
      </h2>
      {section.paragraphs?.map((p, i) => (
        <div key={i} className={styles.paragraph}>
          {renderBoldText(p)}
        </div>
      ))}
      {section.bulletPoints && section.bulletPoints.length > 0 && (
        <BulletList items={section.bulletPoints} />
      )}
      {section.subsections?.map((sub, i) => (
        <SubsectionBlock key={i} sub={sub} />
      ))}
    </div>
  );
}

type Props = {
  document: LegalDocumentType;
  locale: string;
};

export function LegalDocument({ document: doc, locale }: Props) {
  const isKo = locale === 'ko';

  return (
    <div>
      <h1 className={styles.heading}>{doc.title}</h1>
      <p className={styles.caption}>
        {isKo ? `시행일자: ${doc.effectiveDate}` : `Effective date: ${doc.effectiveDate}`}
      </p>
      <p className={styles.caption}>
        {isKo ? `최종 수정일: ${doc.lastUpdated}` : `Last updated: ${doc.lastUpdated}`}
      </p>

      {doc.sections.map((section, i) => (
        <SectionBlock key={i} section={section} index={i} />
      ))}

      <div className={styles.contactBlock}>
        <p className={styles.contactName}>{doc.contact.developer}</p>
        <p className={styles.contactLine}>
          {isKo ? `이메일: ${doc.contact.email}` : `Email: ${doc.contact.email}`}
        </p>
        <p className={styles.contactLine}>
          {isKo ? `소재지: ${doc.contact.location}` : `Location: ${doc.contact.location}`}
        </p>
      </div>
    </div>
  );
}
