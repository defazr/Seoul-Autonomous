import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { colors, radius } from '../../lib/design/tokens';
import { Stop } from '../../lib/types';

type RouteDiagramProps = {
  stops: Stop[];
  startName: string;
  endName: string;
  turnaroundName: string;
  outboundLabel: string;
  inboundLabel: string;
};

function DiagramLine({ count, width }: { count: number; width: number }) {
  const dotCount = Math.min(Math.max(count, 3), 10);
  const spacing = width / (dotCount + 1);

  return (
    <Svg width={width} height={20} viewBox={`0 0 ${width} 20`}>
      <Line x1={0} y1={10} x2={width} y2={10} stroke={colors.accent.DEFAULT} strokeWidth={2} opacity={0.4} />
      {Array.from({ length: dotCount }).map((_, i) => (
        <Circle
          key={i}
          cx={spacing * (i + 1)}
          cy={10}
          r={3}
          fill={colors.bg[0]}
          stroke={colors.accent.DEFAULT}
          strokeWidth={1.5}
        />
      ))}
    </Svg>
  );
}

export function RouteDiagram({
  stops,
  startName,
  endName,
  turnaroundName,
  outboundLabel,
  inboundLabel,
}: RouteDiagramProps) {
  const turnIdx = stops.findIndex((s) => s.isTurnaround);
  const outboundCount = turnIdx + 1;
  const inboundCount = stops.length - turnIdx;

  return (
    <View style={styles.container}>
      {/* Outbound */}
      <View style={styles.section}>
        <Text style={styles.label}>{outboundLabel}</Text>
        <View style={styles.lineWrap}>
          <View style={styles.dot} />
          <View style={styles.lineContainer}>
            <DiagramLine count={outboundCount} width={200} />
          </View>
          <View style={styles.starDot} />
        </View>
        <Text style={styles.countText}>{outboundCount} stops</Text>
      </View>

      <View style={styles.divider} />

      {/* Inbound */}
      <View style={styles.section}>
        <Text style={styles.label}>{inboundLabel}</Text>
        <View style={styles.lineWrap}>
          <View style={styles.starDot} />
          <View style={styles.lineContainer}>
            <DiagramLine count={inboundCount} width={200} />
          </View>
          <View style={styles.dot} />
        </View>
        <Text style={styles.countText}>{inboundCount} stops</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  section: {
    padding: 16,
  },
  label: {
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.fg[3],
    marginBottom: 12,
  },
  lineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  lineContainer: {
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accent.DEFAULT,
  },
  starDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.accent.DEFAULT,
    borderWidth: 2,
    borderColor: colors.accent.hi,
  },
  countText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[4],
    letterSpacing: 0.04 * 11,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border[1],
  },
});
