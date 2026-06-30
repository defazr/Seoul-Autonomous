import type { LegalDocument } from '../../lib/types/legal';

const document: LegalDocument = {
  title: '개인정보처리방침',
  effectiveDate: '2026-06-30',
  lastUpdated: '2026-06-30',
  sections: [
    {
      title: '1. 적용 대상',
      paragraphs: [
        '본 개인정보처리방침은 Seoul Autonomous 웹사이트와 seoulautonomous.com에서 제공되는 한국어 및 영어 페이지에 적용됩니다.',
        'Seoul Autonomous는 서울의 자율주행 교통과 심야버스 노선 등에 관한 안내 정보를 제공하는 독립 웹사이트입니다.',
      ],
    },
    {
      title: '2. 직접 입력받는 정보',
      paragraphs: [
        'Seoul Autonomous는 회원가입, 로그인, 결제 또는 이용자 계정 기능을 제공하지 않습니다. 이용자의 이름, 전화번호, 주소, 결제 정보와 같은 정보를 웹사이트에서 직접 입력받지 않습니다.',
        '위치 권한, 카메라, 마이크, 연락처 또는 사진에 대한 접근 권한도 요청하지 않습니다.',
        '다만 웹사이트 이용 현황을 파악하고 서비스를 개선하기 위해 Google Analytics 4를 사용하며, 이 과정에서 아래와 같은 정보가 자동으로 처리될 수 있습니다.',
      ],
    },
    {
      title: '3. Google Analytics 사용',
      paragraphs: [
        'Seoul Autonomous는 웹사이트 방문 및 이용 현황을 분석하기 위해 Google LLC가 제공하는 Google Analytics 4를 사용합니다.',
        'Google Analytics는 웹사이트 방문 통계와 이용 흐름을 분석하기 위한 제3자 분석 서비스입니다.',
      ],
    },
    {
      title: '4. 자동으로 처리될 수 있는 정보',
      paragraphs: [
        'Google Analytics를 통해 다음 정보가 자동으로 처리될 수 있습니다.',
      ],
      orderedList: [
        '방문한 페이지와 페이지 URL',
        '페이지 제목과 이전 방문 페이지 또는 유입 경로',
        '접속 일시, 세션 정보 및 이용 통계',
        '브라우저 종류, 기기 유형 및 화면 정보',
        '브라우저 또는 기기의 언어 설정',
        '대략적인 국가, 도시 또는 지역 정보',
        '페이지 조회, 스크롤, 외부 링크 클릭, 사이트 검색, 양식 상호작용, 동영상 참여 및 파일 다운로드 등의 이용 이벤트',
        '쿠키 또는 이와 유사한 온라인 식별자',
      ],
      paragraphsAfter: [
        '설정된 기능이나 해당 콘텐츠가 없는 경우 일부 이벤트는 발생하지 않을 수 있습니다.',
        'Seoul Autonomous는 검색창 등에 이용자가 자유롭게 입력한 원문을 별도의 맞춤 이벤트로 Google Analytics에 전송하지 않습니다.',
      ],
    },
    {
      title: '5. IP 주소 처리',
      paragraphs: [
        '이용자의 IP 주소는 대략적인 국가, 도시 또는 지역 정보를 산출하고 통신을 처리하는 과정에서 사용될 수 있습니다.',
        'Google Analytics 4에서는 개별 이용자의 IP 주소가 Analytics에 기록되거나 저장되지 않습니다. Seoul Autonomous 운영자는 Google Analytics 보고서에서 개별 이용자의 IP 주소를 확인할 수 없습니다.',
      ],
    },
    {
      title: '6. 쿠키 사용',
      paragraphs: [
        'Google Analytics는 웹사이트 이용 통계를 측정하기 위해 다음과 같은 자사 쿠키를 사용할 수 있습니다.',
      ],
      bulletPoints: [
        '_ga: 이용자를 구분하기 위한 쿠키',
        '_ga_*: 해당 Google Analytics 속성의 세션 상태를 유지하기 위한 쿠키',
      ],
      paragraphsAfter: [
        '별도의 만료기간 변경 설정을 적용하지 않은 현재 구성에서는 두 쿠키의 기본 만료기간이 최대 2년으로 설정될 수 있습니다.',
        '실제 보관 기간은 이용자의 브라우저 정책, 쿠키 차단 또는 삭제 설정, 추적 방지 기능과 이용 환경에 따라 더 짧아질 수 있습니다. 쿠키를 삭제하면 이후 방문 시 새로운 식별자가 생성될 수 있습니다.',
      ],
    },
    {
      title: '7. 처리 목적',
      paragraphs: ['자동으로 처리되는 정보는 다음 목적으로 사용합니다.'],
      bulletPoints: [
        '방문자 수와 페이지 이용 현황 파악',
        '많이 이용되는 페이지와 기능 분석',
        '방문 경로와 유입 경로 분석',
        '웹사이트 오류와 이용 불편 확인',
        '콘텐츠, 기능 및 사용자 경험 개선',
        '웹사이트 운영에 필요한 통계 작성',
      ],
    },
    {
      title: '8. 데이터 보유기간',
      paragraphs: [
        '현재 Seoul Autonomous의 Google Analytics 속성에는 다음과 같은 보유 설정이 적용되어 있습니다.',
      ],
      bulletPoints: [
        '사용자 수준 데이터: 최대 14개월',
        '이벤트 수준 데이터: 최대 2개월',
        '새 사용자 활동이 발생할 때 사용자 식별자와 관련된 보유기간 재설정: 사용',
      ],
      paragraphsAfter: [
        '이 기간은 Google Analytics에 보관되는 비집계 사용자 수준 및 이벤트 수준 데이터에 적용됩니다.',
        '따라서 Google Analytics의 모든 통계와 집계 보고서가 2개월 후 일괄 삭제된다는 의미는 아닙니다. 법령 준수, 시스템 백업 또는 Google의 서비스 운영 정책에 따라 실제 처리 방식이 달라질 수 있습니다.',
      ],
    },
    {
      title: '9. 제3자 처리 및 국외 처리 가능성',
      paragraphs: [
        'Google은 Google Analytics의 제3자 서비스 제공자입니다. Google Analytics를 통해 처리되는 정보는 Google 또는 Google의 서비스 인프라를 통해 처리됩니다.',
        'Google은 여러 국가와 지역에서 서버와 관련 인프라를 운영하므로, 관련 정보가 대한민국 밖의 지역에서 처리될 수 있습니다. 실제 처리 위치는 Google의 시스템 운영과 이용 환경에 따라 달라질 수 있으므로 특정 국가나 서버 위치로 한정하지 않습니다.',
        'Google의 정보 처리 방식은 Google의 개인정보처리방침 및 Google Analytics 관련 정책의 적용을 받습니다.',
      ],
    },
    {
      title: '10. 이용자의 선택권',
      paragraphs: [
        '이용자는 다음 방법으로 Google Analytics의 쿠키 또는 측정을 제한할 수 있습니다.',
      ],
      bulletPoints: [
        '브라우저 설정에서 쿠키 차단 또는 삭제',
        '브라우저의 추적 방지 기능 사용',
        '시크릿 또는 비공개 브라우징 기능 사용',
        'Google Analytics 차단 브라우저 부가기능 사용',
      ],
      paragraphsAfter: [
        '쿠키를 차단하거나 삭제해도 Seoul Autonomous의 일반적인 콘텐츠는 이용할 수 있습니다. 다만 언어 설정 등 브라우저에 저장되는 일부 이용 환경이 초기화되거나 반복해서 설정해야 할 수 있습니다.',
        '이용자는 자신과 관련된 개인정보의 열람, 정정·삭제 또는 처리정지를 요청할 수 있습니다. 관련 요청이나 문의는 이 방침 하단의 이메일로 보내주시기 바랍니다. 다만 Google Analytics의 무작위 쿠키 식별자만으로 특정 이용자를 확인할 수 없는 경우에는 요청 대상 정보를 식별하거나 처리하는 데 제한이 있을 수 있습니다.',
      ],
    },
    {
      title: '11. 외부 서비스 링크',
      paragraphs: [
        'Seoul Autonomous에는 네이버지도, 카카오맵 또는 그 밖의 외부 웹사이트로 이동하는 링크가 포함될 수 있습니다.',
        '외부 링크를 선택하면 해당 제3자 서비스의 웹사이트나 앱으로 이동하며, 그 이후의 정보 처리는 해당 서비스의 개인정보처리방침과 이용약관에 따릅니다.',
        'Seoul Autonomous는 제3자 서비스가 독립적으로 수행하는 정보 처리에 관여하거나 이를 통제하지 않습니다.',
      ],
    },
    {
      title: '12. 아동의 개인정보',
      paragraphs: [
        'Seoul Autonomous는 일반적인 교통 안내 정보를 제공하는 웹사이트이며 아동을 대상으로 회원가입이나 개인정보 입력을 요구하지 않습니다.',
        '운영자는 만 14세 미만 아동의 개인정보를 의도적으로 직접 입력받거나 수집하지 않습니다. 다만 일반 이용자와 마찬가지로 웹사이트 방문 과정에서 Google Analytics 정보가 자동으로 처리될 수 있습니다.',
      ],
    },
    {
      title: '13. 개인정보처리방침의 변경',
      paragraphs: [
        '웹사이트 기능, 분석 도구 또는 정보 처리 방식이 변경되면 본 개인정보처리방침을 수정할 수 있습니다.',
        '변경 시 이 페이지 상단의 최종 수정일을 갱신합니다. 이용자에게 중요한 영향을 줄 수 있는 변경사항은 필요한 경우 웹사이트를 통해 별도로 안내합니다.',
      ],
    },
    {
      title: '14. 문의처',
      paragraphs: [
        '본 개인정보처리방침이나 Seoul Autonomous의 정보 처리에 관한 문의는 아래 연락처로 보내주시기 바랍니다.',
      ],
    },
  ],
  contact: {
    developerLabel: '운영자',
    developer: 'Seoul Autonomous',
    email: 'seoulautonomous@protonmail.com',
    location: '대한민국 서울',
  },
};

export default document;
