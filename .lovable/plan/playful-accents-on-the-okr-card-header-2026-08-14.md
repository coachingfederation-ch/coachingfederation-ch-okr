# Playful accents on the OKR card header

Add subtle Yellow and Light-Blue accents to the objective number and the Strategic-Focus-Area badges in the OKR card header band, so the deep-blue band feels less flat and more tactile. Presentation only — no data, route, i18n or behaviour changes. Palette and fonts stay as they are.

## Changes (all in `src/routes/index.tsx`)

### 1. Objective number badge (line ~569)

Today the number sits in a translucent-white rounded box (`bg-hero-foreground/10`) on the Deep-Blue band — it reads as neutral. Make it the one playful Yellow accent on the band:

- Fill: `bg-accent` (ICF Yellow `#EFCB30`), text `text-hero` (Deep Blue) — 9.4:1 contrast, the highest-contrast pairing on the band and within Yellow's "selective emphasis, never dominant" role (one small badge per card).
- Keep the `h-11 w-11 rounded-2xl` shape and Quicksand bold weight; add a thin `ring-1 ring-hero/10` so it lifts off the blue.
- This is the only Yellow element on the card header, so it stays restrained.

### 2. Strategic-Focus-Area badges — `PillarChip` (line ~333)

Today every SFA badge is an identical white chip with blue text; only the three-letter code carries meaning. Give each a subtle pillar-tinted identity while keeping the code as the non-colour indicator:

- Replace the flat white fill with a low-opacity tint of the badge's own pillar colour: SG → Light Blue, OE → Blue, CE → Deep Blue, each at ~12–15% over the Deep-Blue band (read as a soft coloured chip, not a solid block).
- Add a small 6px leading dot in the full pillar colour before the code, so the pillar hue is legible at a glance even at small sizes.
- Keep the chip border in `--color-chip-active-border` (Light Blue) and the code text in Deep-Blue-on-band / white where contrast needs it; verify DE/FR/IT codes still read clearly.
- The editor "remove" X and the dashed "add" button keep their current styling.

### 3. Restraint guard

- No Yellow anywhere else on the header — only the number badge.
- No new tokens; only existing `--accent`, `--highlight`, `--pillar-*`, `--hero`, `--chip-active-border`.
- Focus ring and hover states preserved.

## PR note

- **Summary** — Adds a Yellow objective-number badge and subtle pillar-tinted SFA badges to the OKR card header for a calmer, more tactile read; presentation only.
- **Changes** — UI only: `src/routes/index.tsx` (objective number badge fill, `PillarChip` tint + leading dot).
- **Backend / schema changes** — None.
- **Testing & verification** — Check `/` signed-out and as editor; confirm all five OKR cards render with correct pillar tints, codes remain legible on Deep Blue, focus rings and hover still work, and DE/FR/IT codes do not clip at tablet and mobile widths.
- **Risks & rollback** — Low; revert the file.
- **Follow-ups** — None.
