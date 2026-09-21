# Proposals: let Welcome members propose new initiatives

## Summary

Anyone listed in the ICF Switzerland Welcome app can sign in here and propose a new
piece of work. Proposals appear in a new "Proposed" column on the Initiative
Portfolio, visible to everyone including signed-out visitors. Editors and admins
accept a proposal by moving it to Planned. Nothing else about editing rights changes.

## Who gets what

- Member (new): every person the Welcome app lists, whatever their role there.
  Can sign in, create proposals, and edit or withdraw their own proposals until
  an editor accepts one. No other editing anywhere.
- Editor / Admin: unchanged, plus they can accept, edit and reject proposals.
- Signed out: reads everything, including proposals. Cannot propose.

Today unknown accounts are signed out again after Google sign-in. That stays,
but the bar drops from "editor or admin in Welcome" to "listed in Welcome".

## What changes on screen

- Initiative Portfolio: a "Proposed" column before Planned in every team section.
  Proposal cards carry a small "Proposed" badge.
- A "Propose" button visible to members (editors keep their existing create flow).
  It opens a short form: idea/title, why now, description, optional team — no
  owner, dates or key result required.
- One-pager of a proposal: proposer's name and date; an "Accept" action for
  editors that flips it to Planned; members see "Edit"/"Withdraw" on their own.
- Drag and drop: editors can drag out of and into the Proposed column as usual.
  Members cannot drag.
- All new labels translated in DE, FR, IT, EN.

## Technical details

Database (one migration):

- Add `member` to the `app_role` enum.
- Add `created_by uuid` to `public.initiatives`, backfilled null, set by the
  create path; used only for proposal ownership checks.
- `initiatives.status` is a text column, so `proposed` needs no type change —
  only the Zod enums in `src/lib/okr-schemas.ts` and `okr.functions.ts`.
- RLS on `public.initiatives`:
  - keep existing editor/admin policies;
  - INSERT for members limited to `status = 'proposed'` and
    `created_by = auth.uid()`;
  - UPDATE/DELETE for members limited to rows they created that are still
    `status = 'proposed'`;
  - SELECT stays public so proposals are visible signed out.
- Grants: `member` needs no new grant (role lives in `user_roles`); confirm
  `authenticated` already holds insert/update/delete on initiatives.

Role mirror (`src/lib/access.server.ts`):

- `mapSourceRoles` returns `member` instead of `null` for any unrecognised
  Welcome role, so every listed person is mirrored. Admin > editor > member.
- `parseDirectoryPayload` no longer drops rows whose roles do not map.
- `applyRolesForUser` unchanged in shape; `null` now means "not in Welcome at all".

Client:

- `AccessRole` gains `member`; `auth-context.tsx` adds `canPropose`
  (`member | editor | admin`) while `canEdit` stays editor/admin only.
- `src/routes/initiatives.index.tsx`: `proposed` added to the status list and
  column order; droppable enabled only for editors; propose button gated on
  `canPropose`.
- Reuse `WorkJourney` in a reduced "proposal" mode rather than a new dialog.
- Server functions keep `requireSupabaseAuth` and rely on RLS for the member
  limits; `createInitiative` stamps `created_by` and forces `status: 'proposed'`
  when the caller is not an editor.
- Report and OKR pages: proposals excluded from delivery counts so numbers
  keep their current meaning.

## PR note

- Summary: adds a propose-only membership level mirrored from the Welcome app and
  a `proposed` initiative state that everyone can see and editors accept.
- Changes: migration (enum value, `created_by`, member RLS), role mapping in
  `access.server.ts`, auth context `canPropose`, portfolio column + propose flow,
  proposal actions on the one-pager, EN/DE/FR/IT strings.
- Backend/schema: `app_role` gains `member`; `initiatives.created_by` added;
  three member-scoped policies on `initiatives`.
- Testing: sign in as member (propose, edit own, cannot touch others), as editor
  (accept, drag), and signed out (sees proposals, no controls).
- Risks: widening the sign-in gate to all Welcome members. Rollback is reverting
  the code; the enum value and column are safe to leave in place.
- Follow-ups: no email notification to editors when a proposal arrives.
