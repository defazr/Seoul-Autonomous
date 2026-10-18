import { notFound } from 'next/navigation';
import { Link } from '../../../i18n/navigation';
import { SITE_URL, SITE_NAME } from '../../../lib/seo/config';
import { NightBusMap } from './NightBusMap';
import { NightBusGuideEn } from '../../../components/night-bus-guide/NightBusGuideEn';
import { nightBusGuideEn } from '../../../data/night-bus-guide/night-bus-guide.en';
import { ROUTE_COLORS, ROUTE_ORDER } from './night-bus-data';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getNightBus, ANCHORS, HUBS, NIGHT_META } from '../../../lib/night-bus/data';
import { R3A_NIGHT_ROUTES, hubPath } from '../../../lib/night-bus/registry';
import { MapLinks } from '../../../components/v2/ui/MapLinks';
import type { StopRef } from './NightBusMap';
import { Crumbs } from '../../../components/v2/ui/Crumbs';
import { PageHero } from '../../../components/v2/ui/PageHero';
import { Section } from '../../../components/v2/ui/Section';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import type { Metadata } from 'next';
import styles from './page.module.css';

/* ── Static params: ko map + en text guide ── */
export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }];
}
export const dynamicParams = false; // 생성 목록 밖 경로(다른 로케일·없는 id)는 요청 시점 notFound() 대신 정적 전역 404 로 (R3b-4 · 2026-10-18)

/* ── Metadata: ko only, no en alternates ── */
const PAGE_TITLE = '서울 심야버스 노선과 N버스 환승 노선도';
const PAGE_H1 = '서울 심야버스 노선과 환승 노선도';
const PAGE_DESC = '서울 심야버스 노선과 N버스 환승 경로를 한눈에 확인하세요. 올빼미버스 14개 노선과 심야A21의 주요 경유지와 환승역을 보고 출발역과 도착역을 선택해 직통 또는 환승 경로를 찾을 수 있습니다.';
const PAGE_URL = `${SITE_URL}/ko/night-bus-map`;
const OG_IMAGE_URL = `${SITE_URL}/og/night-bus-map-og.jpg`;

