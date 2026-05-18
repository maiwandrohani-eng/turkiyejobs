export type AppLocale = "en" | "tr";

export const LOCALE_STORAGE_KEY = "turkiyejobs:locale";
export const LOCALE_COOKIE_KEY = "turkiyejobs-locale";
export const LEGACY_LOCALE_STORAGE_KEY = "masrjobs:locale";

export function normalizeLocale(raw: string | null | undefined): AppLocale {
  if (raw === "tr" || raw === "ar") return "tr";
  return "en";
}

export function readStoredLocale(): AppLocale {
  if (typeof window === "undefined") return "en";
  try {
    let v = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (!v) {
      v = localStorage.getItem(LEGACY_LOCALE_STORAGE_KEY);
    }
    return normalizeLocale(v);
  } catch {
    return "en";
  }
}

export function writeStoredLocale(locale: AppLocale): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    localStorage.removeItem(LEGACY_LOCALE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function writeLocaleCookie(locale: AppLocale): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE_KEY}=${locale};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function readLocaleCookieFromHeader(cookieHeader: string | null): AppLocale {
  if (!cookieHeader) return "en";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE_KEY}=(en|tr)(?:;|$)`),
  );
  return normalizeLocale(match?.[1]);
}
