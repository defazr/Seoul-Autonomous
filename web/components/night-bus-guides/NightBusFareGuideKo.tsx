import { Link } from '../../i18n/navigation';
import { PageContainer } from '../layout/PageContainer';
import { SiteFooter } from '../common/SiteFooter';
import { nightBusFareKo } from '../../data/night-bus-guides/night-bus-fare.ko';
import styles from './NightBusFareGuideKo.module.css';

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function NightBusFareGuideKo() {
  const g = nightBusFareKo;

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
        <h2 className={styles.sectionTitle}>{g.fare.title}</h2>
        <table className={styles.fareTable}>
          <thead>
            <tr>
              {g.fare.tableHead.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.fare.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                <td>{r.card}</td>
                <td>{r.cash}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {g.fare.notes.map((n) => (
          <p key={n} className={styles.body}>
            {n}
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.payment.title}</h2>
        <ol className={styles.stepList}>
          {g.payment.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className={styles.body}>{g.payment.note}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.transfer.title}</h2>
        <p className={styles.body}>{g.transfer.intro}</p>

        <h3 className={styles.subTitle}>{g.transfer.time.title}</h3>
        <ul className={styles.bulletList}>
          {g.transfer.time.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className={styles.body}>{g.transfer.time.note}</p>

        <h3 className={styles.subTitle}>{g.transfer.count.title}</h3>
        <p className={styles.body}>{g.transfer.count.body}</p>

        <h3 className={styles.subTitle}>{g.transfer.notCounted.title}</h3>
        <p className={styles.body}>{g.transfer.notCounted.body}</p>

        <h3 className={styles.subTitle}>{g.transfer.distance.title}</h3>
        <p className={styles.body}>{g.transfer.distance.body}</p>
        <p className={styles.body}>{g.transfer.distance.extra}</p>
        <ul className={styles.bulletList}>
          {g.transfer.distance.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.nVsA.title}</h2>
        {g.nVsA.paragraphs.map((p) => (
          <p key={p} className={styles.body}>
            {p}
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{g.beforeRide.title}</h2>
        <p className={styles.body}>{g.beforeRide.body}</p>
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
