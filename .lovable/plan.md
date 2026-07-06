## Goal
On each Key Result, also surface the initiatives that reference it as a **secondary** KR (their primary lives on another KR). The counter on the KR card and the count in the KR detail sheet must reflect primary + secondary together.

## Changes (all in `src/routes/index.tsx`, plus one string key)

### 1. Build a secondary-initiatives lookup
In the top-level `Dashboard` component (where `data: DashboardDTO` is read), compute once with `useMemo`:

```ts
// Map<kr_id, InitiativeDTO[]> — initiatives whose secondary_kr_ids include this kr
const secondaryByKr = useMemo(() => {
  const m = new Map<string, InitiativeDTO[]>();
  for (const s of data.okr_sets)
    for (const k of s.key_results)
      for (const it of k.initiatives)
        for (const sid of it.secondary_kr_ids ?? [])
          (m.get(sid) ?? m.set(sid, []).get(sid)!).push(it);
  return m;
}, [data]);
```

Pass `secondaryByKr` down through `OkrArticle` → `KrCard` / `KrDetailSheet` (new prop on each).

### 2. `KrCard` — counter
Replace:
```ts
const count = kr.initiatives.length;
```
with:
```ts
const secondary = secondaryByKr.get(kr.id) ?? [];
const count = kr.initiatives.length + secondary.length;
```

### 3. `KrDetailSheet` — related list + header count
- Header count: use `kr.initiatives.length + secondary.length` instead of `kr.initiatives.length`.
- After the primary rows in the `<tbody>`, render one row per secondary initiative. These are **read-only** here (no edit / no delete button), because the initiative belongs to another KR. Show them with:
  - the same text cell (non-editable, plain `pickTranslation(it, "text", it.text, locale)`)
  - a small chip on the right showing where it comes from, e.g. `2.a` (owning OKR number + owning KR label), styled like the existing `bg-primary/10 text-primary` chip
  - the empty-state row now checks `kr.initiatives.length + secondary.length === 0`.

To render the chip, look the initiative's owning OKR/KR up from `dashboard.okr_sets` (already available via the new prop chain — pass `dashboard` alongside `secondaryByKr`, or precompute a `Map<initiativeId, {okrNumber, krLabel}>` at the same place as `secondaryByKr` and pass that instead — preferred, avoids a nested loop per row).

### 4. i18n
Add one string key used as an aria/tooltip label on the "secondary" chip, e.g. `initiative.secondaryFrom` → `"Secondary — from OKR {n}, KR {kr}"` (EN/DE/FR/IT), interpolated at render.

## Out of scope
- No changes to the edit dialog, mutations, or server functions.
- Secondary rows stay read-only in this view; to change them the user still opens the initiative on its owning KR.
