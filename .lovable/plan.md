# Accessibility findings review

## 1. Viewport meta — false positive, no change

`src/routes/__root.tsx` already sets:

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

No `maximum-scale`, no `user-scalable=no`. This is exactly the markup the checker cites as passing. The finding is a false positive — leave as is.

## 2. `.rounded-4 > .flex-1` landmark warning — injected badge, not our code

- `rounded-4` is not a class we use anywhere in `src/` (Tailwind's scale is `rounded-sm/md/lg/xl/2xl/3xl/full`, not `rounded-4`).
- Our page content is already wrapped in proper landmarks:
  - `/` → `<main>` in `src/routes/index.tsx:1008` with `<header>`, `<section>` regions.
  - `/initiatives` → `<main>` in `src/routes/initiatives.tsx:230` with `<header>`, `<section>` regions.
  - `<nav>` provided by `src/components/okr/TopNav.tsx`.
- The failing element is the **"Edit with Lovable" branding badge** that Lovable injects on the published site. It renders outside our `<main>` and uses its own class names (`rounded-4`, `flex-1`). We can't edit that markup.

### Options for #2

1. **Do nothing.** The badge is a known third-party overlay; most auditors accept ignoring it. Recommended.
2. **Hide the Lovable badge** on the published site via Publish settings (requires a paid plan on some tiers). Once hidden, the `.rounded-4 > .flex-1` element disappears and the checker will pass.

## Recommendation

No code changes. Re-run the checker after hiding the Lovable badge if you want a clean report, otherwise both findings can be safely dismissed as false positives / third-party markup.
