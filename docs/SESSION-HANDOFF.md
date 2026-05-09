# Session Handoff

> 마지막 업데이트: 2026-05-09 (배포 완료)

## 현재 위치

**55페이지. Polish 전부 완료. seoulautonomous.com 배포 완료. Caddy 사고 복구 완료.**

## 마지막 커밋

`559b498` — output standalone for Docker deployment

## 배포 상태

- seoulautonomous.com 라이브 (Docker + Caddy)
- HTTPS, www 리다이렉트, sitemap, robots 정상
- / → /en (defaultLocale: en)
- Cloudflare 미사용
- Caddy 사고 복구 완료 — 6개 블록 정상

## 다음 세션 즉시 할 것

1. 캡처 검증 → 디자인 클로드에게 전달
2. Google Search Console 등록 + sitemap 제출
3. 네이버 서치어드바이저 등록 + sitemap 제출

### 장기

- / → /ko 리다이렉트 검토
- support@seoulautonomous.com 메일 설정
- Vultr 커널 보안 패치

## 새 세션 시작 시

1. [ ] 이 문서 읽기
2. [ ] `docs/HANDOFF.md` 읽기
3. [ ] MEMORY.md 확인
4. [ ] **Caddy 작업 시 memory/caddy-incident.md 필독**

## 핵심 아키텍처

- **55페이지**: 9유형 + 새벽/심야 그룹 2 + Updates 3
- **PageContainer**: default 1120px / longform 720px
- **Route Detail**: 2-column + AEO 7 Q&A
- **Home Hero**: 2-column (좌 텍스트 + 우 이미지)
- **Updates**: 목록 + 개별 글 (확인 정보/기사 참고 분리)
- **Back to Top**: 전역, 푸터 fade-out
- **CSS Modules 전용**, 다크 톤 + zinc + cyan accent

## 서버 정보

- Vultr 158.247.252.172
- Docker 9개 컨테이너
- Caddy 6개 도메인 블록
- 정상 백업: Caddyfile.bak.recovered-20260509

## Caddy 운영 원칙

- docker restart 금지 — validate → reload만
- 호스트 + 컨테이너 내부 Caddyfile 둘 다 확인
- dry-run → 승인 → write → validate → reload
- 배포 후 기존 사이트 헬스체크 필수

## 디자인 클로드 이어가기

새 Claude 대화에서 `docs/HANDOFF.md` + `SSOT.md` 첨부.
"Polish 전체 캡처 검증 부탁드립니다."
