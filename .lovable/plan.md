## Problem
The OKRs / Initiative Portfolio toggle uses TanStack Router `Link` with separate `className` and `activeProps.className`. When the route is active, both class strings are concatenated, so the active tab keeps the inactive `text-white/80` utility alongside `text-primary`. Tailwind resolves the white text, rendering the active label as white-on-white and unreadable.

## Goal
Make the toggle behave like the `LanguageSwitcher` component: only one of the two styled states is applied at a time, and the selected tab always shows the brand blue text (`text-primary`) on a white pill.

## Changes
1. Refactor `src/components/okr/TopNav.tsx` to read the current pathname from the router and build the final `className` conditionally, the same way `LanguageSwitcher` uses a ternary for `active ? activeClasses : inactiveClasses`.
2. Keep the existing visual tokens:
   - Active: `bg-white text-primary shadow-sm`
   - Inactive: `text-white/80 hover:text-white`
3. Remove the `activeProps` prop usage to avoid class-string concatenation.
4. Verify both the `/` (OKRs) and `/initiatives` (Initiative Portfolio) tabs show the blue active text on a white background, and the inactive tab remains white text on the dark header.

## Out of scope
- Changing the toggle layout, dimensions, or animation.
- Any other navigation or styling changes.