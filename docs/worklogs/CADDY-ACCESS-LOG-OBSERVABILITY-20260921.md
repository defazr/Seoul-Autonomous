# Caddy Access-Log Observability — discovery · prep · apply · verification (2026-09-21)

> **판정: IMPLEMENTATION SUCCESS / OBSERVABILITY ACTIVE**
> 계측 시작 시각 **2026-09-21 약 17:56 KST**.
> discovery 전용 문서를 따로 만들지 않고 조사·준비·적용·검증을 이 1건으로 통합 정본화한다.
> 선행 정본: `STAGE1-DISCOVERY-T0-20260907.md` §17 (T+14d Decision — 이 라운드를 NEXT 로 지정)

---

## 0. 왜 이 라운드를 열었나

2026-09-21 T+14d Decision 에서 Search Console `lastCrawlTime` 이 T0 포함 **6회차 연속 0/14**
로 나왔다. 그런데 §15.3 조사에서 확인된 대로 **서버 쪽에는 이를 교차 확인할 수단이 없었다** —
Caddy 에 log 지시자가 0건이라 정상 응답 요청은 크롤러든 사람이든 한 줄도 기록되지 않았다.

따라서 현재 가장 큰 공백은 색인 촉진책 부족이 아니라 **서버 측 독립 관측 수단 부재**였다.
순서를 **계측기 먼저 → 촉진 수단은 그 이후** 로 확정하고 이 라운드를 열었다.

---

## 1. 조사 판정 — A (격리 가능)

```
A   seoulautonomous 단일 도메인 access log 를 안전하게 격리 가능   ← 채택
B   가능하나 공유 Caddy 영향·운영 위험 때문에 조건부
C   Caddy 방식 부적합 — 다른 계측 수단 필요
```

A 로 판정한 근거 셋.

1. **변경 범위가 물리적으로 닫힌다.** 전역 옵션 블록이 아예 없고 seoulautonomous.com 이
   독립 사이트 블록이라, 다른 5개 블록은 한 글자도 바뀌지 않는다.
2. **컨테이너 재생성이 불필요하다.** 이미 rw 로 마운트된 `/data` named volume 에 쓰면
   새 볼륨을 붙일 이유가 없다. `docker run` 재실행이 없으므로 무중단이다.
3. **rollback 이 파일 1개 되돌리기다.**

---

## 2. 기존 구조 실측 (2026-09-21, READ-ONLY)

### 2.1 Caddyfile

```
경로      /opt/apps-newsforgreens/Caddyfile
크기      2302 bytes · 102 줄
mtime     2026-09-16 20:23:44 KST
base SHA  b4e2e16d1aa4909f089ac23147cb491bbc53054e51b4a4893b524d60615d6e0d
마운트    컨테이너 /etc/caddy/Caddyfile 로 file bind mount · 읽기전용(ro)
```

**전역 옵션 블록 없음.** 파일 최상단이 바로 `apps.newsforgreens.com {` 으로 시작한다.

**log 지시자 0건.** 6개 사이트 블록 어디에도 없다 — §15.3 결론을 전문 대조로 재확인했다.

### 2.2 사이트 블록 6개

```
apps.newsforgreens.com       1~43행   (basic_auth·캐시헤더 포함, 가장 복잡)
seoulautonomous.com         45~65행   ← 독립. reverse_proxy + header 만. 21줄
www.seoulautonomous.com     67~69행   (redir permanent)
debt.newsforgreens.com      71~80행
vat.newsforgreens.com       82~91행
calc.fazr.co.kr             93~102행
```

공유 스니펫·import·전역 설정이 하나도 없다. **seoulautonomous.com 은 완전히 독립적이다.**

### 2.3 컨테이너·인프라

