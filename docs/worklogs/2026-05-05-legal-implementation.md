# Round 10C-Legal — Privacy + Terms 페이지 구현

> Date: 2026-05-05
> Status: Complete
> Type: implementation

## Summary

Privacy Policy + Terms of Use 페이지 구현. 앱 lib/legal/*.ts 원문 그대로 복사, LegalDocumentScreen을 웹용으로 포팅. 신규 컴포넌트 1개(LegalDocument). 빌드 37→41 페이지.

## 구현 범위

- `/en/privacy`, `/ko/privacy` — Privacy Policy / 개인정보처리방침
- `/en/terms`, `/ko/terms` — Terms of Use / 이용약관
- 신규 컴포넌트: LegalDocument (web/components/legal/) — 앱 LegalDocumentScreen 웹 포팅
- i18n: metadata 4키만 (본문은 .ts 데이터 파일, 라벨은 컴포넌트 내부 locale 분기)

## 검증

| 체크 | 결과 |
|------|------|
| npm run build | 성공, 41 정적 페이지 |
| /en/privacy | 200, H1: "Privacy Policy" |
| /ko/privacy | 200, H1: "개인정보처리방침" |
| /en/terms | 200, H1: "Terms of Use" |
| /ko/terms | 200, H1: "이용약관" |
| **bold** 마크다운 | 정상 |
| contact 블록 | support@fazr.co.kr 정상 |
| LangToggle | 정상 |
| 기존 페이지 | 변경 0건 |
