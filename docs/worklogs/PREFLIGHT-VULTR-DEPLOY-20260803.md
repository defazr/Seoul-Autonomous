# Vultr 서버 배포 전 Read-only 선점검 (Round 26)

**작성**: 2026-08-03 / **성격**: read-only 실측 기록 (서버 무변경) / **판정**: DEPLOY-READY

> 이 문서는 배포 직전 상태의 정본이다. 배포를 실행할 때는 §I 명령을 그대로 쓰되,
> §I-A의 재확인 단계에서 실측값이 아래와 다르면 즉시 정지하고 보고한다.

---

## 좌표 요약 (배포 시 대조용)

| 항목 | 값 |
| --- | --- |
| 로컬 HEAD = origin/main | `ba058ee` |
| 서버 저장소 HEAD (배포 전) | `ef0274a` |
| 라이브 이미지 (배포 전) | `sha256:6d878d66110e...` (`seoul-autonomous-web:latest`) |
| 배포 대상 태그 | `seoul-autonomous-web:ba058ee` |
| 롤백 태그 (배포 직전 생성) | `seoul-autonomous-web:rollback-ef0274a` |
| 컨테이너 | `seoul_autonomous_web` (id `2ef0c518ee3f`) |

---

## A. SSH 접근

- `ssh root@158.247.252.172` 직접 접속. `~/.ssh/config` 별칭 없음.
- 호스트 키 `known_hosts` 기등록(3건) → `StrictHostKeyChecking=yes` 비대화형 접속 성공.
- user `root`, hostname `vultr`, 서버 시각 `2026-08-03T18:06:45+09:00`.

## B. 서버 자원

- 디스크 75G 중 **37G 여유** (49% 사용), inode 3% 사용.
- Mem 3.8Gi / available 2.4Gi / swap 7.7Gi (거의 미사용).
- load average 0.04.
- Docker 29.1.3, storage driver overlayfs, cgroup systemd, sudo 없이 동작.
- 현재 이미지 299MB. 빌드 중 node_modules·중간 레이어 포함 3~5GB 소요 예상 → 여유 충분.

## C. 저장소

- 경로 `/opt/seoul-autonomous`, branch `main`, HEAD `ef0274a08d51a50323fceaa0512764d916c22f1a`.
- origin = `https://github.com/defazr/Seoul-Autonomous.git`.
- **tracked 변경 0건.** untracked는 `Dockerfile` 1개뿐 (377 bytes, root:root, mode 644) — 문서 기록과 일치.
- `git ls-remote origin refs/heads/main` → `ba058eeb143d8087cb888178ace5167a61d5b777` (로컬과 일치).
- `ba058ee` 객체는 서버에 아직 없음(fetch 전이므로 정상). **fast-forward 가능 여부는 fetch 직후 `merge-base --is-ancestor`로 검증할 것.**

## D. 현재 라이브

- 컨테이너 `seoul_autonomous_web`, id `2ef0c518ee3f`, image `seoul-autonomous-web:latest` = `sha256:6d878d66110ec6444f27447f04e054d922b45b6b3d63883b204c26d4d26a2406`.
- 생성 2026-07-12, 시작 2026-07-20, 13일 가동, **RestartCount 0**.
- restart `unless-stopped` / network `apps-newsforgreens_default` / **PortBindings `{}` (호스트 포트 바인딩 없음)** / expose 3000/tcp / hostname `0.0.0.0` / cmd `["node","server.js"]` / workdir `/app`.
- **마운트 0, 볼륨 0 → 완전 stateless.**
- 이미지 라벨 **0개** (revision 라벨 없음).

### 라이브 SHA 증명 수준 (중요)

이미지에서 Git SHA를 **직접 증명할 수단은 없다.** 아래 3가지 간접 증거가 일치하므로 `ef0274a`로 판정한다.

1. 서버 저장소 HEAD = `ef0274a`
2. 이미지 생성 시각 = 컨테이너 생성 시각 = 2026-07-12
3. 라이브 화면에 C2E·C2O·C3 표식 0건, 구버전 문구(`Last stop:`) 3건 잔존