```
컨테이너      apps_ng_caddy · caddy:2-alpine · Caddy v2.10.2
네트워크      apps-newsforgreens_default (컨테이너 9개 공유, Caddy 가 6도메인 담당)
restart       unless-stopped · StartedAt 2026-09-16T11:27:34Z · RestartCount 0
실행 사용자    컨테이너 내부 root · /data 는 drwxr-xr-x root:root (쓰기 가능)
마운트 3개     /data (volume caddy_data, rw) · /config (volume, rw) · Caddyfile (bind, ro)
admin         127.0.0.1:2019 LISTEN (컨테이너 내부 한정, 외부 노출 없음)
디스크        / 75G 중 47G 여유 (36% 사용) · caddy_data 볼륨 당시 176K
docker log    json-file · 옵션 비어 있음(size 제한 없음) · caddy json 로그 이미 6.8M
logrotate     호스트에 존재하나 이번 건에는 불필요 (Caddy 자체 rolling 사용)
```

### 2.4 공식 문서 교차 확인

기억이 아니라 Caddy 공식 문서로 두 가지를 확인했다.

- **사이트 블록 안의 `log` 는 그 사이트에만 적용된다** — "The log directive enables and
  configures HTTP request logging for site blocks." 전역 로거를 건드리지 않는다.
- **`output file` 은 기본으로 rolling 이 켜져 있고 기본 roll_size 는 100MiB 다.**
  외부 logrotate 가 필요 없다. 두 retention 값을 모두 0 으로 두지 말라는 경고가 문서에 있다.

---

## 3. 적용한 변경

### 3.1 log 블록 전문

seoulautonomous.com 블록 내부, `encode gzip zstd` 바로 다음(48~56행)에 **9줄 삽입.**

```caddyfile
    log {
        output file /data/access-seoulautonomous.log {
            roll_size 10MiB
            roll_keep 5
            roll_keep_for 720h
        }
        format json
    }
```

**diff 는 `47a48,56` 하나뿐 — 삽입 9줄, 삭제 0, 변경 0.**
다른 5개 사이트 블록과 파일 전역 구조는 한 바이트도 바뀌지 않았다.

### 3.2 설계 선택 근거

```
경로  /data/access-seoulautonomous.log
      이미 rw named volume 이라 컨테이너 재생성 없이 쓸 수 있고, 재시작·이미지 교체에도
      보존되며, 호스트에서 바로 읽힌다
      → /var/lib/docker/volumes/apps-newsforgreens_caddy_data/_data/access-seoulautonomous.log
형식  JSON. user_agent·remote_ip 를 구조화된 필드로 얻어야 Googlebot 식별이 가능하다
      stdout 대안은 size 제한 없는 json-file 드라이버에 얹히고 타 도메인과 섞여서 배제했다
```

### 3.3 디스크 상한 — 「최대 50MB」로 쓰지 않는다

```
roll_size 10MiB · roll_keep 5
→ active 1개 + rolled 최대 5개 구조이므로
  **압축 전 단순 상한은 약 60MiB 수준** 으로 본다
→ rolled 파일은 기본 gzip 이 적용되므로 실제 점유는 더 작을 수 있다
```

상한이 트래픽이 아니라 **roll 설정으로 고정**되므로 사이징 위험은 트래픽 추정치에 의존하지 않는다.
47G 여유 대비 무시할 수준이다.

---

## 4. 실행 기록

### 4.1 SHA 체인

```
base       b4e2e16d1aa4909f089ac23147cb491bbc53054e51b4a4893b524d60615d6e0d  (102줄 2302B)
backup     Caddyfile.bak.20260921_175035   SHA 동일 = base
candidate  c065212b802f7537e65bc3e8b8d139a4892b5f3ec45ba97c89a490f6ee39d453  (111줄 2487B)
active 적용 후 = candidate SHA · 컨테이너 내부 /etc/caddy/Caddyfile SHA 도 동일
```

**`Caddyfile.bak.20260921_175035` 는 이 저장소 최초의 Caddyfile 백업이다.**
`cp -p` 로 타임스탬프·권한을 보존했고 원본과 SHA 동일을 확인했다.

### 4.2 candidate validate

```
명령   docker exec apps_ng_caddy caddy validate --config /tmp/Caddyfile.candidate --adapter caddyfile
결과   Valid configuration · exit=0 · PASS
```

