/**
 * Round 26-C1E.1 — 수집기·검증기 공용 순수 로직.
 *
 * 수집기와 검증기가 같은 불변조건을 두 번 구현하지 않도록 여기에서만 정의한다.
 * 이 모듈은 네트워크·파일시스템에 접근하지 않는다.
 */

import { createHash } from 'node:crypto';

/** 허용되는 상태 값. 이 집합 밖의 값은 즉시 실패다. */
export const MATCH_STATUSES = Object.freeze([
  'exact',
  'reviewed',
  'official_variant',
  'conflict_hold',
  'unmatched',
]);

export const REVIEW_TYPES = Object.freeze([
  'ko_name_difference',
  'official_variant',
  'semantic_conflict',
  'oa12830_unmatched',
]);

export const REVIEW_DECISIONS = Object.freeze(['adopt_en', 'hold', 'pending_alternative_source']);

/**
 * 명시적 상태 override 정책 (26-C1E.1 §9).
 * 자동 판정보다 먼저 적용되며, 다른 레코드의 판정 결과에 의존하지 않는다.
 */
export const OVERRIDES = Object.freeze({
  /** 공식 영문명이 의미상 충돌해 자동 채택을 보류한 stopId */
  conflictHold: Object.freeze(['20169']),
  /** 같은 한국어명의 반대 방향 정류장과 공식 영문 표기 형식이 다른, 승인된 stopId */
  officialVariant: Object.freeze(['01023', '01037', '09004', '09013', '20170']),
});

/**
 * 리뷰 의미 정책 (26-C1E.3 P1-①).
 * 리뷰 파일만으로 리뷰를 검증하면 위조를 잡을 수 없으므로, 신뢰 기준을 코드에 고정한다.
 */
export const REVIEW_POLICY = Object.freeze({
  /** 상태별로 허용되는 decision. exact 는 리뷰 자체가 금지다. */
  allowedDecisionByStatus: Object.freeze({
    exact: Object.freeze([]),
    reviewed: Object.freeze(['adopt_en']),
    official_variant: Object.freeze(['adopt_en']),
    conflict_hold: Object.freeze(['hold']),
    unmatched: Object.freeze(['pending_alternative_source']),
  }),
  /** conflict_hold 의 승인된 공식 원문. 리뷰가 이와 다르면 위조로 판정한다. */
  conflictHoldOfficialEn: Object.freeze({
    '20169': 'Soongsil University Dept. of Chinese Language & Literature',
  }),
});

/** 승인된 기준 수치 (26-C1E.1 §5). --write 는 이 기준과 다르면 정본을 쓰지 않는다. */
export const BASELINE = Object.freeze({
  requestedStopIds: 267,
  stopRecords: 307,
  uniqueCurrentKoNames: 177,
  apiMatched: 262,
  apiUnmatched: 5,
  unmatchedStopIds: Object.freeze(['02247', '06510', '13243', '13257', '14628']),
});

/**
 * 미매칭 정류장의 대체 공식 출처 조사 결과 (26-C1E).
 * 재수집해도 이 검토 내용이 유실되지 않도록 코드에 보존한다.
 * 값은 정본(nameEnOfficial)에 넣지 않는다. 검토 로그 전용이다.
 */
export const UNMATCHED_ANNOTATIONS = Object.freeze({
  '02247': {
    alternativeOfficialEn: 'Cheonggye Plaza',
    alternativeSource: 'english.seoul.go.kr',
    note: "Official Seoul English site (english.seoul.go.kr, Cheonggye A01 shuttle articles) refers to this location as 'Cheonggye Plaza'. Not yet adopted into the SSOT: it is a place name in an article, not a bus-stop name record.",
  },
  '06510': {
    alternativeOfficialEn: 'Kyung Hee Univ. Medical Center',
    alternativeSource: 'english.seoul.go.kr',
    note: "Official Seoul English source (english.seoul.go.kr, Dongdaemun/Seodaemun self-driving bus article and Seoul City channel) uses 'Kyung Hee Univ. Medical Center' as the route endpoint. Not adopted: endpoint label, not a verified stop-name record.",
  },
  '13243': {
    alternativeOfficialEn: null,
    alternativeSource: null,
    note: 'No official Seoul English bus-stop name found. Apartment-complex stop (DMC Park View Xi). Requires human-reviewed romanization or Korean fallback in 26-C2E.',
  },
  '13257': {
    alternativeOfficialEn: 'Gajwa Station',
    alternativeSource: 'english.seoul.go.kr',
    note: "Official Seoul English source describes the Seodaemun route endpoint as 'Gajwa Station'. Our stop is 'Gajwa Station Exit 3'; the exit number is not confirmed in the English source. Not adopted.",
  },
  '14628': {
    alternativeOfficialEn: null,
    alternativeSource: null,
    note: 'No official Seoul English bus-stop name found. The stop is named after private facilities (YTN Newsquare, CJ ENM). Requires human-reviewed romanization or Korean fallback in 26-C2E.',
  },
});

