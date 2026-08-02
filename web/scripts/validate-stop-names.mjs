#!/usr/bin/env node
/**
 * Round 26-C1E.1 — 영문 정류장명 SSOT 검증기.
 *
 *   node scripts/validate-stop-names.mjs [--dir <path>]
 *
 * 네트워크를 사용하지 않는다. 검증 로직은 scripts/lib/stop-names-core.mjs 에만 있고
 * 수집기가 쓰기 전에 호출하는 것과 동일한 함수를 재사용한다.
 *
 * 통계 단위 혼용 금지:
 *   - 정류장 레코드 수(307)      : routes.json 의 stop 항목 총합
 *   - 고유 stopId 수(267)        : SSOT 레코드 수와 1:1
 *   - 고유 현재 한국어명 수(177) : 표시명 기준. 상태별 집계에 사용하지 않는다.
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRouteStops, summarize, validateArtifacts } from './lib/stop-names-core.mjs';

const WEB_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const dirIdx = argv.indexOf('--dir');
const OUT_DIR = dirIdx >= 0 ? argv[dirIdx + 1] : join(WEB_ROOT, 'data/stops');

const ROUTES_PATH = join(WEB_ROOT, 'data/routes.json');
const paths = {
  names: join(OUT_DIR, 'stop-names.json'),
  meta: join(OUT_DIR, 'stop-names.meta.json'),
  reviews: join(OUT_DIR, 'stop-name-reviews.json'),
};

for (const [key, p] of Object.entries({ routes: ROUTES_PATH, ...paths })) {
  if (!existsSync(p)) {
    console.error(`[FAIL] 파일 없음 (${key}): ${p}`);
    process.exit(1);
  }
}

const routesData = JSON.parse(readFileSync(ROUTES_PATH, 'utf8'));
const rawNames = readFileSync(paths.names, 'utf8');
const rawReviews = readFileSync(paths.reviews, 'utf8');
const records = JSON.parse(rawNames);
const reviews = JSON.parse(rawReviews);
const meta = JSON.parse(readFileSync(paths.meta, 'utf8'));

const { rows, uniqueStopIds, uniqueKoNames } = readRouteStops(routesData);
// 파일 바이트 해시까지 검사한다 (26-C1E.3 P2-①).
const errors = validateArtifacts({
  routesData,
  records,
  reviews,
  meta,
  rawTexts: { names: rawNames, reviews: rawReviews },
});

console.log('=== 단위별 통계 (혼용 금지) ===');
console.log(`  정류장 레코드      : ${rows.length}`);
console.log(`  고유 stopId        : ${uniqueStopIds.length}   ← SSOT 레코드와 1:1`);
console.log(`  고유 현재 한국어명 : ${uniqueKoNames.size}`);

console.log('\n=== stopId 기준 상태별 ===');
const byStatus = summarize(records);
for (const [k, v] of Object.entries(byStatus).sort()) console.log(`  ${k.padEnd(18)} ${v}`);

const matchedCount = records.filter((r) => r.matchStatus !== 'unmatched').length;
console.log(`\n  API matched ${matchedCount} / unmatched ${byStatus.unmatched ?? 0} / 검토 로그 ${reviews.length}건`);
console.log(`  generationId ${meta.generationId} / stopNames ${meta.artifacts?.stopNamesSha256?.slice(0, 12)}… / reviews ${meta.artifacts?.reviewsSha256?.slice(0, 12)}…`);

if (errors.length > 0) {
  console.error(`\n[FAIL] 검증 오류 ${errors.length}건`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\n[PASS] 모든 검증 통과');
