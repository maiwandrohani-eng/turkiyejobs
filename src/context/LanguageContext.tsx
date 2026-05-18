"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import {
  HOME_TRANSLATIONS,
  type HomeTranslationKey,
} from "@/lib/i18n/home-translations";
import {
  type AppLocale,
  readStoredLocale,
  writeLocaleCookie,
  writeStoredLocale,
} from "@/lib/i18n/locale";

export type HomeLocale = AppLocale;

type LanguageContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
  t: (key: HomeTranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyDocumentLocale(locale: AppLocale) {
  document.documentElement.lang = locale === "tr" ? "tr" : "en";
  document.documentElement.dir = "ltr";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<AppLocale>("en");
  const skipRefresh = useRef(true);

  useLayoutEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    applyDocumentLocale(stored);
    writeLocaleCookie(stored);
  }, []);

  useEffect(() => {
    writeStoredLocale(locale);
    writeLocaleCookie(locale);
    applyDocumentLocale(locale);
    if (skipRefresh.current) {
      skipRefresh.current = false;
      return;
    }
    startTransition(() => router.refresh());
  }, [locale, router]);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "en" ? "tr" : "en"));
  }, []);

  const t = useCallback(
    (key: HomeTranslationKey) => {
      const table = HOME_TRANSLATIONS[locale];
      const value = table[key];
      if (value !== undefined) return value;
      return HOME_TRANSLATIONS.en[key] ?? key;
    },
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
