'use client';

/**
 * RT-2 — Stop 페이지 실시간 도착 카드 (01009 KO pilot).
 *
 * 계약 (docs/worklogs/RT2-ARRIVAL-CARD-DESIGN-20260901.md):
 *   - Static shell must not depend on realtime upstream availability.
 *     이 컴포넌트는 마운트 후에만 네트워크를 부르며, 실패해도 페이지의 정적 콘텐츠에 영향이 없다.
 *   - 상태 4개를 절대 합치지 않는다.
 *       A 로딩 / B 표시 / C 숨김(정상 응답 + 전부 운행종료 또는 승인 노선 0건) / D 실패
 *     C 는 서울시가 "오늘 운행 끝"이라고 알려준 사실이고, D 는 우리가 물어보지 못한 것이다.
 *     D 에서 "운행종료"라고 쓰면 운행 중인 버스를 놓치게 만든다.
 *   - 자동 polling 없음. 진입 시 1회 + 사용자가 누를 때만.
 *   - 빈 카드 높이를 상시 예약하지 않는다 (하루 대부분이 C 이므로 빈 공간이 더 나쁘다).
 *   - arrmsg 원문의 의미·숫자를 바꾸지 않는다. 대괄호를 보조줄로 내리는 것은 조판이며 번역이 아니다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  isDisplayable,
  sortArrivals,
  type ArrivalItem,
  type ArrivalPayload,
} from '../../lib/realtime/arrival-registry';
import styles from './ArrivalCard.module.css';

/** UI stale 임계값. API freshness 주기와 무관한 별개 개념이다 (RT-1 실측 갱신은 20~45초 하한선). */
const STALE_AFTER_MS = 5 * 60 * 1000;

type Status = 'loading' | 'ready' | 'failed';

export type ArrivalCardProps = {
  stopId: string;
  /** 정적 SSOT 노선 순서. 동순위·파싱 실패 시 정렬 fallback 으로 쓴다. */
  ssotOrder: string[];
  /** 노선 표시명 (routeId → displayName). 실시간 응답의 노선명을 쓰지 않는다. */
  routeNames: Record<string, string>;
};

type FetchResult =
  | { kind: 'ok'; payload: ArrivalPayload }
  | { kind: 'failed' }
  | { kind: 'aborted' };

/**
 * 순수 I/O. 컴포넌트 밖에 두어 상태 갱신과 네트워크를 분리한다.
 * 이 함수는 setState 를 하지 않으며, 호출부가 완료 콜백에서 결과를 반영한다.
 */
async function fetchArrivals(stopId: string, signal: AbortSignal): Promise<FetchResult> {
  try {
    const res = await fetch(`/api/arrivals/${stopId}`, { signal, cache: 'no-store' });
    if (!res.ok) return { kind: 'failed' };
    return { kind: 'ok', payload: (await res.json()) as ArrivalPayload };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return { kind: 'aborted' };
    return { kind: 'failed' };
  }
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.61-3.89M13.5 2.5V6H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrivalCard({ stopId, ssotOrder, routeNames }: ArrivalCardProps) {
  const t = useTranslations('stopDetail.realtime');
  const [status, setStatus] = useState<Status>('loading');
  const [payload, setPayload] = useState<ArrivalPayload | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const abortRef = useRef<AbortController | null>(null);

  /** 응답 결과를 상태에 반영한다. 네트워크 완료 콜백에서만 호출된다. */
  const apply = useCallback((result: FetchResult) => {
    if (result.kind === 'aborted') return; // 사용자가 떠났거나 재요청했다 — 실패가 아니다
    if (result.kind === 'failed') {
      setStatus('failed');
      return;
    }
    setPayload(result.payload);
    setNow(Date.now());
    setStatus('ready');
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    // I/O 는 컴포넌트 밖 순수 함수가 담당하고, 상태 갱신은 완료 콜백에서만 일어난다.
    void fetchArrivals(stopId, controller.signal).then(apply);
    // 언마운트 시 진행 중인 클라이언트 요청을 취소하고 늦은 응답 적용을 막는다.
    // (budget 은 서버가 upstream 요청을 시작할 때 차감되므로 여기서 절약되지 않는다.)
    return () => controller.abort();
  }, [stopId, apply]);

  /** 수동 새로고침. 이벤트 핸들러이므로 여기서는 로딩 표시를 동기로 세워도 된다. */
  const reload = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('loading');
    void fetchArrivals(stopId, controller.signal).then(apply);
  }, [stopId, apply]);

  // A. 로딩 — 빈 높이를 예약하지 않는다.
  if (status === 'loading' && !payload) return null;

  // D. 실패 — 비차단 소영역. 운행 여부를 단정하지 않는다.
  if (status === 'failed') {
    return (
      <section className={styles.failure} aria-labelledby="stop-realtime-failure">
        <p id="stop-realtime-failure" className={styles.failureText}>
          {t('failed')}
        </p>
        <button type="button" className={styles.retryBtn} onClick={reload}>
          {t('retry')}
        </button>
      </section>
    );
  }

  if (!payload) return null;

  const visible = sortArrivals(payload.items.filter(isDisplayable), ssotOrder);

  // C. 숨김 — 정상 응답이지만 표시할 상태가 없다. 정적 운행 안내가 그 역할을 대신한다.
  if (visible.length === 0) return null;

  const fetchedLabel = new Date(payload.fetchedAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const isStale = now - payload.fetchedAt > STALE_AFTER_MS;

  // B. 표시
  return (
    <section className={styles.card} aria-labelledby="stop-realtime-title">
      <div className={styles.head}>
        <h2 id="stop-realtime-title" className={styles.title}>
          {t('title')}
        </h2>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={reload}
          aria-label={t('refresh')}
          disabled={status === 'loading'}
        >
          <RefreshIcon />
        </button>
      </div>

      <ul className={styles.list}>
        {visible.map((item) => (
          <li key={item.routeId} className={styles.row}>
            <span className={styles.routeName}>{routeNames[item.routeId] ?? item.routeId}</span>
            <span className={styles.state}>
              <ArrivalText item={item} />
            </span>
          </li>
        ))}
      </ul>

      <p className={styles.meta}>
        {t('fetchedAt', { time: fetchedLabel })}
        {isStale ? <span className={styles.stale}> · {t('stale')}</span> : null}
      </p>
    </section>
  );
}

/**
 * 원문 조판. `18분후[8번째 전]` → `18분 후` + 보조줄 `8번째 전`.
 * 숫자·의미는 그대로다. 파싱 실패(unknown)면 원문을 손대지 않고 그대로 낸다.
 */
function ArrivalText({ item }: { item: ArrivalItem }) {
  if (item.kind === 'eta' && item.minutes !== undefined) {
    return (
      <>
        <span className={styles.primary}>{`${item.minutes}분 후`}</span>
        {item.stopsAway !== undefined ? (
          <span className={styles.secondary}>{`${item.stopsAway}번째 전`}</span>
        ) : null}
      </>
    );
  }
  return <span className={styles.primary}>{item.raw}</span>;
}
