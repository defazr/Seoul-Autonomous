# Phase 0 — Connected Transit Graph 전환 Production Read-only 구조 감사 (정본)

- 일자: 2026-08-25
- 성격: read-only 구조 감사 (코드·데이터·문서·서버 변경 0)
- 판정: **EXIT=0 / BLOCK 없음 / Phase 0 APPROVED·CLOSED (포그린 검수 완료)**
- 배경: AdSense 3차 신청(2026-08-11) **거절**. 포그린이 AdSense 화면에서 직접 확인한 사유
  "정책 위반이 발견되었습니다 → **가치가 별로 없는 콘텐츠**" (+ "광고 게재가 준비되지 않은 사이트" 안내).
  이번 감사에서 확정 입력값으로 쓴 구체 사유는 "가치가 별로 없는 콘텐츠"다.
- 주의: **AdSense 거절 원인이 "그래프 부재"로 확정된 것은 아니다.** 그것은 증명되지 않았다.
  이번 감사는 거절 원인 단정이 아니라, 사이트를 실제로 더 유용한 서비스로 만들 구조를
  실측으로 검증한 것이다.

## A. 감사 계약

- 포그린 최종 지시서(§0~§36) + CC 선보고 → Amendment 1 확정 후 착수
- Amendment 1 요지: ① Git 기준점 `a11e904` → **`4fdfc93`** 보정 ② 3차 거절 B안 확정
  (재캡처 없이 포그린 확인 원문 사용) ③ 로보택시 수치는 공식 출처 독립 검증
  ④ 보고서는 채팅 단독 제출(정본화는 별도 승인 — 이 문서가 그 정본화)
  ⑤ routes.json 이중 존재 감사 ⑥ allnosun 공개 감사 안전선 ⑦ 도구 안전선 ⑧ Q19~Q22 추가
- HARD FREEZE 준수: 코드·문서·데이터 수정 0, git 조작 0(조회만), 서버 접속 0,
  설치 0, 외부 상태 저장소 생성 0. 외부 접근은 전부 read-only GET.

## B. 기준점 (실측)

```
Git local = origin/main   4fdfc93  (ahead/behind 0/0, tracked 변경 0)
미추적                     7건 — 보존 대상 목록과 정확히 일치, 비접촉
Production                라이브 sitemap 53/53 · 노선 상세 200 (공개 HTTPS)
runtime                   abb0ba7 (docs-only 커밋 차이로 Git HEAD와 다름 — 정상)
```

## C. routes.json 이중 존재 판정 (Q19)

| | 루트 `data/routes.json` | `web/data/routes.json` |
|---|---|---|
| SHA-256 | `314204271b…d34b39a` | `1fcbf0a05e…585977f1` |
| 크기 | 66,307B | 78,560B |
| 모델 | C2O **이전** 평문("Unknown" 문자열) | **C2O 상태 모델** (value/verificationGrade/currentState/reason/sources) |
| consumer | RN 앱 3파일 (`app/route/[id].tsx`, `app/(tabs)/*`) | `web/app/sitemap.ts` · `routes/[id]/page.tsx` · `lib/routes.ts` · `lib/stops.ts` · faq 2종 |
| 판정 | 웹 프로덕션 무관 레거시. **비접촉** | **웹 Graph SSOT 확정** |

- 두 파일은 노선 id·stops 배열은 동일, 운영정보 4필드 구조가 다름(47 vs 258 경로).
- Phase 1 스크립트는 반드시 절대경로로 `web/`만 접근 (과거 상대경로 사고 1회 이력).
- `web/data/routes.json`의 `_meta`는 `stage:"seed" / publicReady:false / lastUpdated:"2026-04-29"`로
  실제 성숙도와 모순되는 낡은 메타 — Phase 1A 정비 후보.

## D. Stop 데이터 실측 (Q5·Q20)

```
raw stop 엔트리(StopVisit 후보)   307
고유 ARS stopId                  267   (전부 5자리, null 0, stopId→이름 충돌 0)
공식 조인                        officialId 267/267 · 공식 영문명 261/267 (ko fallback 6)
                                 (OA-12830, matchStatus: exact 236 / reviewed 20 /
                                  official_variant 5 / unmatched 5 / conflict_hold 1)
다노선 공유 정류장                33    (2노선 28 + 3노선 5) — 노선 간 환승 엣지 실존
동명 방향쌍                      90쌍  — 90/90이 같은 노선의 왕복 방향쌍 (타노선 간 동명 0)
물리 정류장 그룹 후보             177   (단독 87 + 방향쌍 90)
좌표                             0
노선당 반환점(isTurnaround)       정확히 1
동일 노선 내 동일 stopId 반복     2건 — cheonggye-a01 `02247`×2, seodaemun-a01 `13156`×2
```

- 공유 정류장 33개는 새벽A160·새벽A148·새벽A741·심야A21의 도봉~종로 회랑에 집중.
  A21↔A160 공유 17개(그중 5개는 A741도 경유).
