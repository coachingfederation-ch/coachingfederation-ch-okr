import { TopNav } from "@/components/okr/TopNav";
import { LanguageSwitcher } from "@/components/okr/LanguageSwitcher";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { MobileNavMenu } from "@/components/okr/MobileNavMenu";
import { cn } from "@/lib/utils";

/**
 * Canonical header control cluster shared by every page. Desktop keeps the
 * pill nav + language + account row; below `md` everything collapses into a
 * single menu button so the header stays one compact row on phones.
 */
export function HeaderControls({ className }: { className?: string }) {
  return (
    <>
      <div className={cn("hidden items-center gap-3 md:flex md:flex-wrap md:justify-end", className)}>
        <TopNav />
        <LanguageSwitcher />
        <AuthBadge />
      </div>
      <MobileNavMenu className="md:hidden" />
    </>
  );
}
