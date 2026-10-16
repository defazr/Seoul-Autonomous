'use client';

import { useEffect, useState } from 'react';

export type ScheduleItem = { no: string; first: string; last: string };
export type NightStatus = {
  ready: boolean;
  min: number;
  time: string;
  pinned: boolean;
  running: Set<string>;
  next: { no: string; first: string; waitMin: number } | null;
};

export const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export function inWindow(first: string, last: string, nowMin: number): boolean {
  const f = toMin(first); let l = toMin(last); let n = nowMin;
  if (l < f) { l += 1440; if (n < f) n += 1440; }
  return n >= f && n <= l;
}
export function kstMinutes(): number {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  return Number(p.find((x) => x.type === 'hour')!.value) % 24 * 60 + Number(p.find((x) => x.type === 'minute')!.value);
}
export const hhmm = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** 검토용 고정 시각: ?at=00:30 — UI 없음 · 상태줄에 '고정' 표시. 실사용자에게는 노출되지 않는 경로다. */
function pinnedMinutes(): number | null {
  if (typeof window === 'undefined') return null;
  const at = new URLSearchParams(window.location.search).get('at');
  return at && /^\d{1,2}:\d{2}$/.test(at) ? toMin(at) % 1440 : null;
}

const EMPTY: NightStatus = { ready: false, min: 0, time: '--:--', pinned: false, running: new Set(), next: null };

/**
 * 운행표 기준 시간대 — 기기 시각(KST)으로만 계산한다. SSR 에서는 ready=false (빈 상태) 로 두어 서버 비용·캐시 오염 0.
 * 도착 시각이 아니다. 30초마다 재계산.
 */
export function useNightStatus(schedule: ScheduleItem[]): NightStatus {
  const [st, setSt] = useState<NightStatus>(EMPTY);
  useEffect(() => {
    const tick = () => {
      const pin = pinnedMinutes();
      const min = pin ?? kstMinutes();
      const running = new Set(schedule.filter((s) => inWindow(s.first, s.last, min)).map((s) => s.no));
      const firsts = schedule.map((s) => ({ no: s.no, first: s.first, m: toMin(s.first) })).sort((a, b) => a.m - b.m);
      const nx = firsts.find((x) => x.m > min) ?? firsts[0];
      let wait = nx ? nx.m - min : 0; if (wait < 0) wait += 1440;
      setSt({ ready: true, min, time: hhmm(min), pinned: pin !== null, running, next: nx ? { no: nx.no, first: nx.first, waitMin: wait } : null });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [schedule]);
  return st;
}
