import type { FAQDocument } from '../../lib/types/faq';

export const faqEn: FAQDocument = {
  items: [
    {
      id: 'q1',
      question: 'How do I ride a Seoul autonomous bus?',
      answer: 'Find a listed stop using the Routes page and check the first/last service times. For buses, T-money or a contactless card can be used at the stop where accepted. For robotaxis, request the service through Kakao T. A safety operator may be onboard during pilot operations.',
      sourceTags: ['how-to-ride'],
    },
    {
      id: 'q2',
      question: 'Where can I ride autonomous services in Seoul?',
      answer: 'Seoul Autonomous lists 11 verified fixed bus routes and 1 on-demand robotaxi service. Fixed routes cover areas including Cheonggye, Sangam, Cheongwadae, Dongjak, Dongdaemun, Seodaemun, and several late-night routes. On-demand robotaxi service operates in Gangnam-gu and Seocho-gu (late-night). See the Routes page for the full list.',
      sourceTags: ['routes.json'],
    },
    {
      id: 'q3',
      question: 'Do I need a reservation?',
      answer: 'For listed bus routes, reservation requirement is currently shown as Unknown in our route data. For Gangnam Robotaxi, the service is requested through Kakao T at the time of riding. Always confirm reservation requirements with the operator before riding.',
      sourceTags: ['routes.json', 'how-to-ride'],
    },
    {
      id: 'q4',
      question: 'Is it free?',
      answer: 'Fare information is currently shown as Unknown for all listed routes. Please confirm the fare on Kakao Map or with the operator before riding.',
      sourceTags: ['routes.json'],
    },
    {
      id: 'q5',
      question: 'Does this site provide real-time arrival information?',
      answer: 'No. This site does not provide real-time arrival information. Route information is verified manually and may not reflect live status. Always confirm with Kakao Map or the official source before riding.',
      sourceTags: ['data-source'],
    },
    {
      id: 'q6',
      question: 'What should I check before riding?',
      answer: 'Check the first/last service times, day of operation, and current operating status via Kakao Map or the official source. Confirm fare and reservation requirements with the operator. Each route page on this site shows its last verification date.',
      sourceTags: ['data-source', 'how-to-ride'],
    },
    {
      id: 'q7',
      question: 'Can international visitors use it?',
      answer: 'Most listed services are public pilot routes. International visitors can usually ride the buses if they follow the route information and use T-money or a contactless card where accepted. The Gangnam Robotaxi service requires the Kakao T app, which is currently a Korean app.',
      sourceTags: ['how-to-ride'],
    },
    {
      id: 'q8',
      question: 'What is the difference between an autonomous bus and a robotaxi?',
      answer: 'Autonomous buses run on listed fixed routes with verified stops and schedules, and no app is required for riding. Robotaxis operate on demand in a service area and require the Kakao T app to request service. Currently, Seoul Autonomous lists 11 fixed bus routes and 1 robotaxi service (Gangnam Robotaxi).',
      sourceTags: ['routes.json', 'how-to-ride'],
    },
  ],
};
