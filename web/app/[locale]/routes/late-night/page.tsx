import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { getLateNightRoutes, getOnDemandServices } from '../../../../lib/routes';
import { toRouteItem, toRobotaxiItem } from '../../../../lib/transit-items';
import { departuresFromHeadway, owlOverlap, owlScheduleRange, stopPagesOnRoute } from '../../../../lib/route-groups';
import { NIGHT_META } from '../../../../lib/night-bus/data';
import { RouteCard } from '../../../../components/v2/transit/RouteCard';
import { RobotaxiCard } from '../../../../components/v2/transit/RobotaxiCard';
import { PageHero } from '../../../../components/v2/ui/PageHero';
import { Section } from '../../../../components/v2/ui/Section';
import { Crumbs } from '../../../../components/v2/ui/Crumbs';
import { SourceBlock, ReportLine } from '../../../../components/v2/ui/SourceBlock';
import { CONTACT_MAIL } from '../../../../components/v2/shell/Footer';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../../lib/seo/metadata';
import { Link } from '../../../../i18n/navigation';
import type { OperationalField, OperationalSource } from '../../../../lib/types/route';
import styles from '../group.module.css';

export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'routeGroups.lateNight' });
  return buildPageMetadata({ locale, path: '/routes/late-night', title: t('title'), description: t('description') });
}

/** 공식 확인된 값만 꺼낸다(C2O 계약 — official_confirmed + confirmed). */
const confirmed = <T,>(f: OperationalField<T>): T | null => (f.verificationGrade === 'official_confirmed' && f.currentState === 'confirmed' ? f.value : null);

