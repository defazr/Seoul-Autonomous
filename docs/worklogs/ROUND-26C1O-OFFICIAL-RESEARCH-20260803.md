# Round 26-C1O 운영정보 공식 조사

조사일 2026-08-03 · 기준 HEAD `b36ed11` · 코드·데이터 무변경

---

## 1. 조사 목적과 기준

현재 화면에서 확정적으로 말할 수 있는 운영정보와 아직 확인되지 않은 정보를 **공식 출처 기준으로 분리**한다. 값을 많이 채우는 것이 목적이 아니라, 확정 가능한 것과 미확인을 정확히 가르는 것이 목적이다.

조사 시점에 `routes.json`의 해당 4개 항목은 **44셀 전부 `"Unknown"`**이며 화면에 렌더되지 않는다. `gangnam-robotaxi`만 `appRequired: true` · `appName: "Kakao T"`가 화면에 노출된다.

---

## 2. 조사 대상

| 그룹 | 대상 | 셀 |
|---|---|---|
| `fixed_route` | 고정노선 11개 × 4항목 | 44 |
| `on_demand_service` | `gangnam-robotaxi` × 4항목 | 4 |
| **합계** | | **48** |

항목: `fare` · `operator` · `reservationRequired` · `appRequired`

`_pendingRoutes` 3건(`sangam-a01`·`sangam-a02`·`yeouido-a01`)은 조사 대상이 아니다. §12 부록 참조.

---

## 3. 등급·출처 규칙

| 등급 | 조건 | `value` |
|---|---|---|
| **공식확인** | 현재 적용되는 공식 1차 출처가 노선과 값을 직접 명시 + 날짜 확인 + 최신 공식 모순 없음 | 입력 |
| **보도참고** | 언론·2차 자료만 존재 | `null` |
| **미확인** | 공식 근거 없음 / 현재 적용 여부 확정 불가 | `null` |

`sourceRole`: `current_official` · `historical_official` · `operator_official` · `secondary_media` · `discovery_only`
`operatorRole`: `program_owner` · `service_operator` · `transport_operator` · `vehicle_operator` · `platform_provider` · `unknown`

부재를 값으로 추론하지 않는다. "예약 안내가 없음"을 `reservationRequired = false`로 바꾸지 않는다.

### 이번 조사에서 적용한 시점 판정 기준

공식 문서가 요금 무료를 명시하되 유상 전환을 예고한 경우, 두 가지로 갈랐다.

- **전환 시점이 특정되지 않음**("서비스가 안정화될 때까지 당분간") → **공식확인**, `fareCondition`에 한시성 명기
- **전환 시점이 특정됐고 그 시점이 이미 도래**("'26년 상반기", "'26년 하반기" — 오늘은 2026-08-03) → **미확인**, `conflictNote`에 시계열 기록

---

## 4. 참조 공식 문서

| ID | 출처 | 제목 | 날짜 | 담당 |
|---|---|---|---|---|
| D1 | `seoul.go.kr/news/news_report.do?nttNo=455157` | 새벽동행 자율주행버스 'A741' 첫 시동 | 등록 2026-03-29 | 교통실 미래첨단교통과 |
| D2 | `seoul.go.kr/news/news_report.do?nttNo=456237` | (석간) 3만명 탄 '새벽동행 자율주행버스' 확대…A148 | 등록 2026-04-15 | 교통실 미래첨단교통과 |
| D3 | `news.seoul.go.kr/traffic/archives/515549` | 동대문·서대문에도 '자율주행 마을버스' | 2025-10-13 | 교통실 미래첨단교통과 |
| D4 | `news.seoul.go.kr/traffic/archives/516542` | '강남 심야 자율주행 택시' 4월부터 유료 전환 | 2026-03-16 | 교통실 미래첨단교통과 |
| D5 | `seoul.go.kr/news/news_report.do?nttNo=377194` | 전국 최초 대형 전기 자율주행버스…청와대 주변 무료 운행 | 등록 2022-12-21 | 도시교통실 미래첨단교통과 |
| D6 | `news.seoul.go.kr/traffic/archives/508167` | 상암에 '전국최초' 장애인 탑승 자율차 첫 선 | 2022-07-20 | 서울시 |

