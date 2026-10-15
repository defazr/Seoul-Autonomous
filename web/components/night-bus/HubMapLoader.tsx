'use client';

import dynamic from 'next/dynamic';
import type { HubMapProps } from './HubMap';
import styles from './HubMap.module.css';

/** 지도 라이브러리는 클라이언트에서만, 허브 페이지에서만 로드한다 (SSR 없음 · 다른 페이지 번들 영향 0). */
const HubMap = dynamic(() => import('./HubMap'), { ssr: false, loading: () => <div className={styles.map} aria-busy="true" /> });
export default function HubMapLoader(props: HubMapProps) { return <HubMap {...props} />; }
