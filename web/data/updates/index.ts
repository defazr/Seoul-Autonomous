import type { UpdateEntry } from '../../lib/types/update';
import a504 from './a504-early-morning-start';
import gangnam19 from './gangnam-robotaxi-expanded-to-19';
import nightBusMap from './night-bus-map-launch';
import rebirth from './site-rebirth-night-bus-first';

// 2026-05-09 「강남 로보택시 서비스 확대」(gangnam-robotaxi-expanded)는 R3b-2 에서 19대 글로 통합 — 옛 URL 은 next.config redirects.
const updates: UpdateEntry[] = [a504, gangnam19, nightBusMap, rebirth];

// Sort newest first
updates.sort((a, b) => b.date.localeCompare(a.date));

export function getAllUpdates(): UpdateEntry[] {
  return updates;
}

export function getUpdateBySlug(slug: string): UpdateEntry | undefined {
  return updates.find((u) => u.slug === slug);
}
