# Round 12 — VERIFIED 칩 겹침 핫픽스

> **Date**: 2026-05-10

## 진단 결과

디자인 클로드가 `position: absolute`를 원인으로 지목했으나, 실제 코드에는 absolute 없음.
실제 원인: Pill 컴포넌트에 `flex-shrink: 0`가 없어 좁은 뷰포트에서 칩이 눌릴 수 있고,
`.name`에 overflow 처리가 없어 긴 이름이 칩 영역까지 침범 가능.

## 수정 내용

### 1. Pill.module.css — `flex-shrink: 0` 추가
- 전역 수정: 모든 Pill 사용처에서 flex context 내 축소 방지
- Pill은 `white-space: nowrap`이므로 축소되면 안 됨

### 2. RouteCard.module.css — `.name`에 ellipsis 처리
- `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` 추가
- 긴 이름이 칩과 겹치지 않고 말줄임 처리

## 동종 패턴 grep 결과

| 위치 | 칩 사용 | 겹침 위험 | 수정 |
|------|---------|----------|------|
| RouteCard (.topRow) | VERIFIED / OFFICIAL | ⚠️ 있었음 | ✅ Pill flex-shrink + name ellipsis |
| RobotaxiCard (.topRow) | CHECK BEFORE RIDING / OFFICIAL | ✅ flex-wrap: wrap 이미 있음 | ✅ Pill flex-shrink 자동 적용 |
| Route Detail (.statusGroup) | VERIFIED | ✅ 독립 그룹, 겹침 없음 | ✅ Pill flex-shrink 자동 적용 |
| FeaturedRoutes | RouteCard 재사용 | ✅ 동일 수정 자동 적용 | ✅ |
| early-morning / late-night | RouteCard 재사용 | ✅ 동일 수정 자동 적용 | ✅ |

**동종 케이스 5개 발견, 전부 Pill.module.css 1줄 수정으로 일괄 해결.**

## 변경 파일

- `web/components/ui/Pill.module.css` — flex-shrink: 0 추가 (+1줄)
- `web/components/ui/RouteCard.module.css` — .name에 overflow ellipsis (+3줄)

## 빌드 결과

56/56 통과. CSS 빌드 출력에서 `flex-shrink:0` (Pill), `text-overflow:ellipsis` (RouteCard .name) 확인.
