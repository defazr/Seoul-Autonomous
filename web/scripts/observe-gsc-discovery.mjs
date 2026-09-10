#!/usr/bin/env node
/**
 * Stage-1 discovery READ-ONLY 관측 러너.
 *
 *   node scripts/observe-gsc-discovery.mjs --key <service-account.json>
 *
 * 해석·집계 로직은 전부 lib/gsc-discovery-core.mjs 에 있다. 이 파일은
 * 인증 → GSC 조회 → core 호출 → 사람이 읽을 표 출력만 담당한다.
 *
 * 안전 계약
 *   · 발급 scope 는 webmasters.readonly 단독. 쓰기 scope 를 요청하지 않는다.
 *   · 대상 property 는 ALLOWED_SITE 하드코딩. 이 서비스 계정은 다른 5개 속성의
 *     소유자이므로 대상을 잘못 잡으면 남의 사이트를 건드린다.
 *   · sitemaps.submit / urlNotifications(Request Indexing) 를 호출하지 않는다.
 *   · URL Inspection 은 URL 당 정확히 1회. 반복 호출 금지 (관측 계약).
 *   · access token·private key 를 출력하거나 파일로 남기지 않는다.
 *
 * 새 dependency 를 설치하지 않는다. Node 기본 기능(node:crypto, 전역 fetch)만 쓴다.
 */

import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  CONTRACT_FIELDS,
  STAGE1_STOP_PATHS,
  analyze,
  canonicalKey,
  countEscapedFromUnknown,
  crawlVerdict,
  decisionAnchor,
  latestBaseline,
} from './lib/gsc-discovery-core.mjs';

const ALLOWED_SITE = 'https://seoulautonomous.com/';
const READONLY_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
/** 이 값이 포함되면 무조건 BLOCK. Search Console 쓰기(sitemaps.submit 등) scope 다. */
const WRITE_SCOPE = 'https://www.googleapis.com/auth/webmasters';

/**
 * 발급 scope 를 **정확히 webmasters.readonly 하나로** 제한한다.
 * 포함 여부(includes) 검사는 readonly + write 혼합을 통과시키므로 쓰지 않는다.
 * 토큰 발급·네트워크 요청보다 **먼저** 호출한다.
 */
export function assertReadonlyScope(scope) {
  if (typeof scope !== 'string' || scope.trim() === '') {
    throw new Error('BLOCK: scope 가 비어 있다');
  }
  const parts = scope.trim().split(/\s+/);
  if (parts.includes(WRITE_SCOPE)) {
    throw new Error(`BLOCK: 쓰기 scope 가 포함됐다 (${WRITE_SCOPE}) — 관측 러너는 실행하지 않는다`);
  }
  if (parts.length !== 1) {
    throw new Error(`BLOCK: scope 는 정확히 1개여야 한다 (받은 ${parts.length}개: ${parts.join(', ')})`);
  }
  if (parts[0] !== READONLY_SCOPE) {
    throw new Error(`BLOCK: 허용되지 않은 scope — ${READONLY_SCOPE} 단독만 허용된다`);
  }
  return parts[0];
}
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const INSPECT_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

const b64url = (buf) => Buffer.from(buf).toString('base64url');

function buildAssertion(sa, scope) {
  assertReadonlyScope(scope);   // 서명 직전 2차 방어선
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({
    iss: sa.client_email, scope, aud: TOKEN_URL, iat: now, exp: now + 600,
  }));
  const input = `${head}.${claims}`;
  const signer = createSign('RSA-SHA256');
  signer.update(input);
  return `${input}.${signer.sign(sa.private_key, 'base64url')}`;
}

async function getToken(sa, fetchImpl) {
  assertReadonlyScope(READONLY_SCOPE);   // 네트워크 요청 이전 1차 방어선
  const res = await fetchImpl(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: buildAssertion(sa, READONLY_SCOPE),
    }),
  });
  if (!res.ok) throw new Error(`토큰 발급 실패: HTTP ${res.status}`); // 본문은 찍지 않는다
  return (await res.json()).access_token;
}

