# Round 13 — RouteCard 제목 wrap 복원

> **Date**: 2026-05-10

## 원인

Round 12에서 칩 겹침 방지를 위해 `.name`에 ellipsis 처리를 추가했으나,
이는 노선 이름을 잘라버리는 결과를 낳음.
의도는 자연 줄바꿈(wrap)이었으나, 실행은 잘림(truncate)이었음.

## 수정 내용

`web/components/ui/RouteCard.module.css` `.name`에서 Round 12 추가분 3줄 제거:
- `overflow: hidden` 제거
- `text-overflow: ellipsis` 제거
- `white-space: nowrap` 제거

Pill의 `flex-shrink: 0` (Round 12)은 유지.

## 기대 동작

- 긴 이름: 자연 단어 단위 줄바꿈 (예: "Cheongwadae\nA01")
- 짧은 이름: 한 줄 유지 (예: "Simya A21")
- 칩: 우측 고정, 축소 안 됨 (flex-shrink: 0)
- 카드 높이: 긴 이름에서 약간 증가 허용

## 변경 파일

- `web/components/ui/RouteCard.module.css` — 3줄 제거 (-3)