D1·D2·D3 공공누리 **제4유형**(출처표시+상업적이용금지+**변경금지**). 인용 시 원문 변경 금지.

접근일(`accessedAt`)은 전 건 **2026-08-03**.

---

## 5. 고정노선 11개

### 5-1. saebyeok-a160 (새벽A160 / Saebyeok A160)

| 항목 | 등급 | value |
|---|---|---|
| fare | **미확인** | null |
| operator | **미확인** | null |
| reservationRequired | **미확인** | null |
| appRequired | **미확인** | null |

**fare** — `conflictNote`: 시계열 3단계가 충돌한다.
1. 과거 공식(`scpm.seoul.go.kr/seoul-policy/evt0095`, 2024): "승하차 시 교통카드 태그 필요, 내년 하반기 중 유료화 예정" — `historical_official`
2. 운영사 공식(`autoa2z.co.kr/seoul`, 날짜 미표기): "운행 요금 무료 *2025년 하반기 중 유상 운송" — 날짜가 없어 현재성 판정 불가
3. 보도(연합뉴스 `AKR20260102111000004` 2026-01-02, 조선비즈 2026-01-04): "유료 전환 행정 절차 완료, **1월 중** 유료 전환, 조조할인 적용 **1,200원**" — `secondary_media`

**현재 시행을 확인하는 공식 1차 자료를 찾지 못했다.** 보도가 예고한 시행 시점(2026년 1월)에서 7개월이 지났으나, 이후 서울시 공식 문서(D1 2026-03-29, D2 2026-04-15)는 A160 요금을 언급하지 않는다.

⚠️ 1,200원은 **보도상 조조할인 적용가**다. 확정되더라도 단일 요금으로 표기하면 부정확해진다.

**operator** — 오토노머스에이투지가 A160을 운행한다는 자사 공식 페이지(`autoa2z.co.kr/seoul`, 구간 "도봉산광역환승센터–영등포역"으로 노선 식별은 명확)와 언론이 있으나, **게시일·수정일이 확인되지 않아** §3의 날짜 요건을 충족하지 못한다. 서울시 공식 문서에는 A160 운영사가 명시된 문장이 없다.

**reservationRequired / appRequired** — 어떤 공식 문서도 A160에 대해 언급하지 않는다. D1·D2가 A741·A148에 대해 탑승 절차를 기술하나 §6에 따라 A160으로 전파하지 않는다.

`researchQueries`: `서울시 자율주행버스 새벽A160 요금 유료화 공식` / `새벽동행 자율주행버스 A160 유료 전환 시행 요금 2026 서울시 교통` / `새벽동행 자율주행버스 A160 A741 A148 A504 요금 유료 전환 시행 서울시 공지 2026년 6월 7월` / `"자율주행버스" 유료 전환 시행 보도자료 2026 site:seoul.go.kr`
`researchEndReason`: 서울시 보도자료·교통 새소식·정책 아카이브·운영사 공식 페이지·연결 문서를 확인하고 공식 문서 6건을 정독했으나 현재 시행 요금을 명시한 공식 1차 자료 없음.

---

### 5-2. saebyeok-a741 (새벽A741 / Saebyeok A741)

| 항목 | 등급 | value |
|---|---|---|
| fare | **공식확인** | 무료 (한시) |
| operator | 미확인 | null |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

**fare** — `sourceRole: current_official` · 출처 D1 · `publishedAt: 2026-03-29` · `effectiveAt: 2026-03-30`(운행 개시일)
> "서비스가 안정화될 때까지 당분간 무료로 운행되나, 승하차 시에는 일반 시내버스와 동일하게 교통카드를 태그해야 한다."

`fareCondition`: `free during pilot period (until service stabilizes)` + `transportation card tag required on boarding and alighting`
`conflictNote`: "당분간"이라는 한시 표현이므로 유료 전환 시 변동한다. 전환 시점은 공식 문서에 특정돼 있지 않다.

