import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import he from './locales/he/translation.json';

const resources = {
  en: { translation: en },
  he: { translation: he },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'he',
    fallbackLng: 'he',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

// Set dir attribute on html for RTL
export function setDirection(lang) {
  if (lang === 'he') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
}

export default i18n; 