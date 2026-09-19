# Setup products integration

## Inspection

- Branch: `deskscroll-rebuild`; starting commit: `5d539f8`.
- Setup creation and draft saving use `app/admin/new/page.tsx`.
- Setup editing has Save and Update handlers in `app/admin/edit/[id]/page.tsx`.
- Public details use `app/setups/[slug]/page.tsx`.
- Setup forms currently use the browser Supabase helper; product actions use
  `getAdminUser` and server Supabase helpers. Retain those conventions.
- No `setup_products` references, migrations, or generated database types existed
  in this checkout at inspection time.

## Existing schema reference

The final Products + Brands migration in the referenced "Passive income setup"
conversation defines `public.setup_products` with:

| Column | Type | Default |
| --- | --- | --- |
| setup_id | uuid, required | none |
| product_id | uuid, required | none |
| notes | text, nullable | none |
| sort_order | integer, nullable | 0 |
| created_at | timestamptz, nullable | now() |

The primary key is `(setup_id, product_id)`. Both foreign keys cascade on deletion.
The user subsequently supplied the actual table DDL and confirmed these columns,
constraints and index. The connected Supabase belongs to another project and must
not be used for this repository. The user will run any required SQL themselves.
Live RLS and database integration verification remain outstanding.

## Implementation requirements

- One searchable selector shared by setup creation and editing.
- All four save paths persist selections and report relationship errors.
- Existing relationships are loaded before editing is enabled.
- Preserve notes and ordering for retained links; avoid deleting retained rows.
- Public cards link to product detail pages and exclude drafts and soft deletions.
- Keep the existing page typography, colors, and responsive card conventions.
- Verify build/types and focused relationship regression scenarios.

## Admin integration

The shared selector supports search, draft labels, loading/retry states and
explicit removal of unavailable existing selections. Save buttons remain disabled
until products and the existing setup have loaded. All four save paths call an
authenticated server action. Authors can change only their own setup links;
admin/manager roles follow the existing admin helper's role model. Database RLS
still applies because the action uses the existing session-bound client.

Saving inserts only new links, then removes deselected links, then reads back to
verify the selection. Retained notes/order are untouched. These are separate API
requests, not a database transaction: failures are surfaced, and retries are
idempotent. A failed addition does not remove any prior selections. If deletion
fails, additions may already exist; the error explicitly explains this.

Creation remembers its inserted setup ID for retries and offers a recovery link
to the saved setup. It does not create a second setup after relationship failure.

Checks: `node --test tests/setup-products.test.cjs` (12 passing at this step) and
`tsc --noEmit` (passing). The local pnpm install was derived from package-lock.json;
the existing transitive Tiptap core package was exposed locally to match npm's
hoisted layout. No dependency versions or repository lockfile were changed.
