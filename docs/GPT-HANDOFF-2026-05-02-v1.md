# GPT Handoff — 2026-05-02 (v1 APK 완성)

> Claude Code → GPT 검토용 핸드오프 문서
> 이전 핸드오프: GPT-HANDOFF-2026-05-02.md (세션 2)

## 세션 요약 (2026-05-02 세션 3)

v1 출시 준비 전체 완료. EAS Build로 Android APK 빌드 성공.

### 완료 작업 — 커밋 순서

1. **app.json 정비** (c7cf092)
   - scheme: seoul-autonomous → seoulautonomous (하이픈 제거)
   - android.package: com.fazr → kr.co.fazr.seoulautonomous
   - ios.bundleIdentifier: kr.co.fazr.seoulautonomous 추가

2. **앱 아이콘 + 스플래시** (91d96d8)
   - icon.png: SA 모노그램 풀 캔버스 (1024x1024, 네이비 배경)
   - adaptive-icon.png: SA 중앙 배치 (safe zone 여백)
   - splash-icon.png: adaptive-icon과 동일
   - 소스 1254x1254 → 1024x1024 리사이즈
   - splash/adaptive backgroundColor: #000000 → #0A1428

3. **Legal 콘텐츠** (29a6e8d)
   - lib/legal/types.ts: LegalDocument, LegalSection, LegalSubsection, LegalContact
   - privacy.en.ts (8 sections), privacy.ko.ts (8 sections)
   - terms.en.ts (11 sections, 3 subsections), terms.ko.ts (11 sections)
   - Contact: fazr, support@fazr.co.kr

4. **LegalDocumentScreen 컴포넌트** (35ce3de)
   - components/legal/LegalDocumentScreen.tsx (323줄)
   - Route Detail 패턴 따라감 (inline TopBar, ScrollView, isKo 분기)
   - Markdown bold (**text**) splitting 헬퍼
   - Section → Subsection → BulletList 재귀 렌더링
   - Contact 블록 구분선 포함

5. **Legal 라우트** (b0df168)
   - app/legal/privacy.tsx, terms.tsx
   - i18n 언어에 따라 EN/KO 문서 선택

6. **Settings Legal 연결** (e10d2eb)
   - onPress={() => {}) → router.push('/legal/privacy'), '/legal/terms'
   - useRouter import + hook 추가

7. **Routes 검색 기능** (cfb2e01)
   - TextInput 검색바 (SegmentedControl 위)
   - matchQuery: displayName, displayNameKo, startPoint/Ko, endPoint/Ko
   - 대소문자/공백 무시 + 부분 매칭
   - SegmentedControl과 AND 동작
   - i18n 키 추가 (search.placeholder, search.empty)
   - IconFilter 제거, IconSearch 사용

8. **로보택시 라벨** (39f9529)
   - "Kakao T required" → "Kakao T (Korean app) required" (영문만)

9. **Pill 간격 수정** (1f358ac)
   - Pill 컴포넌트: Text wrapper 제거 → children 직접 렌더링
   - flexDirection:row + gap:6 정상 작동하도록

10. **EAS Build 환경** (762888a, 7c3adae)
    - eas-cli 18.9.1 설치
    - EAS 로그인 (thisiz43)
    - eas init → projectId + owner 자동 추가
    - eas.json: development, preview (APK), production 프로필
    - .npmrc: legacy-peer-deps=true (빌드 실패 해결)

11. **MVP 제거** (2ebf54d)
    - Settings footer: "SEOUL AUTONOMOUS · MVP" → "SEOUL AUTONOMOUS"
    - APP_VERSION: "1.0.0 (MVP)" → "1.0.0"

### v1 APK 빌드

```
빌드 ID: ee05e46a-c05a-478e-a120-21e080d8f647
플랫폼: Android (APK)
프로필: preview
상태: 성공
```

첫 빌드 실패 원인:
- EAS npm ci에서 package-lock.json 동기화 실패
- .npmrc legacy-peer-deps=true 추가로 해결
- package-lock.json 재생성은 위험 (Linux 바이너리 삭제됨) — 하지 말 것

### 시각 확인 통과 항목

- 앱 아이콘 (SA 모노그램) 정상
- 스플래시 스크린 (네이비 배경) 정상
- Routes 검색 작동 (한/영, AND 필터)
- Legal 화면 (Privacy/Terms) 정상 진입 + 뒤로가기
- Robotaxi "Kakao T (Korean app) required" 라벨
- Settings 푸터 "SEOUL AUTONOMOUS" (MVP 제거)
- Settings 버전 "1.0.0"
- Pill StatusDot-텍스트 간격 정상

### GPT 검토 포인트

1. **Legal 문서 정확성**
   - Privacy Policy: 데이터 수집 0건 명시 (SDK audit 검증됨)
   - Terms of Use: "Not Real-Time" 면책 명시
   - Contact: support@fazr.co.kr (신규 생성 확인됨)

2. **검색 기능 범위**
   - 노선명 + 출발/도착지 (6필드)
   - 정류장명 검색: v1.1 보류 (307개 full scan 부담)
   - 초성 검색: v1.1 보류

3. **빈 onPress 전수 확인**
   - 0건 (audit + 시각 확인)
   - Routes 필터 아이콘(IconFilter)은 View로 감싸져 있었음 → 검색바로 교체됨

4. **빌드 안정성**
   - .npmrc 없으면 빌드 실패
   - package-lock.json 재생성 금지 (Linux 바이너리 제거됨)
   - 향후 의존성 추가 시 주의 필요

### SSoT 변경 여부

**없음.** SSoT 4개 파일 Day 1 배치 후 미변경.

### 파일 구조 변경 (이번 세션)

```
신규:
  .npmrc
  eas.json
  lib/legal/types.ts
  lib/legal/privacy.en.ts
  lib/legal/privacy.ko.ts
  lib/legal/terms.en.ts
  lib/legal/terms.ko.ts
  components/legal/LegalDocumentScreen.tsx
  app/legal/privacy.tsx
  app/legal/terms.tsx

수정:
  app.json (scheme, package, bundleIdentifier, projectId, owner, splash bg)
  app/(tabs)/settings.tsx (useRouter, legal onPress, MVP 제거)
  app/(tabs)/routes.tsx (검색 기능, IconFilter→IconSearch)
  assets/icon.png (커스텀 SA 모노그램)
  assets/adaptive-icon.png (커스텀)
  assets/splash-icon.png (커스텀)
  components/ui/Pill.tsx (Text wrapper 제거)
  lib/i18n/en.json (search keys, appRequired, footer MVP)
  lib/i18n/ko.json (search keys, footer MVP)
```

### 다음 단계

1. **웹 공개** (autonomous.fazr.co.kr)
   - react-dom, react-native-web 설치 필요
   - favicon.png 교체 (현재 Expo 기본 48x48)
   - 도메인 DNS (fazr.co.kr Cloudflare)
   - 호스팅: Cloudflare Pages 추천

2. **v1.1 보류 항목**
   - routes.json Unknown 필드 보강 (Gemini)
   - 정류장명 검색, 초성 검색
   - 영문 stops 데이터
   - iOS 빌드
   - Naver Map 외부 링크

---

v1 APK 확정. 다음 세션: 웹 공개 또는 데이터 보강 (포그린 결정).
