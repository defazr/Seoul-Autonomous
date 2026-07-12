import { Link } from '../../i18n/navigation';
import { PageContainer } from '../layout/PageContainer';
import { SiteFooter } from '../common/SiteFooter';
import { afterLastTrainKo } from '../../data/night-bus-guides/after-last-train.ko';
import styles from './AfterLastTrainGuideKo.module.css';

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function AfterLastTrainGuideKo() {
  const g = afterLastTrainKo;

  return (
    <PageContainer width="default">
      {/* TopBar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft />
        </Link>
      </div>

      <div className={styles.hero}>
        <h1 className={styles.heading}>{g.hero.h1}</h1>
        <p className={styles.summary}>{g.hero.summary}</p>
        <p className={styles.asOf}>{g.hero.asOf}</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.firstCheck.title}</h2>
        {g.firstCheck.paragraphs.map((p) => (
          <p key={p} className={styles.body}>
            {p}
          </p>
        ))}
        <Link href={g.firstCheck.cta.href} className={styles.cta}>
          {g.firstCheck.cta.label} →
        </Link>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.decision.title}</h2>
        <ol className={styles.stepList}>
          {g.decision.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.direct.title}</h2>
        {g.direct.paragraphs.map((p) => (
          <p key={p} className={styles.body}>
            {p}
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.transfer.title}</h2>
        {g.transfer.paragraphs.map((p) => (
          <p key={p} className={styles.body}>
            {p}
          </p>
        ))}
        <Link href={g.transfer.link.href} className={styles.cta}>
          {g.transfer.link.label} →
        </Link>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.outOfNetwork.title}</h2>
        {g.outOfNetwork.paragraphs.map((p) => (
          <p key={p} className={styles.body}>
            {p}
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.lastDeparture.title}</h2>
        {g.lastDeparture.paragraphs.map((p) => (
          <p key={p} className={styles.body}>
            {p}
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.mapUsage.title}</h2>
        <ol className={styles.stepList}>
          {g.mapUsage.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <Link href={g.mapUsage.cta.href} className={styles.cta}>
          {g.mapUsage.cta.label} →
        </Link>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.related.title}</h2>
        <ul className={styles.linkList}>
          {g.related.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={styles.internalLink}>
                {l.label} →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.sources.title}</h2>
        <ul className={styles.linkList}>
          {g.sources.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={styles.externalLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </PageContainer>
  );
}
