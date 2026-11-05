import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NewsletterSubscribe from './components/NewsletterSubscribe'
import { createServerSupabase } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'DeskScroll — Real Desk Setups & Workspace Inspiration',
  description:
    'Explore real desk setups, workspace tours and practical inspiration from creators, builders and professionals.',
  alternates: {
    canonical: '/',
  },
}

type FeaturedSetup = {
  id: string
  title: string
  slug: string
  owner_name: string
  short_intro: string | null
  cover_image_url: string | null
}

function MissingImage({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#EEEAE3] px-4 text-center text-sm text-[#8A8177]">
      {label}
    </div>
  )
}

export default async function HomePage() {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('setups')
    .select(`
      id,
      title,
      slug,
      owner_name,
      short_intro,
      cover_image_url
    `)
    .eq('published', true)
    .is('deleted_at', null)
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(7)

  if (error) {
    console.error('Failed to load homepage setups:', error)
  }

  const setups = (data || []) as FeaturedSetup[]
  const heroSetup = setups[0] || null
  const featuredSetups = setups.slice(1, 7)

  return (
    <>
      <Navbar />

      <main style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <section className="relative overflow-hidden border-b border-[#E6E1D8] bg-[#FAFAF7]">
          <div
            aria-hidden="true"
            className="absolute -right-28 -top-32 h-96 w-96 rounded-full bg-[#F5E6D3] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-[#EEE8DF] blur-3xl"
          />

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BF6F4A]">
                Real desks. Real people. Real inspiration.
              </p>

              <h1 className="max-w-3xl text-4xl font-bold leading-[1.07] tracking-[-1.5px] text-[#1E1E1E] sm:text-5xl lg:text-6xl">
                Explore how people build spaces where great work happens.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#6B6B6B] sm:text-lg">
                DeskScroll is a curated collection of real desk setups and
                workspace tours — the desks, tools and ideas behind how people
                actually work.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/setups"
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#D97742] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B85C2E]"
                >
                  Explore desk setups
                </Link>

                <Link
                  href="/submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#D9D2C7] bg-white px-6 py-3 text-sm font-semibold text-[#1E1E1E] transition-colors hover:border-[#D97742] hover:text-[#B85C2E]"
                >
                  Share your setup
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#E6E1D8] pt-5 text-xs font-medium text-[#8A8177]">
                <span>Curated workspace tours</span>
                <span>Real setup photos</span>
                <span>New setups regularly</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              {heroSetup?.cover_image_url ? (
                <Link
                  href={`/setups/${heroSetup.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-[#E6E1D8] bg-white p-2 shadow-[0_24px_70px_rgba(72,57,41,0.16)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#EEEAE3]">
                    <Image
                      src={heroSetup.cover_image_url}
                      alt={heroSetup.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-6 pt-24">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                        Featured workspace
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                        {heroSetup.title}
                      </h2>
                      <p className="mt-1 text-sm text-white/75">
                        Setup by {heroSetup.owner_name}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-[#E6E1D8] bg-[#F4F0E9] p-8 text-center">
                  <div>
                    <p
                      className="text-3xl italic text-[#BF6F4A]"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      DeskScroll
                    </p>
                    <p className="mt-3 text-sm text-[#6B6B6B]">
                      Real workspace inspiration, one desk at a time.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BF6F4A]">
                  Workspace tours
                </p>
                <h2 className="text-2xl font-bold tracking-[-0.6px] text-[#1E1E1E] sm:text-3xl">
                  Explore Desk Setups
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6B6B] sm:text-base">
                  Step inside real workspaces and discover the details, choices
                  and ideas behind each setup.
                </p>
              </div>

              <Link
                href="/setups"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#B85C2E] transition-colors hover:text-[#8F4526]"
              >
                Browse all setups <span aria-hidden="true">→</span>
              </Link>
            </div>

            {featuredSetups.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredSetups.map((setup) => (
                  <Link
                    key={setup.id}
                    href={`/setups/${setup.slug}`}
                    className="group overflow-hidden rounded-2xl border border-[#E6E1D8] bg-[#FAFAF7] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(30,30,30,0.1)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {setup.cover_image_url ? (
                        <Image
                          src={setup.cover_image_url}
                          alt={setup.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <MissingImage label="Setup image coming soon" />
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF6F4A]">
                        Setup by {setup.owner_name}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold leading-snug text-[#1E1E1E]">
                        {setup.title}
                      </h3>
                      {setup.short_intro && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B6B6B]">
                          {setup.short_intro}
                        </p>
                      )}
                      <span className="mt-4 inline-flex text-sm font-semibold text-[#B85C2E]">
                        Explore workspace →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-[#E6E1D8] bg-[#FAFAF7] p-6 text-sm text-[#6B6B6B]">
                More desk setups are coming soon.
              </p>
            )}

            <div className="mt-10 text-center">
              <Link
                href="/setups"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#D9D2C7] bg-white px-6 py-2.5 text-sm font-semibold text-[#1E1E1E] transition-colors hover:border-[#D97742] hover:text-[#B85C2E]"
              >
                View all desk setups
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-[#E6E1D8] bg-[#F7F3ED]">
          <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BF6F4A]">
              Your desk belongs here too
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.5px] text-[#1E1E1E] sm:text-3xl">
              Built a workspace you love?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6B6B6B] sm:text-base">
              Share your setup with DeskScroll and help others discover new
              ideas for their own workspace.
            </p>
            <Link
              href="/submit"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[#1E1E1E] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#383838]"
            >
              Submit your desk setup
            </Link>
          </div>
        </section>

        <NewsletterSubscribe />
      </main>

      <Footer />
    </>
  )
}
