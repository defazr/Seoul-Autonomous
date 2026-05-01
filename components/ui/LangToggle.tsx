import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radius } from '../../lib/design/tokens';

export function LangToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language === 'ko' ? 'KO' : 'EN';

  return (
    <View style={styles.container}>
      {(['EN', 'KO'] as const).map((v) => {
        const on = v === current;
        return (
          <Pressable
            key={v}
            onPress={() => i18n.changeLanguage(v.toLowerCase())}
            style={[styles.button, on && styles.buttonActive]}
          >
            <Text style={[styles.label, on && styles.labelActive]}>{v}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: 999,
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  buttonActive: {
    backgroundColor: colors.bg[4],
  },
  label: {
    fontFamily: 'Geist-Medium',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.08 * 11,
    color: colors.fg[4],
  },
  labelActive: {
    color: colors.fg[1],
  },
});
