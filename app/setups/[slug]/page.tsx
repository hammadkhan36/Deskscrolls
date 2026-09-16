import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import EmbedRenderer from '@/components/EmbedRenderer'

export const dynamic = 'force-dynamic'

const siteUrl = 'https://deskscroll.com'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

async function getSetup(slug: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('setups')
    .select(`
      *,
      primary_category:categories!setups_category_id_fkey(
        id,
        name,
        slug
      ),
      setup_categories(
        category:categories(
          id,
          name,
          slug
        )
      ),
      author:profiles(
        full_name,
        avatar_url
      ),
      setup_images(
        id,
        image_url,
        alt_text,
        sort_order
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const setup = await getSetup(slug)

  if (!setup) {
    return {
      title: 'Setup Not Found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `${setup.owner_name}'s Desk Setup`

  const description =
    setup.short_intro ||
    `Explore ${setup.owner_name}'s desk setup, workspace inspiration, gear, and desk ideas on DeskScroll.`

  const canonicalUrl = `/setups/${setup.slug}`

  const images = setup.cover_image_url
    ? [
        {
          url: setup.cover_image_url,
          alt: `${setup.owner_name}'s desk setup`,
        },
      ]
    : undefined

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      images,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: setup.cover_image_url
        ? [setup.cover_image_url]
        : undefined,
    },
  }
}

export default async function SetupPage({ params }: PageProps) {
  const { slug } = await params
  const setup = await getSetup(slug)

  if (!setup) {
    notFound()
  }

  const supabase = await createServerSupabaseClient()

  const galleryImages = [...(setup.setup_images || [])].sort(
    (a: any, b: any) =>
      (a.sort_order || 0) - (b.sort_order || 0)
  )

  const additionalCategories = (setup.setup_categories || [])
    .filter(
      (item: any) =>
        item.category &&
        item.category.id !== setup.primary_category?.id
    )

  const { data: relatedSetups } = await supabase
    .from('setups')
    .select(
      'id, slug, owner_name, short_intro, cover_image_url'
    )
    .eq('published', true)
    .eq('category_id', setup.category_id)
    .neq('id', setup.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const setupUrl = `${siteUrl}/setups/${setup.slug}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${setup.owner_name}'s Desk Setup`,
    description:
      setup.short_intro ||
      `Explore ${setup.owner_name}'s desk setup on DeskScroll.`,
    url: setupUrl,
    mainEntityOfPage: setupUrl,
    ...(setup.cover_image_url && {
      image: [setup.cover_image_url],
    }),
    ...(setup.published_at && {
      datePublished: setup.published_at,
    }),
    ...(setup.updated_at && {
      dateModified: setup.updated_at,
    }),
    author: {
      '@type': 'Person',
      name:
        setup.author?.full_name ||
        setup.owner_name ||
        'DeskScroll Contributor',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DeskScroll',
      url: siteUrl,
    },
  }

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen bg-[#FAFAF7] pt-8 pb-16"
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(
              /</g,
              '\\u003c'
            ),
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[13px] text-[#6B6B6B] mb-6"
          >
            <Link href="/">Home</Link>

            <span>/</span>

            <Link href="/setups">Setups</Link>

            {setup.primary_category && (
              <>
                <span>/</span>

                <Link href={`/${setup.primary_category.slug}`}>
                  {setup.primary_category.name}
                </Link>
              </>
            )}
          </nav>

          {additionalCategories.length > 0 && (
            <div className="flex gap-2 mt-2 mb-4 flex-wrap">
              {additionalCategories.map((item: any) => (
                <Link
                  key={item.category.id}
                  href={`/${item.category.slug}`}
                  className="text-xs font-semibold uppercase tracking-wider text-[#D97742] hover:text-[#B85C2E] transition-colors bg-white px-2.5 py-1 rounded-full border border-[#E6E1D8]"
                >
                  {item.category.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mb-8 pb-6 border-b border-[#E6E1D8]">
            <h1 className="text-3xl sm:text-[36px] font-bold text-[#1E1E1E] leading-tight mb-3">
              {setup.owner_name}&apos;s Desk Setup
            </h1>

            {setup.short_intro && (
              <p className="text-[#6B6B6B] text-[16px] leading-relaxed">
                {setup.short_intro}
              </p>
            )}

            {setup.primary_category && (
              <Link
                href={`/${setup.primary_category.slug}`}
                className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-[#D97742] hover:text-[#B85C2E] transition-colors"
              >
                {setup.primary_category.name}
              </Link>
            )}
          </div>

          <article className="bg-white border border-[#D97742] rounded-xl p-6 sm:p-8 mb-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            {setup.content && (
              <div
                className="prose prose-neutral max-w-none text-[#1E1E1E]
                prose-headings:font-bold prose-headings:text-[#1E1E1E]
                prose-a:text-[#D97742] hover:prose-a:text-[#B85C2E]
                prose-blockquote:border-4-[#D97742]
                prose-blockquote:text-[#6B6B6B]"
              >
                <EmbedRenderer content={setup.content} />
              </div>
            )}

            {galleryImages.length > 0 && (
              <section className="mt-10">
                <h2 className="text-lg font-semibold text-[#1E1E1E] mb-4">
                  Gallery
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {galleryImages.map((img: any) => (
                    <div
                      key={img.id}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden"
                    >
                      <Image
                        src={img.image_url}
                        alt={
                          img.alt_text ||
                          `${setup.owner_name}'s desk setup`
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          <div className="bg-[#F5EDE4] border border-[#E6E1D8] rounded-xl p-6 text-center mb-6">
            <p className="text-[#1E1E1E] font-medium mb-1">
              Enjoyed this setup? Share it with a friend. ❤️
            </p>

            <p className="text-[#6B6B6B] text-sm">
              Questions or collabs?{' '}
              <a
                href="mailto:hello@deskscrolls.com"
                className="text-[#D97742] hover:text-[#B85C2E] transition-colors underline underline-offset-2"
              >
                hello@deskscrolls.com
              </a>
            </p>
          </div>

          <div className="bg-white border border-[#E6E1D8] rounded-xl p-6 text-center flex flex-col items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#BF6F4A]">
              Never miss a setup
            </p>

            <p className="text-[#1E1E1E] font-medium">
              Get one new workspace delivered every Saturday.
            </p>

            <form className="w-full max-w-sm flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-md border border-[#E6E1D8] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#1E1E1E] placeholder:text-[#6B6B6B] focus:border-[#D97742] focus:outline-none focus:ring-1 focus:ring-[#D97742] transition"
              />

              <button
                type="submit"
                className="rounded-md bg-[#D97742] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B85C2E] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>

      {relatedSetups && relatedSetups.length > 0 && (
        <section className="bg-white border-t border-[#E6E1D8] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-1">
                Related Setups
              </h2>

              <p className="text-[#6B6B6B] text-sm">
                More workspaces from the same category.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSetups.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/setups/${related.slug}`}
                  className="group block"
                >
                  <div className="bg-[#FAFAF7] rounded-xl overflow-hidden border border-[#E6E1D8] hover:border-[#D97742]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-200">
                    <div className="relative aspect-[4/3] w-full bg-[#F5E6D3]">
                      {related.cover_image_url ? (
                        <Image
                          src={related.cover_image_url}
                          alt={`${related.owner_name}'s desk setup`}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-200"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[#6B6B6B] text-sm">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-[15px] font-semibold text-[#1E1E1E] group-hover:text-[#D97742] transition-colors">
                        {related.owner_name}&apos;s Desk Setup
                      </h3>

                      {related.short_intro && (
                        <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2">
                          {related.short_intro}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
