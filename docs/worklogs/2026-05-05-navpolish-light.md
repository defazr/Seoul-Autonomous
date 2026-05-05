# Round 10G+10H — NavPolish Audit + Light 구현

> Date: 2026-05-05
> Status: Complete

## Summary

디자인/UX 점검(10G) + 軽 4건 구현(10H). SiteFooter 터치 영역 보강, Route Detail CTA, TopBar Home 링크, copyright 문구, SiteFooter Home 링크 추가. SiteFooter 링크를 `<a>` 태그로 변경하여 같은 페이지 클릭 시 상단 이동 보장.

## 구현 4건 + 정정 2건

1. SiteFooter 링크 padding: 10px 0 (터치 영역 보강)
2. Route Detail "View all routes" CTA
3. TopBar topTitle → Home 링크 (6개 페이지)
4. SiteFooter copyright 문구
5. SiteFooter Home 링크 추가 (Routes/Route Detail 포함 전 페이지 Home 동선)
6. SiteFooter `<Link>` → `<a>` 변경 (같은 페이지 클릭 시 상단 이동 보장)

## SiteFooter Link → a 태그 변경 사유

next/link의 같은 URL 클릭 시 스크롤 리셋 안 됨 (SPA 라우터가 동일 경로 무시). `scroll` prop도 효과 없음. `<a>` 태그로 full page reload 방식 전환하여 해결.

## 후속 후보

- 초고속 스크롤 시 클릭 안 되는 현상 (hydration 타이밍 이슈, 재현 빈도 낮음)
- 햄버거 메뉴 (中 라운드)
- Back to Top (보류)
- FAQ accordion (보류)
