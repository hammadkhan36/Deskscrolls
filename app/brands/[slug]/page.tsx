// import type { Metadata } from 'next'
// import Link from 'next/link'
// import { notFound } from 'next/navigation'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import { createServerSupabase } from '@/lib/supabase/server'

// export const revalidate = 300

// type PageProps = {
//   params: Promise<{
//     slug: string
//   }>
// }

// async function getBrand(slug: string) {
//   const supabase = await createServerSupabase()

//   const { data, error } = await supabase
//     .from('brands')
//     .select(`
//       id,
//       name,
//       slug,
//       short_description,
//       description,
//       logo_url,
//       cover_image_url,
//       website_url,
//       meta_title,
//       meta_description,
//       featured,
//       published_at,
//       updated_at
//     `)
//     .eq('slug', slug)
//     .eq('published', true)
//     .is('deleted_at', null)
//     .maybeSingle()

//   if (error) {
//     console.error(
//       'Failed to load brand:',
//       error.message
//     )

//     return null
//   }

//   return data
// }

// export async function generateMetadata({
//   params,
// }: PageProps): Promise<Metadata> {
//   const { slug } = await params
//   const brand = await getBrand(slug)

//   if (!brand) {
//     return {
//       title: 'Brand Not Found | DeskScroll',
//       robots: {
//         index: false,
//         follow: false,
//       },
//     }
//   }

//   const title =
//     brand.meta_title ||
//     `${brand.name} Products & Gear | DeskScroll`

//   const description =
//     brand.meta_description ||
//     brand.short_description ||
//     `Explore ${brand.name} products, gear and workspace recommendations featured on DeskScroll.`

//   return {
//     title,
//     description,

//     alternates: {
//       canonical: `/brands/${brand.slug}`,
//     },

//     openGraph: {
//       title,
//       description,
//       type: 'website',
//       url: `/brands/${brand.slug}`,
//       images: brand.cover_image_url
//         ? [
//             {
//               url: brand.cover_image_url,
//               alt: brand.name,
//             },
//           ]
//         : brand.logo_url
//           ? [
//               {
//                 url: brand.logo_url,
//                 alt: `${brand.name} logo`,
//               },
//             ]
//           : undefined,
//     },

//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description,
//       images:
//         brand.cover_image_url
//           ? [brand.cover_image_url]
//           : brand.logo_url
//             ? [brand.logo_url]
//             : undefined,
//     },
//   }
// }

// export default async function BrandPage({
//   params,
// }: PageProps) {
//   const { slug } = await params
//   const brand = await getBrand(slug)

//   if (!brand) {
//     notFound()
//   }

//   const supabase = await createServerSupabase()

//   const { data: products, error } = await supabase
//     .from('products')
//     .select(`
//       id,
//       name,
//       slug,
//       short_description,
//       cover_image_url,
//       product_type,
//       price_text,
//       featured,
//       sponsored,
//       published_at,
//       product_category_links (
//         is_primary,
//         category:product_categories (
//           id,
//           name,
//           slug
//         )
//       )
//     `)
//     .eq('brand_id', brand.id)
//     .eq('published', true)
//     .is('deleted_at', null)
//     .order('featured', {
//       ascending: false,
//     })
//     .order('published_at', {
//       ascending: false,
//     })

//   if (error) {
//     console.error(
//       'Failed to load brand products:',
//       error.message
//     )
//   }

//   const siteUrl = 'https://deskscroll.com'

//   const brandUrl =
//     `${siteUrl}/brands/${brand.slug}`

//   const brandJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'Brand',
//     name: brand.name,
//     url: brandUrl,
//     description:
//       brand.meta_description ||
//       brand.short_description ||
//       undefined,
//     logo: brand.logo_url || undefined,
//   }

//   const breadcrumbJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'BreadcrumbList',

