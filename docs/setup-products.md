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
This is historical documentation, not a live database inspection. The connected
Supabase project list does not currently include DeskScroll. Live schema and RLS
verification remain required before calling the integration production verified.

## Implementation requirements

- One searchable selector shared by setup creation and editing.
- All four save paths persist selections and report relationship errors.
- Existing relationships are loaded before editing is enabled.
- Preserve notes and ordering for retained links; avoid deleting retained rows.
- Public cards link to product detail pages and exclude drafts and soft deletions.
- Keep the existing page typography, colors, and responsive card conventions.
- Verify build/types and focused relationship regression scenarios.
