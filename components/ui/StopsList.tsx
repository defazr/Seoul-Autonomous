import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radius } from '../../lib/design/tokens';
import { Stop } from '../../lib/types';

type StopsListProps = {
  stops: Stop[];
};

function StopRow({ stop, isFirst, isLast, isTurnaround }: {
  stop: Stop;
  isFirst: boolean;
  isLast: boolean;
  isTurnaround: boolean;
}) {
  return (
    <View style={styles.stopRow}>
      <View style={styles.timeline}>
        <View style={[styles.lineTop, isFirst && styles.lineHidden]} />
        <View style={[
          styles.stopDot,
          isTurnaround && styles.stopDotTurnaround,
        ]} />
        <View style={[styles.lineBottom, isLast && styles.lineHidden]} />
      </View>
      <View style={styles.stopContent}>
        <View style={styles.stopMeta}>
          <Text style={styles.stopSeq}>{String(stop.seq).padStart(2, '0')}</Text>
          <Text style={styles.stopName}>{stop.nameEn || stop.nameKo}</Text>
        </View>
        {stop.nameEn && (
          <Text style={styles.stopNameKo}>{stop.nameKo}</Text>
        )}
      </View>
    </View>
  );
}

export function StopsList({ stops }: StopsListProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const turnIdx = stops.findIndex((s) => s.isTurnaround);
  const first = stops[0];
  const turn = turnIdx >= 0 ? stops[turnIdx] : null;
  const last = stops[stops.length - 1];

  const summaryStops = [first, turn, last].filter(Boolean) as Stop[];
  const displayStops = expanded ? stops : summaryStops;

  return (
    <View>
      <View style={styles.list}>
        {displayStops.map((stop, i) => (
          <StopRow
            key={`${stop.seq}-${expanded}`}
            stop={stop}
            isFirst={i === 0}
            isLast={i === displayStops.length - 1}
            isTurnaround={stop.isTurnaround}
          />
        ))}
      </View>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={styles.toggleBtn}
      >
        <Text style={styles.toggleText}>
          {expanded
            ? t('routeDetail.stops.hide')
            : t('routeDetail.stops.showAll', { count: stops.length })
          }
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {},
  stopRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'stretch',
  },
  timeline: {
    width: 18,
    alignItems: 'center',
  },
  lineTop: {
    width: 1,
    height: 8,
    backgroundColor: colors.border[2],
  },
  lineBottom: {
    width: 1,
    flex: 1,
    backgroundColor: colors.border[2],
  },
  lineHidden: {
    backgroundColor: 'transparent',
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.bg[1],
    borderWidth: 1.5,
    borderColor: colors.fg[5],
  },
  stopDotTurnaround: {
    borderColor: colors.accent.DEFAULT,
    backgroundColor: colors.accent.faint,
    width: 12,
    height: 12,
  },
  stopContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopSeq: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[4],
    letterSpacing: 0.04 * 11,
  },
  stopName: {
    fontFamily: 'Geist-Medium',
    fontSize: 15,
    lineHeight: 20,
    color: colors.fg[1],
  },
  stopNameKo: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.fg[3],
    marginTop: 1,
    marginLeft: 30,
  },
  toggleBtn: {
    height: 40,
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  toggleText: {
    fontFamily: 'Geist-Medium',
    fontSize: 13,
    lineHeight: 16,
    color: colors.fg[2],
  },
});
