# Robotaxi Freshness — 2026-08-19 공식 확대 반영 (정본)

- 일자: 2026-08-26
- 판정: **Robotaxi Freshness = APPROVED / PRODUCTION LIVE / CLOSED**
- 커밋: **`8e3c9f8fcbce748e4dde64ad8fe9c2eb83ee0e6a`** "feat: Refresh Gangnam robotaxi with official Aug 19 expansion" (12파일, +310/−45)
- 상위 정본: PHASE0 §F(공식 출처 확보) — 소급 수정 없음

## A. 최종 구현 범위 (12파일)

operatingHours **C2O 승격** · serviceArea 약 20.4㎢ 보강 · Robotaxi 카드 운영시간 행 신규 표시 ·
2026-08-19 공식 source 추가(카드 대표 출처 = 최신 관련 공식 우선) · 신규 19대 update 기사 ·
관련노선 raw id 해결(onDemand 표시명+링크) · 기사 하단 공식 출처 링크(`sourceUrl?` optional) ·
reportedInfo 빈 배열 시 섹션 미렌더 · **콘텐츠형 명사형 H2 6개**(`articleSections?` optional).
비접촉: root routes.json · Graph Core · shared-stop UI · 기존 7대 기사 · package/lockfile.

## B. 공식 사실 (날짜 의미 분리)

```
발표일 2026-08-19 · 시행 2026-08-20 22:00 · 사이트 재검증 2026-08-26
차량 7 → 19대 (SWM 13 · 카카오모빌리티 6)
운행구역: 강남 자율주행자동차 시범운행지구 전역 (약 20.4㎢)
운행: 평일(월~금) 22:00 ~ 익일 05:00 · 최대 승객 3명 · 시험운전자 1명 상시 동승 · 호출 카카오T
```

## C. 요금 잠금

22~23시 5,800 / 23~02시 6,700 / 02~04시 5,800 / 04~05시 4,800 — 기존 값과 8/19 공식이 일치하여
**수정 0** (freshness 명목의 재작성 금지 원칙 적용). fare source는 기존 2026-03-16 근거 유지.

## D. operatingHours C2O (최종)

`OperationalField<OperatingWindowValue>` — official_confirmed/confirmed ·
value {days: weekday, start: 22:00, end: 05:00} · source publishedAt 2026-08-19 / effectiveAt 2026-08-20
(`seoul.go.kr/news/news_report.do?nttNo=464205`) · lastChecked 2026-08-26.
구 평문 operatingDays는 value.days로 흡수·삭제(consumer 0 확증).

## E. serviceArea (official freshness enrichment — 오류 수정 아님)

KO "강남 자율주행자동차 시범운행지구 전역 (약 20.4㎢)" / EN "Entire Gangnam autonomous driving
pilot zone (approx. 20.4 km²)". 스키마 무변경(평문 유지).

## F. 신규 update — `gangnam-robotaxi-expanded-to-19`

`/ko|en/updates/gangnam-robotaxi-expanded-to-19` · 고유 title/H1
("강남 심야 자율주행택시 19대 확대 운행시간 구역 호출방법") · **명사형 고유 H2 6개**
(19대 확대 / 시범운행지구 20.4㎢ / 평일 운행시간 / 카카오T 호출방법 / 시간대별 요금 / 탑승 전 확인사항) ·
공식 출처 실링크 · 관련노선 "강남 로보택시" 표시명 → `/routes/late-night` locale-aware ·
reportedInfo 빈 섹션 미렌더. 날짜: date 2026-08-26(게시) / eventDate·sourcePublishedAt 2026-08-19.

## G. 기존 7대 update 보존

`gangnam-robotaxi-expanded`: **수정 0 · 삭제 0 · 19대 소급 교체 0 · sourceUrl 소급 추가 0** —
시점 기록으로 완전 보존(라이브 원문 "3대에서 7대로 증차" 잔존 확인). 단 템플릿 공용 개선
(관련노선 표시명 해결)은 기존 기사 렌더에도 자연 적용(데이터 비접촉).

## H. SEO / sitemap — 첫 의도적 URL 증가

