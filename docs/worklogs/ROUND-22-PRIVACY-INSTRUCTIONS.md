# Round 22-Privacy — Claude Code 지시서

> 작성일: 2026-06-28
> 작성자: Claude UI
> 대상: Claude Code
> 근거 문서: `docs/worklogs/ROUND-22-FINAL-PLAN.md` §2 (커밋 ba37ce7)
> 변경 종류: /ko/privacy + /en/privacy 본문·메타 정정
> 코드 종류: 페이지 컴포넌트 본문·메타데이터 (라우팅·미들웨어·Caddy·SSoT 미변경)

---

## 0. 한 줄 요약

GA4 운영 사실과 직접 모순되는 현재 개인정보처리방침을 정정한다. /ko/privacy + /en/privacy 본문·title·meta description·운영자 표기·문의 이메일을 동시에 변경한다.

---

## 1. 작업 전 audit (코드 변경 0건)

다음 항목 먼저 보고. 변경 없이 현황만 확인한다.

1. `/ko/privacy`, `/en/privacy` 페이지 파일 경로
2. 페이지 컴포넌트 구조 — 본문이 i18n 키 방식인지, 마크다운인지, 인라인 JSX인지
3. 시행일·최종 수정일이 어디서 들어오는지 (날짜 상수·i18n 키·하드코딩)
4. title·meta description이 어디서 들어오는지 (`generateMetadata`·정적 metadata·layout 상속)
5. 기존 `support@fazr.co.kr`이 등장하는 모든 파일 위치 — `grep`으로 전 프로젝트 검색
6. 기존 운영자/회사명 표기(`fazr`·`Seoul Autonomous`·기타)가 등장하는 모든 위치
7. Privacy 페이지에서 사용하는 컴포넌트 (Heading·List·Paragraph 등)가 14개 섹션 + 순번 목록 + 코드체 인라인(`G-ND7JGQ62QX`, `_ga`, `_ga_*`)을 정상 렌더링하는지 확인

audit 결과 보고 후 포그린 승인 받고 본 작업 진행한다. **승인 없이 본 작업 진행 금지.**

---

## 2. 메타 (한국어 `/ko/privacy`)

- **title**: `개인정보처리방침 Seoul Autonomous`
- **H1**: `개인정보처리방침`
- **meta description**: `Seoul Autonomous의 Google Analytics 및 쿠키 사용, 자동 처리 정보, 이용 목적, 보유 기간, 제3자 처리와 이용자 선택 방법을 안내합니다.`
- **OG title / Twitter title**: title과 동일
- **OG description / Twitter description**: meta description과 동일
- **canonical**: 변경 없음 (자동 self-canonical 유지)
- **hreflang**: 변경 없음
- **html lang**: 변경 없음 (`ko`)

---

## 3. 메타 (영어 `/en/privacy`)

- **title**: `Privacy Policy Seoul Autonomous`
- **H1**: `Privacy Policy`
- **meta description**: `Learn how Seoul Autonomous uses Google Analytics and cookies, what data is processed, why it is used, how long it is retained, and what choices users have.`
- **OG title / Twitter title**: title과 동일
- **OG description / Twitter description**: meta description과 동일
- **canonical**: 변경 없음 (자동 self-canonical 유지)
- **hreflang**: 변경 없음
- **html lang**: 변경 없음 (`en`)

---

## 4. 본문 (한국어 `/ko/privacy`)

아래 14개 섹션을 그대로 사용한다. 문장 임의 변경 금지.

```
시행일: [실제 배포일]

최종 수정일: [실제 배포일]
```

### 1. 적용 대상

본 개인정보처리방침은 Seoul Autonomous 웹사이트와 `seoulautonomous.com`에서 제공되는 한국어 및 영어 페이지에 적용됩니다.

Seoul Autonomous는 서울의 자율주행 교통과 심야버스 노선 등에 관한 안내 정보를 제공하는 독립 웹사이트입니다.

### 2. 직접 입력받는 정보

Seoul Autonomous는 회원가입, 로그인, 결제 또는 이용자 계정 기능을 제공하지 않습니다. 이용자의 이름, 전화번호, 주소, 결제 정보와 같은 정보를 웹사이트에서 직접 입력받지 않습니다.

위치 권한, 카메라, 마이크, 연락처 또는 사진에 대한 접근 권한도 요청하지 않습니다.