const REVIEW_NOTES = Object.freeze({
  official_variant:
    'Official English label differs in formatting from the opposite-direction stop with the same Korean name. Original text preserved; no normalization in 26-C1E.',
  ko_name_difference:
    'Official Korean name differs from the current nameKo. English name adopted; nameKo left unchanged in 26-C1E.',
  semantic_conflict:
    'Same official Korean stop name as the opposite-direction stop but a semantically different official English label. Not adopted automatically.',
  unmatchedPrefix:
    'Not returned by OA-12830 (dataset covers only stops with reviewed multilingual names).',
});

export function toOfficialId(stopId) {
  return `${stopId.slice(0, 2)}-${stopId.slice(2)}`;
}

/**
 * 응답 배열에서 요청한 공식 ID와 정확히 일치하는 행만 선택한다 (26-C1E.1 §7).
 * 첫 행을 무조건 신뢰하지 않는다.
 * @returns {{kind:'ok'|'no_row'|'permanent', row?:object, ignoredRows?:number, reason?:string}}
 */
export function selectExactRow(rows, officialId) {
  if (rows == null) return { kind: 'no_row', reason: 'no_rows' };
  if (!Array.isArray(rows)) return { kind: 'permanent', reason: 'schema:row_not_array' };
  const exact = rows.filter((r) => r && r.STATION_ID === officialId);
  if (exact.length === 0) return { kind: 'no_row', reason: 'no_exact_id_match' };
  if (exact.length > 1) return { kind: 'permanent', reason: `duplicate_rows:${exact.length}` };
  const row = exact[0];
  const nameKo = String(row.STATION_NM ?? '').trim();
  const nameEn = String(row.STATION_NM_EN ?? '').trim();
  if (!nameKo) return { kind: 'permanent', reason: 'empty_official_ko' };
  if (!nameEn) return { kind: 'permanent', reason: 'empty_official_en' };
  return { kind: 'ok', row: { ok: true, nameKo, nameEn }, ignoredRows: rows.length - exact.length };
}

export function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/** 매핑 내용에서 결정적으로 생성한다. 수집 시각과 무관하다. */
export function computeGenerationId(records, reviews) {
  return sha256(stableStringify(records) + stableStringify(reviews)).slice(0, 16);
}

/**
 * routes.json 의 stop 레코드를 평탄화한다.
 * @returns {{rows: Array, uniqueStopIds: string[], koByStopId: Map<string,string>, uniqueKoNames: Set<string>}}
 */
export function readRouteStops(routesData) {
  const rows = [];
  for (const route of routesData.fixedRoutes) {
    for (const stop of route.stops ?? []) {
      rows.push({ routeId: route.id, seq: stop.seq, nameKo: stop.nameKo, stopId: String(stop.stopId ?? '') });
    }
  }
  const koByStopId = new Map();
  const conflicts = [];
  for (const row of rows) {
    const seen = koByStopId.get(row.stopId);
    if (seen && seen !== row.nameKo) conflicts.push(`${row.stopId}: '${seen}' / '${row.nameKo}'`);
    koByStopId.set(row.stopId, row.nameKo);
  }
  return {
    rows,
    uniqueStopIds: [...new Set(rows.map((r) => r.stopId))].sort((a, b) => a.localeCompare(b)),
    koByStopId,
    uniqueKoNames: new Set(rows.map((r) => r.nameKo)),
    koConflicts: conflicts,
  };
}

/**
 * 상태를 결정한다. override 정책을 먼저 적용하므로 다른 레코드의 판정 결과나
 * 배열 순서에 의존하지 않는다.
 */
