import type { RouteContextMap } from '../../lib/types/route-context';

export const routeContextEn = {
  'saebyeok-a160': {
    overview:
      'Saebyeok A160 is an early-morning autonomous bus that runs from Dobongsan down through the Suyu, Mia and Jongno corridors to Yeongdeungpo. It links residential areas in north-eastern Seoul with the city centre and the Yeouido–Yeongdeungpo business district.',
    routePattern:
      'This is the longest early-morning route, with 87 stops. The bus turns around at Yeongdeungpo and retraces the same corridor back north. The first and last stops share a name but sit on opposite sides of the road.',
    keyStopIds: ['10340', '09013', '01010', '14004', '19005'],
    useCase:
      'Covers pre-dawn travel from the Dobong, Suyu and Mia areas toward Yeouido and Yeongdeungpo. The bus calls at all 87 stops, so boarding partway along the corridor is possible.',
  },
  'saebyeok-a741': {
    overview:
      'Saebyeok A741 is an early-morning autonomous bus from Gupabal through Yeonsinnae and Hongje into Gwanghwamun, then south through Gangnam to Yangjae. It cuts from Eunpyeong across the city centre into the Gangnam district.',
    routePattern:
      'It runs as a limited-stop service, calling at 34 of the stops on the existing 741 route. The bus turns around at Yangjae Station, Seocho Culture & Arts Center and returns to Gupabal station entrance.',
    keyStopIds: ['12012', '12018', '01009', '22011', '22003'],
    useCase:
      'Covers pre-dawn travel from Eunpyeong and Seodaemun toward Gwanghwamun and Gangnam. Since it does not call at every stop on the 741 route, check the stop list to confirm your boarding point is served.',
  },
  'saebyeok-a148': {
    overview:
      'Saebyeok A148 is an early-morning autonomous bus from the Sanggye area through Nowon, Mia Sageori, Korea University and Seongdong-gu Office down to the Express Bus Terminal. It cuts diagonally from Nowon to southern Gangnam.',
    routePattern:
      'It calls at 41 selected stops. The bus turns around at the Express bus terminal, but the final stop on the return leg is Sanggye station, which is not where the route began.',
    keyStopIds: ['11240', '11251', '09011', '22019', '11391'],
    useCase:
      'Covers pre-dawn travel from Nowon and Gangbuk toward Banpo and the Express Bus Terminal. It also calls at Apgujeong and Sinsa on the way.',
  },
  'saebyeok-a504': {
    overview:
      'Saebyeok A504 is an early-morning autonomous bus from Geumcheon-gu Office through Doksan, Sillim and Noryangjin up to Seoul Station and City Hall. It connects south-western residential areas with the central business district.',
    routePattern:
      'The route covers 32 stops. It turns around in the City Hall area and returns to Geumcheon-gu office, Geumcheon police station. The first and last stops share a name and differ only in direction.',
    keyStopIds: ['18007', '18147', '20114', '02007', '02507'],
    useCase:
      'Covers pre-dawn travel from Geumcheon and Gwanak toward Yongsan and City Hall. It also calls at Noryangjin and the Seoul Station transfer centre.',
  },
  'simya-a21': {
    overview:
      'Simya A21 is a late-night autonomous bus that runs west from Dongdaemun along Jongno, through Sinchon and Hongdae, to Hapjeong. It links the historic city centre with the north-western nightlife districts.',
    routePattern:
      'Service begins at 23:00 and continues until 03:40 the next morning. The bus turns around at Hapjeong station and returns to Dongdaemun, covering 40 stops on the round trip.',
    keyStopIds: ['01037', '01016', '13023', '14016', '14012'],
    useCase:
      'Covers late-night travel around Jongno, Sinchon and Hongdae. Service runs from 23:00 to 03:40, after the subway has stopped running.',
  },
  'cheonggye-a01': {
    overview:
      'Cheonggye A01 is a 12-stop city-centre loop along the Cheonggyecheon stream, running from 청계광장 toward the Gwangjang Market area and back. It covers the waterside stretch between Cheonggye 1-ga and 5-ga.',
    routePattern:
      'It is a true loop of 12 stops. It turns around at Cheonggye 5(o)-ga, Gwangjang market and returns to the same stop where it begins.',
    keyStopIds: ['02247', '02225', '01177', '01175'],
    useCase:
      'Covers travel along the Cheonggyecheon and to Gwangjang Market. Service runs from 10:00 to 16:00 at 30-minute intervals.',
  },
  'dongjak-a01': {
    overview:
      'Dongjak A01 is an autonomous village bus running between the middle gate of Soongsil University and the back gate of Chung-Ang University, by way of Soongsil Univ. station and the Sangdo-dong hillside.',
    routePattern:
      'The route serves 11 stops on its round trip. It turns around at Chung-Ang Univ. back gate and returns toward Soongsil University Middle Gate; the first and last stops share a name and differ only in direction.',
    keyStopIds: ['20170', '20166', '20245', '20202'],
    useCase:
      'Covers travel between the two campuses and along the Sangdo-dong slope. For trips between Soongsil University and Chung-Ang University, the route information lists a 25-minute headway alongside the stop sequence.',
  },
  'dongdaemun-a01': {
    overview:
      'Dongdaemun A01 is an autonomous village bus from Janghanpyeong through Jeonnong-dong and Cheongnyangni to Kyung Hee University Medical Center. It links residential Dongdaemun-gu with its medical and research facilities.',
    routePattern:
      'The round trip covers 23 stops. The bus turns around at the Kyung Hee medical centre stop, and the final stop on the way back is Janghanpyeong Station Exit 2 rather than the Exit 3 stop where it started.',
    keyStopIds: ['06252', '06216', '06272', '06510', '06251'],
    useCase:
      'Covers travel from Cheongnyangni Station to the medical centre and Seoul Bio Hub. It also calls at the Jangan-dong and Jeonnong-dong residential areas on the way.',
  },
  'seodaemun-a01': {
    overview:
      'Seodaemun A01 is an autonomous village bus looping from Seodaemun-gu Office past the district culture and sports centre and Hongnam Bridge to Gajwa Station. It connects administrative facilities with the railway station.',
    routePattern:
      'It is a loop of 14 stop calls. The bus turns around at the Gajwa Station exit stop and comes back to the very same Seodaemun-gu office stop it departed from.',
    keyStopIds: ['13156', '13201', '13260', '13257'],
    useCase:
      'Covers travel to the district office and public health centre, and from Gajwa Station toward the district office. Service runs from 09:20 to 16:35.',
  },
  'sangam-a21': {
    overview:
      'Sangam A21 is an autonomous shuttle from the south side of World Cup Stadium past Nanjicheon Park and the Noeul Park entrance to Digital Media City Station on the Airport Railroad. It links the park area with the Sangam media complex.',
    routePattern:
      'This route is shaped differently from the others. It turns around at the Noeul Park entrance but does not return to its starting point: the Airport Railroad Digital Media City station is the final stop. There are eight stops in total.',
    keyStopIds: ['14104', '14110', '14133', '14628', '14359'],
    useCase:
      'Covers travel from World Cup Park and Noeul Park toward Digital Media City Station. Because the turnaround point and the final stop differ, confirm your destination before boarding.',
  },
  'cheongwadae-a01': {
    overview:
      "Cheongwadae A01 is an autonomous shuttle from the Hyoja-ro entrance of Gyeongbokgung Station past Yeongchumun and Cheong Wa Dae to Chunchumun Gate and the National Folk Museum. It serves five stops around Gyeongbokgung Palace.",
    routePattern:
      'The route serves five stops, the fewest of any route listed on this site. It turns around at Cheong Wa Dae but does not return to the start: Gyeongbokgung Palace. The National Folk Museum of Korea is the final stop.',
    keyStopIds: ['01280', '01119', '01601', '01602', '01603'],
    useCase:
      'Covers travel around the Gyeongbokgung and Cheong Wa Dae area. The shuttle runs from the Hyoja-ro entrance of Gyeongbokgung Station past Yeongchumun, Cheong Wa Dae and Chunchumun Gate to the National Folk Museum.',
  },
} satisfies RouteContextMap;