> 개선 제안(이번 배포 범위 밖): 향후 build 시 `--label org.opencontainers.image.revision=<sha>` 부여.

## E. Docker 배포 구조

- Dockerfile은 **저장소 루트**(untracked). 2-stage `node:20-alpine`.
  - builder: `COPY web/package.json web/package-lock.json ./` → `npm ci` → `COPY web/ .` → `npm run build`
  - runner: `.next/standalone`, `.next/static`, `public` 복사 → `CMD ["node","server.js"]`
- build context = 저장소 루트. `web/next.config.ts` L7 `output: 'standalone'`이 이 구조의 전제.
- **`.env` 파일 없음**(저장소 depth 3까지 확인). 컨테이너 env는 `NODE_ENV=production` 외 node 기본값뿐 → 비밀값 의존 0.

## F. Caddy

- 컨테이너 `apps_ng_caddy` (caddy:2-alpine), 80/443 바인드.
- 설정 bind mount: `/opt/apps-newsforgreens/Caddyfile` → `/etc/caddy/Caddyfile`. systemd caddy 서비스 **없음**.
- `caddy validate` → **Valid configuration**.
- seoul 라우팅: `reverse_proxy seoul_autonomous_web:3000` — **컨테이너 이름 기준**(고정 IP·포트 의존 없음) → 컨테이너 교체 시 Caddy reload 불필요.

## G. 기준선 헬스 (배포 후 동일 항목 재확인)

같은 네트워크 `apps-newsforgreens_default`에 **컨테이너 9개** 가동(전부 Up 13일):
`seoul_autonomous_web`, `calc_fazr_web`, `dustfazr_db`, `apps_ng_web`, `vat_web`, `debt-workbench-web`, `debt-workbench-db`, `apps_ng_caddy`, `apps_ng_db`

| 도메인 | 기준선 |
| --- | --- |
| apps.newsforgreens.com | 200 |
| seoulautonomous.com | 307 → /en (의도된 locale 리다이렉트) |
| www.seoulautonomous.com | 301 → apex |
| debt.newsforgreens.com | 200 |
| vat.newsforgreens.com | 200 |
| calc.fazr.co.kr | 200 |

- 라이브 경로 `/ko` `/en` `/ko/routes` `/en/routes/saebyeok-a160` 전부 200.
- 앱 로그 최근 60분 1줄, fatal·error·exception 0. Caddy error 레벨 0, seoul upstream 오류 0.

## H. rollback 준비도 — READY

- 현재 이미지 `6d878d66110e` 서버에 존재.
- 기존 rollback 태그 **8개** 확립: `rollback-1e4b013`, `rollback-5fd776f`, `rollback-c1781a1`, `rollback-6d11a47`, `rollback-86af374`, `rollback-be8d412`, `rollback-c5b8abc`, `rollback-0a27b2c`
- dangling 이미지 0. 이 이미지를 쓰는 컨테이너는 `seoul_autonomous_web` 하나뿐.
- stateless(마운트·볼륨·비밀값 0)라 롤백은 이미지 교체만으로 완결.

## I. 배포 명령 (승인 후 실행)