- join은 **이름 조인 불필요, stopId만으로 즉시 가능**. 안정 식별자 존재(Q20) —
  필요한 정규화는 dedup이 아니라 그룹핑 층 추가와 build-time 검증뿐.

## E. Route 데이터 실측 (Q6 입력)

- fixedRoutes 11 + onDemand 1(gangnam-robotaxi) + `_pendingRoutes` 3(비노출).
- 충족: id·양언어 표시명·start/endPoint(반환점 의미)·firstBus/lastBus·stops[] = 11/11.
  headway 7/11, daysOfOperation 4/11. 좌표·routeType 필드 없음.
- 운영정보 4필드 48셀 = official_confirmed 7 / media_reference 3 / unverified 38,
  currentState = confirmed 7 / reverification_required 5 / unverified 36
  (26-C2O 기록과 완전 일치 재검증).

## F. 로보택시 상태 (§10·Q17)

- **현재 운영정보 오류 0건.** 사이트는 차량 대수를 운영정보로 표시하지 않음
  (코드·데이터·라이브 HTML 전수에서 "7대/19대" 0). "7대"는 updates 기사
  `gangnam-robotaxi-expanded`(2026-05-09 게시)의 reportedInfo — 과거 보도 시점 기록으로 정상, 수정 대상 아님.
- 요금 4구간(5,800/6,700/5,800/4,800)·카카오T 필수·실시간 호출·운영 2사는
  **2026-08-19 공식 발표와 전부 일치** (요금은 2026-03 대비 불변임을 공식 문서로 확인).
- 2026-08-19 발표 독립 검증: 주장 12개 항목 전부 공식 출처로 확인.
  - 정식 보도자료: `https://www.seoul.go.kr/news/news_report.do?nttNo=464205` (등록 2026-08-19)
  - 전문(내 손안에 서울): `https://mediahub.seoul.go.kr/archives/2019107` (2026-08-19)
  - 이전 기준선(7대·유료화): `https://news.seoul.go.kr/traffic/archives/516542` (2026-03-16)
  - 내용: 7대→19대(SWM 13 + 카카오모빌리티 6), 시행 2026-08-20 22:00, 구역 약 20.4㎢
    (강남 시범운행지구 전역), 평일 22:00~익일 05:00, 최대 승객 3명(시험운전자 1인 동승),
    카카오T → 택시 → 출발/목적지 → "서울자율차" → 결제수단 선택 후 호출.
  - 언론 오보 1건 발견: 경향신문 "23시 시작" — 공식은 22시. 공식 출처 우선 원칙 재확인.
- **개선 기회(오류 아님)**: ① `operatingHours:"Unknown"` → 8/19 출처로 official_confirmed
  승격 가능(평일 22:00~05:00) ② 19대 확대 update 기사 신규 작성 ③ serviceArea 보강
  ④ sources에 8/19 출처 추가 → **별도 Robotaxi Freshness Round** (Phase 1A와 코드 동시 작업 금지).

## G. allnosun.com 비교 감사 (Q2·Q3)

- 정체: 전국 대중교통 프로그래매틱 사이트(서울만 노선 1,366 + 정류장 18,688 URL).
  AdSense 게재 중(`ca-pub-5530962893111963`, 페이지당 슬롯 2). Next.js App Router + Vercel.
- **상대 우위(배울 것)**: 노선↔정류장 **양방향 실링크 그래프** — 노선→전 정류장 링크,
  정류장→경유 노선 전수 링크. "노선 A → 정류장 → 노선 B" 탐색이 순수 `<a>`로 성립.
- **우리 우위**: provenance(그들은 푸터 1줄·페이지별 출처 0·확인일 0) / 다국어 실질
  (그들 상세 페이지는 한국어 단독) / 노선별 에디토리얼(그들 프로즈 0, 템플릿 쓰레기값
  "N15번 버스는 15입니다" 실물 확인) / 환승 계산기(그들 transfer는 일반 안내문) /
  자율주행·로보택시 특화 데이터 / 데이터 품질 규율.
- **복제 금지**: 정류장 전량 페이지화(우리 데이터로 234곳은 노선 1개 — 그대로 만들면
  그들보다 얇음), 동일 데이터 Q&A 재서술로 FAQPage 채우기, 무출처 스칼라 문장화,
  title이 표방하는 "도착시간" 콘텐츠 부재(표방-실체 불일치), `user-scalable=no`.

## H. 구조 판정 (Q10~Q14)

- **STATIC-FIRST 확정.** 엔터티 수백·저빈도 변경·검증 후 커밋 규율과 일치.
- **외부 API: 현재 불필요.** 좌표도 OA 계열 build-time 데이터셋 추출로 충분(런타임 API 아님).
  실시간류(도착·호출 가능)는 v1 금지 계약 대상이자 사이트가 명시적으로 비제공 선언한 정보.
- **외부 상태 저장소: NO EXTERNAL STATE NEEDED.** §21 체크리스트 전 항목 역할 미증명
  (공유 상태 0, 보호할 API 0, TTL 대상 0, 사용자 상태 0, build-time 생성 충분).
