# Session Handoff

> 마지막 업데이트: 2026-06-14 Session 2 (Round 19.6~16B 전부 배포 + 색인 요청 완료)

## 현재 위치

**올빼미버스 인터랙티브 노선도 완성·배포·색인 요청 완료. 네이버 검색 노출 확인. 핵심 작업 없음 — 모니터링 단계.**

## 마지막 커밋 (main, 배포됨)

`c65eb96` — Round 16B: HTTP Link 헤더 hreflang 정리 (alternateLinks false)

## 커밋 이력

```
c65eb96  Round 16B — HTTP Link 헤더 hreflang 정리 (배포됨)
fbe3fe2  Round 21 — 서울 심야버스 노선도 발표 글 (배포됨)
44c1d23  Round 20 — 환승 2회 경로 + 서울역 라벨 + 전체화면 뷰 맞춤 (배포됨)
d96ca8f  Round 19.7 — 전체화면 보기 + 경로 바 칩 동작 + UI 개선 (배포됨)
3637662  Round 19.6 — locale별 html lang 정리 (배포됨)
da10647  docs: session handoff (Round 19 배포 완료)
bb4bf8c  Round 19.5 — 내부 링크 + og + 본문 정합성 (배포됨)
```

## 배포 상태

- seoulautonomous.com 라이브 (Docker + Caddy)
- /ko/night-bus-map 200 ✅
- /en/night-bus-map 404 ✅ (ko 전용)
- /ko/updates/night-bus-map-launch 200 ✅
- /en/updates/night-bus-map-launch 404 ✅ (ko 전용)
- HTTP Link 헤더 hreflang 제거됨 ✅
- 색인 요청 완료 (네이버·구글·다음)
- 네이버 검색 노출 확인됨

## 다음 세션 할 것

1. GSC 404 드롭 현황 확인 (2~4주 후)
2. 네이버·구글 검색 순위 모니터링
3. 스니펫 최적화 (필요 시 — 네이버가 고지문을 스니펫으로 뽑음)
4. P2 항목 우선순위 재정리

## 핵심 경고

- **alternateLinks: false 유지** — 다시 true로 돌리면 GSC 404 원인 부활
- **Caddy 절대 건드리지 말 것**
- **night-bus-data.ts 읽기 전용**

## 새 세션 시작 시

1. [ ] 이 문서 읽기
2. [ ] `docs/handoff/HANDOFF-20260614-session2.md` 읽기
3. [ ] MEMORY.md 확인
4. [ ] 라이브 확인: https://seoulautonomous.com/ko/night-bus-map

## 서버 정보

- Vultr 158.247.252.172
- Docker 수동 docker run (compose 아님)
- Caddy 6개 도메인 블록 — docker restart 금지
- docs/ 변경은 배포 불필요
