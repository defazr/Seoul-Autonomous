import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const pretendard = localFont({
  src: [
    { path: '../public/fonts/Pretendard-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Pretendard-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/Pretendard-SemiBold.otf', weight: '600', style: 'normal' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});
