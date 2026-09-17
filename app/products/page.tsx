import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServerSupabase } from '@/lib/supabase/server'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Products & Desk Gear | DeskScroll',
  description:
    'Discover keyboards, mice, monitors, desks, accessories, digital products and other workspace gear curated by DeskScroll.',
  alternates: {
    canonical: '/products',
  },
}

export default async function ProductsPage() {
  const supabase = await createServerSupabase()

  const [
    { data: products, error: productsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        short_description,
        cover_image_url,
        product_type,
        price_text,
        featured,
        sponsored,
        brand:brands (
          id,
          name,
          slug
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
      .eq('published', true)
      .is('deleted_at', null)
      .order('featured', {
        ascending: false,
      })
      .order('published_at', {
        ascending: false,
      }),

    supabase
      .from('product_categories')
      .select(`
        id,
        name,
        slug,
        description,
        parent_id,
        sort_order
      `)
      .eq('published', true)
      .order('sort_order')
      .order('name'),
  ])

  if (productsError) {
    console.error(
      'Failed to load products:',
      productsError.message
    )
  }

  if (categoriesError) {
    console.error(
      'Failed to load product categories:',
      categoriesError.message
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-14 sm:py-20">
            <p className="text-sm font-medium text-gray-500 mb-3">
              DeskScroll Gear
            </p>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl">
              Products for better desk setups
            </h1>

            <p className="text-gray-600 mt-4 max-w-2xl leading-7">
              Explore keyboards, mice, monitors,
              desks, accessories and digital
              resources selected for modern
              workspaces.
            </p>
          </div>
        </section>

        {/* Category Navigation */}
        {categories && categories.length > 0 && (
          <section className="border-b bg-white">
            <div className="max-w-7xl mx-auto px-4 py-7">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-semibold">
                    Browse categories
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Find products by workspace category.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products/category/${category.slug}`}
                    className="shrink-0 border rounded-full px-4 py-2 text-sm bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Product Listing */}
        <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 mb-7">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                Explore products
              </h2>

              {products && products.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {products.length}{' '}
                  {products.length === 1
                    ? 'product'
                    : 'products'}{' '}
                  available
                </p>
              )}
            </div>
          </div>

          {!products?.length ? (
            <div className="border rounded-2xl p-10 text-center bg-white">
              <h2 className="font-semibold text-lg">
                Products coming soon
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                We&apos;re building our collection
                of desk gear and workspace
                products.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const primaryLink =
                  product.product_category_links?.find(
                    (link) => link.is_primary
                  )

                const primaryCategory =
                  primaryLink?.category

                return (
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
                            src={product.cover_image_url}
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
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {primaryCategory && (
                          <Link
                            href={`/products/category/${primaryCategory.slug}`}
                            className="text-xs text-gray-500 hover:text-black"
                          >
                            {primaryCategory.name}
                          </Link>
                        )}

                        {product.sponsored && (
                          <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
                            Sponsored
                          </span>
                        )}

                        {product.featured && (
                          <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
                            Featured
                          </span>
                        )}
                      </div>

                      {product.brand && (
                        <p className="text-xs uppercase tracking-wide text-gray-400 mb-1.5">
                          {product.brand.name}
                        </p>
                      )}

                      <h3 className="text-lg font-semibold leading-snug">
                        <Link
                          href={`/products/${product.slug}`}
                          className="hover:underline"
                        >
                          {product.name}
                        </Link>
                      </h3>

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
                )
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
