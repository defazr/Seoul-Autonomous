import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../lib/design/tokens';
import { IconPlus, IconMinus } from './icons';

type FAQItemProps = {
  question: string;
  answer: string[];
  defaultOpen?: boolean;
  isKo?: boolean;
};

export function FAQItem({ question, answer, defaultOpen = false, isKo }: FAQItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(!open)} style={styles.header}>
        <Text style={[styles.question, isKo && styles.questionKo]}>{question}</Text>
        <View style={styles.toggle}>
          {open ? (
            <IconMinus size={14} color={colors.fg[2]} />
          ) : (
            <IconPlus size={14} color={colors.fg[2]} />
          )}
        </View>
      </Pressable>
      {open && (
        <View style={styles.body}>
          {answer.map((line, i) => (
            <Text key={i} style={[styles.answerLine, isKo && styles.textKo]}>
              {line}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border[1],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 18,
  },
  question: {
    flex: 1,
    fontFamily: 'Geist-SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.fg[1],
    letterSpacing: -0.01 * 16,
  },
  questionKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  toggle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: colors.bg[3],
    borderWidth: 1,
    borderColor: colors.border[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingBottom: 18,
    gap: 8,
  },
  answerLine: {
    fontFamily: 'Geist-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.fg[3],
  },
  textKo: {
    fontFamily: 'Pretendard-Regular',
  },
});
