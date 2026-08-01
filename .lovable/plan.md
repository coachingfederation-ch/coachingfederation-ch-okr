# Visual alignment with the ICF Switzerland website

Bring the OKR dashboard onto the same visual system as the public chapter site — official ICF palette, Quicksand + Plus Jakarta Sans, calmer surfaces — without touching routes, data, i18n, auth, or any component behaviour.

## What I verified first

- The dashboard's `src/styles.css` currently uses a lavender/indigo/teal palette (`--background` soft lavender, `--accent` teal) and loads **Inter + JetBrains Mono from Google Fonts** via a `<link>` in `src/routes/__root.tsx`. Quicksand and Plus Jakarta Sans are not present in this project.
- The public site project already self-hosts both families as variable WOFF2 files in `public/fonts/` (`quicksand-variable.woff2`, `plus-jakarta-sans-variable.woff2`, plus the Quicksand OFL licence) and defines a full ICF token set in its own `styles.css`, converted from the brand HEX values to OKLCH.
- Both projects use the **same semantic token names** — `--hero`, `--pillar-sg/oe/ce`, `--chip`, `--chip-active-border` — so focus-area meaning carries over by remapping values, with no component rewiring.
- The dashboard is missing a few tokens its components reference indirectly (`--popover`, `--secondary`, `--destructive`); a past bug ("translucent list") was worked around because `bg-popover` was undefined.

## Approach

Almost all of this lands in one file: `src/styles.css`. Component files are touched only where a hardcoded colour or font bypasses the tokens.

### 1. Self-host the fonts, drop Google Fonts

- Copy `quicksand-variable.woff2`, `plus-jakarta-sans-variable.woff2` and `Quicksand-OFL.txt` from the chapter-site project into `public/fonts/`.
- Add the two `@font-face` rules (variable ranges, `font-display: swap`) at the top of `src/styles.css`.
- Set `--font-sans` / `--font-body` to Plus Jakarta Sans and `--font-heading` / `--font-display` to Quicksand; base layer applies body to `body` and Quicksand to `h1–h4`.
- Remove the `fonts.googleapis.com` / `fonts.gstatic.com` preconnects and stylesheet link from `src/routes/__root.tsx`. This also removes a render-blocking external request, helping the FCP score raised earlier.

### 2. Remap the colour tokens to the official palette

Port the chapter site's `:root` values verbatim so the two products share exact colours:

| Token | Role | Brand colour |
| --- | --- | --- |
| `--background` | warm page background | Bone `#F8F0E4` |
| `--foreground`, `--hero` | text, header/footer surface | Deep Blue `#212251` |
| `--primary`, `--chip-foreground` | brand, links, primary actions | Blue `#2B379B` |
| `--highlight`, `--ring`, `--chip-active-border` | selected states, focus rings | Light Blue `#5778FA` |
| `--accent` | selective emphasis only | Yellow `#EFCB30` |
| `--card` | content surfaces | White |

Focus-area indicators keep their tokens and meaning, restated in blues: SG → Light Blue, OE → Blue, CE → Deep Blue. Because those three differ mainly in lightness, each badge keeps its existing SG/OE/CE abbreviation as the non-colour indicator, and I'll confirm the selected/inactive/hover states stay distinguishable without relying on hue alone.

Also add the missing `--popover`, `--secondary`, `--destructive` tokens and register them in `@theme inline`, then remove the `bg-background` + `z-[60]` workaround in the secondary-KR picker only if it renders correctly on the real token.

### 3. Surface and typography pass

Scoped, token-level adjustments — no layout or structural changes:

- Replace the repeated inline `shadow-[0_1px_2px_rgba(20,20,60,...)]` strings with a single `--shadow-soft` token (same values, ICF-tinted) so cards read as flat/subtly elevated rather than floating.
- Cards sit on Bone with a defined border; keep existing radii, keep pills only for chips, filters and statuses.
- Hierarchy in the OKR card via weight/size/line-height/tracking: objective title in Quicksand at the strongest level, steward/customer/metadata in small Plus Jakarta uppercase labels, key results and initiative counts in body type. No content, ordering or count changes.
- Header keeps Deep Blue; nav and language toggles keep their current active/inactive logic, restyled so the active state reads as Blue-on-White and the inactive as legible white-on-Deep-Blue.

### 4. Sweep for hardcoded colours

Search the OKR/initiative components, dialogs and `style-guide.tsx` for literal `bg-white`, `text-white`, `slate-*`, `emerald-*` and hex values, and route them through tokens. The initiative Kanban status colours (planned/in progress/done/canceled) stay semantically distinct — status also carries its text label, so colour is never the sole indicator.

### 5. Style guide page

`/style-guide` is updated to document the new palette, the two fonts and the revised surfaces, so it stays the canonical reference. No new component variants are added.

## PR note

**Summary** — Remaps the OKR dashboard's global design tokens and typography to the official ICF Switzerland visual system (Deep Blue / Blue / Light Blue / Yellow / Bone / White, Quicksand + Plus Jakarta Sans), matching the public chapter website. Visual only.

**Changes**
- Styles: `src/styles.css` — self-hosted `@font-face` rules, ICF OKLCH palette, added popover/secondary/destructive tokens, `--shadow-soft`.
- Assets: three font files added to `public/fonts/`.
- Root: `src/routes/__root.tsx` — Google Fonts links removed.
- Components: hardcoded colour utilities in OKR/initiative components swapped for tokens; `style-guide.tsx` refreshed.

**Backend / schema changes** — None.

**Testing & verification** — All routes load; language switching across DE/FR/IT/EN; signed-out and edit-capable states; OKR detail, KR detail, new/edit initiative sheets and the KR link picker all open and scroll; console clean; `bunx tsgo --noEmit`, lint and build run; desktop, tablet and mobile widths screenshotted; contrast checked for body, muted text, links, buttons, badges, focus rings and status dots on Deep Blue, Blue, Bone, Yellow and White.

**Risks & rollback** — Blast radius is global styling, so a bad token affects every page; no data or schema risk. Revert by restoring `src/styles.css` and the `__root.tsx` head links.

**Follow-ups / known debt** — Dark mode is not defined in this project and stays out of scope. The `.dark` block on the chapter site is not ported.
