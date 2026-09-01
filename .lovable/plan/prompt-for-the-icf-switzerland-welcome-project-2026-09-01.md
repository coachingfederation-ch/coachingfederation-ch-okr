# Prompt for the "ICF Switzerland Welcome" project

Paste the block below into the Welcome project's chat. It adds one read-only,
secret-protected export route that this OKR dashboard already knows how to read.

```text
Add a secured, read-only export of the Operational Structure so another internal
app can mirror it.

Create src/routes/api/public/op-structure.ts as a TanStack Start server route
(createFileRoute with a server.handlers.GET handler).

Security:
- Require the header "x-role-directory-secret" to exactly match
  process.env["ROLE_DIRECTORY_SECRET"] (read inside the handler).
- If the secret is missing or does not match, return 401 with no body detail.
- Use the same shared-secret pattern as the existing role-directory export route,
  and reuse the same ROLE_DIRECTORY_SECRET value.

Data:
- Read from op_projects using the service-role client (server-side only).
- Return only active units (is_active = true), ordered by their sort order.
- Include communities in the payload; do not filter them out — just flag them.
- Expose no member, assignment or personal data. Structure names only.

Response: JSON array, one object per unit, exactly these keys:
[
  {
    "slug": "events-programmes",
    "name": "Events & Programmes",      // English name
    "name_de": "...",                   // empty string if not maintained
    "name_fr": "...",
    "name_it": "...",
    "sort_order": 3,                    // number
    "is_community": false               // boolean
  }
]
Use empty strings rather than null for missing translations, and always emit
sort_order as a number and is_community as a boolean.

Do not change the Operational Structure UI, schema, or any existing route.
```

## After it is live

Nothing further is needed in the OKR dashboard: the mirror already points at
`https://project--9b53a55c-a944-4840-b29d-ad56f7d750f4.lovable.app/api/public/op-structure`,
sends the same secret header, and can be triggered from the "Operational structure"
card on `/access`. First check: press "Sync now" there and confirm the unit count
and last-sync status.
