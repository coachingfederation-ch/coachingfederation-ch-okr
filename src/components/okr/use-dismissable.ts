import * as React from "react";

/**
 * Closes a popover when the user clicks outside of it or presses Escape.
 * Shared by the header language and account menus so both behave identically.
 */
export function useDismissable(open: boolean, close: () => void) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return ref;
}

/** Outlined pill used by the header controls on the Deep Blue hero band. */
export const HEADER_PILL =
  "inline-flex h-10 items-center gap-1.5 rounded-full border border-hero-foreground/25 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-hero-foreground transition-colors hover:border-hero-foreground/60 hover:bg-hero-foreground/10";

/** Menu surface shared by both header dropdowns. */
export const HEADER_MENU =
  "absolute right-0 z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-border/70 bg-card py-1 shadow-lg";

/** Menu row inside a header dropdown. */
export const HEADER_MENU_ITEM =
  "flex min-h-11 w-full items-center gap-2 px-4 py-3 text-left text-[11px] font-semibold uppercase leading-5 tracking-wider text-foreground/80 transition-colors hover:bg-muted hover:text-foreground";
