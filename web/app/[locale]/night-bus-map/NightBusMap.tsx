'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  ROUTE_COLORS, ROUTE_LABEL, NODES, ROUTE_POLY, ROUTE_MEMBER,
  ROUTE_ORDER, RIVER,
} from './night-bus-data';
import styles from './night-bus-map.module.css';

/* ── 역명 표시 (서울역만 예외 — 도시명 혼동 방지) ── */
function shortName(name: string) {
  if (name === '서울역') return '서울역';
  return name.replace(/역$/, '');
}

/* ── 칩 글자색 자동 결정 (배경 밝기 기준) ── */
function chipTextColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.6 ? '#fff' : '#191919';
}

/* ── Constants ── */
const VBX = -70, VBY = -65, VBW = 2560, VBH = 1600;
const CENTER = { x: 1210, y: 720 };
const DEFAULT_VB = { x: VBX, y: VBY, w: VBW, h: VBH };
/* 모바일 전용 — 노선망 bbox + 패딩 70. 바깥 빈 여백 제거, 끝역 모두 포함 */
const MOBILE_VB = { x: 110, y: 17, w: 2200, h: 1436 };
/* 전체화면 전용 — 전체 콘텐츠(저작권 포함) + 패딩, 중앙 정렬 */
const FS_VB = { x: VBX - 20, y: VBY - 20, w: VBW + 40, h: VBH + 60 };
const MIN_ZOOM = 1, MAX_ZOOM = 4;
const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* ── Mobile viewBox hook ── */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

type VB = { x: number; y: number; w: number; h: number };

function clampVB(vb: VB, base: VB = DEFAULT_VB): VB {
  const w = Math.max(base.w / MAX_ZOOM, Math.min(base.w, vb.w));
  const h = w * (base.h / base.w);
  const x = Math.max(base.x, Math.min(base.x + base.w - w, vb.x));
  const y = Math.max(base.y, Math.min(base.y + base.h - h, vb.y));
  return { x, y, w, h };
}

