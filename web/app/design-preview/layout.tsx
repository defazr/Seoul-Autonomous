import { notFound } from 'next/navigation';
import { geistSans, geistMono, pretendard } from '../../lib/fonts';

export default function DesignPreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable}`}>
      <body>{children}</body>
    </html>
  );
}