CLI 가 `--config <path>` 파일 경로만 받고 stdin 을 지원하지 않아, candidate 를 컨테이너
`/tmp` 에 임시 복사해 검증한 뒤 제거했다. 복사 전후 SHA 일치를 확인했고 active 설정과
running config 는 경유하지 않았다.

**부수 효과 — validate 가 0-byte 로그 파일을 선생성했다.**

```
/data/access-seoulautonomous.log   0 bytes · root:root 600
```

`caddy validate` 는 "loads and **provisions** the provided config" 이므로 file writer 를
프로비저닝하면서 파일을 열었다. 서버를 기동하지 않았으므로 내용은 없다.
**삭제하지 않고 그대로 사용하기로 결정했다** (포그린 판정 2026-09-21).

부수 소득 — `/data` 에 Caddy 가 실제로 쓸 수 있다는 것이 권한 추정이 아니라 **실증**됐다.

### 4.3 active 적용 — inode 유지 제자리 덮어쓰기

Caddyfile 이 **file 단위 bind mount** 이므로 `mv`·rename·inode 교체로 갈아끼우면
컨테이너가 같은 파일을 계속 본다는 보장이 깨진다. 따라서 제자리 덮어쓰기를 썼다.

```
방식        cat Caddyfile.candidate > Caddyfile      (mv·rename 미사용)
inode       1346 → 1346   유지
host SHA    = candidate SHA           PASS
container   /etc/caddy/Caddyfile SHA = host SHA   PASS (bind mount 반영 확인)
```

### 4.4 active 재validate

```
명령   docker exec apps_ng_caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
결과   Valid configuration · exit=0 · PASS
warn   정확히 2건 — candidate validate 때와 동일한 기존 항목
       ① Unnecessary header_up X-Forwarded-Host (base 51행, RT-2 때부터 존재)
       ② Caddyfile input is not formatted (line 2 지목 — base 파일 전체 포맷 문제)
       log 블록 관련 신규 warning 0건
```

⚠ **도구 오탐 1건 기록.** 1차 검사에서 `log|roll|output` 패턴 grep 이 BLOCK 을 냈는데,
JSON 의 `"logger":"caddyfile"` 필드가 `log` 에 걸린 **grep 오탐**이었다. msg 필드만 JSON
파싱해 재검사하니 log 관련 warning 0건이었다.
→ 안전선 "예상 밖 결과가 나오면 결함 단정 전에 도구·selector 부터 재검증" 에 해당한다.

### 4.5 graceful reload

```
명령   docker exec -w /etc/caddy apps_ng_caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
결과   exit=0 성공
```

```
StartedAt      2026-09-16T11:27:34.203443869Z   →   변경 없음
RestartCount   0                                →   변경 없음
running        true                             →   유지
admin          127.0.0.1:2019 LISTEN            →   유지
```

**restart 0 · container recreate 0 · 무중단.**

### 4.6 6도메인 pre / post

```
apps.newsforgreens.com       200 → 200
seoulautonomous.com          307 → 307     (next-intl 로케일 리다이렉트 — 정상값)
www.seoulautonomous.com      301 → 301     (Caddyfile 67~69행 설계된 redir — 정상값)
debt.newsforgreens.com       200 → 200
vat.newsforgreens.com        200 → 200
calc.fazr.co.kr              200 → 200
```

**6/6 동일.** 200 을 강제 기대하지 않고 도메인별 현재 status 를 baseline 으로 저장해 대조했다.

---

## 5. 검증 — smoke test

파일 존재 여부는 증거로 쓰지 않았다(validate 가 이미 0-byte 파일을 만들었으므로).
**크기가 0 에서 증가하는지**를 판정 기준으로 삼았다.

```
요청 전   827 bytes
요청      GET https://seoulautonomous.com/  UA=seoul-autonomous-caddy-log-smoke/20260921
응답      307
요청 후   1665 bytes · 총 2 라인
```

smoke 엔트리 필드 전건 확인

```
valid JSON    2/2 · parse 실패 0
host          seoulautonomous.com
method        GET
uri           /
proto         HTTP/2.0
remote_ip     158.247.252.172
User-Agent    seoul-autonomous-caddy-log-smoke/20260921
status        307
duration      0.010773933
logger        http.log.access.log0
```

