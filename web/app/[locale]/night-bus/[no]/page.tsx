import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '../../../../i18n/navigation';
import { SITE_URL, SITE_NAME } from '../../../../lib/seo/config';
import { Crumbs } from '../../../../components/v2/ui/Crumbs';
import { onColor, routeDisplayColor } from '../../../../lib/v2/route-color';
import { CONTACT_MAIL } from '../../../../components/v2/shell/Footer';
import { PageHero } from '../../../../components/v2/ui/PageHero';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { R3A_NIGHT_ROUTES, R3A_HUBS } from '../../../../lib/night-bus/registry';
import { getNightRoute, hubsForRoute, routesAtName, routeColor, ANCHORS, NIGHT_META, HUBS } from '../../../../lib/night-bus/data';
import { allRouteLines, placeStopsOnMap, routeBBox, RIVER, NODES, ROUTE_COLORS } from '../../../../lib/night-bus/schematic';
import { RouteExplorer, type ExplorerDir } from '../../../../components/night-bus/RouteExplorer';
import { ServiceStatus } from '../../../../components/night-bus/ServiceStatus';
import { nightBusEditorialKo } from '../../../../data/night-bus-editorial';
import styles from './page.module.css';

/* R3a: ko 전용 · 등록부 5노선만 생성. 영문 정류장명 SSoT 가 없으므로 EN 은 노선도 가이드로 폴백(lib/nav.ts). */
export function generateStaticParams() {
  return R3A_NIGHT_ROUTES.map((no) => ({ locale: 'ko', no: no.toLowerCase() }));
}
export const dynamicParams = false;

const OG_IMAGE_URL = `${SITE_URL}/og/night-bus-map-og.jpg`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; no: string }> }): Promise<Metadata> {
  const { locale, no } = await params;
  const route = getNightRoute(no);
  if (locale !== 'ko' || !route?.official || !(R3A_NIGHT_ROUTES as readonly string[]).includes(route.no)) return {};
  const o = route.official;
  const ed = nightBusEditorialKo[route.no];
  const title = `${route.no} 심야버스 노선·첫차 막차｜${ed ? ed.areas.join('·') : `${o.ends[0]}~${o.ends[1]}`} 올빼미버스`;
  const description = `${route.no} 올빼미버스 ${o.ends[0]}~${o.ends[1]}: 첫차 ${o.firstBus} 막차 ${o.lastBus} 배차 ${o.headway}. 정류장 ${route.stops.filter((s) => !s.virtual).length}개 전체 목록과 정류소 번호, 방면, 만나는 노선을 서울시 공식 데이터(${NIGHT_META.stopsSource.snapshot}) 기준으로 정리했습니다.`;
  const url = `${SITE_URL}/ko/night-bus/${route.no.toLowerCase()}`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: 'website', locale: 'ko_KR', images: [{ url: OG_IMAGE_URL, secureUrl: OG_IMAGE_URL, width: 1200, height: 630, alt: `${route.no} 서울 심야버스 노선도` }] },
    twitter: { card: 'summary_large_image', title, description, images: [{ url: OG_IMAGE_URL, alt: `${route.no} 서울 심야버스 노선도` }] },
  };
}

