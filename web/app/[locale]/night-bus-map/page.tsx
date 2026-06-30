import { notFound } from 'next/navigation';
import { Link } from '../../../i18n/navigation';
import { SiteFooter } from '../../../components/common/SiteFooter';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SITE_URL, SITE_NAME } from '../../../lib/seo/config';
import { NightBusMap } from './NightBusMap';
import { ROUTE_COLORS } from './night-bus-data';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import type { Metadata } from 'next';
import styles from './page.module.css';

/* ── Static params: ko only ── */
export function generateStaticParams() {
  return [{ locale: 'ko' }];
}

/* ── Metadata: ko only, no en alternates ── */
const PAGE_TITLE = '서울 심야버스 노선과 N버스 환승 노선도';
const PAGE_H1 = '서울 심야버스 노선과 환승 노선도';
const PAGE_DESC = '서울 심야버스 노선과 N버스 환승 경로를 한눈에 확인하세요. 올빼미버스 14개 노선과 심야A21의 주요 경유지와 환승역을 보고 출발역과 도착역을 선택해 직통 또는 환승 경로를 찾을 수 있습니다.';
const PAGE_URL = `${SITE_URL}/ko/night-bus-map`;
const OG_IMAGE_URL = `${SITE_URL}/og/night-bus-map-og.jpg`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
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
function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

/* ── Hub data for HTML links ── */
const clickableHubs = [
  { label: '동대문', query: '동대문역' },
  { label: '종로', query: '종로3가역' },
  { label: '홍대입구', query: '홍대입구역' },
  { label: '신촌', query: '신촌역' },
  { label: '강남', query: '강남역' },
  { label: '서울역', query: '서울역' },
  { label: '합정', query: '합정역' },
  { label: '신설동', query: '신설동역' },
  { label: '청량리', query: '청량리역' },
  { label: '잠실', query: '잠실역' },
  { label: '사당', query: '사당역' },
  { label: '영등포', query: '영등포역' },
  { label: '건대입구', query: '건대입구역' },
];

/* ── Route descriptions ── */
const routeDescriptions: { id: string; label: string; color: string; tag?: string; desc: string }[] = [
  {
    id: 'A21', label: '심야A21', color: ROUTE_COLORS.A21, tag: '자율주행',
    desc: '심야A21은 동대문, 종로, 광화문, 신촌, 홍대입구, 합정 축을 따라 운행되는 자율주행 심야 노선입니다. 도심에서 홍대·합정 방면으로 심야에 이동할 때 참고할 수 있으며, 이 노선도에서 자율주행 검증 노선으로 별도 강조합니다.',
  },
  {
    id: 'N13', label: 'N13', color: ROUTE_COLORS.N13,
    desc: 'N13은 노원, 청량리, 신설동, 동대문에서 강남, 잠실, 복정까지 이어지는 심야버스입니다. 서울 동북권에서 강남·동남권으로 심야에 종단 이동할 때 참고할 수 있습니다.',
  },
  {
    id: 'N15', label: 'N15', color: ROUTE_COLORS.N15,
    desc: 'N15는 도봉산에서 신설동, 동대문, 종로, 서울역을 거쳐 사당까지 이어지는 남북 종단 노선입니다. 야간근무 퇴근이나 새벽 출근 시 서울 북부에서 남부 방면으로 이동할 때 유용합니다.',
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
    desc: 'N31은 강동, 잠실, 강남에서 종로, 동대문을 거쳐 노원까지 이어지는 심야버스입니다. 강남 심야버스를 찾는 분들이 동남권에서 북부로 이동할 때 참고할 수 있습니다.',
  },
  {
    id: 'N37', label: 'N37', color: ROUTE_COLORS.N37,
    desc: 'N37은 복정에서 강남, 광화문을 거쳐 구파발까지 운행합니다. 동남권에서 서북부까지 서울을 대각선으로 횡단하는 심야 노선입니다.',
  },
  {
    id: 'N51', label: 'N51', color: ROUTE_COLORS.N51,
    desc: 'N51은 금천에서 영등포, 합정, 홍대입구, 신촌, 서울역, 광화문, 동대문, 청량리, 노원까지 이어지는 장거리 심야버스입니다. 서남권에서 도심을 거쳐 동북권까지 연결하며, 서울역 심야버스를 찾는 분들에게도 유용합니다.',
  },
  {
    id: 'N61', label: 'N61', color: ROUTE_COLORS.N61,
    desc: 'N61은 금천, 사당, 강남, 잠실에서 건대입구, 군자, 면목, 노원까지 운행합니다. 강남권에서 동북부 외곽까지 이어지는 심야 노선으로, 대리기사 이동 경로와도 겹치는 구간이 많습니다.',
  },
  {
    id: 'N62', label: 'N62', color: ROUTE_COLORS.N62,
    desc: 'N62는 영등포, 합정, 홍대입구, 신촌, 서울역, 종로, 동대문에서 왕십리, 성수, 건대입구, 군자, 면목까지 이어지는 동서축 심야버스입니다. 서부에서 동부로 도심을 관통하는 심야 귀가 노선입니다.',
  },
  {
    id: 'N64', label: 'N64', color: ROUTE_COLORS.N64,
    desc: 'N64는 개화에서 영등포, 사당, 강남까지 운행하는 비교적 짧은 심야 노선입니다. 서부에서 남부 강남 방면으로 이동할 때 참고할 수 있습니다.',
  },
  {
    id: 'N72', label: 'N72', color: ROUTE_COLORS.N72,
    desc: 'N72는 구파발에서 합정, 홍대입구, 신촌, 서울역, 동대문, 신설동, 청량리까지 운행합니다. 서북권에서 도심을 거쳐 동북권으로 이동하는 심야 노선입니다.',
  },
  {
    id: 'N73', label: 'N73', color: ROUTE_COLORS.N73,
    desc: 'N73은 복정, 잠실에서 건대입구, 성수, 왕십리, 서울역, 홍대입구를 거쳐 구파발까지 이어집니다. 동남권에서 서북부로 이동할 때 참고할 수 있는 심야버스입니다.',
  },
  {
    id: 'N75', label: 'N75', color: ROUTE_COLORS.N75,
    desc: 'N75는 구파발에서 신촌, 서울역, 강남, 사당, 금천까지 운행합니다. 서북에서 서남까지 서울 서쪽을 종단하는 심야 노선으로, 동대문 심야버스와 함께 도심 이동의 보조 축 역할을 합니다.',
  },
];

