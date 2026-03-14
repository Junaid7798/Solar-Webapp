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
    try {
      // @ts-ignore
      return translations[language][section][key] || translations['en'][section][key] || key;
    } catch (e) {
      return key;
    }
  };

  return { t, language, setLanguage };
};