다만 웹사이트 이용 현황을 파악하고 서비스를 개선하기 위해 Google Analytics 4를 사용하며, 이 과정에서 아래와 같은 정보가 자동으로 처리될 수 있습니다.

### 3. Google Analytics 사용

Seoul Autonomous는 웹사이트 방문 및 이용 현황을 분석하기 위해 Google LLC가 제공하는 Google Analytics 4를 사용합니다.

현재 사용 중인 Google Analytics 측정 ID는 `G-ND7JGQ62QX`입니다.

Google Analytics는 웹사이트 방문 통계와 이용 흐름을 분석하기 위한 제3자 분석 서비스입니다. 현재 Seoul Autonomous에는 Google Tag Manager가 설치되어 있지 않으며 Google Ads 및 Google AdSense도 연결되어 있지 않습니다.

Google Analytics의 Consent Mode와 별도의 쿠키 동의 배너는 현재 구현되어 있지 않습니다.

### 4. 자동으로 처리될 수 있는 정보

Google Analytics를 통해 다음 정보가 자동으로 처리될 수 있습니다.

1. 방문한 페이지와 페이지 URL
2. 페이지 제목과 이전 방문 페이지 또는 유입 경로
3. 접속 일시, 세션 정보 및 이용 통계
4. 브라우저 종류, 기기 유형 및 화면 정보
5. 브라우저 또는 기기의 언어 설정
6. 대략적인 국가, 도시 또는 지역 정보
7. 페이지 조회, 스크롤, 외부 링크 클릭, 사이트 검색, 양식 상호작용, 동영상 참여 및 파일 다운로드 등의 이용 이벤트
8. 쿠키 또는 이와 유사한 온라인 식별자

설정된 기능이나 해당 콘텐츠가 없는 경우 일부 이벤트는 발생하지 않을 수 있습니다.

Seoul Autonomous는 검색창 등에 이용자가 자유롭게 입력한 원문을 별도의 맞춤 이벤트로 Google Analytics에 전송하지 않습니다.

### 5. IP 주소 처리

이용자의 IP 주소는 대략적인 국가, 도시 또는 지역 정보를 산출하고 통신을 처리하는 과정에서 사용될 수 있습니다.

Google Analytics 4에서는 개별 이용자의 IP 주소가 Analytics에 기록되거나 저장되지 않습니다. Seoul Autonomous 운영자는 Google Analytics 보고서에서 개별 이용자의 IP 주소를 확인할 수 없습니다.

### 6. 쿠키 사용

Google Analytics는 웹사이트 이용 통계를 측정하기 위해 다음과 같은 자사 쿠키를 사용할 수 있습니다.

- `_ga`: 이용자를 구분하기 위한 쿠키
- `_ga_*`: 해당 Google Analytics 속성의 세션 상태를 유지하기 위한 쿠키

별도의 만료기간 변경 설정을 적용하지 않은 현재 구성에서는 두 쿠키의 기본 만료기간이 최대 2년으로 설정될 수 있습니다.

실제 보관 기간은 이용자의 브라우저 정책, 쿠키 차단 또는 삭제 설정, 추적 방지 기능과 이용 환경에 따라 더 짧아질 수 있습니다. 쿠키를 삭제하면 이후 방문 시 새로운 식별자가 생성될 수 있습니다.

### 7. 처리 목적

자동으로 처리되는 정보는 다음 목적으로 사용합니다.

- 방문자 수와 페이지 이용 현황 파악
- 많이 이용되는 페이지와 기능 분석
- 방문 경로와 유입 경로 분석
- 웹사이트 오류와 이용 불편 확인
- 콘텐츠, 기능 및 사용자 경험 개선
- 웹사이트 운영에 필요한 통계 작성

현재 Google Ads나 Google AdSense를 통한 맞춤 광고 제공 목적으로 해당 정보를 사용하고 있지 않습니다.

### 8. 데이터 보유기간

현재 Seoul Autonomous의 Google Analytics 속성에는 다음과 같은 보유 설정이 적용되어 있습니다.

- 사용자 수준 데이터: 최대 14개월
- 이벤트 수준 데이터: 최대 2개월
- 새 사용자 활동이 발생할 때 사용자 식별자와 관련된 보유기간 재설정: 사용

이 기간은 Google Analytics에 보관되는 비집계 사용자 수준 및 이벤트 수준 데이터에 적용됩니다.

