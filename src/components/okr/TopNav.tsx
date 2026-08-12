import { Link, useRouter } from "@tanstack/react-router";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { t } = useLocale();
  const router = useRouter();
  const path = router.state.location.pathname;

  const base =
    "inline-flex h-8 items-center rounded-full px-3.5 text-xs font-semibold tracking-wide transition-colors";
  const inactive = "text-hero-foreground/80 hover:text-hero-foreground";
  const active = "bg-card text-primary shadow-sm";

  const isOkrsActive = path === "/";
  const isInitiativesActive = path.startsWith("/initiatives");
  const isReportActive = path.startsWith("/report");
  const isPlaygroundActive = path.startsWith("/playground");

  return (
    <nav
      aria-label="Primary"
      className="inline-flex items-center rounded-full bg-hero-foreground/10 p-0.5"
    >
      <Link
        to="/"
        className={cn(base, isOkrsActive ? active : inactive)}
        aria-current={isOkrsActive ? "page" : undefined}
      >
        {t("nav.okrs")}
      </Link>
      <Link
        to="/initiatives"
        className={cn(base, isInitiativesActive ? active : inactive)}
        aria-current={isInitiativesActive ? "page" : undefined}
      >
        {t("nav.initiatives")}
      </Link>
      <Link
        to="/report"
        className={cn(base, isReportActive ? active : inactive)}
        aria-current={isReportActive ? "page" : undefined}
      >
        {t("report.nav")}
      </Link>
    </nav>
  );

}

