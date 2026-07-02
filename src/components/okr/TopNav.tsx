import { Link } from "@tanstack/react-router";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { t } = useLocale();
  const base =
    "inline-flex h-8 items-center rounded-full px-3.5 text-xs font-semibold tracking-wide transition-colors";
  const inactive = "text-white/80 hover:text-white";
  const active = "bg-white text-primary shadow-sm";

  return (
    <nav
      aria-label="Primary"
      className="inline-flex items-center rounded-full bg-white/10 p-0.5"
    >
      <Link
        to="/"
        activeOptions={{ exact: true }}
        className={cn(base, inactive)}
        activeProps={{ className: cn(base, active) }}
      >
        {t("nav.okrs")}
      </Link>
      <Link
        to="/initiatives"
        className={cn(base, inactive)}
        activeProps={{ className: cn(base, active) }}
      >
        {t("nav.initiatives")}
      </Link>
    </nav>
  );
}