//     itemListElement: [
//       {
//         '@type': 'ListItem',
//         position: 1,
//         name: 'Home',
//         item: siteUrl,
//       },
//       {
//         '@type': 'ListItem',
//         position: 2,
//         name: 'Brands',
//         item: `${siteUrl}/brands`,
//       },
//       {
//         '@type': 'ListItem',
//         position: 3,
//         name: brand.name,
//         item: brandUrl,
//       },
//     ],
//   }

//   const itemListJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'ItemList',

//     name: `${brand.name} products on DeskScroll`,

//     numberOfItems:
//       products?.length || 0,

//     itemListElement:
//       products?.map(
//         (product, index) => ({
//           '@type': 'ListItem',
//           position: index + 1,
//           name: product.name,
//           url: `${siteUrl}/products/${product.slug}`,
//         })
//       ) || [],
//   }

//   return (
//     <>
//       <Navbar />

//       <main className="min-h-screen">
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               brandJsonLd
//             ),
//           }}
//         />

//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               breadcrumbJsonLd
//             ),
//           }}
//         />

//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               itemListJsonLd
//             ),
//           }}
//         />

//         {/* Breadcrumb */}
//         <div className="border-b bg-white">
//           <div className="max-w-7xl mx-auto px-4 py-4">
//             <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
//               <Link
//                 href="/"
//                 className="hover:text-black"
//               >
//                 Home
//               </Link>

//               <span>/</span>

//               <Link
//                 href="/brands"
//                 className="hover:text-black"
//               >
//                 Brands
//               </Link>

//               <span>/</span>

//               <span className="text-gray-900">
//                 {brand.name}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Brand Header */}
//         <section className="border-b bg-white">
//           {brand.cover_image_url && (
//             <div className="max-w-7xl mx-auto px-4 pt-8">
//               <div className="aspect-[16/5] rounded-2xl overflow-hidden bg-gray-100">
//                 <img
//                   src={brand.cover_image_url}
//                   alt=""
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//           )}

//           <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
//             <div className="flex flex-col sm:flex-row sm:items-start gap-6">
//               {/* Logo */}
//               <div className="w-24 h-24 shrink-0 rounded-2xl border bg-white p-3 flex items-center justify-center overflow-hidden">
//                 {brand.logo_url ? (
//                   <img
//                     src={brand.logo_url}
//                     alt={`${brand.name} logo`}
//                     className="w-full h-full object-contain"
//                   />
//                 ) : (
//                   <span className="text-3xl font-bold text-gray-400">
//                     {brand.name
//                       .charAt(0)
//                       .toUpperCase()}
//                   </span>
//                 )}
//               </div>

//               {/* Brand Info */}
//               <div className="flex-1">
//                 <div className="flex flex-wrap items-center gap-2 mb-2">
//                   <p className="text-sm text-gray-500">
//                     Brand
//                   </p>

//                   {brand.featured && (
//                     <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
//                       Featured
//                     </span>
//                   )}
//                 </div>

//                 <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
//                   {brand.name}
//                 </h1>

//                 {brand.short_description && (
//                   <p className="text-gray-600 mt-4 max-w-2xl leading-7">
//                     {brand.short_description}
//                   </p>
//                 )}

//                 {brand.website_url && (
//                   <div className="mt-6">
//                     <a
//                       href={brand.website_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center justify-center border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
//                     >
//                       Official Website
//                       <span className="ml-2">
//                         ↗
//                       </span>
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Description */}
//         {brand.description && (
//           <section className="border-b">
//             <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4">
//                 About {brand.name}
//               </h2>

//               <div className="text-gray-600 leading-7 whitespace-pre-line">
//                 {brand.description}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Brand Products */}
//         <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
//           <div className="mb-7">
//             <h2 className="text-xl sm:text-2xl font-semibold">
//               {brand.name} products
//             </h2>

//             <p className="text-sm text-gray-500 mt-1">
//               {products?.length || 0}{' '}
//               {products?.length === 1
//                 ? 'product'
//                 : 'products'}{' '}
//               featured on DeskScroll
//             </p>
//           </div>

