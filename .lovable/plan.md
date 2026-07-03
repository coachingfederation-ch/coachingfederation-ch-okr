# Plan

## Goal
Apply two visual edits to the homepage:
1. Reduce the vertical space between the "ICF Strategic Focus Areas (SFAs) 2026" title and the three pillar cards.
2. Add a new section title "ICF Switzerland OKR Sets" above the OKR card list.

## Current state
- `src/routes/index.tsx` renders the hero title with `mt-16` (inside the blue header, just above the cards).
- The pillar cards sit in the next `<section>` with `-mt-8`, overlapping the hero.
- The OKR card list currently starts with `py-12` and has no section heading.
- All UI strings live in `src/lib/i18n-strings.ts` with translations for EN/DE/FR/IT.

## Changes

### 1. Tighten title-to-card spacing
File: `src/routes/index.tsx`
- Reduce the title's top margin from `mt-16` to `mt-8` (or similar) so the title sits closer to the cards while keeping the expanded blue hero area intact.

### 2. Add OKR Sets section title
Files:
- `src/lib/i18n-strings.ts`: add a new string key `section.okrSets` with translations:
  - EN: "ICF Switzerland OKR Sets"
  - DE: "ICF Switzerland OKR Sets"
  - FR: "OKR Sets ICF Suisse"
  - IT: "OKR Sets ICF Svizzera"
- `src/routes/index.tsx`: insert an `<h2>` above the OKR set map using `t("section.okrSets")`, styled consistently with other section headings (e.g., `text-2xl font-bold tracking-tight md:text-3xl`).

## Verification
- Run `bun run build` to confirm TypeScript and i18n key references are valid.
- Visually verify the preview: less gap under the SFA title, and the new OKR Sets title appears above the first OKR card.
