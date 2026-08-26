/**
 * 콘텐츠형 기사 섹션. 검색 의도가 보이는 명사형 소제목 + 섹션별 고유 본문을 담는다.
 * 이 필드가 있으면 템플릿은 고정 라벨 4섹션 대신 이 섹션들을 렌더한다.
 * (Robotaxi Freshness에서 도입 — 공지형 기사는 기존 sections 를 그대로 쓴다.)
 */
export type ArticleSection = {
  heading: { en: string; ko: string };
  paragraphs: { en: string[]; ko: string[] };
  bullets?: { en: string[]; ko: string[] };
};

export type UpdateEntry = {
  slug: string;
  date: string;
  eventDate: string;
  sourcePublishedAt: string;
  titleEn: string;
  titleKo: string;
  h1Ko?: string;
  summaryEn: string;
  summaryKo: string;
  relatedRouteIds: string[];
  customRender?: string;
  dateModified?: string;
  /** 공식 출처 URL. 있으면 기사 하단에 공식 출처 링크로 렌더된다 (Robotaxi Freshness에서 도입, optional). */
  sourceUrl?: string;
  /** 공지형 고정 4섹션. articleSections 를 쓰는 콘텐츠형 기사에서는 생략한다. */
  sections?: {
    whatChanged: { en: string; ko: string };
    confirmedInfo: { en: string[]; ko: string[] };
    reportedInfo: { en: string[]; ko: string[] };
    checkBefore: { en: string; ko: string };
  };
  articleSections?: ArticleSection[];
};