//           {!products?.length ? (
//             <div className="border rounded-2xl bg-white p-10 text-center">
//               <h3 className="font-semibold">
//                 No products yet
//               </h3>

//               <p className="text-sm text-gray-500 mt-2">
//                 Products from this brand will
//                 appear here when published.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products.map((product) => {
//                 const primaryLink =
//                   product.product_category_links?.find(
//                     (link) =>
//                       link.is_primary
//                   )

//                 const primaryCategory =
//                   primaryLink?.category?.[0] ||
//                   null

//                 return (
//                   <article
//                     key={product.id}
//                     className="group border rounded-2xl overflow-hidden bg-white"
//                   >
//                     <Link
//                       href={`/products/${product.slug}`}
//                       className="block"
//                     >
//                       <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
//                         {product.cover_image_url ? (
//                           <img
//                             src={
//                               product.cover_image_url
//                             }
//                             alt={product.name}
//                             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
//                             No image
//                           </div>
//                         )}
//                       </div>
//                     </Link>

//                     <div className="p-5">
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {primaryCategory && (
//                           <Link
//                             href={`/products/category/${primaryCategory.slug}`}
//                             className="text-xs text-gray-500 hover:text-black"
//                           >
//                             {primaryCategory.name}
//                           </Link>
//                         )}

//                         {product.featured && (
//                           <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
//                             Featured
//                           </span>
//                         )}

//                         {product.sponsored && (
//                           <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
//                             Sponsored
//                           </span>
//                         )}
//                       </div>

//                       <h3 className="text-lg font-semibold leading-snug">
//                         <Link
//                           href={`/products/${product.slug}`}
//                           className="hover:underline"
//                         >
//                           {product.name}
//                         </Link>
//                       </h3>

//                       {product.short_description && (
//                         <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-6">
//                           {
//                             product.short_description
//                           }
//                         </p>
//                       )}

//                       <div className="flex items-center justify-between gap-3 mt-5">
//                         {product.price_text ? (
//                           <span className="text-sm font-semibold">
//                             {product.price_text}
//                           </span>
//                         ) : (
//                           <span />
//                         )}

//                         <Link
//                           href={`/products/${product.slug}`}
//                           className="text-sm font-medium hover:underline"
//                         >
//                           View details →
//                         </Link>
//                       </div>
//                     </div>
//                   </article>
//                 )
//               })}
//             </div>
//           )}
//         </section>
//       </main>

//       <Footer />
//     </>
//   )
//         } 







import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServerSupabase } from '@/lib/supabase/server'
import BrandArtwork from '@/components/BrandArtwork'

export const revalidate = 300

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

async function getBrand(slug: string) {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('brands')
    .select(`
      id,
      name,
      slug,
      short_description,
      description,
      logo_url,
      cover_image_url,
      website_url,
      meta_title,
      meta_description,
      featured,
      published_at,
      updated_at
    `)
    .eq('slug', slug)
    .eq('published', true)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) {
    console.error(
      'Failed to load brand:',
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
  const brand = await getBrand(slug)

  if (!brand) {
    return {
      title: 'Brand Not Found | DeskScroll',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title =
    brand.meta_title ||
    `${brand.name} Products & Gear | DeskScroll`

  const description =
    brand.meta_description ||
    brand.short_description ||
    `Explore ${brand.name} products, gear and workspace recommendations featured on DeskScroll.`

  return {
    title,
    description,

    alternates: {
      canonical: `/brands/${brand.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'website',
      url: `/brands/${brand.slug}`,
      images: brand.cover_image_url
        ? [
            {
              url: brand.cover_image_url,
              alt: brand.name,
            },
          ]
        : brand.logo_url
          ? [
              {
                url: brand.logo_url,
                alt: `${brand.name} logo`,
              },
            ]
          : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images:
        brand.cover_image_url
          ? [brand.cover_image_url]
          : brand.logo_url
            ? [brand.logo_url]
            : undefined,
    },
  }
}

export default async function BrandPage({
  params,
}: PageProps) {
  const { slug } = await params
  const brand = await getBrand(slug)

  if (!brand) {
    notFound()
  }

  const supabase = await createServerSupabase()

  const { data: products, error } = await supabase
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
      published_at,
      product_category_links (
        is_primary,
        category:product_categories (
          id,
          name,
          slug
        )
      )
    `)
    .eq('brand_id', brand.id)
    .eq('published', true)
    .is('deleted_at', null)
    .order('featured', {
      ascending: false,
    })
    .order('published_at', {
      ascending: false,
    })

  if (error) {
    console.error(
      'Failed to load brand products:',
      error.message
    )
  }

  const siteUrl = 'https://deskscroll.com'

  const brandUrl =
    `${siteUrl}/brands/${brand.slug}`

  const brandJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.name,
    url: brandUrl,
    description:
      brand.meta_description ||
      brand.short_description ||
      undefined,
    logo: brand.logo_url || undefined,
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
        name: 'Brands',
        item: `${siteUrl}/brands`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: brand.name,
        item: brandUrl,
      },
    ],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',

    name: `${brand.name} products on DeskScroll`,

    numberOfItems:
      products?.length || 0,

    itemListElement:
      products?.map(
        (product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.name,
          url: `${siteUrl}/products/${product.slug}`,
        })
      ) || [],
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              brandJsonLd
            ),
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
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Link
                href="/"
                className="hover:text-black"
              >
                Home
              </Link>

              <span>/</span>

              <Link
                href="/brands"
                className="hover:text-black"
              >
                Brands
              </Link>

              <span>/</span>

              <span className="text-gray-900">
                {brand.name}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Header */}
        <section className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 pt-8">
            <BrandArtwork
              name={brand.name}
              imageUrl={brand.cover_image_url}
              variant="cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              preload
              className="aspect-[16/5] rounded-2xl"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Logo */}
              <BrandArtwork
                name={brand.name}
                imageUrl={brand.logo_url}
                variant="logo"
                sizes="96px"
                className="h-24 w-24 shrink-0 rounded-2xl border"
              />

              {/* Brand Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className="text-sm text-gray-500">
                    Brand
                  </p>

                  {brand.featured && (
                    <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                  {brand.name}
                </h1>

                {brand.short_description && (
                  <p className="text-gray-600 mt-4 max-w-2xl leading-7">
                    {brand.short_description}
                  </p>
                )}

                {brand.website_url && (
                  <div className="mt-6">
                    <a
                      href={brand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                    >
                      Official Website
                      <span className="ml-2">
                        ↗
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        {brand.description && (
          <section className="border-b">
            <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                About {brand.name}
              </h2>

              <div className="text-gray-600 leading-7 whitespace-pre-line">
                {brand.description}
              </div>
            </div>
          </section>
        )}

        {/* Brand Products */}
        <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
          <div className="mb-7">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {brand.name} products
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {products?.length || 0}{' '}
              {products?.length === 1
                ? 'product'
                : 'products'}{' '}
              featured on DeskScroll
            </p>
          </div>

          {!products?.length ? (
            <div className="border rounded-2xl bg-white p-10 text-center">
              <h3 className="font-semibold">
                No products yet
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Products from this brand will
                appear here when published.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const primaryLink =
                  product.product_category_links?.find(
                    (link) =>
                      link.is_primary
                  )

                const primaryCategory =
                  primaryLink?.category?.[0] ||
                  null

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
                        {primaryCategory && (
                          <Link
                            href={`/products/category/${primaryCategory.slug}`}
                            className="text-xs text-gray-500 hover:text-black"
                          >
                            {primaryCategory.name}
                          </Link>
                        )}

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
                          {
                            product.short_description
                          }
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
