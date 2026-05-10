# Session Handoff

> 마지막 업데이트: 2026-05-10 (SEO + 검색엔진 등록 완료)

## 현재 위치

**48 유저 페이지. SEO 메타 정비 완료. GSC/네이버/다음 등록 완료.**

## 마지막 커밋

`9d217dd` — Naver + Daum 검색 인증 추가

## 배포 상태

- seoulautonomous.com 라이브 (Docker + Caddy)
- HTTPS, www 리다이렉트, sitemap, robots 정상
- / → /en (defaultLocale: en)
- canonical + hreflang(en/ko/x-default) 전 페이지 적용
- OG image + Twitter Card (summary_large_image) 설정 완료
- favicon: icon.png(512) + favicon.ico(multi-size) 정상
- Cloudflare 미사용

## 검색엔진 등록

- Google Search Console: 등록 + sitemap 제출 완료
- 네이버 서치어드바이저: 등록 + sitemap 제출 + /ko 색인 요청 완료
- 다음 웹마스터도구: robots.txt PIN 인증 완료

## 다음 세션 즉시 할 것

1. 모니터링: GSC sitemap 읽힘 / 네이버 수집 / site: 검색 반영
2. 소셜 디버거 캐시 갱신 (FB/X/Kakao/Naver)

### 장기

- / → /ko 리다이렉트 검토
- support@seoulautonomous.com 메일 설정
- Vultr 커널 보안 패치
- 디자인 polish (Round 3~6 로드맵)

## 새 세션 시작 시

1. [ ] 이 문서 읽기
2. [ ] `docs/HANDOFF.md` 읽기
3. [ ] MEMORY.md 확인
4. [ ] **Caddy 작업 시 memory/caddy-incident.md 필독**

## 핵심 아키텍처

- **48 유저 페이지** (빌드 56 라우트): 11 정적 + 11 노선 + 2 업데이트 × 2 locale
- **PageContainer**: default 1120px / longform 720px
- **Route Detail**: 2-column + AEO 7 Q&A + VERIFIED 칩 유지
- **RouteCard (목록)**: VERIFIED 칩 제거 (Round 15)
- **SEO 메타**: buildPageMetadata 헬퍼 (`web/lib/seo/metadata.ts`)
- **robots.txt**: 정적 파일 `web/public/robots.txt` (Daum PIN 포함)
- **CSS Modules 전용**, 다크 톤 + zinc + cyan accent

## 서버 정보

- Vultr 158.247.252.172
- Docker 9개 컨테이너 (compose 아님, 수동 docker run)
- Caddy 6개 도메인 블록
- 정상 백업: Caddyfile.bak.recovered-20260509
- docs/ 변경은 배포 불필요

## Caddy 운영 원칙

- docker restart 금지 — validate → reload만
- 호스트 + 컨테이너 내부 Caddyfile 둘 다 확인
- dry-run → 승인 → write → validate → reload
- 배포 후 기존 사이트 헬스체크 필수
