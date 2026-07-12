import Link from 'next/link';
import { PageContainer } from '../layout/PageContainer';
import { SiteFooter } from '../common/SiteFooter';
import { PageTopBar } from '../ui/PageTopBar';
import { nightBusGuideEn } from '../../data/night-bus-guide/night-bus-guide.en';
import styles from './NightBusGuideEn.module.css';

export function NightBusGuideEn() {
  const g = nightBusGuideEn;

  return (
    <PageContainer width="default">
      <PageTopBar href="/" ariaLabel="Back to home" />
      <div className={styles.hero}>
        <h1 className={styles.heading}>{g.hero.h1}</h1>
        <p className={styles.summary}>{g.hero.summary}</p>
        <p className={styles.asOf}>{g.hero.asOf}</p>
      </div>

      <dl className={styles.quickFacts}>
        {g.quickFacts.map((f) => (
          <div key={f.label} className={styles.factCard}>
            <dt className={styles.factLabel}>{f.label}</dt>
            <dd className={styles.factValue}>{f.value}</dd>
          </div>
        ))}
      </dl>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.sections.what.title}</h2>
        <p className={styles.body}>{g.sections.what.body}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.sections.when.title}</h2>
        <p className={styles.body}>{g.sections.when.body}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.sections.how.title}</h2>
        <p className={styles.body}>{g.sections.how.body}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.routesTitle}</h2>
        <ul className={styles.routeList}>
          {g.routes.map((r) => (
            <li key={r.number} className={styles.routeItem}>
              <span className={styles.routeNumber}>{r.number}</span>
              <span className={styles.routeEndpoints}>{r.endpoints}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.mapCta.title}</h2>
        <p className={styles.body}>{g.mapCta.body}</p>
        <Link href={g.mapCta.href} className={styles.mapCta}>
          {g.mapCta.cta} →
        </Link>
        <p className={styles.mapNote}>{g.mapCta.note}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.beforeYouRide.title}</h2>
        <p className={styles.body}>{g.beforeYouRide.body}</p>
      </section>

      <SiteFooter />
    </PageContainer>
  );
}