따라서 Google Analytics의 모든 통계와 집계 보고서가 2개월 후 일괄 삭제된다는 의미는 아닙니다. 법령 준수, 시스템 백업 또는 Google의 서비스 운영 정책에 따라 실제 처리 방식이 달라질 수 있습니다.

### 9. 제3자 처리 및 국외 처리 가능성

Google은 Google Analytics의 제3자 서비스 제공자입니다. Google Analytics를 통해 처리되는 정보는 Google 또는 Google의 서비스 인프라를 통해 처리됩니다.

Google은 여러 국가와 지역에서 서버와 관련 인프라를 운영하므로, 관련 정보가 대한민국 밖의 지역에서 처리될 수 있습니다. 실제 처리 위치는 Google의 시스템 운영과 이용 환경에 따라 달라질 수 있으므로 특정 국가나 서버 위치로 한정하지 않습니다.

Google의 정보 처리 방식은 Google의 개인정보처리방침 및 Google Analytics 관련 정책의 적용을 받습니다.

### 10. 이용자의 선택권

이용자는 다음 방법으로 Google Analytics의 쿠키 또는 측정을 제한할 수 있습니다.

- 브라우저 설정에서 쿠키 차단 또는 삭제
- 브라우저의 추적 방지 기능 사용
- 시크릿 또는 비공개 브라우징 기능 사용
- Google Analytics 차단 브라우저 부가기능 사용

쿠키를 차단하거나 삭제해도 Seoul Autonomous의 일반적인 콘텐츠는 이용할 수 있습니다. 다만 언어 설정 등 브라우저에 저장되는 일부 이용 환경이 초기화되거나 반복해서 설정해야 할 수 있습니다.

### 11. 외부 서비스 링크

Seoul Autonomous에는 네이버지도, 카카오맵 또는 그 밖의 외부 웹사이트로 이동하는 링크가 포함될 수 있습니다.

외부 링크를 선택하면 해당 제3자 서비스의 웹사이트나 앱으로 이동하며, 그 이후의 정보 처리는 해당 서비스의 개인정보처리방침과 이용약관에 따릅니다.

Seoul Autonomous는 제3자 서비스가 독립적으로 수행하는 정보 처리에 관여하거나 이를 통제하지 않습니다.

### 12. 아동의 개인정보

Seoul Autonomous는 일반적인 교통 안내 정보를 제공하는 웹사이트이며 아동을 대상으로 회원가입이나 개인정보 입력을 요구하지 않습니다.

운영자는 만 14세 미만 아동의 개인정보를 의도적으로 직접 입력받거나 수집하지 않습니다. 다만 일반 이용자와 마찬가지로 웹사이트 방문 과정에서 Google Analytics 정보가 자동으로 처리될 수 있습니다.

### 13. 개인정보처리방침의 변경

웹사이트 기능, 분석 도구 또는 정보 처리 방식이 변경되면 본 개인정보처리방침을 수정할 수 있습니다.

변경 시 이 페이지 상단의 최종 수정일을 갱신합니다. 이용자에게 중요한 영향을 줄 수 있는 변경사항은 필요한 경우 웹사이트를 통해 별도로 안내합니다.

### 14. 문의처

본 개인정보처리방침이나 Seoul Autonomous의 정보 처리에 관한 문의는 아래 연락처로 보내주시기 바랍니다.

운영자: Seoul Autonomous

이메일: seoulautonomous@protonmail.com

소재지: 대한민국 서울

---

## 5. 본문 (영어 `/en/privacy`)

아래 14개 섹션을 그대로 사용한다. 문장 임의 변경 금지.

```
Effective date: [actual deployment date]

Last updated: [actual deployment date]
```

### 1. Scope

This Privacy Policy applies to the Seoul Autonomous website and to the Korean and English pages available through `seoulautonomous.com`.

Seoul Autonomous is an independent website providing information about autonomous transportation and night bus routes in Seoul, Republic of Korea.

### 2. Information You Provide Directly

Seoul Autonomous does not provide account registration, login, payment, or user account features. The website does not ask users to directly submit information such as their name, telephone number, address, or payment details.

The website does not request access to a user's location, camera, microphone, contacts, or photos.

However, Seoul Autonomous uses Google Analytics 4 to understand website usage and improve the service. Certain information may therefore be processed automatically as described below.

### 3. Use of Google Analytics

Seoul Autonomous uses Google Analytics 4, a third-party analytics service provided by Google LLC, to measure visits and understand how the website is used.