```bash
ssh root@158.247.252.172
R=/opt/seoul-autonomous

# A. 배포 직전 재확인 — 아래와 다르면 즉시 정지
git -C $R rev-parse HEAD                                    # ef0274a... 여야 함
docker inspect --format '{{.Image}}' seoul_autonomous_web   # sha256:6d878d66110e... 여야 함
git -C $R status --porcelain                                # ?? Dockerfile 만 나와야 함

# B. 롤백 태그 박제 (현재 이미지)
docker tag seoul-autonomous-web:latest seoul-autonomous-web:rollback-ef0274a

# C. fetch 후 fast-forward 검증
git -C $R fetch origin main --prune
git -C $R merge-base --is-ancestor HEAD origin/main && echo FF_OK   # FF_OK 아니면 정지

# D. pull 및 SHA 확인
git -C $R pull --ff-only origin main
git -C $R rev-parse HEAD                                    # ba058ee... 여야 함

# E. immutable 태그 + latest 동시 부여로 build
cd $R && docker build -t seoul-autonomous-web:ba058ee -t seoul-autonomous-web:latest .
# 빌드 실패해도 기존 컨테이너는 그대로 살아 있음 → 라이브 무영향. 실패 시 여기서 정지.

# F. 컨테이너 교체 (immutable 태그로 run)
docker stop seoul_autonomous_web && docker rm seoul_autonomous_web
docker run -d --name seoul_autonomous_web \
  --hostname 0.0.0.0 \
  --network apps-newsforgreens_default \
  --restart unless-stopped \
  -e NODE_ENV=production \
  seoul-autonomous-web:ba058ee

# G. 내부 health
docker exec apps_ng_caddy wget -qS -O /dev/null http://seoul_autonomous_web:3000/ko

# H. 외부 6개 도메인 재확인 (§G 기준선과 대조) — 아래 §I-QA 참조

# --- 실패 시 롤백 ---
# docker stop seoul_autonomous_web && docker rm seoul_autonomous_web
# docker run -d --name seoul_autonomous_web --hostname 0.0.0.0 \
#   --network apps-newsforgreens_default --restart unless-stopped \
#   -e NODE_ENV=production seoul-autonomous-web:rollback-ef0274a
```

## I-QA. 배포 후 라이브 검증 체크리스트

배포 성공 판정은 아래를 **전부** 통과해야 한다. 하나라도 실패하면 §I 롤백 명령 실행.

### 1단계 — 무결성 (다른 사이트 포함)

- [ ] 6개 도메인 §G 기준선과 동일: apps 200 / seoulautonomous 307→/en / www 301 / debt 200 / vat 200 / calc 200
- [ ] `docker ps` 컨테이너 9개 전부 Up (seoul 외 8개는 재시작되지 않았어야 함)
- [ ] `docker logs seoul_autonomous_web` 에 fatal·error·exception 0
- [ ] `docker inspect --format '{{.RestartCount}}' seoul_autonomous_web` → 0

### 2단계 — Round 26 반영 확인

배포 전 라이브에는 **구버전 문구 `Last stop:` 가 3건** 있었다. 배포 후 0건이어야 한다.

- [ ] `/en/routes/saebyeok-a160` — `Last stop:` **0건**
- [ ] **C2E**: 같은 페이지 정류장 목록이 **공식 영문명**으로 표시(한글 정류장명 단독 노출 없음). 정류장 5개 초과 노선은 `<details>` 접힘 + 미리보기 3개
- [ ] **C2O**: 요금·운영사·예약·앱 필드가 미확인일 때 값 대신 상태 표시. **A160 요금이 단일 금액(1,200원)으로 표기되면 실패** — 미확인이 정답
- [ ] **C3**: 노선마다 overview·routePattern·useCase 문단이 서로 다름. `/en/routes/cheonggye-a01`(순환·동일 stopId)과 `/en/routes/sangam-a21`(출발지≠종점)의 FAQ 첫 항목 답변이 서로 달라야 함
- [ ] `/ko` `/en` `/ko/routes` `/en/routes` 200

### 3단계 — 마감

- [ ] 배포 결과를 `docs/handoff/HANDOFF-<날짜>.md`에 기록(라이브 SHA `ba058ee`, 이미지 태그, 롤백 태그, 502 지속 시간)
- [ ] SESSION-HANDOFF·MEMORY.md의 라이브 좌표를 `ef0274a` → `ba058ee`로 갱신
- [ ] **AdSense 재신청은 즉시 금지** — 2~3주 후 Search Console 색인 갱신 확인 후 별도 판단

## J. 위험·이견

1. **전환 중 수 초 중단 발생.** 컨테이너 이름이 Caddy upstream이라 같은 이름으로 2개를 띄울 수 없다. `stop`→`run` 사이 수 초간 502. 무중단으로 하려면 임시 이름 + Caddyfile 수정 + reload가 필요한데, **Caddy 설정 변경은 다른 5개 사이트에 영향**을 주므로 권하지 않는다. 수 초 중단을 받아들이는 쪽이 안전하다.
2. **다른 사이트 영향 없음.** 교체 대상은 컨테이너 1개, Caddy는 이름 기반 프록시라 재시작 불필요, 네트워크·볼륨 공유 없음. 단 빌드가 CPU·디스크를 쓰므로 빌드 중 타 사이트가 잠시 느려질 수 있다(현재 load 0.04라 여유 충분).
3. **빌드 실패 가능성.** 서버에서 `npm ci` + `npm run build`를 이 커밋으로 처음 돌린다. 실패해도 기존 컨테이너 생존 → 라이브 무영향. 빌드 성공 확인 후에만 교체하는 순서라 안전.
4. **`latest` 태그 관례 유지.** 기존 방식이 `latest`라 두 태그를 함께 부여하되, 컨테이너는 immutable 태그로 띄운다.

