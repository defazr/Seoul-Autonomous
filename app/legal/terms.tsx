import { useTranslation } from 'react-i18next';
import LegalDocumentScreen from '../../components/legal/LegalDocumentScreen';
import termsEn from '../../lib/legal/terms.en';
import termsKo from '../../lib/legal/terms.ko';

export default function TermsOfUseScreen() {
  const { i18n } = useTranslation();
  const isKo = i18n.language === 'ko';
  const doc = isKo ? termsKo : termsEn;

  return <LegalDocumentScreen document={doc} />;
}
