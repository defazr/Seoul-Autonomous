import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radius } from '../../lib/design/tokens';
import { IconNav } from './icons';

type MapLinkButtonsProps = {
  displayNameKo: string;
};

export function MapLinkButtons({ displayNameKo }: MapLinkButtonsProps) {
  const { t } = useTranslation();

  const openKakao = () => {
    const q = encodeURIComponent(displayNameKo);
    Linking.openURL(`https://map.kakao.com/?q=${q}`);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={openKakao} style={styles.button}>
        <IconNav size={15} color="#000" />
        <Text style={styles.buttonText}>{t('routeDetail.maps.kakao')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: 'rgba(10,10,10,0.92)',
    borderTopWidth: 1,
    borderTopColor: colors.border[1],
  },
  button: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent.DEFAULT,
    backgroundColor: colors.accent.DEFAULT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonText: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
  },
});
