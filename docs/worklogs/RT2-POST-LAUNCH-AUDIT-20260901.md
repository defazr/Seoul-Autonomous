# RT-2 Post-launch READ-ONLY Audit — KO 01009

> **판정: PASS · BLOCK 0 · 변경 0**
> 감사 실시 2026-09-01 (배포 완료 약 14분 후) · 읽기 명령만 사용
> 배포 실행 기록은 `RT2-PRODUCTION-DEPLOYMENT-20260901.md`.

---

## 0. 감사 성격과 한계 (먼저 명시)

```
post-deploy immediate audit PASS; long-term stability not established.
```

이 감사는 **배포 직후 즉시 장애가 없음**을 확인한 것이다. 관측 기간이 **약 14분**이고
그 시간대는 실사용 트래픽이 거의 없었다. 따라서 **장기 안정성의 근거가 아니다.**

며칠 뒤 동일 감사를 한 번 더 돌리는 것이 stability follow-up 후보다(§7).

---

## 1. 좌표 불변 — 전항 일치

| 항목 | 실측 |
|---|---|
| local HEAD | `b10c7d3333b9e448fcfe2b116301635bd178d160` |
| origin/main | `b10c7d3333b9e448fcfe2b116301635bd178d160` (일치) |
| server checkout | `b10c7d3333b9e448fcfe2b116301635bd178d160` |
| runtime revision | `b10c7d3333b9e448fcfe2b116301635bd178d160` |
| running image | `sha256:d55dbf7d9afd…` |
| `latest` image | `sha256:d55dbf7d9afd…` → **IMAGE_MATCH=PASS** |
| restart policy | `unless-stopped` |
| container uptime | Up 14분 |
| candidate 컨테이너 | **0개** (제거 확인) |
| backup 보존 | `seoul_autonomous_web_backup_19ebf0e_20260901-190732` Exited (143) |
| rollback 태그 | `rollback-19ebf0e` → `2e6545253cc4` 보존 |

---

## 2. Live 기능 smoke — 전항 PASS

| 항목 | 결과 |
|---|---|
| KO 01009 | **200** |
| 정적 노선 운행 안내 | **1건 존재** |
| `/api/arrivals/01009` | **200** |
| 반환 노선 | `saebyeok-a160=ended` · `saebyeok-a741=ended` · `simya-a21=ended` — **3건** |
| approved-route filtering | 우리 3개만 (01009 는 22 노선 경유) |
| EN 01009 realtime/serviceHours | **0** |
| KO 01010 신규 RT-2 요소 | **0** |
| `/api/arrivals/99999` | **404** |
| sitemap | **69** |
| canonical | `https://seoulautonomous.com/ko/stops/01009-gwanghwamun-station` |
| HTML ServiceKey · `ws.bus.go.kr` leakage | **0** |

**현재 전부 `운행종료` = C 상태이며 설계상 정상이다.** 이 상태에서 실시간 카드는 숨겨지고
정적 노선 운행 안내가 그 자리를 대신한다.

---

## 3. 배포 이후 로그 감사 — 전항 0

로그는 **요약 지표만** 확인했다. raw dump · ServiceKey · raw API response · `plainNo` 출력 0.

```
unhandledRejection / uncaughtException / FATAL   0
Error:                                            0
AUTH_ERROR                                        0
CONFIG_ERROR                                      0
UPSTREAM_ERROR                                    0
reason=TIMEOUT                                    0
UPSTREAM_QUOTA                                    0
APP_BUDGET_EXHAUSTED                              0
anomaly: zero approved routes                     0

RestartCount = 0
OOMKilled    = false
StartedAt    = 2026-09-01T10:07:32Z   (cutover 시각과 일치)

upstream call  3회
budget         3/300
```

**budget 3/300 은 정상 범위다.** 배포 직후 확인 1회 + 감사 호출 2회이며, 자연 트래픽 급증 신호가 아니다.
budget 은 실제 upstream 요청 시작 직전에만 차감되므로 이 수치는 실제 서울시 호출 횟수와 같다.

---

## 4. secret / runtime 계약 (값 미출력)

```
DIR   /etc/seoul-autonomous/secrets          OWNER=root:root  MODE=700
FILE  /etc/seoul-autonomous/secrets/realtime.env   OWNER=root:root  MODE=600
KEY_ENTRY = PASS
```

`stat` 와 `grep -q`(참/거짓만)로만 확인했다. `cat` · `env` · `printenv` ·
secret 을 포함하는 `docker inspect` 출력 **사용 0**.

---

## 5. 인프라 무변경

