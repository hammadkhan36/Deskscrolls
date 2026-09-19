// import type { Metadata } from 'next'
// import Navbar from './components/Navbar'
// import NewsletterSubscribe from './components/NewsletterSubscribe'
// import FeaturedSection from './components/FeaturedSection'
// import SubscribeSection from './components/SubscribeSection'
// import Footer from './components/Footer'

// export const metadata: Metadata = {
//   title: 'DeskScroll — Desk Setups, Workspace Gear & Inspiration',
//   description:
//     'Discover desk setups, workspace inspiration, products, brands and ideas for building a better workspace.',
//   alternates: {
//     canonical: '/',
//   },
// }

// export default function HomePage() {
//   return (
//     <>
//       <Navbar />

//       <main>
//         <NewsletterSubscribe />

//         <FeaturedSection
//           categorySlug="all"
//           limit={6}
//         />

//         <SubscribeSection variant="default" />

//         <SubscribeSection variant="social-proof" />
//       </main>

//       <Footer />
//     </>
//   )
// }








import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NewsletterSubscribe from './components/NewsletterSubscribe'
import { createServerSupabase } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title:
    'DeskScroll — Desk Setups, Workspace Gear & Inspiration',
  description:
    'Discover real desk setups, workspace products, brands and practical ideas for building a better workspace.',
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

type FeaturedProduct = {
  id: string
  name: string
  slug: string
  short_description: string | null
  cover_image_url: string | null
  price_text: string | null
  cta_text: string | null
  brand:
    | {
        name: string
        slug: string
      }
    | null
}

type ProductCategory = {
  id: string
  name: string
  slug: string
  description: string | null
}

type FeaturedBrand = {
  id: string
  name: string
  slug: string
  short_description: string | null
  logo_url: string | null
  cover_image_url: string | null
}

type LatestBlog = {
  id: string
  title: string
  slug: string
  short_intro: string | null
  cover_image_url: string | null
  published_at: string | null
  reading_time: number | null
  category:
    | {
        name: string
        slug: string
      }
    | null
}

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
  href: string
  linkLabel: string
}

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: SectionHeadingProps) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BF6F4A]">
          {eyebrow}
        </p>

        <h2 className="text-2xl font-bold tracking-[-0.6px] text-[#1E1E1E] sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6B6B] sm:text-base">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#B85C2E] transition-colors hover:text-[#8F4526]"
      >
        {linkLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

function MissingImage({
  label,
}: {
  label: string
}) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#EEEAE3] px-4 text-center text-sm text-[#8A8177]">
      {label}
    </div>
  )
}

function formatPublishedDate(
  publishedAt: string | null
) {
  if (!publishedAt) {
    return null
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(publishedAt))
}

