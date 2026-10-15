# R1 read-only 감사 결과

파일 수정 없이 정적 검사, 데이터 재집계, validator 실행, lint 실행 및 공식 출처 대조를 수행했다.

## BLOCK

- **공공누리 제4유형의 “상업적 이용금지” 조건이 코드와 데이터에서 누락됐다.**
  - 위치: [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:21), [night-bus-routes.json](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/data/night-bus-routes.json:17), [R1 문서](/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/worklogs/R1-NIGHT-BUS-DATA-20261015.md:32)
  - 근거: 공식 페이지는 제4유형을 명시적으로 **출처표시 + 상업적 이용금지 + 변경금지**로 규정한다. 코드와 JSON은 “사실 수치 인용·출처 표기”만 적었고, 문서는 “변경금지”만 괄호에 넣어 비상업 조건을 빠뜨렸다. [서울시 공식 페이지](https://news.seoul.go.kr/traffic/archives/27974)
  - 영향: 향후 광고·수익화 사이트에 `official.*` 수치를 사용할 계획이라면 라이선스 충돌 가능성이 있다. “사실 수치는 저작권 보호 대상이 아니므로 사용 가능”이라는 판단도 현재 산출물에는 법적 근거나 별도 확인 기록이 없다. 그 판단이 확정되기 전까지는 **미확인**이다.
  - 출처명·URL·수정일 자체는 들어 있으므로 문제는 출처 누락이 아니라 라이선스 조건의 불완전·부정확한 표기다.

## FIX

- **노선 카테고리 분류가 N6xxx를 판별하지 않고, 공식 14개가 아닌 모든 `N*` 노선을 공항 심야로 분류한다.**
  - 위치: [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:85), [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:100)
  - 재현 조건: 입력에 `N11`, 신규 올빼미 `N77`, 임시 노선 `N999` 등 `^N\d`이지만 `OFFICIAL_SCHEDULE`에 없는 노선이 들어오면 모두 `airport-night`가 된다.
  - 현재 2026-09-02 데이터에는 N6000·N6002·N6701·N6703만 해당하므로 **현재 생성 결과의 실제 오분류는 없음**. 다만 주석과 문서가 말하는 “공항 심야(N6xxx)” 계약을 코드가 보장하지 않는다.

- **validator가 공항 노선 집합과 총 18노선을 불변식으로 검증하지 않는다.**
  - 위치: [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:27)
  - 근거: 올빼미 14개만 검사하고 `airport.length === 4`, N6000/N6002/N6701/N6703 존재 여부, `doc.routes.length === 18`은 검사하지 않는다.
  - 재현 조건: 공항 노선을 하나 삭제하거나 임의의 `airport-night` 노선을 추가해도 나머지 형식이 맞으면 PASS가 가능하다. 이는 문서의 “18 = 14+4” 주장을 validator가 보증한다는 인상과 다르다.

- **반환점 파생값은 정확성을 판정하는 불변식이 아니다.**
  - 위치: [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:48), [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:58)
  - 근거: 가장 높은 대칭 점수를 무조건 반환점으로 출력할 뿐 최소 점수, 공식 종점 근접성, 경로 양쪽 길이 또는 수동 예외를 검사하지 않는다.
  - 재현 조건:
    - 완전히 비대칭인 노선도 `best=0`인 첫 후보가 반환점으로 선택되고 PASS한다.
    - 정류장 수가 2개 이하이면 후보를 정상 탐색하지 못하며, 분모 0에 따른 `NaN` 가능성도 검사하지 않는다.
    - 잘못된 정류장 순서가 우연히 좌우 대칭이면 높은 점수로 통과할 수 있다.
  - 현재 문서는 낮은 대칭 노선과 공항 노선의 한계를 명시하므로 현 데이터에 대한 과도한 단정은 피하고 있다. 현재 출력 수치는 재현됐다.

- **물리 그룹의 “400m”는 그룹 전체 직경이 아니라 union-find 연결 간선 기준이다.**
  - 위치: [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:78)
  - 재현 조건: 같은 이름인 A–B가 350m, B–C가 350m, A–C가 700m이면 세 정류장이 하나로 합쳐진다. 따라서 “같은 이름·400m 안 물리 그룹”이라는 문구와 달리 그룹의 양 끝이 400m 밖일 수 있다.
  - 현재 데이터의 1,062개 그룹을 전수 계산한 결과 직경 400m 초과 그룹은 없어 **현재 산출 수치에는 실제 영향 없음**.

- **가상 정류소 제외 규칙이 정확한 문자열 `"(가상)"`에만 의존한다.**
  - 위치: [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:70), [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:72)
  - 재현 조건: `홍대입구역 (가상)`, `홍대입구역(가상정류소)`, 전각 괄호 또는 다른 공백 표기는 허브 후보에 포함된 채 PASS한다.
  - 현재 JSON의 올빼미 가상 정류소 22개는 모두 정확히 `"(가상)"` 형식이어서 정상 제외됐다.

- **XLSX 리더가 합법적인 OOXML 변형을 일부 처리하지 못한다.**
  - 위치: [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:49), [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:61)
  - 재현 조건:
    - 문자열이 `inlineStr`로 저장되거나 `xl/sharedStrings.xml`이 없는 XLSX는 실패하거나 빈 문자열로 읽힌다.
    - ARS가 숫자 `1234.0` 또는 지수 표기 형태로 저장되면 `zfill(5)`만 적용되어 `1234.0` 같은 잘못된 값이 생성된다.
  - 반면 누락된 셀 자체는 셀 참조 기반 딕셔너리와 `cells.get()`으로 빈 칸을 유지하므로 열 밀림은 없다. shared-string rich text도 모든 `<t>`를 이어 붙여 처리한다.
  - 원본 XLSX가 저장소 밖에 있어 원본 재생성 및 41,688행 전수 대조는 **미확인**이다.

- **validator가 핵심 필드 일부의 결손·상호 관계를 검사하지 않는다.**
  - 위치: [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:36)
  - 근거: 빈 `arsId`를 허용하며 `nodeId`, `nameKo`, `no`, `id`, category 값, 공항 노선의 `official` 부재, `official.source/asOf`, 중복 node/ARS 의미를 검사하지 않는다.
  - 현재 데이터에는 빈 `arsId/nodeId/nameKo`, `00000` ARS가 없고 노선별 순번 중복도 없어 실제 결손은 발견되지 않았다.

## NOTE

- **문서의 주요 수치는 재현됐다 — 이상 없음.**
  - 위치: [R1 문서](/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/worklogs/R1-NIGHT-BUS-DATA-20261015.md:12), [R1 문서](/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/worklogs/R1-NIGHT-BUS-DATA-20261015.md:42)
  - 재현 결과:
    - 18노선 = 올빼미 14 + 공항 심야 4
    - 전체 2,228행, 올빼미 2,100행
    - 올빼미 가상 22행 제외 후 2,078행
    - 고유 ARS 1,483, 물리 그룹 1,062, 3노선 이상 허브 후보 86
    - 노선당 96~188개, 18/18 loop=Y
    - 올빼미 최대 인접 간격 N37 3,651m
    - 파일 크기 387,548바이트로 문서의 388KB 표기와 부합
  - validator는 현재 데이터에서 `PASS — 불변식 위반 0`으로 종료했다.

- **N75 반환점 명칭이 문서에서 축약됐다.**
  - 위치: [R1 문서](/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/worklogs/R1-NIGHT-BUS-DATA-20261015.md:60)
  - 근거: 실제 출력은 `관악산입구.관악아트홀·중앙도서관`인데 문서는 `관악산입구.관악아트홀`까지만 기록했다. 순번 90/176과 대칭 0.40은 일치한다.

- **좌표 축과 ARS 선행 0 보존 — 현재 결과 이상 없음.**
  - 위치: [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:90), [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:93), [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:42)
  - 근거: X→lon, Y→lat 매핑은 서울 데이터의 좌표 범위와 일치하며, 축을 뒤집으면 bbox 검사가 실패한다. 현재 모든 좌표가 bbox를 통과했다. 모든 ARS가 5자리 문자열이고 앞자리 0도 보존돼 있다.

- **순번 정렬 — 현재 결과 이상 없음.**
  - 위치: [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:89), [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:99), [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:38)
  - 근거: 숫자 변환 후 정렬하며, 현재 18개 노선 모두 `1..n` 연속이고 중복이 없다.

- **공식 운행표 상수 — 이상 없음.**
  - 위치: [import-night-bus-routes.py](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/import-night-bus-routes.py:24)
  - 근거: 14개 노선, 운행대수·거리·배차·첫막차가 수정일 2026-03-20 서울시 공식 표와 일치한다. [서울시 공식 운행표](https://news.seoul.go.kr/traffic/archives/27974)

- **OA-1095 출처와 제1유형 표기 — 이상 없음.**
  - 위치: [night-bus-routes.json](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/data/night-bus-routes.json:7), [R1 문서](/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/worklogs/R1-NIGHT-BUS-DATA-20261015.md:24)
  - 근거: 공식 페이지에서 2026-09-02 파일, 데이터 갱신일, 공공누리 제1유형을 확인했다. [서울열린데이터광장 OA-1095](https://data.seoul.go.kr/dataList/OA-1095/S/1/datasetView.do)

- **R0 결정과 저장소 관례 — 이상 없음.**
  - 위치: [R0 결정](/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/worklogs/SITE-REBIRTH-ANALYSIS-20261015.md:238), [validate-night-bus.mjs](/Users/dapala.corp/python/root/scripts/seoul-autonomous/web/scripts/validate-night-bus.mjs:10)
  - 근거:
    - `web/data/routes.json`, 루트 및 web `package.json`의 diff는 없다.
    - 신규 파일은 표준 Python 라이브러리와 Node 내장 모듈만 사용한다.
    - validator는 `import.meta.url` 기준 상대경로만 사용하며 루트 `routes.json`을 읽거나 쓰지 않는다.
    - 생성기는 입력·출력 경로를 인자로 받을 뿐 절대경로를 하드코딩하지 않는다.
    - 신규 의존성은 없다.
    - 전체 lint는 기존 파일에서 5 errors/28 warnings로 실패했지만, 이번 두 신규 스크립트에는 lint 진단이 없었다. 과거 baseline과 동일한지는 기준 로그가 없어 **미확인**이다.

- **원본 데이터와 JSON의 완전 동일성은 미확인.**
  - 위치: [R1 문서](/Users/dapala.corp/python/root/scripts/seoul-autonomous/docs/worklogs/R1-NIGHT-BUS-DATA-20261015.md:16)
  - 근거: 원본 XLSX가 repo 밖 scratchpad에만 있다고 기록돼 있어, 감사 환경에서는 생성기를 다시 실행하거나 셀 단위 대조할 수 없었다.

**총평: 데이터 수치와 R0 구조는 대체로 재현되지만, 공공누리 제4유형의 비상업 조건 누락은 배포 전 BLOCK이며 분류·validator의 PASS 사각지대도 보강이 필요하다.**