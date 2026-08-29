# Compact mobile navigation

## Goal

On phones the header currently wraps into three stacked rows: logo, the pill nav (Get involved / OKRs / Initiative Portfolio / More), the language pill, and the account pill. Replace that with a single tidy row — logo on the left, one menu button on the right — that opens a slide-in panel containing every page link, the language choice, and the account actions.

Desktop and tablet keep exactly the layout they have today.

## What changes

**Mobile (below the md breakpoint)**

- Header becomes one row: logo (slightly smaller) + a single round menu button in ICF Deep Blue styling, matching the existing outlined header pills.
- Tapping it opens a slide-in panel from the right with:
  - Page links: Get involved, OKRs, Initiative Portfolio, Aspira Voice, Board report, OKR Playground — the current page marked as active in blue.
  - Language row: DE · FR · IT · EN, selected one highlighted.
  - Account: e-mail, Access directory (admins only), Sign out — or a "Sign in" action when signed out.
- Panel closes on link tap, on Escape, and on backdrop tap. All rows at least 44px tall, visible keyboard focus, reduced-motion respected.

**Desktop (md and up)**

- Unchanged: pill nav, globe language pill, account pill in the same cluster.

**Every page**

The identical header cluster is currently repeated in Home, OKRs, Initiative Portfolio, initiative detail, Board report, Playground, Voice, and the Style guide. It gets consolidated into one shared header-controls component so all pages compact the same way and stay in sync in future.

## Technical notes

- New `src/components/okr/HeaderControls.tsx`: renders the existing `TopNav` + `LanguageSwitcher` + `AuthBadge` cluster at `md:` and up (`hidden md:flex`), and a `MobileNavMenu` below that (`md:hidden`).
- New `src/components/okr/MobileNavMenu.tsx`: shadcn `Sheet` (side `right`), reusing existing tokens — `bg-hero`/`hero-foreground` surface, Quicksand section labels, `HEADER_MENU_ITEM`-style rows. Nav targets and labels come from the same `t()` keys `TopNav` already uses; language items from `LOCALES`/`LOCALE_LABELS` and `useLocale`; account state from `useAuth` with the same sign-out flow as `AuthBadge` (cancel queries, clear cache, `supabase.auth.signOut`, navigate home).
- Route files swap the three-component cluster for `<HeaderControls />`. No route, data, i18n-string, or auth logic changes; `report.tsx` print rules still hide the chrome (the sheet trigger is inside the same `print:hidden` header).
- Style guide's header section updated to document `HeaderControls` as the canonical cluster.

## PR note

- **Summary** — Collapses the repeated header cluster into a shared component and gives it a single-button hamburger presentation on mobile, so phone headers are one row instead of three.
- **Changes** — UI only: new `HeaderControls` and `MobileNavMenu` components; 8 route files updated to use them; style-guide header docs updated.
- **Backend / Schema Changes** — None.
- **Testing & Verification** — Check at 393px and 1280px on Home, OKRs, Initiative Portfolio, Report, Playground, Voice; signed out, signed in as editor, and signed in as admin (Access directory row); language switch from the panel; keyboard-only open/close; print preview of `/report` still free of chrome.
- **Risks & Rollback** — Low blast radius, presentation only. Revert the two new files and the header lines in the routes.
- **Follow-ups** — None planned; the shared component makes future header changes single-site.
