Add a dedicated "Secondary Initiatives" titled section in the KR detail sheet, separating secondary initiatives from the primary related-projects table.

Changes
1. i18n strings (`src/lib/i18n-strings.ts`)
   - Add `section.secondaryInitiatives` key.
   - Translations:
     - EN: "Secondary Initiatives"
     - DE: "Sekundäre Initiativen"
     - FR: "Initiatives secondaires"
     - IT: "Iniziative secondarie"

2. KR detail sheet (`src/routes/index.tsx`)
   - Render primary initiatives in the existing table (unchanged).
   - When `secondaryInitiatives.length > 0`, add a second table below the primary one with:
     - A `<SectionLabel>` heading `t("section.secondaryInitiatives")`.
     - Same table structure as the primary table (initiative column + optional edit column for alignment).
     - Each row shows the origin chip and the translated initiative text, read-only (no edit/delete controls).
   - Remove the inline rendering of secondary rows from the primary table so they appear only under the new section.
   - Keep the overall counter in the primary section header showing `primary + secondary` total.
   - Empty state stays in the primary table when there are zero initiatives of either kind.