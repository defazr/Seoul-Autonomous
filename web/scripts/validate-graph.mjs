#!/usr/bin/env node
/**
 * Phase 1A — Graph Core 결정론 검증기.
 *
 *   node scripts/validate-graph.mjs
 *
 * 네트워크를 사용하지 않는다. 파생·계산 로직은 web/lib/graph/graph-core.mjs 에만 있고
 * 이 파일은 SSOT 읽기 → core 호출 → Phase 0 QA 매트릭스 대조 → 사람이 읽을 표 출력 →
 * exit code 판정만 담당한다 (로직 중복 구현 금지 계약).
 *
 * 하드코딩 금지 계약: 기대표(EXPECTED)는 여기 상수로 두되, 실제값(actual)은 전부
 * graph-core 가 SSOT 입력에서 계산한 결과다. core 는 기대 수치를 알지 못한다.
 *
 * 기대표 정본: docs/worklogs/PHASE0-CTG-STRUCTURE-AUDIT-20260825.md §K
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DIRECTION,
  GraphInputError,
  ROUTE_SHAPE,
  buildGraph,
  findMultiRouteStops,
  findSameNamePairs,
  findWithinRouteDuplicates,
} from '../lib/graph/graph-core.mjs';

const WEB_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROUTES_PATH = join(WEB_ROOT, 'data/routes.json');
const STOP_NAMES_PATH = join(WEB_ROOT, 'data/stops/stop-names.json');

/** Phase 0 정답 매트릭스 (기대값 — 계산 경로와 분리) */
const EXPECTED = {
  routes: 11,
  uniqueStops: 267,
  stopVisits: 307,
  multiRouteStops: 33,
  multiExactly2Routes: 28,
  multiExactly3Routes: 5,
  sameNamePairs: 90,
  sameRoutePairs: 90,
  stopIdNull: 0,
  stopIdNameConflicts: 0,
  officialEn: 261,
  fallbackEn: 6,
  routesWithExactlyOneTurnaround: 11,
  duplicateAffectedRoutes: 2,
  duplicateStopIds: '02247,13156',
  shapeRoundTrip: 9,
  shapeLoop: 2,
  loopDirectionMisclassified: 0,
  membershipInflation: 0,
  chainIntegrityViolations: 0,
  namesWithThreePlusStopIds: 0,
};

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

/**
 * prev/next 참조 체인이 원본 순서를 정확히 재구성하는지 양방향으로 검사.
 * next 방향 순회 + 모든 visit 의 prev 역참조를 함께 판정한다. 위반 노선 수 반환 (기대 0).
 */
function countChainViolations(graph) {
  let violations = 0;
  for (const route of graph.routes) {
    const walked = [];
    let cursor = route.visits[0];
    while (cursor !== null && walked.length <= route.visits.length) {
      walked.push(cursor);
      cursor = cursor.next;
    }
    const sameLength = walked.length === route.visits.length;
    const sameOrder =
      sameLength && walked.every((visit, i) => visit === route.visits[i]);
    const firstPrevNull = route.visits[0].prev === null;
    const lastNextNull = route.visits[route.visits.length - 1].next === null;
    // 중간 visit 의 prev 가 틀려도 next 순회만으로는 안 잡힌다 — 전 visit 의 역참조를 검사한다.
    const prevLinksOk = route.visits.every(
      (visit, i) => visit.prev === (i > 0 ? route.visits[i - 1] : null),
    );
    if (!sameLength || !sameOrder || !firstPrevNull || !lastNextNull || !prevLinksOk) {
      violations += 1;
    }
  }
  return violations;
}

