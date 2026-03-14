import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage') as Language;
    if (savedLang && ['en', 'hi', 'mr'].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language;
      if (browserLang.startsWith('hi')) {
        setLanguageState('hi');
      } else if (browserLang.startsWith('mr')) {
        setLanguageState('mr');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
