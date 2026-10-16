import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '../../i18n/navigation';
import { websiteJsonLd } from '../../lib/seo/jsonld';
import { buildPageMetadata } from '../../lib/seo/metadata';
import { getNightBus, HUBS, NIGHT_META } from '../../lib/night-bus/data';
import { allRouteLines, NODES, RIVER, SCHEMATIC_VB, HUB_NODE, shortName } from '../../lib/night-bus/schematic';
import { R3A_NIGHT_ROUTES, R3A_HUBS } from '../../lib/night-bus/registry';
import { getRouteById } from '../../lib/routes';
import { NIGHT_BUS_GUIDE_PATH } from '../../lib/nav';
import { routeDisplayColor, routeTextColor } from '../../lib/v2/route-color';
import { Section } from '../../components/v2/ui/Section';
import { Card } from '../../components/v2/ui/Card';
import { RouteChip } from '../../components/v2/ui/Chip';
import { SourceBlock, ReportLine } from '../../components/v2/ui/SourceBlock';
import { StatusLine } from '../../components/v2/night/StatusLine';
import { NextIntlClientProvider } from 'next-intl';
import { clientMessages } from '../../lib/v2/client-messages';
import { SearchProvider } from '../../components/v2/home/SearchContext';
import { HeroMap, HeroCaption } from '../../components/v2/home/HeroMap';
import { AskCard } from '../../components/v2/home/AskCard';
import { ResultStage } from '../../components/v2/home/ResultStage';
import { HubCardActions } from '../../components/v2/home/HubCardActions';
import { CONTACT_MAIL } from '../../components/v2/shell/Footer';
import styles from '../../components/v2/home/home.module.css';

/** 모바일 히어로 뷰박스 — 시안 v2.3 과 같은 값 (카드 뒤로 도심부가 오도록). 작도 무수정. */
const MOBILE_VB = { x: 110, y: 17, w: 2200, h: 1436 };
const EXAMPLES: [string, string][] = [['홍대입구역', '강남역'], ['사당자동차학원', '청량리역환승센터'], ['노원역', '강남역']];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return buildPageMetadata({ locale, path: '', title: t('homeTitle'), description: t('homeDescription') });
}

