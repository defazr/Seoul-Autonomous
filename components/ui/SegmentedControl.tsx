import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../../lib/design/tokens';

type Option = {
  value: string;
  label: string;
};

type SegmentedControlProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 10,
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
  },
  segment: {
    flex: 1,
    height: 36,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.accent.DEFAULT,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 4,
  },
  label: {
    fontFamily: 'Geist-Medium',
    fontSize: 13,
    lineHeight: 16,
    color: colors.fg[3],
  },
  labelActive: {
    color: '#000000',
  },
});
