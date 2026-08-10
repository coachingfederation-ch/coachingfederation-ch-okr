import { LOCALES, LOCALE_LABELS } from "@/lib/i18n-shared";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Compact DE · FR · IT · EN switcher used in the hero header of every page.
 * Active locale inverts to blue-on-white so it stays readable on Deep Blue.
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full bg-hero-foreground/10 p-0.5 text-[11px] font-semibold"
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            aria-label={LOCALE_LABELS[l]}
            className={cn(
              "inline-flex h-6 items-center rounded-full px-2.5 uppercase tracking-wider transition-colors",
              active
                ? "bg-card text-primary shadow-sm"
                : "text-hero-foreground/80 hover:text-hero-foreground",
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
