import { NextResponse } from 'next/server';
import { buildClientDoc } from '../../../../lib/night-bus/client-doc';

/** 홈 질문 카드 데이터 — 빌드 시 정적으로 굳는다(force-static). 외부 호출 없음. 클라이언트는 ?v=<snapshot> 으로 캐시를 가른다. */
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(buildClientDoc(), { headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' } });
}
