# R2 시안 v2.3 소스 (세션 scratchpad 소멸 대비 보존본)

- `template.html` — 시안 본문. `__DATA__` 자리에 데이터 JSON 이 들어간다.
- `seoul-autonomous-v2.built.html` — 2026-10-15 게시본(버전 5) 그대로. 브라우저에서 바로 열린다.
- 데이터 재생성: `web/data/night-bus-routes.json` + `web/app/[locale]/night-bus-map/night-bus-data.ts` 에서
  `node web/scripts/build-night-bus-derived.mjs --r2-data <out.json>` 로 만든 뒤 `__DATA__` 치환 (R3a 에서 스크립트 제공).
- 아티팩트: https://claude.ai/artifact/9ZgafDYwRvTqvzsvgRjw4B (비공개)
- 정본 문서: docs/worklogs/R2-PROTOTYPE-20261015.md