function animateVB(from: VB, to: VB, set: (vb: VB) => void, duration = 200) {
  if (REDUCED_MOTION || duration === 0) { set(to); return; }
  const start = performance.now();
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  function step(now: number) {
    const t = Math.min(1, (now - start) / duration);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    set(clampVB({ x: lerp(from.x, to.x, ease), y: lerp(from.y, to.y, ease), w: lerp(from.w, to.w, ease), h: lerp(from.h, to.h, ease) }));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* routeBBox·journeyBBox 삭제 — auto-zoom 제거로 데드코드 */

/* ── 초성 검색 ── */
const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
function choOf(ch: string) { const c = ch.charCodeAt(0); return (c >= 0xAC00 && c <= 0xD7A3) ? CHO[Math.floor((c - 0xAC00) / 588)] : null; }
function stationMatch(name: string, q: string) {
  const n = name.toLowerCase(), qq = q.toLowerCase();
  for (let s = 0; s + qq.length <= n.length; s++) {
    let ok = true;
    for (let i = 0; i < qq.length; i++) {
      const qc = qq[i], nc = n[s + i];
      if (CHO.indexOf(qc) >= 0) { if (choOf(nc) !== qc) { ok = false; break; } }
      else if (qc !== nc) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

/* ── 라벨 위치 수동 지정 (값 변경 금지) ── */
const LABEL_OVERRIDE: Record<string, string> = { '용마산역': 'up', '신용산역': 'right', '삼각지역': 'downleft', '홍대입구역': 'down', '신촌역': 'down', '가락시장역': 'upleft' };

/* ── 종점 (전체 보기에서도 라벨 표시) ── */
const TERMINI = (() => {
  const s = new Set<string>();
  for (const id in ROUTE_POLY) {
    const pts = ROUTE_POLY[id];
    [pts[0], pts[pts.length - 1]].forEach(e => {
      let best: string | null = null, bd = 1e9;
      for (const n in NODES) { const d = Math.hypot(NODES[n][0] - e[0], NODES[n][1] - e[1]); if (d < bd) { bd = d; best = n; } }
      if (bd <= 14 && best) s.add(best);
    });
  }
  return s;
})();

/* ── 노선 경유역 조회 ── */
function stationRoutes(name: string) { return ROUTE_ORDER.filter(id => ROUTE_MEMBER[id]?.includes(name)); }

/* ── 폴리라인 그대로 그리기 (보정 없음) ── */
function routeD(id: string) {
  const pts = ROUTE_POLY[id] || [];
  if (pts.length < 2) return '';
  return 'M ' + pts.map(p => `${p[0]} ${p[1]}`).join(' L ');
}

/* ── 구간만 잘라 그리기 ── */
function routeSegD(id: string, n1: string, n2: string) {
  const pts = ROUTE_POLY[id] || []; if (pts.length < 2) return '';
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const proj = (name: string) => {
    const [px, py] = NODES[name]; let bd = 1e9, bl = 0;
    for (let k = 0; k < pts.length - 1; k++) {
      const [x1, y1] = pts[k], [x2, y2] = pts[k + 1], dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
      let t = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
      if (d < bd) { bd = d; bl = acc[k] + t * Math.sqrt(l2); }
    }
    return bl;
  };
  let lo = proj(n1), hi = proj(n2); if (lo > hi) { const t = lo; lo = hi; hi = t; }
  const at = (L: number): [number, number] => {
    for (let k = 0; k < pts.length - 1; k++) if (L <= acc[k + 1]) { const seg = (acc[k + 1] - acc[k]) || 1, t = (L - acc[k]) / seg; return [pts[k][0] + t * (pts[k + 1][0] - pts[k][0]), pts[k][1] + t * (pts[k + 1][1] - pts[k][1])]; }
    return pts[pts.length - 1];
  };
  const out: [number, number][] = [at(lo)];
  for (let i = 0; i < pts.length; i++) if (acc[i] > lo && acc[i] < hi) out.push(pts[i]);
  out.push(at(hi));
  return 'M ' + out.map(p => `${Math.round(p[0] * 10) / 10} ${Math.round(p[1] * 10) / 10}`).join(' L ');
}

/* ── Touch zoom/pan hook (재사용: 인라인 + 오버레이) ── */
function useTouchZoom(
  stageRef: React.RefObject<HTMLElement | null>,
  vb: VB, setVb: (vb: VB) => void,
  baseVB: VB, isMobile: boolean,
) {
  const vbRef = useRef(vb);
  vbRef.current = vb;
  const isZoomed = vb.w < baseVB.w * 0.95;
  const isZoomedRef = useRef(isZoomed);
  isZoomedRef.current = isZoomed;
  const baseVBRef = useRef(baseVB);
  baseVBRef.current = baseVB;
  const touchState = useRef<{ dist: number; cx: number; cy: number; vb: VB; panning: boolean; sx: number; sy: number; moved: boolean } | null>(null);

  useEffect(() => {
    if (!isMobile) return;
    const el = stageRef.current;
    if (!el) return;

    const DRAG_THRESHOLD = 8;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const [a, b] = [e.touches[0], e.touches[1]];
        touchState.current = {
          dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
          cx: (a.clientX + b.clientX) / 2, cy: (a.clientY + b.clientY) / 2,
          vb: { ...vbRef.current }, panning: false, sx: 0, sy: 0, moved: false,
        };
      } else if (e.touches.length === 1 && isZoomedRef.current) {
        touchState.current = {
          dist: 0, cx: 0, cy: 0, vb: { ...vbRef.current },
          panning: true, sx: e.touches[0].clientX, sy: e.touches[0].clientY, moved: false,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchState.current) return;
      const ts = touchState.current;
      if (e.touches.length === 2 && ts.dist > 0) {
        e.preventDefault();
        const [a, b] = [e.touches[0], e.touches[1]];
        const newDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        const scale = ts.dist / newDist;
        const bvb = baseVBRef.current;
        const w = Math.max(bvb.w / MAX_ZOOM, Math.min(bvb.w, ts.vb.w * scale));
        const h = w * (bvb.h / bvb.w);
        const rect = el.getBoundingClientRect();
        const pcx = (ts.cx - rect.left) / rect.width;
        const pcy = (ts.cy - rect.top) / rect.height;
        setVb(clampVB({ x: ts.vb.x + (ts.vb.w - w) * pcx, y: ts.vb.y + (ts.vb.h - h) * pcy, w, h }, bvb));
        ts.moved = true;
      } else if (e.touches.length === 1 && ts.panning && isZoomedRef.current) {
        const dx = ts.sx - e.touches[0].clientX;
        const dy = ts.sy - e.touches[0].clientY;
        const dist = Math.hypot(dx, dy);
        if (dist > DRAG_THRESHOLD) {
          e.preventDefault();
          ts.moved = true;
          const rect = el.getBoundingClientRect();
          const curVb = vbRef.current;
          const svgDx = dx * (curVb.w / rect.width);
          const svgDy = dy * (curVb.h / rect.height);
          setVb(clampVB({ ...ts.vb, x: ts.vb.x + svgDx, y: ts.vb.y + svgDy }, baseVBRef.current));
        }
      }
    };

    const handleTouchEnd = () => { touchState.current = null; };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  const resetVB = useCallback(() => animateVB(vbRef.current, baseVBRef.current, setVb), [setVb]);

  return { isZoomed, resetVB };
}

/* ── Double-tap hook (모바일만) ── */
function useDoubleTap(
  isMobile: boolean, isZoomed: boolean,
  stageRef: React.RefObject<HTMLElement | null>,
  vb: VB, setVb: (vb: VB) => void, baseVB: VB,
) {
  const lastTap = useRef(0);
  return useCallback((e: React.MouseEvent) => {
    if (!isMobile) return;
    const now = Date.now();
    if (now - lastTap.current < 300) {
      e.preventDefault();
      if (isZoomed) { animateVB(vb, baseVB, setVb); }
      else {
        const rect = stageRef.current?.getBoundingClientRect();
        if (rect) {
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const w = baseVB.w / 2, h = baseVB.h / 2;
          animateVB(vb, clampVB({ x: vb.x + (vb.w - w) * px, y: vb.y + (vb.h - h) * py, w, h }, baseVB), setVb);
        }
      }
    }
    lastTap.current = now;
  }, [isMobile, isZoomed, vb, baseVB, setVb, stageRef]);
}

/* ── SearchBox ── */
function SearchBox({ onPick, placeholder, selected }: { onPick: (n: string) => void; placeholder: string; selected: string | null }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  // Sync selected → q only when selected changes externally
  const prevSelected = useRef(selected);
  useEffect(() => {
    if (prevSelected.current !== selected) {
      prevSelected.current = selected;
      if (selected && !editing) setQ(shortName(selected));
      else if (!selected) setQ('');
    }
  }, [selected, editing]);

  const displayVal = editing ? q : (selected ? shortName(selected) : q);
  const query = q.trim();
  let res = (open && query) ? Object.keys(NODES).filter(n => stationMatch(n, query)) : [];
  res.sort((a, b) => (stationMatch(a.slice(0, query.length), query) ? 0 : 1) - (stationMatch(b.slice(0, query.length), query) ? 0 : 1) || a.localeCompare(b, 'ko'));
  res = res.slice(0, 8);

  return (
    <div className={styles.obSearch}>
      <input
        type="text"
        value={displayVal}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => { setQ(e.target.value); setEditing(true); setOpen(true); }}
        onFocus={(e) => { setEditing(true); setOpen(true); e.target.select(); }}
        onBlur={() => { setTimeout(() => { setOpen(false); setEditing(false); }, 150); }}
      />
      {open && query && res.length > 0 && (
        <ul className={styles.obSr}>
          {res.map(n => <li key={n} onMouseDown={() => { onPick(n); setQ(shortName(n)); setOpen(false); }}>{n}</li>)}
        </ul>
      )}
      {open && query && res.length === 0 && (
        <ul className={styles.obSr}><li className={styles.none}>지도에 없는 역입니다</li></ul>
      )}
    </div>
  );
}

/* ── Header ── */
function Header({ isAll, clearSel, exportPNG, onPickFrom, onPickTo, jFrom, jTo, onFullscreen }: {
  isAll: boolean; clearSel: () => void; exportPNG: () => void;
  onPickFrom: (n: string) => void; onPickTo: (n: string) => void; jFrom: string | null; jTo: string | null;
  onFullscreen: () => void;
}) {
  return (
    <div className={styles.obHead}>
      <div className={styles.obAct}>
        <div className={styles.obSearchRow}>
          <SearchBox onPick={onPickFrom} placeholder="출발역 (초성 가능)" selected={jFrom} />
          <span className={styles.obArrow}>→</span>
          <SearchBox onPick={onPickTo} placeholder="도착역 (초성 가능)" selected={jTo} />
        </div>
        <div className={styles.obBtnRow}>
          {!isAll && <button className={styles.obBtn} onClick={clearSel}>전체 보기</button>}
          <button className={styles.obBtn} onClick={onFullscreen} aria-label="지도 크게 보기">크게 보기</button>
          <button className={`${styles.obBtn} ${styles.primary}`} onClick={exportPNG}>PNG 저장</button>
        </div>
      </div>
    </div>
  );
}

/* ── Legend ── */
function Legend({ sel, toggle }: { sel: Set<string>; toggle: (id: string) => void }) {
  const others = ROUTE_ORDER.filter(id => id !== 'A21');
  return (
    <div className={styles.obLegend}>
      <div className={styles.obLegHead}>
        <svg viewBox="0 0 40 40" width={32} height={32} aria-hidden="true">
          <rect x={8} y={9} width={24} height={19} rx={5} fill="#2b6fd6" />
          <rect x={11} y={13} width={8} height={7} rx={1.5} fill="#cfe4ff" />
          <rect x={21} y={13} width={8} height={7} rx={1.5} fill="#cfe4ff" />
          <circle cx={14} cy={30} r={3} fill="#111" />
          <circle cx={26} cy={30} r={3} fill="#111" />
        </svg>
        <span>올빼미버스</span>
        <span className={styles.obLegSite}>SeoulAutonomous.com</span>
      </div>
      <div className={styles.obChips}>
        {others.map(id => {
          const on = sel.has(id), dim = sel.size > 0 && !on;
          return (
            <button
              key={id}
              className={`${styles.obChip}${on ? ` ${styles.on}` : ''}${dim ? ` ${styles.dim}` : ''}`}
              style={{ background: ROUTE_COLORS[id], color: chipTextColor(ROUTE_COLORS[id]) }}
              onClick={() => toggle(id)}
            >{ROUTE_LABEL[id]}</button>
          );
        })}
      </div>
      {ROUTE_ORDER.includes('A21') && (
        <div className={styles.obA21row}>
          {(() => {
            const id = 'A21', on = sel.has(id), dim = sel.size > 0 && !on;
            return (
              <button
                className={`${styles.obChip} ${styles.a21}${on ? ` ${styles.on}` : ''}${dim ? ` ${styles.dim}` : ''}`}
                style={{ background: ROUTE_COLORS.A21 }}
                onClick={() => toggle(id)}
              >심야A21</button>
            );
          })()}
          <span className={styles.obA21note}>자율주행 심야 (별도)</span>
        </div>
      )}
    </div>
  );
}

/* ── StationCard ── */
function StationCard({ station, sel, toggle, setStation, setFrom, setTo, jFrom, jTo }: {
  station: string; sel: Set<string>; toggle: (id: string) => void;
  setStation: (n: string | null) => void; setFrom: (n: string) => void; setTo: (n: string) => void;
  jFrom: string | null; jTo: string | null;
}) {
  const routes = stationRoutes(station);
  const [warnOpen, setWarnOpen] = useState(false);
  return (
    <div className={styles.obCard}>
      <button className={styles.obCardX} onClick={() => setStation(null)}>×</button>
      <div className={styles.obCardSt}>{shortName(station)}</div>
      <div className={styles.obCardJbtns}>
        <button className={`${styles.obBtn} ${styles.sm}${jFrom === station ? ` ${styles.on}` : ''}`} onClick={() => setFrom(station)}>여기서 출발</button>
        <button className={`${styles.obBtn} ${styles.sm}${jTo === station ? ` ${styles.on}` : ''}`} onClick={() => setTo(station)}>여기로 도착</button>
      </div>
      <div className={styles.obCardLab}>이 역을 지나는 노선</div>
      <div className={styles.obCardRoutes}>
        {routes.length ? routes.map(id => (
          <button key={id} className={`${styles.obChip} ${styles.sm}${sel.has(id) ? ` ${styles.on}` : ''}`}
            style={{ background: ROUTE_COLORS[id], color: chipTextColor(ROUTE_COLORS[id]) }}
            onClick={() => toggle(id)}>{ROUTE_LABEL[id]}</button>
        )) : <span className={styles.obCardNone}>현재 표시된 노선 없음</span>}
      </div>
      <button className={styles.obCardWarnToggle} onClick={() => setWarnOpen(o => !o)}>
        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx={12} cy={10} r={3} />
        </svg>
        역 위치는 권역 표시
        <span className={styles.obChevron}>{warnOpen ? '▲' : '▼'}</span>
      </button>
      {warnOpen && (
        <p className={styles.obCardWarnText}>
          실제 정류장은 길 건너편이나 떨어진 곳일 수 있어요. 탑승 전 카카오맵에서 정확한 위치와 방향을 확인하세요.
        </p>
      )}
    </div>
  );
}

/* ── TransferBar ── */
function TransferBar({ sel, transfer }: { sel: Set<string>; transfer: Set<string> }) {
  const ids = [...sel].sort((a, b) => ROUTE_ORDER.indexOf(a as typeof ROUTE_ORDER[number]) - ROUTE_ORDER.indexOf(b as typeof ROUTE_ORDER[number]));
  const shared = [...transfer].map(n => shortName(n));
  return (
    <div className={styles.obXfer}>
      <div><span className={styles.obXferK}>선택 노선</span>
        {ids.map(id => <span key={id} className={styles.obXferPill} style={{ background: ROUTE_COLORS[id], color: chipTextColor(ROUTE_COLORS[id]) }}>{ROUTE_LABEL[id]}</span>)}
      </div>
      <div><span className={styles.obXferK}>공유 환승역</span>
        <span className={styles.obXferV}>{shared.length ? shared.join(' · ') : '없음 — 이 노선들끼리는 직접 환승 불가'}</span>
      </div>
    </div>
  );
}

/* ── JourneyBar ── */
function JourneyBar({ jFrom, jTo, journey, clearAll, focusedDirect, setFocusedDirect, hiddenLegs, toggleLeg, hideReset }: {
  jFrom: string | null; jTo: string | null;
  journey: { type: string; routes?: string[]; via?: string; alt?: string[] } | null;
  clearAll: () => void;
  focusedDirect: string | null; setFocusedDirect: (id: string | null) => void;
  hiddenLegs: Set<string>; toggleLeg: (id: string) => void;
  hideReset?: boolean;
}) {
  const st = (n: string) => shortName(n);
  const sameStation = !!(jFrom && jTo && jFrom === jTo);
  const both = jFrom && jTo && !sameStation;

  // 직통 1개: 라벨 (클릭 안 됨)
  const labelChip = (id: string) => (
    <span key={id} className={styles.obJourneyChip} style={{ background: ROUTE_COLORS[id], color: chipTextColor(ROUTE_COLORS[id]), cursor: 'default' }}>{ROUTE_LABEL[id]}</span>
  );
  // 직통 복수: 셀렉트 (한 번에 하나)
  const selectChip = (id: string) => {
    const active = focusedDirect === id;
    return <button key={id} className={`${styles.obJourneyChip}${active ? ` ${styles.obJourneyChipActive}` : ''}`} onClick={() => setFocusedDirect(active ? null : id)} style={{ background: ROUTE_COLORS[id], color: chipTextColor(ROUTE_COLORS[id]) }}>{ROUTE_LABEL[id]}</button>;
  };
  // 환승: 숨김/표시 토글
  const toggleChip = (id: string) => {
    const hidden = hiddenLegs.has(id);
    return <button key={id} className={`${styles.obJourneyChip}${hidden ? ` ${styles.obJourneyChipHidden}` : ''}`} onClick={() => toggleLeg(id)} style={{ background: ROUTE_COLORS[id], color: chipTextColor(ROUTE_COLORS[id]) }}>{ROUTE_LABEL[id]}</button>;
  };

  let body;
  if (!jFrom) body = <span className={styles.obXferV}>출발역을 검색하거나 지도에서 클릭해 지정하세요</span>;
  else if (!jTo) body = <span className={styles.obXferV}>도착역을 검색하거나 지도에서 클릭해 지정하세요</span>;
  else if (sameStation) body = <span className={styles.obXferV}>출발역과 도착역이 같습니다. 다른 역을 선택하세요</span>;
  else if (journey?.type === 'direct') {
    const allRoutes = [journey.routes![0], ...(journey.alt || [])];
    const isSingle = allRoutes.length === 1;
    body = (
      <div>
        <span className={styles.obXferK}>직통 노선</span>
        <span className={styles.obDirectChips}>{allRoutes.map(id => isSingle ? labelChip(id) : selectChip(id))}</span>
      </div>
    );
  }
  else if (journey?.type === 'transfer') body = <span className={styles.obJtransfer}>{toggleChip(journey.routes![0])}<span className={styles.obJarr}>→</span><span className={styles.obJvia}>{st(journey.via!)}에서 환승</span><span className={styles.obJarr}>→</span>{toggleChip(journey.routes![1])}</span>;
  else if (journey?.type === 'transfer2') {
    const jj = journey as unknown as { routes: string[]; via1: string; via2: string };
    body = (
      <div>
        <span className={styles.obXferK}>2회 환승 경로</span>
        <span className={styles.obJtransfer}>{toggleChip(jj.routes[0])}<span className={styles.obJarr}>→</span><span className={styles.obJvia}>{st(jj.via1)}에서 환승</span><span className={styles.obJarr}>→</span>{toggleChip(jj.routes[1])}<span className={styles.obJarr}>→</span><span className={styles.obJvia}>{st(jj.via2)}에서 환승</span><span className={styles.obJarr}>→</span>{toggleChip(jj.routes[2])}</span>
      </div>
    );
  }
  else body = <span className={styles.obXferV}>연결 가능한 경로가 없습니다 — 아래 지도앱 길찾기를 이용하세요</span>;
  return (
    <div className={`${styles.obXfer} ${styles.obJourney}`}>
      <div><span className={styles.obXferK}>경로</span><span className={styles.obJroute}>{jFrom ? st(jFrom) : <span className={styles.obPlaceholder}>출발역</span>} → {jTo ? st(jTo) : <span className={styles.obPlaceholder}>도착역</span>}</span></div>
      <div>{body}</div>
      <div className={styles.obJacts}>
        {both && <a className={`${styles.obBtn} ${styles.sm} ${styles.kakao}`} href="https://map.kakao.com/?nil_profile=title&nil_src=local" target="_blank" rel="noopener noreferrer">카카오맵 길찾기</a>}
        {both && <a className={`${styles.obBtn} ${styles.sm} ${styles.naver}`} href="https://map.naver.com/p/directions/-/-/-/transit?c=15.00,0,0,0,dh" target="_blank" rel="noopener noreferrer">네이버지도 길찾기</a>}
        {!hideReset && <button className={`${styles.obBtn} ${styles.sm} ${styles.ghost}`} onClick={clearAll}>초기화</button>}
      </div>
    </div>
  );
}

/* ── SVG Map ── */
function SvgMap({ svgRef, order, rOpacity, rWidth, isAll, activeNodes, transfer, sel, toggle, station, setStation, jFrom, jTo, segs, vb, className }: {
  svgRef?: React.RefObject<SVGSVGElement | null>; order: string[];
  rOpacity: (id: string) => number; rWidth: (id: string) => number;
  isAll: boolean; activeNodes: Set<string> | null; transfer: Set<string>;
  sel: Set<string>; toggle: (id: string) => void;
  station: string | null; setStation: (n: string) => void;
  jFrom: string | null; jTo: string | null;
  segs: Record<string, string> | null;
  vb: VB;
  className?: string;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const lines = order.map(id => {
    const seld = sel.has(id), d = routeD(id);
    const seg = segs && segs[id];
    const els: React.ReactElement[] = [];
    if (seg) {
      els.push(<path key={id + '_faint'} d={d} fill="none" stroke={ROUTE_COLORS[id]} strokeWidth={id === 'A21' ? 7 : 6} strokeOpacity={0.18} strokeLinecap="round" strokeLinejoin="round" onClick={() => toggle(id)} style={{ cursor: 'pointer' }} />);
      els.push(<path key={id + '_c'} d={seg} fill="none" stroke="#fff" strokeWidth={rWidth(id) + 7} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }} />);
      els.push(<path key={id} d={seg} fill="none" stroke={ROUTE_COLORS[id]} strokeWidth={rWidth(id)} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }} />);
      return els;
    }
    if (seld) els.push(<path key={id + '_c'} d={d} fill="none" stroke="#fff" strokeWidth={rWidth(id) + 7} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }} />);
    els.push(<path key={id} d={d} fill="none" stroke={ROUTE_COLORS[id]} strokeWidth={rWidth(id)} strokeOpacity={rOpacity(id)} strokeLinecap="round" strokeLinejoin="round" onClick={() => toggle(id)} style={{ cursor: 'pointer' }} />);
    return els;
  });

  const labelEls: React.ReactElement[] = [], circleEls: React.ReactElement[] = [];
  Object.keys(NODES).forEach(name => {
    const [x, y] = NODES[name];
    const routes = stationRoutes(name);
    const isXfer = routes.length >= 2;
    const active = isAll || (activeNodes?.has(name) ?? false);
    const op = (active || name === hover) ? 1 : 0.12;
    const blink = transfer.has(name);
    const r = isXfer ? 11 : 7;
    const showLabel = isAll ? (isXfer || TERMINI.has(name) || name === hover || name === station || name === jFrom || name === jTo) : (active || name === hover);
    let dir = LABEL_OVERRIDE[name];
    if (!dir) {
      const dx = x - CENTER.x, dy = y - CENTER.y;
      dir = Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? 'right' : 'left') : (dy >= 0 ? 'down' : 'up');
    }
    let lx = x, ly = y, anc: 'start' | 'middle' | 'end' = 'middle', ddy = '0';
    const gap = r + 8;
    if (dir === 'right') { lx = x + gap; anc = 'start'; ddy = '0.34em'; }
    else if (dir === 'left') { lx = x - gap; anc = 'end'; ddy = '0.34em'; }
    else if (dir === 'down') { ly = y + gap; ddy = '0.9em'; }
    else if (dir === 'downleft') { lx = x - gap * 0.7; ly = y + gap * 0.7; anc = 'end'; ddy = '0.7em'; }
    else if (dir === 'upleft') { lx = x - gap * 0.7; ly = y - gap * 0.7; anc = 'end'; ddy = '-0.05em'; }
    else { ly = y - gap; ddy = '-0.1em'; }
    const nm = shortName(name);
    if (showLabel) labelEls.push(
      <text key={name} x={lx} y={ly} dy={ddy} textAnchor={anc} opacity={op} fontSize={isXfer ? 26 : 22} fontWeight={isXfer ? 700 : 600} fill={blink ? '#B35F00' : '#1a1a1a'} stroke="#f3f1ea" strokeWidth={4.5} paintOrder="stroke" style={{ strokeLinejoin: 'round', cursor: 'pointer' }} onClick={() => setStation(name)}>{nm}</text>
    );
    circleEls.push(
      <g key={name} opacity={op} style={{ cursor: 'pointer' }} onClick={() => setStation(name)} onMouseEnter={() => setHover(name)} onMouseLeave={() => setHover(h => h === name ? null : h)}>
        {/* 터치 타깃 확대 — SVG 축소 시에도 탭 가능하도록 */}
        <circle cx={x} cy={y} r={Math.max(r + 14, 22)} fill="transparent" />
        {blink && <circle className={styles.blink} cx={x} cy={y} r={r + 5} fill="none" stroke="#FF9500" strokeWidth={4} />}
        {!blink && name === station && <circle className={styles.blink} cx={x} cy={y} r={r + 5} fill="none" stroke="#2b6fd6" strokeWidth={4} />}
        <circle cx={x} cy={y} r={r} fill="#fff" stroke={blink ? '#E07B00' : (isXfer ? '#333' : '#888')} strokeWidth={isXfer ? 3 : 2.2} />
        {(name === jFrom || name === jTo) && (
          <g style={{ pointerEvents: 'none' }}>
            <circle cx={x} cy={y} r={r + 7} fill="none" stroke="#111" strokeWidth={3.5} />
            <rect x={x - 28} y={y - r - 42} width={56} height={29} rx={7} fill="#111" />
            <text x={x} y={y - r - 21} textAnchor="middle" fontSize={17} fontWeight={700} fill="#fff">{name === jFrom ? '출발' : '도착'}</text>
          </g>
        )}
      </g>
    );
  });

  return (
    <svg ref={svgRef} className={className || styles.obSvg} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="서울 올빼미버스 노선도">
      <desc>ⓒ 2026 SeoulAutonomous.com · 서울 올빼미버스 노선도 도식 · 제작자가 직접 작도한 창작물 · All Rights Reserved · 무단 복제·재배포 금지 · 출처: SeoulAutonomous.com</desc>
      <rect x={VBX} y={VBY} width={VBW} height={VBH} fill="#f7f4ec" />
      {RIVER.d && (
        <g style={{ pointerEvents: 'none' }}>
          <path d={RIVER.d} fill="none" stroke={RIVER.color} strokeWidth={48.5} strokeLinecap="round" strokeLinejoin="round" />
          <text x={RIVER.label[0]} y={RIVER.label[1]} fontSize={19} fontWeight={700} fill="#332C2B">한강</text>
        </g>
      )}
      <g>{lines}</g>
      <g>{labelEls}</g>
      <g>{circleEls}</g>
      <text className={styles.obCopyright} x={2470} y={1516} textAnchor="end" fontSize={30} fontWeight={600} fill="#615a4d" style={{ pointerEvents: 'none' }}>ⓒ 2026 SeoulAutonomous.com · All Rights Reserved · 무단 복제·재배포 금지</text>
    </svg>
  );
}

