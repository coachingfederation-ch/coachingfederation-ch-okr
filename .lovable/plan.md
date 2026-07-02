# Add ICF Switzerland Charter Chapter logo to hero

Place the uploaded logo top-left of the hero header on the dashboard.

## Steps

1. Register the upload as a Lovable asset (keeps the binary out of the repo):
   - `lovable-assets create --file /mnt/user-uploads/ICF_SwitzerlandCharterChapter_Vertical_RGB_Negative.png --filename icf-switzerland-charter-chapter.png > src/assets/icf-switzerland-charter-chapter.png.asset.json`

2. `src/routes/index.tsx` — in the hero `<header>` (currently starts with `<div className="flex items-center justify-end mb-6">` holding just `<AuthBadge />`), restructure the top row to:
   - Left: `<img>` with the logo asset, `alt="ICF Switzerland Charter Chapter"`, height ~64px, width auto. Since the artwork has significant top/left transparent padding, apply a small negative margin (or `object-contain` in a fixed box) so it visually aligns with the eyebrow/title below.
   - Right: existing `<AuthBadge />`.
   - Layout: `flex items-center justify-between` on that row.

3. No other changes — eyebrow, H1, subhead, and "Add OKR set" button stay as-is.

## Out of scope

- Favicon / og:image swap.
- Logo on the auth page or footer.
- Dark/light variants (the negative/white variant is used on the dark hero only).