**operator** — D1에 운영사 명시 문장 없음.
**reservationRequired / appRequired** — D1은 탑승 절차(교통카드 태그, 입석 금지, BIT·LED 좌석표시기로 빈자리 확인)를 기술하나 **예약·앱 필요 여부를 명시하지 않는다.** 절차 기술의 부재를 `false`로 추론하지 않는다(§6).

`researchQueries`: `자율주행버스 A504 금천구청 광화문 운행 시작 site:seoul.go.kr` / `서울 자율주행버스 운영사 42dot 오토노머스에이투지 운수사 A160 A741 A148`
`researchEndReason`: D1 정독 완료. 운영사·예약·앱은 문서에 항목 자체가 없음.

---

### 5-3. saebyeok-a148 (새벽A148 / Saebyeok A148)

| 항목 | 등급 | value |
|---|---|---|
| fare | **공식확인** | 무료 (한시) |
| operator | **공식확인** | ㈜에스유엠 |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

**fare** — `sourceRole: current_official` · 출처 D2 · `publishedAt: 2026-04-15` · `effectiveAt: 2026-04-16`
> "서비스가 안정화될 때까지 당분간 무료로 운행되나 승하차 시에는 일반 시내버스와 동일하게 교통카드를 태그해야 한다."

`fareCondition`: `free during pilot period (until service stabilizes)` + `transportation card tag required`

**operator** — `sourceRole: current_official` · 출처 D2 · `operatorRole: transport_operator` + `vehicle_operator`
> "A148 자율주행버스는 좌석 31석 대형 버스 모델(현대 일렉시티)에 '자율주행 전용 소프트웨어'를 탑재한 형태로 운행되며 그간 서울시에서 청와대·심야 자율주행버스 등을 운행해온 ㈜에스유엠에서 제작 및 운행한다."

서울특별시는 `program_owner`이며 운송 주체가 아니다. 위 문장의 "청와대·심야 자율주행버스 등을 운행해온"은 **과거 이력 서술**이므로 `cheongwadae-a01`·`simya-a21`의 현재 운영사로 전파하지 않는다(§6).

**reservationRequired / appRequired** — 5-2와 동일 사유로 미확인.

---

### 5-4. simya-a21 (심야A21 / Simya A21)

| 항목 | 등급 | value |
|---|---|---|
| fare | **보도참고** | null |
| operator | 미확인 | null |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

**fare** — `sourceRole: secondary_media`
- `mediahub.seoul.go.kr/archives/2009763`: "자율주행버스 요금은 무료이나, 카드를 단말기에 태그해야 환승…"
- 연합뉴스 2023-12-03 `AKR20231203010000004`: "당분간 무료·태그 환승할인"

서울시 보도자료 원문(2023-12 추정)을 찾지 못했다. 무료라는 값은 `evidenceSummary`에만 기록하고 `value`는 비운다.

**operator** — D2에 "청와대·심야 자율주행버스 등을 운행해온 ㈜에스유엠"이라는 **공식 문서의 간접 언급**이 있으나, 현재 운영사를 확정하는 문장이 아니고 과거형 서술이다. §6에 따라 확정하지 않는다. `conflictNote`에 D2 원문을 보존한다.

**reservationRequired / appRequired** — 공식·2차 모두 언급 없음.

`researchQueries`: `서울 심야 자율주행버스 A21 합정역 동대문 운행 요금 무료`
`researchEndReason`: 서울시 1차 보도자료 미발견, 2차 자료만 존재.

---

### 5-5. cheonggye-a01 (청계A01 / Cheonggye A01)

| 항목 | 등급 | value |
|---|---|---|
| fare | **보도참고** | null |
| operator | 미확인 | null |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

**fare** — `sourceRole: secondary_media`
- `mediahub.seoul.go.kr/archives/2015701`: "9월 23일부터 운행 시작… 왕복 4.8km 구간을 차량 2대가 순환… 운행요금 : 무료"
- 서울시 공식 블로그 `blog.naver.com/haechiseoul`: "운행 요금 : 무료 (**2026년 하반기 유상운송 전환 예정**)"

⚠️ 유상 전환 예고 시점이 **'26년 하반기 = 현재**다. 무료라는 값 자체가 현재 유효한지 불확실하다. 서울시 보도자료 원문 미발견.

