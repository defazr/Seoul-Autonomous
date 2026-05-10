import type { Metadata } from 'next';
import { geistSans, geistMono, pretendard } from '../lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seoul Autonomous',
  description: 'Guide to autonomous transportation routes in Seoul for foreign tourists',
  verification: {
    google: 'XVe25p6uT1qMSLHgXPUlsGdXvp3vOZYbzJWVdebe2IE',
    other: {
      'naver-site-verification': 'e76930efabe656cabb6d52a1245c8cf96b150e53',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable}`}>
      <body>{children}</body>
    </html>
  );
}
