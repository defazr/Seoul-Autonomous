# RT-2 Production Deployment — KO 01009 실시간 도착 카드

> **판정: `RT-2 KO 01009 = CLOSED / Production Live Approved`**
> 배포 실시 2026-09-01 19:07 KST · downtime **1.87초** · BLOCK 0
> 이 문서는 배포 실행 기록의 정본이다. 감사 결과는 `RT2-POST-LAUNCH-AUDIT-20260901.md`.

---

## 0. 최종 좌표

```
Git local / origin   b10c7d3333b9e448fcfe2b116301635bd178d160
server checkout      b10c7d3333b9e448fcfe2b116301635bd178d160
runtime revision     b10c7d3333b9e448fcfe2b116301635bd178d160
image / latest       sha256:d55dbf7d9afdcefa10968507e26d3ad6fa5302cb94801ec5b242f4011f2c3fa5
sitemap              69
Stop URLs            14
```

4축(Git·origin·server checkout·runtime)이 전부 `b10c7d3`로 정렬됐고 `latest`도 Production image ID와 일치한다.

---

## 1. 배포 범위

**KO `/ko/stops/01009-gwanghwamun-station` 한 페이지의 실시간 도착 카드 + 정적 노선 운행 안내.**

```
EN 전체                 무변경 (realtime·serviceHours 렌더 0)
KO 01010 등 비-pilot     무변경 (신규 RT-2 요소 0)
Production 다른 페이지    무변경
잠금 예외                approved server-side arrival proxy only
                        (= /api/arrivals/[stopId] 서버측 호출만)
```

브라우저 → 서울시 API 직접 호출은 **영구 금지**이며 이번에도 도입하지 않았다.

---

## 2. Phase 0 — immutable checks

| 항목 | 실측 |
|---|---|
| local HEAD = origin/main | `b10c7d3…` 일치 |
| local 작업트리 | 14항목 (미커밋 docs) |
| server checkout (배포 전) | `19ebf0e…` |
| runtime revision (배포 전) | `19ebf0e…` |
| current image ID | `sha256:2e6545253cc4…` |
| `seoul-autonomous-web:19ebf0e` ID | `sha256:2e6545253cc4…` — 동일 |
| disk | 35G 여유 (52% 사용) |
| secret DIR / FILE | `root:root 700` / `root:root 600` |
| KEY_ENTRY | PASS |

### 2-1. working-tree gate 수정 (이번 배포에서 확정)

최초 게이트 문구 *"server working tree clean"* 은 **미충족**이었다. `/opt/seoul-autonomous`에
**untracked `Dockerfile` 1건**이 존재했기 때문이다. 이진 판정 규칙에 따라 Phase 0에서 정지·보고했고,
포그린 판단으로 게이트를 다음과 같이 교체했다.

```
tracked modifications = 0
staged changes        = 0
untracked             = Dockerfile 1건만 허용
+ Dockerfile SHA-256 을 pin 하고 checkout 후·build 후 재확인
```

실측 결과 `TRACKED=PASS` · `STAGED=PASS` · `git status --porcelain` 정확히 `?? Dockerfile` 1줄.

> ⚠️ 이 Dockerfile 은 **repo 에 존재하지 않는 server-only untracked 운영 자산**이다(파일 날짜 2025-05-09).
> 자세한 계약은 §8-2.

### 2-2. rollback 자산 선보존 (cutover **전**)

```bash
docker tag seoul-autonomous-web:19ebf0e seoul-autonomous-web:rollback-19ebf0e
```

```
Production image  sha256:2e6545253cc4…
rollback tag      sha256:2e6545253cc4…      MATCH=PASS
```

`latest` 는 이 시점에 **이동하지 않았다**(라이브 승인 후로 분리).

---

## 3. Phase 1 — build

```bash
cd /opt/seoul-autonomous
git checkout b10c7d3333b9e448fcfe2b116301635bd178d160

docker build \
  --label org.opencontainers.image.revision=b10c7d3333b9e448fcfe2b116301635bd178d160 \
  -t seoul-autonomous-web:b10c7d3 \
  /opt/seoul-autonomous
```

**검증**

```
revision label   b10c7d3333b9e448fcfe2b116301635bd178d160
image ID         sha256:d55dbf7d9afd…
Config.Env       ["PATH=…","NODE_VERSION=20.20.2","YARN_VERSION=1.22.22","NODE_ENV=production"]
                 → secret bake 0
Dockerfile hash  01429bd8…68ac  (checkout 후·build 후 모두 Phase 0 과 동일)
```

