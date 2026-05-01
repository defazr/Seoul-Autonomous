import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../lib/design/tokens';
import { IconCheck } from './icons';

type BulletRowProps = {
  text: string;
  useCheck?: boolean;
  isKo?: boolean;
};

export function BulletRow({ text, useCheck, isKo }: BulletRowProps) {
  return (
    <View style={styles.row}>
      {useCheck ? (
        <View style={styles.checkWrap}>
          <IconCheck size={11} color={colors.accent.DEFAULT} />
        </View>
      ) : (
        <View style={styles.dot} />
      )}
      <Text style={[styles.text, isKo && styles.textKo]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.fg[4],
    marginTop: 9,
  },
  checkWrap: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: colors.accent.faint,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontFamily: 'Geist-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.fg[2],
  },
  textKo: {
    fontFamily: 'Pretendard-Regular',
  },
});
