import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '../../../../i18n/routing';
import { Link } from '../../../../i18n/navigation';
import { Crumbs } from '../../../../components/v2/ui/Crumbs';
import { PageHero } from '../../../../components/v2/ui/PageHero';
import { MapLinks } from '../../../../components/v2/ui/MapLinks';
import { SourceBlock, ReportLine } from '../../../../components/v2/ui/SourceBlock';
import { CONTACT_MAIL } from '../../../../components/v2/shell/Footer';
import { ArrivalCard } from '../../../../components/stop/ArrivalCard';
import { StopServiceHours } from '../../../../components/stop/StopServiceHours';
import { HashReanchor } from '../../../../components/stop/HashReanchor';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../../lib/seo/metadata';
import { clientMessages } from '../../../../lib/v2/client-messages';
import { onColor } from '../../../../lib/v2/route-color';
import { getOfficialStopNameEn, stopNamesSourceMeta } from '../../../../lib/stops';
import { NIGHT_META } from '../../../../lib/night-bus/data';
import { STOP_PLACES, getPlaceBySlug, platformAnchor } from '../../../../lib/stop-pages';
import { assertStopPlaces, buildPlaceView, roundM, stopNameEn, type Platform, type PlaceView } from '../../../../lib/stop-places';
import styles from './page.module.css';

// R3b-1 (2026-10-16) — 한 장소(같은 이름의 방향쌍 ARS 2개) = 한 페이지. 관계·순서·방면은 Graph·올빼미 데이터 파생이다.
// 페이지가 아는 리터럴은 등록부(stop-pages.ts)의 slug·ARS 뿐이다. 옛 ARS URL 은 data/legacy-redirects.json 이 장소#ars 로 옮긴다.
assertStopPlaces();

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => STOP_PLACES.map((place) => ({ locale, slug: place.slug })));
}
export const dynamicParams = false;

const uniq = (xs: string[]) => [...new Set(xs)];
/** 플랫폼의 자율주행 방면 묶음 (순환 노선 제외 · 등장 순서 유지). */
const autoTowards = (p: Platform, ko: boolean) => uniq(p.auto.map((a) => (ko ? a.towardKo : a.towardEn)).filter((x): x is string => !!x));
const owlTowards = (p: Platform) => uniq(p.owl.map((o) => o.towardKo));
const routeName = (a: Platform['auto'][number], ko: boolean) => (ko ? a.route.displayNameKo : a.route.displayName);
const placeName = (v: PlaceView, ko: boolean) => (ko ? v.place.nameKo : stopNameEn(v.place.platforms[0], v.place.nameKo));

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) return {};
  const ko = locale === 'ko';
  const v = buildPlaceView(place);
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const [a, b] = v.platforms;
  const sep = ko ? '·' : ', ';
  return buildPageMetadata({
    locale,
    path: `/stops/${place.slug}`,
    title: t('stopPlaceTitle', { name: placeName(v, ko), a: a.ars, b: b.ars }),
    description: t('stopPlaceDescription', {
      name: placeName(v, ko), a: a.ars, b: b.ars,
      aToward: autoTowards(a, ko).join(sep), bToward: autoTowards(b, ko).join(sep),
      routes: uniq(v.platforms.flatMap((p) => p.auto.map((x) => routeName(x, ko)))).join(sep),
      owl: uniq(v.platforms.flatMap((p) => p.owl.map((o) => o.no))).sort().join(sep),
    }),
  });
}