**operator** — `autoa2z.co.kr/Cheonggyecheon`(오토노머스에이투지 자사 페이지)에 청계A01 노선도가 게시돼 있으나 게시일 미표기로 날짜 요건 미충족.

**reservationRequired / appRequired** — 언급 없음.

`researchQueries`: `청계천 자율주행버스 청계A01 운행 요금 무료 서울시 보도자료`
`researchEndReason`: 서울시 1차 미발견 + 유상 전환 예고 시점 도래로 현재값 확정 불가.

---

### 5-6. dongjak-a01 (동작A01 / Dongjak A01)

| 항목 | 등급 | value |
|---|---|---|
| fare | **미확인** | null |
| operator | 미확인 | null |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

**fare** — `conflictNote`: 유상 전환 예고 시점이 **이미 지났다.**
- 서울시 보도자료(2025-06-30, `itskorea.kr` 재배포 PDF): "**2026년 상반기 유상운송(유료)으로 전환**할 때까지는 별도 요금 없이 이용할 수 있으나, 수도권 환승할인 연계를 위해서는 …" — `historical_official` (재배포본이며 서울시 1차 URL 미확보)
- D3(2025-10-13)은 동작A01의 운행 사실과 만족도만 기술하고 요금을 언급하지 않는다.
- 연합뉴스 `AKR20250628056000004`: "이용 요금은 무료"

예고된 전환 시점(2026년 상반기)이 지났고 이후 공식 갱신 자료를 찾지 못했다. 무료인지 유료로 전환됐는지 확정할 수 없다.

**operator / reservationRequired / appRequired** — 공식 문서에 언급 없음.

`researchQueries`: `동작A01 자율주행 마을버스 숭실대 중앙대 운행 시작 2025년 6월 서울시 요금` / `서울시 자율주행버스 유상운송 전환 2026년 하반기 마을버스 청계 요금 부과 시행`
`researchEndReason`: 전환 시점 도래 후 갱신 공식자료 미발견.

---

### 5-7. dongdaemun-a01 (동대문A01 / Dongdaemun A01)

| 항목 | 등급 | value |
|---|---|---|
| fare | **미확인** | null |
| operator | 미확인 | null |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

**fare** — 출처 D3(`current_official` 시점에서는 유효했음) · `publishedAt: 2025-10-13`
> "내년 하반기 유상 운송으로 전환되기 전까지 시민 누구나 무료로 이용할 수 있다."
> "유상 운송 전환('26년 하반기 예정)까지 무료이나 승·하차 시 반드시 교통카드를 태그해야 한다."

⚠️ **'26년 하반기가 이미 시작됐다**(오늘 2026-08-03). 전환 시행 여부를 확인할 공식 갱신 자료를 찾지 못했다. 따라서 "무료"를 현재값으로 확정할 수 없다.
`conflictNote`: 2025-10-13 공식 문서 기준 무료였고 '26년 하반기 유상 전환이 예정돼 있었으나, 전환 시행 여부 미확인.
`supersededBy`: 없음 (대체 공식자료 미발견)

**operator** — D3에 운영사 명시 없음. "안전요원 등 2인이 상시 탑승한다"는 운행 형태 기술이며 운영 주체가 아니다.
**reservationRequired / appRequired** — 언급 없음. BIT 실시간 도착정보·포털 노선 검색 안내만 있다.

`researchQueries`: `자율주행 마을버스 동대문A01 서대문A01 운행 요금 무료 서울시` / `서울시 자율주행버스 유상운송 전환 2026년 하반기 마을버스 청계 요금 부과 시행`
`researchEndReason`: 전환 예고 시점 도래 후 갱신 공식자료 미발견.

---

### 5-8. seodaemun-a01 (서대문A01 / Seodaemun A01)

| 항목 | 등급 | value |
|---|---|---|
| fare | **미확인** | null |
| operator | 미확인 | null |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

5-7과 동일 문서(D3)·동일 사유. D3는 두 노선의 요금을 하나의 문장으로 함께 규정한다.

> "10개 정류소(순환 5.9km)를 순회하며, 30분마다 한 대씩(점심시간대 80분) 하루 14회 운행된다."

