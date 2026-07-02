Restrict editor access to Google accounts on `coachingfederation.ch`. Three layers so it can't be bypassed by tweaking the client.

## 1. Client — hint Google's account picker

In `src/routes/auth.tsx`, pass the `hd` parameter so Google only lets users pick a `coachingfederation.ch` account:

```ts
lovable.auth.signInWithOAuth("google", {
  redirect_uri: window.location.origin,
  extraParams: { hd: "coachingfederation.ch", prompt: "select_account" },
});
```

## 2. Client — reject any session whose email isn't on the domain

Still in `src/routes/auth.tsx`, after `signInWithOAuth` resolves with a session (and also in `useAuth`'s `onAuthStateChange` in `src/lib/auth-context.tsx`), check `user.email`. If it doesn't end with `@coachingfederation.ch`, call `supabase.auth.signOut()` and show a toast: "Sign-in is restricted to coachingfederation.ch accounts." Copy on the sign-in card is updated to say the same up-front.

## 3. Database — only grant the `editor` role to verified domain matches

Rewrite the existing `public.grant_editor_on_signup()` trigger (currently gives every new user the `editor` role) so it only inserts into `user_roles` when both:
- `new.email_confirmed_at is not null` (Google always confirms), and
- `lower(split_part(new.email, '@', 2)) = 'coachingfederation.ch'`.

Also add an `AFTER UPDATE OF email_confirmed_at` trigger that grants the role when a previously-unconfirmed email later confirms with the right domain. This is the standard verified-domain pattern — a client that skips step 2 still can't edit, because they have no editor role and every write policy checks `has_role(auth.uid(),'editor')`.

Users outside the domain who somehow reach a session can still view the dashboard (public read), but every edit will be blocked by RLS.

## Files touched

- `src/routes/auth.tsx` — pass `hd`/`prompt`, post-sign-in domain check, updated copy.
- `src/lib/auth-context.tsx` — enforce domain check in `onAuthStateChange` so a bad session anywhere in the app is signed out immediately.
- One migration replacing `grant_editor_on_signup` and adding the confirm-update trigger.

## Out of scope

- A separate allow-list UI for exceptions.
- Anything about who can view the dashboard (viewing stays public).
- Removing the editor role from existing users whose email isn't on the domain — I can add a one-off cleanup step if you want, otherwise the migration only affects future sign-ups.