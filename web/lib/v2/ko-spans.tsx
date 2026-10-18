import type { ReactNode } from 'react';

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/;
const RUN = /[ᄀ-ᇿ㄰-㆏가-힯][ᄀ-ᇿ㄰-㆏가-힯\s·]*[ᄀ-ᇿ㄰-㆏가-힯]|[ᄀ-ᇿ㄰-㆏가-힯]/g;

/** 영어 본문 속 한국어 조각(정류장명·앱 이름 등)에 lang="ko" 를 붙인다 (WCAG 3.1.2 · 접근성 감사 10-18 FIX 1). 한글이 없으면 문자열 그대로. */
export function koSpans(text: string): ReactNode {
  if (!HANGUL.test(text)) return text;
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  RUN.lastIndex = 0;
  for (let m = RUN.exec(text); m; m = RUN.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<span key={i++} lang="ko">{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