| 항목 | 실측 |
|---|---|
| Caddyfile sha256 | `c35aa1c06d480b5802df75235de53a6a3defa80e348445e0bccbcb7c8e49e585` — 배포 전과 **동일** |
| Caddy 상태 | `running` · `RestartCount=0` · 2026-07-20 부터 무재시작 |
| 타 컨테이너 restart | `calc_fazr_web` · `dustfazr_db` · `apps_ng_web` · `vat_web` · `debt-workbench-web` · `debt-workbench-db` · `apps_ng_caddy` · `apps_ng_db` — **8개 전부 `RestartCount=0`** |
| disk | 35G 여유 (52% 사용) |
| rollback 태그 | 16 observed |
| backup 컨테이너 | 8 observed |
| delete / prune | **0** |

---

## 6. Dockerfile pin — PASS

```
git status --porcelain   →  ?? Dockerfile   (정확히 1줄)
sha256sum Dockerfile     →  01429bd8539ae6918b86f0218cdc54027cd8423819d881a0128a587a5d2c68ac
배포 시 pinned           →  동일
PIN = PASS
```

배포 과정에서 checkout 이 `19ebf0e` → `b10c7d3` 로 바뀌었음에도 hash 가 불변이다.

> 🔒 pin 은 **동일성만 보장**하며 Dockerfile 의 정당성을 보장하지 않는다.
> repo 편입은 별도 backlog.

---

## 7. WATCH / backlog (RT-2 를 다시 OPEN 시키지 않는다)

| 항목 | 등급 |
|---|---|
| 자연 운행시간대 Production **B 화면 시각 관측** | **non-blocking WATCH** |
| 며칠 뒤 Production 로그·호출량 재감사 | stability follow-up 후보 |
| dev AbortError / cleanup-state flow | expansion 전 TECH-DEBT |
| CLS `0.0994` | pilot ACCEPT / expansion WATCH |
| RT-2 7-stop 확장 | **미승인** |
| EN realtime localization | **미승인** (기존 gate 유지) |
| RT-3 map | 별도 round |
| `System restart required` | **별도 운영 라운드** |
| backup / image retention policy | 별도 운영 backlog |
| server-only Dockerfile 의 repo 편입 | 별도 backlog |

### 7-1. 자연 B 를 non-blocking 으로 두는 근거

RT-2 가 검증해야 할 것은 *"실시간 데이터를 받아 올바르게 렌더하는가"* 이며, 세 층에서 각각 닫혔다.

```
RT-1        실제 arrmsg 5종 관측 (N분후[K번째 전] · 곧 도착 · 운행종료 · 출발대기 · 회차대기)
local pilot B 렌더 시각 승인 (정렬·조판·새로고침·stale 포함)
Production  실제 API path 200 · ServiceKey/auth/parser/filter PASS
```

자연 B 는 이 세 층이 실제로 만나는 순간일 뿐 **새로운 검증 축이 아니다.**
blocking 으로 올리면 평일 새벽에만 열리는 창을 기다리느라 closure 가 늘어지고,
그 압박이 **"fixture 를 Production 에 주입해볼까"** 같은 유혹을 만든다.

**데이터 조작 · fixture 의 Production 주입은 금지한다.** 자연 관측 시 read-only 기록만 남긴다.

---

## 8. 최종 판정

```
RT-2 KO 01009 = CLOSED / Production Live Approved
post-launch READ-ONLY audit = PASS / BLOCK 0
```

---

## CC 이견 및 아이디어

### ① 자연 B 관측을 closure 이후 WATCH 로 두는 데 대한 이견
**이견 없음.** §7-1 의 근거대로 등급이 정확하다.

### ② 로그에서 새 리스크 발견 여부
**없다.** 에러 계열 9종이 전부 0이고 `RestartCount=0` · `OOMKilled=false` 다.
다만 §0 에 적은 대로 **관측 기간 14분** 이라는 한계가 결과의 해석 범위를 정한다.

### ③ Dockerfile pin 계약
**유효했고 상시 계약으로 승격을 권한다.** checkout 이 바뀌어도 hash 가 불변임을 실측으로 확인했고,
이는 untracked 파일이 git 조작에 영향받지 않는다는 사실의 직접 증거다.
다만 pin 은 immutability 만 보장하므로 **repo 편입이 근본 해결**이며 별도 backlog 가 맞다.

### ④ restart-required 별도 라운드 필요성
**필요하다.** 지금 RT-2 와 분리한 판단은 옳지만 방치할 사안은 아니다.

- 커널·보안 패치가 미적용 상태로 누적된다.
- **재부팅 시 `restart unless-stopped` 로 9개 컨테이너가 전부 정상 복귀하는지 확인된 적이 없다.**
  Caddy 는 2026-07-20 부터, 나머지는 6주째 무재시작이다 — 이 서버 구성으로 재부팅을 겪어본 적이
  없을 가능성이 있다.
- 재부팅의 영향 범위는 RT-2 보다 훨씬 넓다(9 컨테이너 · 6 도메인).
  **RT-2 와 완전히 분리된 시점에** 별도 라운드로 다루는 것이 맞다.

### ⑤ 이견 없음 아님
②의 **관측 기간 14분 한계**와 ④의 **재부팅 시 컨테이너 복귀 미검증**은 기록해 둘 실질 사항이다.
