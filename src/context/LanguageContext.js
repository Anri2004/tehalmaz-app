import React, { useState, createContext, useContext } from 'react';
import { translations } from '../i18n';

export const LanguageContext = createContext({});
export const useLang = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru'); // русский — по умолчанию
  const toggleLang = () => setLang(v => (v === 'ru' ? 'en' : 'ru'));

  // t('key') — перевод по текущему языку, с откатом на русский, затем на сам ключ.
  const t = (key) => {
    const dict = translations[lang] || translations.ru;
    const val = dict[key];
    if (val !== undefined) return val;
    return translations.ru[key] !== undefined ? translations.ru[key] : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
