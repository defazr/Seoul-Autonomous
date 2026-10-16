'use client';

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { onColor, routeDisplayColor } from '../../../lib/v2/route-color';
import { nearestStop, suggest, type Suggestion } from '../../../lib/night-bus/client-model';
import { useSearch } from './SearchContext';
import styles from './home.module.css';

type Field = 'from' | 'to';

/** 질문 카드 — 출발·도착 입력(추천 목록 · 초성) · 내 위치(탭 시에만 권한 요청 · 기기 내 최근접) · 경로 찾기. */
export function AskCard({ routesCount, stopsCount, examples }: { routesCount: number; stopsCount: number; examples: [string, string][] }) {
  const t = useTranslations('nightHome.ask');
  const s = useSearch();
  const [active, setActive] = useState<Field | null>(null);
  const [sugs, setSugs] = useState<Suggestion[]>([]);
  const [hi, setHi] = useState(-1);
  const [locState, setLocState] = useState<'idle' | 'busy' | 'ok' | 'denied' | 'unsupported'>('idle');
  const listId = useId();
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<number | null>(null);

  const refresh = useCallback(async (field: Field, q: string) => {
    const m = s.model ?? (await s.ensureModel());
    if (!m) { setSugs([]); return; }
    setSugs(suggest(m, q, 8)); setHi(-1); setActive(field);
  }, [s]);

  const choose = (field: Field, name: string) => {
    if (field === 'from') { s.setFrom(name); s.setOriginLoc(null); } else s.setTo(name);
    setSugs([]); setActive(null);
    if (field === 'from') toRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>, field: Field) => {
    if (!sugs.length || active !== field) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => (h + 1) % sugs.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => (h <= 0 ? sugs.length - 1 : h - 1)); }
    else if (e.key === 'Enter' && hi >= 0) { e.preventDefault(); choose(field, sugs[hi].name); }
    else if (e.key === 'Escape') { setSugs([]); setActive(null); }
  };

  const onBlur = () => { blurTimer.current = window.setTimeout(() => { setSugs([]); setActive(null); }, 150); };
  const focusField = (field: Field) => { if (blurTimer.current) window.clearTimeout(blurTimer.current); const q = field === 'from' ? s.from : s.to; if (q.trim()) refresh(field, q); else s.ensureModel(); };
  useEffect(() => () => { if (blurTimer.current) window.clearTimeout(blurTimer.current); }, []);

  const locate = () => {
    if (!('geolocation' in navigator)) { setLocState('unsupported'); return; }
    setLocState('busy');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const m = await s.ensureModel(); if (!m) { setLocState('idle'); return; } // 데이터 실패는 loadError 문구가 맡는다
      const near = nearestStop(m, pos.coords.latitude, pos.coords.longitude);
      if (!near) { setLocState('idle'); return; }
      s.setFrom(near.name); s.setOriginLoc(near); setLocState('ok'); toRef.current?.focus();
    }, () => setLocState('denied'), { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 });
  };

  const chip = (no: string) => { const bg = routeDisplayColor(no); return <span key={no} style={{ background: bg, color: onColor(bg) }}>{no}</span>; };
  const renderSugs = (field: Field) => active === field && sugs.length > 0 && (
    <ul className={styles.sugs} id={`${listId}-${field}`} role="listbox" aria-label={t('suggestions')}>
      {sugs.map((sg, i) => (
        <li key={`${sg.kind}-${sg.name}`} id={`${listId}-${field}-${i}`} role="option" aria-selected={i === hi} className={styles.sug} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(field, sg.name)} onMouseEnter={() => setHi(i)}>
          <span className={styles.sugName}>{sg.name}{sg.nameEn && <span className={styles.note}> · {sg.nameEn}</span>}</span>
          {sg.kind === 'hub' && <span className={styles.sugKind}>{t('hub')}</span>}
          <span className={styles.sugRoutes}>{sg.routes.slice(0, 4).map(chip)}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <Card as="form" variant="glass" id="ask" className={styles.ask} autoComplete="off" onSubmit={(e: React.FormEvent) => { e.preventDefault(); setSugs([]); setActive(null); s.search(); }}>
      <h1>{t('title')}</h1>
      <p className={styles.askSub}>{t('sub', { routes: routesCount, stops: stopsCount.toLocaleString('en-US') })}</p>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="nb-from">{t('from')}</label>
        <div className={styles.row}>
          <input ref={fromRef} id="nb-from" className={styles.input} value={s.from} placeholder={t('fromPlaceholder')} role="combobox" aria-expanded={active === 'from' && sugs.length > 0} aria-controls={`${listId}-from`} aria-autocomplete="list" aria-activedescendant={active === 'from' && hi >= 0 ? `${listId}-from-${hi}` : undefined}
            onChange={(e) => { s.setFrom(e.target.value); s.setOriginLoc(null); setLocState('idle'); refresh('from', e.target.value); }} onFocus={() => focusField('from')} onBlur={onBlur} onKeyDown={(e) => handleKey(e, 'from')} />
          <Button type="button" variant="ghost" onClick={locate} disabled={locState === 'busy'}>{locState === 'busy' ? t('locating') : t('useLocation')}</Button>
        </div>
        {renderSugs('from')}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="nb-to">{t('to')}</label>
        <div className={styles.row}>
          <input ref={toRef} id="nb-to" className={styles.input} value={s.to} placeholder={t('toPlaceholder')} role="combobox" aria-expanded={active === 'to' && sugs.length > 0} aria-controls={`${listId}-to`} aria-autocomplete="list" aria-activedescendant={active === 'to' && hi >= 0 ? `${listId}-to-${hi}` : undefined}
            onChange={(e) => { s.setTo(e.target.value); refresh('to', e.target.value); }} onFocus={() => focusField('to')} onBlur={onBlur} onKeyDown={(e) => handleKey(e, 'to')} />
        </div>
        {renderSugs('to')}
      </div>

      <Button type="submit" variant="primary" full className={styles.go} disabled={s.modelState === 'loading' && (!s.from || !s.to)}>{t('go')}</Button>

      {locState === 'ok' && s.originLoc && <p className={`${styles.note} ${styles.noteOk}`} role="status">{t('locFound', { name: s.originLoc.name, m: Math.round(s.originLoc.dist / 10) * 10 })}</p>}
      {locState === 'denied' && <p className={`${styles.note} ${styles.noteWarn}`} role="status">{t('locDenied')}</p>}
      {locState === 'unsupported' && <p className={`${styles.note} ${styles.noteWarn}`} role="status">{t('locUnsupported')}</p>}
      {s.modelState === 'error' && <p className={`${styles.note} ${styles.noteWarn}`} role="status">{t('loadError')}</p>}
      {s.modelState === 'loading' && <p className={styles.note} role="status">{t('loading')}</p>}
      <p className={styles.note}>{t('note')}</p>
      <div className={styles.examples}>
        <span>{t('examples')}</span>
        {examples.map(([a, b]) => <button key={`${a}-${b}`} type="button" className={styles.exBtn} lang="ko" onClick={() => { setLocState('idle'); s.setOriginLoc(null); s.search(a, b); }}>{a} → {b}</button>)}
      </div>
    </Card>
  );
}
