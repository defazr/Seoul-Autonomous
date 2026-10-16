import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { getEarlyMorningRoutes } from '../../../../lib/routes';
import { toRouteItem } from '../../../../lib/transit-items';
import { owlOverlap, owlRoutesLabel, owlScheduleRange, stopPagesOnRoute } from '../../../../lib/route-groups';
import { NIGHT_META } from '../../../../lib/night-bus/data';
import { GROUP_SOURCES, SAEBYEOK_OVERVIEW } from '../../../../data/route-group-sources';
import { RouteCard, routeCode } from '../../../../components/v2/transit/RouteCard';
import { PageHero } from '../../../../components/v2/ui/PageHero';
import { Section } from '../../../../components/v2/ui/Section';
import { Crumbs } from '../../../../components/v2/ui/Crumbs';
import { SourceBlock, ReportLine } from '../../../../components/v2/ui/SourceBlock';
import { CONTACT_MAIL } from '../../../../components/v2/shell/Footer';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../../lib/seo/metadata';
import { Link } from '../../../../i18n/navigation';
import type { FixedRoute } from '../../../../lib/types/route';
import styles from '../group.module.css';

export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }

/** 묶음의 모든 노선이 같은 시각에 한 번만 출발하면 그 시각(R3b-2 — intro·규칙 문장의 근거). 아니면 null. */
function uniformDeparture(routes: FixedRoute[]): string | null {
  const t = routes[0]?.firstBus;
  return t && routes.every((r) => r.firstBus === t && r.lastBus === t) ? t : null;
}
const codes = (routes: FixedRoute[], ko: boolean) => routes.map((r) => routeCode(r.displayName) ?? r.displayName).join(ko ? '·' : ', ');
const ymd = (d: string, ko: boolean) => {
  const [y, m, day] = d.split('-').map(Number);
  return ko ? `${y}년 ${m}월 ${day}일` : new Date(Date.UTC(y, m - 1, day)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'routeGroups.earlyMorning' });
  return buildPageMetadata({ locale, path: '/routes/early-morning', title: t('title'), description: t('description', { names: codes(getEarlyMorningRoutes(), locale === 'ko') }) });
}

export default async function EarlyMorningPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const ko = locale === 'ko';
  const t = await getTranslations({ locale, namespace: 'routeGroups.earlyMorning' });
  const tc = await getTranslations({ locale, namespace: 'routeDetail' });
  const tr = await getTranslations({ locale, namespace: 'routes' });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const ts = await getTranslations({ locale, namespace: 'shell' });
  const tg = await getTranslations({ locale, namespace: 'routeGroups' });
  const routes = getEarlyMorningRoutes();
  const time = uniformDeparture(routes);
  const owl = owlScheduleRange();
  const overlaps = routes.map((r) => ({ route: r, ...owlOverlap(r) }));
  const name = (r: FixedRoute) => (ko ? r.displayNameKo : r.displayName);
  // 정류장 페이지(승인 등록부) — 이 묶음 노선들이 지나는 곳만, 같은 이름은 한 번
  const stopLinks = [...new Map(routes.flatMap((r) => stopPagesOnRoute(r, ko)).map((s) => [s.name, s])).values()];
  const checked = routes.reduce((d, r) => (r.lastChecked > d ? r.lastChecked : d), '');
  const src = (s: { title: string; url: string; publishedAt: string }) => (
    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{`「${s.title}」 ${s.publishedAt}`}</a>
  );
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: 'Routes', path: '/routes' }, { name: t('title'), path: '/routes/early-morning' }], locale)) }} />
      <PageHero eyebrow={tp('group.eyebrow')} title={t('title')} lead={time ? t('intro', { count: routes.length, time }) : t('introFallback')} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: ts('nav.home') }, { href: '/routes', label: tr('title') }, { label: t('title') }]} />} />
      <Section size="tight" ariaLabel={t('title')}>
        <div className={styles.grid}>
          {overlaps.map(({ route, total, shared, owlRoutes }) => {
            const ov = SAEBYEOK_OVERVIEW[route.id];
            return (
              <article key={route.id} className={styles.item}>
                <RouteCard route={toRouteItem(route)} locale={locale} />
                <dl className={styles.facts}>
                  {ov && <div><dt>{t('facts.corridor')}</dt><dd>{ko ? ov.corridorKo : ov.corridorEn}</dd></div>}
                  {ov && <div><dt>{t('facts.launched')}</dt><dd>{ymd(ov.launchedOn, ko)}</dd></div>}
                  <div><dt>{t('facts.stops')}</dt><dd>{t('facts.stopsValue', { n: total })}</dd></div>
                  <div><dt>{t('facts.owl')}</dt><dd>{shared > 0 ? t('facts.owlValue', { shared, routes: owlRoutesLabel(owlRoutes, ko) }) : t('facts.owlNone')}</dd></div>
                </dl>
              </article>
            );
          })}
        </div>
        <p className={styles.note}>{t('facts.note')}</p>
      </Section>

      <Section size="tight" width="text" id="rules" title={t('rules.title')}>
        <ol className={styles.rules}>
          <li>{t('rules.express')}</li>
          <li>{t('rules.seats')}</li>
          <li>{t('rules.tag')}</li>
          {time && <li>{t('rules.time', { time })}</li>}
        </ol>
        <p className={styles.note}>{t('rules.note')}</p>
      </Section>

      <Section size="tight" width="text" id="owl" title={t('owl.title')}>
        <div className={styles.prose}>
          {time && <p>{t('owl.schedule', { owlCount: owl.count, lastMin: owl.lastMin, lastMax: owl.lastMax, count: routes.length, time })}</p>}
          <p>{t('owl.shared', { list: overlaps.map((o) => t('owl.item', { name: name(o.route), total: o.total, shared: o.shared })).join(ko ? ', ' : '; ') })}</p>
          <p>{t('owl.unknown')}</p>
        </div>
        {stopLinks.length > 0 && (
          <div className={styles.linkGroup}>
            <p className={styles.linkLead}>{t('owl.stopsLead')}</p>
            <p className={styles.links}>
              {stopLinks.map((s) => <Link key={s.href} href={s.href} className={styles.crossLink}>{s.name} →</Link>)}
              <Link href="/night-bus-map" className={styles.crossLink}>{t('owl.mapLink')} →</Link>
            </p>
          </div>
        )}
      </Section>

      <Section size="tight" id="sources" title={t('sources.title')}>
        <SourceBlock items={[
          { label: t('sources.overview'), text: src(GROUP_SOURCES.saebyeokOverview) },
          { label: t('sources.rules'), text: <>{src(GROUP_SOURCES.a741Launch)} · {src(GROUP_SOURCES.a148Launch)} · {src(GROUP_SOURCES.a504Launch)}</> },
          { label: t('sources.stops'), text: t('sources.stopsText', { date: checked }) },
          { label: t('sources.owl'), text: t('sources.owlText', { snapshot: NIGHT_META.stopsSource.snapshot, revisedOn: NIGHT_META.scheduleSource.revisedOn }) },
        ]} />
        <p className={styles.disclaimer}>{tc('disclaimer')}</p>
        <ReportLine label={t('sources.report')} mail={CONTACT_MAIL} />
        <div className={styles.links}>
          <Link href="/how-to-ride" className={styles.crossLink}>{tp('routes.howTo')} →</Link>
          <Link href="/routes/late-night" className={styles.crossLink}>{tg('lateNight.title')} →</Link>
          <Link href="/routes" className={styles.crossLink}>{tp('routes.all')} →</Link>
        </div>
      </Section>
    </>
  );
}
