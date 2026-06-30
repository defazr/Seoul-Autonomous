import type { LegalDocument } from '../../lib/types/legal';

const document: LegalDocument = {
  title: 'Terms of Use',
  effectiveDate: 'May 2, 2026',
  lastUpdated: 'June 30, 2026',
  sections: [
    {
      title: '1. Acceptance of Terms',
      paragraphs: [
        'By accessing or using the Seoul Autonomous website (the "Website"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Website.',
      ],
    },
    {
      title: '2. Description of Service',
      paragraphs: [
        'Seoul Autonomous is an information website that provides details about autonomous vehicle routes (including buses and robotaxis) available or announced in Seoul, Republic of Korea. The Website is provided free of charge.',
      ],
    },
    {
      title: '3. Information Accuracy and Limitations',
      subsections: [
        {
          title: '3.1 Reference Information Only',
          paragraphs: [
            'The information provided on the Website is for reference purposes only. Route information, schedules, stop locations, and service availability are based on data verified by the Developer at the time of the Website\'s publication or last update.',
          ],
        },
        {
          title: '3.2 Not Real-Time',
          paragraphs: [
            '**The Website does not provide real-time information.** Vehicle locations, arrival times, current operating status, and service disruptions are not reflected on the Website.',
          ],
        },
        {
          title: '3.3 Verify Before Riding',
          paragraphs: [
            'Before using any autonomous vehicle service listed on the Website, you must verify the following from official sources:',
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
        'The Developer assumes no responsibility for any inconvenience, loss, or damage resulting from outdated or inaccurate information on the Website.',
        'If you find outdated or incorrect route information, please contact us at seoulautonomous@protonmail.com.',
      ],
    },
    {
      title: '4. External Services',
      paragraphs: [
        'The Website provides links to external services (such as Kakao Map) to help you locate stops or plan trips. The Developer is not responsible for:',
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
        'Seoul Autonomous is an independent information website. The Developer is not affiliated with, endorsed by, or sponsored by:',
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
        'The Website, including its design, code, icons, and original content, is owned by the Developer. Route data, names, and operational information are sourced from publicly available materials.',
      ],
    },
    {
      title: '7. Disclaimer of Warranties',
      paragraphs: [
        'The Website is provided "as is" and "as available" without warranties of any kind, either express or implied. The Developer does not warrant that:',
      ],
      bulletPoints: [
        'The Website will be error-free or uninterrupted',
        'The information provided is complete, accurate, or current',
        'The Website is suitable for any particular purpose',
      ],
    },
    {
      title: '8. Limitation of Liability',
      paragraphs: [
        'To the maximum extent permitted by law, the Developer shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Website, including but not limited to:',
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
        'We may update these Terms of Use from time to time. Changes will be reflected by updating the "Last updated" date above. Continued use of the Website after changes constitutes acceptance of the updated terms.',
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
    developerLabel: 'Operator',
    developer: 'Seoul Autonomous',
    email: 'seoulautonomous@protonmail.com',
    location: 'Seoul, Republic of Korea',
  },
};

export default document;
