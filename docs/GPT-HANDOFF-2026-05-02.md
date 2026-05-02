# GPT Handoff — 2026-05-02

> Claude Code → GPT 검토용 핸드오프 문서

## 세션 요약 (2026-05-01 ~ 05-02)

### 완료 작업

1. **A504 routes.json 승격** (커밋 27fe6d0)
   - _pendingRoutes → fixedRoutes (kakao_seoul_verified)
   - stops 스키마 시범 적용 (32개 정류장)

2. **Day 2 Part 2: Home 화면** (커밋 5adc8e3)
   - Featured 4 routes (cheonggye, cheongwadae, sangam-a21, simya-a21)
   - Hero 동적 카운트 ("11 ROUTES VERIFIED")
   - LangToggle, RouteCard 컴포넌트
   - Korean font fallback 버그 수정 포함

3. **Day 2 Part 3: Routes 화면** (커밋 5ac6370, a887a3e)
   - SegmentedControl (All/Bus/Robotaxi)
   - RobotaxiCard (official_pending → CHECK BEFORE RIDING)
   - Settings i18n 전면 교체 (하드코딩 → i18n 키)

4. **Day 2 Part 4: How to Ride 화면** (커밋 91f4bb6)
   - HeroCard, FAQ accordion, StepCard 2x2, KakaoCard
   - 모든 콘텐츠 SSoT 기준 새로 작성 (시안 복사 X)
   - StepCard flexBasis 48% 그리드 수정 포함

5. **Stops 일괄 보강** (커밋 5a29ae7, 1f57585, 09a309a, ddf0429)
   - 4개 배치로 fixedRoutes 11/11 stops 완료
   - 총 307개 정류장
   - 가상 미정차 정류장 제외 (cheongwadae 1개, simya 4개)

6. **Day 2 Part 5: Route Detail 화면** (커밋 3e5122c)
   - RouteDiagram (회차 기준 2단)
   - InfoCard 2x2 (Hours, Days, Stops, Verified)
   - StopsList (접힘/펼침)
   - MapLinkButtons: Kakao Map only (Google 제거)
   - Naver Map은 v1.1 후보로 보류

7. **Polish 라운드** (커밋 3f2b594)
   - Home subtitle 제거
   - RouteCard truncate 제거
   - Settings Korean date format
   - FAQ 모두 접힘 기본
   - formatDate 공통 헬퍼 추출

### 현재 앱 상태

```
5화면 완성 + Polish 완료
tsc clean, expo export 2.98 MB
fixedRoutes 11/11 stops (307개)
onDemandServices 1개 (official_pending)
_pendingRoutes 3개
```

### GPT 검토 포인트

1. **정확성 원칙 준수 확인**
   - 모든 Unknown 필드 → "—" 표시
   - 실시간 표현 0건 (grep 검증 완료)
   - 데모 데이터 흔적 0건
   - nameEn 임의 번역 0건 (307개 전부 null)

2. **외부 링크 정책**
   - Google Maps 제거 (한국 자율주행 노선 미지원)
   - Kakao Map 단독 (SSoT 검증 출처)
   - Naver Map URL 확인됨 (bus-route ID 보유) → v1.1 후보

3. **다음 단계 추천**
   - v1 출시 준비 (앱 아이콘, 스플래시, Privacy/Terms)
   - Gemini 리서치로 Unknown 필드 보강
   - 웹 작업 (autonomous.fazr.co.kr)

4. **Settings "Information verified" 라벨**
   - 현재: SSoT 확정일 (2026-04-29)
   - Route Detail: 노선별 lastChecked (2026-05-01)
   - 두 날짜의 의미가 다름 → 라벨 명확화 v1.1 후보

### SSoT 변경 여부

**없음.** SSoT 4개 파일 Day 1 배치 후 미변경.

---

다음 세션: v1 출시 준비 또는 데이터 보강 (포그린 결정).
