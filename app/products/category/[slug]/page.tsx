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

async function getCategory(slug: string) {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('product_categories')
    .select(`
      id,
      name,
      slug,
      description,
      meta_title,
      meta_description,
      parent_id
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    console.error(
      'Failed to load product category:',
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
  const category = await getCategory(slug)

  if (!category) {
    return {
      title: 'Category Not Found | DeskScroll',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title =
    category.meta_title ||
    `${category.name} | DeskScroll Products`

  const description =
    category.meta_description ||
    category.description ||
    `Discover ${category.name.toLowerCase()} for desk setups, workspaces and productivity on DeskScroll.`

  return {
    title,
    description,

    alternates: {
      canonical: `/products/category/${category.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'website',
      url: `/products/category/${category.slug}`,
    },

    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function ProductCategoryPage({
  params,
}: PageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const supabase = await createServerSupabase()

  const { data: links, error } = await supabase
    .from('product_category_links')
    .select(`
      is_primary,
      product:products (
        id,
        name,
        slug,
        short_description,
        cover_image_url,
        product_type,
        price_text,
        featured,
        sponsored,
        published,
        deleted_at,
        published_at,
        brand:brands (
          id,
          name,
          slug
        )
      )
    `)
    .eq('category_id', category.id)

  if (error) {
    console.error(
      'Failed to load category products:',
      error.message
    )
  }

  const products =
    links
      ?.map((link) => link.product)
      .filter(
        (product) =>
          product &&
          product.published &&
          !product.deleted_at
      )
      .sort((a, b) => {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1
        }

        const aDate = a.published_at
          ? new Date(a.published_at).getTime()
          : 0

        const bDate = b.published_at
          ? new Date(b.published_at).getTime()
          : 0

        return bDate - aDate
      }) || []

  const siteUrl = 'https://deskscroll.com'

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
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${siteUrl}/products/category/${category.slug}`,
      },
    ],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',

    name: `${category.name} on DeskScroll`,

    numberOfItems: products.length,

    itemListElement: products.map(
      (product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/products/${product.slug}`,
        name: product.name,
      })
    ),
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbJsonLd
            ),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              itemListJsonLd
            ),
          }}
        />

        {/* Breadcrumb */}
        <div className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
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

              <span>/</span>

              <span className="text-gray-900">
                {category.name}
              </span>
            </div>
          </div>
        </div>

        {/* Header */}
        <section className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
            <p className="text-sm text-gray-500 mb-3">
              Product Category
            </p>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              {category.name}
            </h1>

            {category.description && (
              <p className="text-gray-600 mt-4 max-w-2xl leading-7">
                {category.description}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-5">
              {products.length}{' '}
              {products.length === 1
                ? 'product'
                : 'products'}
            </p>
          </div>
        </section>

        {/* Products */}
        <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
          {products.length === 0 ? (
            <div className="border rounded-2xl p-10 text-center bg-white">
              <h2 className="text-lg font-semibold">
                No products yet
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Products in this category will
                appear here when published.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group border rounded-2xl overflow-hidden bg-white"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="block"
                  >
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {product.cover_image_url ? (
                        <img
                          src={
                            product.cover_image_url
                          }
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.featured && (
                        <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
                          Featured
                        </span>
                      )}

                      {product.sponsored && (
                        <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
                          Sponsored
                        </span>
                      )}
                    </div>

                    {product.brand && (
                      <p className="text-xs uppercase tracking-wide text-gray-400 mb-1.5">
                        {product.brand.name}
                      </p>
                    )}

                    <h2 className="text-lg font-semibold leading-snug">
                      <Link
                        href={`/products/${product.slug}`}
                        className="hover:underline"
                      >
                        {product.name}
                      </Link>
                    </h2>

                    {product.short_description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-6">
                        {product.short_description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-5">
                      {product.price_text ? (
                        <span className="text-sm font-semibold">
                          {product.price_text}
                        </span>
                      ) : (
                        <span />
                      )}

                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm font-medium hover:underline"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
    }
