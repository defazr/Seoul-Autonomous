'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import { Pill } from '../ui/Pill';
import { onColor, routeDisplayColor } from '../../../lib/v2/route-color';
import type { Leg } from '../../../lib/night-bus/client-model';
import { inWindow } from '../night/useNightStatus';
import { useSearch } from './SearchContext';
import styles from './home.module.css';

/** 시안 v2.3 의 평면 버스 — 노선색과 번호를 입는다. 바퀴·전조등은 CSS 애니메이션. */
function BusSvg({ no, color, label, className }: { no: string; color: string; label: string; className: string }) {
  return (
    <svg className={`${styles.bus} ${className}`} viewBox="0 0 320 150" role="img" aria-label={label} style={{ '--route': color } as CSSProperties}>
      <defs><linearGradient id="nb-g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".22" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></linearGradient></defs>
      <path className={styles.beam} d="M18 70 L-120 40 L-120 120 Z" fill="#FFE9A8" />
      <rect x="22" y="26" width="282" height="94" rx="16" fill={color} />
      <rect x="22" y="26" width="282" height="94" rx="16" fill="url(#nb-g1)" />
      <rect x="34" y="38" width="48" height="34" rx="6" fill="#0A0F1E" opacity=".85" />
      <rect x="92" y="38" width="48" height="34" rx="6" fill="#0A0F1E" opacity=".85" />
      <rect x="150" y="38" width="48" height="34" rx="6" fill="#0A0F1E" opacity=".85" />
      <rect x="208" y="38" width="40" height="34" rx="6" fill="#0A0F1E" opacity=".85" />
      <rect x="256" y="38" width="40" height="52" rx="6" fill="#0A0F1E" opacity=".85" />
      <rect x="34" y="80" width="214" height="22" rx="5" fill="#0A0F1E" opacity=".55" />
      <text x="141" y="97" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="18" fill="#fff">{no}</text>
      <rect x="24" y="64" width="10" height="14" rx="2" fill="#FFE9A8" />
      <rect x="292" y="64" width="10" height="14" rx="2" fill="#FF6B6B" />
      <circle className={styles.wheel} cx="86" cy="122" r="20" fill="#0A0F1E" stroke="#2A3558" strokeWidth="6" />
      <circle className={styles.wheel} cx="240" cy="122" r="20" fill="#0A0F1E" stroke="#2A3558" strokeWidth="6" />
      <circle cx="86" cy="122" r="6" fill="#5C6A94" /><circle cx="240" cy="122" r="6" fill="#5C6A94" />
    </svg>
  );
}

function Step({ k, board, active, color, title, desc, meta }: { k: string; board?: boolean; active?: boolean; color?: string; title: ReactNode; desc: ReactNode; meta?: ReactNode }) {
  const style = color ? ({ '--route': color, '--route-ink': onColor(color) } as CSSProperties) : undefined;
  return (
    <div className={`${styles.step}${board ? ` ${styles.board}` : ''}${active ? ` ${styles.active}` : ''}`} style={style}>
      <div className={styles.k}>{k}</div>
      <div><div className={styles.t}>{title}</div><div className={styles.d}>{desc}</div>{meta && <div className={styles.m}>{meta}</div>}</div>
    </div>
  );
}

/** 연출 단계. 직통 = 0 에서 끝. 환승 = 0 첫 버스 도착·정차 → 1 출발 → 2 두 번째 버스가 환승 정류소로 도착 → 3 정차. */
const TRANSFER_TIMELINE: [number, number][] = [[3200, 1], [4400, 2], [6500, 3]];

