import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '../../../../i18n/navigation';
import { SiteFooter } from '../../../../components/common/SiteFooter';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { SITE_URL, SITE_NAME } from '../../../../lib/seo/config';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { R3A_HUBS, R3A_NIGHT_ROUTES } from '../../../../lib/night-bus/registry';
import { NIGHT_META, routeColor } from '../../../../lib/night-bus/data';
import { getHub, hubPlatforms, hubGeoJson, relatedHubs, routesOf } from '../../../../lib/night-bus/hubs';
import { HubArrivals } from '../../../../components/night-bus/HubArrivals';
import HubMapLoader from '../../../../components/night-bus/HubMapLoader';
import { MapTabs } from '../../../../components/night-bus/MapTabs';
import { HubSchematic } from '../../../../components/night-bus/HubSchematic';
import styles from './page.module.css';

export function generateStaticParams() { return R3A_HUBS.map((slug) => ({ locale: 'ko', slug })); }
export const dynamicParams = false;
const OG_IMAGE_URL = `${SITE_URL}/og/night-bus-map-og.jpg`;
const exposed = (slug: string) => (R3A_HUBS as readonly string[]).includes(slug);
const routeExposed = (no: string) => (R3A_NIGHT_ROUTES as readonly string[]).includes(no);

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params; const hub = getHub(slug);
  if (locale !== 'ko' || !hub || !exposed(slug)) return {};
  const title = `${hub.nameKo} 심야버스 어디서 타나｜${hub.routes.slice(0, 3).join('·')} 정류장`;
  const description = `${hub.nameKo}에서 타는 올빼미버스 ${hub.routes.length}개 노선(${hub.routes.join(', ')})의 정류소 번호와 방면, 운행표, 도착정보 확인 방법. 서울시 공식 정류소 위치(${NIGHT_META.stopsSource.snapshot}) 기준.`;
  const url = `${SITE_URL}/ko/hubs/${slug}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: SITE_NAME, type: 'website', locale: 'ko_KR', images: [{ url: OG_IMAGE_URL, secureUrl: OG_IMAGE_URL, width: 1200, height: 630, alt: `${hub.nameKo} 심야버스 정류장` }] }, twitter: { card: 'summary_large_image', title, description, images: [{ url: OG_IMAGE_URL, alt: `${hub.nameKo} 심야버스 정류장` }] } };
}

export default async function HubPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; const hub = getHub(slug);
  if (locale !== 'ko' || !hub || !exposed(slug)) notFound();
  const t = await getTranslations({ locale, namespace: 'hubs' });
  const platforms = hubPlatforms(hub); const geo = hubGeoJson(hub); const routes = routesOf(hub); const related = relatedHubs(hub);
  const colors = Object.fromEntries(routes.map((r) => [r.no, routeColor(r)]));
  const jsonLd = breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('crumbMap'), path: '/night-bus-map' }, { name: hub.nameKo, path: `/hubs/${slug}` }], locale);
  return (
    <PageContainer width="default">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h1 className={styles.title}>{t('title', { name: hub.nameKo })}</h1>
        <p className={styles.sub}>{t('sub', { n: hub.routes.length, stops: hub.ars.length })}</p>
        <div className={styles.chips}>{hub.routes.map((no) => routeExposed(no) ? <Link key={no} href={`/night-bus/${no.toLowerCase()}`} className={styles.chip} style={{ background: colors[no] }}>{no}</Link> : <span key={no} className={styles.chip} style={{ background: colors[no] }}>{no}</span>)}</div>
      </header>

      <section className={styles.section} aria-labelledby="pf-title">
        <h2 id="pf-title" className={styles.h2}>{t('platformsTitle')}</h2>
        <p className={styles.note}>{t('platformsNote')}</p>
        <ul className={styles.platforms}>
          {platforms.map((p) => (
            <li key={p.arsId} className={styles.platform}>
              <div className={styles.pfHead}><span className={styles.ars}>{p.arsId}</span><span className={styles.pfName}>{p.name}</span></div>
              <ul className={styles.lines}>{p.lines.map((l, i) => <li key={`${l.no}-${i}`}><span className={styles.miniChip} style={{ background: colors[l.no] }}>{l.no}</span><span>{l.label}</span></li>)}</ul>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="live-title">
        <h2 id="live-title" className={styles.h2}>{t('liveTitle')}</h2>
        <p className={styles.note}>{t('liveNote')}</p>
        <HubArrivals platforms={platforms.map((p) => ({ arsId: p.arsId, name: p.name }))} colors={colors} labels={{ select: t('liveSelect'), button: t('liveButton'), loading: t('liveLoading'), basis: t.raw('liveBasis'), error: t('liveError'), empty: t('liveEmpty'), note: t('liveFootnote') }} />
      </section>

      <section className={styles.section} aria-labelledby="board-title">
        <h2 id="board-title" className={styles.h2}>{t('boardTitle')}</h2>
        <ul className={styles.board}>
          {routes.map((r) => (
            <li key={r.no} className={styles.brow} style={{ ['--c' as string]: colors[r.no] }}>
              <span className={styles.bno}>{r.no}</span>
              <span className={styles.bmain}><span className={styles.bends}>{r.ends[0]} ↔ {r.ends[1]}</span><span className={styles.bsched}>{r.official ? `${r.official.firstBus}~${r.official.lastBus} · ${t('headway')} ${r.official.headway}` : ''}</span></span>
              {routeExposed(r.no) ? <Link href={`/night-bus/${r.no.toLowerCase()}`} className={styles.blink}>{t('routeLink')} →</Link> : <span className={styles.bsoon}>{t('routeSoon')}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="map-title">
        <h2 id="map-title" className={styles.h2}>{t('mapTitle')}</h2>
        <p className={styles.note}>{t('mapNote')}</p>
        <MapTabs labels={[t('mapTabReal'), t('mapTabSchematic')]}
          real={<HubMapLoader center={[hub.lon, hub.lat]} stops={platforms.map((p) => ({ arsId: p.arsId, name: p.name, lon: p.lon, lat: p.lat }))} nearby={geo.nearby} />}
          schematic={<HubSchematic slug={slug} routes={hub.routes} title={t('mapAria', { name: hub.nameKo })} />} />
        <p className={styles.cap}>{t('mapCaption')}</p>
      </section>

      {related.length > 0 && (
        <section className={styles.section} aria-labelledby="rel-title">
          <h2 id="rel-title" className={styles.h2}>{t('relatedTitle')}</h2>
          <ul className={styles.related}>{related.map((h) => <li key={h.slug}>{exposed(h.slug) ? <Link href={`/hubs/${h.slug}`} className={styles.relLink}>{h.nameKo} →</Link> : <span className={styles.relSoon}>{h.nameKo}</span>}<span className={styles.relRoutes}>{h.routes.filter((r) => hub.routes.includes(r)).join(' · ')}</span></li>)}</ul>
        </section>
      )}

      <section className={styles.section} aria-labelledby="src-title">
        <h2 id="src-title" className={styles.h2}>{t('sourceTitle')}</h2>
        <ul className={styles.sources}><li>{t('sourceStops', { snapshot: NIGHT_META.stopsSource.snapshot })}</li><li>{t('sourceLive')}</li><li>{t('sourceWhy')}</li></ul>
        <p className={styles.report}>{t('report')}: <span className={styles.mail}>seoulautonomous@protonmail.com</span></p>
      </section>
      <SiteFooter />
    </PageContainer>
  );
}
