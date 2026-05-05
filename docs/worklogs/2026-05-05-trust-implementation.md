# Round 10A-Trust — Data Source + About 페이지 구현

> Date: 2026-05-05
> Status: Complete
> Type: implementation
> Reference: Round 9D-TrustAudit (커밋 87f0cce), Round 10A 지시서

## 1. Summary

Data Source (`/[locale]/data-source`) + About (`/[locale]/about`) 두 신뢰 페이지 구현 완료. 신규 컴포넌트 0개, 기존 BulletRow/LangToggle 재사용. i18n 64키(en/ko 각 32). 빌드 33→37 페이지. 기존 4페이지 변경 0건.

## 2. 구현 범위

### 페이지
- `/en/data-source`, `/ko/data-source` — 데이터 출처/검증/정확성 정책
- `/en/about`, `/ko/about` — 사이트 소개/데이터 정책 링크/정보 기준 안내

### 컴포넌트
- 신규: 0개
- 재사용: BulletRow (how-to-ride), LangToggle (ui)

### i18n
- `dataSource.*`: 19키
- `about.*`: 9키
- `metadata.*`: 4키 추가
- 합계: en 32키 + ko 32키 = 64키

## 3. 구현 디테일

### C11 Data Source 페이지 구조
```
TopBar (← Home + "Data source" + LangToggle)
h1: "Data source" / "데이터 출처"
p.intro: 1줄 소개
h2: Sources → BulletRow × 2 (bulletCard)
h2: Verification → BulletRow × 5 (bulletCard)
h2: Accuracy → BulletRow × 4 (bulletCard)
h2: Last Checked → body text
Link → /about (인라인)
footerNote (common.footer)
```

### C13 About 페이지 구조
```
TopBar (← Home + "About Seoul Autonomous" + LangToggle)
h1: "About Seoul Autonomous" / "Seoul Autonomous 소개"
p.intro: 1줄 소개
h2: Purpose → body1 + body2 + note
h2: Data Policy → body + Link → /data-source (인라인)
h2: Verification → body
footerNote (common.footer)
```

### 신규 페이지 내부 인라인 링크
- Data Source → About: `dataSource.aboutLink` 키, ArrowRight 아이콘, footerNote 위에 배치
- About → Data Source: `about.dataPolicy.linkLabel` 키, §2 섹션 내부 배치

### Footer 패턴
- ❌ home/Footer 컴포넌트 미사용 (지시서 §2.4 준수)
- ✅ How to Ride 패턴 인라인 footerNote (InfoIcon + common.footer)

## 4. 사양 변경 보고

없음. 지시서 사양 내 구현 완료.

## 5. 빌드/시각 검증 결과

### 빌드
- `npm run build`: 성공
- 정적 페이지: 33 → **37** (+4)
- 신규 라우트: `/[locale]/about`, `/[locale]/data-source`

### 페이지 검증

| 페이지 | HTTP | H1 |
|--------|------|----|
| /en/data-source | 200 | "Data source" |
| /ko/data-source | 200 | "데이터 출처" |
| /en/about | 200 | "About Seoul Autonomous" |
| /ko/about | 200 | "Seoul Autonomous 소개" |

### Cross-link 검증
- /en/data-source → `/en/about` 링크 확인
- /en/about → `/en/data-source` 링크 확인

### LangToggle
- 두 페이지 모두 LangToggle 렌더 확인

### 기존 페이지 영향 없음
- /en (Home): 200
- /en/routes: 200
- /en/routes/cheonggye-a01: 200
- /en/how-to-ride: 200

### 4 viewport CSS 분석
- 375px: max-width 1200px + padding 20px = 유효 335px. BulletRow flex wrap 정상. 제목 24px 반응형
- 768px: 동일 패턴, 여유 충분
- 1280px/1920px: max-width 1200px 제한, 동일 렌더
- 레이아웃 깨짐: 없음
- 가로 스크롤: 없음
- TopBar: 정상
- 인라인 링크: wrap 정상

### 시각 검수 결과 (포그린 브라우저 검수)
시각 검수 중 About / Data Source 컨테이너 폭 동일 확인. 시각적 인상 차이는 bulletCard 유무에 따른 콘텐츠 패턴 차이.

## 6. 절대 금지선 준수 확인

### §6.4 기존 페이지 변경 금지
- [x] Home page.tsx 변경 0건
- [x] Routes page.tsx 변경 0건
- [x] Route Detail page.tsx 변경 0건
- [x] How to Ride page.tsx 변경 0건

### §6.5 기타 변경 금지
- [x] home/Footer.tsx 변경 0건
- [x] InfoCard, BulletRow, LangToggle 변경 0건
- [x] routes.json 변경 0건
- [x] SSoT/DECISIONS/SITE-STRATEGY/CLAUDE/README 변경 0건
- [x] 앱 프로젝트 변경 0건
- [x] 기존 i18n 키 수정 0건 (추가만)
- [x] nav 네임스페이스 변경 0건
- [x] middleware.ts, i18n/* 변경 0건

### §8 절대 금지선
- [x] 신규 컴포넌트 0건
- [x] 공통 FooterLink 컴포넌트 미작성
- [x] verificationLevel enum 사용자 미노출
- [x] 서울특별시 공식 사이트 오인 표현 없음
- [x] 카카오맵 서울시 운영 오인 표현 없음

## 7. 다음 라운드 권고

9B-IA 진행 권고 잔여: C8(Privacy), C9(Terms), C10(SEO 인프라).
Privacy+Terms는 배포 전 필수. SEO 인프라는 페이지 정리 후 일괄 적용이 효율적.

## 8. 후속 라운드 후보 기록

- 기존 페이지(Home, Routes, Route Detail, How to Ride)에서 Data Source/About 진입 경로 추가
- 공통 FooterLink 컴포넌트 도입 여부 검토
- 권고 라운드명 후보: 10B-NavSync
- 별도 라운드(후속)에서 Footer/Navigation 일괄 정리로 처리
