# GPT Handoff — 2026-04-29

> Claude Code → GPT 검토용 핸드오프 문서
> 이 문서는 GPT가 다음 세션에서 태클/검토할 때 참고하는 문서입니다.

## 오늘 한 일 요약

### Day 1: 프로젝트 초기화
- Expo SDK 54 + TypeScript + expo-router v6 프로젝트 생성
- SSoT 4개 파일 배치 (SSOT.md, CLAUDE.md, docs/DECISIONS.md, data/routes.json)
- routes.json에 `_meta` 필드 추가 (stage: seed, publicReady: false)
- 5개 placeholder 화면 (Home, Routes, How to Ride, Settings, Route Detail)
- NativeWind v4 + Tailwind CSS 3.3.2 설정
- i18next (en/ko) 다국어 초기화
- expo-doctor 17/17 통과, Android 번들 성공

### Day 2 Part 1: 디자인 시스템 구축
- Claude Design 시안 zip 분석 → `/docs/worklogs/design-analysis.md`
- **tokens.ts 전면 보강** (colors_and_type.css 기준으로 정렬)
  - fg: 3단계 → 5단계
  - border: 0 → 3단계
  - accent: DEFAULT만 → hi/lo/glow/faint 추가
  - status: Tailwind 기본값 → CSS Geist 계열로 교정
  - typography: 없음 → 11단계 type scale
  - radius: 4단계 → 7단계
  - shadows 추가
- tailwind.config.js 동기화
- 폰트 8개 셋업 (Geist 4w + GeistMono 1w + Pretendard 3w)
- react-native-svg + 22개 아이콘 컴포넌트
- 공통 UI 컴포넌트 8개 (Pill, StatusDot, Button, Card, KrLine, SectionHeader, Eyebrow, TopBar)
- Tab 네비게이션 (커스텀 아이콘 + 시안 스타일)
- **Settings 화면 완전 구현** (i18n 언어 전환, About, Legal)

## 현재 상태

```
✅ Expo 프로젝트 초기화
✅ SSoT 4개 파일 배치
✅ 디자인 토큰 CSS 기준 정렬
✅ 폰트 + 아이콘 시스템
✅ 공통 컴포넌트 8개
✅ Settings 화면
✅ tsc --noEmit clean
✅ expo export --platform android OK (2.88 MB)

🔄 Home 화면 (다음)
🔄 Routes 화면
🔄 How to Ride 화면
🔄 Route Detail 화면
```

## GPT 검토 요청 사항

### 1. tokens.ts vs CSS 정렬 확인
- `/lib/design/tokens.ts`가 `/design-references/colors_and_type.css`와 일치하는지
- 특히 status 색상: success=#45A557, warning=#FFB224, danger=#E5484D, info=#0072F5

### 2. 데이터 원칙 준수 확인
- routes.json 임의 수정 안 했는지
- 시안 데모 데이터(sangam-a01/a02/a03) 사용 안 했는지
- 실시간 표현 없는지

### 3. Home 대표 노선 4개 (포그린 확정) 적절성
1. cheonggye-a01 (청계A01) — 관광
2. cheongwadae-a01 (청와대A01) — 외국인 랜드마크
3. sangam-a21 (상암A21) — DMC 미래도시
4. simya-a21 (심야A21) — 심야 차별성

### 4. Route Detail 사전 결정 필요
- routes.json에 stops 배열이 아직 없음
- Route Detail 구현 전에 stops 데이터를 어떻게 넣을지 결정 필요
- 옵션: (a) Gemini 리서치로 보강 (b) 카카오맵 재확인 후 수동 입력 (c) placeholder로 일단 진행

### 5. 폰트 라이선스
- Geist: Vercel 제공, SIL Open Font License — OK
- Pretendard: 길형진 제작, SIL Open Font License — OK
- 둘 다 상업적 사용 가능, 앱 번들 포함 가능

## 파일 구조 (주요 변경)

```
seoul-autonomous/
├── SSOT.md, CLAUDE.md, README.md
├── app.json (dark theme, scheme, package name)
├── babel.config.js (babel-preset-expo only)
├── metro.config.js (withNativeWind)
├── tailwind.config.js (CSS 기준 동기화)
├── global.css (tailwind directives)
├── app/
│   ├── _layout.tsx (font loading + splash)
│   ├── (tabs)/_layout.tsx (4 tabs + custom icons)
│   ├── (tabs)/index.tsx (Home placeholder)
│   ├── (tabs)/routes.tsx (Routes placeholder)
│   ├── (tabs)/how-to-ride.tsx (placeholder)
│   ├── (tabs)/settings.tsx (✅ 구현 완료)
│   └── route/[id].tsx (Detail placeholder)
├── components/
│   ├── ui/ (Pill, StatusDot, Button, Card, KrLine, SectionHeader, Eyebrow, icons)
│   └── layout/ (TopBar)
├── lib/
│   ├── design/tokens.ts (✅ CSS 기준 보강)
│   └── i18n/ (index.ts, en.json, ko.json)
├── data/routes.json (SSoT, v0.1 seed)
├── assets/fonts/ (8 font files)
├── design-references/ (gitignored, 시안 원본)
└── docs/
    ├── DECISIONS.md
    └── worklogs/ (design-analysis.md, data-enrichment-todo.md, a504-monitoring.md)
```

## SSoT 변경 여부

**없음.** SSoT 4개 파일은 Day 1에 배치한 그대로. tokens.ts 보강은 작업 디테일 반영이며 SSoT 변경이 아님.

---

다음 세션: Day 2 Part 2 — Home 화면 구현부터.
