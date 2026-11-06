import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SetupCard from './components/home/SetupCard'
import HeroMosaic from './components/home/HeroMosaic'
import CategoryChips, { type CategoryChip } from './components/home/CategoryChips'
import ShareSetupBand from './components/home/ShareSetupBand'
import { toOne, type HomeSetup } from './components/home/types'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'DeskScroll — Real Desk Setups from the Community',
  description:
    'Browse real desk setups shared by the DeskScroll community: workspace tours, gear lists and the ideas behind how people actually work.',
  alternates: {
    canonical: '/',
  },
}

const SETUP_COLUMNS = `
  id,
  title,
  slug,
  owner_name,
  short_intro,
  cover_image_url,
  featured,
  published_at,
  primary_category:categories!setups_category_id_fkey(name, slug)
`

const HERO_COUNT = 3
const GRID_COUNT = 9
const FEATURED_COUNT = 2

type RawSetup = Omit<HomeSetup, 'primary_category'> & {
  primary_category:
    | HomeSetup['primary_category']
    | NonNullable<HomeSetup['primary_category']>[]
}

function normalise(rows: RawSetup[] | null | undefined): HomeSetup[] {
  return (rows || []).map((row) => ({
    ...row,
    primary_category: toOne(row.primary_category),
  }))
}