`conflictNote`·`researchEndReason` 5-7과 동일.

---

### 5-9. sangam-a21 (상암A21 / Sangam A21)

| 항목 | 등급 | value |
|---|---|---|
| fare | **미확인** | null |
| operator | 미확인 | null |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

이 노선만 **유료 자료**가 존재한다. 다만 **4년 전 문서**다.

**fare** — 출처 D6 · `sourceRole: historical_official` · `publishedAt: 2022-07-20`
> "이용요금은 시민들이 저렴하게 자율차를 이용할 수 있도록 자율주행버스는 인당 1,200원으로 책정하였다."

문서는 상암을 "유상운송 자율차" 지구로 기술한다. 그러나 2022년 자료이고 이후 요금 갱신 공식자료를 찾지 못해 현재값으로 확정하지 않는다.

**operator** — `historical_official`, `operatorRole: service_operator`
> "'상암 A21' 노선 운영 업체는 ㈜SUM으로 서울대학교 자율주행 연구진들이 설립한 신생기업이다."

⚠️ 표기 주의: D6의 **㈜SUM**, D2의 **㈜에스유엠**, D4의 **에스더블유엠**은 표기가 유사하나 동일 법인 여부를 공식 자료로 확인하지 못했다. **동일시하지 않고 원문 표기를 그대로 보존한다.**

**appRequired** — `historical_official`
> "자율차를 이용하려면 42dot과 민관협업으로 구축한 서울 자율주행 전용 스마트폰 앱(TAP!)을 구글 플레이스토어와 애플 앱스토어에서 내려 받아 이용하면 된다."

2022년 기준 전용 앱이 필요했다. 현재 해당 앱의 운영 여부를 확인하지 못해 확정하지 않는다.

**reservationRequired** — D6에 언급 없음.

`researchQueries`: `상암 자율주행버스 A21 노을공원 디지털미디어시티역 운행 요금`
`researchEndReason`: 2022년 공식자료만 존재, 현재 적용 여부 확인 불가.

---

### 5-10. cheongwadae-a01 (청와대A01 / Cheongwadae A01)

| 항목 | 등급 | value |
|---|---|---|
| fare | **미확인** | null |
| operator | 미확인 | null |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

**fare / appRequired / reservationRequired** — 출처 D5 · `sourceRole: historical_official` · `publishedAt: 2022-12-21`
> 제목: "22일(목) 청와대 주변 무료 운행 시작"
> "별도의 앱 설치 없이 교통카드만 있으면 22일(목)부터 시민 누구나 무료 탑승"

이 한 문장이 요금(무료)·앱(불필요)·탑승 방식(누구나)을 모두 담고 있으나 **3년 8개월 전 자료**다. 별도 업체 자료(`smobi.ai`)에 "청와대 자율주행버스 운행 **재개**"라는 표현이 있어 **중단·재개 이력**이 있을 가능성이 있다. 현재 운행 상태와 조건을 확인할 공식 갱신 자료를 찾지 못했다.

**operator** — 서울대·에스유엠(SUM) 컨소시엄 선정 언급이 블로그·업체 자료에 있으나 공식 1차 확인 실패. D2의 "청와대…를 운행해온 ㈜에스유엠"은 과거형 서술이며 현재 운영사 확정 문장이 아니다.

`researchQueries`: `청와대 자율주행버스 운행 요금 무료 서울시 에스유엠`
`researchEndReason`: 2022년 공식자료만 존재 + 운행 중단·재개 가능성으로 현재 상태 확정 불가.

---

### 5-11. saebyeok-a504 (새벽A504 / Saebyeok A504)

| 항목 | 등급 | value |
|---|---|---|
| fare | **보도참고** | null |
| operator | 미확인 | null |
| reservationRequired | 미확인 | null |
| appRequired | 미확인 | null |

**fare** — `sourceRole: secondary_media`
- 경향신문 2026-04-27: "A504, 29일 운행 시작··· 당분간 무료"
- 금천구 공식 블로그: "운행 개시 2026. 4. 29.(수), 운행 시간 03:30~06:30(왕복 1회)"

