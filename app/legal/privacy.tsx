import { useTranslation } from 'react-i18next';
import LegalDocumentScreen from '../../components/legal/LegalDocumentScreen';
import privacyEn from '../../lib/legal/privacy.en';
import privacyKo from '../../lib/legal/privacy.ko';

export default function PrivacyPolicyScreen() {
  const { i18n } = useTranslation();
  const isKo = i18n.language === 'ko';
  const doc = isKo ? privacyKo : privacyEn;

  return <LegalDocumentScreen document={doc} />;
}