`git checkout` 으로 소스가 `19ebf0e` → `b10c7d3` 로 바뀌었는데도 hash 가 불변이라는 사실이,
untracked 파일이 git 조작에 영향받지 않음을 실측으로 확인해 준다.

---

## 4. Phase 2 — candidate pre-cutover ⭐ (현 Production 무접촉)

### 4-1. 왜 가능한가

```
/etc/caddy/Caddyfile:45
  seoulautonomous.com {
      reverse_proxy seoul_autonomous_web:3000 { … }
```

Caddy 는 **컨테이너 이름 `seoul_autonomous_web` 하나만** Docker network DNS 로 참조한다.
따라서 **다른 이름의 컨테이너는 외부 트래픽을 0으로 받으면서** 같은 네트워크·같은 secret 으로 검증할 수 있다.

### 4-2. 실행

```bash
docker run -d --name seoul_autonomous_web_candidate \
  --network apps-newsforgreens_default \
  --restart no \
  -e NODE_ENV=production \
  --env-file /etc/seoul-autonomous/secrets/realtime.env \
  --hostname 0.0.0.0 \
  seoul-autonomous-web:b10c7d3
```

`--restart no` 는 의도적이다 — candidate 가 잊혀져도 재부팅 시 부활하지 않는다.
`--hostname 0.0.0.0` 은 필수다(누락 시 Next standalone 이 컨테이너 해시에 bind 되어 내부 fetch 실패, 실사고 1회).

### 4-3. 검증 결과 — 전항 PASS

| 항목 | 결과 |
|---|---|
| 정적 shell health | `HTTP/1.1 200 OK` |
| `/api/arrivals/01009` | `{"stopId":"01009","items":[a160·a741·a21]}` |
| 서버 로그 | `[rt2] upstream call stop=01009 budget=1/300` |
| `AUTH_ERROR` / `CONFIG_ERROR` | **없음** |
| 현 Production | `Up 4 days` · `19ebf0e` — **무접촉** |

**이 응답 하나가 5가지를 동시에 증명한다**: ServiceKey 유효 · server egress · auth 통과 ·
XML parser · approved route filtering(01009 의 22 노선 중 우리 3개만).

→ **이번 배포 최대 미지수였던 ServiceKey 값의 정확성이 Production 을 건드리기 전에 해소됐다.**

### 4-4. 진행 중 발견 — `localhost` → `127.0.0.1` (§8-1)

첫 health check 가 `Connection refused` 였으나, **대조군으로 현 Production 에 같은 명령을 걸어도 동일 실패**했다.
→ candidate 결함이 아니라 `localhost` 해석 문제였다. `127.0.0.1` 명시로 즉시 200,
`/proc/net/tcp` 에 `00000000:0BB8`(0.0.0.0:3000) 리스닝 확인.

---

## 5. Phase 3 — cutover

```bash
TS=$(date +%Y%m%d-%H%M%S)
docker stop seoul_autonomous_web
docker rename seoul_autonomous_web seoul_autonomous_web_backup_19ebf0e_$TS
docker run -d --name seoul_autonomous_web \
  --network apps-newsforgreens_default \
  --restart unless-stopped \
  -e NODE_ENV=production \
  --env-file /etc/seoul-autonomous/secrets/realtime.env \
  --hostname 0.0.0.0 \
  seoul-autonomous-web:b10c7d3
```

**bounded health probe** (최대 15초, 0.1초 간격 — 무한 loop 금지):

```
HEALTH=PASS   downtime = 1.874141221초   (probe 3회)
```

**cutover 후 좌표**

```
revision        b10c7d3333b9e448fcfe2b116301635bd178d160
image           seoul-autonomous-web:b10c7d3  (sha256:d55dbf7d9afd…)
container ID    73a1eb2e7804
restart policy  unless-stopped
```

candidate 는 **새 Production health PASS 를 확인한 뒤에** 제거했다.
(검증된 컨테이너를 미리 없애면 cutover 실패 시 되돌아갈 자산이 하나 줄어든다.)

Caddyfile 은 **무접촉**이다. 컨테이너 이름이 같으므로 Docker network DNS 재해석만으로 연결된다.

---

## 6. Phase 4 — live QA (전항 PASS)