- 도입 trigger: 실시간 API 도입 / 사용자 저장 상태 / build 시간 초과 / 요청 시점 외부
  fetch / 다중 인스턴스 — 이 중 하나가 생기기 전에는 Upstash/Redis/KV/DB 논의 금지.
- fallback: repo 커밋 = last-known-good snapshot 그 자체. 향후 API 도입 시에도
  build-time fetch → validate → snapshot 커밋 → 실패 시 직전 snapshot 유지 + asOf 표시.

## I. 저가치 위험 판정 (Q6·§13)

- **267 Stop 전량 페이지 생성 금지 (포그린 확정).** 특히 단일 노선 정류장 234개의
  기계적 URL화 금지 — "가치가 별로 없는 콘텐츠" 거절 직후 최악의 대응.
- 독립 페이지 품질 게이트(후보 기준): 다노선 공유 / 기점·종점·반환점 / 독립 에디토리얼 /
  N버스 연결 / 기타 실제 decision value 중 1개 이상. 이 기준의 후보 규모 약 60~80.
  **정확한 신규 URL 정책은 Phase 1B 이후 결정** (지금 확정 아님).

## J. 확정된 설계 결정 (포그린 검수 반영)

1. **web Graph SSOT = `web/data/routes.json`** (원본 무수정, 파생 레이어만)
2. **엔터티 3층 모델**: `Route → StopVisit(routeId, seq) → Stop(ARS stopId)` —
   같은 노선이 같은 stopId를 2번 지나는 실데이터(D절) 때문에 2층 모델로는 순서
   그래프가 성립하지 않는다. prev/next·방향은 StopVisit 층, 노선 간 join은 Stop 층.
3. **267 ARS = 원자 identity. 177 물리 그룹 = 보조 grouping 후보일 뿐** —
   병합 금지, URL 단위 결정은 Phase 1B 프로토타입 후로 유보.
4. 방향 모델: 왕복형(반환점 기준 seq 비교)과 순환형(첫=마지막 stopId 등)을 동일 규칙으로
   처리하지 않는다. loop를 상/하행으로 오분류 금지. enum 명명은 미확정.
5. 신규 dependency 0 (zod·graph lib·테스트 러너 신규 설치 금지).
6. 영문명은 기존 C2E 계약 승계(`getOfficialStopNameEn` 단독, nameKo fallback) —
   별도 영문명 SSOT 신설 금지.

## K. Phase 1A 수치 QA 매트릭스 (구현 시 자동 검증 대상)

```
Routes                         11
Unique ARS Stops               267
StopVisits/raw memberships     307
Multi-route Stops              33   (=2노선 28 / =3노선 5)
Same-name direction pairs      90   (전부 같은 노선 왕복)
stopId null                     0
stopId/name conflicts           0
Official EN names              261  / Fallback 6
isTurnaround per Route          1
동일 route 내 stopId 반복        2건 (02247, 13156) — 반복 occurrence에서도 prev/next 정확
순환형/왕복형 분류               loop를 outbound/inbound로 오분류 0
shared-stop relation            StopVisit 중복으로 부풀려지지 않음
```

- 숫자 하드코딩 PASS 금지 — SSOT에서 계산된 결과가 기준과 일치해야 한다.
- Phase 0 숫자와 실제 의미가 다르면 숫자를 맞추지 말고 BLOCK/이견 보고.

## L. 제품 목표 (잠금)

> "서울에서 지금 어디서 무엇을 타야 하는지, 공식 근거와 함께 판단할 수 있는
> 한·영 심야 이동 서비스."

기능 채택 기준은 이 문장이다. URL 수·글자 수·SEO 점수·경쟁 기능 복제는 근거가 아니다.
Connected Transit Graph는 이 목표의 기반이다. N버스 14개 데이터는 별도 대형 공식 조사
라운드로 이월하되 **최종 목표(심야버스+자율주행버스+자율주행택시 통합 이동망)에 반드시 포함**.

## M. 확정 순서

```
Phase 0 docs 정본화(이 문서) → docs push 승인/완료
→ Phase 1A Graph Core (read-only 선보고 지시서 → 선보고 → 최종 지시서 → 구현+QA → 승인)
→ 별도 Robotaxi Freshness Round
→ Phase 1B A21 vertical slice UX
→ 이후: 기존 노선 페이지 내부 연결 전체 확대 · 지도↔Graph 매핑(115행 수동 테이블,
  SVG 무수정) · 시간 기반 decision service · N버스 데이터 라운드
```

- Phase 1A 선보고 최소 확인 12항목: 실제 타입 구조 / routes consumer / 동일 route 내
  stopId 반복 / 순환형 2개 구조 / isTurnaround semantics / getOfficialStopNameEn consumer /
  테스트 러너 존재 / TS 실행 방법 / graph 모듈 위치 / lint·typecheck·build baseline /
  예상 변경 파일 / validation command.
- 이번 세션 승인 범위는 docs-only commit까지. **push·Phase 1A 구현·배포·서버 변경·
  AdSense 재신청 전부 별도 승인.**