D2(2026-04-15)는 "시는 올해 4월 말 A504(금천구청~광화문) 노선을 추가로 신설하고"라며 **신설 예정만** 언급하고 요금을 규정하지 않는다. A504 개통 자체를 다룬 서울시 보도자료를 찾지 못했다.

`researchQueries`: `자율주행버스 A504 금천구청 광화문 운행 시작 site:seoul.go.kr` / `새벽동행 자율주행버스 A504 금천구청 시청 운행 시작 보도자료 서울시 4월 29일`
`researchEndReason`: 서울시 1차 보도자료 미발견, 2차 자료만 존재.

---

## 6. 강남 로보택시 (`gangnam-robotaxi`, `on_demand_service`)

**4셀 전부 공식확인.** 출처 D4 · `sourceRole: current_official` · `publishedAt: 2026-03-16` · `effectiveAt: 2026-04-06`

| 항목 | 등급 | value |
|---|---|---|
| fare | **공식확인** | 기본요금만 부과 — 시간대별 4,800원 / 5,800원 / 6,700원 |
| operator | **공식확인** | 에스더블유엠, 카카오모빌리티 |
| reservationRequired | **공식확인** | 사전 예약 아님 — 카카오T 앱 호출 필요 |
| appRequired | **공식확인** | 예 — 카카오T 필수 |

**fare**
> "'26.4.6일부터 유료화… 거리·시간 관계없이 기본요금만 발생, 심야 할증만 적용"
> "새벽 4시~5시 이용요금은 할증이 적용되지 않는 4,800원이며, 심야 할증이 적용되는 밤 10시~11시, 새벽 2시~4시는 5,800원, 밤 11시~새벽 2시에는 6,700원이다."

`fareCondition`: `base fare only regardless of distance and time` + `late-night surcharge applies by time band` + `payment card must be registered in Kakao T in advance`

⚠️ **단일 금액으로 표기하면 부정확하다.** 시간대 3구간을 함께 제시해야 한다.

**operator**
> "기존 운행업체인 '에스더블유엠'이 운행차량을 2대 늘리고, 신규 선정업체인 '카카오모빌리티'도 2대 운행을 개시한다."

`operatorRole`: 에스더블유엠 = `transport_operator`, 카카오모빌리티 = `transport_operator` + `platform_provider`, 서울특별시 = `program_owner`. 총 7대 운행.

**appRequired**
> "모든 차량은 기존처럼 호출 앱인 '카카오T' 통해 강남 운행 구역 내에서 이동할 경우 탑승할 수 있다. 단, 이용 요금 결제를 위해 사전에 결제 카드를 앱에 등록해야 한다."

호출과 결제 모두 카카오T를 거치므로 **앱 필수**가 명시적으로 성립한다.

**reservationRequired**
> "'카카오T' 앱에서 택시 아이콘을 선택한 후 운행 구역 내 출발지와 목적지를 설정하면 메뉴에 '서울자율차'가 표출되어 차량을 호출할 수 있다."

**사전 예약이 아니라 실시간 호출** 방식이다. "예약 필요"로 표기하면 오해를 만든다. 운행 시간은 "평일 밤 10시부터 다음날 새벽 5시까지".

**`conflictNote` — 현재 사이트 데이터 상태**
`routes.json`의 `gangnam-robotaxi`는 `appRequired: true` · `appName: "Kakao T"`를 확정값으로 담고 있고 `RobotaxiCard`가 이를 화면에 렌더한다. 그런데 같은 레코드의 `verificationLevel`은 `official_pending`이고 `sourceUrls`는 **빈 배열**이었다. **값 자체는 이번 조사로 공식 뒷받침을 얻었으나, 조사 이전까지는 근거 없이 노출되던 단정이었다.** C2O에서 `sourceUrls`와 `verificationLevel`을 함께 정정해야 한다.

`researchQueries`: `강남 심야 자율주행택시 유료 전환 요금 카카오T 서울시 site:news.seoul.go.kr`
`researchEndReason`: 공식확인 완료.

---

## 7. 공식확인 결과 요약 (7셀)