export function decideStatus({ stopId, currentNameKo, response }) {
  const isConflictHold = OVERRIDES.conflictHold.includes(stopId);
  if (!response?.ok) {
    if (isConflictHold) {
      return { error: `${stopId}: conflict_hold 대상인데 공식 응답이 없습니다.` };
    }
    return { status: 'unmatched' };
  }
  if (isConflictHold) return { status: 'conflict_hold' };
  if (OVERRIDES.officialVariant.includes(stopId)) return { status: 'official_variant' };
  return { status: response.nameKo === currentNameKo ? 'exact' : 'reviewed' };
}

/**
 * 응답 맵에서 정본 후보(records/reviews)를 메모리에 생성한다. 파일을 쓰지 않는다.
 * @param {{uniqueStopIds: string[], koByStopId: Map<string,string>, responses: Map<string, object>}} input
 */
export function buildArtifacts({ uniqueStopIds, koByStopId, responses }) {
  const records = [];
  const reviews = [];
  const errors = [];

  for (const stopId of uniqueStopIds) {
    const officialId = toOfficialId(stopId);
    const currentNameKo = koByStopId.get(stopId);
    const response = responses.get(stopId);
    const decided = decideStatus({ stopId, currentNameKo, response });
    if (decided.error) {
      errors.push(decided.error);
      continue;
    }
    const status = decided.status;

    if (status === 'unmatched') {
      const ann = UNMATCHED_ANNOTATIONS[stopId];
      records.push({
        stopId,
        officialId,
        nameKoOfficial: null,
        nameEnOfficial: null,
        matchStatus: 'unmatched',
        source: 'OA-12830',
      });
      reviews.push({
        stopId,
        currentNameKo,
        officialNameKo: null,
        officialNameEn: null,
        reviewType: 'oa12830_unmatched',
        decision: 'pending_alternative_source',
        note: ann ? `${REVIEW_NOTES.unmatchedPrefix} ${ann.note}` : REVIEW_NOTES.unmatchedPrefix,
        ...(ann
          ? { alternativeOfficialEn: ann.alternativeOfficialEn, alternativeSource: ann.alternativeSource }
          : {}),
      });
      continue;
    }

    // 여기부터는 공식 응답이 있는 경우다. 빈 값은 실패로 처리한다.
    if (!response.nameKo) errors.push(`${stopId}: 공식 한국어명이 비어 있습니다.`);
    if (!response.nameEn) errors.push(`${stopId}: 공식 영문명이 비어 있습니다.`);

    if (status === 'conflict_hold') {
      records.push({
        stopId,
        officialId,
        nameKoOfficial: response.nameKo,
        nameEnOfficial: null,
        matchStatus: 'conflict_hold',
        source: 'OA-12830',
      });
      reviews.push({
        stopId,
        currentNameKo,
        officialNameKo: response.nameKo,
        officialNameEn: response.nameEn,
        reviewType: 'semantic_conflict',
        decision: 'hold',
        note: REVIEW_NOTES.semantic_conflict,
      });
      continue;
    }

    records.push({
      stopId,
      officialId,
      nameKoOfficial: response.nameKo,
      nameEnOfficial: response.nameEn,
      matchStatus: status,
      source: 'OA-12830',
    });

    if (status !== 'exact') {
      const reviewType = status === 'official_variant' ? 'official_variant' : 'ko_name_difference';
      reviews.push({
        stopId,
        currentNameKo,
        officialNameKo: response.nameKo,
        officialNameEn: response.nameEn,
        reviewType,
        decision: 'adopt_en',
        note: REVIEW_NOTES[reviewType],
      });
    }
  }

  records.sort((a, b) => a.stopId.localeCompare(b.stopId));
  reviews.sort((a, b) => a.stopId.localeCompare(b.stopId));
  return { records, reviews, errors };
}

