import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '../../lib/design/tokens';
import { IconChevL } from '../ui/icons';
import type { LegalDocument, LegalSection, LegalSubsection } from '../../lib/legal/types';

type Props = {
  document: LegalDocument;
};

function renderBoldText(text: string, baseStyle: object, boldStyle: object) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  if (parts.length === 1) {
    return <Text style={baseStyle}>{text}</Text>;
  }
  return (
    <Text style={baseStyle}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={i} style={boldStyle}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
}

function BulletList({
  items,
  isKo,
}: {
  items: string[];
  isKo: boolean;
}) {
  return (
    <View style={s.bulletList}>
      {items.map((item, i) => (
        <View key={i} style={s.bulletRow}>
          <Text style={s.bulletDot}>{'\u2022'}</Text>
          <Text style={[s.body, isKo && s.bodyKo, s.bulletText]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function Subsection({
  sub,
  isKo,
}: {
  sub: LegalSubsection;
  isKo: boolean;
}) {
  return (
    <View style={s.subsection}>
      <Text style={[s.h3, isKo && s.h3Ko]}>{sub.title}</Text>
      {sub.paragraphs?.map((p, i) => (
        <View key={i} style={s.paragraph}>
          {renderBoldText(p, [s.body, isKo && s.bodyKo], s.bold)}
        </View>
      ))}
      {sub.bulletPoints && sub.bulletPoints.length > 0 && (
        <BulletList items={sub.bulletPoints} isKo={isKo} />
      )}
    </View>
  );
}

function Section({
  section,
  isKo,
}: {
  section: LegalSection;
  isKo: boolean;
}) {
  return (
    <View style={s.sectionBlock}>
      <Text style={[s.h2, isKo && s.h2Ko]}>{section.title}</Text>
      {section.paragraphs?.map((p, i) => (
        <View key={i} style={s.paragraph}>
          {renderBoldText(p, [s.body, isKo && s.bodyKo], s.bold)}
        </View>
      ))}
      {section.bulletPoints && section.bulletPoints.length > 0 && (
        <BulletList items={section.bulletPoints} isKo={isKo} />
      )}
      {section.subsections?.map((sub, i) => (
        <Subsection key={i} sub={sub} isKo={isKo} />
      ))}
    </View>
  );
}

export default function LegalDocumentScreen({ document: doc }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const isKo = i18n.language === 'ko';

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* TopBar — inline, same as Route Detail */}
      <View style={s.topBar}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <IconChevL size={18} color={colors.fg[1]} />
        </Pressable>
        <View style={s.topBarTitle}>
          <Text style={[s.topBarText, isKo && s.topBarTextKo]} numberOfLines={1}>
            {doc.title}
          </Text>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Title */}
        <View style={s.content}>
          <Text style={[s.heading, isKo && s.headingKo]}>{doc.title}</Text>

          {/* Dates */}
          <Text style={[s.caption, isKo && s.captionKo]}>
            {isKo ? `시행일자: ${doc.effectiveDate}` : `Effective date: ${doc.effectiveDate}`}
          </Text>
          <Text style={[s.caption, isKo && s.captionKo]}>
            {isKo ? `최종 수정일: ${doc.lastUpdated}` : `Last updated: ${doc.lastUpdated}`}
          </Text>

          {/* Sections */}
          {doc.sections.map((section, i) => (
            <Section key={i} section={section} isKo={isKo} />
          ))}

          {/* Contact Block */}
          <View style={s.contactBlock}>
            <Text style={[s.contactName, isKo && s.contactNameKo]}>
              {doc.contact.developer}
            </Text>
            <Text style={[s.contactLine, isKo && s.contactLineKo]}>
              {isKo ? `이메일: ${doc.contact.email}` : `Email: ${doc.contact.email}`}
            </Text>
            <Text style={[s.contactLine, isKo && s.contactLineKo]}>
              {isKo ? `소재지: ${doc.contact.location}` : `Location: ${doc.contact.location}`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg[0],
  },
  // TopBar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flex: 1,
  },
  topBarText: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: colors.fg[1],
    letterSpacing: -0.01 * 17,
  },
  topBarTextKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 64,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
  },
  // Heading
  heading: {
    fontFamily: 'Geist-Bold',
    fontSize: 28,
    lineHeight: 32,
    color: colors.fg[1],
    letterSpacing: -0.03 * 28,
    marginBottom: 8,
  },
  headingKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  // Caption (dates)
  caption: {
    fontFamily: 'Geist-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.fg[3],
    marginBottom: 2,
  },
  captionKo: {
    fontFamily: 'Pretendard-Regular',
  },
  // Section
  sectionBlock: {
    marginTop: 32,
  },
  h2: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 20,
    lineHeight: 26,
    color: colors.fg[1],
    marginBottom: 12,
  },
  h2Ko: {
    fontFamily: 'Pretendard-SemiBold',
  },
  // Subsection
  subsection: {
    marginTop: 20,
  },
  h3: {
    fontFamily: 'Geist-Medium',
    fontSize: 16,
    lineHeight: 22,
    color: colors.fg[1],
    marginBottom: 8,
  },
  h3Ko: {
    fontFamily: 'Pretendard-Medium',
  },
  // Body
  paragraph: {
    marginBottom: 10,
  },
  body: {
    fontFamily: 'Geist-Regular',
    fontSize: 15,
    lineHeight: 24,
    color: colors.fg[2],
  },
  bodyKo: {
    fontFamily: 'Pretendard-Regular',
  },
  bold: {
    fontFamily: 'Geist-SemiBold',
    fontWeight: '700',
  },
  // Bullet list
  bulletList: {
    marginTop: 4,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: 8,
    marginBottom: 6,
  },
  bulletDot: {
    fontFamily: 'Geist-Regular',
    fontSize: 15,
    lineHeight: 24,
    color: colors.fg[3],
    width: 16,
  },
  bulletText: {
    flex: 1,
  },
  // Contact
  contactBlock: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border[1],
  },
  contactName: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 15,
    lineHeight: 22,
    color: colors.fg[1],
    marginBottom: 4,
  },
  contactNameKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  contactLine: {
    fontFamily: 'Geist-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.fg[3],
    marginBottom: 2,
  },
  contactLineKo: {
    fontFamily: 'Pretendard-Regular',
  },
});
