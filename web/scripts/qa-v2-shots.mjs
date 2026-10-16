// v2 셸 QA 캡처 (R3A §12 V7 회귀용). 설치 없이 npx 캐시의 playwright 를 쓴다 — 경로는 memory/local-qa-toolchain.md 참고.
// 사용: node scripts/qa-v2-shots.mjs http://127.0.0.1:3123 <출력폴더> <시작번호> "/ko|라벨|옵션" ...  옵션: full · vponly · wait · search · menu · focus · loc · popup(허브 지도 마커 클릭 + 지도 영역 캡처) · station(노선도 강남역 노드 클릭 → 역 카드) · fs(노선도 크게 보기 전체화면) · stoptap(N노선 타임라인 4번째 정류장명 탭 → 지도 링크)
import pw from '/Users/dapala.corp/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
import { mkdirSync } from 'node:fs';
const { chromium } = pw;
const [base, outDir, startNo, ...pages] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const exe = '/Users/dapala.corp/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const browser = await chromium.launch({ executablePath: exe, headless: true });
let n = Number(startNo);
const report = [];
for (const p of pages) {
  const [path, label, opts = ''] = p.split('|');
  for (const vp of [{ name: 'desktop', w: 1440, h: 900, mobile: false }, { name: 'mobile', w: 390, h: 844, mobile: true }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: vp.mobile ? 2 : 1, locale: 'ko-KR', timezoneId: 'Asia/Seoul', ...(opts.includes('loc') ? { geolocation: { latitude: 37.5566, longitude: 126.9239 }, permissions: ['geolocation'] } : {}) });
    const page = await ctx.newPage();
    const errors = [], warns = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); else if (m.type() === 'warning') warns.push(m.text()); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(opts.includes('wait') ? 2600 : 1200);
    if (opts.includes('menu') && vp.mobile) { await page.click('button[aria-label="메뉴 열기"], button[aria-label="Open menu"]'); await page.waitForTimeout(600); }
    if (opts.includes('focus')) { await page.click('#nb-from'); await page.type('#nb-from', 'ㄱㄴ'); await page.waitForTimeout(900); }
    if (opts.includes('loc')) { await page.click('text=내 위치'); await page.waitForTimeout(1500); await page.fill('#nb-to', '강남역'); await page.press('#nb-to', 'Enter'); await page.waitForTimeout(2600); }
    if (opts.includes('popup')) { const map = page.locator('.maplibregl-map').first(); await map.scrollIntoViewIfNeeded(); await page.waitForTimeout(1500); await page.locator('button.maplibregl-marker').first().click(); await page.waitForTimeout(700); await map.screenshot({ path: `${outDir}/${String(n).padStart(2, '0')}-${label}-${vp.name}-map.jpg`, type: 'jpeg', quality: 86 }); }
    if (opts.includes('station')) { const hit = page.locator('svg[aria-label="서울 올빼미버스 노선도"] circle[cx="1431"][cy="1132"]').first(); await hit.scrollIntoViewIfNeeded(); await hit.click({ force: true }); await page.waitForTimeout(700); if (!vp.mobile) { await page.locator('svg[aria-label="서울 올빼미버스 노선도"]').first().scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -80)); } }
    if (opts.includes('fs')) { await page.locator('button[aria-label="지도 크게 보기"]').first().click(); await page.waitForTimeout(900); }
    if (opts.includes('stoptap')) { const b = page.locator('ol li button[aria-expanded]').nth(3); await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(400); await page.evaluate(() => window.scrollBy(0, -240)); }
    if (opts.includes('search')) {
      await page.click('text=홍대입구역 → 강남역');
      await page.waitForTimeout(2600);
    }
    const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth);
    const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family).filter((v, i, a) => a.indexOf(v) === i); });
    const file = `${outDir}/${String(n).padStart(2, '0')}-${label}-${vp.name}.jpg`;
    await page.screenshot({ path: file, fullPage: opts.includes('full') || (vp.mobile && !opts.includes('vponly')), type: 'jpeg', quality: 86 });
    report.push({ path, vp: vp.name, file, overflow, errors: errors.length, warns: warns.length, errSample: errors.slice(0, 3), warnSample: warns.filter((w) => /hydrat|mismatch/i.test(w)).slice(0, 2), fonts: fonts.slice(0, 8) });
    n += 1;
    await ctx.close();
  }
}
await browser.close();
for (const r of report) console.log(JSON.stringify(r));
