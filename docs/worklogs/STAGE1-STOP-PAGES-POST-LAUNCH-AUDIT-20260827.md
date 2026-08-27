# Stage 1 Stop Pages — Post-launch UX/SEO READ-ONLY Audit

- 라운드: Phase Stop-1E Post-launch audit (지시서 §0~§35)
- 일자: 2026-08-27 (배포 당일)
- 성격: **READ-ONLY** — 코드·데이터·i18n·sitemap·Production 변경 0, 수정 0
- **최종 판정: IMPROVE** (필수 수정 0 · 개선 항목 2건 + backlog 3건)

> **후속 상태 (2026-08-27 추기 — 이 감사의 판정은 소급 변경하지 않는다)**
> 본 감사의 판정 `IMPROVE`는 감사 시점의 기록으로 그대로 보존한다.
> - **개선 항목 ①**(EN 방향쌍 title/description prefix): Phase Stop-1F에서 수정·배포 완료 →
>   표적 재감사 **CLOSED** (`STOP-1F-EN-METADATA-POST-LAUNCH-AUDIT-20260827.md`).
>   실측: title split 29→8 / 22→9 / **56→9**, desc split 55→8 / 48→9 / **82→9**
> - **개선 항목 ②(01008 카드 이웃 중복)·③(데스크톱 여백)·T절 backlog(tap 44px, Search Console
>   후속 감사)는 미해결 상태로 유지된다.** 이번 라운드에서 해결되지 않았다.

---

## A. 판정 기준 (감사 전 고정 — 지시서 §2 원문)

- **KEEP** = 필수 수정 0 + low-value 위험 미증가 + 방향쌍 구분 충분 + 링크 밀도 양호 + 6/6 유효 + Stage 2 재논의 장애 없음
- **IMPROVE** = 필수 수정 0이나 구체적 개선 항목 ≥1 (근거·severity·영향·범위·시급성 명시)
- **HOLD** = 필수 수정 ≥1 또는 near-duplicate 명확 / 차별성 불충분 / 링크 과밀 / low-value 증가 근거 / indexability 결함 / 6/6 실질 미충족
- **ROLLBACK** = 치명 live 결함에만 (해당 없음)

판정 근거는 아래 C~Q의 실측이며, 기준을 사후에 조정하지 않았다.

## B. 기준점

```
Git local = origin/main   f34ede8bde20723245a39511ea0c19c83e434964
Production runtime        f34ede8 (revision 라벨) · 이미지 = latest = dd19df584b62
live sitemap              69 (신규 Stop 14 · 기존 55 보존)
rollback 기준             rollback-8e3c9f8 → f13663508dc2 + backup_8e3c9f8_20260827-193733
이번 감사 변경             repo 0 · Production 0 · 산출물 = 이 문서 1건
```

## C. 기술 indexability (§23)

**14/14 전항 정상 · 이상 0건.**

| 항목 | 결과 |
|---|---|
| HTTP 200 | 14/14 |
| canonical 자기참조 | 14/14 |
| noindex | 0 |
| X-Robots-Tag | 없음 (14/14) |
| KO↔EN alternates | 14/14 |
| BreadcrumbList JSON-LD | 각 1개 (ListItem 2 · BusStop 0) |
| robots.txt | `Allow: /` · Disallow 0 → `/stops` 크롤 가능 |
| 내부링크 도달성 | Route 3개에서 19개 링크로 전 7 Stop 도달 |

**실제 Google 색인 여부는 이번 판정 근거에서 제외**(§4) — 배포 당일이라 측정 불가. T절 backlog로 이월.

## D. 6/6 visible-content 감사 (§6)

**14/14 통과.** 각 페이지에서 script/RSC 블롭·전역 header/footer를 제거한 visible content 기준:

- C1 공식명+ARS / C2 경유 노선 전부(카드 수 = routeCount) / C3 seq 문장 / C4 이전·다음(routeCount만큼) / C5 구조 문장 / C6 provenance+검증일 — 전부 실존
- 빈 값·placeholder(`undefined`/`null`/`NaN`/미치환 `{}`) **0**
- 잘못된 route membership 0 · 잘못된 neighbor 0 (Graph Core 재계산 대조)

## E. 14페이지 텍스트 유사도 (§8)

측정법: visible body에서 `<script>` 비탐욕 제거 → 전역 header/footer 제외(= core) → 토큰화.
Jaccard(토큰), cosine(TF), Jaccard(3-gram) 3종. full body(크롬 포함)는 보조 지표.