/* ── EN guide metadata: self-canonical, no hreflang link to ko ── */
const EN_PAGE_URL = `${SITE_URL}/en/night-bus-map`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'en') {
    const { title, description, ogImageAlt } = nightBusGuideEn.metadata;
    return {
      title,
      description,
      alternates: {
        canonical: EN_PAGE_URL,
      },
      openGraph: {
        title,
        description,
        url: EN_PAGE_URL,
        siteName: SITE_NAME,
        type: 'website',
        locale: 'en_US',
        images: [
          {
            url: OG_IMAGE_URL,
            secureUrl: OG_IMAGE_URL,
            width: 1200,
            height: 630,
            alt: ogImageAlt,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [{ url: OG_IMAGE_URL, alt: ogImageAlt }],
      },
    };
  }
  if (locale !== 'ko') return {};

  return {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    alternates: {
      canonical: PAGE_URL,
    },
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESC,
      url: PAGE_URL,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'ko_KR',
      images: [
        {
          url: OG_IMAGE_URL,
          secureUrl: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: 'Seoul Autonomous — 서울 심야버스 노선도',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: PAGE_TITLE,
      description: PAGE_DESC,
      images: [{ url: OG_IMAGE_URL, alt: 'Seoul Autonomous — 서울 심야버스 노선도' }],
    },
  };
}

/* ── SVG icons ── */
function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ── Route descriptions ── */
const routeDescriptions: { id: string; label: string; color: string; tag?: string; desc: string }[] = [
  {
    id: 'A21', label: '심야A21', color: ROUTE_COLORS.A21, tag: '자율주행',
    desc: '심야A21은 동대문, 종로, 광화문, 신촌, 홍대입구, 합정 축을 따라 운행되는 자율주행 심야 노선입니다. 도심에서 홍대·합정 방면으로 심야에 이동할 때 참고할 수 있으며, 이 노선도에서 정류장·표시 시각을 확인한 자율주행 노선으로 별도 강조합니다.',
  },
  {
    id: 'N13', label: 'N13', color: ROUTE_COLORS.N13,
    desc: 'N13은 노원, 청량리, 신설동, 동대문에서 강남, 잠실, 복정까지 이어지는 심야버스입니다. 서울 동북권에서 강남·동남권으로 심야에 종단 이동할 때 참고할 수 있습니다.',
  },
  {
    id: 'N15', label: 'N15', color: ROUTE_COLORS.N15,
    desc: '공식 기·종점: 우이동~사당역. N15는 우이동에서 신설동, 동대문, 종로, 서울역을 거쳐 사당까지 이어지는 남북 종단 노선입니다. 야간근무 퇴근이나 새벽 출근 시 서울 북부에서 남부 방면으로 이동할 때 유용합니다.',
  },
  {
    id: 'N16', label: 'N16', color: ROUTE_COLORS.N16,
    desc: 'N16은 도봉산에서 동대문, 서울역을 거쳐 영등포, 온수까지 운행합니다. 서울 북부에서 서남부로의 심야 이동을 연결하는 노선입니다.',
  },
  {
    id: 'N26', label: 'N26', color: ROUTE_COLORS.N26,
    desc: 'N26은 개화에서 합정, 홍대입구, 신촌, 광화문, 종로, 동대문, 청량리까지 이어지는 동서축 심야버스입니다. 서울 서부에서 도심과 동북권으로 이동할 때 참고할 수 있으며, 홍대 심야버스를 찾는 분들에게 주요 노선입니다.',
  },
  {
    id: 'N30', label: 'N30', color: ROUTE_COLORS.N30,
    desc: 'N30은 강동에서 신설동, 동대문, 종로, 서울역까지 운행합니다. 서울 동부에서 도심으로 심야에 이동할 때 참고할 수 있는 노선입니다.',
  },
  {
    id: 'N31', label: 'N31', color: ROUTE_COLORS.N31,
    desc: '공식 기·종점: 강일동~정릉동. N31은 강동, 잠실, 강남에서 종로, 동대문을 거쳐 정릉동까지 이어지는 심야버스입니다. 강남 심야버스를 찾는 분들이 동남권에서 북부로 이동할 때 참고할 수 있습니다.',
  },
  {
    id: 'N37', label: 'N37', color: ROUTE_COLORS.N37,
    desc: 'N37은 복정에서 강남, 광화문을 거쳐 구파발까지 운행합니다. 동남권에서 서북부까지 서울을 대각선으로 횡단하는 심야 노선입니다.',
  },
  {
    id: 'N51', label: 'N51', color: ROUTE_COLORS.N51,
    desc: '공식 기·종점: 시흥동~하계동. N51은 시흥동(금천)에서 구로디지털단지, 신도림, 영등포, 당산, 합정, 홍대입구, 신촌, 시청, 광화문, 동대문, 신설동, 고려대를 거쳐 하계(노원)까지 이어지는 장거리 심야버스입니다. 서남권에서 도심을 거쳐 동북권까지 연결합니다.',
  },
  {
    id: 'N61', label: 'N61', color: ROUTE_COLORS.N61,
    desc: '공식 기·종점: 신정동~상계동. N61은 신정동(양천)에서 신림, 서울대입구, 사당, 교대, 강남, 역삼, 선릉, 삼성, 건대입구, 군자, 태릉입구를 거쳐 노원·상계동까지 운행합니다. 강남권과 동북부 외곽을 잇는 심야 노선으로, 대리기사 이동 경로와 겹치는 구간이 많습니다.',
  },
  {
    id: 'N62', label: 'N62', color: ROUTE_COLORS.N62,
    desc: 'N62는 영등포, 합정, 홍대입구, 신촌, 서울역, 종로, 동대문에서 왕십리, 성수, 건대입구, 군자, 면목까지 이어지는 동서축 심야버스입니다. 서부에서 동부로 도심을 관통하는 심야 귀가 노선입니다.',
  },
  {
    id: 'N64', label: 'N64', color: ROUTE_COLORS.N64,
    desc: 'N64는 개화에서 마곡, 발산, 화곡, 목동, 영등포, 노량진, 이수, 교대, 강남, 역삼을 거쳐 염곡동까지 운행합니다. 서울 서부에서 한강 남쪽을 따라 강남 방면으로 이동할 때 참고할 수 있습니다.',
  },
  {
    id: 'N72', label: 'N72', color: ROUTE_COLORS.N72,
    desc: '공식 기·종점: 수색동~신내동. N72는 수색동(은평)에서 상암, 합정, 홍대입구, 신촌, 공덕, 이태원, 약수, 신설동, 청량리, 상봉을 거쳐 신내동까지 운행합니다. 서북권에서 한강 북쪽을 따라 동북권으로 이동하는 심야 노선입니다.',
  },
  {
    id: 'N73', label: 'N73', color: ROUTE_COLORS.N73,
    desc: 'N73은 구산동(은평)에서 홍대입구, 신촌, 시청, 을지로입구, 왕십리, 성수, 건대입구, 잠실, 오금, 거여를 거쳐 복정·장지동까지 이어집니다. 서북권에서 도심과 동남권을 잇는 심야버스입니다.',
  },
  {
    id: 'N75', label: 'N75', color: ROUTE_COLORS.N75,
    desc: '공식 기·종점: 진관동~신림동. N75는 진관동(은평)에서 연신내, 가좌, 신촌, 광화문, 시청, 서울역, 삼각지, 고속터미널, 논현, 강남, 교대, 사당, 서울대입구를 거쳐 신림동까지 운행합니다. 서북에서 도심을 지나 서남까지 서울 서쪽을 종단하는 심야 노선입니다.',
  },
];

/* ── Page ── */
export default async function NightBusMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16

  // en — English text guide
  if (locale === 'en') {
    return <NightBusGuideEn />;
  }

  // other locales — 404
  if (locale !== 'ko') {
    notFound();
  }

  const tp = await getTranslations({ locale, namespace: 'pages' });
  const mapLabels = { kakao: tp('map.kakao'), naver: tp('map.naver'), aria: tp('map.aria') };

  // 역 카드용 정류소 참조(V5): 노선도 역 노드 ↔ 서울시 정류소(anchors.json) · 방면별. 작도 데이터는 무수정, 파생값만 클라이언트로 넘긴다.
  const nb = getNightBus();
  const stationStops: Record<string, StopRef[]> = {};
  const towards: Record<string, { out: string; in: string }> = {};
  for (const [no, byDir] of Object.entries(ANCHORS)) {
    const route = nb.routeByNo.get(no);
    if (!route) continue;
    const dOut = route.dirs.find((d) => d.key === 'out'), dIn = route.dirs.find((d) => d.key === 'in');
    if (!dOut || !dIn) continue;
    towards[no] = { out: dOut.toward, in: dIn.toward };
    for (const key of ['out', 'in'] as const) {
      const dir = key === 'out' ? dOut : dIn;
      for (const a of byDir[key]) {
        const stop = dir.stops.find((st) => st.arsId === a.arsId) ?? route.stops.find((st) => st.arsId === a.arsId);
        if (!stop) continue;
        (stationStops[a.node] ??= []).push([no, key, a.arsId, stop.nameKo, stop.lat, stop.lon]);
      }
    }
  }
  const order = ROUTE_ORDER as readonly string[];
  for (const list of Object.values(stationStops)) list.sort((x, y) => order.indexOf(x[0]) - order.indexOf(y[0]) || (x[1] === y[1] ? 0 : x[1] === 'out' ? -1 : 1));
  // 노선 상세 페이지가 있는 노선 (등록부 5 + 자율주행 A21) — 내부 링크
  const routePaths: Record<string, string> = Object.fromEntries(R3A_NIGHT_ROUTES.map((n) => [n, `/night-bus/${n.toLowerCase()}`]));
  routePaths.A21 = '/routes/simya-a21';
  const mapRoutePaths = Object.fromEntries(Object.entries(routePaths).map(([k, v]) => [k, `/${locale}${v}`]));

  return (
    <>
      {/* JSON-LD: WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: PAGE_H1,
            description: PAGE_DESC,
            url: PAGE_URL,
            inLanguage: 'ko',
            isPartOf: {
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
            },
          }),
        }}
      />
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: '홈', path: '' },
                { name: PAGE_H1, path: '/night-bus-map' },
              ],
              'ko',
            ),
          ),
        }}
      />

      <PageHero eyebrow="서울 심야버스" title={PAGE_H1} lead="대리기사, 야간근무자, 막차 이후 귀가자를 위한 서울 심야버스 지도" crumbs={<Crumbs label="경로 표시" items={[{ href: '/', label: '홈' }, { label: '심야버스 노선도' }]} />} />
      <Section size="tight" ariaLabel={PAGE_H1}>

      {/* 도입 문단 — 네이버봇 최우선 구간 */}
      <p className={styles.intro}>
        서울 심야버스 노선과 환승 경로를 한눈에 확인할 수 있는 노선도입니다.
        올빼미버스 N버스 14개 노선과 자율주행 심야버스 A21의 주요 경유지와 환승역을 보여줍니다.
        출발역과 도착역을 선택하면 직통 또는 환승 경로를 찾을 수 있습니다.
        대리운전이 끝난 뒤 귀가하거나 야간근무를 마치고 퇴근할 때 막차 이후 이동 경로를 찾는 데 활용할 수 있습니다.
      </p>

      {/* 노선도 액자 — 어두운 틀 안의 밝은 지도 (V5) */}
      <div className={styles.frame}>
        <div className={styles.frameHead}>
          <div>
            <p className="v2-eyebrow">올빼미버스 노선도 · Seoul Autonomous 자체 제작</p>
            <p className={styles.frameLead}>노선을 누르면 그 경로만 강조되고, 역을 누르면 지나는 노선과 정류소 번호·방면이 보입니다. 출발역과 도착역을 넣으면 직통 또는 환승 경로를 찾습니다.</p>
          </div>
          <p className={styles.frameMeta}>기준일 <time dateTime="2026-06-08">2026-06-08</time> 카카오맵 노선 검색 · 정류소 번호는 서울시 공식 데이터({NIGHT_META.stopsSource.snapshot}) · 역 위치는 권역 표시</p>
        </div>
        <NightBusMap stationStops={stationStops} towards={towards} routePaths={mapRoutePaths} />
      </div>

      {/* H2: 노선도 한눈에 보기 */}
      <div className={styles.section}>
        <h2 className={styles.h2}>서울 심야버스 노선도 한눈에 보기</h2>
        <p className={styles.bodyText}>
          위 노선도는 올빼미버스 N버스 14개 노선과 자율주행 심야버스 A21의 주요 경유지와 환승 허브를 한눈에 볼 수 있도록 정리한 도식입니다.
          노선을 선택해 경로를 강조하고 출발역과 도착역을 입력하면 직통 또는 환승 경로를 확인할 수 있습니다.
        </p>
      </div>

      {/* 고지 박스 (축약) — H2 본문 직후 */}
      <div className={styles.noticeBox}>
        <div className={styles.noticeTitle}>
          <AlertIcon />
          안내
        </div>
        <div className={styles.noticeText}>
          <p>이 노선도는 서울 심야버스의 주요 경유지와 환승 구조를 빠르게 파악하기 위한 도식입니다.</p>
          <p>환승 지점은 권역 기준으로 표시되어 실제 정류장 사이에 이동이 필요할 수 있습니다.</p>
          <p>탑승 전에는 정류장 위치와 운행 방향과 도착 시간을 네이버지도 카카오맵 또는 서울시 안내에서 확인하세요.</p>
        </div>
      </div>

      {/* H2: 환승 허브 */}
      <div className={styles.section}>
        <h2 className={styles.h2}>서울 N버스와 올빼미버스 환승 허브</h2>
        <p className={styles.bodyText}>
          아래 16개 허브는 올빼미버스 3개 노선 이상이 만나는 곳입니다.
          노선도 안에서 역이나 허브를 누르면 지나는 노선과 정류소 번호·방면이 보이고, 강남역·홍대입구역·동대문역은 승강장별 정류소 번호와 실제 지도를 담은 허브 페이지가 있습니다.
          실제 정류장 위치와 운행 방향은 지도 링크 또는 공식 지도 서비스에서 다시 확인하세요.
        </p>
        <ul className={styles.hubList}>
          {HUBS.map((hub) => { const p = hubPath(hub.slug); return (
            <li key={hub.slug} className={styles.hubItem}>
              <span className={styles.hubName}>{hub.nameKo}</span>
              <span className={styles.hubRoutes}>{hub.routes.join(' · ')}</span>
              <span className={styles.hubActions}>
                {p ? <Link href={p} className={styles.hubPage}>허브 페이지 →</Link> : null}
                <MapLinks name={hub.nameKo} lat={hub.lat} lon={hub.lon} labels={mapLabels} />
              </span>
            </li>
          ); })}
        </ul>
      </div>

      {/* H2: 노선별 핵심 경유지 */}
      <div className={styles.section}>
        <h2 className={styles.h2}>노선별 핵심 경유지</h2>
        <p className={styles.bodyText}>
          서울 심야버스 노선 15개의 핵심 경유지와 이동 방향을 정리했습니다.
          각 노선이 어떤 권역을 연결하는지 확인하고, 심야 귀가나 새벽 출근 경로를 계획할 때 참고하세요.
        </p>
        {routeDescriptions.map((r) => (
          <div key={r.id} className={styles.routeCard}>
            <div className={styles.routeHeader}>
              <span className={styles.routeColorDot} style={{ backgroundColor: r.color }} />
              <span className={styles.routeName}>{r.label}</span>
              {r.tag && <span className={styles.routeTag}>{r.tag}</span>}
            </div>
            <p className={styles.routeDesc}>{r.desc}</p>
            {routePaths[r.id] && <Link href={routePaths[r.id]} className={styles.routeLink}>{r.label} 노선 상세 — 전체 정류장·정류소 번호·첫차 막차 →</Link>}
          </div>
        ))}
      </div>

      {/* H2: 카카오맵에서 위치 확인하는 방법 */}
      <div className={styles.section}>
        <h2 className={styles.h2}>카카오맵에서 위치 확인하는 방법</h2>
        <p className={styles.bodyText}>
          이 노선도의 역과 허브 위치는 권역 표시이며, 실제 정류장과 다를 수 있습니다.
          정확한 정류장 위치와 운행 방향은 카카오맵이나 네이버지도에서 확인하세요.
        </p>
        <p className={styles.bodyText}>
          카카오맵 앱이나 웹에서 역 이름과 함께 &ldquo;심야버스&rdquo; 또는 &ldquo;N버스&rdquo;를 검색하면
          해당 정류장의 심야버스 정보를 더 빠르게 찾을 수 있습니다.
        </p>
      </div>

      {/* H2: 이용 전 확인할 점 */}
      <div className={styles.section}>
        <h2 className={styles.h2}>심야버스 이용 전 확인할 점</h2>
        <ul className={styles.checkList}>
          <li>이 노선도는 추상 노선도이며, 실제 정류장 위치·순서와 다를 수 있습니다.</li>
          <li>탑승 전 카카오맵·네이버지도·서울시 공식 안내에서 실제 운행 여부와 정류장을 확인하세요.</li>
          <li>올빼미버스는 밤 11시부터 새벽 6시 사이에 운행합니다. 기점 첫차는 노선별로 23:10~00:00, 막차는 03:10~04:10입니다(서울시 운행표 2026-03-20 기준). 각 노선 페이지와 홈 상태줄에서 노선별 첫차·막차를 확인하세요.</li>
          <li>서울 올빼미버스 요금은 카드 기준 2,500원입니다(서울시, 2026년 3월 20일 기준). 요금과 운행 정보는 변경될 수 있으므로 탑승 전 최신 안내를 확인하세요.</li>
          <li>환승 허브에서의 환승은 동일 정류장을 보장하지 않습니다. 실제 정류장 간 도보 이동이 필요할 수 있습니다.</li>
          <li>정류장·표시 시각을 확인한 자율주행 노선은 심야A21만 해당합니다. 나머지 14개는 일반 올빼미버스입니다.</li>
        </ul>
      </div>

      {/* H2: 관련 실용 가이드 */}
      <div className={styles.section}>
        <h2 className={styles.h2}>관련 실용 가이드</h2>
        <ul className={styles.relatedGuides}>
          <li>
            <Link href="/night-bus-fare" className={styles.relatedGuideLink}>
              서울 심야버스 요금·환승 안내 →
            </Link>
          </li>
          <li>
            <Link href="/after-last-train" className={styles.relatedGuideLink}>
              막차 이후 서울 이동 방법 →
            </Link>
          </li>
        </ul>
      </div>

      {/* Footer */}
      </Section>
    </>
  );
}
