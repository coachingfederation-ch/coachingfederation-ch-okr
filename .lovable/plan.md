# Multilanguage (EN / DE / FR / IT) — shipped

- Header language switcher (EN/DE/FR/IT), browser-detected default, persisted to localStorage.
- Static UI strings translated via a hand-authored dictionary in `src/lib/i18n-strings.ts`.
- All user-entered OKR content (titles, objectives, KRs, initiatives, alignment, pillar summaries) auto-translated on save via Lovable AI Gateway (`google/gemini-2.5-flash-lite`) into the other 3 languages and cached in a `translations` JSONB column per row.
- Existing rows show in their original language until they are next edited/saved (which re-translates them).
