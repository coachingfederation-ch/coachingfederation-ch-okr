# Multilanguage support (EN / DE / FR / IT)

Auto-detect browser language, header switcher, AI-translated UI + all OKR content.

## 1. Locale infrastructure (client)

- New `src/lib/i18n.tsx`: `LocaleProvider`, `useLocale()` returning `{ locale, setLocale, t }`.
- Supported locales: `en | de | fr | it`. Detect from `navigator.language` on first load (fallback `en`). Persist choice to `localStorage['icfs.locale']`.
- Set `<html lang={locale}>` via a `useEffect` in the provider.
- Static UI dictionary in `src/lib/i18n-strings.ts` — a typed `Record<Locale, Record<StringKey, string>>` covering every visible label (header, buttons, section titles, empty states, sheet labels, toasts). Hand-authored translations (small scope, ~40 keys).
- Header switcher: 4 pill buttons `EN | DE | FR | IT` in the hero top row next to `AuthBadge`.

## 2. Content translation schema (DB)

Add per-row translations without touching original columns.

- Add `translations JSONB DEFAULT '{}'::jsonb` and `source_lang TEXT DEFAULT 'en'` to:
  `okr_sets`, `key_results`, `initiatives`, `alignment_rows`, `pillar_summaries`.
- `translations` shape: `{ de: {field1: "...", field2: "..."}, fr: {...}, it: {...} }` (only non-source locales; source is always the original column value).
- Reuse existing RLS/GRANTs (columns inherit table-level policies).

Translatable fields per table:
- `okr_sets`: title, role_name, customer, objective, alignment
- `key_results`: text, target, lead
- `initiatives`: text
- `alignment_rows`: pillar, how
- `pillar_summaries`: label, description

## 3. Translation service (server)

- New Supabase Edge Function `translate-content` (Lovable AI, `google/gemini-3-flash-preview`, `generateText` + `Output.object`). Input: `{ sourceLang, targetLangs, fields: Record<string, string> }`. Output: `{ [lang]: { [field]: string } }`. Prompt: professional business translator, preserve tone, keep proper names, do not translate acronyms (ICF, OKR, KR, SG, OE, CE).
- Called from within TanStack server functions (`src/lib/okr.functions.ts`) after every write that touches translatable fields. Steps in each mutation:
  1. Persist original into existing columns + set `source_lang = payload.sourceLang` (client sends current UI locale).
  2. Diff which translatable fields actually changed (skip translation when nothing changed).
  3. Call `translate-content` for the 3 non-source langs, merge result into `translations` JSONB, write back.
- Failure of the translate step must not fail the write — log + continue; translations can be regenerated later.

Server functions to update:
- `updateOkrSet`, `addOkrSet` (seed defaults get translated once), `updateKeyResult`, `addKeyResult`, `updateInitiative`, `addInitiative`, `updateAlignmentRow`, `updatePillarSummary`.
- Add `sourceLang` to each input schema (`okr-schemas.ts` Zod schemas).

## 4. Rendering (client)

- New helper `pickTranslation(row, field, locale) → string` in `src/lib/i18n.tsx`: returns original column when `locale === row.source_lang`, else `row.translations?.[locale]?.[field] ?? row[field]` (fallback to original).
- Update `src/routes/index.tsx`:
  - Replace hardcoded English UI strings with `t("...")`.
  - Replace direct `set.title` / `kr.text` / etc. reads with `pickTranslation(...)`.
  - `EditableText`: when saved, the current value is treated as new source in `locale`. The mutation includes `sourceLang: locale`, so the server re-translates and updates `source_lang` accordingly.
  - The static `PILLAR_NAMES` map moves into the string dictionary.

## 5. DTO/types

- Extend DTO types in `src/lib/okr-schemas.ts` with `translations?: Record<Locale, Record<string,string>>` and `source_lang?: Locale`.
- Regenerate/update `getDashboard` server fn to select the new columns.

## 6. Auth page

- Translate the 3 visible strings ("Sign in to edit", subtitle, button).

## Out of scope

- Auto-translating existing rows in the DB (users can trigger by re-saving; a one-shot backfill script can be added later on request).
- Language-specific SEO metadata (single `<html lang>` per session is enough for MVP).
- Per-user saved preference (localStorage covers the requirement).
- RTL languages.

## Rollout order

1. Migration (schema additions).
2. Edge function `translate-content`.
3. Server-fn changes + schema updates.
4. Client `LocaleProvider`, dictionary, switcher.
5. Wire `t()` + `pickTranslation` throughout `index.tsx` and `auth.tsx`.
