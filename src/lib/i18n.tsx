import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isLocale, LOCALES, type Locale, type TranslationsMap } from "./i18n-shared";
import { STRINGS, type StringKey } from "./i18n-strings";

const STORAGE_KEY = "icfs.locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  const nav = window.navigator?.language ?? "en";
  const primary = nav.toLowerCase().split(/[-_]/)[0];
  return (LOCALES as readonly string[]).includes(primary) ? (primary as Locale) : "en";
}

type LocaleCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: StringKey) => string;
};

const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Start with "en" for SSR/first paint parity, then hydrate to the detected
  // locale on the client. Avoids SSR/client markup mismatches.
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const detected = detectInitialLocale();
    if (detected !== locale) setLocaleState(detected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: StringKey) => STRINGS[locale][key] ?? STRINGS.en[key] ?? key,
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale(): LocaleCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLocale must be used inside <LocaleProvider>");
  return v;
}

/**
 * Pick the best translation for `field` on a row.
 * Rules:
 * - When the row's source language matches the UI locale (or when no explicit
 *   source_lang is set), return the original column value.
 * - Otherwise, return translations[locale][field] if present; fall back to the
 *   original value.
 */
export function pickTranslation(
  row: { translations?: TranslationsMap | null; source_lang?: string | null },
  field: string,
  fallback: string,
  locale: Locale,
): string {
  const source = (row.source_lang ?? "en") as Locale;
  if (locale === source) return fallback;
  const t = row.translations?.[locale]?.[field];
  if (typeof t === "string" && t.trim().length > 0) return t;
  return fallback;
}
