/**
 * 디자인 시스템 v2 글꼴 (R3A §12 V1). 시안 v2.3 과 같이 표시 = Gothic A1(800/900) · 본문 = IBM Plex Sans KR · 수치 = Geist Mono.
 * next/font/google 은 Google 의 unicode-range 분할(한글 ~96조각)을 그대로 self-host 한다. subsets 는 preload 대상(라틴)만 지정한다.
 * Pretendard(로컬)는 폴백 — 본문 글꼴이 아직 안 왔을 때 한글 폭이 비슷한 글꼴로 받친다.
 */
import { Gothic_A1, IBM_Plex_Sans_KR, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';

// 배포 전 점검(10-16): 한글 조각 전송량 — 굵기 하나가 페이지당 최대 ~96조각·800KB 다. 800 은 900 으로, 500 은 400 으로 브라우저가 대체하므로
// 선언 굵기를 줄여 첫 방문 글꼴 2.5MB → 약 1.6MB (CSS 의 font-weight:500·800 은 그대로 두어도 가장 가까운 굵기로 매칭된다).
// preload: false — 한글 조각(~96개/굵기)이 전부 <link rel=preload> 로 강제 선로딩돼 unicode-range 지연 로딩이 무력화됐다(SEO 감사 FIX 2 · 96개 864KB/페이지). 라틴 전용 Geist Mono 만 preload.
export const gothicA1 = Gothic_A1({ weight: ['900'], subsets: ['latin'], variable: '--font-gothic', display: 'swap', preload: false });
export const plexSansKr = IBM_Plex_Sans_KR({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-plex', display: 'swap', preload: false });
export const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
export const pretendard = localFont({
  src: [
    { path: '../../public/fonts/Pretendard-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Pretendard-Medium.otf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Pretendard-SemiBold.otf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Pretendard-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
  preload: false,
});

export const fontClassName = `${gothicA1.variable} ${plexSansKr.variable} ${geistMono.variable} ${pretendard.variable}`;
