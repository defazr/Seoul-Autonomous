# Stop-1F EN Metadata Polish — Post-launch Targeted READ-ONLY Audit

- 라운드: Phase Stop-1F 표적 재감사 (지시서 §0~§19)
- 일자: 2026-08-27
- 성격: **표적 READ-ONLY** — 코드·데이터·Production 변경 0, 산출물은 이 문서 1건
- **최종 판정: CLOSED** — Stop-1E post-launch audit의 IMPROVE 항목 ① 종결

---

## 1. 판정

**CLOSED.** §2의 8개 조건을 전부 만족한다: 방향쌍 3쌍 title·description prefix 문제 해소 ·
새 문구가 사용자에게 무리 없이 읽힘(ACCEPTABLE) · 공식 EN명 원문 보존 · KO metadata 불변 ·
visible body 불변 · canonical/alternates/sitemap 불변 · EN 타 페이지 회귀 0.

이번 감사는 Stop-1E 전체 UX/SEO 감사를 반복하지 않았고, 기존 backlog도 재판정하지 않았다.

## 2. 기준점

```
Git local = origin/main   19ebf0eafd3450484959465946f5fa89a80c9ff8  (0/0, tracked clean)
미추적                     10건 (기존 보존 7 + docs 3) 비접촉
live sitemap              69 · Stop URL 14
Production                runtime=latest 정렬 완료 (배포·latest 게이트에서 확인 — 이번 감사 SSH 미사용)
```

## 3. EN title 7/7

```
Stop 01009 · Gwanghwamun Station — Seoul Autonomous
Stop 01010 · Gwanghwamun Station — Seoul Autonomous
Stop 01013 · Jongno 2-ga — Seoul Autonomous
Stop 01014 · Jongno 2-ga — Seoul Autonomous
Stop 01007 · Seoul Museum of History, Gyeonghuigung Palace — Seoul Autonomous
Stop 01008 · Seoul Museum of History, Gyeonghuigung Palace — Seoul Autonomous
Stop 01019 · Jongno 5(o)-ga.Gwangjang Market — Seoul Autonomous
```

7/7 존재·200 · 7/7 고유 · 형식 `Stop {ars} · {officialName} — Seoul Autonomous` 정규식 일치 ·
placeholder 노출 0 · punctuation 정상(`·` 1개 + `—` 1개).

## 4·5·12. 방향쌍 prefix 전후 비교 (개선 ① 종결 증명)

| pair | before title split | after title split | before desc split | after desc split | p10 | p20 | p30 | p40 | 판정 |
|---|---:|---:|---:|---:|:-:|:-:|:-:|:-:|---|
| 01009↔01010 | 29 | **8** | 55 | **8** | O | O | O | O | CLEAR |
| 01013↔01014 | 22 | **9** | 48 | **9** | O | O | O | O | CLEAR |
| **01007↔01008** | **56** | **9** | **82** | **9** | O | O | O | O | **CLEAR** |

Stop-1E audit에서 POOR/DUPLICATE-RISK로 판정됐던 01007↔01008이 title 56→9자, description
82→9자로 이동해 **prefix 10자 구간에서 이미 구분**된다. 세 쌍 전부 CLEAR.

## 5. EN description 7/7

7/7 존재·고유 · 전부 `Stop {ars} — `로 시작 · `Autonomous routes:` 유지 · `Next stop(s):` 유지 ·
의미 손실 0.

```
Stop 01007 — Seoul Museum of History, Gyeonghuigung Palace. Autonomous routes: Saebyeok A160,
Saebyeok A741 and Simya A21. Stop order, previous and next stops on each route.
Next stops: Gwanghwamun Station.

Stop 01008 — Seoul Museum of History, Gyeonghuigung Palace. Autonomous routes: Saebyeok A160
and Simya A21. Stop order, previous and next stops on each route.
Next stops: Seodaemun Station- Sageori.
```

route set이 3 vs 2로 다르다는 실제 차이도 description 안에서 그대로 드러난다.

## 6. 사람이 읽는 자연스러움 — **ACCEPTABLE**

실제 브라우저(390px, 라이브)에서 EN 01009·01007·01019·01008 확인. pageerror 0, overflow 0.

