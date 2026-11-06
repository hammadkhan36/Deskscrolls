# DeskScrolls – Architecture & Data Model (reconstructed)

> Generated during the November 2026 repo audit. The repo contains **no SQL migrations and no
> schema file**, so everything below is reconstructed from the queries in `app/**`.
> Treat it as the current *de-facto* contract between the code and the Supabase project
> `eeajrfevqexxmofpstbe`. Keep this file updated when columns/tables change.

## 1. Stack

| Layer | Tech | Notes |
|---|---|---|
| Framework | Next.js 16.2 (App Router, `proxy.ts` instead of `middleware.ts`) | `npm run dev` uses `--webpack`; `next.config.js` has `turbopack: {}` |
| UI | React 19, Tailwind 3.4, framer-motion, lucide-react, react-hot-toast | |
| Rich text | TipTap 2 (`UltimateTipTapEditor`, `RichEditor`, `Editor`, `PostEditor`) | 4 editor components exist, 2 are used |
| Auth + DB | Supabase (`@supabase/ssr`) | Anon key only. **No service-role key anywhere** – every write relies on RLS |
| Storage | Supabase Storage buckets `setups`, `submissions`, `blog-images`; ImageKit for `/submit` uploads | Two different upload backends |
| Hosting | Vercel (implied by `.vercel` in `.gitignore`) | Build currently **fails** (see audit) |

## 2. Route map

### Public
| Route | File | Rendering | Data |
|---|---|---|---|
| `/` | `app/page.tsx` | server | featured + all setups, blogs |
| `/setups` | `app/setups/page.tsx` | server | `setups` (published) |
| `/setups/[slug]` | `app/setups/[slug]/page.tsx` | `force-dynamic` | setup + images + categories + products |
| `/[category]` | `app/[category]/page.tsx` | `force-dynamic` | catch-all category landing (collides with any unknown top-level path) |
| `/blogs`, `/blogs/[slug]` | `app/blogs/**` | server / `force-dynamic` | `blogs`, relations |
| `/brands`, `/brands/[slug]` | `app/brands/**` | ISR 300 s | `brands`, products |
| `/products`, `/products/[slug]`, `/products/category/[slug]` | `app/products/**` | ISR 300 s | `products`, `product_categories` |
| `/about` | `app/about/page.js` | static | hard-coded |
| `/submit` | `app/submit/page.tsx` → `SubmitForm2` | client | inserts `submissions` directly from the browser |
| `/profile` | `app/profile/page.tsx` | client | **mock data only** |
| `/post/new` | `app/post/new/page.tsx` | client | **prototype – publish button is a `setTimeout` + alert** |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | ISR 3600 s | |

### Auth
`/login`, `/signup`, `/forgot-password`, `/reset-password` – all client components using `supabase.auth.*`.

### Admin (`/admin/**`, protected by `proxy.ts` + `app/admin/layout.tsx`)
| Route | Purpose | Roles (sidebar) | Write path |
|---|---|---|---|
| `/admin` | Dashboard counters | admin, manager, author | – |
| `/admin/posts` | Setup list, publish/trash/restore | admin, manager, author | server actions (`posts/actions.ts`) |
| `/admin/new`, `/admin/edit/[id]` | Setup editor | (not in sidebar, reachable by link) | **browser → Supabase directly** + `saveSetupProducts` server action |
| `/admin/submissions` | Review community submissions | admin, manager | server action `updateSubmissionStatus` |
| `/admin/users` | Approve users / change roles | admin | **browser → `profiles` directly** |
| `/admin/blogs/**`, `/admin/blog-categories` | Blog CMS | admin, manager, author / admin, manager | server actions |
| `/admin/brands/**`, `/admin/products/**`, `/admin/product-categories/**`, `/admin/categories` | Catalogue CMS | admin, manager | server actions |

## 3. Roles & access control

```
auth.users ──(trigger, assumed)──> profiles { id, full_name, avatar_url, role, status, created_at }
role   ∈ { pending | author | manager | admin }
status ∈ { pending | active }
```

Three layers enforce admin access, each slightly differently:

