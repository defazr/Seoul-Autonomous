// 전수 QA (R3A §12 V7): sitemap 의 모든 URL 을 데스크톱·모바일로 열어 HTTP·콘솔 오류·overflow·하이드레이션 경고·h1/footer 수를 잰다. playwright 경로는 memory/local-qa-toolchain.md.
// 사용: node scripts/qa-v2-all.mjs http://127.0.0.1:3123 [모바일 캡처 폴더]   (로컬에서 /ko/stops/01009 는 도착 API 키가 없어 503 폴링 → networkidle 미도달이 정상)
import pw from '/Users/dapala.corp/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
import { mkdirSync } from 'node:fs';
const { chromium } = pw;
const [base, shotsDir] = process.argv.slice(2);
const exe = '/Users/dapala.corp/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const xml = await (await fetch(base + '/sitemap.xml')).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://seoulautonomous.com', ''));
const paths = [...new Set(urls)];
if (shotsDir) mkdirSync(shotsDir, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true });
// GA4·AdSense 요청 차단 (2026-10-16 · 4주 관측 데이터 오염 방지 — 로컬 검사도 같은 측정 ID 를 싣는다). 차단으로 생기는 ERR_FAILED 콘솔 줄은 차단 건수만큼 뺀다.
const BLOCK = /google-analytics\.com|googletagmanager\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|adtrafficquality|fundingchoicesmessages/;
const bad = []; let n = 0;
for (const vp of [{ name: 'desktop', w: 1440, h: 900, mobile: false }, { name: 'mobile', w: 390, h: 844, mobile: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.mobile, hasTouch: vp.mobile, locale: 'ko-KR', timezoneId: 'Asia/Seoul' });
  let blocked = 0;
  await ctx.route(BLOCK, (r) => { blocked += 1; return r.abort(); });
  for (const path of paths) {
    const page = await ctx.newPage();
    const errors = [], warns = [];
    const blockedBefore = blocked;
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); else if (m.type() === 'warning' && /hydrat|mismatch|did not match/i.test(m.text())) warns.push(m.text()); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    let status = 0;
    try { const res = await page.goto(base + path, { waitUntil: 'networkidle', timeout: 45000 }); status = res?.status() ?? 0; } catch (e) { errors.push('goto: ' + e.message.slice(0, 80)); }
    await page.waitForTimeout(600);
    const info = await page.evaluate(() => ({ overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length, footers: document.querySelectorAll('footer').length, headers: document.querySelectorAll('header').length, title: document.title.slice(0, 60) }));
    let skip = blocked - blockedBefore;
    const errs = errors.filter((e) => !/wood-pattern/.test(e)).filter((e) => !(e === 'Failed to load resource: net::ERR_FAILED' && skip-- > 0));
    const ok = status === 200 && errs.length === 0 && warns.length === 0 && info.overflow <= 0 && info.h1 === 1 && info.footers === 1;
    if (!ok) bad.push({ path, vp: vp.name, status, errs: errs.slice(0, 2), warns: warns.slice(0, 1), ...info });
    if (shotsDir && vp.mobile) await page.screenshot({ path: `${shotsDir}/${String(++n).padStart(3, '0')}-${path.replace(/[^a-z0-9]+/gi, '_').slice(1, 50) || 'root'}.jpg`, type: 'jpeg', quality: 70 });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ urls: paths.length, checks: paths.length * 2, bad: bad.length }));
for (const b of bad) console.log(JSON.stringify(b));
