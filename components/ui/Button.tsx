import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, radius, shadows } from '../../lib/design/tokens';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
};

const SIZES: Record<string, { height: number; paddingHorizontal: number; font: TextStyle }> = {
  sm: { height: 32, paddingHorizontal: 12, font: { fontFamily: 'Geist-Medium', fontSize: 13, lineHeight: 16 } },
  md: { height: 44, paddingHorizontal: 16, font: { fontFamily: 'Geist-Medium', fontSize: 15, lineHeight: 22 } },
  lg: { height: 52, paddingHorizontal: 20, font: { fontFamily: 'Geist-Medium', fontSize: 16, lineHeight: 22 } },
};

const VARIANTS: Record<string, { bg: string; textColor: string; borderColor: string; shadow?: ViewStyle }> = {
  primary: {
    bg: colors.accent.DEFAULT,
    textColor: '#000000',
    borderColor: colors.accent.DEFAULT,
    shadow: shadows.glow,
  },
  secondary: {
    bg: colors.bg[3],
    textColor: colors.fg[1],
    borderColor: colors.border[2],
  },
  ghost: {
    bg: 'transparent',
    textColor: colors.fg[2],
    borderColor: colors.border[2],
  },
};

export function Button({ children, variant = 'primary', size = 'md', onPress, icon, style }: ButtonProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          backgroundColor: v.bg,
          borderColor: v.borderColor,
        },
        v.shadow,
        style,
      ]}
    >
      <Text style={[s.font, { color: v.textColor }]}>{children}</Text>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
