import type { Stop } from '../../lib/types/route';
import styles from './RouteDiagram.module.css';

type RouteDiagramProps = {
  stops: Stop[];
  startName: string;
  endName: string;
  turnaroundName: string;
  outboundLabel: string;
  inboundLabel: string;
};

function DiagramLine({ count }: { count: number }) {
  const dotCount = Math.min(Math.max(count, 3), 10);

  return (
    <div className={styles.diagramLine}>
      {/* Background line */}
      <div className={styles.bgLine} />
      {/* Dots positioned via percentage — CSS circles, not SVG */}
      {Array.from({ length: dotCount }).map((_, i) => {
        const pct = ((i + 1) / (dotCount + 1)) * 100;
        return (
          <div
            key={i}
            className={styles.midDot}
            style={{ left: `${pct}%` }}
          />
        );
      })}
    </div>
  );
}

export function RouteDiagram({
  stops,
  outboundLabel,
  inboundLabel,
}: RouteDiagramProps) {
  const turnIdx = stops.findIndex((s) => s.isTurnaround);
  const outboundCount = turnIdx + 1;
  const inboundCount = stops.length - turnIdx;

  return (
    <div className={styles.container}>
      {/* Outbound */}
      <div className={styles.section}>
        <div className={styles.label}>{outboundLabel}</div>
        <div className={styles.lineWrap}>
          <div className={styles.dot} />
          <div className={styles.lineContainer}>
            <DiagramLine count={outboundCount} />
          </div>
          <div className={styles.starDot} />
        </div>
        <div className={styles.countText}>{outboundCount} stops</div>
      </div>

      <div className={styles.divider} />

      {/* Inbound */}
      <div className={styles.section}>
        <div className={styles.label}>{inboundLabel}</div>
        <div className={styles.lineWrap}>
          <div className={styles.starDot} />
          <div className={styles.lineContainer}>
            <DiagramLine count={inboundCount} />
          </div>
          <div className={styles.dot} />
        </div>
        <div className={styles.countText}>{inboundCount} stops</div>
      </div>
    </div>
  );
}
