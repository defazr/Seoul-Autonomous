import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../lib/design/tokens';
import { KrLine } from '../ui/KrLine';
import { IconChevL } from '../ui/icons';

type TopBarProps = {
  title?: string;
  kr?: string;
  onBack?: () => void;
  action?: React.ReactNode;
};

export function TopBar({ title, kr, onBack, action }: TopBarProps) {
  return (
    <View style={styles.container}>
      {onBack && (
        <Pressable onPress={onBack} style={styles.backButton}>
          <IconChevL size={18} color={colors.fg[1]} />
        </Pressable>
      )}
      <View style={styles.titleWrap}>
        {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
        {kr && <KrLine>{kr}</KrLine>}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
    minHeight: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: colors.fg[1],
    letterSpacing: -0.01 * 17,
  },
});
