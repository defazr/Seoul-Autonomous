# Round 10F-SEO — sitemap, robots, OG, JSON-LD 정리

> Date: 2026-05-05
> Status: Complete
> Type: implementation

## Summary

배포 전 SEO 인프라 일괄 구축. sitemap.xml(38 URL), robots.txt, 전역 OG/hreflang, WebSite JSON-LD(Home), BreadcrumbList JSON-LD(8개 페이지 유형). 신규 i18n 키 0개.

## 구현 범위

- sitemap.ts: 38 URL (8 정적 페이지 × 2 locale + 11 노선 × 2 locale), design-preview 제외
- robots.ts: Allow / + Disallow /design-preview + Sitemap
- layout.tsx: 전역 OG (site_name, type, locale), Twitter card (summary), hreflang (en ↔ ko)
- Home: WebSite JSON-LD
- 8개 페이지 유형: BreadcrumbList JSON-LD (Route Detail은 3단계, 나머지 2단계)
- FAQ: FAQPage + BreadcrumbList 2개 분리 임베드

## 검증 (프로덕션 빌드 기준)

| 체크 | 결과 |
|------|------|
| 빌드 | 45 페이지 |
| sitemap.xml | 38 URL, design-preview 제외 |
| robots.txt | 정상 |
| OG og:site_name | "Seoul Autonomous" |
| hreflang | en ↔ ko 상호 참조 |
| WebSite JSON-LD | Home 정상 |
| BreadcrumbList | 8개 페이지 유형 정상 |
| FAQ 이중 JSON-LD | FAQPage + BreadcrumbList 분리 |

## 후속 라운드 후보 기록

- og:image 제작 (이번 라운드 미적용 — 이미지 확정 후 추가)
- og:image 추가 시 Twitter card를 summary → summary_large_image로 변경
- Turbopack dev 모드 JSON parse 에러 (프로덕션 빌드는 정상). Turbopack 안정화 시 재점검.