## K. 최종 판정 — DEPLOY-READY

BLOCK 조건 해당 없음.

## L. 이번 단계 범위 확인

서버 파일 변경 0 / 서버 git 변경 0 / Docker 변경 0(태그 생성도 안 함) / Caddy 변경 0 / 로컬 변경 0 / deploy 0.
`caddy validate`만 실행, reload 미실행.

> **위 §A~§L은 2026-08-03 배포 직전 선점검 시점의 기록이다. 소급 수정하지 않는다.**
> 실제 배포는 아래 §M의 안전 계약으로 실행했다.

---

## M. 배포 실행 결과 — 2026-08-03

- 판정: **DEPLOY PASS**
- 서버 Git: `ef0274a` → `ba058ee`
- 새 이미지: `sha256:f2674161ee68...`
- OCI revision: `ba058ee`
- 실측 서비스 중단: **3초**
- rollback 실행: **없음**

### M-0. §I 초기 런북은 실행 정본이 아니다

> **§I 초기 초안 대신 후속 승인된 안전 계약을 적용했다.** 실제 image ID 기반 rollback 태그, immutable SHA build, candidate 선검증, 기존 컨테이너 rename 보존, 전체 QA 후 latest 이동 방식으로 배포했다.

§I 원문은 감사 추적을 위해 **삭제하지 않고 그대로 둔다.** 실제로 폐기한 부분은 아래 5가지다.

| §I 초안 | 실제 실행 |
| --- | --- |
| `docker tag ...:latest` 로 rollback 태그 | **실행 컨테이너의 실제 image ID**로 태그 |
| `-t :ba058ee -t :latest` 동시 부여 | `:ba058ee` **단독** |
| revision 라벨 없음(범위 밖으로 유예) | `--label org.opencontainers.image.revision=ba058ee` 부여 |
| 사전 검증 없이 빌드 직후 교체 | **candidate 컨테이너 선검증** 후 교체 |
| `docker stop && docker rm` (기존 삭제) | `stop` → **rename 보존** (삭제 0) |

추가 보정 1건: 지시서 스크립트의 `test "$(git rev-parse origin/main)" = "ba058ee"`는 `rev-parse`가 40자 전체 SHA를 반환하므로 **정상 상태에서도 BLOCK**된다. 전체 SHA `ba058eeb143d8087cb888178ace5167a61d5b777` 비교로 보정해 실행했다(축약 충돌 여지가 없어 검증 강도는 상승).

### M-1. 게이트별 실측

**A. 재확인 · rollback 태그 · FF pull** (18:33:05 시작)

- 서버 HEAD 배포 전 `ef0274a08d51...` — 선점검 기록과 일치
- `git status --porcelain` = `?? Dockerfile` **단독** (pull 후에도 동일)
- **rollback 태그는 실행 중 실제 구버전 image ID로 생성** — `docker inspect --format '{{.Image}}' seoul_autonomous_web` = `sha256:6d878d66110e...` 를 태그. 기존 동명 태그가 있었다면 image ID 일치 여부를 검사해 불일치 시 BLOCK하는 분기를 두었고, 실제로는 미존재 상태여서 신규 생성(`rollback_tag=CREATED`)
- **Dockerfile 체크섬 전후 불변** — `sha256 01429bd8539ae691...` pull 전후 동일
- `origin/main` = `ba058ee...` 확인 → **fast-forward 검증 PASS** (`merge-base --is-ancestor` → `FF_OK`)
- `git ls-tree origin/main -- Dockerfile` 공백 → Dockerfile은 upstream 미추적 확인(pull이 덮어쓸 수 없음)
- pull 후 서버 HEAD = `ba058ee...`

