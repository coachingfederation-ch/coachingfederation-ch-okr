Update the homepage hero to extend the blue background further down and add the section title "ICF Strategic Focus Areas (SFAs)" above the three pillar cards.

Changes:
1. In `src/routes/index.tsx`:
   - Increase the hero header's bottom padding so the blue area fills the space behind the pillar cards (currently `pb-14`, likely move to `pb-24` or `pb-28`).
   - Add a heading "ICF Strategic Focus Areas (SFAs)" inside the hero section, above the pillar cards grid, using the existing hero-foreground color (white).
   - Keep the pillar cards in their overlapping negative-margin section unchanged.
2. In `src/lib/i18n-strings.ts`:
   - Add a new string key `hero.pillarTitle` to `StringKey`.
   - Provide translations for all four locales:
     - EN: "ICF Strategic Focus Areas (SFAs)"
     - DE: "ICF Strategic Focus Areas (SFAs)" (or German equivalent if preferred)
     - FR: "Zones stratégiques de focus de l'ICF (SFAs)"
     - IT: "Aree di focus strategiche ICF (SFAs)"
3. Build and verify the visual result in the preview.

Technical notes:
- Uses existing Tailwind tokens and semantic hero colors (`bg-hero`, `text-hero-foreground`).
- No backend or data changes required.
- Keeps the existing card overlap behavior (`-mt-8`) intact.