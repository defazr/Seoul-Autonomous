'use client';

import { useState } from 'react';
import styles from './HubArrivals.module.css';

type Item = { routeId: string; raw: string; kind: string; minutes?: number; stopsAway?: number };
type Payload = { stopId: string; fetchedAt: number; items: Item[] };
type Labels = { select: string; button: string; loading: string; basis: string; error: string; empty: string; note: string };
const kst = (ms: number) => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(ms));

/** 허브 도착정보 — 사용자가 승강장을 고르고 버튼을 눌렀을 때만 서버 프록시(/api/arrivals)를 1회 호출한다. 자동 갱신 없음. */
export function HubArrivals({ platforms, labels, colors }: { platforms: { arsId: string; name: string }[]; labels: Labels; colors: Record<string, string> }) {
  const [ars, setArs] = useState(platforms[0]?.arsId ?? '');
  const [state, setState] = useState<{ status: 'idle' | 'loading' | 'ok' | 'error'; data?: Payload }>({ status: 'idle' });
  const load = async () => {
    setState({ status: 'loading' });
    try { const res = await fetch(`/api/arrivals/${ars}`, { cache: 'no-store' }); if (!res.ok) { setState({ status: 'error' }); return; } const data = (await res.json()) as Payload; setState({ status: 'ok', data }); }
    catch { setState({ status: 'error' }); }
  };
  const items = (state.data?.items ?? []).filter((i) => i.kind !== 'ended');
  return (
    <div className={styles.box}>
      <div className={styles.row}>
        <label className={styles.label} htmlFor="hub-ars">{labels.select}</label>
        <select id="hub-ars" className={styles.select} value={ars} onChange={(e) => { setArs(e.target.value); setState({ status: 'idle' }); }}>
          {platforms.map((p) => <option key={p.arsId} value={p.arsId}>{p.arsId} · {p.name}</option>)}
        </select>
        <button type="button" className={styles.btn} onClick={load} disabled={state.status === 'loading'}>{state.status === 'loading' ? labels.loading : labels.button}</button>
      </div>
      {state.status === 'error' && <p className={styles.err} role="status">{labels.error}</p>}
      {state.status === 'ok' && state.data && (
        <div role="status">
          <p className={styles.basis}>{labels.basis.replace('{time}', kst(state.data.fetchedAt))}</p>
          {items.length === 0 ? <p className={styles.empty}>{labels.empty}</p> : (
            <ul className={styles.list}>{items.map((i, k) => <li key={k}><span className={styles.chip} style={{ background: colors[i.routeId] ?? '#9AA3B2' }}>{i.routeId}</span><span className={styles.raw}>{i.raw}</span></li>)}</ul>
          )}
        </div>
      )}
      <p className={styles.note}>{labels.note}</p>
    </div>
  );
}