| # | 항목 | 결과 |
|---|---|---|
| 1 | KO 01009 | **200** |
| 2 | 정적 `노선 운행 시간` | **존재** |
| 3 | `/api/arrivals/01009` | **200** · a160·a741·a21 전부 `운행종료` |
| 4 | approved-route filtering | **우리 3개만** |
| 5 | EN 01009 realtime/serviceHours | **0** |
| 6 | KO 01010 신규 RT-2 요소 | **0** |
| 7 | `/api/arrivals/99999` | **404** |
| 8 | sitemap | **69** |
| 9 | canonical | `https://seoulautonomous.com/ko/stops/01009-gwanghwamun-station` |
| 10 | hreflang | **RT-2 regression 0 / pre-existing state** (§7) |
| 11 | HTML ServiceKey·`ws.bus.go.kr` leakage | **0** |
| 12 | Caddyfile sha256 | `c35aa1c06d48…` **불변** |
| 13 | 타 컨테이너 restart | **8개 전부 0** |
| 14 | Production upstream 호출 | **1회** (`budget=1/300`) |

**전부 `운행종료` = C 상태이며 이는 정상 PASS 다.** 우리 노선은 새벽·심야 전용이라
하루 대부분이 C 이고, 그때 실시간 카드를 숨기고 정적 운행 안내가 그 자리를 대신하는 것이 설계다.

---

## 7. hreflang 판정 — RT-2 regression 0 / pre-existing state

`hreflang` 이 0건이었으나 **RT-2 회귀가 아니다.** 대조 확인:

```
/ko/stops/01010-gwanghwamun-station   hreflang=0   (RT-2 미적용)
/ko/routes                            hreflang=0
/en/routes                            hreflang=0
web/i18n/routing.ts:6                 alternateLinks: false   ← 기존 설정
```

RT-2 와 무관한 **사이트 전역의 기존 상태**다. 이 문서는 `PASS` 대신
**"RT-2 regression 0 / pre-existing state"** 로 기록한다.

---

## 8. 운영 계약으로 승격 (배포 안전 계약 반영 대상)

### 8-1. 컨테이너 내부 HTTP health probe 는 `127.0.0.1`

```
컨테이너 내부 HTTP health probe 는 localhost 대신 127.0.0.1 을 사용한다.
이번 Production 환경에서 localhost 가 IPv6 로 해석되어,
동일 명령이 기존 Production 컨테이너와 candidate 양쪽에서 모두 실패하는 것이 대조군으로 재현됐다.
```

> 범위 주의: 이번 Production 환경에서 대조군까지 재현된 사실이며,
> "이 서버의 모든 컨테이너에서 영구적으로 그렇다"로 일반화하지 않는다.

이 함정을 대조군 없이 만나면 **새 이미지의 결함으로 오판**하기 쉽다. 이번에는 대조군 덕에 회피했다.

### 8-2. server-only Dockerfile + SHA-256 pin

```
/opt/seoul-autonomous/Dockerfile 은 현재 server-only untracked build recipe 다.
working-tree gate 에서는 이 파일 1건만 알려진 예외로 허용하고,
SHA-256 pin 으로 immutability 를 확인한다.

이번 pinned hash: 01429bd8539ae6918b86f0218cdc54027cd8423819d881a0128a587a5d2c68ac
확인 시점: Phase 0 · checkout 후 · build 후 (3회 전부 일치)
```

> 🔒 **pin 은 "파일이 바뀌지 않았다"는 동일성만 보장하며, 그 Dockerfile 의 정당성을 보장하지 않는다.**
> 근본 해결은 repo 편입이며 별도 backlog 다.

⚠️ **기록 정정**: 감사 과정에서 CC 가 *"7번의 성공 배포가 이 상태에서 이뤄졌다"* 고 서술한 바 있으나,
이는 **backup 컨테이너 7개가 존재한다는 관측을 증명으로 격상한 오류**다.
과거 이미지들이 현재 파일과 동일한 바이트로 빌드됐다는 근거는 없다. SHA pin 은 이번 배포부터 적용된다.

---

## 9. rollback 계약 (이번 배포에서 확정)

```
pre-RT2 rollback image  → 기존 legacy docker run 유지 (--env-file 강제 금지)
RT2-capable image 부터   → secret preflight + --env-file /etc/seoul-autonomous/secrets/realtime.env
```