export default async function StopPlacePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const place = getPlaceBySlug(slug);
  if (!place) notFound();
  const ko = locale === 'ko';
  const t = await getTranslations({ locale, namespace: 'stopPlace' });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const ts = await getTranslations({ locale, namespace: 'shell' });
  const tr = await getTranslations({ locale, namespace: 'routes' });
  const v = buildPlaceView(place);
  const [a, b] = v.platforms;
  const sep = ko ? '·' : ', ';
  const name = placeName(v, ko);
  const secondary = ko ? stopNameEn(a.ars, place.nameKo) : place.nameKo;
  const mapLabels = { kakao: tp('map.kakao'), naver: tp('map.naver'), aria: tp('map.aria') };
  const nameOf = (ars: string, nameKo: string) => (ko ? nameKo : stopNameEn(ars, nameKo));
  /** EN 페이지에서 공식 영문명이 없어 한국어로 보이는 이름은 lang="ko" 로 감싼다. */
  const NameOf = ({ ars, nameKo }: { ars: string; nameKo: string }) => (ko || getOfficialStopNameEn(ars) ? <>{nameOf(ars, nameKo)}</> : <span lang="ko">{nameKo}</span>);
  const stopSep = ' · '; // 정류장 이름 나열 — 영문 공식명 안의 쉼표와 섞이지 않게
  const owlRoutesHere = uniq(v.platforms.flatMap((p) => p.owl.map((o) => o.no))).sort();
  const owlLinks = ko ? owlRoutesHere.map((no) => v.platforms.flatMap((p) => p.owl).find((o) => o.no === no)!).filter((o) => o.path) : [];
  const autoRoutes = uniq(v.platforms.flatMap((p) => p.auto.map((x) => x.routeId))).map((id) => v.platforms.flatMap((p) => p.auto).find((x) => x.routeId === id)!);
  const routeLabelById = (id: string) => routeName(v.platforms.flatMap((p) => p.auto).find((x) => x.routeId === id)!, ko);
  // RT-2 카드(ko · 01009 한정)의 클라이언트 메시지 — map 콜백 안에서 await 할 수 없어 미리 받는다
  const arrivalMessages = ko && v.platforms.some((p) => p.ars === '01009') ? await clientMessages(locale, ['stopDetail']) : {};

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: 'Routes', path: '/routes' }, { name, path: `/stops/${place.slug}` }], locale)) }} />
      <PageHero eyebrow={t('eyebrow')} title={name} lead={secondary !== name ? (ko ? secondary : <span lang="ko">{secondary}</span>) : undefined} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: ts('nav.home') }, { href: '/routes', label: tr('title') }, { label: name }]} />}>
        <div className={styles.jumps}>
          {v.platforms.map((p) => <a key={p.ars} href={`#${platformAnchor(p.ars)}`} className={styles.jump} aria-label={t('jump', { ars: p.ars })}>{p.ars} ↓</a>)}
        </div>
        <p className={styles.summary}>{t('summaryPair', { a: a.ars, b: b.ars, aToward: autoTowards(a, ko).join(sep), bToward: autoTowards(b, ko).join(sep) })}</p>
        <p className={styles.summary}>{t('summaryDistance', { m: roundM(v.distanceM) })}</p>
      </PageHero>

      <div className="v2-wrap v2-body">
        <HashReanchor prefix="ars-" />
        <div className={styles.platforms}>
          {v.platforms.map((p) => (
            <article key={p.ars} id={platformAnchor(p.ars)} className={styles.platform} aria-labelledby={`${platformAnchor(p.ars)}-title`}>
              <header className={styles.pfHead}>
                <h2 id={`${platformAnchor(p.ars)}-title`} className={styles.pfTitle}><span className={styles.ars}>{p.ars}</span>{' '}<span className={styles.pfName}>{nameOf(p.ars, p.nameKo)}</span></h2>
                <MapLinks name={p.nameKo} lat={p.lat} lon={p.lon} ars={p.ars} labels={mapLabels} />
              </header>

              <section className={styles.block} aria-label={t('autoTitle')}>
                <h3 className={styles.h3}>{t('autoTitle')}</h3>
                <ul className={styles.autoList}>
                  {p.auto.map((x) => (
                    <li key={x.routeId} className={styles.autoRow}>
                      <Link href={`/routes/${x.routeId}`} className={styles.routeChip}>{routeName(x, ko)}</Link>
                      <span className={styles.autoMain}>
                        <b>{x.towardKo ? t('autoToward', { toward: (ko ? x.towardKo : x.towardEn) ?? '' }) : t('autoLoop')}</b>
                        <span className={styles.autoMeta}>{t('autoPosition', { seq: x.seq, total: x.total })}</span>
                        <span className={styles.autoMeta}>
                          {x.prev && <>{t('prev')} {nameOf(x.prev.stopId, x.prev.nameKo)}</>}
                          {x.prev && x.next && ' · '}
                          {x.next && <>{t('next')} {nameOf(x.next.stopId, x.next.nameKo)}</>}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* RT-2 pilot gate — KO 01009 한정 (확대 아님 · 장소 페이지의 01009 절로 옮겼을 뿐). 정적 안내가 항상 남는 base layer 다. */}
              {ko && p.ars === '01009' && (
                <div className={styles.block}>
                  <NextIntlClientProvider locale={locale} messages={arrivalMessages}>
                    <ArrivalCard stopId={p.ars} ssotOrder={p.auto.map((x) => x.routeId)} routeNames={Object.fromEntries(p.auto.map((x) => [x.routeId, routeName(x, ko)]))} headingLevel={3} />
                  </NextIntlClientProvider>
                  <StopServiceHours entries={p.auto.map((x) => ({ routeId: x.routeId, routeName: routeName(x, ko), routeFirstBus: x.route.firstBus, routeLastBus: x.route.lastBus, routeDaysOfOperation: x.route.daysOfOperation }))} headingLevel={3} />
                </div>
              )}

              <section className={styles.block} aria-label={t('owlTitle')}>
                <h3 className={styles.h3}>{t('owlTitle')}</h3>
                {p.owl.length === 0 ? <p className={styles.muted}>{t('owlNone')}</p> : (
                  <ul className={styles.owlList}>
                    {p.owl.map((o) => (
                      <li key={o.no}>
                        {ko && o.path
                          ? <Link href={o.path} className={styles.owlChip} style={{ background: o.color, color: onColor(o.color) }}>{o.no}</Link>
                          : <span className={styles.owlChip} style={{ background: o.color, color: onColor(o.color) }}>{o.no}</span>}
                        <span>{t.rich('owlToward', { toward: o.towardKo, ko: (c) => <span lang="ko">{c}</span> })}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </article>
          ))}
        </div>

        <section className={styles.section} aria-labelledby="which-title">
          <h2 id="which-title" className={styles.h2}>{t('whichTitle')}</h2>
          <div className={styles.prose}>
            <p>{t('whichDistance', { a: a.ars, b: b.ars })}</p>
            <ul className={styles.sideList}>
              {v.platforms.map((p) => (
                <li key={p.ars}>
                  <b className={styles.ars}>{p.ars}</b>
                  <span>{t('whichAuto')} {t('autoToward', { toward: autoTowards(p, ko).join(sep) })}</span>
                  {owlTowards(p).length > 0 && (
                    <span>{t('whichOwl')} {t.rich('owlToward', { toward: owlTowards(p).join(sep), ko: (c) => <span lang="ko">{c}</span> })}</span>
                  )}
                  <span className={styles.sideNext}>{t('whichNext', { names: uniq(p.auto.map((x) => x.next).filter((n): n is NonNullable<typeof n> => !!n).map((n) => nameOf(n.stopId, n.nameKo))).join(stopSep) })}</span>
                </li>
              ))}
            </ul>
            <p className={styles.note}>{t('whichNote')}</p>
            {v.asymmetries.map((s) => {
              const label = s.kind === 'auto' ? routeLabelById(s.label) : s.label;
              const key = `${s.kind}-${s.label}-${s.onlyAt}`;
              if (!s.opposite) return <p key={key}>{t(s.kind === 'auto' ? 'asymAutoNone' : 'asymOwlNone', { route: label, onlyAt: s.onlyAt })}</p>;
              return <p key={key}>{t(s.kind === 'auto' ? 'asymAuto' : 'asymOwl', { route: label, onlyAt: s.onlyAt, oppName: nameOf(s.opposite.ars, s.opposite.nameKo), oppArs: s.opposite.ars, other: s.otherArs, m: roundM(s.opposite.distanceM) })}</p>;
            })}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="nearby-title">
          <h2 id="nearby-title" className={styles.h2}>{t('nearbyTitle')}</h2>
          {v.nearby.length === 0 ? <p className={styles.muted}>{t('nearbyNone')}</p> : (
            <>
              <p className={styles.note}>{t('nearbyNote')}</p>
              <ul className={styles.nearby}>
                {v.nearby.map((n) => (
                  <li key={n.ars}>
                    <span className={styles.ars}>{n.ars}</span>
                    <span className={styles.nearName}><NameOf ars={n.ars} nameKo={n.nameKo} /></span>
                    <span className={styles.nearOwl}>{n.owl.join(' · ')}</span>
                    <span className={styles.nearDist}>{t('nearbyItem', { m: roundM(n.distanceM) })}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className={styles.section} aria-labelledby="links-title">
          <h2 id="links-title" className={styles.h2}>{t('linksTitle')}</h2>
          <p className={styles.links}>
            {autoRoutes.map((x) => <Link key={x.routeId} href={`/routes/${x.routeId}`} className={styles.crossLink}>{routeName(x, ko)} →</Link>)}
            {owlLinks.map((o) => <Link key={o.no} href={o.path!} className={styles.crossLink}>{o.no} →</Link>)}
            <Link href="/night-bus-map" className={styles.crossLink}>{t('mapLink')} →</Link>
          </p>
        </section>

        <section className={styles.section} aria-labelledby="src-title">
          <h2 id="src-title" className={styles.h2}>{t('sourcesTitle')}</h2>
          <SourceBlock items={[
            { label: t('srcStops'), text: t('srcStopsText', { snapshot: NIGHT_META.stopsSource.snapshot, namesDate: stopNamesSourceMeta.collectedAt.slice(0, 10) }) },
            { label: t('srcAuto'), text: t('srcAutoText', { date: v.lastChecked }) },
            { label: t('srcOwl'), text: t('srcOwlText', { revisedOn: NIGHT_META.scheduleSource.revisedOn }) },
          ]} />
          <ReportLine label={t('report')} mail={CONTACT_MAIL} />
        </section>
      </div>
    </>
  );
}
