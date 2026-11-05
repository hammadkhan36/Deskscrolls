// import type { Metadata } from 'next'
// import Link from 'next/link'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import { createServerSupabase } from '@/lib/supabase/server'

// export const revalidate = 300

// export const metadata: Metadata = {
//   title: 'Brands | DeskScroll',
//   description:
//     'Explore workspace, desk setup and technology brands featured on DeskScroll.',
//   alternates: {
//     canonical: '/brands',
//   },
// }

// export default async function BrandsPage() {
//   const supabase = await createServerSupabase()

//   const { data: brands, error } = await supabase
//     .from('brands')
//     .select(`
//       id,
//       name,
//       slug,
//       short_description,
//       logo_url,
//       cover_image_url,
//       featured
//     `)
//     .eq('published', true)
//     .is('deleted_at', null)
//     .order('featured', {
//       ascending: false,
//     })
//     .order('name')

//   if (error) {
//     console.error(
//       'Failed to load brands:',
//       error.message
//     )
//   }

//   return (
//     <>
//       <Navbar />

//       <main className="min-h-screen">
//         {/* Hero */}
//         <section className="border-b bg-white">
//           <div className="max-w-7xl mx-auto px-4 py-14 sm:py-20">
//             <p className="text-sm font-medium text-gray-500 mb-3">
//               DeskScroll Brands
//             </p>

//             <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
//               Explore brands
//             </h1>

//             <p className="text-gray-600 mt-4 max-w-2xl leading-7">
//               Discover brands behind the gear,
//               accessories and products featured
//               across DeskScroll.
//             </p>
//           </div>
//         </section>

//         {/* Brands */}
//         <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
//           {!brands?.length ? (
//             <div className="border rounded-2xl bg-white p-10 text-center">
//               <h2 className="text-lg font-semibold">
//                 Brands coming soon
//               </h2>

//               <p className="text-sm text-gray-500 mt-2">
//                 Featured workspace and technology
//                 brands will appear here.
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="flex items-center justify-between gap-4 mb-7">
//                 <div>
//                   <h2 className="text-xl sm:text-2xl font-semibold">
//                     All brands
//                   </h2>

//                   <p className="text-sm text-gray-500 mt-1">
//                     {brands.length}{' '}
//                     {brands.length === 1
//                       ? 'brand'
//                       : 'brands'}
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {brands.map((brand) => (
//                   <article
//                     key={brand.id}
//                     className="group border rounded-2xl overflow-hidden bg-white"
//                   >
//                     {/* Cover */}
//                     <Link
//                       href={`/brands/${brand.slug}`}
//                       className="block"
//                     >
//                       <div className="aspect-[16/7] bg-gray-100 overflow-hidden">
//                         {brand.cover_image_url ? (
//                           <img
//                             src={brand.cover_image_url}
//                             alt=""
//                             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
//                           />
//                         ) : (
//                           <div className="w-full h-full bg-gray-100" />
//                         )}
//                       </div>
//                     </Link>

//                     <div className="p-5">
//                       {/* Logo */}
//                       <div className="-mt-11 mb-4">
//                         <div className="w-16 h-16 rounded-xl border bg-white p-2 shadow-sm flex items-center justify-center overflow-hidden">
//                           {brand.logo_url ? (
//                             <img
//                               src={brand.logo_url}
//                               alt={`${brand.name} logo`}
//                               className="w-full h-full object-contain"
//                             />
//                           ) : (
//                             <span className="text-xl font-bold text-gray-400">
//                               {brand.name
//                                 .charAt(0)
//                                 .toUpperCase()}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <h2 className="text-lg font-semibold">
//                           <Link
//                             href={`/brands/${brand.slug}`}
//                             className="hover:underline"
//                           >
//                             {brand.name}
//                           </Link>
//                         </h2>

//                         {brand.featured && (
//                           <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
//                             Featured
//                           </span>
//                         )}
//                       </div>

//                       {brand.short_description && (
//                         <p className="text-sm text-gray-600 leading-6 mt-2 line-clamp-3">
//                           {brand.short_description}
//                         </p>
//                       )}

//                       <div className="mt-5">
//                         <Link
//                           href={`/brands/${brand.slug}`}
//                           className="text-sm font-medium hover:underline"
//                         >
//                           View brand →
//                         </Link>
//                       </div>
//                     </div>
//                   </article>
//                 ))}
//               </div>
//             </>
//           )}
//         </section>
//       </main>

//       <Footer />
//     </>
//   )
//                         }






import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServerSupabase } from '@/lib/supabase/server'
import BrandArtwork from '@/components/BrandArtwork'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Brands | DeskScroll',
  description:
    'Explore workspace, desk setup and technology brands featured on DeskScroll.',
  alternates: {
    canonical: '/brands',
  },
}

export default async function BrandsPage() {
  const supabase = await createServerSupabase()

  const { data: brands, error } = await supabase
    .from('brands')
    .select(`
      id,
      name,
      slug,
      short_description,
      logo_url,
      cover_image_url,
      featured
    `)
    .eq('published', true)
    .is('deleted_at', null)
    .order('featured', {
      ascending: false,
    })
    .order('name')

  if (error) {
    console.error(
      'Failed to load brands:',
      error.message
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
              DeskScroll Brands
            </p>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Explore brands
            </h1>

            <p className="text-gray-600 mt-4 max-w-2xl leading-7">
              Discover brands behind the gear,
              accessories and products featured
              across DeskScroll.
            </p>
          </div>
        </section>

        {/* Brands */}
        <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
          {!brands?.length ? (
            <div className="border rounded-2xl bg-white p-10 text-center">
              <h2 className="text-lg font-semibold">
                Brands coming soon
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Featured workspace and technology
                brands will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 mb-7">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    All brands
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {brands.length}{' '}
                    {brands.length === 1
                      ? 'brand'
                      : 'brands'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand) => (
                  <article
                    key={brand.id}
                    className="group border rounded-2xl overflow-hidden bg-white"
                  >
                    {/* Cover */}
                    <Link
                      href={`/brands/${brand.slug}`}
                      className="block"
                    >
                      <BrandArtwork
                        name={brand.name}
                        imageUrl={brand.cover_image_url}
                        variant="cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="aspect-[16/7] transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </Link>

                    <div className="p-5">
                      {/* Logo */}
                      <div className="-mt-11 mb-4">
                        <BrandArtwork
                          name={brand.name}
                          imageUrl={brand.logo_url}
                          variant="logo"
                          sizes="64px"
                          className="h-16 w-16 rounded-xl border shadow-sm"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                          <Link
                            href={`/brands/${brand.slug}`}
                            className="hover:underline"
                          >
                            {brand.name}
                          </Link>
                        </h2>

                        {brand.featured && (
                          <span className="text-[11px] border rounded-full px-2 py-0.5 text-gray-500">
                            Featured
                          </span>
                        )}
                      </div>

                      {brand.short_description && (
                        <p className="text-sm text-gray-600 leading-6 mt-2 line-clamp-3">
                          {brand.short_description}
                        </p>
                      )}

                      <div className="mt-5">
                        <Link
                          href={`/brands/${brand.slug}`}
                          className="text-sm font-medium hover:underline"
                        >
                          View brand →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
