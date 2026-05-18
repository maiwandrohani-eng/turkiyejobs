"use client";

import { useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  authT,
  type AuthTranslationKey,
} from "@/lib/i18n/auth-translations";

export function useAuthT() {
  const { locale } = useLanguage();
  return useCallback(
    (key: AuthTranslationKey) => authT(locale, key),
    [locale],
  );
}
