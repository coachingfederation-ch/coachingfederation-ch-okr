# Shared roles with "ICF Switzerland Welcome"

## What is possible

The two apps are separate Lovable projects with separate backends, so they cannot literally share one login: a Google sign-in here creates a user in this project's user store, not the Welcome project's. What they do share is the person's **email address** (both use Google sign-in).

So the workable model is: **Welcome stays the source of truth for who is an Editor or Admin; this OKR app mirrors that list by email and grants edit rights accordingly.** Sign-in stays local; permissions come from Welcome.

Confirmed from both projects:
- Welcome holds `members` (with email) and `user_roles` with roles including `admin`, `editor`, `administrator`, `member`.
- This app has its own `user_roles` table (`editor`, `admin`) plus a `has_role` function, but edit rights today are decided purely by the `@coachingfederation.ch` email domain, both in the app (`auth-context`) and in a database trigger that auto-grants `editor` on signup.

## Decisions taken

- Approach: mirror roles by email.
- Editors and Admins from Welcome get edit rights here (Welcome `admin`/`administrator` → `admin`, `editor` → `editor`; all other roles → read-only).
- The `@coachingfederation.ch` domain restriction is replaced by role-based access.

## What gets built here

1. **Mirror table** `role_directory` — one row per person: email, mapped role (`editor` / `admin`), last synced timestamp. Server-only access; no browser reads.
2. **Sync server function** — calls a secured endpoint on the Welcome project, receives the list of `{ email, roles }`, and replaces the mirror contents. Triggered manually by an admin from a small "Access" panel, and on a schedule.
3. **Role resolution on sign-in** — when a user signs in, a server function looks up their email in the mirror and writes the matching row into this project's `user_roles`. Rows disappear from `user_roles` when the person is no longer an Editor/Admin in Welcome.
4. **Replace the domain rule** — `canEdit` in the auth context becomes "has `editor` or `admin` in `user_roles`" instead of "email ends in coachingfederation.ch". The database trigger that auto-grants `editor` to any `@coachingfederation.ch` signup is removed, and the write policies that currently rely on the domain are moved onto `has_role`.
5. **Signed-in-but-no-role state** — a clear, friendly read-only message instead of a silent failure, so people who sign in without an Editor role understand why they cannot edit.
6. **Access panel** (admins only) — shows the mirrored directory, last sync time, and a "Sync now" button.

## What must happen in the Welcome project

This half cannot be built from here. In the Welcome project we need one small addition:

- A public API route (e.g. `/api/public/role-directory`) protected by a shared secret header, returning `[{ email, roles: [...] }]` for members holding `editor` / `admin` / `administrator`.
- The same shared secret stored in both projects.

Once that endpoint exists, the sync here works without further changes there.

## Technical notes

- Mirror table with `GRANT` to `service_role` only, RLS enabled, no `anon`/`authenticated` policies; all access through server functions.
- Sync and role-application run as `createServerFn` handlers; the shared secret is read from `process.env` inside the handler.
- Role application uses the service-role client after verifying the caller's own session (`requireSupabaseAuth`), so a user can only ever provision their own roles.
- Scheduled refresh via `pg_cron` calling the sync route on the stable preview/production URL.
- Emails compared lowercased and trimmed on both sides.

## PR note

**Summary** — Replace the email-domain edit rule in the OKR dashboard with role-based access mirrored by email from the ICF Switzerland Welcome project, so Editors and Admins are managed in one place.

**Changes**
- UI: read-only state for signed-in users without a role; admin-only Access panel with directory list and "Sync now".
- Auth: `canEdit` derived from `user_roles` instead of email domain.
- Server: role-directory sync function; per-user role application on sign-in.

**Backend / Schema Changes** — New `role_directory` table (service-role only, RLS on); drop `grant_editor_on_signup` trigger and function; update write policies on OKR tables to use `has_role`; new shared-secret env value; `pg_cron` schedule for periodic sync.

**Testing & Verification** — Verify: an Editor in Welcome can edit here after sign-in; a member without a role sees read-only; role removal in Welcome removes edit rights after sync; a non-`coachingfederation.ch` Editor can now edit; sync failure leaves the last-known mirror intact.

**Risks & Rollback** — Main risk is an access outage if the mirror is empty when the domain rule is removed; mitigation is to run a first successful sync before switching the rule, and to keep an admin bootstrap row. Rollback restores the domain-based trigger and policies.

**Follow-ups / Known Debt** — Direction is one-way (Welcome → OKR). No cross-project single sign-on; users still sign in separately per app. Sync interval means role changes take effect with a short delay.
