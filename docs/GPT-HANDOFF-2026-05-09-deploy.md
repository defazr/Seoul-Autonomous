# GPT Handoff — 2026-05-09 (배포 완료)

> 이 문서 하나로 세션이 바뀌어도 이어갈 수 있음.

---

## 한 줄 요약

서울 자율주행 가이드 웹사이트. 55 정적 페이지. Polish 전부 완료. seoulautonomous.com 배포 완료. Caddy 사고 발생 후 복구 완료.

---

## 현재 상태

**빌드:** 55 정적 페이지, npm run build 통과
**마지막 커밋:** `559b498` (output standalone)
**도메인:** seoulautonomous.com (라이브)
**서버:** Vultr 158.247.252.172, Docker, Caddy reverse proxy

### 이번 세션 작업

| 작업 | 커밋 |
|------|------|
| Polish #2 #5 #6 #15 + SegmentedControl spacing | 2b26c6b |
| SITE_URL seoulautonomous.com 변경 | df24769 |
| output: standalone 추가 | 559b498 |

### 배포 내역
- Docker 컨테이너 `seoul_autonomous_web` 생성 (포트 3000)
- Caddy에 seoulautonomous.com + www 리다이렉트 블록 추가
- HTTPS Let's Encrypt 인증서 자동 발급
- / → /en 리다이렉트 (next-intl defaultLocale: en)

### Caddy 사고 (복구 완료)
- 배포 과정에서 docker restart로 인해 기존 사이트(debt/vat/calc) Caddy 블록 누락
- 호스트 Caddyfile과 컨테이너 내부 설정 불일치가 원인
- 3개 블록 복원 → caddy reload → 전체 8개 사이트 200 확인
- 최종 정상 백업: Caddyfile.bak.recovered-20260509
- 재발 방지 원칙 확정 (MEMORY.md + caddy-incident.md 참조)

---

## 서버 Caddyfile 블록 (6개)

1. apps.newsforgreens.com → web:3000
2. seoulautonomous.com → seoul_autonomous_web:3000
3. www.seoulautonomous.com → redir seoulautonomous.com
4. debt.newsforgreens.com → debt-workbench-web:3000
5. vat.newsforgreens.com → vat_web:3000
6. calc.fazr.co.kr → calc_fazr_web:3000

---

## 검증 완료 항목

| 항목 | 결과 |
|------|------|
| https://seoulautonomous.com/ | /en 리다이렉트, :3000 없음 |
| https://seoulautonomous.com/en | 200 |
| https://seoulautonomous.com/ko | 200 |
| https://www.seoulautonomous.com | 301 → non-www |
| sitemap.xml | seoulautonomous.com 기준 URL |
| robots.txt | Allow: / + sitemap URL |
| 404 응답 | 존재하지 않는 URL → 404 |
| Googlebot | 200 |
| Yeti (Naver) | 200 |
| debt.newsforgreens.com | 200 |
| vat.newsforgreens.com | 200 |
| calc.fazr.co.kr | 200 |
| apps.newsforgreens.com | 200 |

---

## 남은 작업

### 즉시
1. 캡처 검증 → 디자인 클로드에게 전달
2. Google Search Console 등록 + sitemap 제출
3. 네이버 서치어드바이저 등록 + sitemap 제출

### 장기
- / → /ko 리다이렉트 검토 (네이버 색인 유리)
- support@seoulautonomous.com 메일 설정 (현재 support@fazr.co.kr 유지)
- Vultr 커널 보안 패치 (CVE-2026-31431)

---

## 참조 문서

```
docs/HANDOFF.md — 마스터 핸드오프
docs/SESSION-HANDOFF.md — 세션 핸드오프
docs/strategy/AEO-EXPANSION-STRATEGY-2026-05-06.md — AEO 전략
SSOT.md / CLAUDE.md / docs/DECISIONS.md
```

## Caddy 운영 원칙 (사고 후 확정)

- 호스트 + 컨테이너 내부 Caddyfile 둘 다 확인
- docker restart 금지 — validate → reload만
- 블록 수 ≠ 컨테이너 수 → 중단 후 보고
- dry-run → 승인 → write → validate → reload
- 배포 후 기존 사이트 헬스체크 필수
