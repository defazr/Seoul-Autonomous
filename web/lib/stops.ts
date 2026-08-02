/**
 * Round 26-C1E — 공식 영문 정류장명 SSOT 조회.
 *
 * routes.json 의 stop 레코드는 수정하지 않는다. stopId 로 이 SSOT 를 조회한다.
 * 26-C1E 에서는 화면 렌더에서 사용하지 않는다 (26-C2E 에서 연결).
 */

import stopNamesData from '../data/stops/stop-names.json';
import stopNamesMeta from '../data/stops/stop-names.meta.json';
import type { StopNameRecord, StopNamesMeta } from './types/stop-names';

const records = stopNamesData as StopNameRecord[];

export const stopNamesById: ReadonlyMap<string, StopNameRecord> = new Map(
  records.map((record) => [record.stopId, record]),
);

// 강제 단언 대신 satisfies 로 JSON 과 타입의 불일치를 컴파일 시점에 드러낸다.
export const stopNamesSourceMeta = stopNamesMeta satisfies StopNamesMeta;

export function getStopNameRecord(stopId: string): StopNameRecord | undefined {
  return stopNamesById.get(stopId);
}

/**
 * 공식 영문명이 확정된 경우에만 반환한다.
 * conflict_hold·unmatched 는 null 이므로 호출부가 한국어명으로 대체해야 한다.
 */
export function getOfficialStopNameEn(stopId: string): string | null {
  return stopNamesById.get(stopId)?.nameEnOfficial ?? null;
}
