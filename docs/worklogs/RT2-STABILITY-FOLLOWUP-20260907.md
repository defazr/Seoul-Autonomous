# RT-2 Production Stability Follow-up — READ-ONLY Audit (2026-09-07)

> 대상: RT-2 KO 01009 실시간 도착 카드 Production 운영 상태
> 성격: **READ-ONLY 감사.** 서버 변경 0 · 코드 변경 0 · commit/push/deploy 0 ·
> 신규 upstream 호출 0 · secret 내용 열람 0회
> 선행 정본: `RT2-PRODUCTION-DEPLOYMENT-20260901.md` · `RT2-POST-LAUNCH-AUDIT-20260901.md`

---

## 0. 판정

```
Runtime / operational stability: PASS

Real-usage / long-load evidence: WATCH

Overall product state:
RT-2 KO 01009 remains CLOSED / Production Live Approved.
```

**이 WATCH는 RT-2 재오픈 사유가 아니다.**

### PASS 근거

배포 후 5일 17시간 41분 동안 재시작 0 · OOM 0 · 좌표 drift 0 ·
RT-2 failure reason 8종 전부 0 · secret 운영 계약 유지.

### WATCH 근거

```
· 배포 당일(09-01) upstream 실호출 7회
· 09-02 ~ 감사 시점(09-07 12:48 KST) upstream 실호출 0회
· 따라서 장기간 실제 사용자 부하 표본은 확보되지 않았다
· 이것은 기능 장애의 증거가 아니다
· 방문자 0인지, 크롤러 중심 접근인지 현재 telemetry만으로 판별 불가
```

### 이 문서가 주장하지 않는 것

아래는 **현재 증거로 전부 미확정**이며 사실처럼 기술하지 않는다.

```
사용자가 RT-2 를 쓰지 않는다
실시간 카드에 가치가 없다
RT-2 가 노출되지 않았다
기능이 작동하지 않았다
```

09-01 Production 에서 동일 코드·동일 이미지로 실호출 7회가 정상 동작했고
그 이후 코드·이미지 변경이 0이므로, **기능 결함 가설은 근거가 약하다.**

---

## 1. 감사 메타

```
audit time     2026-09-07 12:48 KST
elapsed        배포 후 5일 17시간 41분
배포 기준시각   2026-09-01 19:07:32 KST
방법           SSH read-only. docker inspect / docker logs / stat / sha256sum
신규 트래픽     0 (curl·브라우저 요청 생성 없음)
```

---

## 2. 좌표 — 전 축 일치

```
local HEAD          4af3bb7
origin/main         4af3bb7            ahead/behind 0/0
server checkout     b10c7d3333b9e448fcfe2b116301635bd178d160
Production runtime  b10c7d3333b9e448fcfe2b116301635bd178d160   (OCI revision label)
image / latest      sha256:d55dbf7d9afdcefa10968507e26d3ad6fa5302cb94801ec5b242f4011f2c3fa5
IMAGE_MATCH         PASS  (running image == latest)
sitemap 69 · Stop URL 14
```

**`local/origin = 4af3bb7` 와 `server/runtime = b10c7d3` 의 차이는 RT-2 docs closure 커밋
때문이며 drift 가 아니다.** 단일 SHA 기대 계약을 쓰지 않는다.

부수 확인:

```
server working-tree   `?? Dockerfile` 1줄만 (tracked 0 · staged 0) — 계약 준수
Dockerfile PIN        01429bd8539ae6918b86f0218cdc54027cd8423819d881a0128a587a5d2c68ac  일치
Caddyfile sha256      c35aa1c06d480b5802df75235de53a6a3defa80e348445e0bccbcb7c8e49e585  불변
candidate 컨테이너     0개
```

---

## 3. Container stability

```
status              running / ExitCode 0 / Error 없음
StartedAt           2026-09-01 19:07:32 KST   ← 배포 시각과 초 단위 일치
RestartCount        0
OOMKilled           false
RestartPolicy       unless-stopped
Hostname            0.0.0.0                   ← standalone bind 계약 유지
healthcheck         정의 없음 (해당 없음)
리소스               mem 86.6MiB / 3.81GiB (2.2%) · cpu 0.00% · pids 11
server reboot       0 (uptime 48일)
```

