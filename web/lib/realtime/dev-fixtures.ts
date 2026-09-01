/**
 * RT-2 QA 전용 upstream fixture.
 *
 * 🔒 이 모듈은 Route Handler 에서 **동적 import** 로만 로드되며,
 *    production 하드 가드(NODE_ENV === 'production')를 통과한 뒤에는 절대 도달하지 않는다.
 *    목적은 실제 서울시 API 를 호출하지 않고 응답 분기를 재현하는 것이다.
 *
 * XML 은 RT-1 실측 응답의 구조를 그대로 따른다(불필요한 필드는 생략).
 */

const envelope = (items: string) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ServiceResult><comMsgHeader/><msgHeader><headerCd>0</headerCd><headerMsg>정상적으로 처리되었습니다.</headerMsg><itemCount>1</itemCount></msgHeader><msgBody>${items}</msgBody></ServiceResult>`;

const item = (busRouteId: string, rtNm: string, arrmsg1: string) =>
  `<itemList><stId>100000384</stId><arsId>01009</arsId><stNm>광화문역</stNm><busRouteId>${busRouteId}</busRouteId><rtNm>${rtNm}</rtNm><arrmsg1>${arrmsg1}</arrmsg1><arrmsg2>운행종료</arrmsg2></itemList>`;

/** 우리와 무관한 노선. 필터가 실제로 걸러내는지 확인하는 대조군이다. */
const foreign = item('100100118', '753', '3분후[2번째 전]');

export const FIXTURES: Readonly<Record<string, string>> = {
  /** B — 의미 있는 도착값이 섞여 있다. 정렬·조판 검증용. */
  b: envelope(
    foreign +
      item('101000005', '심야A21', '출발대기') +
      item('100000024', '새벽A160', '18분후[8번째 전]') +
      item('100000028', '새벽A741', '곧 도착'),
  ),

  /** C — 우리 노선이 전부 운행종료. 카드가 사라져야 한다. */
  c: envelope(
    foreign +
      item('100000024', '새벽A160', '운행종료') +
      item('100000028', '새벽A741', '운행종료') +
      item('101000005', '심야A21', '운행종료'),
  ),

  /** partial — ended 와 active 혼합. ended 만 빠지고 나머지는 표시되어야 한다. */
  partial: envelope(
    foreign +
      item('100000024', '새벽A160', '운행종료') +
      item('100000028', '새벽A741', '24분후[6번째 전]') +
      item('101000005', '심야A21', '회차대기'),
  ),

  /** zero — 정상 응답이지만 승인 노선이 하나도 없다. anomaly 로그가 떠야 한다. */
  zero: envelope(foreign),

  /** unknown — 미지 패턴. 오류가 아니라 원문 그대로 표시되어야 한다. */
  unknown: envelope(foreign + item('100000024', '새벽A160', '차고지대기')),

  /** auth — 인증 실패. 정상 데이터 부재와 절대 같은 상태가 아니다. */
  auth:
    '<?xml version="1.0" encoding="UTF-8"?><ServiceResult><cmmMsgHeader><returnAuthMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR</returnAuthMsg><returnReasonCode>30</returnReasonCode></cmmMsgHeader></ServiceResult>',

  /** quota — 서울시 일일 한도 초과. 우리 budget 소진(APP_BUDGET_EXHAUSTED)과 다른 사유다. */
  quota:
    '<?xml version="1.0" encoding="UTF-8"?><ServiceResult><cmmMsgHeader><returnAuthMsg>LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR</returnAuthMsg><returnReasonCode>22</returnReasonCode></cmmMsgHeader></ServiceResult>',
};