/* ── Page ── */
export default async function NightBusMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ko only — /en/night-bus-map → 404
  if (locale !== 'ko') {
    notFound();
  }

  return (
    <PageContainer width="default">
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
      {/* TopBar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft />
        </Link>
      </div>

      {/* Hero */}
      <h1 className={styles.heading}>{PAGE_H1}</h1>
      <p className={styles.subtitle}>
        대리기사, 야간근무자, 막차 이후 귀가자를 위한 서울 심야버스 지도
      </p>

      {/* 도입 문단 — 네이버봇 최우선 구간 */}
      <p className={styles.intro}>
        서울 심야버스 노선과 환승 경로를 한눈에 확인할 수 있는 노선도입니다.
        올빼미버스 N버스 14개 노선과 자율주행 심야버스 A21의 주요 경유지와 환승역을 보여줍니다.
        출발역과 도착역을 선택하면 직통 또는 환승 경로를 찾을 수 있습니다.
        대리운전이 끝난 뒤 귀가하거나 야간근무를 마치고 퇴근할 때 막차 이후 이동 경로를 찾는 데 활용할 수 있습니다.
      </p>

      {/* 기준일 */}
      <p className={styles.datestamp}>
        기준일: <time dateTime="2026-06-08">2026-06-08</time> 카카오맵 노선 검색 기준
      </p>

      {/* 짧은 기능 안내 */}
      <p className={styles.featureNote}>
        노선을 선택하면 해당 경로가 강조됩니다. 출발역과 도착역을 입력하면 직통 또는 환승 경로를 확인할 수 있습니다.
      </p>

      {/* SVG 노선도 */}
      <NightBusMap />

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
          아래 13개 허브는 서울 심야버스 노선이 집중적으로 교차하는 주요 권역입니다.
          노선도 안에서 역이나 허브를 선택하면 해당 지점을 지나는 노선을 확인할 수 있습니다.
          실제 정류장 위치와 운행 방향은 아래 카카오맵 링크 또는 공식 지도 서비스에서 다시 확인하세요.
        </p>
        <div className={styles.hubList}>
          {clickableHubs.map((hub) => (
            <a
              key={hub.query}
              href={`https://map.kakao.com/?q=${encodeURIComponent(hub.query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.hubLink}
            >
              {hub.label} 카카오맵에서 위치 보기
              <ExternalLinkIcon />
            </a>
          ))}
        </div>
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
          <li>심야버스 운행 시간은 보통 심야 23:30~새벽 05:00 전후이며, 노선별로 다릅니다.</li>
          <li>서울 심야버스 요금은 일반 시내버스 요금과 동일하나 변동될 수 있습니다.</li>
          <li>환승 허브에서의 환승은 동일 정류장을 보장하지 않습니다. 실제 정류장 간 도보 이동이 필요할 수 있습니다.</li>
          <li>자율주행 검증 노선은 심야A21만 해당합니다. 나머지 14개는 일반 올빼미버스입니다.</li>
        </ul>
      </div>

      {/* Footer */}
      <SiteFooter />
    </PageContainer>
  );
}
