# Data Enrichment TODO

> routes.json v0.1 seed 데이터를 공개용 데이터로 보강하기 위한 작업 목록.
> SSoT는 아니며, 작업 진행에 따라 수정/추가 가능.

## Status: v0.1 seed (NOT public-ready)

## 보강 필요 항목 (노선별)

### 모든 fixed routes 공통
- [ ] fare 확정 (현재 Unknown)
- [ ] operator 확정 (현재 Unknown)
- [ ] reservationRequired 확정 (현재 Unknown)
- [ ] appRequired 확정 (현재 Unknown)
- [ ] stops 배열 추가 (Route Detail 구현 전 필수)
- [ ] sourceUrls에 서울시/운영사 공식 URL 추가

### 노선별 daysOfOperation 확정
- [x] saebyeok-a160: weekday (확정)
- [ ] saebyeok-a741: Unknown -> 확정 필요
- [ ] saebyeok-a148: Unknown -> 확정 필요
- [x] simya-a21: weekday (확정)
- [ ] cheonggye-a01: Unknown -> 확정 필요
- [x] dongjak-a01: weekday (확정)
- [ ] dongdaemun-a01: Unknown -> 확정 필요
- [ ] seodaemun-a01: Unknown -> 확정 필요
- [ ] sangam-a21: Unknown -> 확정 필요
- [x] cheongwadae-a01: weekday (확정)

## A504 추가 작업

- [ ] 카카오맵 등재 확인 (2026-04-29 개통)
- [ ] 등재 시 routes.json에 추가 (kakao_seoul_verified)
- [ ] 미등재 시 _pendingRoutes에 유지

## On-demand 보강

### gangnam-robotaxi
- [ ] 카카오모빌리티 공식 출처 URL 확인
- [ ] 운영 시간 확정
- [ ] 운영 요일 확정
- [ ] 요금 확정
- [ ] official_pending -> official_confirmed 승격
- [ ] 승격 후 상세 페이지 생성

## 공식 출처 URL 후보

확인 필요:
- 서울시 영문: world.seoul.go.kr
- 서울시 보도자료: news.seoul.go.kr
- 서울시 미디어허브: mediahub.seoul.go.kr
- 42dot 공식
- SUM 공식
- A2Z 공식
- 카카오모빌리티: policy.kakaomobility.com
- TOPIS: topis.seoul.go.kr

## 작업 순서

1. Day 1 초기화 완료 후 Day 2로 넘어가기 전 stops 배열 보강 작업
2. 화면 구현 진행 중 사용자 노출 전까지 fare/operator 등 보강
3. 첫 빌드 (출시 전 테스트) 시작 전 publicReady: true 확인
