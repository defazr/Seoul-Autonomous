'use client';

import { useState, type ReactNode } from 'react';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';

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
    color: 'var(--color-fg-3)',
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
          onChange={setTab}
        />
      </div>

      {heroSection}

      <div style={sectionTitleStyle}>{faqSectionTitle}</div>
      {faqSection}

      <div style={sectionTitleStyle}>{stepsSectionTitle}</div>
      {stepsSection}

      {tab === 'TAXI' && (
        <>
          <div style={sectionTitleStyle}>{kakaoSectionTitle}</div>
          {kakaoSection}
        </>
      )}

      <div style={sectionTitleStyle}>{tipsSectionTitle}</div>
      {tipsSection}
    </>
  );
}