function main() {
  const routesJson = readJson(ROUTES_PATH);
  const stopNameRecords = readJson(STOP_NAMES_PATH);
  // 공식 영문명 lookup — 정본 그대로 전달. 새 영문명을 만들지 않는다 (C2E 계약).
  const officialEnByStopId = new Map(
    stopNameRecords.map((record) => [record.stopId, record.nameEnOfficial ?? null]),
  );

  const graph = buildGraph(routesJson, officialEnByStopId);

  const stops = [...graph.stopsById.values()];
  const multiRouteStops = findMultiRouteStops(graph);
  const { pairs, namesWithThreePlusStopIds } = findSameNamePairs(graph);
  const duplicates = findWithinRouteDuplicates(graph);
  const loopRoutes = graph.routes.filter((route) => route.shape === ROUTE_SHAPE.LOOP);

  const actual = {
    routes: graph.routes.length,
    uniqueStops: graph.stopsById.size,
    stopVisits: graph.visits.length,
    multiRouteStops: multiRouteStops.length,
    multiExactly2Routes: multiRouteStops.filter((stop) => stop.routeIds.size === 2).length,
    multiExactly3Routes: multiRouteStops.filter((stop) => stop.routeIds.size === 3).length,
    sameNamePairs: pairs.length,
    sameRoutePairs: pairs.filter((pair) => pair.sameRoute).length,
    stopIdNull: graph.visits.filter((visit) => !visit.stopId).length,
    stopIdNameConflicts: stops.filter((stop) => stop.nameKoConflicts.length > 0).length,
    officialEn: stops.filter((stop) => stop.nameEn !== null).length,
    fallbackEn: stops.filter((stop) => stop.nameEn === null).length,
    routesWithExactlyOneTurnaround: graph.routes.filter(
      (route) => route.visits.filter((visit) => visit.isTurnaround).length === 1,
    ).length,
    duplicateAffectedRoutes: new Set(duplicates.map((dup) => dup.routeId)).size,
    duplicateStopIds: duplicates.map((dup) => dup.stopId).sort().join(','),
    shapeRoundTrip: graph.routes.filter((route) => route.shape === ROUTE_SHAPE.ROUND_TRIP).length,
    shapeLoop: loopRoutes.length,
    loopDirectionMisclassified: loopRoutes
      .flatMap((route) => route.visits)
      .filter((visit) => visit.direction !== DIRECTION.LOOP).length,
    membershipInflation: stops.filter(
      (stop) => stop.routeIds.size !== new Set(stop.visits.map((visit) => visit.routeId)).size,
    ).length,
    chainIntegrityViolations: countChainViolations(graph),
    namesWithThreePlusStopIds: namesWithThreePlusStopIds.length,
  };

  console.log('=== Phase 1A Graph validation (SSOT: web/data/routes.json) ===\n');
  console.log(
    `  ${'metric'.padEnd(32)} ${'expected'.padStart(14)} ${'actual'.padStart(14)}   verdict`,
  );
  let failures = 0;
  for (const [metric, expectedValue] of Object.entries(EXPECTED)) {
    const actualValue = actual[metric];
    const pass = actualValue === expectedValue;
    if (!pass) failures += 1;
    console.log(
      `  ${metric.padEnd(32)} ${String(expectedValue).padStart(14)} ${String(actualValue).padStart(14)}   ${pass ? 'PASS' : 'FAIL'}`,
    );
  }

  console.log('\n--- within-route duplicate occurrences (순환 폐합 실증) ---');
  for (const dup of duplicates) {
    for (const visit of dup.visits) {
      const prevLabel = visit.prev ? `${visit.prev.stopId} ${visit.prev.nameKo}` : '(기점)';
      const nextLabel = visit.next ? `${visit.next.stopId} ${visit.next.nameKo}` : '(종점)';
      console.log(
        `  ${dup.routeId} ${dup.stopId} seq=${String(visit.seq).padStart(2)} dir=${visit.direction}  prev=${prevLabel}  next=${nextLabel}`,
      );
    }
    const membership = [...graph.stopsById.get(dup.stopId).routeIds].sort().join(',');
    console.log(`    → Stop ${dup.stopId} routeIds = {${membership}} (occurrence dedup)`);
  }

  console.log('\n--- routeShape / direction ---');
  for (const route of graph.routes) {
    const directions = new Set(route.visits.map((visit) => visit.direction));
    console.log(
      `  ${route.routeId.padEnd(16)} shape=${route.shape.padEnd(9)} turnaroundSeq=${String(route.turnaroundSeq).padStart(2)} visits=${String(route.visits.length).padStart(3)} directions={${[...directions].join(',')}}`,
    );
  }

  console.log(
    `\n--- official EN join --- official=${actual.officialEn} fallback(nameKo)=${actual.fallbackEn} (SSOT: data/stops/stop-names.json)`,
  );

  if (failures > 0) {
    console.log(`\nPhase 1A Graph validation FAIL — ${failures} metric(s) mismatched`);
    process.exitCode = 1;
    return;
  }
  console.log('\nPhase 1A Graph validation PASS');
}

try {
  main();
} catch (error) {
  if (error instanceof GraphInputError) {
    console.error(`\n[구조 게이트 위반] ${error.message}`);
  } else {
    console.error('\n[검증기 실패]', error);
  }
  process.exitCode = 1;
}
