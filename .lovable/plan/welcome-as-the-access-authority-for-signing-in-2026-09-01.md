# Welcome as the access authority for signing in

## What is true today

Both apps sign people in with Google. So the identity behind a login here and a
login in Welcome is already the same account and the same email address — there
is no second password, no second identity to reconcile. What differs is only
this: today the dashboard lets *anyone* with a Google account sign in and see a
read-only view, and the Welcome membership decides afterwards whether the person
may edit.

This plan closes that gap so the Welcome app becomes the authority for access,
not just for edit rights.

## What changes for the user

- Signing in is only possible for people the Welcome app knows as editors or
  admins. Anyone else is signed out again immediately with a clear message
  ("Your ICF Switzerland Welcome account doesn't have editing access yet"),
  in DE/FR/IT/EN.
- The dashboard itself stays fully readable without signing in, exactly as now —
  the restriction applies to the login, not to the public content.
- The sign-in screen says plainly that access comes from ICF Switzerland Welcome,
  so nobody wonders which account to use.
- Before deciding, the app refreshes the Welcome directory rather than trusting a
  possibly hour-old mirror, so someone made editor in Welcome minutes ago can sign
  in here right away.
- Losing editor rights in Welcome ends editing access here on the next sign-in or
  page load, as it does today.

## Why not a separate Welcome login button

Federating this app's login to the Welcome app as an identity provider is not
something Lovable Cloud auth supports: it accepts Google, Apple, Microsoft and
SAML as external identity providers, not another Lovable project. Building it by
hand would mean running an OAuth server in Welcome and minting sessions here from
its tokens — a large custom auth surface with real security risk, and no user
benefit, because both apps already resolve to the same Google account. The plan
above gives the outcome that was asked for (Welcome decides who gets in) on a
supported path.

## Technical notes

- `applyRolesForUser` (`src/lib/access.server.ts`) gains a forced directory
  refresh when the signed-in email has no directory entry, before returning null,
  so a fresh Welcome editor is not told to go away because of the hourly cache.
- A new server function `resolveMyAccess` (or an extension of `applyMyRoles`)
  returns `{ role, allowed }`. `AuthProvider` (`src/lib/auth-context.tsx`) signs
  the user out via `supabase.auth.signOut()` when `allowed` is false and surfaces
  a rejection reason instead of a silent read-only session.
- `/auth` renders that rejection state, with the Welcome-account explanation and
  the four translations added to `src/lib/i18n-strings.ts`.
- No schema change: `role_directory`, `role_overrides` and `user_roles` stay as
  they are, as do all RLS policies.
- Sign-in stays `lovable.auth.signInWithOAuth("google", …)`; no provider change.

## PR note

**Summary** — Make the ICF Switzerland Welcome directory the authority for who
may sign in to the dashboard, not only for who may edit, without changing the
identity provider (Google) or any public content.

**Changes**
- Auth: reject sign-ins whose email is unknown to the Welcome directory; sign the
  session out and show a translated explanation on `/auth`.
- Access: force a directory refresh on an unknown email before rejecting.
- i18n: new EN/DE/FR/IT strings for the rejection and the Welcome-account hint.

**Backend / schema changes** — None.

**Testing & verification** — Sign in as a directory admin (edit controls appear),
as a directory editor, and as a Google account absent from the directory
(rejected with the message, public pages still fully readable signed out).
Confirm `/access` sync still works and that a newly added Welcome editor can sign
in without waiting for the hourly refresh.

**Risks & rollback** — Blast radius is the sign-in path only. Main risk is
locking out a legitimate person whose Google address differs from their Welcome
address; `role_overrides` already covers that and stays the remedy. Rollback is a
code revert; no migration to undo.

**Follow-ups / known debt** — Rejection currently happens after the Google round
trip rather than before it; a pre-check is not possible without exposing the
member list publicly. Directory freshness still relies on sign-in traffic rather
than a schedule.
