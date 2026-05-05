import type { LegalDocument } from '../../lib/types/legal';

const document: LegalDocument = {
  title: 'Terms of Use',
  effectiveDate: 'May 2, 2026',
  lastUpdated: 'May 2, 2026',
  sections: [
    {
      title: '1. Acceptance of Terms',
      paragraphs: [
        'By downloading, installing, or using the Seoul Autonomous app (the "App"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the App.',
      ],
    },
    {
      title: '2. Description of Service',
      paragraphs: [
        'Seoul Autonomous is an information app that provides details about autonomous vehicle routes (including buses and robotaxis) available or announced in Seoul, Republic of Korea. The App is provided free of charge.',
      ],
    },
    {
      title: '3. Information Accuracy and Limitations',
      subsections: [
        {
          title: '3.1 Reference Information Only',
          paragraphs: [
            'The information provided in the App is for reference purposes only. Route information, schedules, stop locations, and service availability are based on data verified by the Developer at the time of the App\'s release or last update.',
          ],
        },
        {
          title: '3.2 Not Real-Time',
          paragraphs: [
            '**The App does not provide real-time information.** Vehicle locations, arrival times, current operating status, and service disruptions are not reflected in the App.',
          ],
        },
        {
          title: '3.3 Verify Before Riding',
          paragraphs: [
            'Before using any autonomous vehicle service listed in the App, you must verify the following from official sources:',
          ],
          bulletPoints: [
            'Current operating status (operating / suspended / discontinued)',
            'Updated schedules and operating hours',
            'Boarding requirements (reservations, apps, fees)',
            'Route changes or temporary detours',
          ],
        },
      ],
      paragraphs: [
        'The Developer assumes no responsibility for any inconvenience, loss, or damage resulting from outdated or inaccurate information in the App.',
        'If you find outdated or incorrect route information, please contact us at support@fazr.co.kr.',
      ],
    },
    {
      title: '4. External Services',
      paragraphs: [
        'The App provides links to external services (such as Kakao Map) to help you locate stops or plan trips. The Developer is not responsible for:',
      ],
      bulletPoints: [
        'The availability or accuracy of these external services',
        'Any content, advertising, or other materials on these services',
        'Any data collection or privacy practices of these services',
      ],
    },
    {
      title: '5. No Affiliation',
      paragraphs: [
        'Seoul Autonomous is an independent information app. The Developer is not affiliated with, endorsed by, or sponsored by:',
      ],
      bulletPoints: [
        'The Seoul Metropolitan Government',
        'Any autonomous vehicle operator (bus operators, robotaxi providers)',
        'Any map service provider',
      ],
    },
    {
      title: '6. Intellectual Property',
      paragraphs: [
        'The App, including its design, code, icons, and original content, is owned by the Developer. Route data, names, and operational information are sourced from publicly available materials.',
      ],
    },
    {
      title: '7. Disclaimer of Warranties',
      paragraphs: [
        'The App is provided "as is" and "as available" without warranties of any kind, either express or implied. The Developer does not warrant that:',
      ],
      bulletPoints: [
        'The App will be error-free or uninterrupted',
        'The information provided is complete, accurate, or current',
        'The App is suitable for any particular purpose',
      ],
    },
    {
      title: '8. Limitation of Liability',
      paragraphs: [
        'To the maximum extent permitted by law, the Developer shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the App, including but not limited to:',
      ],
      bulletPoints: [
        'Inability to board a vehicle due to service changes',
        'Travel delays or missed connections',
        'Reliance on outdated information',
      ],
    },
    {
      title: '9. Changes to Terms',
      paragraphs: [
        'We may update these Terms of Use from time to time. Changes will be reflected by updating the "Last updated" date above. Continued use of the App after changes constitutes acceptance of the updated terms.',
      ],
    },
    {
      title: '10. Governing Law',
      paragraphs: [
        'These Terms of Use are governed by the laws of the Republic of Korea.',
      ],
    },
    {
      title: '11. Contact',
      paragraphs: [
        'For any questions regarding these Terms of Use, please contact:',
      ],
    },
  ],
  contact: {
    developer: 'fazr',
    email: 'support@fazr.co.kr',
    location: 'Seoul, Republic of Korea',
  },
};

export default document;
