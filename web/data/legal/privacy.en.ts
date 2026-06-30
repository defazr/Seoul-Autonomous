import type { LegalDocument } from '../../lib/types/legal';

const document: LegalDocument = {
  title: 'Privacy Policy',
  effectiveDate: '2026-06-30',
  lastUpdated: '2026-06-30',
  sections: [
    {
      title: '1. Scope',
      paragraphs: [
        'This Privacy Policy applies to the Seoul Autonomous website and to the Korean and English pages available through seoulautonomous.com.',
        'Seoul Autonomous is an independent website providing information about autonomous transportation and night bus routes in Seoul, Republic of Korea.',
      ],
    },
    {
      title: '2. Information You Provide Directly',
      paragraphs: [
        'Seoul Autonomous does not provide account registration, login, payment, or user account features. The website does not ask users to directly submit information such as their name, telephone number, address, or payment details.',
        "The website does not request access to a user's location, camera, microphone, contacts, or photos.",
        'However, Seoul Autonomous uses Google Analytics 4 to understand website usage and improve the service. Certain information may therefore be processed automatically as described below.',
      ],
    },
    {
      title: '3. Use of Google Analytics',
      paragraphs: [
        'Seoul Autonomous uses Google Analytics 4, a third-party analytics service provided by Google LLC, to measure visits and understand how the website is used.',
      ],
    },
    {
      title: '4. Information That May Be Processed Automatically',
      paragraphs: ['Google Analytics may automatically process information including:'],
      orderedList: [
        'Pages visited and page URLs',
        'Page titles and the previous page or traffic source',
        'Access times, session information, and usage statistics',
        'Browser type, device type, and screen information',
        'Browser or device language settings',
        'Approximate country, city, or regional information',
        'Usage events such as page views, scrolling, outbound link clicks, site searches, form interactions, video engagement, and file downloads',
        'Cookies or similar online identifiers',
      ],
      paragraphsAfter: [
        'Some events may not occur when the relevant feature or content is not available or is not used.',
        'Seoul Autonomous does not currently send the original free-form text entered by users into search fields to Google Analytics through custom analytics events.',
      ],
    },
    {
      title: '5. IP Address Processing',
      paragraphs: [
        "A user's IP address may be used during network communication and to derive approximate country, city, or regional information.",
        "Google Analytics 4 does not log or store individual IP addresses in Analytics. The operator of Seoul Autonomous cannot view an individual user's IP address in Google Analytics reports.",
      ],
    },
    {
      title: '6. Cookies',
      paragraphs: [
        'Google Analytics may use the following first-party cookies to measure website usage:',
      ],
      bulletPoints: [
        '_ga: used to distinguish users',
        '_ga_*: used to maintain session state for the relevant Google Analytics property',
      ],
      paragraphsAfter: [
        'Because Seoul Autonomous has not overridden the default expiration settings, these cookies may have a default expiration period of up to two years.',
        "The actual period may be shorter because of browser policies, cookie blocking or deletion settings, tracking prevention features, or the user's browsing environment. Deleting cookies may cause a new identifier to be created during a later visit.",
      ],
    },
    {
      title: '7. Purposes of Processing',
      paragraphs: ['Automatically processed information is used to:'],
      bulletPoints: [
        'Measure visitor numbers and page usage',
        'Understand which pages and features are used',
        'Analyze navigation and traffic sources',
        'Identify website errors and usability issues',
        'Improve content, functionality, and user experience',
        'Prepare statistics necessary to operate the website',
      ],
    },
    {
      title: '8. Data Retention',
      paragraphs: [
        'The Seoul Autonomous Google Analytics property currently uses the following retention settings:',
      ],
      bulletPoints: [
        'User-level data: up to 14 months',
        'Event-level data: up to 2 months',
        'Resetting the retention period for a user identifier when new user activity occurs: enabled',
      ],
      paragraphsAfter: [
        'These periods apply to non-aggregated user-level and event-level data retained in Google Analytics.',
        "They do not mean that every statistic or aggregated report in Google Analytics is deleted after two months. Actual processing may also vary according to legal requirements, system backups, and Google's service operation policies.",
      ],
    },
    {
      title: '9. Third-Party Processing and International Processing',
      paragraphs: [
        'Google is the third-party service provider for Google Analytics. Information processed through Google Analytics is handled through Google and its service infrastructure.',
        "Google operates servers and related infrastructure in multiple countries and regions. Information may therefore be processed outside the Republic of Korea. The specific processing location may vary depending on Google's systems and the user's environment, so Seoul Autonomous does not identify a single country or server location.",
        "Google's handling of information is governed by Google's Privacy Policy and its policies for Google Analytics.",
      ],
    },
    {
      title: '10. Your Choices',
      paragraphs: ['Users may limit Google Analytics cookies or measurement by:'],
      bulletPoints: [
        'Blocking or deleting cookies through browser settings',
        'Enabling tracking prevention features in their browser',
        'Using private or incognito browsing',
        'Installing the Google Analytics opt-out browser add-on',
      ],
      paragraphsAfter: [
        'Blocking or deleting cookies does not prevent access to the general content available on Seoul Autonomous. However, some browser-stored preferences, such as language settings, may be reset or may need to be selected again.',
        'Users may request access to, correction or deletion of, or restriction of processing of personal information relating to them. Requests or questions may be sent to the email address provided at the end of this Policy. Where a user cannot be identified from a random Google Analytics cookie identifier alone, the operator may be limited in its ability to identify or act on the relevant information.',
      ],
    },
    {
      title: '11. Links to External Services',
      paragraphs: [
        'Seoul Autonomous may include links to external services such as Naver Map, Kakao Map, or other websites.',
        "Selecting an external link takes the user to the third party's website or application. Any subsequent processing of information is governed by that third party's privacy policy and terms.",
        'Seoul Autonomous does not control information processing independently performed by those third-party services.',
      ],
    },
    {
      title: "12. Children's Privacy",
      paragraphs: [
        'Seoul Autonomous provides general transportation information and does not require children to create accounts or directly submit personal information.',
        'The operator does not knowingly request or directly collect personal information from children under the age of 14. However, as with other visitors, Google Analytics information may be processed automatically when a child visits the website.',
      ],
    },
    {
      title: '13. Changes to This Policy',
      paragraphs: [
        "This Privacy Policy may be updated when the website's features, analytics tools, or information processing practices change.",
        'When the policy is updated, the "Last updated" date at the top of this page will be revised. Material changes may also be announced separately on the website where appropriate.',
      ],
    },
    {
      title: '14. Contact',
      paragraphs: [
        'For questions about this Privacy Policy or the processing of information in connection with Seoul Autonomous, please contact:',
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
