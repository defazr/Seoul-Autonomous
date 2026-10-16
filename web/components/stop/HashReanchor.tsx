'use client';

import { useEffect } from 'react';

/**
 * R3b-1 — 장소 페이지의 #ars-XXXXX 앵커 보정. 위쪽 RT-2 도착정보 카드는 계약상 로딩 중 높이를 예약하지 않아서
 * (ArrivalCard "A. 로딩") 늦게 나타나면 아래 플랫폼 절이 밀린다. WebKit(iPhone)은 스크롤 앵커링이 없어 그대로 어긋난다.
 * 처음 2.5초 동안 문서 높이가 바뀔 때만 목표 절로 다시 맞추고, 사용자가 먼저 스크롤·터치·클릭(스크롤바 끌기 포함)·키 입력을 하면 즉시 멈춘다.
 */
export function HashReanchor({ prefix }: { prefix: string }) {
  useEffect(() => {
    let id: string;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return; // 잘못 인코딩된 해시(%E0 등)는 앵커가 아니다 — 예외 없이 무시 (Codex 검수 10-16)
    }
    if (!id.startsWith(prefix)) return;
    const target = document.getElementById(id);
    if (!target) return;
    let done = false;
    const stop = () => {
      done = true;
      observer.disconnect();
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointerdown', stop);
    };
    const observer = new ResizeObserver(() => {
      if (!done) target.scrollIntoView({ block: 'start' });
    });
    observer.observe(document.body);
    window.addEventListener('wheel', stop, { passive: true, once: true });
    window.addEventListener('touchstart', stop, { passive: true, once: true });
    window.addEventListener('keydown', stop, { once: true });
    window.addEventListener('pointerdown', stop, { passive: true, once: true });
    const timer = window.setTimeout(stop, 2500);
    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, [prefix]);
  return null;
}
