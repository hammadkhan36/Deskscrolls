# DeskScrolls

Curated desk-setup tours: the community submits their workspace on `/submit`, staff review it in
`/admin/submissions`, and published setups appear on the public site together with the products,
brands and blog posts that reference them.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind 3**, **TipTap** and **Supabase**
(auth, Postgres, storage). Image uploads for the public submission form go to **ImageKit**.

> This Next.js version differs from older tutorials – read `AGENTS.md` and
> `node_modules/next/dist/docs/` before changing framework-level code (`proxy.ts`, async `params`, …).

## Getting started

```bash
cp .env.example .env.local   # fill in Supabase + ImageKit keys
npm ci
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run lint                                   # eslint
npx tsc --noEmit                               # type check
node --test tests/setup-products.test.cjs      # unit tests (no DB needed)
npm run build                                  # production build
```

## Project layout

```
app/
  page.tsx, setups/, [category]/, blogs/, brands/, products/   public site
  submit/            community submission form (SubmitForm2)
  admin/             dashboard, posts (setups), submissions, users, blogs, brands, products, categories
  login|signup|forgot-password|reset-password
  components/        shared UI (Navbar, Footer, editors, cards, sections)
  lib/               supabase clients, auth helper, setup-products logic, upload helper
  actions/           uploadMedia (ImageKit) server action
proxy.ts             Next 16 request proxy – protects /admin/*
docs/                ARCHITECTURE.md, AUDIT_REPORT.md, ROADMAP.md, SECURITY_RLS_CHECKLIST.md, setup-products.md
tests/               node:test suite for setup ↔ product sync
```

## Roles

`profiles.role` ∈ `pending | author | manager | admin`, `profiles.status` ∈ `pending | active`.
New sign-ups are `pending` until an admin approves them in `/admin/users`. See
`docs/ARCHITECTURE.md` §3 for which role may do what, and `docs/SECURITY_RLS_CHECKLIST.md` for the
database policies the app relies on.

## Documentation

* `docs/AUDIT_REPORT.md` – full code audit (Nov 2026) with prioritised findings
* `docs/ROADMAP.md` – phased fix plan derived from the audit
* `docs/ARCHITECTURE.md` – routes, data model, flows
* `docs/SECURITY_RLS_CHECKLIST.md` – Supabase policies to verify
* `docs/setup-products.md` – setup ↔ product relationship feature
