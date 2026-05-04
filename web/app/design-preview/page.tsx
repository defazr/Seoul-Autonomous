'use client';

import { useState } from 'react';
import { Pill, StatusDot } from '../../components/ui/Pill';
import { Button } from '../../components/ui/Button';
import { RouteCard } from '../../components/ui/RouteCard';
import { RobotaxiCard } from '../../components/ui/RobotaxiCard';
import { InfoCard } from '../../components/ui/InfoCard';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import type { FixedRoute, OnDemandService } from '../../lib/types/route';
import styles from './page.module.css';

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
  fare: 'Unknown',
  operator: 'Unknown',
  reservationRequired: 'Unknown',
  appRequired: 'Unknown',
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

const dummyRobotaxi: OnDemandService = {
  id: 'gangnam-robotaxi',
  displayName: 'Gangnam Robotaxi',
  displayNameKo: '강남 로보택시',
  serviceArea: 'Gangnam Station area',
  serviceAreaKo: '강남역 일대',
  appRequired: true,
  appName: 'Kakao T',
  operatingHours: '10:00–22:00',
  operatingDays: 'Daily',
  fare: 'Free (pilot)',
  operator: 'Unknown',
  officialServiceUrl: '',
  lastChecked: '2026-04-29',
  verifiedBy: 'official_announcement',
  verificationLevel: 'official_pending',
  kakaoMapVerified: false,
  sourceUrls: [],
  sourceNote: '',
  disclaimer: '',
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
      </section>
    </main>
  );
}