export function buildMeta({ records, reviews, collectedAt, apiMatched, apiUnmatched, requestedStopIds }) {
  // 파일에 실제로 기록되는 바이트와 의미(정규화) 해시를 구분해 저장한다 (26-C1E.3 P2-①).
  const namesText = stableStringify(records);
  const reviewsText = stableStringify(reviews);
  return {
    dataset: 'OA-12830',
    datasetName: '서울시 버스 정류소 노선도 다국어 목록 정보',
    api: 'ListBusStationMultilangInfo',
    provider: 'Seoul Metropolitan Government',
    datasetUrl: 'https://data.seoul.go.kr/dataList/OA-12830/A/1/datasetView.do',
    sourceUpdatedAt: '2025-03-14',
    license: 'KOGL Type 1',
    licenseNote: '공공누리 제1유형: 출처표시 (상업적 이용 및 변경 가능)',
    extractionNote:
      'Only the stop IDs used by this site (267 unique) were extracted from the dataset; official English names are stored verbatim without normalization.',
    totalInDataset: 6652,
    requestedStopIds,
    apiMatched,
    apiUnmatched,
    generationId: computeGenerationId(records, reviews),
    artifacts: {
      /** 파일에 기록된 바이트의 SHA-256 */
      stopNamesSha256: sha256(namesText),
      reviewsSha256: sha256(reviewsText),
      /** 파싱 후 재직렬화한 의미 SHA-256 (공백·키 순서 변화에 둔감) */
      stopNamesCanonicalSha256: sha256(namesText),
      reviewsCanonicalSha256: sha256(reviewsText),
    },
    collectedAt,
  };
}

/**
 * 세 산출물 전체의 불변조건을 검사한다. 수집기(쓰기 전)와 검증기가 공유한다.
 * @returns {string[]} 오류 목록. 빈 배열이면 통과.
 */
