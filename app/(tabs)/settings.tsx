import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius } from '../../lib/design/tokens';
import { KrLine } from '../../components/ui/KrLine';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { IconChevR } from '../../components/ui/icons';
import { formatDate } from '../../lib/utils/date';

const VERIFIED_DATE_ISO = '2026-04-29';
const APP_VERSION = '1.0.0';

function LangSwitch({ lang, onChange }: { lang: string; onChange: (v: string) => void }) {
  return (
    <View style={langStyles.container}>
      {['EN', 'KO'].map((v) => {
        const on = v === lang;
        return (
          <Pressable
            key={v}
            onPress={() => onChange(v)}
            style={[langStyles.button, on && langStyles.buttonActive]}
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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isKo = i18n.language === 'ko';
  const lang = isKo ? 'KO' : 'EN';

  const handleLangChange = (v: string) => {
    i18n.changeLanguage(v.toLowerCase());
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, isKo && styles.headingKo]}>
          {t('settings.title')}
        </Text>
        {!isKo && <KrLine>{t('settings.titleKr')}</KrLine>}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Language */}
        <Eyebrow>{t('settings.section.language')}</Eyebrow>
        <Group>
          <Row
            label={t('settings.row.appLanguage')}
            action={<LangSwitch lang={lang} onChange={handleLangChange} />}
            isLast
          />
        </Group>

        {/* About */}
        <Eyebrow>{t('settings.section.about')}</Eyebrow>
        <Group>
          <Row label={t('settings.row.appVersion')} value={APP_VERSION} />
          <Row label={t('settings.row.informationVerified')} value={formatDate(VERIFIED_DATE_ISO, isKo)} isLast />
        </Group>

        <Text style={[styles.aboutNote, isKo && styles.textKo]}>
          {t('settings.about.note')}
        </Text>

        {/* Legal */}
        <Eyebrow>{t('settings.section.legal')}</Eyebrow>
        <Group>
          <Row
            label={t('settings.row.privacyPolicy')}
            action={<IconChevR size={16} color={colors.fg[4]} />}
            onPress={() => router.push('/legal/privacy')}
          />
          <Row
            label={t('settings.row.termsOfUse')}
            action={<IconChevR size={16} color={colors.fg[4]} />}
            onPress={() => router.push('/legal/terms')}
            isLast
          />
        </Group>

        {/* Footer */}
        <Text style={styles.footer}>{t('settings.footer')}</Text>
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
  headingKo: {
    fontFamily: 'Pretendard-SemiBold',
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
  textKo: {
    fontFamily: 'Pretendard-Regular',
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
