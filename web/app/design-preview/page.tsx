'use client';

import { useState } from 'react';
import { Pill, StatusDot } from '../../components/ui/Pill';
import { Button } from '../../components/ui/Button';
import { RouteCard } from '../../components/ui/RouteCard';
import { RobotaxiCard } from '../../components/ui/RobotaxiCard';
import { InfoCard } from '../../components/ui/InfoCard';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import type { FixedRoute, RobotaxiListItem, OperationalField } from '../../lib/types/route';
import styles from './page.module.css';

// 26-C2O: preview 전용 최소 mock. 실제 공개 데이터 정본이 아니다.
// OperationalField 불변식(비확정 셀은 value null)만 충족시킨다.
const unverifiedCell: OperationalField<never> = {
  value: null,
  verificationGrade: 'unverified',
  currentState: 'unverified',
  reason: null,
  sources: [],
};

const dummyRoute: FixedRoute = {
  id: 'cheonggye-a01',
  displayName: 'Cheonggye A01',
  displayNameKo: '청계천 A01',
  startPoint: 'Jongno 5-ga Stn.',
  startPointKo: '종로5가역',
  endPoint: 'Cheonggyecheon Plaza',
  endPointKo: '청계광장',
  firstBus: '09:00',
  lastBus: '18:00',
  headway: '15 min',
  daysOfOperation: 'weekday',
  fare: unverifiedCell,
  operator: unverifiedCell,
  reservationRequired: unverifiedCell,
  appRequired: unverifiedCell,
  lastChecked: '2026-04-29',
  verifiedBy: 'kakao_map_seoul_data',
  verificationLevel: 'kakao_seoul_verified',
  kakaoMapVerified: true,
  sourceUrls: [],
  sourceNote: '',
  disclaimer: '',
};

const dummyRouteOfficial: FixedRoute = {
  ...dummyRoute,
  id: 'cheongwadae-a01',
  displayName: 'Cheongwadae A01',
  displayNameKo: '청와대 A01',
  startPoint: 'Anguk Stn.',
  startPointKo: '안국역',
  endPoint: 'Cheongwadae',
  endPointKo: '청와대',
  firstBus: '09:30',
  lastBus: '17:00',
  headway: 'Unknown',
  verificationLevel: 'official_confirmed',
};

// RobotaxiCard 는 client DTO(RobotaxiListItem)를 받는다. preview 도 같은 계약을 쓴다.
const dummyRobotaxi: RobotaxiListItem = {
  id: 'gangnam-robotaxi',
  displayName: 'Gangnam Robotaxi',
  displayNameKo: '강남 로보택시',
  serviceArea: 'Gangnam Station area',
  serviceAreaKo: '강남역 일대',
  verificationLevel: 'official_confirmed',
  fareBands: [
    { start: '22:00', end: '23:00', amount: 5800 },
    { start: '23:00', end: '02:00', amount: 6700 },
    { start: '02:00', end: '04:00', amount: 5800 },
    { start: '04:00', end: '05:00', amount: 4800 },
  ],
  operatorNames: ['에스더블유엠', '카카오모빌리티'],
  reservation: { mode: 'realtime_call', appName: 'Kakao T' },
  app: { appName: 'Kakao T', purposes: ['request', 'payment'] },
  source: {
    publisher: '서울특별시',
    url: 'https://news.seoul.go.kr/traffic/archives/516542',
    publishedAt: '2026-03-16',
    effectiveAt: '2026-04-06',
  },
};

// 미확인 상태 디자인 확인용
const dummyRobotaxiPending: RobotaxiListItem = {
  ...dummyRobotaxi,
  id: 'preview-pending',
  verificationLevel: 'official_pending',
  fareBands: null,
  operatorNames: [],
  reservation: null,
  app: null,
  source: null,
};

export default function DesignPreview() {
  const [segment, setSegment] = useState('ALL');

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Design Preview</h1>
      <p className={styles.subheading}>Round 4 — 6 core components</p>

      {/* Fonts */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Fonts</h2>
        <p className={styles.fontSample}>
          Geist: The quick brown fox jumps over the lazy dog
        </p>
        <p className={`${styles.fontSample} ${styles.fontSampleKr}`}>
          Pretendard: 서울 자율주행 버스 노선 안내
        </p>
      </section>

      {/* Pill */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pill + StatusDot</h2>
        <div className={styles.row}>
          <Pill>
            <StatusDot size={5} />
            <span>DEFAULT</span>
          </Pill>
          <Pill variant="accent">
            <StatusDot color="var(--color-accent)" size={5} />
            <span>VERIFIED</span>
          </Pill>
          <Pill variant="success">
            <StatusDot color="var(--color-success)" size={5} />
            <span>OFFICIAL</span>
          </Pill>
          <Pill variant="warning">
            <StatusDot color="var(--color-warning)" size={5} />
            <span>CHECK BEFORE RIDING</span>
          </Pill>
        </div>
      </section>

      {/* Button */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Button</h2>
        <div className={styles.row}>
          <Button variant="primary" size="sm">Primary SM</Button>
          <Button variant="secondary" size="sm">Secondary SM</Button>
          <Button variant="ghost" size="sm">Ghost SM</Button>
        </div>
        <div className={styles.row}>
          <Button variant="primary" size="md">Primary MD</Button>
          <Button variant="secondary" size="md">Secondary MD</Button>
          <Button variant="ghost" size="md">Ghost MD</Button>
        </div>
        <div className={styles.row}>
          <Button variant="primary" size="lg">Primary LG</Button>
          <Button variant="primary" size="lg" disabled>Disabled</Button>
        </div>
      </section>

      {/* SegmentedControl */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>SegmentedControl</h2>
        <div className={styles.segmentWrap}>
          <SegmentedControl
            options={[
              { value: 'ALL', label: 'All' },
              { value: 'BUS', label: 'Bus' },
              { value: 'TAXI', label: 'Robotaxi' },
            ]}
            value={segment}
            onChange={setSegment}
          />
        </div>
        <p className={styles.fontSample} style={{ fontSize: 13, color: 'var(--color-fg-4)' }}>
          Selected: {segment}
        </p>
      </section>

      {/* InfoCard */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>InfoCard (2x2 grid)</h2>
        <div className={styles.grid2}>
          <InfoCard label="Hours" value="09:00 – 18:00" />
          <InfoCard label="Days" value="Weekday" />
        </div>
        <div className={styles.grid2}>
          <InfoCard label="Stops" value="28 stops" accent />
          <InfoCard label="Fare" value="Unknown" />
        </div>
      </section>

      {/* RouteCard */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>RouteCard</h2>
        <div className={styles.stack}>
          <RouteCard route={dummyRoute} />
          <RouteCard route={dummyRouteOfficial} />
        </div>
      </section>

      {/* RobotaxiCard */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>RobotaxiCard</h2>
        <RobotaxiCard service={dummyRobotaxi} />
        <RobotaxiCard service={dummyRobotaxiPending} />
      </section>
    </main>
  );
}
