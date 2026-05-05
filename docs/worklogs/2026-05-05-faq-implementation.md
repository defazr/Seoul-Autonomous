# Round 10D-FAQ — FAQ 페이지 + FAQPage JSON-LD

> Date: 2026-05-05
> Status: Complete
> Type: implementation

## Summary

FAQ 페이지 구현. 8문항(en/ko) 확정문 데이터 파일 + FAQList 컴포넌트 + FAQPage JSON-LD 임베드. 빌드 41→43 페이지. 기존 페이지 변경 0건.

## 구현 범위

- `/en/faq`, `/ko/faq` — 2페이지
- 신규 컴포넌트: FAQList (dl/dt/dd 시맨틱 마크업)
- 데이터: web/data/faq/faq.{en,ko}.ts — 8문항 확정문
- i18n: faq.* 4키 + metadata 2키 = 12키
- JSON-LD: FAQPage 구조화 데이터, 8문항 포함

## 답변 출처 매핑

| ID | 질문 | sourceTags |
|----|------|-----------|
| q1 | How to ride | how-to-ride |
| q2 | Where | routes.json |
| q3 | Reservation | routes.json, how-to-ride |
| q4 | Free/fare | routes.json |
| q5 | Real-time | data-source |
| q6 | Before riding | data-source, how-to-ride |
| q7 | International | how-to-ride |
| q8 | Bus vs Robotaxi | routes.json, how-to-ride |

## 검증

| 체크 | 결과 |
|------|------|
| npm run build | 43 페이지 |
| /en/faq, /ko/faq | 200 |
| JSON-LD FAQPage | 8 Questions |
| Cross-link | How to Ride + Data Source 정상 |
| LangToggle | 정상 |
| 기존 페이지 | 변경 0건 |
| 사양 변경 | 없음 |

## 후속 라운드 후보 기록

### FAQ UX 후속 후보
- 질문 수가 늘어나면 카테고리 그룹화 검토
- accordion은 SEO/접근성 영향 확인 후 검토
- Cross-link 터치 영역 강화 검토

지금은 콘텐츠 우선, UX 후순위. 페이지 더 늘어난 후 일괄 UX 라운드가 효율적.

### 기타
- C10 SEO 인프라에서 FAQPage JSON-LD와 sitemap/robots/OG/BreadcrumbList/WebSite 통합 처리
- 기존 페이지에서 FAQ 진입 경로 추가 (NavSync 라운드)