| 쌍 | core Jaccard | core cosine | core 3-gram | full Jaccard |
|---|---|---|---|---|
| ko 01009↔01010 | 0.831 | 0.976 | 0.534 | 0.896 |
| ko 01013↔01014 | 0.797 | 0.970 | 0.518 | 0.873 |
| ko 01007↔01008 | 0.806 | 0.958 | 0.496 | 0.879 |
| en 01009↔01010 | 0.851 | 0.962 | 0.611 | 0.903 |
| en 01013↔01014 | 0.759 | 0.965 | 0.583 | 0.836 |
| en 01007↔01008 | 0.849 | 0.948 | 0.563 | 0.902 |
| **대조군** ko 01009↔01019 | 0.579 | 0.842 | 0.400 | 0.726 |
| **대조군** ko 01009↔01013 | 0.704 | 0.926 | 0.471 | 0.812 |

**해석**: 방향쌍의 cosine이 0.95+로 높다. 이는 (a) 동일 route set, (b) 동일 UI 문구·라벨 때문이며
3-gram(문맥 포함)에서는 0.50~0.61로 절반 가까이가 다른 문장이다. 대조군보다 유사도가 높은 것은
사실이므로 **"유사도가 낮다"고 주장하지 않는다.** 지시서 §8 원칙대로 판정은 F절(핵심 결정 데이터
차이)과 함께 내린다.

## F. 방향쌍 above-the-fold 고유성 (§9)

6쌍(ko·en × 3) 전부 **DISTINCT** — 다음 정류장 union 교집합 **0**, 첫 화면 4요소 중 3~4개 상이.

| 쌍 | ARS | next union | route set | 첫 카드 seq | 판정 |
|---|---|---|---|---|---|
| 01009↔01010 | 다름 | 종로1가·종로2가 ↔ 서울역사박물관.경희궁앞·강북삼성병원 | 동일 | 55↔32 | DISTINCT |
| 01013↔01014 | 다름 | 종로3가.탑골공원·명동성당 ↔ 종로1가·광화문역 | 동일 | 57↔30 | DISTINCT |
| 01007↔01008 | 다름 | 광화문역 ↔ 서대문역사거리 | **3 ↔ 2** | 54↔33 | DISTINCT (positive control) |

01007↔01008은 route set 자체가 달라(§17) 방향쌍 차별성의 대조 기준으로 성립한다.
**INSUFFICIENT 0 → HOLD 조건 미해당.**

## G. title SERP prefix 감사 (§10)

전체 문자열은 14개 전부 고유. 잘림 구간 기준:

| 쌍 | full | prefix 30 | prefix 40 | 판정 |
|---|---|---|---|---|
| ko 01009↔01010 | 다름 | 구분 | 구분 | CLEAR |
| ko 01013↔01014 | 다름 | 구분 | 구분 | CLEAR |
| ko 01007↔01008 | 다름 | 구분 | 구분 | CLEAR |
| en 01009↔01010 | 다름 | 구분 | 구분 | CLEAR |
| en 01013↔01014 | 다름 | 구분 | 구분 | CLEAR |
| **en 01007↔01008** | 다름 | **동일** | **동일** | **POOR** |

```
A: Seoul Museum of History, Gyeonghuigung Palace (Stop 01007) — Seoul Autonomous
B: Seoul Museum of History, Gyeonghuigung Palace (Stop 01008) — Seoul Autonomous
   앞 40자 = "Seoul Museum of History, Gyeonghuigung Pa"  ← 동일
```

공식 EN명이 길어 Stop ID가 46번째 문자 뒤에 온다. **Google의 실제 pixel truncation은 단정하지
않되**, 문자 기준으로는 SERP에서 두 결과가 같아 보일 위험이 있다 → S절 개선 항목 ①.

## H. description 차별성 (§11)

| 쌍 | 분기 시작 위치 | 판정 |
|---|---|---|
| ko 01009↔01010 | 16자 | DISTINCT |
| ko 01013↔01014 | 17자 | DISTINCT |
| ko 01007↔01008 | 25자 | DISTINCT |
| en 01009↔01010 | 55자 | TEMPLATE-HEAVY BUT ACCEPTABLE |
| en 01013↔01014 | 48자 | TEMPLATE-HEAVY BUT ACCEPTABLE |
| **en 01007↔01008** | **82자** | **DUPLICATE-RISK** |