/** 결과 무대 — 검색 후에만 나타난다. 왼쪽 도로에 버스가 들어오고, 오른쪽에 걷기·탑승·(환승)·하차 단계. 환승이면 버스 두 대가 차례로 온다. */
export function ResultStage() {
  const t = useTranslations('nightHome.stage');
  const s = useSearch();
  const r = s.result;
  const ref = useRef<HTMLElement>(null);
  const key = r?.key;
  // 단계는 결과 key 에 묶어 둔다 — 새 결과가 오면 자동으로 0 부터 (effect 안의 동기 setState 없음)
  const [ph, setPh] = useState<{ key: number; phase: number }>({ key: 0, phase: 0 });
  const phase = ph.key === key ? ph.phase : 0;
  const isTransfer = r?.journey.type === 'transfer';

  useEffect(() => {
    if (!key) return;
    ref.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    if (!isTransfer) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const plan: [number, number][] = reduced ? [[0, 3]] : TRANSFER_TIMELINE;
    const ids = plan.map(([ms, p]) => window.setTimeout(() => setPh({ key, phase: p }), ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [key, isTransfer]);

  if (!r) return null;

  const j = r.journey;
  const legs: Leg[] = j.type === 'direct' || j.type === 'transfer' ? j.legs : [];
  const a = legs[0], b = legs[1];
  const showing = phase >= 2 && b ? b : a; // 지금 도로에 있는 버스의 노선
  const busClass = !showing ? '' : phase === 1 ? styles.busDepart : phase === 3 ? styles.busParked : styles.busArrive;
  const signArs = phase >= 2 && b ? b.board.arsId : a?.board.arsId ?? '-----';
  const title = j.type === 'direct' ? t('direct', { no: j.legs[0].no, n: j.stops })
    : j.type === 'transfer' ? t('transfer', { a: j.legs[0].no, b: j.legs[1].no, n: j.stops })
    : j.type === 'none' ? t('none') : j.type === 'same' ? t('same') : t('title');
  const phaseLabel = !a ? null : !b ? t('phaseBoard', { no: a.no }) : phase === 0 ? t('phaseBoard', { no: a.no }) : phase === 1 ? t('phaseTransfer', { name: a.alight.name, no: b.no }) : phase === 2 ? t('phaseBoard', { no: b.no }) : t('phaseArrived');
  const busAria = !a ? '' : b ? t('busAriaTransfer', { a: a.no, b: b.no }) : t('busAria', { no: a.no });
  const dir = (l: Leg) => t('toward', { toward: l.toward });
  const hubOf = (ars: string) => s.model?.hubs.find((h) => h.ars.includes(ars) && s.exposedHubs.includes(h.slug));
  const links = (l: Leg, ars: string) => {
    const hub = hubOf(ars);
    return (<>
      {s.exposedRoutes.includes(l.no) && <Link href={`/night-bus/${l.no.toLowerCase()}`} locale="ko">{t('steps.routePage')} →</Link>}
      {hub && <Link href={`/hubs/${hub.slug}`} locale="ko">{hub.name} {t('steps.hubPage')} →</Link>}
    </>);
  };
  const boardMeta = (l: Leg, ars: string) => (<>
    <span>{inWindow(l.official.firstBus, l.official.lastBus, r.atMin) ? t('steps.boardRunning') : t('steps.boardBefore', { first: l.official.firstBus })}</span>
    {links(l, ars)}
  </>);

  let steps: ReactNode;
  if (j.type === 'unknown') steps = <div className={styles.empty}>{t('notFound')}</div>;
  else if (j.type === 'same') steps = <div className={styles.empty}>{t('same')}</div>;
  else if (j.type === 'none') steps = <div className={styles.empty}>{t('noneText')}</div>;
  else {
    const last = b ?? a;
    steps = (<>
      <Step k={t('steps.walk')} title={<>{t('steps.walkTitle', { ars: '', name: a.board.name })}<span className={styles.mono}> {a.board.arsId}</span></>} desc={r.originLoc ? t('steps.walkDescLoc', { m: Math.round(r.originLoc.dist / 10) * 10 }) : t('steps.walkDesc')} />
      <Step k={a.no} board active={!b || phase <= 1} color={routeDisplayColor(a.no, a.color)} title={t('steps.board', { no: a.no, dir: dir(a) })}
        desc={b ? t('steps.boardLeg', { n: a.stops, first: a.official.firstBus, last: a.official.lastBus, headway: a.official.headway }) : t('steps.boardDesc', { a: a.official.ends[0], b: a.official.ends[1], first: a.official.firstBus, last: a.official.lastBus, headway: a.official.headway })}
        meta={boardMeta(a, a.board.arsId)} />
      {b && (<>
        <Step k={t('steps.transfer')} active={phase === 1} title={t('steps.transferTitle', { name: a.alight.name, no: b.no })} desc={t('steps.transferDesc')} meta={<span>{t('steps.transferMeta', { a: a.alight.arsId, b: b.board.arsId })}</span>} />
        <Step k={b.no} board active={phase >= 2} color={routeDisplayColor(b.no, b.color)} title={t('steps.board', { no: b.no, dir: dir(b) })} desc={t('steps.boardLeg', { n: b.stops, first: b.official.firstBus, last: b.official.lastBus, headway: b.official.headway })} meta={boardMeta(b, b.board.arsId)} />
      </>)}
      <Step k={t('steps.alight')} title={<>{last.alight.name}<span className={styles.mono}> {last.alight.arsId}</span></>} desc={b ? t('steps.alightDest') : t('steps.alightDesc', { n: a.stops, headway: a.official.headway })} />
    </>);
  }

  return (
    <section ref={ref} id="nb-result" className={`${styles.stage}${a ? '' : ` ${styles.idle}`}`} aria-live="polite" aria-label={t('title')}>
      <div className={`v2-wrap ${styles.stageWrap}`}>
        <div>
          <div className={styles.resultHead}><h2>{title}</h2><span className={styles.resultMeta}>{t('meta', { time: r.at, snapshot: s.meta.stopsSnapshot, revisedOn: s.meta.scheduleRevisedOn })}</span></div>
          <div className={styles.road}>
            <div className={`${styles.stopsign}${phase >= 2 ? ` ${styles.signSwap}` : ''}`} data-ars={signArs} aria-hidden="true" />
            <div className={styles.ground} aria-hidden="true" />
            {showing
              ? <BusSvg key={`${r.key}-${phase >= 2 ? 1 : 0}`} no={showing.no} color={routeDisplayColor(showing.no, showing.color)} label={busAria} className={busClass} />
              : <BusSvg key={`${r.key}-idle`} no="N" color="#3FD3FF" label="" className={styles.busParked} />}
            {phaseLabel && <span className={styles.phase} aria-hidden="true">{phaseLabel}</span>}
          </div>
          <p className={styles.note} style={{ marginTop: 10 }}>{t('busNote')}</p>
        </div>
        <div>
          <div className={styles.resultHead}><h2>{t('howTitle')}</h2><Pill>{t('livePill')}</Pill></div>
          <div className={styles.steps}>{steps}</div>
        </div>
      </div>
    </section>
  );
}
