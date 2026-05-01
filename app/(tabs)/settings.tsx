import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadows } from '../../lib/design/tokens';
import { KrLine } from '../../components/ui/KrLine';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { IconChevR } from '../../components/ui/icons';

const VERIFIED_DATE = 'April 29, 2026';
const APP_VERSION = '1.0.0 (MVP)';

function LangSwitch({ lang, onChange }: { lang: string; onChange: (v: string) => void }) {
  return (
    <View style={langStyles.container}>
      {['EN', 'KO'].map((v) => {
        const on = v === lang;
        return (
          <Pressable
            key={v}
            onPress={() => onChange(v)}
            style={[
              langStyles.button,
              on && langStyles.buttonActive,
            ]}
          >
            <Text style={[langStyles.label, on && langStyles.labelActive]}>{v}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const langStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bg[3],
    borderWidth: 1,
    borderColor: colors.border[2],
    borderRadius: radius.md,
    padding: 2,
    height: 32,
  },
  button: {
    height: 28,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.accent.DEFAULT,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.08 * 12,
    color: colors.fg[2],
  },
  labelActive: {
    color: '#000000',
  },
});

function Group({ children }: { children: React.ReactNode }) {
  return <View style={groupStyles.container}>{children}</View>;
}

const groupStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: 28,
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});

function Row({
  label,
  value,
  action,
  onPress,
  isLast,
}: {
  label: string;
  value?: string;
  action?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[rowStyles.container, !isLast && rowStyles.border]}>
      <Text style={rowStyles.label}>{label}</Text>
      {value && <Text style={rowStyles.value}>{value}</Text>}
      {action}
    </Pressable>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border[1],
  },
  label: {
    flex: 1,
    fontFamily: 'Geist-Medium',
    fontSize: 14,
    lineHeight: 18,
    color: colors.fg[1],
  },
  value: {
    fontFamily: 'Geist-Regular',
    fontSize: 13,
    lineHeight: 16,
    color: colors.fg[3],
  },
});

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const lang = i18n.language === 'ko' ? 'KO' : 'EN';

  const handleLangChange = (v: string) => {
    i18n.changeLanguage(v.toLowerCase());
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Settings</Text>
        <KrLine>설정</KrLine>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Language */}
        <Eyebrow>Language</Eyebrow>
        <Group>
          <Row
            label="App language"
            action={<LangSwitch lang={lang} onChange={handleLangChange} />}
            isLast
          />
        </Group>

        {/* About */}
        <Eyebrow>About</Eyebrow>
        <Group>
          <Row label="App version" value={APP_VERSION} />
          <Row label="Information verified" value={VERIFIED_DATE} isLast />
        </Group>

        <Text style={styles.aboutNote}>
          Route information is curated and last verified on the date above.
          Always confirm operating status with the operator before riding.
        </Text>

        {/* Legal */}
        <Eyebrow>Legal</Eyebrow>
        <Group>
          <Row
            label="Privacy policy"
            action={<IconChevR size={16} color={colors.fg[4]} />}
            onPress={() => {}}
          />
          <Row
            label="Terms of use"
            action={<IconChevR size={16} color={colors.fg[4]} />}
            onPress={() => {}}
            isLast
          />
        </Group>

        {/* Footer */}
        <Text style={styles.footer}>SEOUL AUTONOMOUS · MVP</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg[1],
  },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 8,
    paddingBottom: 24,
  },
  heading: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 28,
    lineHeight: 32,
    color: colors.fg[1],
    letterSpacing: -0.02 * 28,
    marginTop: 8,
    marginBottom: 4,
  },
  scroll: {
    flex: 1,
  },
  aboutNote: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: -16,
    marginBottom: 28,
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.fg[4],
  },
  footer: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[5],
    letterSpacing: 0.08 * 11,
    textAlign: 'center',
    paddingTop: 8,
  },
});
