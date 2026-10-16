'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { buildModel, plan, suggest, type ClientDoc, type Journey, type Model } from '../../../lib/night-bus/client-model';
import { isCho, normName } from '../../../lib/night-bus/core.mjs';
import { hhmm, kstMinutes, toMin } from '../night/useNightStatus';

export type OriginLoc = { name: string; arsId: string; dist: number };
export type Result = { key: number; journey: Journey; from: string; to: string; at: string; atMin: number; originLoc: OriginLoc | null };
type ModelState = 'idle' | 'loading' | 'ready' | 'error';

type Ctx = {
  from: string; to: string; setFrom: (v: string) => void; setTo: (v: string) => void;
  originLoc: OriginLoc | null; setOriginLoc: (v: OriginLoc | null) => void;
  model: Model | null; modelState: ModelState; ensureModel: () => Promise<Model | null>;
  result: Result | null; search: (from?: string, to?: string) => Promise<void>;
  useAsOrigin: (name: string) => void;
  meta: { stopsSnapshot: string; scheduleRevisedOn: string };
  exposedRoutes: readonly string[]; exposedHubs: readonly string[];
};

const SearchCtx = createContext<Ctx | null>(null);
export const useSearch = () => { const c = useContext(SearchCtx); if (!c) throw new Error('SearchProvider missing'); return c; };

/** 검토용 고정 시각(?at=HH:MM) 을 포함한 현재 분. */
function nowMinutes(): number {
  if (typeof window !== 'undefined') { const at = new URLSearchParams(window.location.search).get('at'); if (at && /^\d{1,2}:\d{2}$/.test(at)) return toMin(at) % 1440; }
  return kstMinutes();
}

/** 홈 질문 카드 ↔ 결과 무대 ↔ 허브 보드가 공유하는 상태. 데이터(≈95KB) 는 첫 상호작용 또는 유휴 시점에 1회 받는다. */
export function SearchProvider({ children, dataUrl, meta, exposedRoutes, exposedHubs }: { children: ReactNode; dataUrl: string; meta: Ctx['meta']; exposedRoutes: readonly string[]; exposedHubs: readonly string[] }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [originLoc, setOriginLoc] = useState<OriginLoc | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [modelState, setModelState] = useState<ModelState>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const loading = useRef<Promise<Model | null> | null>(null);
  const keyRef = useRef(0);

  const ensureModel = useCallback((): Promise<Model | null> => {
    if (model) return Promise.resolve(model);
    if (loading.current) return loading.current;
    setModelState('loading');
    loading.current = fetch(dataUrl).then(async (r) => {
      if (!r.ok) throw new Error(String(r.status));
      const doc = (await r.json()) as ClientDoc;
      const m = buildModel(doc); setModel(m); setModelState('ready'); return m;
    }).catch(() => { setModelState('error'); loading.current = null; return null; });
    return loading.current;
  }, [dataUrl, model]);

  // 유휴 시점 선로드 — 첫 검색이 즉시 답하도록. 실패해도 조용히(상호작용 때 다시 시도).
  useEffect(() => {
    const idle = typeof window.requestIdleCallback === 'function';
    const id = idle ? window.requestIdleCallback(() => { ensureModel(); }, { timeout: 4000 }) : window.setTimeout(() => { ensureModel(); }, 1500);
    return () => { if (idle) window.cancelIdleCallback(id); else window.clearTimeout(id); };
  }, [ensureModel]);

  const search = useCallback(async (f?: string, t?: string) => {
    const fq = (f ?? from).trim(), tq = (t ?? to).trim();
    if (f !== undefined) setFrom(f); if (t !== undefined) setTo(t);
    if (!fq || !tq) return;
    const m = await ensureModel(); if (!m) return;
    // 초성만 입력했으면 첫 추천 이름으로 확정한다 (허브 펼침이 이름 기준이라서)
    const fix = (q: string) => (isCho(normName(q)) ? suggest(m, q, 1)[0]?.name ?? q : q);
    const F = fix(fq), T = fix(tq);
    if (F !== fq) setFrom(F); if (T !== tq) setTo(T);
    const atMin = nowMinutes();
    keyRef.current += 1;
    setResult({ key: keyRef.current, journey: plan(m, F, T), from: F, to: T, at: hhmm(atMin), atMin, originLoc: originLoc && normName(originLoc.name) === normName(F) ? originLoc : null });
  }, [from, to, ensureModel, originLoc]);

  const useAsOrigin = useCallback((name: string) => {
    setFrom(name); setOriginLoc(null);
    ensureModel();
    document.getElementById('ask')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    window.setTimeout(() => document.getElementById('nb-to')?.focus({ preventScroll: true }), 350);
  }, [ensureModel]);

  const value = useMemo<Ctx>(() => ({ from, to, setFrom, setTo, originLoc, setOriginLoc, model, modelState, ensureModel, result, search, useAsOrigin, meta, exposedRoutes, exposedHubs }), [from, to, originLoc, model, modelState, ensureModel, result, search, useAsOrigin, meta, exposedRoutes, exposedHubs]);
  return <SearchCtx.Provider value={value}>{children}</SearchCtx.Provider>;
}