**B. 빌드** (18:33:28 → 18:34:08, 40초, rc=0)

- `docker build --label org.opencontainers.image.revision=ba058ee --label org.opencontainers.image.source=... -t seoul-autonomous-web:ba058ee .`
- **`latest` 태그는 이 시점에 부여하지 않음** — 빌드 직후에도 `latest`는 여전히 `6d878d66110e`
- **빌드 성공 및 static pages 60/60** — `✓ Compiled successfully in 12.1s` / `✓ Generating static pages using 1 worker (60/60) in 1374ms` / `[builder 6/6] RUN npm run build DONE 29.4s`
- `npm ci` 레이어만 캐시 재사용(Round 26은 의존성 무변경이라 정상). `COPY web/`·`npm run build`는 실제 재실행
- 검증: `NEW_IMAGE_ID=sha256:f2674161ee68...` ≠ 라이브 이미지, `revision label = ba058ee`
- 로그 전문은 서버 `/tmp/build-ba058ee.log` (118줄)

**C. candidate 선검증** (외부 트래픽 0)

- 기존 동명 candidate 존재 시 임의 삭제 없이 BLOCK하는 분기 선행 — 미존재 확인 후 기동
- Caddy upstream 이름(`seoul_autonomous_web`)과 다른 이름이라 외부 유입 0. 2초 만에 ready
- **candidate 6경로 200** — `/ko` `/en` `/ko/routes` `/en/routes/saebyeok-a160` `/ko/routes/saebyeok-a160` `/en/routes/cheonggye-a01`
- **candidate 로그 오류 0** — `fatal|error|exception|EADDR|ENOMEM|out of memory` 0건
- **중단 발생 전에** Round 26 표식을 미리 확인(`Last stop:` 0 / 고정 1,200원 0 / `Route at a glance` 존재 / `Cheonggye Plaza` 0) → 이 시점 실패였다면 무중단 중단이 가능했다
- PASS 후 중단 측정 **이전에** candidate `stop` + `rm`

**D. 승격**

- 백업 이름 충돌 검사 선행 후 타임스탬프 부여
- **기존 컨테이너 삭제 없이 backup 이름으로 보존** — `docker stop` → `docker rename seoul_autonomous_web seoul_autonomous_web_backup_ef0274a_20260803-183544` (`docker rm` 미사용)
- 신규 컨테이너를 원래 이름 `seoul_autonomous_web`으로 immutable 태그 `:ba058ee`로 기동
- **실측 중단 3초** — `T0` = 기존 컨테이너 중지 직전, `T1` = Caddy 내부 `/ko` 최초 200 통과 직후. `docker run` 반환 시점이 아닌 실제 서비스 복구 시점 기준
- 30초 헬스 루프 실패 시 자동 rollback 분기를 두었으나 미발동

**E. 배포 후 QA — 전항 PASS**

- **Caddy 수정·reload·restart 0** — Caddyfile 무변경, 컨테이너 이름 기반 프록시라 교체만으로 반영
- **다른 8개 컨테이너 재시작 0** — `apps_ng_caddy`·`apps_ng_db`·`apps_ng_web`·`calc_fazr_web`·`debt-workbench-db`·`debt-workbench-web`·`dustfazr_db`·`vat_web` 전부 `RestartCount 0`, `StartedAt 2026-07-20T17:58:07` 유지
- 6개 도메인 §G 기준선과 동일: apps 200 / seoulautonomous 307 / www 301 / debt 200 / vat 200 / calc 200
- 신규 컨테이너 `RestartCount 0` · 마운트 0 · PortBindings 없음 · `unless-stopped` · 동일 네트워크 (기존 스펙과 일치)
- 앱 로그 `fatal|error|exception|ENOMEM|out of memory` 0 / Caddy seoul upstream 오류 0 / Caddy error 레벨 0
- **sitemap 53/53 HTTP 200** — sitemap URL 53개, unique 53(중복 0), non-200 0건, 5xx 0
- **404 매트릭스 4/4** — `/nonexistent` `/en/nonexistent` `/ko/nonexistent` `/en/routes/nonexistent-route` 전부 404
- **구버전 `Last stop:` 0** — 전 노선 페이지 합계 0건

