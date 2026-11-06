# Supabase RLS & Security Checklist for DeskScrolls

The app uses **only the anon key** (browser and server). That means Row Level Security (RLS)
policies in the Supabase project are the *only* thing standing between a visitor and the
database for every query made from a client component. The repo contains no migrations, so the
policies cannot be reviewed here – verify each item below in the Supabase dashboard
(Authentication → Policies) and tick it off.

## A. Must be true today (otherwise there is an open hole)

| # | Table | Required policy | Why |
|---|---|---|---|
| 1 | `profiles` | `UPDATE` allowed **only** for `role = 'admin'` callers (or via a `SECURITY DEFINER` function). A user must NOT be able to update their own `role`/`status`. | `app/admin/users/page.tsx` changes roles from the browser. If a self-update policy exists, any signed-up user can set `role='admin'`. |
| 2 | `profiles` | `SELECT` for authenticated users limited to what the admin UI needs; no public select of other users' data if `avatar_url`/`full_name` are considered private. | `/admin/posts` loads every profile for the author filter. |
| 3 | `setups`, `setup_images`, `setup_categories` | `INSERT/UPDATE/DELETE` only for `profiles.role IN ('admin','manager','author')`; authors only their own rows (`author_id = auth.uid()`). | `/admin/new` and `/admin/edit/[id]` write these tables **directly from the browser**. |
| 4 | `setups` | Public `SELECT` only where `published = true AND deleted_at IS NULL`, **or** keep anon select open but make sure every public query filters on it (audit finding P-1). | Drafts/trashed setups must never leak via a crafted REST call with the anon key. |
| 5 | `submissions` | Anon `INSERT` allowed (the form needs it) but **no anon SELECT/UPDATE/DELETE**. Consider a `CHECK (status = 'pending')` or a trigger that forces `status='pending'` on insert. | The form sets `status: 'pending'` client-side; a crafted request could insert `status='approved'`. |
| 6 | `submissions` | `SELECT/UPDATE` only for admin/manager. | Submissions contain personal e-mails. |
| 7 | `newsletter_subscribers` | Anon `INSERT` only; unique index on `lower(email)`; no anon select. | Prevent harvesting the subscriber list. |
| 8 | `blogs`, `products`, `brands`, `categories`, `product_categories`, `*_links` | Writes restricted to staff roles. | Admin CMS server actions run with the caller's cookie session, so RLS still applies. |
| 9 | Storage buckets `setups`, `blog-images` | `INSERT` only for authenticated staff; public `SELECT`. `submissions` bucket can be removed if unused. | Uploads happen from the browser with the anon key. |

## B. Application-side hardening (code changes, tracked in docs/AUDIT_REPORT.md)

- [ ] `app/actions/uploadMedia.ts` – server action callable by anyone, no rate limit, no MIME check. Add: content-type whitelist (`image/jpeg|png|webp`), per-IP rate limit, and tie uploads to a submission token.
- [ ] `/submit` – move the `submissions` insert into a server action that validates fields (lengths, URL format for gear links and social handles, e-mail format) and forces `status='pending'`. Add a honeypot field + rate limit (e.g. Upstash/Vercel KV or Supabase edge function).
- [ ] `/admin/users` – move role changes into a server action guarded by `getAdminUser()` **and** `role === 'admin'`; forbid self-demotion of the last admin.
- [ ] `/admin/new`, `/admin/edit/[id]` – move setup writes into server actions (like `setup-product-actions.ts` already does) so role checks live in one place.
- [ ] Rich-text HTML (`setups.content`, `blogs.content`, product/brand descriptions) is rendered with `dangerouslySetInnerHTML` in 8 files with **no sanitizer**. Staff-only authoring reduces risk, but add `isomorphic-dompurify` (or sanitize on save) before any non-admin role (author) can publish.
- [ ] `gear_list[].link` and `social_profiles[].handle` are rendered as `<a href>` in the admin modal without a scheme check – reject anything not starting with `https://`.
- [ ] `proxy.ts` checks `status='active'`; `app/admin/layout.tsx` and `getAdminUser()` do not. Align them (see audit A-3).
- [ ] `login` ignores the `?next=` parameter that `proxy.ts` sets. When adding it, only allow relative paths (prevent open redirect).

## C. Operational

- [ ] Rotate the ImageKit private key if it has ever been committed or shared (it is read from env only – good – but `.env*` files must stay untracked).
- [ ] Enable Supabase **Auth → e-mail confirmation** (signup flow assumes it may be off).
- [ ] Turn on Supabase **leaked-password protection** and set a minimum password length ≥ 8 (forms currently allow 6).
- [ ] Add `Content-Security-Policy` / `X-Frame-Options` headers in `next.config.js` (`headers()`), at least for `/admin`.
- [ ] Add `/profile`, `/post/new` to `robots.ts` disallow until they are real pages (or delete them).
