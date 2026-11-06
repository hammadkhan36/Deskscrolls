# DeskScrolls – Full Repository Audit (6 Nov 2026)

Branch audited: `master` @ `4f4fe83`. Tooling run: `npm ci`, `tsc --noEmit`, `eslint .`, `next build`,
`node --test tests/setup-products.test.cjs`. Supabase project itself was **not** reachable from this
audit; everything about RLS/policies is marked "verify in dashboard".

Companion files: `docs/ARCHITECTURE.md` (route + data model map), `docs/SECURITY_RLS_CHECKLIST.md`
(policy checklist), `docs/ROADMAP.md` (phased fix plan), `.env.example`.

---

## 0. Khulasa (Roman Urdu)

* **Sab se bara masla: `master` abhi build hi nahi hota.** `app/signup/page.tsx` mein poora component do
  dafa paste hua hai (commit `3b0ee62`, 5 Nov). `next build` aur `tsc` dono fail. Vercel deploy isi
  wajah se fail ho raha hoga. Fix 2 minute ka hai (line 107–267 delete karo).
* **Community submission → setup ka flow adhoora hai.** `/submit` form submissions table mein save karta
  hai, admin "Approve" sirf status badalta hai; setup banane ke liye admin ko sab kuch dobara `/admin/new`
  mein type karna parta hai. Images bhi ImageKit par hain jabke setups Supabase Storage use karte hain.
* **Security ka asal darwaza RLS hai, aur RLS repo mein hai hi nahi.** Browser se seedha `profiles`
  (roles!), `setups`, `submissions`, `newsletter_subscribers` mein likha ja raha hai anon key se. Agar
  Supabase mein policies dheeli hain to koi bhi user khud ko admin bana sakta hai. Checklist
  `docs/SECURITY_RLS_CHECKLIST.md` mein hai.
* **Admin dashboard** kaam karta hai lekin Posts page ka filter toota hua hai (Next 16 mein `searchParams`
  Promise hai, await nahi kiya), roles har jagah alag check ho rahe hain, aur publish karne par public
  pages revalidate nahi hote.
* **Public site** par soft-deleted setups abhi bhi khulte aur sitemap mein aate hain; products/brands pages
  par to-one relation ko array samajh kar `[0]` liya gaya hai jis se category pages khali dikh sakte hain;
  HTML content bina sanitize render hota hai.
* **Dead code bahut zyada hai:** ~13,000 commented-out lines (akela `SubmitForm.tsx` 8,325 lines ka hai
  aur use hi nahi hota), 4 editors, 5 newsletter forms, mock `/profile` aur fake `/post/new` pages.

---

## 1. Scoreboard

| Check | Result |
|---|---|
| `tsc --noEmit` | **FAIL** – 12 errors, all in `app/signup/page.tsx` (duplicate component) |
| `next build` | **FAIL** – same file (`the name 'useState' is defined multiple times`) |
| `eslint .` | 54 errors / 33 warnings (24× `no-explicit-any`, 10× `no-require-imports` in the test, 9× unescaped entities, 6× setState-in-effect, 11× `<img>`) |
| `node --test tests/setup-products.test.cjs` | 15/15 pass (no `npm test` script exists) |
| Secrets in git | none found; `.env*` ignored |
| SQL / migrations / RLS in repo | **none** |
| Lines of source | 34,728 (≈13,000 are commented-out old versions) |

Severity key: **H** = exploitable or blocks production, **M** = real bug / data-integrity / SEO loss, **L** = quality.

---

## 2. Platform & build

