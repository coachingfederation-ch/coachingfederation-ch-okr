import { Link, useRouter } from "@tanstack/react-router";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function TopNav() {
  const { t } = useLocale();
  const router = useRouter();
  const path = router.state.location.pathname;

  const base =
    "inline-flex h-8 items-center rounded-full px-3.5 text-xs font-semibold tracking-wide transition-colors";
  const inactive = "text-hero-foreground/80 hover:text-hero-foreground";
  const active = "bg-card text-primary shadow-sm";

  const isInvolveActive = path === "/";
  const isOkrsActive = path.startsWith("/okrs");
  const isInitiativesActive = path.startsWith("/initiatives");
  const isReportActive = path.startsWith("/report");
  const isPlaygroundActive = path.startsWith("/playground");
  const moreActive = isReportActive || isPlaygroundActive;

  return (
    <nav
      aria-label="Primary"
      className="flex flex-wrap items-center justify-end gap-0.5 rounded-full bg-hero-foreground/10 p-0.5"
    >
      <Link
        to="/"
        className={cn(base, isInvolveActive ? active : inactive)}
        aria-current={isInvolveActive ? "page" : undefined}
      >
        {t("involve.nav")}
      </Link>
      <Link
        to="/okrs"
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

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            base,
            "gap-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            moreActive ? active : inactive,
          )}
          aria-current={moreActive ? "page" : undefined}
        >
          {t("nav.more")}
          <ChevronDown className="size-3.5 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-44 rounded-xl border-border/60 shadow-lg"
        >
          <DropdownMenuItem asChild>
            <Link
              to="/report"
              className={cn(
                "w-full cursor-pointer",
                isReportActive && "font-semibold text-primary",
              )}
            >
              {t("report.nav")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/playground"
              className={cn(
                "w-full cursor-pointer",
                isPlaygroundActive && "font-semibold text-primary",
              )}
            >
              {t("playground.nav")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