export default async function NightRoutePage({ params }: { params: Promise<{ locale: string; no: string }> }) {
  const { locale, no } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const route = getNightRoute(no);
  if (locale !== 'ko' || !route?.official || !(R3A_NIGHT_ROUTES as readonly string[]).includes(route.no)) notFound();
  const t = await getTranslations({ locale, namespace: 'nightBus' });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const ts = await getTranslations({ locale, namespace: 'shell' });
  const o = route.official;
  const color = routeColor(route);
  const hubs = hubsForRoute(route.no);
  const hubByArs = new Map<string, (typeof HUBS)[number]>();
  for (const h of hubs) for (const a of h.ars) hubByArs.set(a, h);
  const exposedHub = (slug: string) => (R3A_HUBS as readonly string[]).includes(slug);

  const dirs: ExplorerDir[] = route.dirs.map((d) => {
    const stops = d.stops.filter((s) => !s.virtual);
    const placed = placeStopsOnMap(route.no, stops, ANCHORS[route.no]?.[d.key] ?? [], route.turnaround.index);
    return {
      key: d.key, label: d.label, toward: d.toward, outside: placed.outside, ticks: placed.ticks, anchors: placed.anchorsOnMap,
      stops: stops.map((s) => { const h = hubByArs.get(s.arsId); return { seq: s.seq, arsId: s.arsId, name: s.nameKo, lat: s.lat, lon: s.lon, others: routesAtName(s.nameKo, route.no), turn: s.idx === route.turnaround.index, hubSlug: h && exposedHub(h.slug) ? h.slug : undefined, hubName: h?.nameKo }; }),
    };
  });
  const via = (ANCHORS[route.no]?.out ?? []).map((a) => a.node);
  const ed = nightBusEditorialKo[route.no];
  const map = { vb: routeBBox(route.no), riverD: RIVER.d, lines: allRouteLines(), nodes: Object.values(NODES) as [number, number][] };
  const stopCount = route.stops.filter((s) => !s.virtual).length;
  const lower = route.no.toLowerCase();
  const faq = [1, 2, 3, 4].map((i) => ({ q: t(`faq.q${i}`, { no: route.no }), a: t(`faq.a${i}`, { no: route.no, asOf: o.asOf, first: o.firstBus, last: o.lastBus, headway: o.headway }) }));
  const jsonLd = breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('crumbMap'), path: '/night-bus-map' }, { name: route.no, path: `/night-bus/${lower}` }], locale);
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <PageHero eyebrow={t('eyebrow')} no={route.no} color={color} title={t('title', { no: route.no })} lead={t('ends', { a: o.ends[0], b: o.ends[1] })} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: ts('nav.home') }, { href: '/night-bus-map', label: t('crumbMap') }, { label: route.no }]} />}>
        <dl className={styles.facts}>
          <div><dt>{t('facts.first')}</dt><dd>{o.firstBus}</dd></div>
          <div><dt>{t('facts.last')}</dt><dd>{o.lastBus}</dd></div>
          <div><dt>{t('facts.headway')}</dt><dd>{o.headway}</dd></div>
          <div><dt>{t('facts.vehicles')}</dt><dd>{t('facts.vehiclesUnit', { n: o.vehicles })}</dd></div>
          <div><dt>{t('facts.distance')}</dt><dd>{t('facts.distanceUnit', { km: o.distanceKm })}</dd></div>
          <div><dt>{t('facts.stops')}</dt><dd>{t('facts.stopsUnit', { n: stopCount })}</dd></div>
        </dl>
        <ServiceStatus first={o.firstBus} last={o.lastBus} labels={{ label: t('status.label'), running: t.raw('status.running'), before: t.raw('status.before'), beforeSoon: t.raw('status.beforeSoon'), note: t('status.note') }} />
        <Link href="/night-bus-map" className={styles.mapLink}>{t('allMap')} →</Link>
      </PageHero>
      <div className="v2-wrap v2-body">

      {ed && (
        <section className={styles.section} aria-labelledby="when-title">
          <h2 id="when-title" className={styles.h2}>{t('whenTitle')}</h2>
          <p className={styles.lead}>{ed.summary}</p>
          <ul className={styles.cases}>{ed.useCases.map((u) => <li key={u}>{u}</li>)}</ul>
          <h3 className={styles.h3}>{t('cautionsTitle')}</h3>
          <ul className={styles.cautions}>{ed.cautions.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>
      )}

      <section className={styles.section} aria-labelledby="via-title">
        <h2 id="via-title" className={styles.h2}>{t('viaTitle')}</h2>
        <p className={styles.note}>{t('viaNote')}</p>
        <ol className={styles.via} style={{ ['--c' as string]: color }}>{via.map((v) => <li key={v}>{v}</li>)}</ol>
      </section>

      {hubs.length > 0 && (
        <section className={styles.section} aria-labelledby="hubs-title">
          <h2 id="hubs-title" className={styles.h2}>{t('hubsTitle')}</h2>
          <p className={styles.note}>{t('hubsNote')}</p>
          <ul className={styles.hubs}>
            {hubs.map((h) => (
              <li key={h.slug} className={styles.hub}>
                <span className={styles.hubName}>{h.nameKo}</span>
                <span className={styles.hubRoutes}>{h.routes.map((r) => <span key={r} className={styles.miniChip} style={{ background: routeDisplayColor(r, ROUTE_COLORS[r]), color: onColor(routeDisplayColor(r, ROUTE_COLORS[r])) }}>{r}</span>)}</span>
                {exposedHub(h.slug) ? <a className={styles.hubLink} href={`/${locale}/hubs/${h.slug}`}>{t('hubLink')} →</a> : <Link href="/night-bus-map" className={styles.hubLink}>{t('hubsSoon')} →</Link>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section} aria-labelledby="dir-title">
        <h2 id="dir-title" className={styles.h2}>{t('dirTitle')}</h2>
        <p className={styles.note}>{t('dirNote')}</p>
        <RouteExplorer no={route.no} color={color} colors={ROUTE_COLORS} dirs={dirs} map={map} hubBase={`/${locale}/hubs`}
          labels={{ dirStops: t.raw('dirStops'), meets: t('meets'), hubLink: t('hubLink'), turnaround: t('turnaround'), mapNote: t('mapNote'), mapOutside: t.raw('mapOutside'), boardText: t.raw('boardText'), stopTap: t('stopTap'), kakao: tp('map.kakao'), naver: tp('map.naver'), mapAria: tp('map.aria') }} />
        <p className={styles.transfer}>{t('boardTransfer')}</p>
      </section>

      <section className={styles.section} aria-labelledby="live-title">
        <h2 id="live-title" className={styles.h2}>{t('liveTitle')}</h2>
        <p className={styles.note}>{t('liveText')}</p>
      </section>

      <section className={styles.section} aria-labelledby="faq-title">
        <h2 id="faq-title" className={styles.h2}>{t('faqTitle', { no: route.no })}</h2>
        <dl className={styles.faq}>{faq.map((f) => <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>)}</dl>
      </section>

      <section className={styles.section} aria-labelledby="src-title">
        <h2 id="src-title" className={styles.h2}>{t('sourceTitle')}</h2>
        <ul className={styles.sources}>
          <li>{t('sourceStops', { snapshot: NIGHT_META.stopsSource.snapshot })}</li>
          <li>{t('sourceSchedule', { asOf: o.asOf })}</li>
          <li>{t('sourceMap')}</li>
          <li>{t('sourceWhy')}</li>
        </ul>
        <p className={styles.report}>{t('report')}: <a className={styles.mail} href={`mailto:${CONTACT_MAIL}?subject=${encodeURIComponent(`[제보] ${route.no} 올빼미버스`)}`}>{CONTACT_MAIL}</a></p>
      </section>
      </div>
    </>
  );
}