KO는 `{name} 정류장(ARS {ars})…` 구조라 ARS가 앞에 와서 일찍 갈린다. EN은 `Autonomous routes
serving {name} (stop {ars})…`라 긴 이름 뒤에야 ARS가 온다. 01007/01008은 route set이 달라
내용은 실제로 다르지만(3노선 vs 2노선) **앞 82자가 동일**하다 → 개선 항목 ①과 동일 원인·동일 수정.

## I. Route→Stop 링크 밀도 (§12·§13)

| 노선 | stop 링크 / 전체 정류장 | 밀도 | route chip | 전체 앵커 |
|---|---|---|---|---|
| 새벽A160 | 7 / 87 | 8.0% | 41 | 52 |
| 새벽A741 | 5 / 34 | 14.7% | 12 | 22 |
| 심야A21 | 7 / 40 | 17.5% | 24 | 36 |
| 새벽A148(대조) | 0 / 41 | 0.0% | 17 | 22 |

시각 위계 실측(390px, A160 펼친 목록): Stop 링크 `12px / 500 / cyan`, 정류장명 `15px / 500 / white`
→ **Stop 링크가 정류장명보다 작고 약하다.** 행 자체는 비인터랙티브 유지, 링크는 칩 줄 아래 보조
영역에 위치. 캡처 육안으로도 목록 리듬을 끊지 않는다.

Phase 1C audit(칩 텍스트 비중 6.7%, "반복 스팸성 없음") 대비 A160 기준 8.0%가 추가됐으나,
**7개 행에만 나타나 전체 87행 중 8%**이고 나머지 80행은 이전과 바이트 단위로 동일하게 렌더된다.
→ 과밀 인상 증가 근거 없음.

## J. Stop→Route 반복 부담 (§14) · Stop→Stop 부재 (§15)

각 Stop 페이지는 route당 링크 2개(상단 칩 + 카드 하단 링크) = routeCount×2. 14페이지 전수 일치.

- 3-route 01009: 칩 3 + 카드 링크 3 = 6
- 2-route 01008·01019: 4

**판정: BACKLOG POLISH.** 칩은 "어떤 노선이 서는가"(개요), 카드 링크는 "이 노선 문맥에서 이동"
(문맥)이라 역할이 다르고, 390px에서 두 요소가 화면상 충분히 떨어져 있어 중복 피로가 크지 않다.
다만 2-route 페이지에서는 4개 링크가 같은 2개 대상으로 향해 반복이 상대적으로 도드라진다.

**Stop→Stop 앵커 14페이지 전부 0** — v1 정책 유지 확인. 이전/다음은 텍스트로만 제공되며,
같은 화면에 route 링크가 있어 이동 수단이 없지는 않다(사용자 이해를 심각히 해치지 않음).
Stage 2 결정은 하지 않는다.

## K. 모바일 390 UX (§18)

10개 URL 전수 실측 — **horizontal overflow 0 · pageerror 0.**

| 페이지 | 페이지 높이 | H2 | 카드 | 칩 |
|---|---|---|---|---|
| ko 01009·01013·01014 | 1759 | 5 | 3 | 3 |
| ko 01007 | 1781 | 5 | 3 | 3 |
| ko 01010 | 1803 | 5 | 3 | 3 |
| ko 01008·01019 | 1566 | 4 | 2 | 2 |
| en 01009 | 1933 / en 01010 1999 / en 01019 1668 | | | |

가장 긴 hero(en 01010, `Seoul Museum of History, Gyeonghuigung Palace · … Kangbuk Samsung hospital`)도
자연 wrap되며 overflow 0. H1·공식명 원문 보존(`Jongno 5(o)-ga.Gwangjang Market`).
**tap 높이 32px 미만 링크 5~6개** 관측 — 기존 1C backlog "칩 tap 44px(AAA)"와 같은 축이며 신규 회귀 아님.

## L. 데스크톱 UX (§19)

1280px 4페이지 실측 — overflow 0, 페이지 높이 1376~1591.

- 정보 위계는 성립: H1 → ARS/다음 정류장 → 노선 섹션 → 카드 → provenance
- **관측**: 넓은 뷰포트에서 카드가 전폭으로 늘어나 라벨(이전/다음 정류장)과 값 사이 여백이 크고,
  provenance 행도 좌우로 벌어져 날짜가 우측 끝에 붙는다. 모바일 대비 밀도가 낮게 느껴진다
  → S절 backlog ③ (CSS max-width/그리드 조정 수준, 데이터·구조 변경 아님)
