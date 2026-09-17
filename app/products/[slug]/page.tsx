import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServerSupabase } from '@/lib/supabase/server'

export const revalidate = 300

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string) {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      short_description,
      content,
      cover_image_url,
      product_type,
      price_text,
      buy_url,
      cta_text,
      meta_title,
      meta_description,
      featured,
      sponsored,
      published_at,
      updated_at,
      brand:brands (
        id,
        name,
        slug,
        logo_url,
        website_url
      ),
      product_category_links (
        is_primary,
        category:product_categories (
          id,
          name,
          slug
        )
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) {
    console.error(
      'Failed to load product:',
      error.message
    )

    return null
  }

  return data
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Product Not Found | DeskScroll',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title =
    product.meta_title ||
    `${product.name} | DeskScroll`

  const description =
    product.meta_description ||
    product.short_description ||
    `Explore ${product.name}, product details, features and workspace recommendations on DeskScroll.`

  return {
    title,
    description,

    alternates: {
      canonical: `/products/${product.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'article',
      url: `/products/${product.slug}`,
      images: product.cover_image_url
        ? [
            {
              url: product.cover_image_url,
              alt: product.name,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.cover_image_url
        ? [product.cover_image_url]
        : undefined,
    },
  }
}

export default async function ProductPage({
  params,
}: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const primaryCategory =
    product.product_category_links?.find(
      (link) => link.is_primary
    )?.category || null

  const otherCategories =
    product.product_category_links
      ?.filter((link) => !link.is_primary)
      .map((link) => link.category)
      .filter(Boolean) || []

  const siteUrl = 'https://deskscroll.com'

  const productUrl =
    `${siteUrl}/products/${product.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',

    name: product.name,

    url: productUrl,

    description:
      product.meta_description ||
      product.short_description ||
      undefined,

    image: product.cover_image_url
      ? [product.cover_image_url]
      : undefined,

    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand.name,
        }
      : undefined,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',

    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${siteUrl}/products`,
      },
      ...(primaryCategory
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: primaryCategory.name,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: primaryCategory ? 4 : 3,
        name: product.name,
        item: productUrl,
      },
    ],
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbJsonLd
            ),
          }}
        />

        {/* Breadcrumb */}
        <div className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Link
                href="/"
                className="hover:text-black"
              >
                Home
              </Link>

              <span>/</span>

              <Link
                href="/products"
                className="hover:text-black"
              >
                Products
              </Link>

              {primaryCategory && (
                <>
                  <span>/</span>

                  <span>
                    {primaryCategory.name}
                  </span>
                </>
              )}

              <span>/</span>

              <span className="text-gray-900">
                {product.name}
              </span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
              {/* Image */}
              <div className="bg-gray-100 rounded-2xl overflow-hidden">
                <div className="aspect-[4/3]">
                  {product.cover_image_url ? (
                    <img
                      src={
                        product.cover_image_url
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No product image
                    </div>
                  )}
                </div>
              </div>

              {/* Product information */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {primaryCategory && (
                    <span className="text-xs border rounded-full px-2.5 py-1 text-gray-600">
                      {primaryCategory.name}
                    </span>
                  )}

                  {product.featured && (
                    <span className="text-xs border rounded-full px-2.5 py-1 text-gray-600">
                      Featured
                    </span>
                  )}

                  {product.sponsored && (
                    <span className="text-xs border rounded-full px-2.5 py-1 text-gray-600">
                      Sponsored
                    </span>
                  )}
                </div>

                {product.brand && (
                  <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                    {product.brand.name}
                  </p>
                )}

                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                  {product.name}
                </h1>

                {product.short_description && (
                  <p className="text-gray-600 text-base sm:text-lg leading-7 mt-5">
                    {product.short_description}
                  </p>
                )}

                {product.price_text && (
                  <p className="text-xl font-semibold mt-6">
                    {product.price_text}
                  </p>
                )}

                {product.buy_url && (
                  <div className="mt-7">
                    <a
                      href={product.buy_url}
                      target="_blank"
                      rel={
                        product.product_type ===
                        'affiliate'
                          ? 'nofollow sponsored noopener noreferrer'
                          : 'noopener noreferrer'
                      }
                      className="inline-flex items-center justify-center bg-black text-white rounded-lg px-6 py-3 font-medium hover:bg-gray-800"
                    >
                      {product.cta_text ||
                        'View Product'}
                      <span className="ml-2">
                        ↗
                      </span>
                    </a>
                  </div>
                )}

                {product.product_type ===
                  'affiliate' &&
                  product.buy_url && (
                    <p className="text-xs text-gray-500 leading-5 mt-3 max-w-md">
                      DeskScroll may earn a
                      commission when you purchase
                      through links on this page,
                      at no additional cost to you.
                    </p>
                  )}

                {otherCategories.length > 0 && (
                  <div className="mt-7 pt-6 border-t">
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                      Also in
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {otherCategories.map(
                        (category) => (
                          <span
                            key={category.id}
                            className="text-sm text-gray-600"
                          >
                            {category.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Rich product content */}
        {product.content && (
          <section className="border-t">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
              <article
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{
                  __html: product.content,
                }}
              />
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        {product.buy_url && (
          <section className="border-t bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-10 sm:py-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <h2 className="text-xl font-semibold">
                    Interested in{' '}
                    {product.name}?
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Visit the product page for
                    current pricing and
                    availability.
                  </p>
                </div>

                <a
                  href={product.buy_url}
                  target="_blank"
                  rel={
                    product.product_type ===
                    'affiliate'
                      ? 'nofollow sponsored noopener noreferrer'
                      : 'noopener noreferrer'
                  }
                  className="inline-flex shrink-0 items-center justify-center bg-black text-white rounded-lg px-5 py-2.5 font-medium hover:bg-gray-800"
                >
                  {product.cta_text ||
                    'View Product'}
                  <span className="ml-2">
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
    }