RT-2 이전 이미지에는 `/api/arrivals/[stopId]` 가 존재하지 않아 키가 불필요하다.
전부 `--env-file` 에 의존시키면 **키 파일 사고 시 과거 롤백까지 막히는 새 단일 실패점**이 생긴다.

> ⚠️ CC 는 당초 *"rollback 태그 전부가 이 파일을 필요로 하게 된다"* 고 판단했으나 **오판이었고 정정됐다.**

**secret preflight 가 실패하면 현재 Production 컨테이너를 절대 중지하지 않는다.**
확인 항목: 파일 존재 · owner `root:root` · mode `600` · `BUS_API_SERVICE_KEY` 항목 비어있지 않음 (값 출력 없이).

---

## 10. 보존 자산 — 무손실

```
backup 컨테이너   seoul_autonomous_web_backup_19ebf0e_20260901-190732   Exited (143)
                 backup container 8 observed
rollback 태그     seoul-autonomous-web:rollback-19ebf0e → 2e6545253cc4
                 rollback image tags 16 observed
delete / prune   0
disk             35G 여유 (52% 사용)
```

`observed` 표기는 목록 출력 상한 가능성 때문이며, 정확한 총수는 현재 BLOCK 이 아니다.

---

## 11. secret 계약

```
경로   /etc/seoul-autonomous/secrets/          root:root 700
       /etc/seoul-autonomous/secrets/realtime.env   root:root 600
형식   BUS_API_SERVICE_KEY=<value>   (한 줄 · 따옴표 없음 · 공백 없음)
주입   사용자가 SSH 터미널 hidden input 으로 직접 입력. CC 는 값을 확인하지 않았다.
검증   stat / grep -q 만 사용. cat · env · printenv · secret 포함 inspect 출력 0
```

**이 문서를 포함해 어떤 산출물에도 ServiceKey 값 · raw API response · `plainNo`(차량번호)를 기록하지 않는다.**

---

## 12. 이번 라운드에서 하지 않은 것

```
코드 수정 0 · dependency 0 · Caddy 변경 0 · 타 컨테이너 restart 0
backup/rollback 삭제 0 · prune 0 · OS reboot 0 · 7-stop 확장 0
데이터 조작 0 · fixture 의 Production 주입 0
```

---

## CC 이견 및 아이디어

### ① 지시서에 대한 이견
없음. 배포 직전 보정 4건(rollback 태그 선생성 · candidate 미리 삭제 금지 · bounded probe ·
rollback 시 checkout 복원)이 전부 실효를 냈다. 특히 **candidate 선검증**이 이번 배포의 성패를 갈랐다.

### ② 리스크
- **`--env-file` 은 파일이 없으면 `docker run` 이 즉시 실패한다.** 이는 좋은 성질이지만,
  그래서 **secret preflight 가 반드시 구 컨테이너 중지 전에 와야** 한다. 순서가 뒤바뀌면
  구 컨테이너를 죽인 뒤 새 컨테이너가 못 떠서 다운타임이 길어진다.
- **재부팅 시 컨테이너 복귀가 검증된 적이 없다.** Caddy 는 2026-07-20 부터, 나머지는 6주째 무재시작이다.
  `restart unless-stopped` 가 실제로 작동하는지는 미확인이며, `System restart required` 별도 라운드의 논점이다.

### ③ 더 나은 대안
Phase 3 에서 candidate 를 `docker rename` 으로 승격시키면 downtime 을 수백 ms 줄일 수 있으나,
`--restart no` 정책이 남아 재부팅 시 안 올라온다. **기존 stop/rename/new-run 패턴 유지가 옳다**는
포그린 판단에 동의한다. 새 승격 방식을 최초 RT-2 배포에서 처음 도입할 이유가 없다.

### ④ 제품/기술 아이디어
빌드 시 OCI 라벨로 RT2-capable 여부를 이미지가 스스로 알리게 하면(`--env-file` 필요 여부 판정),
롤백 시 사람이 기억하지 않아도 된다. 지금은 RT-2 이미지가 하나뿐이라 자명하지만 몇 라운드 지나면 헷갈린다.
**이번 배포에는 적용하지 않았고 backlog 다.**

### ⑤ 이견 없음 아님
②의 **secret preflight 순서**와 **재부팅 시 컨테이너 복귀 미검증**은 이후 라운드에서 챙겨야 할 실질 사항이다.
