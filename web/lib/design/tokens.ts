// Design tokens — aligned with colors_and_type.css (design source of truth)

export const colors = {
  // Backgrounds (deepest -> highest elevation)
  bg: {
    0: '#000000',  // page void / map base
    1: '#0A0A0A',  // primary surface
    2: '#111111',  // card / sheet
    3: '#1A1A1A',  // raised card
    4: '#1F1F1F',  // hovered card
  },
  // Foregrounds
  fg: {
    1: '#FFFFFF',  // primary text, headlines
    2: '#EDEDED',  // secondary text, dense body
    3: '#A1A1A1',  // tertiary, captions, labels
    4: '#8F8F8F',  // quaternary, hint
    5: '#555555',  // disabled
  },
  // Borders / strokes
  border: {
    1: '#1F1F1F',  // hairline card border
    2: '#2E2E2E',  // visible border
    3: '#454545',  // hovered/focused
  },
  // Accent — Electric Cyan
  accent: {
    DEFAULT: '#00D4FF',
    hi: '#5BE6FF',     // lighter, hover
    lo: '#0099BF',     // deeper, pressed
    glow: 'rgba(0, 212, 255, 0.32)',
    faint: 'rgba(0, 212, 255, 0.10)',
  },
  // Status / semantic
  status: {
    success: '#45A557',  // on-route, operational
    warning: '#FFB224',  // delay, caution
    danger: '#E5484D',   // offline, error
    info: '#0072F5',     // informational blue
  },
};

// Spacing scale (4pt)
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
  // Semantic aliases
  screenPadding: 20,
  cardPadding: 16,
  cardGap: 12,
  sectionGap: 32,
};

// Border radius
export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  pill: 999,
};

// Shadows (CSS box-shadow format for web)
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
  md: '0 4px 16px rgba(0, 0, 0, 0.5)',
  lg: '0 16px 48px rgba(0, 0, 0, 0.7)',
  glow: '0 0 24px rgba(0, 212, 255, 0.32)',
};

// Typography
export const fonts = {
  sans: 'Geist',
  mono: 'GeistMono',
  kr: 'Pretendard',
};

export const typography = {
  display: { fontFamily: 'Geist-Bold', fontSize: 40, lineHeight: 44, letterSpacing: -0.02 * 40 },
  h1: { fontFamily: 'Geist-SemiBold', fontSize: 32, lineHeight: 36, letterSpacing: -0.02 * 32 },
  h2: { fontFamily: 'Geist-SemiBold', fontSize: 24, lineHeight: 28, letterSpacing: -0.02 * 24 },
  h3: { fontFamily: 'Geist-SemiBold', fontSize: 20, lineHeight: 24 },
  title: { fontFamily: 'Geist-Medium', fontSize: 17, lineHeight: 22 },
  body: { fontFamily: 'Geist-Regular', fontSize: 15, lineHeight: 22 },
  bodyMd: { fontFamily: 'Geist-Medium', fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: 'Geist-Regular', fontSize: 13, lineHeight: 18 },
  label: { fontFamily: 'Geist-Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.08 * 12, textTransform: 'uppercase' as const },
  mono: { fontFamily: 'GeistMono-Medium', fontSize: 13, lineHeight: 18 },
  monoLg: { fontFamily: 'GeistMono-Medium', fontSize: 16, lineHeight: 20 },
};
