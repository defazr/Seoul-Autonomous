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
          0: '#FFFFFF',
          1: '#A0A0B0',
          2: '#6B6B7B',
        },
        accent: '#00D4FF',
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          info: '#00D4FF',
          danger: '#EF4444',
        },
      },
    },
  },
  plugins: [],
};
