import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../i18n/en.json';
import kn from '../i18n/kn.json';
import hi from '../i18n/hi.json';
import { LanguagePreference } from '../types';

type TranslationTree = Record<string, any>;

const translations: Record<LanguagePreference, TranslationTree> = {
  ENGLISH: en,
  KANNADA: kn,
  HINDI: hi,
};

interface LanguageContextType {
  language: LanguagePreference;
  setLanguage: (lang: LanguagePreference) => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguagePreference>(() => {
    const saved = localStorage.getItem('preferredLanguage') as LanguagePreference;
    return saved === 'KANNADA' || saved === 'HINDI' ? saved : 'ENGLISH';
  });

  const setLanguage = (lang: LanguagePreference) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = translations[language];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback: any = translations.ENGLISH;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return keyPath;
          }
        }
        return typeof fallback === 'string' ? fallback : keyPath;
      }
    }
    return typeof current === 'string' ? current : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