| 대상 | 항목 | value | 출처 | 날짜 |
|---|---|---|---|---|
| saebyeok-a741 | fare | 무료(한시) + 교통카드 태그 | D1 | 2026-03-29 |
| saebyeok-a148 | fare | 무료(한시) + 교통카드 태그 | D2 | 2026-04-15 |
| saebyeok-a148 | operator | ㈜에스유엠 (제작·운행) | D2 | 2026-04-15 |
| gangnam-robotaxi | fare | 4,800 / 5,800 / 6,700원 (시간대별) | D4 | 2026-03-16 |
| gangnam-robotaxi | operator | 에스더블유엠, 카카오모빌리티 | D4 | 2026-03-16 |
| gangnam-robotaxi | reservationRequired | 사전예약 아님 (앱 호출) | D4 | 2026-03-16 |
| gangnam-robotaxi | appRequired | 카카오T 필수 | D4 | 2026-03-16 |

## 8. 보도참고 결과 요약 (3셀)

| 대상 | 항목 | 보도상 값 (화면 사용 금지) | 공식 미확인 사유 |
|---|---|---|---|
| simya-a21 | fare | 무료 + 태그 환승할인 | 서울시 1차 보도자료 미발견 |
| cheonggye-a01 | fare | 무료, '26 하반기 유상 전환 예정 | 서울시 1차 미발견 + 전환 시점 도래 |
| saebyeok-a504 | fare | 당분간 무료 | 개통 보도자료 자체 미발견 |

## 9. 미확인 결과 요약 (38셀)

