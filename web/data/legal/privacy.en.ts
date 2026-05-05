import type { LegalDocument } from '../../lib/types/legal';

const document: LegalDocument = {
  title: 'Privacy Policy',
  effectiveDate: 'May 2, 2026',
  lastUpdated: 'May 2, 2026',
  sections: [
    {
      title: '1. Introduction',
      paragraphs: [
        'This Privacy Policy describes how Seoul Autonomous (the "App"), operated by fazr (the "Developer"), handles information in connection with your use of the App.',
        'The App provides verified information about autonomous vehicle routes available or announced in Seoul, Republic of Korea. The App is designed to operate without collecting personal data.',
      ],
    },
    {
      title: '2. Data We Collect',
      paragraphs: [
        '**We do not collect any personal data.**',
        'Specifically, the App does not:',
      ],
      bulletPoints: [
        'Collect, store, or transmit any personally identifiable information',
        'Require account creation or login',
        'Request location permissions',
        'Access your camera, microphone, contacts, or photos',
        'Send push notifications',
        'Use third-party analytics or tracking services',
        'Use crash reporting services',
        'Make any network requests to external servers operated by the Developer',
      ],
    },
    {
      title: '3. Data Stored Locally on Your Device',
      paragraphs: [
        'The App stores the following data locally on your device only. This data is never transmitted to the Developer or any third party:',
      ],
      bulletPoints: [
        'Language preference (Korean / English) \u2014 to remember your selected display language',
      ],
      subsections: [],
    },
    {
      title: '4. Bundled Data',
      paragraphs: [
        'The App includes bundled route information (such as bus routes, stops, and operating hours) as part of the App package. This data is read locally and does not require any network connection.',
      ],
    },
    {
      title: '5. External Links',
      paragraphs: [
        'The App may open external map services (such as Kakao Map) when you tap a map link. When you do so, you leave the App and enter the third-party service. The Developer is not responsible for the privacy practices of these third-party services. Please review their respective privacy policies.',
      ],
    },
    {
      title: "6. Children's Privacy",
      paragraphs: [
        'The App does not collect personal data from users, including children. However, the App is intended to provide general transportation information and should be used with appropriate supervision where necessary. We do not knowingly collect information from children under 13.',
      ],
    },
    {
      title: '7. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. Changes will be reflected by updating the "Last updated" date above. Continued use of the App after changes constitutes acceptance of the updated policy.',
      ],
    },
    {
      title: '8. Contact',
      paragraphs: [
        'For any questions or concerns regarding this Privacy Policy, please contact:',
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
