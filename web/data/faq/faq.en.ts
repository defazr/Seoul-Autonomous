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
      answer: 'The site currently lists 11 fixed autonomous bus routes and one on-demand robotaxi service. Stops and listed operating times for fixed routes are checked against a reference date, while fare, reservation and app requirements are shown only when separately confirmed.',
      sourceTags: ['routes.json'],
    },
    {
      id: 'q3',
      question: 'Do I need a reservation?',
      answer: 'Reservation requirements for listed autonomous bus routes have not been separately confirmed, so they are not presented as established facts. For Gangnam Robotaxi, the service is requested through Kakao T at the time of riding. Check the latest official service information before riding.',
      sourceTags: ['routes.json', 'how-to-ride'],
    },
    {
      id: 'q4',
      question: 'Is it free?',
      answer: 'Fare information is shown on this site only when it has been confirmed. Fares for the listed autonomous routes have not been confirmed yet, so please check the fare on Kakao Map or with the operator before riding.',
      sourceTags: ['routes.json'],
    },
    {
      id: 'q5',
      question: 'Does this site provide real-time arrival information?',
      answer: 'No. This site does not provide real-time arrival information. Information reflects checked stops and listed operating times and may not reflect live status. Always confirm with Kakao Map or the official source before riding.',
      sourceTags: ['data-source'],
    },
    {
      id: 'q6',
      question: 'What should I check before riding?',
      answer: 'Check the first/last service times, day of operation, and current operating status via Kakao Map or the official source. Confirm fare and reservation requirements with the operator. Each route page on this site shows the date its information was checked.',
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
      answer: 'Autonomous buses run on listed fixed routes with checked stops and listed times. App and reservation requirements may vary by service — if confirmed details are not shown, check the latest official service information before riding. Robotaxis operate on demand in a service area and require the Kakao T app to request service. Currently, Seoul Autonomous lists 11 fixed bus routes and 1 robotaxi service (Gangnam Robotaxi).',
      sourceTags: ['routes.json', 'how-to-ride'],
    },
  ],
};
