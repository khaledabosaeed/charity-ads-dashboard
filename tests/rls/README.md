# RLS verification (requires a live Supabase instance)

These are not automated in this repo (no Docker/live Supabase in the build
sandbox). After `supabase start && supabase db reset`, verify manually or
via `psql`/a small script using two Supabase clients (an admin session and
a media-buyer session) against the local instance:

1. **Media buyer cannot read an unrelated association.**
   `select * from associations where id = '<not-assigned-id>'` as the media
   buyer → 0 rows (RLS filters it out, not a 403).

2. **Media buyer cannot insert a statistics entry for an unlinked platform.**
   Insert into `statistics_entries` with a `platform_id` not in
   `association_platforms` for that association → rejected (RLS policy AND
   the `statistics_entries_enforce_links` trigger both block it).

3. **Media buyer cannot insert for an association they are not assigned to.**
   Same as above but with an association they have no
   `association_media_buyers` row for → rejected.

4. **Media buyer can delete only their own statistics / store-sales rows.**
   A delete of someone else's row → 0 rows / rejected. An admin can delete
   any row.

5. **Media buyer cannot read `audit_logs`** → 0 rows / permission error.

6. **Admin can do all of the above successfully** — sanity check policies
   are not accidentally too restrictive for the admin role.

A quick way to run these once a local instance exists: sign in as each user
via `supabase-js` in a `tsx` script, run the queries above, and assert on
`error`/`data`. This is intentionally left as a follow-up for whoever runs
this against a real project, since it requires live credentials this sandbox
does not have.
