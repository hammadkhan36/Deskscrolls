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

## Public integration and validation

The setup detail page renders the linked products after its article. Cards use
the existing warm colors and a one/two/three-column responsive grid. They include
product detail links, optional price, sponsorship label, relationship notes and
missing/broken image fallback. Images use Next Image with fixed aspect ratio and
lazy loading; `unoptimized` preserves the existing product system's support for
externally hosted image URLs without broadening the image optimizer allowlist.

The query explicitly requires published, non-deleted products even when an admin
views the public page. It sorts by relationship order and product ID. No links
means no empty section; query errors display an unavailable message and do not
turn the setup into a 404.

Validation completed:

- 15 focused tests pass (`node --test tests/setup-products.test.cjs`). These use
  controlled database responses, not the production database.
- TypeScript passes (`tsc --noEmit`).
- ESLint passes for the new application modules. Existing admin forms still have
  legacy lint findings (explicit any, effect dependencies, and existing images).
- Next.js 16.2.7 production build passes, including compilation, type checking and
  generation of 33 static pages. It uses local build-only Supabase and ImageKit
  placeholders because this checkout has no project credentials. This verifies
  compilation, not real database reads, authenticated saves or media uploads.
- Existing middleware-to-proxy deprecation warning remains outside this feature.

## Owner-run live verification

No schema migration is needed for the supplied table. Do not use the unrelated
connected Supabase project. With this branch deployed against DeskScroll's own
environment, check the following with a test setup:

1. Create with two selected products; reopen edit and verify both are selected.
2. Repeat through Save Draft; the edit screen should retain selections.
3. Use both Save and Update to add/remove products, then reload and verify.
4. Clear all selections and save; confirm the public section disappears.
5. Publish the test setup. Confirm linked published products show and draft or
   soft-deleted products do not. Check desktop and a narrow mobile viewport.
6. If an existing relationship has notes/custom sort_order, confirm editing other
   selections preserves both values.

If permissions prevent saving or public reading, inspect the current policies
before changing them. This optional query is read-only and should be run by the
owner in the correct project's SQL editor:

```sql
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('setups', 'products', 'setup_products')
order by tablename, policyname;

select c.relname, c.relrowsecurity
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('setups', 'products', 'setup_products');
```

Share the query results and the exact app error before preparing policy changes.
No production database changes were executed as part of this implementation.