The Google Analytics measurement ID currently used by Seoul Autonomous is `G-ND7JGQ62QX`.

Google Tag Manager is not currently installed on the website. Google Ads and Google AdSense are not currently connected to the website.

Google Analytics Consent Mode and a separate cookie consent banner have not currently been implemented.

### 4. Information That May Be Processed Automatically

Google Analytics may automatically process information including:

1. Pages visited and page URLs
2. Page titles and the previous page or traffic source
3. Access times, session information, and usage statistics
4. Browser type, device type, and screen information
5. Browser or device language settings
6. Approximate country, city, or regional information
7. Usage events such as page views, scrolling, outbound link clicks, site searches, form interactions, video engagement, and file downloads
8. Cookies or similar online identifiers

Some events may not occur when the relevant feature or content is not available or is not used.

Seoul Autonomous does not currently send the original free-form text entered by users into search fields to Google Analytics through custom analytics events.

### 5. IP Address Processing

A user's IP address may be used during network communication and to derive approximate country, city, or regional information.

Google Analytics 4 does not log or store individual IP addresses in Analytics. The operator of Seoul Autonomous cannot view an individual user's IP address in Google Analytics reports.

### 6. Cookies

Google Analytics may use the following first-party cookies to measure website usage:

- `_ga`: used to distinguish users
- `_ga_*`: used to maintain session state for the relevant Google Analytics property

Because Seoul Autonomous has not overridden the default expiration settings, these cookies may have a default expiration period of up to two years.

The actual period may be shorter because of browser policies, cookie blocking or deletion settings, tracking prevention features, or the user's browsing environment. Deleting cookies may cause a new identifier to be created during a later visit.

### 7. Purposes of Processing

Automatically processed information is used to:

- Measure visitor numbers and page usage
- Understand which pages and features are used
- Analyze navigation and traffic sources
- Identify website errors and usability issues
- Improve content, functionality, and user experience
- Prepare statistics necessary to operate the website

Seoul Autonomous does not currently use this information to provide personalized advertising through Google Ads or Google AdSense.

### 8. Data Retention

The Seoul Autonomous Google Analytics property currently uses the following retention settings:

- User-level data: up to 14 months
- Event-level data: up to 2 months
- Resetting the retention period for a user identifier when new user activity occurs: enabled

These periods apply to non-aggregated user-level and event-level data retained in Google Analytics.

They do not mean that every statistic or aggregated report in Google Analytics is deleted after two months. Actual processing may also vary according to legal requirements, system backups, and Google's service operation policies.

### 9. Third-Party Processing and International Processing

Google is the third-party service provider for Google Analytics. Information processed through Google Analytics is handled through Google and its service infrastructure.

Google operates servers and related infrastructure in multiple countries and regions. Information may therefore be processed outside the Republic of Korea. The specific processing location may vary depending on Google's systems and the user's environment, so Seoul Autonomous does not identify a single country or server location.

Google's handling of information is governed by Google's Privacy Policy and its policies for Google Analytics.

### 10. Your Choices

Users may limit Google Analytics cookies or measurement by:

- Blocking or deleting cookies through browser settings
- Enabling tracking prevention features in their browser
- Using private or incognito browsing
- Installing the Google Analytics opt-out browser add-on

Blocking or deleting cookies does not prevent access to the general content available on Seoul Autonomous. However, some browser-stored preferences, such as language settings, may be reset or may need to be selected again.

### 11. Links to External Services

Seoul Autonomous may include links to external services such as Naver Map, Kakao Map, or other websites.

Selecting an external link takes the user to the third party's website or application. Any subsequent processing of information is governed by that third party's privacy policy and terms.

Seoul Autonomous does not control information processing independently performed by those third-party services.

### 12. Children's Privacy

Seoul Autonomous provides general transportation information and does not require children to create accounts or directly submit personal information.

The operator does not knowingly request or directly collect personal information from children under the age of 14. However, as with other visitors, Google Analytics information may be processed automatically when a child visits the website.

### 13. Changes to This Policy

This Privacy Policy may be updated when the website's features, analytics tools, or information processing practices change.

When the policy is updated, the "Last updated" date at the top of this page will be revised. Material changes may also be announced separately on the website where appropriate.

### 14. Contact

For questions about this Privacy Policy or the processing of information in connection with Seoul Autonomous, please contact:

Operator: Seoul Autonomous

