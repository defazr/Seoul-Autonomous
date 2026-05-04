import type { Metadata } from 'next';
import { geistSans, geistMono, pretendard } from '../lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seoul Autonomous',
  description: 'Guide to autonomous transportation routes in Seoul for foreign tourists',
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