- "자동생성 데이터 표"처럼 보이는가: 카드가 반복 구조이긴 하나 각 카드의 값(노선명·seq·이웃)이
  전부 달라 표 나열보다는 노선별 문맥 카드로 읽힌다. 단 01008은 M절 참조.

## M. 페이지 내 카드 간 이웃 중복 (신규 관측)

| Stop | 카드 | 고유 이웃쌍 |
|---|---|---|
| 01009·01010·01013·01014·01007 | 3 | 2종 |
| 01019 | 2 | 2종 |
| **01008** | 2 | **1종 — 전 카드 동일** |

01008은 A160·A21의 이전·다음이 모두 `광화문역 → 서대문역사거리`로 같고 **seq(33 vs 9)와 노선명만
다르다.** 두 노선이 실제로 같은 구간을 지나므로 **데이터는 정확하며 오류가 아니다**(오히려
"어느 노선을 타도 같은 방향"이라는 유용한 사실). 다만 화면상 두 카드가 거의 같아 보인다.
→ S절 backlog ②. 고유 정보 비율도 01008이 최저(ko 19.6% · en 20.5%)로 이 관측과 일치한다.

## N. Route 페이지와의 intent 중복 (§21)

**판정: DISTINCT INTENT.**

- Stop 페이지에서 제외 계약 항목 누출 **0**: 첫차·막차 시각 0 · 요금 0 · 배차 0 · 운행일 0 · route-context 장문 0
- 텍스트 유사도(A160 route ↔ 01009 stop): **Jaccard 0.092 / cosine 0.413**
- 분량: route 730 토큰 vs stop 113 토큰 — Stop은 축약이 아니라 다른 축의 정보(정류장 identity·노선별 위치·이웃)

## O. 내부 탐색 가치 (§22)

실제 클릭으로 3경로 왕복 검증(`waitForURL` 기준):

```
/ko/routes/saebyeok-a160 → 01009 광화문역 → /ko/routes/saebyeok-a741   PASS
/ko/routes/saebyeok-a741 → 01007 서울역사박물관.경희궁앞 → /ko/routes/simya-a21   PASS
/ko/routes/simya-a21 → 01019 종로5가.광장시장 → /ko/routes/saebyeok-a160   PASS
```

**판정: USEFUL.** Route → Stop → 다른 Route 이동이 실제로 성립하며, 노선 페이지에서는 보이지
않던 "이 정류장에서 갈아탈 수 있는 노선의 노선 문맥"으로 이어진다. STRONG이 아닌 이유: Stop
페이지의 출구가 route 링크뿐이라(Stop↔Stop 없음) 회랑을 따라가는 탐색은 아직 불가능하다.

※ 최초 측정에서 클릭 후 `waitForLoadState`가 이전 페이지에서 조기 반환돼 URL·h1이 한 스텝씩
밀려 기록됐다. 도구 아티팩트로 확인하고 `waitForURL`로 재측정했다(§29 안전선 적용).

## P. sitemap 69 품질 (§24)

loc **69** · Stop **14** · duplicate 0 · 전수 200 · 기존 55 누락 0.
Stop lastmod 단일값 **2026-05-01**(멤버 노선 lastChecked 최대) — 정직한 provenance 정책이며
현재 날짜로 바꾸도록 권고하지 않는다.

## Q. AdSense / low-value 판정 (§25)

웹 조사 없이 프로젝트 확정 목표 기준으로만 판정.

| 질문 | 실측 근거 | 답 |
|---|---|---|
| ① route와 다른 intent인가 | Jaccard 0.092 · 제외 항목 누출 0 | 예 |
| ② 방향쌍이 데이터로 차별되는가 | ATF 6/6 DISTINCT · next 교집합 0 | 예 |
| ③ page +14보다 unique data 증가가 큰가 | 고유 정보 비율 ko 19.6~25.0% · en 20.5~34.0%, 무신호 182 미생성 | 예 |
| ④ Route→Stop→Route 탐색 가능한가 | 3경로 실클릭 PASS | 예 |
| ⑤ SEO filler 없이 데이터 중심인가 | 평가어·창작 방향어·장문 문단 0 | 예 |
| ⑥ near-duplicate 인상이 강한가 | cosine 0.95+이나 3-gram 0.50~0.61, ATF DISTINCT, title·desc 14 고유 / **단 EN 01007·01008 prefix 동일** | 부분적 |

