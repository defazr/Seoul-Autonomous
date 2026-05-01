# A504 모니터링

> 새벽A504 자율주행 노선의 카카오맵 등재 추적.

## 노선 정보 (서울시 보도자료 기준)

- 노선명: 새벽A504 자율주행
- 운행 구간: 금천구청 <-> 시청역 (17.6km)
- 개통일: 2026-04-29
- 운행 요일: 평일
- 첫차: 03:30
- 요금: 무료 (당분간)
- 운영사: 서울시 주관

## 모니터링

- [ ] 2026-04-30: 카카오맵 등재 확인
- [ ] 등재 확인 시 routes.json에 추가
- [ ] 미등재 시 며칠 더 대기 후 재확인

## 등재 확인 절차

1. 카카오맵에서 "새벽A504" 검색
2. "서울시 제공" 표시 확인
3. 운행 구간/시간/배차 정보 캡처
4. routes.json에 노선 데이터 추가:
   - id: saebyeok-a504
   - verificationLevel: kakao_seoul_verified
   - lastChecked: 확인 날짜
   - sourceNote: "Kakao Map (Seoul Metropolitan Government) verified at HH:MM KST"
5. _pendingRoutes에서 saebyeok-a504 제거