async function getHomeData() {
  const supabase = await createServerSupabaseClient()

  const publishedSetups = () =>
    supabase
      .from('setups')
      .select(SETUP_COLUMNS)
      .eq('published', true)
      .is('deleted_at', null)
      .order('published_at', { ascending: false })

  const [latestRes, featuredRes, categoriesRes, usageRes, totalRes] =
    await Promise.all([
      publishedSetups().limit(HERO_COUNT + GRID_COUNT + FEATURED_COUNT),
      publishedSetups().eq('featured', true).limit(FEATURED_COUNT),
      supabase.from('categories').select('id, name, slug').order('name'),
      supabase
        .from('setups')
        .select('category_id')
        .eq('published', true)
        .is('deleted_at', null),
      supabase
        .from('setups')
        .select('id', { count: 'exact', head: true })
        .eq('published', true)
        .is('deleted_at', null),
    ])

  for (const res of [latestRes, featuredRes, categoriesRes, usageRes, totalRes]) {
    if (res.error) console.error('Homepage query failed:', res.error.message)
  }

  const featured = normalise(featuredRes.data as RawSetup[] | null)
  const featuredIds = new Set(featured.map((s) => s.id))
  const latest = normalise(latestRes.data as RawSetup[] | null).filter(
    (s) => !featuredIds.has(s.id)
  )

  const heroSetups = latest.slice(0, HERO_COUNT)
  let gridSetups = latest.slice(HERO_COUNT, HERO_COUNT + GRID_COUNT)
  // Keep the 3-column grid full: trim to a multiple of 3 once we have more than one row.
  if (gridSetups.length > 3) {
    gridSetups = gridSetups.slice(0, Math.floor(gridSetups.length / 3) * 3)
  }

  const usage = new Map<string, number>()
  for (const row of (usageRes.data || []) as { category_id: string | null }[]) {
    if (row.category_id) {
      usage.set(row.category_id, (usage.get(row.category_id) || 0) + 1)
    }
  }

  const categories: CategoryChip[] = (
    (categoriesRes.data || []) as { id: string; name: string; slug: string }[]
  )
    .map((c) => ({ ...c, count: usage.get(c.id) || 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  return {
    featured,
    heroSetups,
    gridSetups,
    categories,
    totalCount: totalRes.count ?? latest.length + featured.length,
    hasError: Boolean(latestRes.error),
  }
}

export default async function HomePage() {
  const { featured, heroSetups, gridSetups, categories, totalCount, hasError } =
    await getHomeData()

  const nothingPublished =
    heroSetups.length === 0 && gridSetups.length === 0 && featured.length === 0

  return (
    <>
      <Navbar />

      <main className="font-sans">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          aria-labelledby="hero-heading"
          className="relative overflow-hidden border-b border-border bg-bg"
        >
          <div
            aria-hidden="true"
            className="absolute -right-28 -top-32 h-96 w-96 rounded-full bg-primary-light blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-surface-alt blur-3xl"
          />

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                />
                Community desk setups
              </p>

              <h1
                id="hero-heading"
                className="max-w-2xl text-balance text-4xl font-bold leading-[1.05] tracking-[-1.5px] text-text-1 sm:text-5xl lg:text-6xl"
              >
                Real desks, shared by{' '}
                <span className="font-brand italic text-brand-accent">
                  real people.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-text-2 sm:text-lg">
                DeskScroll is a hand-reviewed collection of workspace tours from
                the community: the desks, the gear and the small decisions
                behind how people actually work.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/setups"
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Browse all setups
                </Link>
                <Link
                  href="/submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-1 transition-colors hover:border-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Share your setup
                </Link>
              </div>

              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                    Setups
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tracking-tight text-text-1">
                    {totalCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                    Categories
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tracking-tight text-text-1">
                    {categories.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                    Reviewed
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tracking-tight text-text-1">
                    By hand
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mx-auto w-full max-w-lg lg:max-w-none">
              <HeroMosaic setups={heroSetups} />
            </div>
          </div>
        </section>

        {/* ── Browse by category ───────────────────────────────── */}
        {categories.length > 0 && (
          <section
            aria-labelledby="categories-heading"
            className="border-b border-border bg-surface"
          >
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="mb-4 flex items-end justify-between gap-4">
                <h2
                  id="categories-heading"
                  className="text-sm font-semibold uppercase tracking-[0.18em] text-text-2"
                >
                  Browse by category
                </h2>
              </div>
              <CategoryChips categories={categories} totalCount={totalCount} />
            </div>
          </section>
        )}

        {/* ── Featured setups ──────────────────────────────────── */}
        {featured.length > 0 && (
          <section
            aria-labelledby="featured-heading"
            className="bg-surface-alt/60 py-16 sm:py-20"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                  Editor&rsquo;s picks
                </p>
                <h2
                  id="featured-heading"
                  className="text-2xl font-bold tracking-[-0.6px] text-text-1 sm:text-3xl"
                >
                  Featured setups
                </h2>
              </div>

              <div
                className={`grid gap-6 ${
                  featured.length > 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-[2fr_1fr]'
                }`}
              >
                {featured.map((setup) => (
                  <SetupCard
                    key={setup.id}
                    setup={setup}
                    variant="featured"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Latest from the community ────────────────────────── */}
        <section
          aria-labelledby="latest-heading"
          className="bg-surface py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                  Fresh on DeskScroll
                </p>
                <h2
                  id="latest-heading"
                  className="text-2xl font-bold tracking-[-0.6px] text-text-1 sm:text-3xl"
                >
                  Latest community setups
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-2 sm:text-base">
                  New workspaces, straight from the people who built them.
                </p>
              </div>

              <Link
                href="/setups"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-dark transition-colors hover:text-primary"
              >
                View all setups <span aria-hidden="true">→</span>
              </Link>
            </div>

            {hasError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700">
                We couldn&rsquo;t load the latest setups right now. Please
                refresh the page.
              </p>
            ) : nothingPublished ? (
              <div className="rounded-2xl border border-dashed border-border bg-bg px-6 py-14 text-center">
                <p className="font-brand text-2xl italic text-brand-accent">
                  Be the first.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-text-2">
                  No setups have been published yet. Share yours and it could be
                  the one everybody sees first.
                </p>
                <Link
                  href="/submit"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Submit your desk setup
                </Link>
              </div>
            ) : gridSetups.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridSetups.map((setup) => (
                  <SetupCard key={setup.id} setup={setup} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-border bg-bg px-5 py-8 text-center text-sm text-text-2">
                Everything we have is already on display above. More setups are
                coming soon.
              </p>
            )}

            {!nothingPublished && !hasError && (
              <div className="mt-12 text-center">
                <Link
                  href="/setups"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-border bg-surface px-8 py-3 text-sm font-semibold text-text-1 transition-colors hover:border-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Browse all {totalCount > 0 ? totalCount : ''} setups
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── Share your setup ─────────────────────────────────── */}
        <ShareSetupBand />
      </main>

      <Footer />
    </>
  )
}