**Round 26 C2E·C2O·C3 표식 PASS** (라이브 실측 텍스트)

```
C2E  A160 공식 영문 정류장명 표시
     Dobongsam station wide area bus transfer center / Yeongdeungpo station / Suyu Station
C2E  청계A01 "Cheonggye Plaza" 0건, "청계광장" 9건으로 목록·FAQ·산문 일관
C2O  A160 Fare 행 자체 미생성(미확인 → 행 미생성, 불변식 준수) · 고정 1,200원 0건
C2O  A148 "Temporarily free" + "Tap a transit card when boarding and alighting"
     + "Built and operated by ㈜에스유엠" + "Official source: 서울특별시 · Apr 15, 2026"
     ko "당분간 무료 / 승·하차 시 교통카드 태그 필요 / 제작·운행 ㈜에스유엠"
C2O  로보택시 4,800×1 · 5,800×2 · 6,700×1 = 4구간, Kakao T, 실시간 호출
C3   A160 Route at a glance 표시
C3   상암A21 First stop ≠ Turnaround(Noeul park) ≠ Final stop(Airport Railroad DMC station) 3자 구분
C3   FAQ q1 "Where do I board this route?" · q4 "What information has been checked on this page?" 정상
```

**F. `latest` 이동 — 전체 QA PASS 뒤에만 실행**

- `docker tag seoul-autonomous-web:ba058ee seoul-autonomous-web:latest` 후 두 태그의 image ID 일치 검증
- `latest` → `sha256:f2674161ee68...`

### M-2. 보존 자산 — 삭제·prune 금지

```
backup container   seoul_autonomous_web_backup_ef0274a_20260803-183544  (Exited 143, image 6d878d66110e)
rollback image     seoul-autonomous-web:rollback-ef0274a → sha256:6d878d66110e...
new immutable      seoul-autonomous-web:ba058ee        → sha256:f2674161ee68...
latest             seoul-autonomous-web:latest         → sha256:f2674161ee68...
```

**rollback 자산 삭제·prune 금지.** 즉시 복구 경로:

```bash
docker rm -f seoul_autonomous_web
docker rename seoul_autonomous_web_backup_ef0274a_20260803-183544 seoul_autonomous_web
docker start seoul_autonomous_web
docker tag seoul-autonomous-web:rollback-ef0274a seoul-autonomous-web:latest
```

### M-3. QA 스크립트 결함 3건 (배포 결함 아님)

검증 중 0으로 나온 항목 3건은 전부 **내 검사 스크립트 결함**이었고, 재측정으로 정상 확인했다. 같은 실수를 반복하지 않도록 기록한다.

1. **존재하지 않는 URL 추측** — `/en/routes/gangnam-robotaxi`를 추측해 404 페이지를 grep했다. 로보택시는 `/[locale]/routes`·`/[locale]/routes/late-night`에서 `RobotaxiCard`로 렌더된다
2. **`set -e` + `[ ... ] && echo` 조합** — 첫 미매치에서 조건식이 exit 1을 반환해 스윕 루프 전체가 조기 종료됐다(빈 결과 = 부재로 오독할 뻔)
3. **greedy `<script>.*</script>` 치환** — SSR 한 줄 HTML에서 문서를 통째로 삭제했다. 또한 `grep -c`는 매치 **줄 수**를 세므로 한 줄 HTML에서는 모든 결과가 0/1로 뭉개진다. 실제 텍스트 추출은 python 등 견고한 parser로 해야 한다

### M-4. 이번 배포의 서버 변경 범위

```
Docker    이미지 1개 신규 빌드 / 태그 3개(ba058ee·rollback-ef0274a·latest) / 컨테이너 1개 교체(기존은 rename 보존)
Git       /opt/seoul-autonomous  ef0274a → ba058ee (--ff-only)
Caddy     변경 0 (validate·reload·restart 전부 미실행)
다른 사이트 변경 0 / 삭제·prune 0 / 서버 파일 편집 0 / Dockerfile 무변경
```