**타 도메인 혼입 0.** 로그 전체에서 등장한 host 는 `seoulautonomous.com` 하나뿐 —
사이트 블록 스코핑이 실증됐다.

**smoke 전 827 bytes 1건의 정체** — reload 검증 단계에서 보낸 post-reload baseline 요청이다.
의도한 시퀀스는 아니었으나, 결과적으로 **reload 시점부터 로깅이 즉시 작동했다**는 증거가 됐다.

---

## 6. 판독 시 반드시 지킬 것

### 6.1 known self-test UA 2건 — 집계에서 제외한다

```
caddy-baseline-check/20260921
seoul-autonomous-caddy-log-smoke/20260921
```

**이 2건은 우리가 보낸 요청이며 Googlebot 증거가 아니다.**

### 6.2 remote_ip 보존 여부 — 미검증

smoke 의 `remote_ip = 158.247.252.172` 는 **서버 자신의 공인 IP** 다. 서버에서 자기 도메인으로
요청했기 때문이다. 외부 트래픽에서 실제 클라이언트 IP 가 보존되는지는 **아직 실증되지 않았다.**

Googlebot IP 검증을 하려면 이 값이 진짜 클라이언트 IP 여야 하므로,
**첫 판독에서 가장 먼저 확인할 항목**이다.

### 6.3 verified Googlebot 판정 계약

```
🚫 User-Agent 에 Googlebot 이라고 적혀 있다는 이유만으로 "verified Googlebot" 이라고 부르지 않는다
   UA 문자열은 누구나 위조할 수 있다
✅ remote_ip 에 대해 Google 공식 검증 절차(rDNS 후 정방향 재확인, 또는 공개 IP 목록 대조)를
   거친 뒤에만 verified 로 기록한다
```

### 6.4 넘지 않는 선

**로그가 비어 있거나 Googlebot 이 없다는 사실만으로 사이트 결함·crawl budget·Google 차단을
단정하지 않는다.** 계측은 켠 시점부터의 미래만 기록한다 — 9/21 이전에 크롤이 있었는지는
이 로그로 영원히 답할 수 없다.

---

## 7. 관측 계약

### 7.1 첫 판독 — 2026-09-24 18:00 KST 전후

순서를 지킨다.

```
1  로그 자체가 계속 정상 기록 중인지 확인 (크기 증가 · 최신 timestamp)
2  known self-test UA 2건 제외
3  외부 요청의 remote_ip 가 실제 외부 IP 로 보존되는지 확인   ← §6.2
4  Googlebot 계열 UA 후보 검색
5  후보가 있으면 UA 만으로 판정하지 말고 IP 검증              ← §6.3
6  verified Googlebot 존재 여부 판정
```

### 7.2 판정 분기

```
verified Googlebot 확인됨   → AdSense gate 를 **조기 재판정할 수 있다**
                              (09-28 까지 무조건 기다리지 않는다)
확인되지 않음               → AdSense HOLD 유지
                              다음 판독 2026-09-28 18:00 KST 전후 (T+7d 게이트)
```

### 7.3 AdSense

```
현재            HOLD (2026-09-21 T+14d Decision · 정본 §17.1)
조기 재판정 조건  09-24 첫 판독에서 verified Googlebot 확인
그 외            09-28 T+7d 판독 결과를 보고 다시 판단
🚫 로그를 켠 직후 신청하지 않는다 — 며칠 모아야 판단 재료가 생긴다
```

---

## 8. 9/16 Caddyfile 변경 흔적

```
사실   Caddyfile mtime 2026-09-16 20:23:44 KST · 컨테이너 StartedAt 같은 날 20:27 KST
       → 파일 수정 4분 뒤 컨테이너가 기동됐다. 9/16 에 Caddy 작업이 있었다
한계   /opt/apps-newsforgreens/ 는 git 저장소가 아니다 (fatal: not a git repository 확인)
       .env 계열에는 .bak.<timestamp> 백업이 여럿 있으나 Caddyfile 백업은 0건이었다
결론   **무엇이 바뀌었는지 복원할 수 없다.** 지금 파일에 log 지시자가 없다는 사실만 확인된다
개선   오늘 만든 Caddyfile.bak.20260921_175035 부터 향후 변경 전후 비교가 가능해진다
```

