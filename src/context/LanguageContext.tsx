"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  HOME_TRANSLATIONS,
  type HomeLocale,
  type HomeTranslationKey,
} from "@/lib/i18n/home-translations";

const STORAGE_KEY = "turkiyejobs:locale";

type LanguageContextValue = {
  locale: HomeLocale;
  setLocale: (locale: HomeLocale) => void;
  toggleLocale: () => void;
  t: (key: HomeTranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): HomeLocale {
  if (typeof window === "undefined") return "en";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "tr" ? "tr" : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<HomeLocale>("en");

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "tr" ? "tr" : "en";
    document.documentElement.dir = "ltr";
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLocale = useCallback((next: HomeLocale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "en" ? "tr" : "en"));
  }, []);

  const t = useCallback(
    (key: HomeTranslationKey) => HOME_TRANSLATIONS[locale][key],
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
