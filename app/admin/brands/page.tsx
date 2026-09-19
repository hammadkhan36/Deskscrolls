// import Link from 'next/link'
// import { createServerSupabase } from '@/lib/supabase/server'

// export default async function BrandsPage() {
//   const supabase = await createServerSupabase()

//   const { data: brands, error } = await supabase
//     .from('brands')
//     .select(`
//       id,
//       name,
//       slug,
//       logo_url,
//       short_description,
//       published,
//       featured,
//       created_at
//     `)
//     .is('deleted_at', null)
//     .order('created_at', { ascending: false })

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="flex items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">
//             Brands
//           </h1>

//           <p className="text-sm text-gray-500 mt-1">
//             Manage product brands used across DeskScroll.
//           </p>
//         </div>

//         <Link
//           href="/admin/brands/new"
//           className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
//         >
//           Add Brand
//         </Link>
//       </div>

//       {error && (
//         <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-4 mb-6 text-sm">
//           {error.message}
//         </div>
//       )}

//       <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//         {!brands || brands.length === 0 ? (
//           <div className="p-8 text-center">
//             <p className="font-medium text-gray-900">
//               No brands yet
//             </p>

//             <p className="text-sm text-gray-500 mt-1">
//               Add your first product brand to get started.
//             </p>

//             <Link
//               href="/admin/brands/new"
//               className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
//             >
//               Add Brand
//             </Link>
//           </div>
//         ) : (
//           <div className="divide-y">
//             {brands.map((brand) => (
//               <div
//                 key={brand.id}
//                 className="p-4 flex items-center justify-between gap-4"
//               >
//                 <div className="flex items-center gap-4 min-w-0">
//                   <div className="w-12 h-12 shrink-0 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
//                     {brand.logo_url ? (
//                       <img
//                         src={brand.logo_url}
//                         alt=""
//                         className="w-full h-full object-contain p-1"
//                       />
//                     ) : (
//                       <span className="text-lg font-bold text-gray-400">
//                         {brand.name.charAt(0).toUpperCase()}
//                       </span>
//                     )}
//                   </div>

//                   <div className="min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <p className="font-medium text-gray-900">
//                         {brand.name}
//                       </p>

//                       {brand.published ? (
//                         <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
//                           Published
//                         </span>
//                       ) : (
//                         <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border">
//                           Draft
//                         </span>
//                       )}

//                       {brand.featured && (
//                         <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
//                           Featured
//                         </span>
//                       )}
//                     </div>

//                     <p className="text-xs text-gray-500 mt-1">
//                       /brands/{brand.slug}
//                     </p>

//                     {brand.short_description && (
//                       <p className="text-sm text-gray-500 mt-1 line-clamp-1">
//                         {brand.short_description}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3 shrink-0">
//                   {brand.published && (
//                     <Link
//                       href={`/brands/${brand.slug}`}
//                       target="_blank"
//                       className="text-sm text-gray-600 hover:text-black"
//                     >
//                       View
//                     </Link>
//                   )}

//                   <Link
//                     href={`/admin/brands/${brand.id}/edit`}
//                     className="text-sm text-blue-600 hover:underline"
//                   >
//                     Edit
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
//                 }






import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import BrandArtwork from '@/components/BrandArtwork'

export default async function BrandsPage() {
  const supabase = await createServerSupabase()

  const { data: brands, error } = await supabase
    .from('brands')
    .select(`
      id,
      name,
      slug,
      logo_url,
      short_description,
      published,
      featured,
      created_at
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Brands
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage product brands used across DeskScroll.
          </p>
        </div>

        <Link
          href="/admin/brands/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Add Brand
        </Link>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-4 mb-6 text-sm">
          {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {!brands || brands.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium text-gray-900">
              No brands yet
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Add your first product brand to get started.
            </p>

            <Link
              href="/admin/brands/new"
              className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
            >
              Add Brand
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <BrandArtwork
                    name={brand.name}
                    imageUrl={brand.logo_url}
                    variant="logo"
                    sizes="48px"
                    className="h-12 w-12 shrink-0 rounded-lg border"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900">
                        {brand.name}
                      </p>

                      {brand.published ? (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                          Published
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border">
                          Draft
                        </span>
                      )}

                      {brand.featured && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      /brands/{brand.slug}
                    </p>

                    {brand.short_description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {brand.short_description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {brand.published && (
                    <Link
                      href={`/brands/${brand.slug}`}
                      target="_blank"
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      View
                    </Link>
                  )}

                  <Link
                    href={`/admin/brands/${brand.id}/edit`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
