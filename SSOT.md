# Seoul Autonomous - SSoT

> 헌법. 변하지 않는 핵심 원칙만. 디테일은 작업 중 결정.

## 11개 합의 항목 (3자 합의 + 포그린, 2026-04-29)

### 1. 정체성
- Seoul Autonomous: 외국인용 자율주행 체험 가이드 (앱 + 웹)
- 교통 앱이 아님

### 2. 기술 스택 (v1)
- 앱: Expo + TypeScript
- 웹: Next.js 16.2.4, autonomous.fazr.co.kr (별도 운영)
- 데이터: 정적 routes.json (앱/웹 공유)
- 다국어: 영어 기본, 한국어 보조

### 3. MVP 화면 (앱)
Home / Routes / Route Detail / How to Ride / Settings

### 4. 1차 제외
실시간/푸시/즐겨찾기/회원가입/결제/AdMob/지도SDK/API 직접호출

### 5. 디자인
- Geist 스타일 참고 (컴포넌트는 내부 재구성)
- 다크 테크, 시안 포인트, 미니멀
- 카카오 브랜드 로고 직접 사용 X

### 6. 지도
- 정적 노선 이미지 + 외부 링크 (Google Maps, Kakao Map)
- v1에서 SDK 연동 X

### 7. 데이터 원칙 (8조)
1. 앱 본체 API 호출 X (v1)
2. routes.json 공식 출처 기반 수동 관리
3. 나무위키/블로그/커뮤니티 출처 X
4. 카카오맵 서울시 제공 = 검증 근거
5. 요금/운영사 등은 별도 공식 출처 검증
6. 출처 불확실 = Unknown
7. lastChecked, verificationLevel, sourceUrls 필수
8. 실시간 표현 X

### 8. 1차 노선
- Fixed routes 11개 (카카오맵 서울시 제공 검증)
- On-demand 1개 (Gangnam Robotaxi)

### 9. 보류 노선
상암A01, 상암A02, 여의도A01

### 10. 표현 규칙
- 권장: RECENTLY VERIFIED, CHECK BEFORE RIDING, Last checked, Please confirm before riding
- 금지: Operating now, Live today, Arriving in N min, Real-time, Currently running

### 11. 웹 SEO 전략
- 앱 작게 (5화면), 웹 넓게 (1차 30~35페이지)
- /ko, /en 다국어 URL
- 검증된 노선만 페이지 생성 (Coming Soon, noindex 임시 페이지 X)
- 노선 추가 = routes.json 업데이트 → 한/영 페이지 자동 생성

**[추가] 웹 정보성 페이지 원칙:**
- 노선 자동 페이지만으로 구성하지 않음
- FAQ, How to Ride, Updates, Support, Privacy 정보성 페이지 함께 운영
- JSON-LD: FAQ는 FAQPage, Updates는 Article/BlogPosting, 노선 상세는 BreadcrumbList
- Updates는 노선 변경/추가/검증일 갱신/보류 상태 변경 기록
- 한 줄짜리 얇은 업데이트 글 X

**[추가] On-demand 처리 규칙:**
- Gangnam Robotaxi는 v1 정보 카드로 포함 가능
- official_pending 상태에서는 별도 상세 페이지 생성 X
- official_confirmed로 올라간 후 상세 페이지 생성

## 5인 체제

```
포그린       총감독 / 최종결정
Claude       지시서 / 진행 컨트롤
GPT          태클 / 검토
Gemini       리서치 / 이미지
Claude Code  코딩 (지시서만 따름)
```

Claude Code는 합의 판단 X. 포그린 지시서만 실행.

## SSoT 운영 원칙

- 처음 한 번만 합의로 확정 (이번이 그 한 번)
- 그 다음부터는 흐름대로 작업
- 작업 디테일은 SSoT 갱신 X
- SSoT 변경은 명시적 재논의 + 5인 합의

---
This is the constitution. Details belong elsewhere.