| 질문 | 판정 |
|---|---|
| ① ID 선두가 지나치게 기계적인가 | 아니다. `Stop 01007`은 숫자 나열이 아니라 라벨이며, 서울 버스정류장 표지판에 ARS 번호가 실제로 표기되어 현장 대조에 쓰인다 |
| ② ARS identity를 먼저 이해하기 쉬운가 | 그렇다. 30자 잘림에서도 `Stop 01007 · Seoul Museum of H`로 ID와 이름 시작이 함께 보인다 |
| ③ official name이 뒤에 와도 의미 파악에 문제 없는가 | 없다. 51~77자 title에서 이름이 전부 노출되고, **본문 H1은 여전히 공식명 단독**이라 페이지를 열면 이름이 먼저 읽힌다 |
| ④ `·`와 브랜드 `—`가 충돌하는가 | 충돌 없음. 각 1회씩만 등장하고 역할이 분리된다(내부 구분 vs 브랜드 접미사) |

**NATURAL이 아니라 ACCEPTABLE로 판정하는 이유**: 일반 독자에게 가장 자연스러운 어순은 여전히
이름 우선이다. ID 선두는 방향쌍 구분을 위해 의도적으로 택한 trade-off이며, 그 대가가 크지 않다는
판정이다. §2에 따라 ACCEPTABLE은 CLOSED 가능 조건이다.
Google의 실제 SERP pixel 렌더는 단정하지 않는다(문자 기준 측정만 수행).

## 7. 공식 EN 원문 보존

7/7 stop에서 title·description·H1 세 곳 모두 공식명 원문 일치. 축약·교정 0.
특수문자 보존 확인: `Jongno 5(o)-ga.Gwangjang Market`, `Seoul Museum of History, Gyeonghuigung Palace`,
이웃 정류장의 `Seodaemun Station- Sageori`(공식 표기 그대로).

## 8. OG / Twitter

대표 3개(01009·01007·01019)에서 `og:title`·`twitter:title` = `<title>`,
`og:description`·`twitter:description` = description으로 **의도한 propagation 확인**
(`buildPageMetadata` 경유). 별도 정책 신설 없음.

## 9. KO 완전 불변

KO 7 stop의 title·description **14/14 문자열 완전 일치**(Stop-1F 배포 전 라이브 baseline 대조).
변경 0.

## 10. visible body 불변

EN 01007·01008·01009 + KO 01007 H1 불변. EN 01009 본문에서 ARS·다음 정류장 union·노선 칩·
위치 카드·이전/다음·provenance 전부 유지. **본문에 새 title 문자열(`Stop 01009 ·`)이 존재하지
않음** → metadata 수정이 body로 새지 않았음을 실증.

## 11. SEO 구조 불변

14 URL 전수: canonical 자기참조 불변 · alternates 불변 · noindex 0 · X-Robots 없음 ·
BreadcrumbList JSON-LD 문자열 단위 불변 · sitemap 69 · Stop 14 · lastmod `2026-05-01` 단일 ·
**Stop slug 집합 배포 전과 동일**(URL 변경 0).

## 12. EN 전역 회귀

`/en` · `/en/routes` · `/en/routes/saebyeok-a160` · `/en/routes/simya-a21` · `/en/routes/late-night` ·
`/en/faq` · `/en/how-to-ride` · Robotaxi update — **8/8 200 + title 불변**.
`messages/en.json` 공유 파일 수정의 부작용 0.

## 13. 개선 ① 상태

**CLOSED.** Stop-1E post-launch audit S절 개선 항목 ①(EN 방향쌍 title/description prefix 동일)은
Stop-1F 배포로 해소됐음을 수치로 확인했다.

## 14. 기존 backlog — 그대로 유지 (재판정 없음)

- ② 01008 카드 간 이웃 완전 중복 (데이터 정확, 표시 정책 사안 — V3 26 재심사와 함께 설계)
- ③ 데스크톱 카드·provenance 여백
- ④ tap target 44px (1C backlog 합류)
- ⑤ **2~3주 후 Search Console index audit** (색인 여부·duplicate 판정·impressions)
- 1C 기존 backlog 3건

이번 감사에서 새로 발견된 중대 부작용은 **없다**.

## 15. BLOCK / 이견 / 위험

- **BLOCK 0** (§17 9조건 전항 미해당)
- 이견 없음
- 위험: 검색엔진의 실제 중복 판정은 여전히 관측 전이다. 이번 CLOSED는 **문자 기준 prefix 구분이
  해소됐다**는 판정이지 "Google이 두 페이지를 다르게 취급한다"는 확인이 아니다 — 그 확인은
  backlog ⑤의 Search Console audit 몫이다

---

**감사 종료 확인**: 코드 변경 0 · Production 변경 0 · docs는 이 감사 문서 1건만 신규 ·
Stage 2 미결정 · AdSense 재신청 미판단.

캡처 4장: `~/Desktop/seoul-shots/Stop-1F-Targeted-Audit/`

**다음 단계**: Stop-1E + Stop-1F 전체 docs 정본화 → docs commit → push → Stage 1 전체 라운드 CLOSED.
