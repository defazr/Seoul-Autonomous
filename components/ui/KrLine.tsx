import { Text, TextStyle } from 'react-native';
import { colors } from '../../lib/design/tokens';

type KrLineProps = {
  children: React.ReactNode;
  style?: TextStyle;
};

export function KrLine({ children, style }: KrLineProps) {
  return (
    <Text style={[defaultStyle, style]}>
      {children}
    </Text>
  );
}

const defaultStyle: TextStyle = {
  fontFamily: 'Pretendard-Regular',
  color: colors.fg[3],
  fontSize: 13,
  lineHeight: 18,
};
