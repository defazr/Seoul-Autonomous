export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sourceTags: Array<'routes.json' | 'how-to-ride' | 'data-source' | 'ssot'>;
}

export interface FAQDocument {
  items: FAQItem[];
}
