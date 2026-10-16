/** 노선색 표시 규칙 (v2). SSoT 색은 보존하고 표시색만 바꾼다 — N72 공식색 #1E1E1E 는 다크 바탕에서 보이지 않는다. */
import { ROUTE_COLORS } from '../../app/[locale]/night-bus-map/night-bus-data';

export const DISPLAY_COLOR: Record<string, string> = { N72: '#C9CFDA' };
export const FALLBACK_COLOR = '#9AA3B2';

export function routeDisplayColor(no: string, color?: string | null): string {
  return DISPLAY_COLOR[no] ?? color ?? ROUTE_COLORS[no] ?? FALLBACK_COLOR;
}

/** 상대 휘도(sRGB). 0.2 이상이면 잉크 글자, 아니면 밝은 글자 — 시안 v2.3 의 수동 목록(N26·N30·N61·N64·N75 = 밝은 글자)과 같은 결과. */
export function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const ch = (i: number) => { const v = parseInt(n.slice(i, i + 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * ch(0) + 0.7152 * ch(2) + 0.0722 * ch(4);
}
export function onColor(hex: string): string { return luminance(hex) >= 0.2 ? '#0B0F1A' : '#F3F5FA'; }

/** 두 색의 WCAG 대비. */
export function contrast(a: string, b: string): number { const la = luminance(a), lb = luminance(b); const [hi, lo] = la > lb ? [la, lb] : [lb, la]; return (hi + 0.05) / (lo + 0.05); }
function mixWhite(hex: string, t: number): string {
  const h = hex.replace('#', ''); const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const c = (i: number) => Math.round(parseInt(n.slice(i, i + 2), 16) + (255 - parseInt(n.slice(i, i + 2), 16)) * t).toString(16).padStart(2, '0');
  return `#${c(0)}${c(2)}${c(4)}`;
}
/** 어두운 바탕 위 '글자'로 쓰는 노선색 — 색상은 유지하고 대비가 3:1(큰 글자 AA) 이 될 때까지만 밝힌다 (접근성 감사 B4: N75 1.55:1 등). */
export function routeTextColor(no: string, color?: string | null, bg = '#121A33', min = 3): string {
  const base = routeDisplayColor(no, color);
  let t = 0; let out = base;
  while (contrast(out, bg) < min && t < 0.9) { t += 0.1; out = mixWhite(base, t); }
  return out;
}