/* ── Main Component ── */
export function NightBusMap() {
  const [sel, setSel] = useState<Set<string>>(() => new Set());
  const [station, setStation] = useState<string | null>(null);
  const [jFrom, setJFrom] = useState<string | null>(null);
  const [jTo, setJTo] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  /* ── 경로 바 칩 상태 ── */
  // 직통 복수: 어느 노선을 보여줄지 (null=best/기본)
  const [focusedDirect, setFocusedDirect] = useState<string | null>(null);
  // 환승: 숨긴 leg들
  const [hiddenLegs, setHiddenLegs] = useState<Set<string>>(() => new Set());
  const toggleLeg = useCallback((id: string) => {
    setHiddenLegs(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);
  // 경로가 바뀌면 전부 리셋
  useEffect(() => { setFocusedDirect(null); setHiddenLegs(new Set()); }, [jFrom, jTo]);

  /* ── Fullscreen state ── */
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fsShowHint, setFsShowHint] = useState(false);
  const fsCloseRef = useRef<HTMLButtonElement>(null);
  const fsStageRef = useRef<HTMLDivElement>(null);

  const journey = useMemo(() => {
    if (!jFrom || !jTo || jFrom === jTo) return null;
    const rOf = (n: string) => ROUTE_ORDER.filter(id => ROUTE_MEMBER[id]?.includes(n));
    const direct = rOf(jFrom).filter(id => ROUTE_MEMBER[id]?.includes(jTo));
    if (direct.length) {
      let best = direct[0], bh = 1e9;
      direct.forEach(id => { const a = ROUTE_MEMBER[id]; const h = Math.abs(a.indexOf(jFrom) - a.indexOf(jTo)); if (h < bh) { bh = h; best = id; } });
      return { type: 'direct', routes: [best], alt: direct.filter(d => d !== best) };
    }
    let best: { type: string; routes: string[]; via: string; h: number } | null = null;
    rOf(jFrom).forEach(a => rOf(jTo).forEach(b => {
      if (a === b) return;
      ROUTE_MEMBER[a]?.forEach(s => {
        if (s === jFrom || s === jTo || !ROUTE_MEMBER[b]?.includes(s)) return;
        const h = Math.abs(ROUTE_MEMBER[a].indexOf(jFrom) - ROUTE_MEMBER[a].indexOf(s)) + Math.abs(ROUTE_MEMBER[b].indexOf(s) - ROUTE_MEMBER[b].indexOf(jTo));
        if (!best || h < best.h) best = { type: 'transfer', routes: [a, b], via: s, h };
      });
    }));
    if (best) return best;
    // 환승 2회 폴백: rA → X환승 → rC → Y환승 → rB
    let best2: { type: string; routes: string[]; via1: string; via2: string; h: number } | null = null;
    const allRoutes = Object.keys(ROUTE_MEMBER);
    rOf(jFrom).forEach(ra => rOf(jTo).forEach(rb => {
      if (ra === rb) return;
      allRoutes.forEach(rc => {
        if (rc === ra || rc === rb) return;
        const mA = ROUTE_MEMBER[ra], mC = ROUTE_MEMBER[rc], mB = ROUTE_MEMBER[rb];
        for (const x of mA) {
          if (x === jFrom || !mC.includes(x)) continue;
          for (const y of mC) {
            if (y === jTo || y === x || !mB.includes(y)) continue;
            const h = Math.abs(mA.indexOf(jFrom) - mA.indexOf(x))
                    + Math.abs(mC.indexOf(x) - mC.indexOf(y))
                    + Math.abs(mB.indexOf(y) - mB.indexOf(jTo));
            if (!best2 || h < best2.h) best2 = { type: 'transfer2', routes: [ra, rc, rb], via1: x, via2: y, h };
          }
        }
      });
    }));
    if (best2) return best2;
    return { type: 'none' };
  }, [jFrom, jTo]);

  const sameStationGlobal = !!(jFrom && jTo && jFrom === jTo);
  const jActive = !!(journey && (journey as { routes?: string[] }).routes);
  const allDirectRoutes: string[] = jActive && journey?.type === 'direct' ? [journey.routes![0], ...(journey.alt || [])] : [];
  const isDirectMulti = allDirectRoutes.length > 1;

  // dispSel: 케이스별 보여줄 노선 집합
  const dispSel = (() => {
    if (sameStationGlobal) return new Set<string>();
    if (!jActive) return sel;
    const j = journey as { type: string; routes: string[] };
    if (j.type === 'direct') {
      // 직통: focusedDirect가 있으면 그것만, 없으면 best(routes[0])
      const show = focusedDirect && allDirectRoutes.includes(focusedDirect) ? focusedDirect : j.routes[0];
      return new Set([show]);
    }
    // 환승(1회/2회): hiddenLegs에 없는 것만
    return new Set(j.routes.filter(id => !hiddenLegs.has(id)));
  })();
  // 🔴 근본 수정: 경로 활성 중엔 빈 집합이어도 전체 노선으로 안 빠짐
  const isAll = dispSel.size === 0 && !jActive && !sameStationGlobal;

  const journeySegs = useMemo(() => {
    if (!jActive || !journey) return null;
    const j = journey as { type: string; routes: string[]; via?: string };
    const segs: Record<string, string> = {};
    if (j.type === 'direct') {
      // 직통: focusedDirect가 있으면 그 노선 segment, 없으면 best
      const show = focusedDirect && allDirectRoutes.includes(focusedDirect) ? focusedDirect : j.routes[0];
      segs[show] = routeSegD(show, jFrom!, jTo!);
    } else if (j.type === 'transfer') {
      // 환승 1회: hiddenLegs에 없는 leg만
      if (!hiddenLegs.has(j.routes[0])) segs[j.routes[0]] = routeSegD(j.routes[0], jFrom!, j.via!);
      if (!hiddenLegs.has(j.routes[1])) segs[j.routes[1]] = routeSegD(j.routes[1], j.via!, jTo!);
    } else if (j.type === 'transfer2') {
      // 환승 2회: leg 3개
      const jj = journey as unknown as { via1: string; via2: string; routes: string[] };
      if (!hiddenLegs.has(jj.routes[0])) segs[jj.routes[0]] = routeSegD(jj.routes[0], jFrom!, jj.via1);
      if (!hiddenLegs.has(jj.routes[1])) segs[jj.routes[1]] = routeSegD(jj.routes[1], jj.via1, jj.via2);
      if (!hiddenLegs.has(jj.routes[2])) segs[jj.routes[2]] = routeSegD(jj.routes[2], jj.via2, jTo!);
    }
    return Object.keys(segs).length ? segs : null;
  }, [jActive, journey, jFrom, jTo, focusedDirect, hiddenLegs, allDirectRoutes]);

  const toggle = useCallback((id: string) => {
    if (jFrom || jTo) { setJFrom(null); setJTo(null); setSel(new Set([id])); return; }
    setSel(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, [jFrom, jTo]);
  const clearSel = useCallback(() => { setSel(new Set()); setStation(null); setJFrom(null); setJTo(null); setFocusedDirect(null); setHiddenLegs(new Set()); }, []);
  const setFrom = useCallback((n: string) => { setJFrom(n); setStation(null); }, []);
  const setTo = useCallback((n: string) => { setJTo(n); setStation(null); }, []);
  const pickStation = useCallback((n: string) => {
    setStation(n);
    if (!jFrom) setJFrom(n);
    else if (!jTo && n !== jFrom) setJTo(n);
  }, [jFrom, jTo]);

  const activeNodes = useMemo(() => {
    if (isAll) return null;
    const s = new Set<string>();
    if (jActive && journey) {
      const j = journey as { type: string; routes: string[]; via?: string };
      const between = (id: string, a: string, b: string) => {
        const arr = ROUTE_MEMBER[id] || []; let i = arr.indexOf(a), jj = arr.indexOf(b);
        if (i < 0 || jj < 0) return [] as string[];
        if (i > jj) { const t = i; i = jj; jj = t; } return arr.slice(i, jj + 1);
      };
      if (j.type === 'direct') between(j.routes[0], jFrom!, jTo!).forEach(n => s.add(n));
      else if (j.type === 'transfer') { between(j.routes[0], jFrom!, j.via!).forEach(n => s.add(n)); between(j.routes[1], j.via!, jTo!).forEach(n => s.add(n)); }
      else if (j.type === 'transfer2') { const jj = journey as unknown as { via1: string; via2: string; routes: string[] }; between(jj.routes[0], jFrom!, jj.via1).forEach(n => s.add(n)); between(jj.routes[1], jj.via1, jj.via2).forEach(n => s.add(n)); between(jj.routes[2], jj.via2, jTo!).forEach(n => s.add(n)); }
    } else dispSel.forEach(id => ROUTE_MEMBER[id]?.forEach(n => s.add(n)));
    if (jFrom) s.add(jFrom); if (jTo) s.add(jTo);
    return s;
  }, [jActive, sel, journey, jFrom, jTo, isAll, dispSel]);

  const transfer = useMemo(() => {
    if (jActive && journey) {
      if (journey.type === 'transfer2') { const jj = journey as unknown as { via1: string; via2: string }; return new Set([jj.via1, jj.via2]); }
      const j = journey as { via?: string }; return j.via ? new Set([j.via]) : new Set<string>();
    }
    if (sel.size < 2) return new Set<string>();
    const c: Record<string, number> = {};
    sel.forEach(id => (ROUTE_MEMBER[id] || []).forEach(n => c[n] = (c[n] || 0) + 1));
    return new Set(Object.keys(c).filter(n => c[n] >= 2));
  }, [sel, jActive, journey]);

  const rOpacity = (id: string) => isAll ? 1 : (dispSel.has(id) ? 1 : 0.1);
  const rWidth = (id: string) => (id === 'A21' ? 7 : 6) + (dispSel.has(id) ? 2 : 0);
  const order = (() => { const ns = [...ROUTE_ORDER].filter(id => !dispSel.has(id)); const s = [...ROUTE_ORDER].filter(id => dispSel.has(id)); return [...ns, ...s]; })();

  /* ── Inline viewBox state ── */
  const isMobile = useIsMobile();
  const baseVB = isMobile ? MOBILE_VB : DEFAULT_VB;
  const [vb, setVb] = useState<VB>(baseVB);
  const prevMobile = useRef(isMobile);
  useEffect(() => { if (prevMobile.current !== isMobile) { prevMobile.current = isMobile; setVb(isMobile ? MOBILE_VB : DEFAULT_VB); } }, [isMobile]);
  const stageRef = useRef<HTMLDivElement>(null);

  /* ── Inline touch zoom/pan ── */
  const { isZoomed, resetVB } = useTouchZoom(stageRef, vb, setVb, baseVB, isMobile);
  const onDoubleClick = useDoubleTap(isMobile, isZoomed, stageRef, vb, setVb, baseVB);

  /* ── Fullscreen viewBox state (별도) ── */
  const fsBaseVB = FS_VB;
  const [fsVb, setFsVb] = useState<VB>(fsBaseVB);
  const { isZoomed: fsIsZoomed, resetVB: fsResetVB } = useTouchZoom(fsStageRef, fsVb, setFsVb, fsBaseVB, isMobile && isFullscreen);
  const onFsDoubleClick = useDoubleTap(isMobile, fsIsZoomed, fsStageRef, fsVb, setFsVb, fsBaseVB);

  /* ── Fullscreen open/close ── */
  const savedOverflow = useRef('');

  const openFullscreen = useCallback(() => {
    savedOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setFsVb(FS_VB);
    setFsShowHint(true);
    setIsFullscreen(true);
  }, [isMobile]);

  const closeFullscreen = useCallback(() => {
    document.body.style.overflow = savedOverflow.current;
    setIsFullscreen(false);
  }, []);

  // Focus ✕ when overlay opens
  useEffect(() => {
    if (isFullscreen) {
      requestAnimationFrame(() => fsCloseRef.current?.focus());
    }
  }, [isFullscreen]);

  // Esc to close
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeFullscreen(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen, closeFullscreen]);

  // Cleanup on unmount — restore overflow
  useEffect(() => {
    return () => {
      if (savedOverflow.current !== undefined) {
        document.body.style.overflow = savedOverflow.current;
      }
    };
  }, []);

  function exportPNG() {
    const src = svgRef.current; if (!src) return;
    const c = src.cloneNode(true) as SVGSVGElement;
    c.querySelectorAll(`.${styles.blink}`).forEach(e => e.removeAttribute('class'));
    // Also remove by animation attribute for safety
    c.querySelectorAll('[class*="blink"]').forEach(e => e.removeAttribute('class'));
    const cp = c.querySelector(`.${styles.obCopyright}`) || c.querySelector('text[x="2470"]');
    if (cp) {
      cp.textContent = 'ⓒ 2026 SeoulAutonomous.com · All Rights Reserved · 무단 복제·재배포 금지 · 공식 대체 자료 아님';
      const warn = cp.cloneNode(false) as SVGTextElement;
      warn.removeAttribute('class');
      warn.setAttribute('y', '1474');
      warn.setAttribute('font-size', '27');
      warn.setAttribute('font-weight', '500');
      warn.textContent = '역 위치는 권역 표시 — 실제 정류장 위치·방향은 지도앱에서 확인';
      cp.parentNode?.insertBefore(warn, cp);
    }
    const sc = 1.5, W = Math.round(VBW * sc), H = Math.round(VBH * sc);
    c.setAttribute('width', String(W)); c.setAttribute('height', String(H));
    c.setAttribute('viewBox', `${VBX} ${VBY} ${VBW} ${VBH}`);
    const xml = new XMLSerializer().serializeToString(c);
    const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const x = cv.getContext('2d')!;
      x.fillStyle = '#f7f4ec'; x.fillRect(0, 0, W, H);
      x.drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);
      cv.toBlob(b => {
        if (!b) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        const ids = [...dispSel];
        a.download = ids.length ? `owlbus-${ids.join('-').toLowerCase()}.png` : 'owlbus-all.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 900);
      }, 'image/png');
    };
    img.src = url;
  }

  /* ── Shared SvgMap props ── */
  const svgMapProps = {
    order, rOpacity, rWidth, isAll, activeNodes, transfer,
    sel: dispSel, toggle, station, setStation: pickStation,
    jFrom, jTo, segs: journeySegs,
  };

  return (
    <div className={styles.ob}>
      <Header isAll={isAll && !jFrom && !jTo} clearSel={clearSel} exportPNG={exportPNG} onPickFrom={(n) => setJFrom(n)} onPickTo={(n) => setJTo(n)} jFrom={jFrom} jTo={jTo} onFullscreen={openFullscreen} />
      <Legend sel={dispSel} toggle={toggle} />

      {/* ── Inline map (항상 렌더 — 절대 언마운트 안 함) ── */}
      <div
        ref={stageRef}
        className={styles.obStage}
        onClick={onDoubleClick}
        style={isMobile && isZoomed ? { touchAction: 'none' } : { touchAction: 'pan-y' }}
      >
        <SvgMap svgRef={svgRef} {...svgMapProps} vb={vb} />
        {station && <StationCard station={station} sel={dispSel} toggle={toggle} setStation={setStation} setFrom={setFrom} setTo={setTo} jFrom={jFrom} jTo={jTo} />}
        {!jFrom && !jTo && sel.size >= 2 && <TransferBar sel={sel} transfer={transfer} />}
        {isMobile && isZoomed && (
          <button className={styles.obResetBtn} onClick={(e) => { e.stopPropagation(); resetVB(); }} aria-label="전체 보기">
            전체 보기
          </button>
        )}
      </div>
      {(jFrom || jTo) && <JourneyBar jFrom={jFrom} jTo={jTo} journey={journey} clearAll={clearSel} focusedDirect={focusedDirect} setFocusedDirect={setFocusedDirect} hiddenLegs={hiddenLegs} toggleLeg={toggleLeg} />}

      {/* ── Fullscreen overlay (인라인 위에 조건부로 얹음) ── */}
      {isFullscreen && (
        <div className={styles.obOverlay} role="dialog" aria-label="전체화면 노선도">
          <button ref={fsCloseRef} className={styles.obFsClose} onClick={closeFullscreen} aria-label="전체화면 닫기">✕</button>
          <div className={styles.obFsControls}>
            <button className={`${styles.obFsCtrlBtn} ${styles.obFsCtrlPrimary}`} onClick={exportPNG}>PNG 저장</button>
            <button className={styles.obFsCtrlBtn} onClick={() => { clearSel(); fsResetVB(); }}>초기화</button>
          </div>
          <div
            ref={fsStageRef}
            className={styles.obFsStage}
            style={{ touchAction: isMobile && fsIsZoomed ? 'none' : 'pan-y' }}
            onClick={onFsDoubleClick}
          >
            <SvgMap {...svgMapProps} vb={fsVb} className={styles.obOverlaySvg} />
          </div>
          <div className={styles.obFsDock}>
            {station && <StationCard station={station} sel={dispSel} toggle={toggle} setStation={setStation} setFrom={setFrom} setTo={setTo} jFrom={jFrom} jTo={jTo} />}
            {!jFrom && !jTo && sel.size >= 2 && <TransferBar sel={sel} transfer={transfer} />}
            {(jFrom || jTo) && <JourneyBar jFrom={jFrom} jTo={jTo} journey={journey} clearAll={clearSel} focusedDirect={focusedDirect} setFocusedDirect={setFocusedDirect} hiddenLegs={hiddenLegs} toggleLeg={toggleLeg} hideReset />}
          </div>
          {isMobile && fsIsZoomed && (
            <button className={styles.obResetBtn} style={{ zIndex: 10001 }} onClick={(e) => { e.stopPropagation(); fsResetVB(); }} aria-label="전체 보기">
              전체 보기
            </button>
          )}
          {fsShowHint && isMobile && (
            <div className={styles.obFsHint} onAnimationEnd={() => setFsShowHint(false)}>핀치하여 확대</div>
          )}
        </div>
      )}
    </div>
  );
}
