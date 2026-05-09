# GPT Handoff — 2026-05-09

> 이 문서 하나로 세션이 바뀌어도 이어갈 수 있음.

---

## 한 줄 요약

서울 자율주행 가이드 웹사이트. 45 정적 페이지. Round 4+5+AEO 질문형 완료. AEO 확장 audit 대기.

---

## 현재 상태

**빌드:** 45 정적 페이지, npm run build 통과
**마지막 커밋:** `d607814` (Route Detail AEO 7 Q&A)
**도메인:** autonomous.fazr.co.kr (미배포)

### 이번 세션 완료 (Round 2 + 4 + 5 + AEO)

- Round 2: Route Detail 재설계 (2-column, inline meta, StopsList 통일, CTA 정리)
- Round 4: Footer © 중앙 + Hero 이미지 2-column (야간 자율주행 버스)
- Round 5: 칩 번역 (VERIFIED → 검증됨 on KO)
- AEO: Route Detail 7 Q&A 질문형 섹션 (dl/dt/dd, Unknown → 확인 안내)

---

## 다음: AEO 확장 audit

audit-only, 구현 X. 45→60~70 페이지 확장 후보 평가.

### 핵심 규칙
- 3등급: 즉시 후보 / 조건부 후보 / 보류·폐기
- Route Detail AEO와 동일 질문 별도 페이지 = 폐기
- 관광 정보: 공식 출처 + route-stop 연결 기준 + 거리 추정 금지
- 페이지 수보다 품질 우선 — 얇은 중복 금지

### 후보 카테고리
- 시간대별 (새벽/심야)
- 지역별 (청계천/강남/상암/청와대)
- 이용자 유형별 (외국인 관광객)
- 노선 유형별 (버스 vs 로보택시)
- 확인/주의 페이지

---

## 보류 항목

| 항목 | 사유 |
|------|------|
| Round 3: Privacy/Terms sticky TOC | 낮은 우선순위, 스킵 |
| Vultr 배포 | 디자인+AEO 완료 후 |
| 도메인 결정 | AEO audit 후 |

---

## 참조 문서

```
docs/HANDOFF.md                                    — 마스터 핸드오프
docs/strategy/AEO-EXPANSION-STRATEGY-2026-05-06.md — AEO 전략
docs/SESSION-HANDOFF.md                            — 세션 핸드오프
SSOT.md / CLAUDE.md / docs/DECISIONS.md            — 헌법/규칙
```
