export interface NightBusGuideRoute {
  number: string;
  endpoints: string;
}

export const nightBusGuideEn = {
  metadata: {
    title: 'Seoul Night Bus (Owl Bus) Guide — Routes and Fare',
    description:
      "English guide to Seoul's Owl Bus night network: all 14 routes and endpoints, the KRW 2,500 card fare, service hours, and a Korean interactive map.",
    ogImageAlt: 'Seoul Autonomous — Seoul Night Bus (Owl Bus) Guide',
  },
  hero: {
    h1: 'Seoul Night Bus (Owl Bus) Guide',
    summary:
      "Seoul's Owl Bus is the city's late-night N-bus network. This guide lists all 14 routes with their start and end points, the card fare, operating hours, and tips for using the Korean interactive route map.",
    asOf: 'Route and fare information as of March 20, 2026 (Seoul Metropolitan Government).',
  },
  quickFacts: [
    { label: 'Routes', value: '14' },
    { label: 'Buses in service', value: '140' },
    { label: 'Operating hours', value: '23:00–06:00' },
    { label: 'Card fare', value: 'KRW 2,500' },
  ],
  sections: {
    what: {
      title: 'What the Owl Bus is',
      body: "The Owl Bus is Seoul's late-night bus network. As of March 20, 2026, 14 routes and 140 buses operate between 23:00 and 06:00.",
    },
    when: {
      title: 'When this guide helps',
      body: 'Use this guide when planning a late-night trip, comparing the endpoints of different N routes, or deciding which route to check on the map.',
    },
    how: {
      title: 'How to read the network',
      body: 'Start with the route number and endpoints in the list below. Then open the Korean interactive map to see where routes meet and to compare direct and transfer options. Route numbers use Latin letters and digits, while station and stop names on the map appear in Hangul.',
    },
  },
  routesTitle: 'All 14 Owl Bus routes',
  routes: [
    { number: 'N13', endpoints: 'Sanggye-dong ↔ Jangji-dong' },
    { number: 'N15', endpoints: 'Ui-dong ↔ Sadang Station' },
    { number: 'N16', endpoints: 'Dobongsan ↔ Onsu-dong' },
    { number: 'N26', endpoints: 'Banghwa-dong ↔ Sinnae-dong' },
    { number: 'N30', endpoints: 'Gangil-dong ↔ Seoul Station' },
    { number: 'N31', endpoints: 'Gangil-dong ↔ Jeongneung-dong' },
    { number: 'N37', endpoints: 'Jangji-dong ↔ Jingwan-dong' },
    { number: 'N51', endpoints: 'Siheung-dong ↔ Hagye-dong' },
    { number: 'N61', endpoints: 'Sinjeong-dong ↔ Sanggye-dong' },
    { number: 'N62', endpoints: 'Sinjeong-dong ↔ Myeonmok-dong' },
    { number: 'N64', endpoints: 'Gaehwa-dong ↔ Yeomgok-dong' },
    { number: 'N72', endpoints: 'Susaek-dong ↔ Sinnae-dong' },
    { number: 'N73', endpoints: 'Gusan-dong ↔ Jangji-dong' },
    { number: 'N75', endpoints: 'Jingwan-dong ↔ Sillim-dong' },
  ],
  mapCta: {
    title: 'Open the interactive route map',
    body: 'Use the Korean interactive map to compare routes and check direct and transfer options.',
    cta: 'Open the interactive route map',
    href: '/ko/night-bus-map',
    note: 'The map is in Korean. Station and stop names appear in Hangul, but the N route numbers match the list in this guide.',
  },
  beforeYouRide: {
    title: 'Before you ride',
    body: 'Schedules and fares can change. Check the latest departure information on Kakao Map or Naver Map before traveling.',
  },
} as const;

// Compile-time guard: exactly 14 routes.
const _routeCount: 14 = nightBusGuideEn.routes.length;
void _routeCount;