StartedAt 이 배포 시각과 일치하고 RestartCount=0 이므로 **재시작·재생성 둘 다 없었다.**
budget 카운터는 process-local 이지만 restart 가 0이므로 **리셋 왜곡이 없다** —
호출량을 restart 로 역산할 필요가 없었다.

보존 자산: **backup 컨테이너 8 · rollback 태그 16 · 삭제 0 · prune 0.**
전체 컨테이너 17개 **RestartCount 전부 0** · 디스크 35G 여유(52%).

---

## 4. Secret contract — 유지

```
/etc/seoul-autonomous/secrets               root:root  700
/etc/seoul-autonomous/secrets/realtime.env  root:root  600
mtime  2026-09-01 17:50 — 구축 이후 변경 없음
컨테이너 내 BUS_API_SERVICE_KEY = present
```

**`cat`/`grep`/`sed` 0회, `Config.Env` 미조회(개수만 확인).**
키 값·길이·파일 크기·일부 문자열은 이 문서에 기록하지 않는다.
상위 `/etc/seoul-autonomous` 755 는 기존 확정 사항(실제 차단은 `secrets/` 700 + 파일 600).

---

## 5. RT-2 error audit — 8종 전부 0

### 전수 감사 성립 증명 (선행)

```
log driver      json-file
rotation        미설정 (LogOpts 비어 있음)
로그 첫 줄       StartedAt + 1초
RestartCount    0
→ 배포 시점부터 감사 시점까지 로그 유실 0. 아래 0 은 "관측된 0" 이다.
```

### 결과

| failure reason | 건수 |
|---|---|
| AUTH_ERROR | 0 |
| UPSTREAM_QUOTA | 0 |
| TIMEOUT | 0 |
| APP_BUDGET_EXHAUSTED | 0 |
| UPSTREAM_ERROR | 0 |
| CONFIG_ERROR | 0 |
| zero approved routes | 0 |
| anomaly | 0 |

`unhandledRejection` · `uncaughtException` · `FATAL` · `ECONNREFUSED` ·
`ETIMEDOUT` · `ENOTFOUND` · `EAI_AGAIN` **전부 0**.

### 키 유출 스캔

```
앱 로그 내 ws.bus.go.kr        0
앱 로그 내 serviceKey          0
앱 로그 내 BUS_API_SERVICE_KEY  0
40자+ 토큰 11건               11/11 전부 Failed to find Server Action 줄의 action ID
미분류 토큰                    0
```

---

## 6. Upstream / budget

### 관측 가능 (정확)

실호출마다 `[rt2] upstream call stop=… budget=N/300` 이 남고 로그가 무결하므로
**호출량은 정확히 재구성된다.**

| KST | upstream calls |
|---|---|
| 09-01 | **7** |
| 09-02 | 0 |
| 09-03 | 0 |
| 09-04 | 0 |
| 09-05 | 0 |
| 09-06 | 0 |
| 09-07 (12:48 audit time) | 0 |

```
maximum budget observed   7/300  (2.3%)
300 근접                  0회
APP_BUDGET_EXHAUSTED      0회
UPSTREAM_QUOTA            0회
[rt2] 로그 총량            7줄 · 마지막 09-01 20:23 KST
```

budget bucket 은 KST 로 직접 계산되어 컨테이너 TZ 에 의존하지 않는다.

### 관측 불가능 — 추정으로 메우지 않음

```
페이지 뷰 / 방문자 수        재구성 불가
  · 앱 로그에 HTTP 요청줄 0
  · Caddy 에 access log 지시자 0 → http.log.access 로거 0건
cache hit 수               미기록
single-flight follower 수   미기록
클라이언트측 fetch 실패      브라우저에서 종료되어 서버 로그에 도달하지 않음
```

`upstream 0` 은 **arrival fetch 가 0건이었다**는 사실까지만 증명한다.
그 원인이 방문 부재인지 크롤러 중심 접근인지는 **판별할 수 없다.**

