export type UpdateEntry = {
  slug: string;
  date: string;
  eventDate: string;
  sourcePublishedAt: string;
  titleEn: string;
  titleKo: string;
  summaryEn: string;
  summaryKo: string;
  relatedRouteIds: string[];
  customRender?: string;
  sections: {
    whatChanged: { en: string; ko: string };
    confirmedInfo: { en: string[]; ko: string[] };
    reportedInfo: { en: string[]; ko: string[] };
    checkBefore: { en: string; ko: string };
  };
};
