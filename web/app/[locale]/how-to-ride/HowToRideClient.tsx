'use client';

import { useState, type ReactNode } from 'react';
import { SegmentedControl } from '../../../components/v2/transit/Controls';

type Props = {
  filterBuses: string;
  filterRobotaxis: string;
  heroSection: ReactNode;
  faqSectionTitle: string;
  faqSection: ReactNode;
  stepsSectionTitle: string;
  stepsSection: ReactNode;
  kakaoSectionTitle: string;
  kakaoSection: ReactNode;
  tipsSectionTitle: string;
  tipsSection: ReactNode;
};

export function HowToRideClient({
  filterBuses,
  filterRobotaxis,
  heroSection,
  faqSectionTitle,
  faqSection,
  stepsSectionTitle,
  stepsSection,
  kakaoSectionTitle,
  kakaoSection,
  tipsSectionTitle,
  tipsSection,
}: Props) {
  const [tab, setTab] = useState('BUS');

  const sectionTitleStyle: React.CSSProperties = {
    fontWeight: 500,
    fontSize: 11,
    lineHeight: '14px',
    color: 'var(--fg-2)',
    letterSpacing: '0.88px',
    textTransform: 'uppercase',
    marginBottom: 12,
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <SegmentedControl
          options={[
            { value: 'BUS', label: filterBuses },
            { value: 'TAXI', label: filterRobotaxis },
          ]}
          value={tab}
          onChange={setTab} label="Service type" />
      </div>

      {heroSection}

      <h2 style={sectionTitleStyle}>{faqSectionTitle}</h2>
      {faqSection}

      <h2 style={sectionTitleStyle}>{stepsSectionTitle}</h2>
      {stepsSection}

      {tab === 'TAXI' && (
        <>
          <h2 style={sectionTitleStyle}>{kakaoSectionTitle}</h2>
          {kakaoSection}
        </>
      )}

      <h2 style={sectionTitleStyle}>{tipsSectionTitle}</h2>
      {tipsSection}
    </>
  );
}