**53 → 55** (KO/EN update 각 +1, 그 외 신규 0 — CTG 라운드들의 "신규 URL 0"과 구분되는
승인된 콘텐츠 증가). Live 검증: **55/55 전수 200** · 중복 0 · 기존 53 누락 0 ·
신규 2 URL canonical 자기참조 · robots/X-Robots noindex 없음 · sitemap alternates KO↔EN 상호참조.

## I. hreflang / lastmod — 이번 라운드 결함 아님 (기존 이월)

페이지 `<link hreflang>` 부재 = 사이트 전역 기존 정책(sitemap alternates가 담당, 전 페이지 실측 동일) /
sitemap lastmod 미출력 = 기존 전역 상태와 동일. 둘 다 **기존 SEO 이월 항목으로만 보존.**

## J. 기사 품질 개선 이력 (commit 전 사용자 검토 반영)

초기안이 공지 템플릿 중심이라 사용자 검토에서 4건 발견: raw `gangnam-robotaxi` 노출 ·
공식 출처 링크 부재 · 공식 수록 실적의 "(확인 필요)" 오배치 · 공통 라벨형 H2의 콘텐츠 가치 부족.
→ commit 전 전부 수정(표시명+실링크 / 서울시 source 링크 / confirmedInfo 이동+빈 섹션 미렌더 /
명사형 H2 6개 콘텐츠형 전환 — GPT 결정 4건 + 포그린 제목·소제목 확정 반영) 후
**사용자 visual approval을 받고 commit**했다. 이 사이트의 update는 이후로도
"AdSense 저가치 대응" 기준으로 콘텐츠형을 우선한다.

## K. QA (commit 전 로컬)

Graph 21항 · stop-names · 56/56 · tsc · build 전부 PASS / lint baseline 5err/27warn 동일(신규 회귀 0) /
build inventory 55.

## L. Production 배포 — DEPLOY PASS

```
previous  f693e01 / 443ef5711270  →  new  8e3c9f8 / f13663508dc2 (revision full SHA)
절차: rollback-f693e01 확보 → ff-only pull → immutable 빌드(latest 미이동) → candidate QA
     (--hostname 0.0.0.0) → rename backup 보존 → 교체 → Live QA → 사용자 승인 → latest 정렬
중단: 실측 0.4초 (프로브 100회 중 502 1샘플 — 역대 최단) · 타 8컨테이너 restarts 0 · Caddy 0
배포 안전 계약(--hostname 0.0.0.0 양 컨테이너) 정상 적용.
```

## M. 최종 Production 좌표

```
runtime = 8e3c9f8 · image = f13663508dc2 · latest = f13663508dc2 (사용자 승인 후 정렬)
rollback-f693e01 → 443ef5711270 · backup_f693e01_20260826-192453 (보존)
기존 rollback/backup 자산 전부 유지 — 삭제·prune 금지
```

## N. Live QA — 전항 PASS (사용자 라이브 승인 2026-08-26)

카드 4페이지(운영시간·20.4㎢·요금 불변·8/19 출처, KO/EN) · 신규 기사 KO/EN(H2 6·출처 실링크·
관련노선 링크·raw 0·확인필요 섹션 0) · 기존 7대 기사 regression 0 · sitemap 55/55·누락 0·
canonical/indexability PASS · CTG A160 33/41·A21 17/24 · 6도메인 200 · 404 4/4 ·
390px overflow 0 · pageerror/hydration 0 · logs clean.

## O. 제품 가치

단순 날짜 최신화가 아니라 "언제 · 어디에서 · 무엇이 바뀌었나 · 공식 근거는"이라는 사용자 질문에
대한 답을 실제 카드와 콘텐츠에서 강화한 라운드 — 제품 목표 문장("지금 어디서 무엇을 타야 하는지,
공식 근거와 함께")과 정합.

## P. 다음 라운드

```
Robotaxi Freshness docs 정본화 (이 문서)
→ **Stop URL 정책 READ-ONLY audit**
→ 이후 후보: Night Bus Map ↔ CTG · static decision(C1O 재조사 선행: days 7/11·headway 4/11 미확인) · N버스
```
