import Image from 'next/image';
import { Link } from '../../i18n/navigation';
import styles from './NightBusMapLaunch.module.css';

const IMAGES = [
  { src: '/images/updates/updates-night-bus-map-01-full.jpg', alt: '서울 심야버스 노선도 전체 화면' },
  { src: '/images/updates/updates-night-bus-map-02-route.jpg', alt: 'N16 올빼미버스 노선 선택 화면' },
  { src: '/images/updates/updates-night-bus-map-03-transfer.jpg', alt: '서울 심야버스 환승역 표시 화면' },
  { src: '/images/updates/updates-night-bus-map-04-journey.jpg', alt: '올빼미버스 출발 도착 환승 경로 화면' },
  { src: '/images/updates/updates-night-bus-map-05-fullscreen.jpg', alt: '서울 심야버스 노선도 크게 보기 화면' },
  { src: '/images/updates/updates-night-bus-map-06-a21.jpg', alt: '심야A21 자율주행 심야버스 노선 화면' },
];

const FAQ = [
  { q: '서울 심야버스(올빼미버스)는 몇 시에 운행하나요?', a: '올빼미버스는 노선별로 운행 시간과 배차 간격이 다릅니다. 이 노선도는 노선과 환승 구조를 안내하며, 정확한 첫차·막차 시간과 실시간 도착 정보는 카카오맵·네이버지도 또는 서울시 공식 안내에서 확인하세요.' },
  { q: '대리운전 후 새벽에 탈 서울 심야버스 노선을 찾을 수 있나요?', a: '출발역과 도착역을 고르면 그 구간을 잇는 심야버스 경로를 찾아줍니다. 직통이 없으면 환승 경로까지 보여주므로, 새벽 귀가 경로를 미리 확인해 둘 수 있습니다. 다만 막차 시각은 노선마다 다르니 카카오맵에서 함께 확인하세요.' },
  { q: '막차가 끊긴 뒤 가까운 올빼미버스 정류장을 찾을 수 있나요?', a: '노선도에서 가까운 역을 누르면 그 역을 지나는 심야버스 노선이 표시됩니다. 도착지까지의 경로는 출발·도착역을 골라 확인하세요. 실제 정류장 위치는 카카오맵에서 다시 확인하는 것이 안전합니다.' },
  { q: '이 노선도로 요금도 알 수 있나요?', a: '이 노선도는 노선과 환승 경로를 보여주는 지도입니다. 요금 정보는 포함하지 않습니다. 심야버스 요금은 카카오맵이나 서울시 공식 안내에서 확인하세요.' },
  { q: '환승역은 어떻게 찾나요?', a: '노선 두 개를 함께 선택하면, 두 노선이 같이 지나는 환승역이 주황색으로 깜빡입니다. 출발역과 도착역을 고르면 환승 경로를 자동으로 찾아줍니다.' },
  { q: '자율주행 심야버스 A21은 일반 올빼미버스와 다른가요?', a: 'A21은 자율주행으로 운행하는 별도의 심야 노선입니다. 운행 방식이 다르므로 노선도에서도 올빼미버스와 구분해 표시했습니다.' },
  { q: '지도에 표시된 위치에서 바로 버스를 타면 되나요?', a: '노선도의 역 위치는 권역을 표시한 도식이라, 실제 정류장은 길 건너편이나 떨어진 곳일 수 있습니다. 탑승 전 카카오맵에서 정확한 정류장 위치와 방향을 확인하세요.' },
  { q: '노선도를 이미지로 저장할 수 있나요?', a: '"PNG 저장" 버튼으로 현재 화면을 이미지로 저장할 수 있습니다. 노선을 선택한 상태 그대로 저장되며, 인터넷이 안 되는 곳에서도 볼 수 있습니다.' },
];