---

## 9. 이번 라운드에서 하지 않은 것

```
rollback 실행 0 · Caddy restart 0 · container recreate 0
다른 5개 사이트 블록 수정 0 · caddy fmt --overwrite 0 · 전역 블록 신설 0
Next.js / app 제품 코드 0 · Production 배포 0
GSC / GA4 호출 0 · Request Indexing 0 · sitemap 재제출 0 · route recrawl 0 · 내부링크 0
AdSense 재신청 0 · commit 0 · push 0
```

---

## 10. 운영 주의 (이후 라운드 승계)

```
⚠ 같은 output filename 의 file 옵션(roll_size 등)을 **나중에 변경**하는 경우
  reload 만으로 적용되지 않고 server restart 가 필요할 수 있다 (Caddy 공식 주의사항).
  이번 최초 추가는 새 log filename 이므로 이 예외에 해당하지 않는 것으로 읽었고,
  실제 reload 후 로그 생성으로 적용을 확인했다.
  → roll 옵션을 바꾸려면 restart 필요 여부를 먼저 판단한다. 공유 Caddy 이므로 별도 라운드다.

⚠ Caddyfile 변경은 항상 ① 백업 → ② candidate → ③ validate → ④ 제자리 덮어쓰기(inode 유지)
  → ⑤ active 재validate → ⑥ graceful reload → ⑦ 6도메인 대조 순서를 따른다.
  mv·rename 금지. docker restart 금지.

⚠ caddy fmt --overwrite 는 돌리지 않는다. base 파일이 원래 포맷 규칙에 맞지 않아
  실행하면 6개 블록 전체가 재포맷돼 diff 가 폭발한다. 지금 diff 가 9줄 삽입뿐인 것이
  이번 변경의 가장 큰 안전장치다. 포맷 정리는 별도 backlog.
```

---

## 11. CC 이견 및 아이디어

**이견 1 — 계측을 켠 것과 답을 얻은 것은 다르다.** 이 로그는 2026-09-21 17:56 이후만 기록한다.
"지난 14일간 Googlebot 이 왔는가" 는 **영원히 답할 수 없다.** 09-24 판독에서 verified
Googlebot 이 없어도 그것은 "3일간 없었다" 이지 "그 전에도 없었다" 가 아니다.
AdSense 재판정 시점을 잡을 때 이 구분이 필요하다.

**이견 2 — §6.2 remote_ip 보존 여부가 첫 판독의 최우선 항목이다.** 이것이 깨져 있으면
(예: 앞단 프록시가 있어 모든 요청이 같은 IP 로 찍히면) Googlebot IP 검증 자체가 불가능해지고,
계측기를 켰어도 판정을 못 한다. 순서상 Googlebot 검색보다 먼저 확인해야 한다.

**이견 3 — 로그에 우리 요청 2건이 이미 들어 있다.** §6.1 에 UA 를 명시했으므로 기계적으로
제외 가능하지만, 판독 스크립트를 쓸 때 이 필터를 빠뜨리면 "외부 요청이 있었다" 로 오독한다.
판독 때 제외 건수를 반드시 함께 보고하겠다.

**이견 4 — 판독 자동화 스크립트를 만들지 않았다.** 매번 수동 파싱하면 회차마다 결과가
달라질 수 있다(§14.4 verdict 누락 같은 사고가 discovery 관측에서 이미 있었다).
다만 도구 신설은 이번 승인 범위 밖이므로 **후보로만 남긴다** — 09-24 판독을 한 번 해보고
반복 비용이 크면 그때 제안한다.

**아이디어 — 없다.** 다음은 2026-09-24 18:00 KST 전후 첫 판독 하나이며, 그 전까지 새 작업을
열지 않는다.
