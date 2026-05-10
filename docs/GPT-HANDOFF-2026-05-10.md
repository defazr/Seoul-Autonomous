# GPT Handoff — 2026-05-10

> SEO 메타 정비 + 검색엔진 등록 완료 세션

## 요약

Round 10~15 + 검색엔진 등록까지 하루에 완료.
사이트 audit → CTA 핫픽스 → SEO 메타(canonical/hreflang/OG/Twitter) → 칩 겹침 해결 → favicon → GSC/네이버/다음 인증.

## 커밋 이력 (오늘)

| 커밋 | 내용 |
|------|------|
| `fa535dc` | Round 10.5: Hero/FeaturedRoutes dead CTA 핫픽스 |
| `1c3cf66` | Round 11: canonical + hreflang + OG + Twitter Card + favicon |
| `a86c50b` | Round 12: Pill flex-shrink:0 (칩 겹침 1차) |
| `c3c7c35` | Round 13: ellipsis 제거, wrap 복원 |
| `ca7f21d` | Round 14: flex-start + break-word (칩 겹침 2차) |
| `8783420` | Round 15: RouteCard에서 VERIFIED 칩 제거 (최종 해결) |
| `c691792` | GSC verification 메타 추가 |
| `5e5b1b3` | 구 favicon.ico 제거 |
| `9b65f14` | 새 favicon.ico (icon.png에서 변환) 복원 |
| `9d217dd` | 네이버 + 다음 인증 메타/PIN 추가 |

## 현재 SEO 구조

### canonical
- 전 페이지 self-canonical (절대 URL)
- `buildPageMetadata` 헬퍼로 일괄 관리 (`web/lib/seo/metadata.ts`)

### hreflang
- 페이지별 en/ko/x-default 정확 매칭
- layout.tsx 하드코딩 제거, 각 page에서 동적 생성

### Open Graph
- og:title, og:description — 페이지별 기존 텍스트 보존
- og:url — canonical과 동일
- og:image — `/og/seoul-autonomous-og.png` (1200x630, 964KB)
- og:image:secure_url, width, height, alt 포함
- og:locale — en_US / ko_KR

### Twitter Card
- `summary_large_image` (기존 `summary`에서 변경)
- twitter:image + alt 포함

### favicon
- `web/app/icon.png` — 512x512 PNG (시안 버스 아이콘)
- `web/app/favicon.ico` — icon.png에서 변환한 multi-size ICO (16/32/48/64/128/256)

### robots.txt
- `web/public/robots.txt` (정적 파일, 기존 robots.ts에서 전환)
- Daum WebMasterTool PIN 코드 포함

### 검증 메타
- Google: `verification.google` in root layout
- Naver: `verification.other['naver-site-verification']` in root layout
- Daum: robots.txt PIN

## 검색엔진 등록 상태

| 서비스 | 상태 | 비고 |
|--------|------|------|
| Google Search Console | 등록 완료 | sitemap 제출, URL 접두어 방식 |
| 네이버 서치어드바이저 | 등록 완료 | sitemap 제출, /ko 색인 요청 |
| 다음 웹마스터도구 | 인증 완료 | robots.txt PIN |

## 칩 겹침 해결 과정 (Round 12~15)

시행착오 기록 (향후 참고):
1. Round 12: Pill에 flex-shrink:0 + name에 ellipsis → 이름 잘림 발생
2. Round 13: ellipsis 제거 → 원래 겹침 상태로 복귀
3. Round 14: topRow align-items:flex-start + overflow-wrap:break-word → 3줄 강제 wrap
4. **Round 15: RouteCard에서 칩 자체를 제거 (최종)**
   - 핵심 통찰: 12개 카드 모두 VERIFIED = 정보 가치 0 = 시각 노이즈
   - Route Detail 페이지의 VERIFIED 칩은 유지
   - RobotaxiCard의 CHECK BEFORE RIDING 칩은 유지 (실제 경고)

## sitemap 구조

48 URL (24 EN + 24 KO):
- 11 정적 페이지 × 2 locale = 22
- 11 노선 상세 × 2 = 22
- 2 업데이트 상세 × 2 = 4

## 다음 세션 우선순위

1. **모니터링**: GSC sitemap 읽힘 / 네이버 수집 성공 / `site:seoulautonomous.com` 확인
2. **소셜 디버거**: Facebook Sharing Debugger / X Card Validator / Kakao 캐시 갱신
3. **/ → /ko 리다이렉트 검토**: 네이버 색인에 유리할 수 있음 (현재 / → /en)

## 보류 항목

- Cloudflare / WAF
- support@seoulautonomous.com 메일 설정
- Vultr 커널 보안 패치
- 디자인 polish (Routes 새벽/심야 링크 간격 등)
- Round 3~6 디자인 로드맵 (Privacy TOC, Home hero, i18n label 등)

## 서버 배포 참고

docker-compose 없음. 수동 docker build/run:
```
cd /opt/seoul-autonomous && git pull
docker build -t seoul-autonomous-web:latest .
docker stop seoul_autonomous_web && docker rm seoul_autonomous_web
docker run -d --name seoul_autonomous_web \
  --hostname 0.0.0.0 --network apps-newsforgreens_default \
  --restart unless-stopped -e NODE_ENV=production \
  seoul-autonomous-web:latest
```
docs/ 변경은 배포 불필요 (Docker가 web/만 빌드).
