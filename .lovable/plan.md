# Reuse ICF Switzerland Welcome for sign-in

## Best approach, in short

Welcome cannot act as a login provider for this dashboard — the platform accepts
Google, Apple, Microsoft and SAML as sign-in providers, not another Lovable
project. Building that by hand would mean running a custom login server inside
Welcome and issuing sessions here from its tokens: a lot of security-sensitive
plumbing for no gain, because both apps already identify people by the same
Google account.

The approach that actually delivers "Welcome decides who gets in" is the one
already half in place: same Google sign-in, Welcome's member list as the sole
authority for who may enter and what they may do. What is missing is that the
sign-in button still only accepts `@coachingfederation.ch` addresses, so a
Welcome member who signs in with a private address is turned away before the
member list is ever consulted.

## What changes for the user

- Anyone listed in ICF Switzerland Welcome can sign in here, whatever address
  their Google account uses. The Welcome list alone decides.
- Google accounts unknown to Welcome are still turned away with the existing
  explanation, in DE/FR/IT/EN.
- Sign-in page wording changes from "your @coachingfederation.ch Google account"
  to "the Google account you use for ICF Switzerland Welcome", and the heading
  changes from "Sign in to edit" to "Sign in" — members sign in to propose, not
  only to edit.
- What each person may do stays as it is today: members propose, editors and
  admins edit, admins also manage access.
- Reading the dashboard stays fully open, no sign-in needed.

## Technical notes

- `src/routes/auth.tsx`: drop the `hd: "coachingfederation.ch"` hosted-domain
  parameter from `lovable.auth.signInWithOAuth`; keep `prompt: "select_account"`.
- `src/lib/i18n-strings.ts`: reword `auth.pageTitle`, `auth.pageSubtitle`,
  `auth.editorAccess` and `auth.welcomeHint` in EN/DE/FR/IT to name Welcome as
  the source of access and cover members as well as editors.
- Access logic is unchanged: `applyMyRoles` → `applyRolesForUser` already forces
  a directory refresh before rejecting an unknown address, and `role_overrides`
  remains the remedy for a person whose Welcome address differs from their Google
  address.
- No schema change, no RLS change, no provider change.

## PR note

**Summary** — Make the Welcome member list the only gate on sign-in by removing
the Google hosted-domain restriction that blocks members with private addresses,
and align the sign-in copy with member-level access.

**Changes**
- Auth UI: no hosted-domain restriction on the Google sign-in call.
- i18n: reworded EN/DE/FR/IT sign-in strings.

**Backend / schema changes** — None.

**Testing & verification** — Sign in as a directory admin, an editor, a member
with a non-chapter address (expected: allowed, propose-only), and a Google
account absent from Welcome (expected: rejected with the message). Confirm
signed-out pages stay fully readable.

**Risks & rollback** — Blast radius is the sign-in path. Removing the domain
limit widens who reaches the Welcome check, but nobody outside the Welcome list
keeps a session. Rollback is a code revert.

**Follow-ups / known debt** — Rejection still happens after the Google round trip;
a pre-check would require exposing the member list publicly. Directory freshness
still rides on sign-in traffic rather than a schedule.
