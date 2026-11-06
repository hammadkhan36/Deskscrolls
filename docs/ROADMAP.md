# DeskScrolls – Fix Roadmap

Derived from `docs/AUDIT_REPORT.md`. IDs (B-, S-, A-, C-, P-) refer to findings there.

## Phase 0 – Unbreak production (today)
- [ ] B-1 Remove duplicate `SignupPage` in `app/signup/page.tsx` (lines 107–267). `npm run build` must pass.
- [ ] B-2 / A-7 `const { status, author } = await searchParams` in `app/admin/posts/page.tsx`.
- [ ] Add `"test": "node --test tests/setup-products.test.cjs"` and `"typecheck": "tsc --noEmit"` to `package.json`; run both in CI (GitHub Action: install → lint → typecheck → test → build).

## Phase 1 – Security (this week)
- [ ] Walk `docs/SECURITY_RLS_CHECKLIST.md` in the Supabase dashboard; export policies as SQL into `supabase/migrations/` so they are reviewable.
- [ ] A-1 `updateUserRole(userId, role, status)` server action, admin-only, last-admin guard. Users page calls it.
- [ ] S-2 `uploadMedia`: MIME whitelist, 5 MB, 12-char random id, rate limit (e.g. Upstash Ratelimit or a Supabase edge function). Longer term: move `/submit` images to Supabase Storage via signed upload URLs so submissions and setups share one storage.
- [ ] S-1 / S-7 `createSubmission(formData)` server action: zod schema (lengths, e-mail, https URLs, ≥5 images, ≥7 gear items, consent), honeypot field, IP rate limit, forces `status='pending'`.
- [ ] C-1 / P-2 `sanitizeHtml()` helper (`isomorphic-dompurify`, allow-list incl. `iframe` for YouTube and `div[data-embed][data-url]`) applied in every action that stores `content` and before every `dangerouslySetInnerHTML`.
- [ ] C-2 / S-5 `assertHttpUrl()` helper for `buy_url`, `website_url`, `cover_image_url`, gear links, social handles.
- [ ] P-9 Escape `</` in JSON-LD on brands/products/category pages (copy the blogs implementation).
- [ ] A-4 Honour `?next=` (relative paths only) in login; send `pending` users to a "waiting for approval" page instead of `/admin`.

## Phase 2 – Community submission pipeline (next)
- [ ] S-11 Add `submissions.setup_id uuid null references setups(id)`, `reviewed_by`, `reviewed_at`, `review_note`.
- [ ] `convertSubmissionToSetup(submissionId)` server action: creates a draft `setups` row (title = "<name>'s desk setup", owner_name, short_intro = intro, content = description + gear list as HTML, cover = first image), copies images into `setup_images`, links `submissions.setup_id`, sets status `approved`, redirects to `/admin/edit/<id>`.
- [ ] Submission modal: "Convert to setup" button, reject-with-reason, reviewer + timestamp, image lightbox.
- [ ] S-13 E-mail on approve/reject (Resend/Supabase SMTP); S-8 autosave draft to `localStorage` and a real success screen on `/submit`.
- [ ] S-14 Pagination (`range`) and search on `/admin/submissions`.

## Phase 3 – Admin dashboard consolidation
- [ ] A-3 `lib/auth.ts`: `requireRole(...roles)` that also checks `status='active'`; permission matrix documented in `docs/ARCHITECTURE.md` §3; manager gets publish rights.
- [ ] A-2 / A-12 / A-13 / A-15 `saveSetup(formData)` server action used by both `/admin/new` and `/admin/edit/[id]`; one form component with `initialData`; explicit Publish toggle on create; slug uniqueness (23505 → friendly message); delete orphaned storage objects on image removal.
- [ ] A-8 Revalidate `/`, `/setups`, `/setups/[slug]`, `/[category]`, `/sitemap.xml` in publish/trash/restore.
- [ ] A-9 Delete `app/admin/actions.tsx` + `AdminTable.tsx`.
- [ ] A-10 `Promise.all` the dashboard counts; show pending submissions + pending users prominently; add "recent submissions" list.
- [ ] C-4..C-8 CMS modules: shared `slugify`/`optionalText`/`assertHttpUrl` in `app/lib/`, usage guards before delete, restore for brands/products, atomic relation sync via RPC, error handling in `CategoriesTable`, `BlogRowActions`, `RichEditor`; one upload helper (server-validated) for all buckets.
- [ ] A-14 Decide: keep `setups.category_id` as *primary* and make `setup_categories` the source of truth for listing; ensure the primary is always also in the junction (DB trigger or action logic); make `/setups?category=`, related setups and `/[category]` all query the junction.

## Phase 4 – Public site quality & performance
- [ ] P-1 Normalise to-one embeds (`toOne()` helper) on products/brands pages + admin products list; add generated Supabase types (`supabase gen types`) to make this a compile-time error.
- [ ] P-3 `deleted_at` filters on setup detail/related/category/sitemap.
- [ ] B-3 / P-7 / P-8 Cookie-less anon client for public reads (`createPublicClient()`), `cache()` around `getX()` loaders, `'use cache'`/`unstable_cache` where safe; Navbar/Footer as server components in `app/layout.tsx` with categories passed as props.
- [ ] P-4 One `subscribeNewsletter` server action + one component; remove the two dead inline forms.
- [ ] P-5 / P-6 / B-7 Footer links, `/privacy` + `/terms` pages, `not-found.tsx`, `error.tsx`, image host guard in `BlogRelatedContent`.
- [ ] P-10 `about` → `.tsx` with metadata; drop duplicated `| DeskScroll` suffixes; `NEXT_PUBLIC_SITE_URL`; `next/font`.
- [ ] P-11 Remove `/profile` and `/post/new` until they are real.

## Phase 5 – Hygiene
- [ ] Dead-code purge (§7 of the audit, ~13k lines) – one PR per area so diffs stay reviewable.
- [ ] ESLint to zero errors (`no-explicit-any`, setState-in-effect, unescaped entities); add `eslint --max-warnings 0` to CI.
- [ ] Move `workprogress.md`, `themeidea.md`, `importantschanges.md` to `docs/notes/`.
- [ ] README rewrite (done in this audit) kept current; `docs/ARCHITECTURE.md` updated with every schema change.
