import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radius, spacing } from '../../lib/design/tokens';
import { OnDemandService } from '../../lib/types';
import { Card } from './Card';
import { Pill } from './Pill';
import { StatusDot } from './StatusDot';
import { KrLine } from './KrLine';
import { IconTaxi } from './icons';

type RobotaxiCardProps = {
  service: OnDemandService;
};

export function RobotaxiCard({ service }: RobotaxiCardProps) {
  const { t, i18n } = useTranslation();
  const isKo = i18n.language === 'ko';

  const name = isKo ? service.displayNameKo : service.displayName;
  const subName = isKo ? service.displayName : service.displayNameKo;
  const area = isKo ? service.serviceAreaKo : service.serviceArea;
  const isPending = service.verificationLevel === 'official_pending';

  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.modeGlyph}>
          <IconTaxi size={22} color={colors.fg[2]} />
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.typeLabel}>
              <Text style={styles.typeLabelText}>ROBOTAXI</Text>
            </View>
            {isPending ? (
              <Pill variant="warning">
                <StatusDot color={colors.status.warning} size={5} />
                <Text style={[pillText, { color: colors.status.warning }]}>
                  {t('routes.robotaxi.checkBeforeRiding')}
                </Text>
              </Pill>
            ) : (
              <Pill variant="success">
                <StatusDot color={colors.status.success} size={5} />
                <Text style={[pillText, { color: colors.status.success }]}>OFFICIAL</Text>
              </Pill>
            )}
          </View>
          <Text style={[styles.name, isKo && styles.nameKo]}>{name}</Text>
          <KrLine>{subName}</KrLine>
          <Text style={[styles.area, isKo && styles.textKo]}>{area}</Text>
          {service.appRequired && (
            <View style={styles.appTag}>
              <View style={styles.appDot} />
              <Text style={styles.appText}>{t('routes.robotaxi.appRequired')}</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const pillText: any = {
  fontFamily: 'Geist-Medium',
  fontSize: 10,
  lineHeight: 14,
  letterSpacing: 0.08 * 10,
  textTransform: 'uppercase',
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  modeGlyph: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.bg[3],
    borderWidth: 1,
    borderColor: colors.border[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  typeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeLabelText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.accent.DEFAULT,
    letterSpacing: 0.06 * 11,
  },
  name: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: colors.fg[1],
    letterSpacing: -0.01 * 17,
  },
  nameKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  area: {
    fontFamily: 'Geist-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.fg[3],
    marginTop: 8,
  },
  textKo: {
    fontFamily: 'Pretendard-Regular',
  },
  appTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.bg[3],
    borderWidth: 1,
    borderColor: colors.border[2],
    alignSelf: 'flex-start',
  },
  appDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent.DEFAULT,
  },
  appText: {
    fontFamily: 'Geist-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[2],
    letterSpacing: 0.04 * 11,
  },
});
