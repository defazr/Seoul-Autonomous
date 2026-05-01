/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          0: '#000000',
          1: '#0A0A0A',
          2: '#111111',
          3: '#1A1A1A',
          4: '#1F1F1F',
        },
        fg: {
          1: '#FFFFFF',
          2: '#EDEDED',
          3: '#A1A1A1',
          4: '#8F8F8F',
          5: '#555555',
        },
        border: {
          1: '#1F1F1F',
          2: '#2E2E2E',
          3: '#454545',
        },
        accent: {
          DEFAULT: '#00D4FF',
          hi: '#5BE6FF',
          lo: '#0099BF',
        },
        status: {
          success: '#45A557',
          warning: '#FFB224',
          danger: '#E5484D',
          info: '#0072F5',
        },
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['Geist'],
        mono: ['GeistMono'],
        kr: ['Pretendard'],
      },
    },
  },
  plugins: [],
};