export default async function HomePage() {
  const supabase = await createServerSupabase()

  const [
    setupsResult,
    productsResult,
    categoriesResult,
    brandsResult,
    blogsResult,
  ] = await Promise.all([
    supabase
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
      .limit(6),

    supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        short_description,
        cover_image_url,
        price_text,
        cta_text,
        brand:brands (
          name,
          slug
        )
      `)
      .eq('published', true)
      .is('deleted_at', null)
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(6),

    supabase
      .from('product_categories')
      .select(`
        id,
        name,
        slug,
        description
      `)
      .eq('published', true)
      .is('parent_id', null)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
      .limit(8),

    supabase
      .from('brands')
      .select(`
        id,
        name,
        slug,
        short_description,
        logo_url,
        cover_image_url
      `)
      .eq('published', true)
      .is('deleted_at', null)
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(6),

    supabase
      .from('blogs')
      .select(`
        id,
        title,
        slug,
        short_intro,
        cover_image_url,
        published_at,
        reading_time,
        category:blog_categories (
          name,
          slug
        )
      `)
      .eq('published', true)
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(6),
  ])

  const setups =
    (setupsResult.data || []) as FeaturedSetup[]

  const products =
    (productsResult.data || []) as FeaturedProduct[]

  const categories =
    (categoriesResult.data || []) as ProductCategory[]

  const brands =
    (brandsResult.data || []) as FeaturedBrand[]

  const blogs =
    (blogsResult.data || []) as LatestBlog[]

  return (
    <>
      <Navbar />

      <main
        style={{
          fontFamily:
            'Inter, system-ui, sans-serif',
        }}
      >
        <section className="relative overflow-hidden border-b border-[#E6E1D8] bg-[#FAFAF7]">
          <div
            aria-hidden="true"
            className="absolute -right-28 -top-32 h-96 w-96 rounded-full bg-[#F5E6D3] blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-[#EEE8DF] blur-3xl"
          />

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BF6F4A]">
                Workspaces worth exploring
              </p>

              <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-1.5px] text-[#1E1E1E] sm:text-5xl lg:text-6xl">
                Build a workspace that helps you do your
                best work.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#6B6B6B] sm:text-lg">
                Explore real desk setups, carefully selected
                gear, useful brands and practical workspace
                guides.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/setups"
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#D97742] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B85C2E]"
                >
                  Explore desk setups
                </Link>

                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#D9D2C7] bg-white px-6 py-3 text-sm font-semibold text-[#1E1E1E] transition-colors hover:border-[#D97742] hover:text-[#B85C2E]"
                >
                  Browse workspace gear
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              {setups[0]?.cover_image_url ? (
                <Link
                  href={`/setups/${setups[0].slug}`}
                  className="group block overflow-hidden rounded-3xl border border-[#E6E1D8] bg-white p-2 shadow-[0_24px_70px_rgba(72,57,41,0.16)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#EEEAE3]">
                    <Image
                      src={setups[0].cover_image_url}
                      alt={setups[0].title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-6 pt-20">
                      <p className="text-xs font-medium uppercase tracking-wider text-white/75">
                        Featured setup
                      </p>

                      <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                        {setups[0].title}
                      </h2>

                      <p className="mt-1 text-sm text-white/75">
                        By {setups[0].owner_name}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-[#E6E1D8] bg-[#F4F0E9] p-8 text-center">
                  <div>
                    <p
                      className="text-3xl italic text-[#BF6F4A]"
                      style={{
                        fontFamily:
                          '"Playfair Display", Georgia, serif',
                      }}
                    >
                      DeskScroll
                    </p>

                    <p className="mt-3 text-sm text-[#6B6B6B]">
                      Workspace inspiration for modern
                      creators.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Real workspaces"
              title="Featured Setups"
              description="Explore inspiring desks and the stories behind how people work."
              href="/setups"
              linkLabel="View all setups"
            />

            {setups.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {setups.map((setup) => (
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

                      <h3 className="mt-2 text-xl font-semibold text-[#1E1E1E]">
                        {setup.title}
                      </h3>

                      {setup.short_intro && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B6B6B]">
                          {setup.short_intro}
                        </p>
                      )}

                      <span className="mt-4 inline-flex text-sm font-semibold text-[#B85C2E]">
                        View setup →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-[#E6E1D8] bg-[#FAFAF7] p-6 text-sm text-[#6B6B6B]">
                Featured setups will appear here when they
                are published.
              </p>
            )}
          </div>
        </section>

        <section className="border-y border-[#E6E1D8] bg-[#F7F3ED] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Workspace gear"
              title="Featured Products"
              description="Useful products selected for comfortable, focused and practical workspaces."
              href="/products"
              linkLabel="View all products"
            />

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group overflow-hidden rounded-2xl border border-[#E0D9CF] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(30,30,30,0.1)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EEEAE3]">
                      {product.cover_image_url ? (
                        <Image
                          src={product.cover_image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <MissingImage label="Product image coming soon" />
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {product.brand && (
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8177]">
                              {product.brand.name}
                            </p>
                          )}

                          <h3 className="mt-1 text-lg font-semibold text-[#1E1E1E]">
                            {product.name}
                          </h3>
                        </div>

                        {product.price_text && (
                          <span className="shrink-0 text-sm font-semibold text-[#B85C2E]">
                            {product.price_text}
                          </span>
                        )}
                      </div>

                      {product.short_description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B6B6B]">
                          {product.short_description}
                        </p>
                      )}

                      <span className="mt-4 inline-flex text-sm font-semibold text-[#B85C2E]">
                        {product.cta_text || 'View product'} →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-[#E0D9CF] bg-white p-6 text-sm text-[#6B6B6B]">
                Featured products will appear here when they
                are published.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Browse by type"
              title="Product Categories"
              description="Find the right gear for each part of your desk and workspace."
              href="/products"
              linkLabel="Browse products"
            />

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${encodeURIComponent(
                      category.slug
                    )}`}
                    className="group rounded-2xl border border-[#E6E1D8] bg-[#FAFAF7] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#D97742] hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E6D3] text-lg font-bold text-[#B85C2E]">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-[#1E1E1E]">
                      {category.name}
                    </h3>

                    {category.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B6B6B]">
                        {category.description}
                      </p>
                    )}

                    <span className="mt-4 inline-flex text-sm font-semibold text-[#B85C2E]">
                      Explore category →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-[#E6E1D8] bg-[#FAFAF7] p-6 text-sm text-[#6B6B6B]">
                Product categories will appear here when
                they are available.
              </p>
            )}
          </div>
        </section>

        <section className="border-y border-[#E6E1D8] bg-[#1E1E1E] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E6A178]">
                  Makers and brands
                </p>

                <h2 className="text-2xl font-bold tracking-[-0.6px] text-white sm:text-3xl">
                  Featured Brands
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                  Discover brands creating thoughtful tools
                  for better workspaces.
                </p>
              </div>

              <Link
                href="/brands"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#E6A178] hover:text-white"
              >
                View all brands →
              </Link>
            </div>

            {brands.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.slug}`}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.1]"
                  >
                    {brand.cover_image_url && (
                      <div className="relative aspect-[16/7] overflow-hidden">
                        <Image
                          src={brand.cover_image_url}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex h-12 w-28 items-center">
                        {brand.logo_url ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={brand.logo_url}
                              alt={`${brand.name} logo`}
                              fill
                              sizes="112px"
                              className="object-contain object-left brightness-0 invert"
                            />
                          </div>
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#1E1E1E]">
                            {brand.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>

                      <h3 className="mt-5 text-xl font-semibold text-white">
                        {brand.name}
                      </h3>

                      {brand.short_description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">
                          {brand.short_description}
                        </p>
                      )}

                      <span className="mt-4 inline-flex text-sm font-semibold text-[#E6A178]">
                        Explore brand →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-white/10 bg-white/[0.06] p-6 text-sm text-white/65">
                Featured brands will appear here when they
                are published.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Ideas and guides"
              title="Latest from the Blog"
              description="Workspace ideas, product guides and practical advice for improving how you work."
              href="/blogs"
              linkLabel="Read all articles"
            />

            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => {
                  const publishedDate =
                    formatPublishedDate(
                      blog.published_at
                    )

                  return (
                    <Link
                      key={blog.id}
                      href={`/blogs/${blog.slug}`}
                      className="group overflow-hidden rounded-2xl border border-[#E6E1D8] bg-[#FAFAF7] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(30,30,30,0.1)]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {blog.cover_image_url ? (
                          <Image
                            src={blog.cover_image_url}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <MissingImage label="Article image coming soon" />
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#8A8177]">
                          {blog.category && (
                            <span className="text-[#BF6F4A]">
                              {blog.category.name}
                            </span>
                          )}

                          {publishedDate && (
                            <>
                              <span aria-hidden="true">
                                •
                              </span>
                              <span>
                                {publishedDate}
                              </span>
                            </>
                          )}

                          {blog.reading_time && (
                            <>
                              <span aria-hidden="true">
                                •
                              </span>
                              <span>
                                {blog.reading_time} min read
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="mt-3 text-xl font-semibold leading-snug text-[#1E1E1E]">
                          {blog.title}
                        </h3>

                        {blog.short_intro && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B6B6B]">
                            {blog.short_intro}
                          </p>
                        )}

                        <span className="mt-4 inline-flex text-sm font-semibold text-[#B85C2E]">
                          Read article →
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-[#E6E1D8] bg-[#FAFAF7] p-6 text-sm text-[#6B6B6B]">
                Latest articles will appear here when they
                are published.
              </p>
            )}
          </div>
        </section>

        <NewsletterSubscribe />
      </main>

      <Footer />
    </>
  )
}
