"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SupportedLanguage, TranslationDictionary, translations } from "./translations";

interface LanguageContextType {
  language: SupportedLanguage;
  direction: "ltr" | "rtl";
  isUrdu: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: keyof TranslationDictionary) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  direction: "ltr",
  isUrdu: false,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => translations.en[key] || String(key),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("leadrescue_lang") as SupportedLanguage;
      if (saved && (saved === "en" || saved === "ur")) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === "ur" ? "rtl" : "ltr";
      }
    } catch {
      // Storage access blocked or unavailable
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("leadrescue_lang", lang);
    } catch {
      // Storage blocked
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "ur" : "en";
    setLanguage(nextLang);
  };

  const direction = language === "ur" ? "rtl" : "ltr";
  const isUrdu = language === "ur";

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isUrdu,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  return useContext(LanguageContext);
}
