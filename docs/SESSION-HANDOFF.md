# Session Handoff

> 마지막 업데이트: 2026-06-14 (Round 19/19-mobile/19.5 배포 완료)

## 현재 위치

**올빼미버스 인터랙티브 노선도 배포 완료. 19.6(html lang) + 19.7(전체화면) 미착수. 색인 요청 보류.**

## 마지막 커밋 (main, 배포됨)

`bb4bf8c` — Round 19.5: 내부 링크 + 노선도 og:image + 본문 정합성 수정

## 커밋 이력

```
bb4bf8c  Round 19.5 — 내부 링크 + og + 본문 정합성 (배포됨)
4978cd3  Round 19-mobile — 모바일 최적화 (배포됨)
e414bc8  Round 19 — 인터랙티브 노선도 이식 (배포됨)
1565bea  Round 17 — GA4 (이전 배포)
```

## 배포 상태

- seoulautonomous.com 라이브 (Docker + Caddy)
- /ko/night-bus-map 200 ✅
- /en/night-bus-map 404 ✅
- 전용 OG: /og/night-bus-map-og.jpg 200 ✅
- 내부 링크: A21 상세 CTA + /ko/routes 배너 ✅

## 다음 세션 즉시 할 것

1. **19.6 구현안 보고** (html lang — 코드 변경 없이 방법만)
2. 포그린 구조안 승인 → 작업 → 배포
3. 19.7 전체화면 보기
4. 색인 요청 (19.6 끝난 후)

## 핵심 경고

- **19.6에서 GA4 + verification 메타 유실 금지** — 색인·소유확인 사고
- **색인 요청은 19.6 후** — 현재 lang="en"으로 잡히므로

## 새 세션 시작 시

1. [ ] 이 문서 읽기
2. [ ] `docs/handoff/HANDOFF-20260614.md` 읽기
3. [ ] MEMORY.md 확인
4. [ ] 라이브 확인: https://seoulautonomous.com/ko/night-bus-map

## 서버 정보

- Vultr 158.247.252.172
- Docker 수동 docker run (compose 아님)
- Caddy 6개 도메인 블록 — docker restart 금지
- docs/ 변경은 배포 불필요