**최종: low-value risk DECREASED.**
근거는 ①~⑤이며, ⑥의 EN prefix 건은 위험을 되돌릴 만큼은 아니되 **개선하면 감소 폭이 더 커지는
항목**으로 분류한다. 정책이 금지한 대량 thin 생성(무신호 182)은 실행되지 않았고, 생성된 14개는
전부 6/6을 실데이터로 충족한다.

## R. 필수 수정

**0건.** §32 정의(잘못된 데이터 / route membership / prev·next / 방향쌍 구분 실패 / canonical·
indexability 결함 / mobile 사용 불가 / misleading text / severe near-duplicate / navigation broken)에
해당하는 항목이 없다.

## S. 개선 후보

### ① EN title·description의 방향쌍 prefix 동일 — severity 중 · **우선 검토 권고**

- 근거: G절(en 01007↔01008 prefix 30·40 동일), H절(description 분기 82자)
- 사용자 영향: 영문 SERP에서 두 결과가 같은 제목으로 보여 어느 쪽을 열지 판단 불가
- SEO 영향: near-duplicate 인상 · 클릭 분산
- 예상 범위: `messages/en.json`의 `metadata.stopDetailTitle`·`stopDetailDescription` 어순 조정
  (예: Stop ID를 앞으로). **i18n 2키, 코드 로직 변경 없음**
- 시급성: 색인이 자리잡기 전에 고치는 편이 유리 → 다음 polish 라운드 1순위 후보
- 주의: 공식 EN명은 원문 보존 계약이므로 **이름 축약이 아니라 어순만** 조정해야 한다

### ② 01008 카드 간 이웃 완전 중복 — severity 하 · backlog

- 근거: M절(고유 이웃쌍 1종), 고유 정보 비율 최저
- 데이터는 정확 → 표시 정책 변경 사안이며 **정책 승인 필요**(예: 이웃이 동일한 카드 축약)
- 지금 수정 불필요. Stage 2 재심사 시 V3 26개에도 같은 패턴이 나올 수 있어 함께 설계하는 편이 낫다

### ③ 데스크톱 카드·provenance 여백 — severity 하 · backlog

- 근거: L절. 1280px에서 라벨↔값 이격, 밀도 저하
- 예상 범위: `stops/[slug]/page.module.css` max-width/그리드 조정. 데이터·구조 무관

## T. Backlog (지금 실행 안 함)

1. **2~3주 후 Search Console index audit** — 14 URL 색인 여부 · duplicate/canonical 판정 · impressions · crawl activity · route→stop discovery (§28)
2. tap target 44px(AAA) — 기존 1C backlog와 통합 (신규 회귀 아님)
3. 1C 기존 backlog 3건(EN 라벨 축약 · summary 문구 · 칩 tap) 유지
4. 위 S절 ②③

## U. Stage 2에 제공할 근거 (판정 아님)

- 방향쌍 차별 장치(ARS + 노선별 next-stop union)가 **실사용 데이터로 작동함이 라이브에서 확인됨**
  — ATF 6/6 DISTINCT, next 교집합 0
- 동일 route set(01009↔01010, 01013↔01014)에서도 성립 → **V3 26개 재심사에 쓸 근거가 확보됨**
- 단 V3 26개는 대부분 이 패턴을 그대로 반복하게 되므로, 확대 시 E절 유사도(cosine 0.95+)와
  M절 카드 중복이 페이지 수에 비례해 누적될 수 있다는 점이 함께 고려돼야 한다
- **본 감사는 Stage 2를 승인하지 않으며, 확대 수량도 결정하지 않는다.**

## V. BLOCK / 이견 / 위험

- **BLOCK 0** (§33 9조건 전항 해당 없음)
- 이견 없음
- 위험: 이번 판정은 배포 당일 기술·콘텐츠 실측에 기반한다. **검색엔진의 실제 중복 판정은 아직
  관측되지 않았으므로**, T절 ①의 후속 감사 전까지 "Google이 중복으로 보지 않는다"는 주장은 하지 않는다

---

**감사 종료 확인**: 코드 변경 0 · docs는 이 감사 문서 1건만 신규 · Production 변경 0 ·
Stage 2 미결정 · AdSense 재신청 미판단.

캡처 15장: `~/Desktop/seoul-shots/Stage1-PostLaunch-Audit/`
(모바일 390 10장 · 데스크톱 4장 · A160 밀도 1장)
