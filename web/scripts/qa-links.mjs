// sitemap 전수 내부 링크 · canonical · hreflang · 리다이렉트 검사 (R3A §12 V7 · AdSense 사전 점검 입력). 네트워크는 로컬 서버만.
// 사용: node scripts/qa-links.mjs http://127.0.0.1:3123
const base = process.argv[2] || 'http://127.0.0.1:3123';
const xml = await (await fetch(base + '/sitemap.xml')).text();
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const toLocal = (u) => u.replace(/^https?:\/\/[^/]+/, base);
const seen = new Map();
const report = { pages: [], broken: [], redirects: [], noCanonical: [], canonicalMismatch: [], noHreflang: [], infra: {} };
for (const p of ['/robots.txt', '/ads.txt', '/sitemap.xml', '/', '/ko', '/en', '/favicon.ico', '/ko/does-not-exist-404-check']) {
  const r = await fetch(base + p, { redirect: 'manual' });
  report.infra[p] = { status: r.status, location: r.headers.get('location') ?? undefined, type: (r.headers.get('content-type') ?? '').split(';')[0] };
}
for (const loc of locs) {
  const res = await fetch(toLocal(loc), { redirect: 'manual' });
  const html = await res.text();
  const canon = (html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || [])[1];
  const alts = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/gi)].map((m) => ({ lang: m[1], href: m[2] }));
  const hrefs = [...new Set([...html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)].map((m) => m[1]).filter((h) => !h.startsWith('/_next/') && !h.startsWith('//')))];
  if (!canon) report.noCanonical.push(loc); else if (canon !== loc) report.canonicalMismatch.push({ loc, canon });
  if (alts.length === 0) report.noHreflang.push(loc);
  for (const h of hrefs) {
    if (!seen.has(h)) { const r = await fetch(base + h, { redirect: 'manual' }); seen.set(h, { status: r.status, to: r.headers.get('location') }); }
    const st = seen.get(h);
    if (st.status >= 400) report.broken.push({ from: loc, href: h, status: st.status });
    else if (st.status >= 300) report.redirects.push({ from: loc, href: h, status: st.status, to: st.to });
  }
  report.pages.push({ url: loc, status: res.status, canonical: canon, hreflang: alts.map((a) => a.lang).join(','), links: hrefs.length });
}
const uniqRedirects = [...new Map(report.redirects.map((r) => [r.href, r])).values()];
console.log(JSON.stringify({
  sitemapUrls: locs.length, pagesFetched: report.pages.length, non200Pages: report.pages.filter((p) => p.status !== 200),
  internalHrefsChecked: seen.size, broken: report.broken, redirectTargets: uniqRedirects,
  noCanonical: report.noCanonical, canonicalMismatch: report.canonicalMismatch, noHreflang: report.noHreflang,
  hreflangSample: report.pages.slice(0, 3).map((p) => ({ url: p.url, hreflang: p.hreflang })), infra: report.infra,
}, null, 1));
