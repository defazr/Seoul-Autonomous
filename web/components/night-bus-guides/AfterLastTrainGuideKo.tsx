import { Link } from '../../i18n/navigation';
import { PageHero } from '../v2/ui/PageHero';
import { Section } from '../v2/ui/Section';
import { Crumbs } from '../v2/ui/Crumbs';
import { afterLastTrainKo } from '../../data/night-bus-guides/after-last-train.ko';
import styles from './AfterLastTrainGuideKo.module.css';

export function AfterLastTrainGuideKo() {
  const g = afterLastTrainKo;

  return (
    <>
      <PageHero eyebrow="서울 심야버스" title={g.hero.h1} lead={g.hero.summary} crumbs={<Crumbs label="경로 표시" items={[{ href: '/', label: '홈' }, { href: '/night-bus-map', label: '심야버스 노선도' }, { label: '막차 이후 이동' }]} />}>
        <p className={styles.asOf}>{g.hero.asOf}</p>
      </PageHero>
      <Section size="tight" width="text" ariaLabel={g.hero.h1}>

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

      </Section>
    </>
  );
}