> **Resolved by GA4 follow-up (2026-09-07, 같은 날 후속):** 위 문장은 작성 시점에는
> 정확했다. 이후 확보한 GA4 데이터로 원인이 판별됐다 — `/ko/stops/01009` 는
> 08-27 views 3 · **09-01 views 17**(RT-2 배포일 QA) · **09-02~09-07 views 0** 이고,
> 전체 `/stops/` 도 같은 기간 1 view 다. 같은 기간 사이트 전체는 일 19~35 views 로
> 정상 유입 중이었다. 따라서 **09-02 이후 upstream 0 은 해당 Stop 페이지의 실제 방문이
> 사실상 없었던 것과 일치하며, 기능 결함 증거가 아니다.**
> 방문이 없었던 이유는 별건이다 — 정본 `STAGE1-DISCOVERY-T0-20260907.md`
> (Search Console gate FAIL — NOT DISCOVERED).

---

## 7. 별도 발견 — `Failed to find Server Action`

```
RT-2 regression 아님
배포 전에도 존재
09-02 spike 이후 기존 수준으로 감소
별도 backlog
```

근거(대조군 실측):

```
배포 전 컨테이너 19ebf0e   31건 / 가동 4.9일
배포 후 컨테이너 b10c7d3   211건 / 5.74일
  일별  09-01 0 · 09-02 144 · 09-03 35 · 09-04 14 · 09-05 7 · 09-06 3 · 09-07 8
```

09-02 단일 버스트 이후 3~8건/일로 감쇠했다.
이 사이트에는 Server Action 이 없고, RT-2 가 추가한 것은 Route Handler 다.

**이 문서에서 해결책 구현을 제안하지 않는다.**

---

## 8. Caddy 측 — 설명됨

배포 이후 우리 도메인 관련 오류 31건:

```
2건   dial tcp …:3000 connection refused · GET /ko · 502
      → 전부 09-01 19시대 = cutover 1.87초 창. 문서화된 정상
29건  aborting with incomplete response
      → 클라이언트가 응답 중 연결 종료. 서버 실패 아님
```

---

## 9. 이번에 열지 않는 backlog

```
.playwright-mcp/ 반복 재생성        housekeeping backlog
.gitignore 추가                    미승인
Failed to find Server Action 프로빙  RT-2 와 별도 backlog
RT-2 observability 개선            7-stop 확장 판단 시 검토 후보 (제품 코드 선행 구현 금지)
A21 static 40 ↔ API 44             RT-3 시작 전 CLOSE 필수
EN localization                    기존 gate 유지
```

---

## 10. 다음 gate

```
NEXT MAJOR GATE
2026년 9월 중순 Search Console Stage-1 감사
대상: 7 Stop × KO/EN = 14 URL

색인 정상   → RT-2 나머지 6 Stop 확장 검토
색인 부진   → 확장 / RT-3 / EN realtime 을 열지 않고 색인 원인부터 조사
AdSense     → Search Console 결과 및 후속 상태를 본 뒤 별도 GO/HOLD
```

---

## 11. CC 이견 및 아이디어

**이견 1 — 등급 분리는 CC 원안보다 정확하다.** CC 는 단일 `WATCH` 로 보고했으나,
운영 안정성(측정됐고 통과)과 실사용 증거(표본 부재)를 한 등급에 담으면 두 사실이 모두 흐려진다.
포그린의 2분할이 실측 구조와 더 정확히 대응한다.

**이견 2 — 이번 감사의 산출물은 안정성 확인만이 아니다.**
`5.7일 upstream 0` 은 기능 실패의 증거가 아니라 **방문·노출 여부를 알 수 없다는 증거**다.
지금 observability 코드를 넣어 Production 을 흔드는 것보다 Search Console 데이터를
기다리는 편이 맞다 — 이 판단은 포그린 결정과 일치한다.

**아이디어 1.** 앱 로그 648줄 중 633줄이 프로빙 에러다. 이번엔 `[rt2]` 접두사 덕분에
분리됐지만 확장 후 노이즈가 커지면 감사 비용이 오른다. 별도 backlog 후보로만 남긴다.

**아이디어 2.** 일 1회 요약 라인 형태의 최소 telemetry 로 §6 관측 공백 상당 부분이 닫힌다.
**이번 범위 밖이며 제품 코드로 선행 구현하지 않는다.** 7-stop 확장 지시서에서 함께 판단할 사안.