export function validateArtifacts({ routesData, records, reviews, meta, rawTexts }) {
  const errors = [];
  const fail = (condition, message) => {
    if (!condition) errors.push(message);
  };

  const { rows, uniqueStopIds, koByStopId, uniqueKoNames, koConflicts } = readRouteStops(routesData);

  // ── routes.json 기준 ──
  fail(rows.length === BASELINE.stopRecords, `정류장 레코드 ${rows.length} ≠ ${BASELINE.stopRecords}`);
  fail(uniqueStopIds.length === BASELINE.requestedStopIds, `고유 stopId ${uniqueStopIds.length} ≠ ${BASELINE.requestedStopIds}`);
  fail(uniqueKoNames.size === BASELINE.uniqueCurrentKoNames, `고유 현재 한국어명 ${uniqueKoNames.size} ≠ ${BASELINE.uniqueCurrentKoNames}`);
  fail(rows.every((r) => r.stopId && r.stopId.trim() !== ''), 'null/빈 stopId 존재');
  fail(rows.every((r) => /^\d{5}$/.test(r.stopId)), 'stopId 형식 오류(5자리 숫자 아님) 존재');
  for (const c of koConflicts) errors.push(`동일 stopId 에 다른 현재 한국어명: ${c}`);

  // ── SSOT 스키마 ──
  fail(Array.isArray(records), 'records 가 배열이 아님');
  const allowedRecordKeys = ['stopId', 'officialId', 'nameKoOfficial', 'nameEnOfficial', 'matchStatus', 'source'];
  for (const r of records ?? []) {
    const keys = Object.keys(r).sort();
    fail(
      keys.length === allowedRecordKeys.length && keys.every((k) => allowedRecordKeys.includes(k)),
      `${r.stopId ?? '?'}: 레코드 필드 구성이 다름 (${keys.join(',')})`,
    );
    fail(typeof r.stopId === 'string' && /^\d{5}$/.test(r.stopId), `잘못된 stopId: ${r.stopId}`);
    fail(r.officialId === toOfficialId(String(r.stopId)), `officialId 변환 오류: ${r.stopId} → ${r.officialId}`);
    fail(r.source === 'OA-12830', `${r.stopId}: source 값 오류`);
    fail(MATCH_STATUSES.includes(r.matchStatus), `${r.stopId}: 허용되지 않은 matchStatus '${r.matchStatus}'`);
    fail(
      r.nameKoOfficial === null || typeof r.nameKoOfficial === 'string',
      `${r.stopId}: nameKoOfficial 타입 오류`,
    );
    fail(
      r.nameEnOfficial === null || typeof r.nameEnOfficial === 'string',
      `${r.stopId}: nameEnOfficial 타입 오류`,
    );
  }

  const ssotIds = (records ?? []).map((r) => r.stopId);
  fail(ssotIds.length === BASELINE.requestedStopIds, `SSOT 레코드 ${ssotIds.length} ≠ ${BASELINE.requestedStopIds}`);
  fail(new Set(ssotIds).size === ssotIds.length, 'SSOT 에 중복 stopId 존재');
  const sortedIds = [...ssotIds].sort((a, b) => a.localeCompare(b));
  fail(ssotIds.every((id, i) => id === sortedIds[i]), 'SSOT 가 stopId 오름차순이 아님');

  const ssotSet = new Set(ssotIds);
  const missing = uniqueStopIds.filter((id) => !ssotSet.has(id));
  const extra = ssotIds.filter((id) => !uniqueStopIds.includes(id));
  fail(missing.length === 0, `routes 에 있으나 SSOT 에 없는 stopId: ${missing.join(', ')}`);
  fail(extra.length === 0, `SSOT 에만 있는 불필요한 stopId: ${extra.join(', ')}`);

  // ── 상태와 값 조합 ──
  const reviewsById = new Map();
  for (const rv of reviews ?? []) {
    if (reviewsById.has(rv.stopId)) errors.push(`검토 로그 중복: ${rv.stopId}`);
    reviewsById.set(rv.stopId, rv);
  }

  for (const r of records ?? []) {
    const hasReview = reviewsById.has(r.stopId);
    const matchedStatuses = ['exact', 'reviewed', 'official_variant'];
    if (matchedStatuses.includes(r.matchStatus)) {
      fail(!!r.nameKoOfficial, `${r.stopId}: ${r.matchStatus} 인데 공식 한국어명 누락`);
      fail(!!r.nameEnOfficial, `${r.stopId}: ${r.matchStatus} 인데 공식 영문명 누락`);
    }
    if (r.matchStatus === 'exact') {
      fail(r.nameKoOfficial === koByStopId.get(r.stopId), `${r.stopId}: exact 인데 한국어명 불일치`);
      fail(!hasReview, `${r.stopId}: exact 인데 불필요한 검토 로그 존재`);
    }
    if (r.matchStatus === 'reviewed') {
      fail(r.nameKoOfficial !== koByStopId.get(r.stopId), `${r.stopId}: reviewed 인데 한국어명이 동일`);
      fail(hasReview, `${r.stopId}: reviewed 인데 검토 로그 누락`);
    }
    if (r.matchStatus === 'official_variant') {
      fail(OVERRIDES.officialVariant.includes(r.stopId), `${r.stopId}: 승인되지 않은 official_variant`);
      fail(hasReview, `${r.stopId}: official_variant 인데 검토 로그 누락`);
    }
    if (r.matchStatus === 'conflict_hold') {
      fail(OVERRIDES.conflictHold.includes(r.stopId), `${r.stopId}: 승인되지 않은 conflict_hold`);
      fail(r.nameEnOfficial === null, `${r.stopId}: conflict_hold 인데 nameEnOfficial 이 null 이 아님`);
      fail(!!r.nameKoOfficial, `${r.stopId}: conflict_hold 인데 공식 한국어명 누락`);
      fail(hasReview, `${r.stopId}: conflict_hold 인데 검토 로그 누락`);
    }
    if (r.matchStatus === 'unmatched') {
      fail(r.nameEnOfficial === null, `${r.stopId}: unmatched 인데 nameEnOfficial 이 null 이 아님`);
      fail(r.nameKoOfficial === null, `${r.stopId}: unmatched 인데 nameKoOfficial 이 null 이 아님`);
      fail(hasReview, `${r.stopId}: unmatched 인데 검토 로그 누락`);
    }
  }

  // ── 검토 로그 자체 (26-C1E.3 P1-①: 상태 ↔ reviewType ↔ decision ↔ 공식 원문 ↔ 대체명 전수 계약) ──
  const recordById = new Map((records ?? []).map((r) => [r.stopId, r]));
  for (const rv of reviews ?? []) {
    fail(ssotSet.has(rv.stopId), `SSOT 에 없는 고아 검토 로그: ${rv.stopId}`);
    fail(REVIEW_TYPES.includes(rv.reviewType), `${rv.stopId}: 허용되지 않은 reviewType '${rv.reviewType}'`);
    fail(REVIEW_DECISIONS.includes(rv.decision), `${rv.stopId}: 허용되지 않은 decision '${rv.decision}'`);
    fail(typeof rv.note === 'string' && rv.note.length > 0, `${rv.stopId}: note 누락`);
    fail(
      rv.currentNameKo === koByStopId.get(rv.stopId),
      `${rv.stopId}: 검토 로그의 currentNameKo 가 routes.json 과 다름`,
    );

    const rec = recordById.get(rv.stopId);
    if (!rec) continue;

    // 상태 ↔ reviewType
    const expectedType =
      rec.matchStatus === 'unmatched'
        ? 'oa12830_unmatched'
        : rec.matchStatus === 'conflict_hold'
          ? 'semantic_conflict'
          : rec.matchStatus === 'official_variant'
            ? 'official_variant'
            : 'ko_name_difference';
    fail(rv.reviewType === expectedType, `${rv.stopId}: reviewType 이 상태(${rec.matchStatus})와 불일치`);

    // 상태 ↔ decision (enum 포함 여부만으로는 부족하다)
    const allowedDecisions = REVIEW_POLICY.allowedDecisionByStatus[rec.matchStatus] ?? [];
    fail(
      allowedDecisions.includes(rv.decision),
      `${rv.stopId}: 상태 ${rec.matchStatus} 에 허용되지 않은 decision '${rv.decision}' (허용: ${allowedDecisions.join('|') || '없음'})`,
    );

    // 상태별 공식 원문·대체명 조합
    const hasAltEn = Object.prototype.hasOwnProperty.call(rv, 'alternativeOfficialEn');
    if (rec.matchStatus === 'reviewed' || rec.matchStatus === 'official_variant') {
      fail(
        rv.officialNameKo === rec.nameKoOfficial && rv.officialNameEn === rec.nameEnOfficial,
        `${rv.stopId}: 검토 로그와 SSOT 의 공식명이 불일치`,
      );
      fail(!hasAltEn, `${rv.stopId}: ${rec.matchStatus} 에는 alternativeOfficialEn 이 허용되지 않음`);
    }
    if (rec.matchStatus === 'conflict_hold') {
      const approvedEn = REVIEW_POLICY.conflictHoldOfficialEn[rv.stopId];
      fail(
        rv.officialNameEn === approvedEn,
        `${rv.stopId}: conflict_hold 리뷰의 공식 영문 원문이 승인 정책과 다름 (위조 의심)`,
      );
      fail(rv.officialNameKo === rec.nameKoOfficial, `${rv.stopId}: conflict_hold 리뷰의 공식 한국어명 불일치`);
      fail(!hasAltEn, `${rv.stopId}: conflict_hold 에는 alternativeOfficialEn 이 허용되지 않음`);
    }
    if (rec.matchStatus === 'unmatched') {
      fail(rv.officialNameKo === null, `${rv.stopId}: unmatched 리뷰의 officialNameKo 는 null 이어야 함`);
      fail(rv.officialNameEn === null, `${rv.stopId}: unmatched 리뷰의 officialNameEn 는 null 이어야 함`);
      // 대체 후보는 '기록'일 뿐 채택이 아니다. 문자열이면 출처 필드가 필수다.
      if (hasAltEn) {
        const alt = rv.alternativeOfficialEn;
        fail(
          alt === null || (typeof alt === 'string' && alt.length > 0),
          `${rv.stopId}: alternativeOfficialEn 타입 오류`,
        );
        if (typeof alt === 'string' && alt.length > 0) {
          fail(
            typeof rv.alternativeSource === 'string' && rv.alternativeSource.length > 0,
            `${rv.stopId}: 대체 후보 영문명이 있으면 alternativeSource 가 필수`,
          );
        }
      }
      // 후보가 있어도 정본은 반드시 미채택 상태여야 한다.
      fail(rec.nameEnOfficial === null, `${rv.stopId}: unmatched 인데 SSOT 에 영문명이 채택되어 있음`);
    }
  }
  const reviewIds = (reviews ?? []).map((r) => r.stopId);
  const sortedReviewIds = [...reviewIds].sort((a, b) => a.localeCompare(b));
  fail(reviewIds.every((id, i) => id === sortedReviewIds[i]), '검토 로그가 stopId 오름차순이 아님');

  // ── 기준 수치 ──
  const byStatus = (records ?? []).reduce((acc, r) => {
    acc[r.matchStatus] = (acc[r.matchStatus] ?? 0) + 1;
    return acc;
  }, {});
  const matchedCount = (records ?? []).filter((r) => r.matchStatus !== 'unmatched').length;
  const unmatchedIds = (records ?? []).filter((r) => r.matchStatus === 'unmatched').map((r) => r.stopId).sort();
  fail(matchedCount === BASELINE.apiMatched, `API matched ${matchedCount} ≠ ${BASELINE.apiMatched}`);
  fail((byStatus.unmatched ?? 0) === BASELINE.apiUnmatched, `unmatched ${byStatus.unmatched ?? 0} ≠ ${BASELINE.apiUnmatched}`);
  fail(
    unmatchedIds.join(',') === [...BASELINE.unmatchedStopIds].sort().join(','),
    `미매칭 ID 집합이 기준과 다름: ${unmatchedIds.join(', ')}`,
  );
  fail((byStatus.conflict_hold ?? 0) === OVERRIDES.conflictHold.length, 'conflict_hold 수가 정책과 다름');
  fail((byStatus.official_variant ?? 0) === OVERRIDES.officialVariant.length, 'official_variant 수가 정책과 다름');

  // ── 메타 스키마 (26-C1E.5 P2: meta 는 선택값이 아니다. null/undefined/배열/문자열 모두 실패) ──
  const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  if (!isPlainObject(meta)) {
    errors.push('meta 는 null 이 아닌 객체여야 합니다 (누락·배열·원시값 불가)');
  } else {
    const requiredStringFields = [
      'dataset', 'datasetName', 'api', 'provider', 'datasetUrl',
      'sourceUpdatedAt', 'license', 'licenseNote', 'extractionNote',
      'generationId', 'collectedAt',
    ];
    for (const f of requiredStringFields) {
      fail(typeof meta[f] === 'string' && meta[f].length > 0, `meta.${f} 누락 또는 문자열 아님`);
    }
    for (const f of ['totalInDataset', 'requestedStopIds', 'apiMatched', 'apiUnmatched']) {
      fail(typeof meta[f] === 'number' && Number.isFinite(meta[f]), `meta.${f} 누락 또는 숫자 아님`);
    }
    fail(meta.artifacts !== null && typeof meta.artifacts === 'object', 'meta.artifacts 누락');
    for (const f of ['stopNamesSha256', 'reviewsSha256', 'stopNamesCanonicalSha256', 'reviewsCanonicalSha256']) {
      fail(
        typeof meta.artifacts?.[f] === 'string' && /^[0-9a-f]{64}$/.test(meta.artifacts[f]),
        `meta.artifacts.${f} 누락 또는 SHA-256 형식 아님`,
      );
    }
  }

  // ── 메타·세대 해시 ──
  if (isPlainObject(meta)) {
    fail(meta.dataset === 'OA-12830', 'meta.dataset 오류');
    fail(meta.requestedStopIds === BASELINE.requestedStopIds, 'meta.requestedStopIds 불일치');
    fail(meta.apiMatched === BASELINE.apiMatched, 'meta.apiMatched 불일치');
    fail(meta.apiUnmatched === BASELINE.apiUnmatched, 'meta.apiUnmatched 불일치');
    fail(typeof meta.collectedAt === 'string' && meta.collectedAt.length > 0, 'meta.collectedAt 누락');
    fail(!('collectedAt' in ((records ?? [])[0] ?? {})), 'collectedAt 이 레코드에 중복 기록됨');
    // 의미(정규화) 해시
    fail(
      meta.artifacts?.stopNamesCanonicalSha256 === sha256(stableStringify(records)),
      'meta.artifacts.stopNamesCanonicalSha256 가 stop-names.json 내용과 불일치 (세대 불일치)',
    );
    fail(
      meta.artifacts?.reviewsCanonicalSha256 === sha256(stableStringify(reviews)),
      'meta.artifacts.reviewsCanonicalSha256 가 stop-name-reviews.json 내용과 불일치 (세대 불일치)',
    );
    // 파일 바이트 해시 (rawTexts 가 주어진 경우에만 검사 가능)
    if (rawTexts) {
      fail(
        meta.artifacts?.stopNamesSha256 === sha256(rawTexts.names ?? ''),
        'meta.artifacts.stopNamesSha256 가 stop-names.json 파일 바이트와 불일치',
      );
      fail(
        meta.artifacts?.reviewsSha256 === sha256(rawTexts.reviews ?? ''),
        'meta.artifacts.reviewsSha256 가 stop-name-reviews.json 파일 바이트와 불일치',
      );
    }
    fail(
      meta.generationId === computeGenerationId(records, reviews),
      'meta.generationId 가 현재 데이터와 불일치 (세대 불일치)',
    );
  }

  return errors;
}

export function summarize(records) {
  return (records ?? []).reduce((acc, r) => {
    acc[r.matchStatus] = (acc[r.matchStatus] ?? 0) + 1;
    return acc;
  }, {});
}