/** 홈 v2 (R3A §12 V3) — 상태줄 → 질문 카드(노선도 위) → 결과 무대 → 바로가기 → 허브 보드 16 → 노선 갤러리 14 → 막차 3가지 → A21 → 출처. */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const t = await getTranslations({ locale, namespace: 'nightHome' });
  const ko = locale === 'ko';

  const nb = getNightBus();
  const owl = nb.routes.filter((r) => r.category === 'owl' && r.official);
  const a21 = getRouteById('simya-a21');
  const owlSchedule = owl.map((r) => ({ no: r.no, first: r.official!.firstBus, last: r.official!.lastBus }));
  const schedule = [...owlSchedule, ...(a21 ? [{ no: 'A21', first: a21.firstBus, last: a21.lastBus }] : [])];
  const stopsCount = owl.reduce((n, r) => n + r.stops.filter((s) => !s.virtual).length, 0);
  const lines = allRouteLines().map((l) => ({ ...l, color: routeDisplayColor(l.no, l.color) }));
  const hubMarks = HUBS.flatMap((h) => { const node = HUB_NODE[h.slug]; const p = node ? NODES[node] : undefined; return p ? [{ label: shortName(node), x: p[0], y: p[1] }] : []; });
  const exposedRoute = (no: string) => (R3A_NIGHT_ROUTES as readonly string[]).includes(no);
  const exposedHub = (slug: string) => (R3A_HUBS as readonly string[]).includes(slug);
  const hubName = (h: (typeof HUBS)[number]) => (ko ? h.nameKo : h.nameEn);
  const meta = { stopsSnapshot: NIGHT_META.stopsSource.snapshot, scheduleRevisedOn: NIGHT_META.scheduleSource.revisedOn };

  const msgs = await clientMessages(locale, ['nightHome']);
  return (
    <NextIntlClientProvider locale={locale} messages={msgs}>
    <SearchProvider dataUrl={`/api/night-bus/client?v=${meta.stopsSnapshot}`} meta={meta} exposedRoutes={R3A_NIGHT_ROUTES} exposedHubs={R3A_HUBS}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />

      <section className={styles.hero} aria-label={t('hero.aria')}>
        <HeroMap lines={lines} nodes={Object.values(NODES)} hubs={hubMarks} river={RIVER.d} vb={SCHEMATIC_VB} mvb={MOBILE_VB} schedule={schedule} />
        <div className={`v2-wrap ${styles.heroWrap}`}>
          <div className={styles.heroLeft}>
            <StatusLine schedule={owlSchedule} owlTotal={owl.length} />
            <AskCard routesCount={owl.length} stopsCount={stopsCount} examples={EXAMPLES} />
          </div>
          <aside className={styles.heroSide}>
            <strong>{t('hero.headline', { n: owl.length })}</strong>
            <HeroCaption schedule={schedule} />
            <Link className={styles.mapLink} href={NIGHT_BUS_GUIDE_PATH}>{t('hero.mapLink')} →</Link>
          </aside>
        </div>
      </section>

      <ResultStage />

      <div className="v2-wrap">
        <nav className={styles.quick} aria-label={t('quick.label')}>
          <span className={styles.quickLabel}>{t('quick.label')}</span>
          {R3A_NIGHT_ROUTES.map((no) => { const r = nb.routeByNo.get(no); return <RouteChip key={no} no={no} color={r?.color} href={`/night-bus/${no.toLowerCase()}`} locale="ko" size="lg" title={ko ? undefined : t('quick.koPage')} />; })}
          <span className={styles.quickSep} aria-hidden="true" />
          {R3A_HUBS.map((slug) => { const h = HUBS.find((x) => x.slug === slug); return h ? <Link key={slug} href={`/hubs/${slug}`} locale="ko" className={styles.quickHub} title={ko ? undefined : t('quick.koPage')}>{hubName(h)}{ko ? '' : ' (KO)'}</Link> : null; })}
        </nav>
      </div>

      <Section id="hubs" eyebrow={t('hubs.eyebrow')} title={t('hubs.title')} lead={t('hubs.lead')}>
        <ul className={styles.hubs}>
          {HUBS.map((h) => (
            <Card as="li" key={h.slug} className={styles.hub}>
              <div>
                <div className={styles.hubName}>{hubName(h)}</div>
                {!ko && <div className={styles.hubSub} lang="ko">{h.nameKo}</div>}
                <div className={styles.hubCnt}>{t('hubs.count', { n: h.routes.length, stops: h.ars.length })}</div>
              </div>
              <div className={styles.chips}>{h.routes.map((no) => <RouteChip key={no} no={no} color={nb.routeByNo.get(no)?.color} href={exposedRoute(no) ? `/night-bus/${no.toLowerCase()}` : undefined} title={!ko && exposedRoute(no) ? t('quick.koPage') : undefined} locale="ko" />)}</div>
              <HubCardActions name={h.nameKo} slug={h.slug} exposed={exposedHub(h.slug)} schedule={schedule.filter((s) => h.routes.includes(s.no))} />
            </Card>
          ))}
        </ul>
      </Section>

      <Section id="fleet" eyebrow={t('fleet.eyebrow')} title={t('fleet.title')} lead={t('fleet.lead', { revisedOn: meta.scheduleRevisedOn })} action={<span className={styles.scrollHint}>{t('fleet.scrollHint')} →</span>}>
        <ul className={styles.fleet}>
          {owl.map((r) => {
            const o = r.official!; const c = routeDisplayColor(r.no, r.color); const ex = exposedRoute(r.no);
            return (
              <li key={r.no} className={styles.routeCard} style={{ ['--c' as string]: c, ['--ct' as string]: routeTextColor(r.no, r.color) }}>
                <Link href={ex ? `/night-bus/${r.no.toLowerCase()}` : NIGHT_BUS_GUIDE_PATH} locale={ex ? 'ko' : undefined} style={{ display: 'grid', gap: 8 }}>
                  <div className={styles.bar} aria-hidden="true" />
                  <div className={styles.no}>{r.no}</div>
                  <div className={styles.ends} lang={ko ? undefined : 'ko'}>{o.ends[0]} ↔ {o.ends[1]}</div>
                  <div className={styles.meta}>
                    <span>{o.firstBus} ~ {o.lastBus}</span>
                    <span>{t('fleet.headway', { headway: o.headway, n: o.vehicles })}</span>
                    <span>{t('fleet.stops', { n: r.stops.filter((s) => !s.virtual).length, km: o.distanceKm })}</span>
                  </div>
                  <div className={styles.cardLink}>{ex ? t('fleet.page') : t('fleet.onMap')} →</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="three" eyebrow={t('three.eyebrow')} title={t('three.title')}>
        <div className={styles.three}>
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="tile" className={styles.tile}>
              <div className={styles.num} aria-hidden="true">{i}</div>
              <h3>{t(`three.t${i}` as 'three.t1')}</h3>
              <p>{t(`three.d${i}` as 'three.d1')}</p>
            </Card>
          ))}
        </div>
      </Section>

      {a21 && (
        <Section id="a21" ariaLabel={t('a21.title')}>
          <div className={styles.a21}>
            <div className={styles.badge} aria-hidden="true">{t('a21.badge')}</div>
            <div>
              <h3>{t('a21.title')}</h3>
              <p>{t('a21.text', { from: ko ? a21.startPointKo : a21.startPoint, to: ko ? a21.endPointKo : a21.endPoint, first: a21.firstBus, last: a21.lastBus })}</p>
              <div className={styles.a21Foot}>
                <Link href={`/routes/${a21.id}`} className={styles.a21Link}>{t('a21.link')} →</Link>
                <span>{t('a21.checked', { date: a21.lastChecked })}</span>
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section id="trust" eyebrow={t('trust.eyebrow')} title={t('trust.title')}>
        <SourceBlock items={[
          { label: t('trust.map'), text: t('trust.mapText') },
          { label: t('trust.stops'), text: t('trust.stopsText', { snapshot: meta.stopsSnapshot }) },
          { label: t('trust.schedule'), text: t('trust.scheduleText', { revisedOn: meta.scheduleRevisedOn }) },
          { label: t('trust.live'), text: t('trust.liveText') },
          { label: t('trust.operator'), text: t('trust.operatorText') },
        ]} />
        <ReportLine label={t('trust.report')} mail={CONTACT_MAIL} />
      </Section>
    </SearchProvider>
    </NextIntlClientProvider>
  );
}
