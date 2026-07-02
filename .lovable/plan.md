# Accessibility fixes

Fix the issues surfaced in the audit. Scope: presentation only, no data/logic changes.

## Critical

1. **`src/components/okr/EditableText.tsx` — preserve heading semantics.**
   When `Tag` is a heading (`h1|h2|h3`), do NOT put `role="button"` on it (breaks the heading role). Render the heading as-is and wrap the click/keyboard affordance on an inner `<span role="button" tabIndex={0}>`. For non-heading tags keep current behavior.

2. **`src/routes/index.tsx` `KrCard` (~line 544) — no block content inside `<button>`.**
   Convert the outer `<button>` to a `<div>` styled the same, and place a focusable, keyboard-activatable trigger inside — either an absolutely-positioned `<button className="absolute inset-0" aria-label={`Open KR ${kr.kr}: ${kr.text}`}>` overlay (stretched-link pattern) with the visible content behind it, or keep the visible content and wrap only the interactive affordance. Prefer the stretched-link pattern so the whole card remains clickable while the DOM stays valid. Ensure hover/focus styles still apply via `:focus-within` / `has-[:focus-visible]`.

3. **`src/routes/index.tsx` `ContribCell` (~line 798) — give dots a text alternative.**
   - Add `aria-label={`${row.pillar} → ${col.toUpperCase()}: ${value} contribution`}` on the button (edit mode) and on the wrapper span (read mode use `aria-label` on a `<span role="img">` or a visually-hidden `<span className="sr-only">`).
   - Keep dots as decorative (`aria-hidden`).

4. **`src/routes/index.tsx` pillar cards (~line 985) — fix heading level.**
   Change `EditableText as="h3"` to `as="h2"` for pillar labels so the order is h1 → h2 (pillars) → h2 (OKR sets). Inside each OkrCard, the KR sheet already uses `SheetTitle` (Radix handles level), so no change there.

## Warnings

5. **`src/routes/index.tsx` `PillarChip` (~line 270) — replace `title` with `aria-label`.**
   `aria-label={`${code} — ${PILLAR_NAMES[code]}`}` on the outer `<span>` (add `role="img"` since it's a labelled chip). Keep the visible code text.

6. **`src/routes/__root.tsx` — remove duplicate meta description.**
   Delete the second `{ name: "description", … }` at line 91 (keep line 84). The `og:description` / `twitter:description` on lines 92–93 stay.

7. **`src/routes/index.tsx` & `src/routes/auth.tsx` — swap `min-h-screen` → `min-h-dvh`** on the outer `<main>` for correct mobile viewport height.

## Out of scope

- Replacing `confirm()` with a Radix AlertDialog (UX, not a11y blocker).
- Color-token contrast sweep (using shadcn tokens; no reported failure).
- KR "Open details →" hover-only reveal — keyboard users see it via `group-focus-within:opacity-100`; add that class alongside `group-hover:opacity-100` in the KrCard rework.

## Verification

- Read the modified files after edits to confirm no duplicate imports / JSX imbalance.
- `tsgo` typecheck (already run by harness).
- Spot-check in preview: focus a KR card with Tab, activate with Enter → sheet opens.
