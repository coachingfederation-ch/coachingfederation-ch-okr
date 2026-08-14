import * as React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n-shared";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { HEADER_MENU, HEADER_MENU_ITEM, HEADER_PILL, useDismissable } from "./use-dismissable";

/**
 * Locale menu in the hero header. Mirrors the public ICF Switzerland site:
 * an outlined globe pill that opens a compact list of the supported languages.
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  const ref = useDismissable(open, close);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className={HEADER_PILL}
      >
        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
        {locale.toUpperCase()}
        <ChevronDown className="h-3 w-3" aria-hidden="true" />
      </button>
      {open && (
        <ul role="menu" aria-label="Language" className={cn(HEADER_MENU, "min-w-[9rem]")}>
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={l === locale}
                onClick={() => {
                  setLocale(l);
                  close();
                }}
                className={cn(
                  HEADER_MENU_ITEM,
                  l === locale && "bg-muted text-foreground",
                )}
              >
                <span className="w-6 text-primary">{l.toUpperCase()}</span>
                <span className="font-medium normal-case tracking-normal">
                  {LOCALE_LABELS[l]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