| Layer | File | Allows |
|---|---|---|
| Edge | `proxy.ts` | logged in **and** `status = active` **and** `role != pending`; `/admin/users` admin only |
| Layout | `app/admin/layout.tsx` | role ∈ admin/manager/author (ignores `status`) |
| Helper | `app/lib/auth.ts#getAdminUser` | role ∈ admin/manager/author (ignores `status`) |
| Per action | `admin/actions.tsx`, `posts/actions.ts` | admin/author only (**manager excluded**) |
| Per action | `submissions/actions.ts` | admin/manager only |
| Per action | `setup-product-actions.ts` | admin/manager/author, author only for own setup |

There is no single source of truth for "who may do what". See audit finding A-3.

## 4. Data model (reconstructed)

### Core content
```
setups
  id uuid PK, title, slug (unique?), owner_name, short_intro, content (HTML),
  category_id -> categories.id   (primary category, duplicated by setup_categories)
  cover_image_url, published bool, published_at, author_id -> profiles.id,
  deleted_at (soft delete), created_at, updated_at
setup_images        (id, setup_id, image_url, sort_order)
setup_categories    (setup_id, category_id)            -- unique(setup_id, category_id)
setup_products      (setup_id, product_id, sort_order)
categories          (id, name, slug, ...)
```

### Community submissions
```
submissions
  id, email, name, intro, location, description, budget, space_size, favorite_item,
  recent_addition, desired_change, comfort_cable, decorative_touches, software_tools,
  social_profiles jsonb [{platform, handle}], image_urls text[] (ImageKit URLs),
  gear_list jsonb [{name, link}], consent bool, newsletter bool,
  status text ('pending' | 'approved' | 'rejected'), created_at
```
**There is no FK from `submissions` to `setups`.** Approving a submission only flips `status`;
nothing is created in `setups`. The admin must re-type everything in `/admin/new`.

### Blog / catalogue
```
blogs (…, status/published, content HTML, cover, category_id)
blog_categories, blog_setups, blog_products, blog_brands   -- relation tables
products (id, name, slug, published, deleted_at, brand_id, …)
product_categories, product_category_links
brands (id, name, slug, logo, …)
newsletter_subscribers (email, …)
profiles (see §3)
```

### Storage
| Bucket / folder | Written by | Public? |
|---|---|---|
| Supabase `setups/covers`, `setups/gallery` | `app/lib/utils/supabase-uploads.ts` (browser) | yes (getPublicUrl) |
| Supabase `submissions` | legacy `SubmitForm` only | – |
| Supabase `blog-images` | admin blog editor | yes |
| ImageKit `/submissions/<name>-<2 random chars>/` | `app/actions/uploadMedia.ts` (server action, **no auth**) | yes |

## 5. Key flows

### Community submission → published setup (current)
```
/submit (browser)
  ├─ for each image: server action uploadMedia() → ImageKit  (unauthenticated, 5 MB cap)
  └─ supabase.from('submissions').insert(...)                 (anon key, RLS must allow INSERT)
/admin/submissions
  └─ Approve → updateSubmissionStatus(id,'approved')          (status only)
/admin/new  (manual re-entry by admin)                        ← gap: no "convert to setup"
  ├─ browser uploads cover/gallery to Supabase Storage
  ├─ browser upserts `setups` + `setup_categories` + `setup_images`   (RLS must allow)
  └─ server action saveSetupProducts()
/admin/posts → togglePublish()                                (revalidates /admin/posts only)
```

### Cache invalidation
Only `saveSetupProducts` revalidates public paths (`/`, `/setups`, `/setups/[slug]`, `/products`).
`togglePublish`, `softDeleteSetup`, `restoreSetup`, the edit page and the submissions actions
revalidate **admin paths only**. Public ISR pages (brands/products 300 s, sitemap 3600 s) and the
`force-dynamic` pages are therefore inconsistent after publish.

## 6. Conventions worth keeping

* Server actions live next to the route (`actions.ts`), client tables in `*Table.tsx`.
* `@/` maps to `./app/` (tsconfig `paths`), so `@/lib/...` = `app/lib/...`.
* Next 16 conventions: `params`/`searchParams` are **Promises** – always `await` them.
* `proxy.ts` is the Next 16 replacement for `middleware.ts` (do not rename it back).