export default async function LateNightPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const ko = locale === 'ko';
  const t = await getTranslations({ locale, namespace: 'routeGroups.lateNight' });
  const tg = await getTranslations({ locale, namespace: 'routeGroups' });
  const tc = await getTranslations({ locale, namespace: 'routeDetail' });
  const tr = await getTranslations({ locale, namespace: 'routes' });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const ts = await getTranslations({ locale, namespace: 'shell' });
  const routes = getLateNightRoutes();
  const tsStatus = await getTranslations({ locale, namespace: 'status' });
  const labels = { appRequired: tr('robotaxi.appRequired'), checkBeforeRiding: tsStatus('checkBeforeRiding'), fareTitle: tr('robotaxi.fareTitle'), hoursTitle: tr('robotaxi.hoursTitle'), reservationTitle: tr('robotaxi.reservationTitle'), reservationRealtimeCall: tr('robotaxi.reservationRealtimeCall'), appTitle: tr('robotaxi.appTitle'), appPurposes: tr('robotaxi.appPurposes'), operatorTitle: tr('robotaxi.operatorTitle'), sourcePrefix: tr('robotaxi.sourcePrefix'), effectivePrefix: tr('robotaxi.effectivePrefix') };
  const rawServices = getOnDemandServices();
  const services = rawServices.map((svc) => toRobotaxiItem(svc, (start, end) => tr('robotaxi.hoursWeekdayOvernight', { start, end })));

  // R3b-2 본문 — 노선·서비스가 지금 구성(심야A21 1 + 강남 로보택시 1)일 때만 전용 문단을 쓴다. 구성이 바뀌면 카드만 남는다.
  const a21 = routes.length === 1 && routes[0].id === 'simya-a21' ? routes[0] : null;
  const taxi = rawServices.length === 1 && rawServices[0].id === 'gangnam-robotaxi' ? rawServices[0] : null;
  const owl = owlScheduleRange();
  const a21Owl = a21 ? owlOverlap(a21) : null;
  const deps = a21 ? departuresFromHeadway(a21.firstBus, a21.lastBus, a21.headway) : null;
  const depList = deps?.join(ko ? '·' : ', ') ?? '';
  const a21Stops = a21 ? stopPagesOnRoute(a21, ko) : [];
  const hours = taxi ? confirmed(taxi.operatingHours) : null;
  const fare = taxi ? confirmed(taxi.fare) : null;
  const bands = fare?.kind === 'time_bands' ? fare.bands.map((b) => b.amount) : [];
  const won = (n: number) => n.toLocaleString('en-US');
  const area = taxi ? (ko ? taxi.serviceAreaKo : taxi.serviceArea.charAt(0).toLowerCase() + taxi.serviceArea.slice(1)) : '';
  const src = (s: OperationalSource | undefined) => s && (
    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{`「${s.title}」 ${s.publishedAt}`}</a>
  );
  const intro = a21 && taxi ? t('intro', { bus: ko ? a21.displayNameKo : a21.displayName, taxi: ko ? taxi.displayNameKo : taxi.displayName }) : t('introFallback');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: 'Routes', path: '/routes' }, { name: t('title'), path: '/routes/late-night' }], locale)) }} />
      <PageHero eyebrow={tp('group.eyebrow')} title={t('title')} lead={intro} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: ts('nav.home') }, { href: '/routes', label: tr('title') }, { label: t('title') }]} />} />
      <Section size="tight" ariaLabel={t('title')}>
        <div className={styles.grid}>
          {routes.map((route) => <RouteCard key={route.id} route={toRouteItem(route)} locale={locale} />)}
          {services.map((svc) => <RobotaxiCard key={svc.id} service={svc} locale={locale} labels={labels} />)}
        </div>
      </Section>

      {(a21 || taxi) && (
        <Section size="tight" ariaLabel={t('title')}>
          <div className={styles.split}>
            {a21 && a21Owl && (
              <div className={styles.panel} id="simya-a21">
                <h2>{t('a21.title')}</h2>
                <div className={styles.prose}>
                  <p>{t('a21.route', { stops: a21Owl.total })}</p>
                  {deps && <p>{t('a21.departures', { first: a21.firstBus, last: a21.lastBus, headway: a21.headway.replace(/\D/g, ''), list: depList, n: deps.length })}{a21.daysOfOperation === 'weekday' && <> {t('a21.weekday')}</>}</p>}
                  <p>{a21Owl.shared === a21Owl.total
                    ? t('a21.owlAll', { stops: a21Owl.total, owlN: a21Owl.owlRoutes.length, n: deps?.length ?? 0 })
                    : t('a21.owlSome', { stops: a21Owl.total, shared: a21Owl.shared, owlN: a21Owl.owlRoutes.length })}</p>
                </div>
                {a21Stops.length > 0 && (
                  <div className={styles.linkGroup}>
                    <p className={styles.linkLead}>{t('a21.stopsLead')}</p>
                    <p className={styles.links}>
                      {a21Stops.map((s) => <Link key={s.href} href={s.href} className={styles.crossLink}>{s.name} →</Link>)}
                    </p>
                  </div>
                )}
              </div>
            )}
            {taxi && (
              <div className={styles.panel} id="gangnam-robotaxi">
                <h2>{t('taxi.title')}</h2>
                <div className={styles.prose}>
                  <p>{t('taxi.area', { area, app: taxi.appName })}</p>
                  {(hours || bands.length > 0) && (
                    <p>
                      {hours && t('taxi.hours', { start: hours.start, end: hours.end })}
                      {hours && bands.length > 0 && ' '}
                      {bands.length > 0 && t('taxi.fare', { min: won(Math.min(...bands)), max: won(Math.max(...bands)) })}
                    </p>
                  )}
                  <p>{t('taxi.fleet')}</p>
                </div>
                <p className={styles.links}>
                  <Link href="/updates/gangnam-robotaxi-expanded-to-19" className={styles.crossLink}>{t('taxi.fleetLink')} →</Link>
                </p>
              </div>
            )}
          </div>
        </Section>
      )}

      {a21 && taxi && (
        <Section size="tight" width="text" id="choose" title={t('choose.title')}>
          <ul className={styles.rules}>
            {deps && <li>{t('choose.a21', { list: depList })}</li>}
            {hours && <li>{t('choose.taxi', { start: hours.start, end: hours.end })}</li>}
            <li>{t('choose.owl', { owlCount: owl.count })}</li>
            {a21.daysOfOperation === 'weekday' && hours?.days === 'weekday' && <li>{t('choose.days')}</li>}
          </ul>
          <p className={styles.links}>
            <Link href="/" className={styles.crossLink}>{tp('routes.home')} →</Link>
            <Link href="/night-bus-map" className={styles.crossLink}>{tp('routes.nightCta')} →</Link>
          </p>
        </Section>
      )}

      <Section size="tight" id="sources" title={t('sources.title')}>
        <SourceBlock items={[
          ...(a21 ? [{ label: t('sources.a21'), text: t('sources.a21Text', { date: a21.lastChecked }) }] : []),
          ...(taxi ? [
            { label: t('sources.taxiHours'), text: src(taxi.operatingHours.sources[0]) ?? '—' },
            { label: t('sources.taxiFare'), text: src(taxi.fare.sources[0]) ?? '—' },
          ] : []),
          { label: t('sources.owl'), text: t('sources.owlText', { snapshot: NIGHT_META.stopsSource.snapshot, revisedOn: NIGHT_META.scheduleSource.revisedOn }) },
        ]} />
        <p className={styles.disclaimer}>{tc('disclaimer')}</p>
        <ReportLine label={t('sources.report')} mail={CONTACT_MAIL} />
        <div className={styles.links}>
          <Link href="/how-to-ride" className={styles.crossLink}>{tp('routes.howTo')} →</Link>
          <Link href="/routes/early-morning" className={styles.crossLink}>{tg('earlyMorning.title')} →</Link>
          <Link href="/routes" className={styles.crossLink}>{tp('routes.all')} →</Link>
        </div>
      </Section>
    </>
  );
}