async function getSitemaps(token, fetchImpl) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(ALLOWED_SITE)}/sitemaps`;
  const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`sitemap 조회 실패: HTTP ${res.status}`);
  return (await res.json()).sitemap ?? [];
}

/** URL 당 정확히 1회. 원시 응답은 반환만 하고 저장하지 않는다. */
async function inspectOnce(token, inspectionUrl, fetchImpl) {
  const res = await fetchImpl(INSPECT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ inspectionUrl, siteUrl: ALLOWED_SITE }),
  });
  if (!res.ok) throw new Error(`URL Inspection 실패: HTTP ${res.status} ${inspectionUrl}`);
  const body = await res.json();
  return body?.inspectionResult?.indexStatusResult ?? {};
}

export async function observe({ sa, fetchImpl = fetch, paths = STAGE1_STOP_PATHS, sleepMs = 400 }) {
  assertReadonlyScope(READONLY_SCOPE);   // 어떤 호출보다 먼저
  const token = await getToken(sa, fetchImpl);
  const sitemaps = await getSitemaps(token, fetchImpl);

  const observations = [];
  for (const path of paths) {
    const url = new URL(path, ALLOWED_SITE).toString();
    observations.push({ url, result: await inspectOnce(token, url, fetchImpl) });
    if (sleepMs) await new Promise((r) => setTimeout(r, sleepMs));
  }
  return { sitemaps, observations };
}

function report(baseline, anchor, { sitemaps, observations }) {
  const anchorUnknown = Object.values(anchor.states).filter((v) => v === 'UNKNOWN').length;
  console.log('=== 0. 비교 축 (두 개를 섞지 않는다) ===');
  console.log(`comparison baseline   ${baseline.at}  (${baseline.label})   ← 직전 상태 비교용`);
  console.log(`decision anchor       ${anchor.at}  (${anchor.label})   ← 판정 기준점`);
  console.log(`                      anchor 상태 = ${anchorUnknown}/${Object.keys(anchor.states).length} UNKNOWN (발견 0)`);

  console.log('\n=== 1. SITEMAP ===');
  for (const s of sitemaps) {
    console.log(`lastSubmitted   ${s.lastSubmitted ?? '미제공'}`);
    console.log(`lastDownloaded  ${s.lastDownloaded ?? '미제공'}`);
    console.log(`errors/warnings ${s.errors ?? '-'} / ${s.warnings ?? '-'}`);
    for (const c of s.contents ?? []) {
      console.log(`contents        ${c.type} submitted=${c.submitted} indexed=${c.indexed ?? '-'}`);
    }
  }

  const r = analyze(baseline.states, observations);
  const vsAnchor = analyze(anchor.states, observations);
  console.log(`\n=== 2. URL INSPECTION (${r.total} URL · 각 1회) — comparison baseline ${baseline.at} ===`);
  for (const row of r.rows) {
    // 계약 필드 3종은 값 유무와 무관하게 항상 찍는다.
    const cells = CONTRACT_FIELDS.map((f) => `${f}=${row.fields[f].shown}`).join(' · ');
    console.log(`${row.key}\n    ${cells}\n    ${row.delta === 'SAME' ? 'SAME' : `변동 ${row.delta}`}`);
  }

  const cv = crawlVerdict(r);
  console.log('\n=== 3. Decision 입력 ===');
  console.log(`제1  lastCrawlTime 발생 ${cv.count} / ${r.total}  →  ${cv.verdict}`);
  console.log(`제2  coverageState snapshot ${JSON.stringify(r.stateCounts)}  (개별 URL 추세 판정 금지)`);
  console.log(`     ↳ decision anchor(T0) 대비: anchor 의 UNKNOWN 에서 벗어난 URL `
    + `${countEscapedFromUnknown(vsAnchor)} / ${vsAnchor.total}   ← 전체 판정은 이 축으로 읽는다`);
  console.log(`제3  verdict 미수집 ${r.verdictMissingCount} / ${r.total}`);
  console.log(`     delta ${JSON.stringify(r.deltaCounts)}`);
  console.log(`     UNKNOWN→Discovered ${r.toDiscovered.length} · Discovered→UNKNOWN ${r.toUnknown.length}`
    + ` · 동일 ${r.sameUnknown.length + r.sameDiscovered.length}`);
  console.log('\n※ coverageState 변화는 시점 간 보고값 비교다. Google 내부 상태의 실제 진전·후퇴로 읽지 않는다.');
  console.log('※ 직전 회차 총계와의 차이(예: 10/4 → 9/5)를 선형 진전·후퇴로 판정하지 않는다.');
  console.log('※ 전체 discovery 판정의 비교 대상은 직전 회차가 아니라 decision anchor(T0) 다.');
  return r;
}

async function main() {
  const keyIdx = process.argv.indexOf('--key');
  if (keyIdx === -1 || !process.argv[keyIdx + 1]) {
    console.error('사용법: node scripts/observe-gsc-discovery.mjs --key <service-account.json>');
    process.exit(2);
  }
  const sa = JSON.parse(readFileSync(process.argv[keyIdx + 1], 'utf8'));
  const baseline = latestBaseline();
  const anchor = decisionAnchor();
  const raw = await observe({ sa });
  const r = report(baseline, anchor, raw);
  console.log(`\n관측 URL ${r.total} / 기대 ${STAGE1_STOP_PATHS.length}`);
  process.exit(r.total === STAGE1_STOP_PATHS.length ? 0 : 1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(`BLOCK: ${e.message}`); process.exit(1); });
}

export { ALLOWED_SITE, READONLY_SCOPE, WRITE_SCOPE, canonicalKey, report };