| # | Sev | Finding | Where |
|---|---|---|---|
| B-1 | **H** | Duplicate `SignupPage` – file contains two full copies, second starting at line 107. Breaks `tsc` and `next build`; `master` is undeployable since 5 Nov. | `app/signup/page.tsx:9`, `:114` |
| B-2 | M | `searchParams` used synchronously. In Next 16 it is a `Promise` (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`), so `searchParams.status` is always `undefined` → the Posts status/author filters never apply. All 13 other pages do it right. | `app/admin/posts/page.tsx:217-222` |
| B-3 | M | `revalidate = 300/3600` on brands/products/sitemap has no effect: every page calls `createServerSupabase()` → `cookies()`, which forces dynamic rendering. Nothing public is ISR-cached. | `app/lib/supabase/server.ts:36`, `app/brands/page.tsx:201`, `app/products/page.tsx:7`, `app/sitemap.ts:6` |
| B-4 | M | Hard-coded site URL `https://deskscroll.com` in 7 files (layout, sitemap, robots, 4 pages) and `hello@deskscrolls.com` mailto in 2 pages (different domain). Use `NEXT_PUBLIC_SITE_URL`. | `app/layout.tsx:4`, `app/sitemap.ts:4`, `app/robots.ts:19`, `app/setups/[slug]/page.tsx:13,324` |
| B-5 | L | `next.config.js` has `turbopack: {}` while `npm run dev` passes `--webpack`; three old configs kept as comments. | `next.config.js`, `package.json:6` |
| B-6 | L | `README.md` is the untouched create-next-app template; `workprogress.md` (50 KB), `themeidea.md`, `importantschanges.md` are chat logs / wish-lists committed to the repo root. | root |
| B-7 | L | No `app/not-found.tsx`, `error.tsx`, `loading.tsx`; framework defaults render without Navbar/Footer. | `app/` |
| B-8 | L | No `test` script; test uses `require()` (10 lint errors) and transpiles TS via `new Function`. | `package.json`, `tests/setup-products.test.cjs` |
| B-9 | L | Google Fonts loaded twice (`<link>` in layout + `@import` in globals.css); `next/font` unused. | `app/layout.tsx:62-65`, `app/globals.css:43` |

---

## 3. Community setups – submission flow (`/submit` → `submissions` → admin)

### 3.1 Form (`app/components/SubmitForm2.tsx`, 2,474 lines, 1,152 commented)

| # | Sev | Finding | Where |
|---|---|---|---|
| S-1 | **H** | Insert goes **directly from the browser** with the anon key: `supabase.from('submissions').insert({... status: 'pending'})`. No server-side validation, no rate limit, no honeypot/captcha. Anyone can script unlimited rows or (if RLS doesn't force it) insert `status: 'approved'`. | `SubmitForm2.tsx` submit handler (`.from('submissions').insert`) |
| S-2 | **H** | `uploadMedia` server action is **unauthenticated** and uses the ImageKit **private key**. Any visitor can upload 5 MB files forever (cost/abuse). No MIME check, raw `file.name`, `submissionId` interpolated into the folder unsanitised. | `app/actions/uploadMedia.ts:48-72` |
| S-3 | M | `submissionId` is 2 random chars (1,296 combinations) → folder collisions between different people's uploads. | `SubmitForm2.tsx` (`for (let i = 0; i < 2; i++)`) |
| S-4 | M | Orphaned uploads: images are uploaded one-by-one *before* the DB insert; if the insert fails the files stay on ImageKit with no record. No cleanup path. | same handler |
| S-5 | M | No validation of `gear_list[].link` / social handles (URL scheme, length). They are later rendered as `<a href>` in the admin modal → `javascript:` link possible. | `SubmitForm2.tsx`, `admin/submissions/SubmissionsTable.tsx:393-400` |
| S-6 | M | Two upload backends: `/submit` → ImageKit, everything else → Supabase Storage. Approved submission images can't be reused for a setup without re-upload. | `uploadMedia.ts` vs `app/lib/utils/supabase-uploads.ts` |
| S-7 | M | Hard requirements (≥5 images, ≥7 gear items, consent) are only enforced client-side. | `SubmitForm2.tsx` `validate()` |
| S-8 | L | No draft persistence; a page refresh loses a 20-field form. No success page/e-mail confirmation; "newsletter" checkbox stores a flag but never subscribes anyone. | – |
| S-9 | L | `SubmitForm.tsx` (8,325 lines, 6,369 commented) is the old version, still **imported** by `app/submit/page.tsx:3` (bundled) but commented out in JSX. | `app/submit/page.tsx:3,11` |
| S-10 | L | `/submit` has no `metadata` (title/description/canonical). | `app/submit/page.tsx` |

### 3.2 Admin review (`app/admin/submissions/**`)

| # | Sev | Finding | Where |
|---|---|---|---|
| S-11 | **H (product gap)** | **Approve does not create a setup.** `updateSubmissionStatus` only flips `status`. There is no FK `submissions.setup_id`, no "Convert to setup" button, no pre-filled `/admin/new`. The core community workflow ends in manual re-typing. | `admin/submissions/actions.ts:7-19` |
| S-12 | M | `status` parameter is an unchecked string – any value can be written. Whitelist `pending/approved/rejected`. | `admin/submissions/actions.ts:7` |
| S-13 | M | No rejection reason, no internal notes, no e-mail to the submitter on approve/reject, no "who reviewed / when". | `SubmissionsTable.tsx` |
| S-14 | M | No pagination/search: `select('*')` of all submissions for the tab. Personal e-mails are shipped to the client for every row. | `admin/submissions/page.tsx:24-29` |
| S-15 | L | Images rendered via `<img>` (no lazy/size), no lightbox; `changeStatus` has no error handling (silent failure, then `router.refresh()`). | `SubmissionsTable.tsx:39-43, 371-376` |
| S-16 | L | Sidebar gives `manager` access but `/admin/submissions` re-checks roles with a different message than the layout. Fine, but duplicated logic. | `admin/submissions/page.tsx:16-19` |

---

## 4. Admin dashboard – core (`/admin`, posts, setup editor, users)

### 4.1 Access control

| # | Sev | Finding | Where |
|---|---|---|---|
| A-1 | **H (verify RLS)** | `/admin/users` changes `profiles.role` / `status` **from the browser** with the anon key. If RLS lets a user update their own profile row (very common default), any signed-up user can promote themselves to `admin`. Must be a server action + policy restricted to admins. | `app/admin/users/page.tsx:32-57` |
| A-2 | **H (verify RLS)** | Setup create/edit writes `setups`, `setup_categories`, `setup_images` and uploads to Storage **from the browser**. Role enforcement for these writes exists only in RLS (unknown). `saveSetupProducts` is the only part done as a guarded server action. | `app/admin/new/page.tsx:59-93`, `app/admin/edit/[id]/page.tsx:114-153` |
| A-3 | M | Five different role checks: `proxy.ts` (status=active, role≠pending), `admin/layout.tsx` + `lib/auth.ts` (role ∈ admin/manager/author, **ignore status**), `admin/actions.tsx` + `posts/actions.ts` (admin/author only → **manager cannot publish** though sidebar shows Posts), `submissions/actions.ts` (admin/manager), `categories/actions.ts` (admin/manager, delete admin-only). Centralise in `lib/auth.ts` with a permission matrix. | files listed |
| A-4 | M | `login` redirects to `/admin` and ignores the `?next=` set by `proxy.ts`; `signup`/`reset-password` also push to `/admin` even for users whose role is `pending`, who then hit the proxy redirect to `/`. | `app/login/page.tsx:20`, `app/signup/page.tsx:46`, `app/reset-password/page.tsx:30` |
| A-5 | L | `proxy.ts` matcher includes `/create-setup`, a route that does not exist. | `proxy.ts:303-307` |
| A-6 | L | Admin cannot demote another admin, cannot delete/suspend users, cannot see e-mail (profiles has none); `select('*')` on profiles. Last-admin lockout not prevented. | `app/admin/users/page.tsx` |

### 4.2 Dashboard & posts

| # | Sev | Finding | Where |
|---|---|---|---|
| A-7 | M | Posts filters broken (see B-2). | `app/admin/posts/page.tsx:217` |
| A-8 | M | `togglePublish`, `softDeleteSetup`, `restoreSetup` revalidate **only `/admin/posts`**. Public `/`, `/setups`, `/setups/[slug]`, `/[category]`, sitemap are not revalidated (they are dynamic today only by accident, see B-3). | `app/admin/posts/actions.ts:27,45,60` |
| A-9 | M | Two parallel implementations of the same actions: `admin/actions.tsx` (`deleteSetup` = **hard delete**, used by `AdminTable.tsx`) and `admin/posts/actions.ts` (soft delete). `AdminTable.tsx` has no importer – dead but dangerous. | `app/admin/actions.tsx`, `app/admin/AdminTable.tsx` |
| A-10 | M | Dashboard fires 10 sequential `count` queries per load; no `Promise.all`. Cards use `<a>` instead of `<Link>`. | `app/admin/page.tsx:62-109` |
| A-11 | L | No pagination/search on Posts; author list loads every profile. Action errors in `AdminPostsTable` are unhandled (no try/catch). | `app/admin/posts/page.tsx:32`, `AdminPostsTable.tsx:19-30` |

### 4.3 Setup editor (`/admin/new`, `/admin/edit/[id]`)

| # | Sev | Finding | Where |
|---|---|---|---|
| A-12 | M | **"Create Setup" and "Save Draft" are identical** – both write `published: false`; the only difference is the redirect. There is no way to publish from the editor on create. | `app/admin/new/page.tsx:48-157` |
| A-13 | M | `handleSave` / `handleSubmit` on the edit page are ~75-line copy-pastes; same on new page. | `app/admin/edit/[id]/page.tsx:102-255` |
| A-14 | M | Category model duplicated: `setups.category_id` (primary) **and** `setup_categories` junction. Public `/[category]` reads the junction, `/setups?category=` and related-setups read `category_id` → a setup can show in one and not the other. | `new/page.tsx:68,80`, `app/[category]/page.tsx:99-103`, `app/setups/page.tsx:153-158` |
| A-15 | M | Edit: `setup_categories` are deleted then re-inserted without a transaction; gallery uploads are sequential with no error handling; cover re-upload on every retry; replaced/removed images are never deleted from Storage (orphans). `sort_order` for new images is computed from array length, not the real max. | `edit/[id]/page.tsx:131-153` |
| A-16 | M | Slug: no uniqueness check or friendly 23505 handling; slug auto-generation also runs on the edit page and can silently change an existing slug when the title is edited and slug cleared. No `revalidatePath` for old slug. | `edit/[id]/page.tsx:88-93` |
| A-17 | L | `setState` directly inside `useEffect` (lint errors), `any` types, `alert()` for errors, no unsaved-changes guard, no image preview before upload, form width `max-w-lg` for a rich editor. | `new/page.tsx`, `edit/[id]/page.tsx` |
| A-18 | L | Four TipTap editors in the tree (`UltimateTipTapEditor`, `RichEditor`, `Editor`, `PostEditor`); only the first two are used. `extensions/EmbedExtension.tsx` lives outside `app/`. | `app/components/` |

---

## 5. Admin CMS modules (blogs, brands, products, categories)

Full detail in the subagent notes folded into this section; key items only.

| # | Sev | Finding | Where |
|---|---|---|---|
| C-1 | M | Rich-text `content` (blogs, products) and `setups.content` stored and rendered **unsanitised** (`dangerouslySetInnerHTML`, 8 files, no DOMPurify). The lowest role (`author`) can publish → stored XSS against all visitors. | `admin/blogs/new/actions.ts:342`, `products/new/actions.ts:108`, `app/blogs/[slug]/page.tsx:457`, `app/components/EmbedRenderer.tsx:28` |
| C-2 | M | `buy_url`, `website_url`, image URLs accepted without `https://` check server-side; rendered as `href`. | `products/new/actions.ts:120-122`, `brands/new/actions.ts:58-66` |
| C-3 | M | `uploadBlogImage`: no type/size validation, unsanitised extension, uploads to public bucket root. Used by blogs **and** products. | `admin/blogs/new/uploadImage.ts:10-16` |
| C-4 | M | Products admin list: to-one `brand` join treated as array (`brand?.[0]`) → brand never shown, stray "•". | `app/admin/products/page.tsx:126-134` |
| C-5 | M | Raw/empty slugs accepted in blogs and blog-categories; 7 copies of `slugify()`, 5 of `optionalText()`. | `blogs/new/actions.ts:352`, `blog-categories/actions.ts:23,44` |
| C-6 | M | Deletes without guards: blog-categories, setup-categories (FK outcome unknown); brand soft-delete silently nulls `products.brand_id` on the product's next save; no restore for brands/products; hard-delete of blogs leaves relation rows + storage orphans. | `blog-categories/actions.ts:56`, `categories/actions.ts:39`, `brands/[id]/edit/actions.ts:132` |
| C-7 | M | Non-atomic delete-then-insert for blog relations and product category links. | `blogs/new/actions.ts:247-330`, `products/new/actions.ts:355-387` |
| C-8 | M | Setup-categories actions `throw`; client never catches → silent failure, stuck "Adding…". `BlogRowActions` discards `{error}`. `RichEditor` upload has no try/catch (stuck "Uploading…"). | `CategoriesTable.tsx:25-46`, `BlogRowActions.tsx:28-51`, `RichEditor.tsx:21-26` |
| C-9 | L | Inconsistent conventions across modules (soft vs hard delete, `published_at` reset or not, `location.reload()` vs `router.refresh()` vs `redirect()`, duplicate 23505 handling only in product-categories, partial public revalidation). `product-categories` is the reference implementation. | see `docs/ARCHITECTURE.md` §6 |
| C-10 | L | ~1,170 commented lines in these modules; `BrandForm`/`EditBrandForm` and `ProductCategoryForm`/`EditProductCategoryForm` are ~90 % duplicates. | – |

---

## 6. Public site

| # | Sev | Finding | Where |
|---|---|---|---|
| P-1 | **H (verify live)** | To-one embeds handled as arrays (`link.product?.[0]`, `product.brand?.[0]`, `category?.[0]`, `setup?.[0]`). PostgREST returns an **object** for to-one joins, so as written `/products/category/[slug]` filters out every product, `/products` never shows brand/category, `/products/[slug]` never shows "setups using this product", `/brands/[slug]` never shows category chips. Normalise with `Array.isArray(x) ? x[0] : x` (as `AllBlogsSection.tsx:60` already does). | `app/products/category/[slug]/page.tsx:148-160`, `app/products/page.tsx:185-194`, `app/products/[slug]/page.tsx:728-763`, `app/brands/[slug]/page.tsx:942-950` |
| P-2 | **H** | Unsanitised HTML on public pages (see C-1); `EmbedRenderer` builds markup with unescaped `${url}` from `data-url`. | `app/components/EmbedRenderer.tsx:28,101-127`, `app/blogs/[slug]/page.tsx:457` |
| P-3 | M | Soft-deleted setups still served: no `deleted_at` filter on setup detail, related setups, `/[category]`, and sitemap. Blogs/brands/products do filter it. | `app/setups/[slug]/page.tsx:51-53,147-156`, `app/[category]/page.tsx:104`, `app/sitemap.ts:154-157` |
| P-4 | M | Newsletter: 3 components + 2 dead inline `<form>`s, all inserting from the browser, no server validation/rate-limit/double-opt-in. | `NewsletterForm.tsx:20`, `NewsletterSubscribe.tsx:174`, `SubscribeSection.tsx:23`, `app/setups/[slug]/page.tsx:342-355`, `app/blogs/[slug]/page.tsx:501-516` |
| P-5 | M | Broken links: footer product categories → `/products?category=` (page ignores it; real route is `/products/category/[slug]`); `/privacy`, `/terms`, `/report-abuse` linked site-wide but don't exist (each 404 costs a DB lookup via `/[category]`). | `app/components/Footer.tsx:310-312,359-378` |
| P-6 | M | `BlogRelatedContent` renders product/brand images with `next/image`; any host outside `remotePatterns` throws at render → `/blogs/[slug]` crash. | `app/components/blog/BlogRelatedContent.tsx:81-87,155-161` |
| P-7 | M | Double fetch per request: `getSetup/getBlog/getBrand/getProduct/getCategory` run in `generateMetadata` and again in the page without React `cache()`. | all `[slug]` pages |
| P-8 | M | Navbar + Footer are client components mounted per page, each fetching categories on mount (3 anon requests per navigation, layout shift). | `Navbar.tsx:227-248`, `Footer.tsx:129-177` |
| P-9 | M | JSON-LD without `</` escaping on brands/products/category pages (setups/blogs escape correctly). | `app/brands/[slug]/page.tsx:775-797`, `app/products/[slug]/page.tsx:867-878` |
| P-10 | L | `about/page.js`: no `metadata`, only `.js` route, brands site as "DeskScrolls"; title suffix `| DeskScroll` doubled with layout template on 7 pages; `/blogs` list is client-only (empty for crawlers); unbounded queries (1000-row cap) on brands/products/category/sitemap; deprecated `priority` prop in 4 places. | various |
| P-11 | L | `/profile` is hard-coded mock data; `/post/new` "Publish" is a `setTimeout` + `alert`. Both public, not in robots disallow. | `app/profile/page.tsx:7-45`, `app/post/new/page.tsx:14-21` |

---

## 7. Dead code inventory

| Item | Size | Action |
|---|---|---|
| `app/components/SubmitForm.tsx` | 8,325 lines (6,369 commented), still imported | delete, remove import |
| Commented-out previous versions in 25+ files (`products/[slug]` 492, `brands/[slug]` 463, `SubmissionsTable` 383, `admin/new` 318, `EditBrandForm` 251, `BrandForm` 204, `about` 179, `blogs/new/actions` 175, `product-categories/page` 168, `brands/page` 168, `Navbar` 166, `AllSetupsSection` 137, `proxy.ts` 135, `blogs/page` 111, `Footer` 90, `NewsletterSubscribe` 89, `next.config.js` 76, …) | ≈13,000 lines | delete – git history keeps them |
| `app/admin/AdminTable.tsx` + `app/admin/actions.tsx` (hard delete) | unused | delete |
| `app/components/FeaturedSection.tsx` → `BlogCard.tsx` → `lib/supabase/getSetups.ts` | unused chain | delete |
| `app/components/Editor.tsx`, `PostEditor.tsx` | unused editors | delete |
| `app/data/posts.json`, `app/data/setups.json` | unused | delete |
| `SubscribeSection` variants `default`/`social-proof`, `NewsletterForm` | unused / duplicate | consolidate to one |
| `app/profile`, `app/post/new` | mock pages | delete or gate behind feature flag |
| `public/next.svg, vercel.svg, file.svg, globe.svg, window.svg, 5–10.svg, D.svg` | CNA leftovers | delete |
| `workprogress.md`, `themeidea.md`, `importantschanges.md` | chat logs | move to `docs/notes/` or delete |

---

## 8. What is good (keep doing this)

* `app/admin/setup-product-actions.ts` + `app/lib/setup-products.ts` + `tests/setup-products.test.cjs` + `docs/setup-products.md`: guarded server action, UUID validation, ownership check, pagination, revalidation of public paths, 15 tests. **This is the pattern every other write path should copy.**
* `app/admin/product-categories/**`: slugify, parent validation, 23505 handling, usage guard before delete.
* `AllSetupsSection` SSR-first + client load-more; `generateMetadata` + canonical on all dynamic pages; `robots.ts` disallows auth/admin; `proxy.ts` is the correct Next 16 convention; mobile cards + desktop tables in admin.
* `app/lib/utils/supabase-uploads.ts` does client-side WebP optimisation, size caps and safe filenames.

---

## 9. Top-15 priority list (whole repo)

| # | Sev | Fix | Effort |
|---|---|---|---|
| 1 | H | Delete the duplicate `SignupPage` (lines 107–267) → build green. | 5 min |
| 2 | H | Verify RLS on `profiles`, `setups*`, `submissions`, `newsletter_subscribers`, storage buckets (checklist file). | 1 h |
| 3 | H | Move `/admin/users` role changes into an admin-only server action. | 1 h |
| 4 | H | Lock down `uploadMedia`: MIME whitelist, size, rate-limit, random folder id ≥ 12 chars, or switch `/submit` to Supabase Storage via a signed-upload server action. | 2 h |
| 5 | H | Move `/submit` insert into a server action with validation + honeypot + rate limit; force `status='pending'`. | 3 h |
| 6 | H | Fix to-one embed `?.[0]` handling on products/brands pages (+ admin products list). | 1 h |
| 7 | H | Sanitise rich-text HTML on save (and on render) with `isomorphic-dompurify`; escape `</` in JSON-LD; validate `href` URLs. | 3 h |
| 8 | M | "Convert submission → setup" action: pre-fill `/admin/new` from a submission, copy images to Supabase Storage, store `submissions.setup_id`, mark approved. | 1 day |
| 9 | M | `await searchParams` in `admin/posts/page.tsx`; revalidate public paths in publish/trash/restore actions. | 30 min |
| 10 | M | Centralise role checks (`lib/auth.ts` permission matrix incl. `status='active'`); give `manager` the rights the sidebar promises. | 2 h |
| 11 | M | Add `deleted_at` filters to setup detail/related/category/sitemap queries. | 30 min |
| 12 | M | Move setup create/edit writes into server actions (reuse `saveSetupProducts` pattern); dedupe the draft/submit handlers; real "Publish" on create. | 1 day |
| 13 | M | Public caching: cookie-less anon client + `cache()`/`'use cache'` for public reads; Navbar/Footer into layout as server components. | 1 day |
| 14 | M | Footer links (`/products/category/[slug]`, legal pages), one newsletter server action, `BlogRelatedContent` image host guard, `not-found.tsx`. | 3 h |
| 15 | L | Dead-code purge (~13k lines), delete unused components/pages/JSON, README rewrite, `npm test` script, lint fixes. | 3 h |

See `docs/ROADMAP.md` for these grouped into phases.
