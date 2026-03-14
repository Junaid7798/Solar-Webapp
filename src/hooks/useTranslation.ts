import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import mr from '../i18n/mr.json';

const translations = { en, hi, mr };

type TranslationKeys = typeof en;

export const useTranslation = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  const t = (section: keyof TranslationKeys, key: string): string => {
    const sectionData = (translations[language]?.[section] ?? {}) as Record<string, string>;
    const fallback = (translations['en']?.[section] ?? {}) as Record<string, string>;
    return sectionData[key] ?? fallback[key] ?? key;
  };

  return { t, language, setLanguage };
};
