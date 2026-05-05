export type LegalSubsection = {
  title: string;
  paragraphs?: string[];
  bulletPoints?: string[];
};

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bulletPoints?: string[];
  subsections?: LegalSubsection[];
};

export type LegalContact = {
  developer: string;
  email: string;
  location: string;
};

export type LegalDocument = {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalSection[];
  contact: LegalContact;
};