| 노선 | 미확인 항목 | 주 사유 |
|---|---|---|
| saebyeok-a160 | 4항목 전부 | 요금 시계열 충돌·현재 시행 공식 공백 / 운영사 자료 날짜 미표기 |
| saebyeok-a741 | operator, reservation, app | 공식 문서에 항목 없음 |
| saebyeok-a148 | reservation, app | 공식 문서에 항목 없음 |
| simya-a21 | operator, reservation, app | 공식 언급은 과거형 간접 서술뿐 |
| cheonggye-a01 | operator, reservation, app | 공식 1차 미발견 |
| dongjak-a01 | 4항목 전부 | 유상 전환 예고('26 상반기) 시점 도래 후 갱신 없음 |
| dongdaemun-a01 | 4항목 전부 | 유상 전환 예고('26 하반기) 시점 도래 후 갱신 없음 |
| seodaemun-a01 | 4항목 전부 | 동상 |
| sangam-a21 | 4항목 전부 | 2022년 자료만 존재 (요금·운영사·앱 값은 보존) |
| cheongwadae-a01 | 4항목 전부 | 2022년 자료 + 운행 중단·재개 가능성 |
| saebyeok-a504 | operator, reservation, app | 공식 1차 미발견 |

**집계: 공식확인 7 / 보도참고 3 / 미확인 38 = 48셀** (누락 0)

---

## 10. 충돌·시계열 기록

### 10-1. A160 요금 (최우선 미해결)
```
2024        서울시 공식   무료 + 하반기 유료화 예정      historical_official
날짜미상     운영사 공식   무료 + 2025 하반기 유상운송     날짜 미표기로 판정 불가
2026-01-02  언론         유료 전환 행정절차 완료         secondary_media
2026-01     언론         1월 중 시행, 조조할인 1,200원   secondary_media
2026-03-29  서울시 공식   A160 요금 언급 없음 (D1)
2026-04-15  서울시 공식   A160 요금 언급 없음 (D2)
2026-08-03  조사 시점     현재 시행 요금 공식 근거 미확인
```

### 10-2. 유상 전환 예고 시점이 도래한 노선 (신규 발견)
```
dongjak-a01      2026 상반기 전환 예정 (2025-06 공식)  → 시점 경과, 갱신 없음
cheonggye-a01    2026 하반기 전환 예정 (공식 블로그)    → 시점 진입, 갱신 없음
dongdaemun-a01   2026 하반기 전환 예정 (2025-10 공식)  → 시점 진입, 갱신 없음
seodaemun-a01    2026 하반기 전환 예정 (2025-10 공식)  → 시점 진입, 갱신 없음
```
A160과 **같은 구조의 공백**이 4개 노선에서 추가로 확인됐다. 이 4개는 "무료"라고 적혀 있던 공식 문서가 존재하지만 그 문서 스스로 유효기간의 끝을 예고했고, 그 시점이 지났거나 진입했다.

### 10-3. 운영사 표기 유사성
```
㈜SUM        D6 (2022, 상암A21)
㈜에스유엠    D2 (2026, A148 / 청와대·심야 과거 이력)
에스더블유엠  D4 (2026, 강남 로보택시)
```
동일 법인 여부를 공식 자료로 확인하지 못했다. **통합·정규화하지 않고 원문 표기 그대로 보존한다.**

---

## 11. C2O 반영 후보

1. **`"Unknown"` 문자열 폐기 → `null` + 등급 필드**로 전환. `FixedRoute.appRequired`(string)와 `OnDemandService.appRequired`(boolean) **타입 불일치**도 함께 통일.
2. **공식확인 7셀만 화면 노출 후보.** 나머지 41셀은 값 표시 금지.
3. **한시 요금 표기 설계** — A741·A148은 "무료"가 아니라 "시범 기간 무료(교통카드 태그 필수)"로, 종료 조건을 함께 보여야 한다.
4. **로보택시 요금은 시간대 3구간을 함께** 표시. 단일 금액 표기 금지.
5. **`gangnam-robotaxi`의 `sourceUrls`·`verificationLevel` 정정** — 이제 D4라는 근거가 있다. `official_pending` 유지 여부 재판단.
6. **고아 키 재사용 판단** — `routeDetail.aeo.a4fare` · `a4fareUnknown`(코드 참조 0). 조건부 요금 표시에 재사용하거나 삭제한다.
7. **"유상 전환 예정 시점 경과" 상태 모델** — §10-2의 4개 노선은 단순 미확인이 아니라 "과거엔 무료였고 전환 예정 시점이 지났음"이라는 별도 상태다. FAQ 조건부 문구에 반영 후보.

## 12. C3 이월 결함

### C3-P1 — FAQ q1 반환점·종점 오류 (필수)
```
ko: stops[0].nameKo  →  stops[마지막].nameKo
en: route.startPoint →  route.endPoint      ← endPoint = 반환점
```
왕복형 7개 노선(a160·a741·simya-a21·cheonggye-a01·dongjak-a01·seodaemun-a01·a504)에서
- ko는 출발지와 종점을 **같은 이름으로 반복**한다
- en은 **반환점을 종점처럼** 표시한다

원인은 ko·en이 서로 다른 데이터 경로를 쓰는 것과 `endPoint` 의미가 노선별로 불일치하는 것이다. 실측상 11개 중 10개에서 `endPoint` ≠ 마지막 정류장이며, 유일한 예외 `sangam-a21`은 반대로 `endPoint`가 마지막 정류장이고 반환점은 별도 정류장이다.

C3에서 **실제 stop 배열과 운행 형태(왕복/편도)를 기반으로 문구를 다시 설계**해야 한다. 이번 라운드에서는 수정하지 않았다.

### C3 참고 — `dongdaemun-a01` 표기 불일치
`endPointKo`는 "경희의료원"이나 반환 정류장 정식명은 "경희대의료원.경희여중고"다.

---

## 13. 부록: pending 노선 관련 우연 발견

조사 중 `_pendingRoutes` 3건에 대한 공식 자료는 발견되지 않았다.

다만 D6(2022-07-20)에 **상암 A03**(승용형 자율차, 2,000원)이 상암A21과 동일 구간을 운행한다는 기술이 있다. 현재 `routes.json`의 `_pendingRoutes`에 있는 `sangam-a01`·`sangam-a02`와는 노선 ID가 다르므로 연결 근거가 되지 않는다.

`yeouido-a01`("2026 operation status requires re-verification")에 대한 공식 자료도 발견되지 않았다.

---

## 14. 조사 범위 확인

```
코드 변경        0
routes.json 변경 0
타입 변경        0
화면 문구 변경    0
FAQ 변경         0
서버 기동        0
OpenAPI 직접 호출 0
commit / push / deploy  0
```

작성 문서: 이 파일 1건 (신규)
