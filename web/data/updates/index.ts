import type { UpdateEntry } from '../../lib/types/update';
import a504 from './a504-early-morning-start';
import gangnam from './gangnam-robotaxi-expanded';
import nightBusMap from './night-bus-map-launch';

const updates: UpdateEntry[] = [a504, gangnam, nightBusMap];

// Sort newest first
updates.sort((a, b) => b.date.localeCompare(a.date));

export function getAllUpdates(): UpdateEntry[] {
  return updates;
}

export function getUpdateBySlug(slug: string): UpdateEntry | undefined {
  return updates.find((u) => u.slug === slug);
}