Email: seoulautonomous@protonmail.com

Location: Seoul, Republic of Korea

---

## 6. 시행일·최종 수정일 처리

- 본문 placeholder `[실제 배포일]` / `[actual deployment date]` 는 **실제 배포 예정일**을 기준으로 입력한다.
- 형식: 한국어·영어 모두 `YYYY-MM-DD` (예: `2026-06-29`)
- 시행일과 최종 수정일은 **동일한 값** (이번이 신규 정정 배포이므로)
- **날짜 정합성 규칙**: 입력 후 같은 날짜에 배포하지 못하고 날짜가 변경되면, 푸시 또는 배포 전에 날짜를 다시 수정하고 빌드·검증을 다시 수행한다.
- placeholder `[실제 배포일]` / `[actual deployment date]` 가 남아 있는 상태로 **커밋·푸시·배포 금지**.

---

## 7. 부가 변경 사항

### 7.1 기존 `support@fazr.co.kr` 처리

audit §1.5에서 발견된 모든 위치에서 다음과 같이 처리한다:

- **Privacy 페이지 내**: `seoulautonomous@protonmail.com` 으로 교체
- **Privacy 페이지 외 다른 페이지·컴포넌트·footer 등**: **이번 라운드에서 변경 금지.** 별도 라운드에서 일괄 처리. (Privacy 단독 배포 원칙 유지)
- audit 결과만 보고하고 Privacy 외 파일은 손대지 않는다

### 7.2 기존 운영자 표기 처리

- **Privacy 페이지 내**: `Seoul Autonomous` 로 통일
- **Privacy 페이지 외**: 이번 라운드에서 변경 금지

### 7.3 i18n 키 처리

페이지 구조가 i18n 키 기반이면:
- 한·영 본문 텍스트를 `messages/ko.json`, `messages/en.json` (또는 해당 경로)에 추가/교체
- 키 구조는 기존 패턴을 따른다 (audit §1 단계에서 확인된 구조)
- 새 키 추가 시 보고 후 진행

페이지 구조가 인라인 JSX·마크다운이면:
- 해당 파일 직접 수정

---

## 8. 금지선

다음 변경 절대 금지:

- `routes.json` 변경 금지
- `middleware.ts` 변경 금지
- Caddy 변경 금지
- `night-bus-data.ts` 변경 금지
- GA4 측정 ID·설치 방식 변경 금지 (`G-ND7JGQ62QX` 유지)
- google-site-verification·naver-site-verification 메타 변경 금지
- `<GoogleAnalytics>` 컴포넌트 위치·로드 방식 변경 금지
- `alternateLinks: false` 변경 금지 (Round 16B 유지)
- html `lang` 속성 변경 금지 (Round 19.6 유지)
- canonical 변경 금지
- sitemap 변경 금지 (`/ko/privacy`, `/en/privacy` 양쪽 모두 기존 등록 상태 유지)
- robots 변경 금지 (index 유지)
- /en/privacy 를 noindex 처리하거나 404 처리하는 변경 금지
- Privacy 페이지 외 다른 페이지의 운영자 표기·이메일 변경 금지
- 본문 문장 임의 변경 금지 (오타가 의심되면 보고 후 포그린 승인 받고 변경)
- 외부 공식 링크(Google 정책·GA opt-out 등) 추가 금지 (포그린 결정: 박지 않음)

---

## 9. 회귀검증 항목

배포 후 검증한다. 전부 PASS여야 한다.

| 항목 | 기대값 |
|------|--------|
| `/ko/privacy` HTTP 200 | PASS |
| `/en/privacy` HTTP 200 | PASS |
| `/ko/privacy` title | `개인정보처리방침 Seoul Autonomous` |
| `/en/privacy` title | `Privacy Policy Seoul Autonomous` |
| `/ko/privacy` meta description | §2 명시값 |
| `/en/privacy` meta description | §3 명시값 |
| `/ko/privacy` H1 | `개인정보처리방침` |
| `/en/privacy` H1 | `Privacy Policy` |
| 본문 14개 섹션 모두 렌더 | PASS |
| 시행일·최종 수정일 실제 배포일 입력됨 | PASS |
| 시행일 = 최종 수정일 (동일 값) | PASS |
| placeholder `[실제 배포일]` `[actual deployment date]` 잔존 0건 | PASS |
| `support@fazr.co.kr` Privacy 페이지 내 잔존 0건 | PASS |
| `seoulautonomous@protonmail.com` Privacy 페이지 노출 | PASS |
| GA4 로드 (`G-ND7JGQ62QX`) | PASS |
| google-site-verification 메타 유지 | PASS |
| naver-site-verification 메타 유지 | PASS |
| html `lang="ko"` / `lang="en"` 정상 | PASS |
| canonical self 정상 | PASS |
| HTTP Link 헤더 hreflang 미발생 | PASS |
| sitemap.xml 에 `/ko/privacy`, `/en/privacy` 존재 | PASS |
| noindex 없음 | PASS |
| 다른 페이지 회귀: `/ko`, `/ko/night-bus-map`, `/ko/updates/night-bus-map-launch` 200 | PASS |
| 다른 페이지 회귀: `/en`, `/en/how-to-ride` 등 200 | PASS |
| design-preview 경로 회귀 | PASS |