export function NightBusMapLaunch() {
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.h2}>들어가며</h2>
        <p className={styles.p}><strong>서울 심야버스 노선도</strong>는 막차가 끊긴 뒤 올빼미버스(N버스)와 자율주행 심야버스 A21을 한눈에 확인하려는 사람에게 필요합니다. 대리운전을 마치고, 야간 근무를 끝내고, 늦게까지 있다가 집에 가야 할 때 가장 막막한 건 &ldquo;<strong>어느 버스를 타고, 어디서 갈아타야 하나</strong>&rdquo;입니다. 지하철이 끊긴 새벽, 서울에는 올빼미버스 노선과 자율주행 심야버스 A21이 운행하지만, 이 노선들을 <strong>한 장에 모아 환승까지 보여주는 지도</strong>는 찾기 어려웠습니다.</p>
        <Image className={styles.img} src={IMAGES[0].src} alt={IMAGES[0].alt} width={1440} height={900} loading="lazy" />
        <p className={styles.p}>그래서 서울 심야버스 노선 전체를 한 장에 정리한 노선도를 만들었습니다. 지하철 노선도처럼 노선을 색으로 구분하고, 노선을 누르고 출발역과 도착역을 고르면 환승 경로가 표시되는 인터랙티브 노선도입니다. 새벽에 휴대폰으로 바로 확인할 수 있도록 모바일 화면에 맞췄습니다.</p>
        <p className={styles.cta}><Link href="/night-bus-map" className={styles.ctaLink}>서울 심야버스 노선과 환승 노선도 바로 보기 →</Link></p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>무엇을 볼 수 있나</h2>

        <h3 className={styles.h3}>1. 노선별로 보기</h3>
        <p className={styles.p}>범례에서 노선(N13, N16 … N75, 심야A21)을 누르면 그 노선만 밝게 표시됩니다. 여러 개를 함께 눌러 비교할 수도 있습니다.</p>
        <Image className={styles.img} src={IMAGES[1].src} alt={IMAGES[1].alt} width={1440} height={900} loading="lazy" />

        <h3 className={styles.h3}>2. 환승역 찾기</h3>
        <p className={styles.p}>두 노선을 함께 선택하면, 두 노선이 같이 지나는 <strong>환승역이 주황색으로 깜빡입니다</strong>. 어디서 갈아탈 수 있는지 한눈에 보입니다. 만약 깜빡이는 역이 없으면, 그 두 노선은 직접 환승이 안 된다는 뜻입니다.</p>
        <Image className={styles.img} src={IMAGES[2].src} alt={IMAGES[2].alt} width={1440} height={900} loading="lazy" />

        <h3 className={styles.h3}>3. 출발역 → 도착역 경로 찾기</h3>
        <p className={styles.p}>출발역과 도착역을 고르면 <strong>직통 또는 환승 경로</strong>를 자동으로 찾아줍니다. 현재 노선도에 포함된 역을 기준으로 직통, 환승 1회, 환승 2회 경로를 찾아 보여줍니다.</p>
        <Image className={styles.img} src={IMAGES[3].src} alt={IMAGES[3].alt} width={1440} height={900} loading="lazy" />

        <h3 className={styles.h3}>4. 크게 보기 · 이미지 저장</h3>
        <p className={styles.p}>&ldquo;크게 보기&rdquo;로 전체화면에서 손가락으로 확대해 자세히 볼 수 있고, &ldquo;PNG 저장&rdquo;으로 현재 화면을 이미지로 저장해 둘 수 있습니다. 저장한 이미지는 인터넷이 안 되는 곳에서도 볼 수 있습니다.</p>
        <Image className={styles.img} src={IMAGES[4].src} alt={IMAGES[4].alt} width={1440} height={900} loading="lazy" />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>어떤 노선이 들어 있나</h2>
        <p className={styles.p}>2026년 6월 기준, 서울에서 운행하는 올빼미버스 노선(N13 · N15 · N16 · N26 · N30 · N31 · N37 · N51 · N61 · N62 · N64 · N72 · N73 · N75)과, 자율주행으로 운행하는 심야버스 <strong>A21</strong>을 모두 담았습니다. A21은 일반 올빼미버스와 구분해 별도 노선으로 표시했습니다. 노선이 추가되거나 바뀌면 노선도와 이 안내를 갱신합니다.</p>
        <Image className={styles.img} src={IMAGES[5].src} alt={IMAGES[5].alt} width={1440} height={900} loading="lazy" />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>노선 정보의 출처</h2>
        <p className={styles.p}>노선과 정류장 정보는 <strong>카카오맵에 표시되는 심야버스 노선 정보와 서울시 공개 정보를 대조해 정리</strong>했습니다(2026년 6월 기준). 노선도의 역 위치는 환승 구조를 한눈에 보기 쉽도록 <strong>배치한 도식</strong>이며, 실제 지리적 위치와는 다릅니다.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>이용 전 확인할 점</h2>
        <p className={styles.p}>이 노선도는 <strong>이동 계획을 세우는 데 참고하는 지도</strong>입니다. 다음 사항을 함께 확인하세요.</p>
        <ul className={styles.ul}>
          <li>지도의 역 위치는 <strong>권역 표시</strong>입니다. 실제 정류장은 길 건너편이나 조금 떨어진 곳에 있을 수 있습니다.</li>
          <li>정확한 <strong>정류장 위치·운행 방향·도착 시간</strong>은 카카오맵이나 네이버지도에서 다시 확인하세요.</li>
          <li>운행 시간·간격·막차 시각은 변동될 수 있습니다.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>자주 묻는 질문</h2>
        {FAQ.map((item, i) => (
          <div key={i} className={styles.faq}>
            <h3 className={styles.faqQ}>{item.q}</h3>
            <p className={styles.faqA}>{item.a}</p>
          </div>
        ))}
        <p className={styles.cta}><Link href="/night-bus-map" className={styles.ctaLink}>서울 심야버스 노선과 환승 노선도 바로 보기 →</Link></p>
      </section>
    </>
  );
}

export function nightBusMapFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
