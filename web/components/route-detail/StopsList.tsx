import { Link } from '../../i18n/navigation';
import styles from './StopsList.module.css';

/**
 * 표시 전용 타입. 데이터 출처·검증 상태는 담지 않는다.
 * 표시명 해결(SSOT 조회·locale 분기)은 서버 route page 가 끝낸다.
 */
type OtherRouteChip = {
  routeId: string;
  name: string;
};

type DisplayStop = {
  seq: number;
  displayName: string;
  /** 보조줄 후보. 실제 노출 여부는 렌더 문맥(showSecondary)이 결정한다 */
  secondaryName?: string;
  isTurnaround: boolean;
  /**
   * Phase 1B: 이 정류장을 지나는 다른 fixed route (Graph 파생, 서버에서 계산).
   * 없으면 행은 기존과 완전히 동일하게 렌더된다.
   */
  otherRoutes?: OtherRouteChip[];
};

type StopsListProps = {
  stops: DisplayStop[];
  expandLabel: string;
  collapseLabel: string;
  /** shared stop 행의 보조 라벨. otherRoutes 가 있는 행에서만 사용된다 */
  otherRoutesLabel?: string;
  /** 목록 상단 요약 1줄 (닫힌 <details> 상태에서의 기능 발견성 담당) */
  sharedSummary?: { text: string; routes: OtherRouteChip[] };
};

/** 이 값 이하면 disclosure 없이 전체 목록을 기본 화면에 한 번만 표시한다 */
const DISCLOSURE_THRESHOLD = 5;
/** 미리보기 최대 개수 (첫 정류장·반환점·마지막 정류장) */
const PREVIEW_LIMIT = 3;

function RouteChips({ routes }: { routes: OtherRouteChip[] }) {
  return routes.map((route) => (
    <Link
      key={route.routeId}
      href={`/routes/${route.routeId}`}
      className={styles.routeChip}
    >
      {route.name}
    </Link>
  ));
}

function StopRow({
  stop,
  isFirst,
  isLast,
  showSecondary,
  otherRoutesLabel,
}: {
  stop: DisplayStop;
  isFirst: boolean;
  isLast: boolean;
  showSecondary: boolean;
  otherRoutesLabel?: string;
}) {
  return (
    <li className={styles.stopRow}>
      <div className={styles.timeline}>
        <div className={`${styles.lineTop} ${isFirst ? styles.lineHidden : ''}`} />
        <div
          className={`${styles.stopDot} ${stop.isTurnaround ? styles.stopDotTurnaround : ''}`}
        />
        <div className={`${styles.lineBottom} ${isLast ? styles.lineHidden : ''}`} />
      </div>
      <div className={styles.stopContent}>
        <div className={styles.stopMeta}>
          <span className={styles.stopSeq}>{String(stop.seq).padStart(2, '0')}</span>
          <span className={styles.stopName}>{stop.displayName}</span>
        </div>
        {showSecondary && stop.secondaryName ? (
          <div className={styles.stopNameSub}>{stop.secondaryName}</div>
        ) : null}
        {stop.otherRoutes && stop.otherRoutes.length > 0 ? (
          <div className={styles.otherRoutes}>
            {otherRoutesLabel ? (
              <span className={styles.otherRoutesLabel}>{otherRoutesLabel}</span>
            ) : null}
            <RouteChips routes={stop.otherRoutes} />
          </div>
        ) : null}
      </div>
    </li>
  );
}

function StopItems({
  stops,
  showSecondary,
  otherRoutesLabel,
}: {
  stops: DisplayStop[];
  showSecondary: boolean;
  otherRoutesLabel?: string;
}) {
  return stops.map((stop, i) => (
    <StopRow
      key={stop.seq}
      stop={stop}
      isFirst={i === 0}
      isLast={i === stops.length - 1}
      showSecondary={showSecondary}
      otherRoutesLabel={otherRoutesLabel}
    />
  ));
}

function SharedSummary({ summary }: { summary: NonNullable<StopsListProps['sharedSummary']> }) {
  return (
    <p className={styles.sharedSummary}>
      <span>{summary.text}</span>
      <RouteChips routes={summary.routes} />
    </p>
  );
}

export function StopsList({
  stops,
  expandLabel,
  collapseLabel,
  otherRoutesLabel,
  sharedSummary,
}: StopsListProps) {
  // 정류장 수가 적으면 disclosure 없이 전체를 기본 화면으로 보여준다.
  if (stops.length <= DISCLOSURE_THRESHOLD) {
    return (
      <>
        {sharedSummary ? <SharedSummary summary={sharedSummary} /> : null}
        <ol className={styles.list}>
          <StopItems stops={stops} showSecondary otherRoutesLabel={otherRoutesLabel} />
        </ol>
      </>
    );
  }

  const turnIdx = stops.findIndex((s) => s.isTurnaround);
  const previewStops = (
    [stops[0], turnIdx >= 0 ? stops[turnIdx] : null, stops[stops.length - 1]].filter(
      Boolean,
    ) as DisplayStop[]
  )
    .filter((s, i, arr) => arr.findIndex((x) => x.seq === s.seq) === i)
    .slice(0, PREVIEW_LIMIT);

  return (
    <>
      {sharedSummary ? <SharedSummary summary={sharedSummary} /> : null}
      <div className={styles.listContainer}>
        <details className={styles.details}>
          <summary className={styles.summary}>
            <span className={styles.expandLabel}>{expandLabel}</span>
            <span className={styles.collapseLabel}>{collapseLabel}</span>
          </summary>
          {/* 펼친 전체 목록: 보조줄 없이 표시명만 */}
          <ol className={styles.list}>
            <StopItems stops={stops} showSecondary={false} otherRoutesLabel={otherRoutesLabel} />
          </ol>
        </details>
        {/* 닫힌 화면의 미리보기: 보조줄 표시 */}
        <ol className={`${styles.list} ${styles.previewList}`}>
          <StopItems stops={previewStops} showSecondary otherRoutesLabel={otherRoutesLabel} />
        </ol>
      </div>
    </>
  );
}