---

## 10. 진행 순서

1. **audit 보고** (§1) — 코드 변경 0건. 결과만 보고
2. **포그린 승인 대기 (승인 지점 1: 본 작업 시작)**
3. **본 작업 실행** — 한·영 본문·메타·운영자·이메일 교체
4. **배포일 placeholder → 실제 배포 예정일 치환**
5. **로컬 빌드 검증** — Next.js 빌드 통과
6. **회귀검증 (배포 전)** — §9 항목 중 빌드 결과로 확인 가능한 항목 (title·meta·본문·HTML 출력·placeholder 잔존 0건)
7. **커밋** — 메시지: `Round 22-Privacy — /ko/privacy + /en/privacy 정정 (GA4 운영 반영)`
8. **포그린 승인 대기 (승인 지점 2: 푸시)** — 푸시 직전 날짜 변경 발생 시 §6에 따라 날짜 재수정·재빌드·재커밋(amend) 후 보고
9. **푸시**
10. **포그린 승인 대기 (승인 지점 3: 라이브 배포)** — 배포 직전 날짜 변경 발생 시 §6에 따라 날짜 재수정·재빌드·재커밋·재푸시 후 보고
11. **배포** — docker build/run
12. **회귀검증 (배포 후)** — §9 전 항목 라이브 확인
13. **검증 결과 보고**

**승인 지점은 위 3곳(본 작업 시작 / 커밋·푸시 / 라이브 배포)만 유지한다.** 승인받은 작업 범위 안의 본문 반영·날짜 입력·로컬 빌드·배포 전 회귀검증은 연속해서 수행할 수 있다. 범위 밖 변경이나 예상하지 못한 모순이 발견되면 즉시 중단하고 보고한다.

---

## 11. 커밋·푸시·배포 규칙

- 커밋 메시지: `Round 22-Privacy — /ko/privacy + /en/privacy 정정 (GA4 운영 반영)`
- 커밋 본문에 배포일 입력 사실 명시 (`시행일·최종 수정일: 2026-MM-DD`)
- **푸시는 포그린 명시적 승인 후만**
- **배포는 푸시 후 포그린 명시적 승인 후만**
- 묶음 배포 금지. Round 22-Privacy 단독 배포 후 검증 완료 후에만 Round 22 진행
- Round 22-Privacy 배포 완료 후 Round 22 시작까지 간격: 몇 시간 ~ 다음 날 (잠금 문서 §1)

---

## 12. 보고 형식

각 단계 완료 후 다음 형식으로 보고:

```
[단계 N] 완료
- 변경 파일: ...
- 변경 라인 수: ...
- audit/검증 결과: ...
- 다음 단계: 포그린 승인 대기
```

audit 단계는 표 형식으로 정리:

```
| 파일 | 경로 | 구조 | 기존 값 |
```

---

## 13. 잠금 문서 (참고용 — 변경 권한 Claude UI/Claude Code 모두 없음)

- 본 지시서는 `docs/worklogs/ROUND-22-FINAL-PLAN.md` §2 기준
- 잠금 문서 본문에 `support@fazr.co.kr` → `seoulautonomous@protonmail.com` 패치 필요 (별도 docs 커밋, 포그린 지시 시)
- 메모리는 Claude UI가 2026-06-28 업데이트 완료 (운영자 = Seoul Autonomous, 이메일 = seoulautonomous@protonmail.com)

---

## 끝

본 지시서대로만 작업. 의문점·발견된 모순·audit 단계 누락은 즉시 보고. 독자 결정 금지.
