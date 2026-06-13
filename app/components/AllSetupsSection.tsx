// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import setupsData from './../data/setups.json';

// export default function AllSetupsSection() {
//   const [visibleCount, setVisibleCount] = useState(9); // Initially show 9 cards

//   const handleLoadMore = () => {
//     setVisibleCount((prev) => prev + 6); // Load 6 more each time
//   };

//   const visibleSetups = setupsData.slice(0, visibleCount);

//   return (
//     <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Section Header */}
//         <div className="mb-10 text-center sm:text-left">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Explore workspaces that inspire productivity
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">
//             Globally. Remote. Hybrid.
//           </p>
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleSetups.map((setup) => (
//             <Link 
//               key={setup.id} 
//               href={`/setups/${setup.slug}`} 
//               className="group block"
//             >
//               <div className="bg-white rounded-lg overflow-hidden border border-transparent hover:border-gray-200 transition-all shadow-sm hover:shadow-md">
//                 {/* Image */}
//                 <div className="relative aspect-[4/3] w-full bg-gray-100">
//                   <Image
//                     src={setup.imageUrl}
//                     alt={setup.title}
//                     fill
//                     className="object-cover group-hover:scale-105 transition-transform duration-300"
//                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                   />
//                 </div>
//                 {/* Text */}
//                 <div className="p-4">
//                   <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2ecc71] transition-colors">
//                     {setup.title}
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1 leading-snug">
//                     {setup.subtitle}
//                   </p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Load More Button */}
//         {visibleCount < setupsData.length && (
//           <div className="mt-10 flex justify-center">
//             <button
//               onClick={handleLoadMore}
//               className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-semibold px-8 py-3 rounded-md transition-colors shadow-sm"
//             >
//               Load more
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }











'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

type Setup = {
  id: string
  slug: string
  owner_name: string
  short_intro: string | null
  cover_image_url: string | null
}

const LIMIT = 9 // cards per page

export default function AllSetupsSection({ categorySlug = 'all' }: { categorySlug?: string }) {
  const [setups, setSetups] = useState<Setup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const supabase = createClient()

  // Fetch initial setups
  const fetchSetups = useCallback(
    async (from = 0, append = false) => {
      if (append) setLoadingMore(true)
      else setLoading(true)
      setError(false)

      try {
        let query = supabase
          .from('setups')
          .select('id, slug, owner_name, short_intro, cover_image_url')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .range(from, from + LIMIT - 1)

        // Category filter
        if (categorySlug && categorySlug !== 'all') {
          // Get category id first
          const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single()

          if (category) {
            query = query.eq('category_id', category.id)
          } else {
            // If category not found, return empty
            setSetups(append ? setups : [])
            setHasMore(false)
            return
          }
        }

        const { data, error, count } = await query

        if (error) throw error

        if (append) {
          setSetups((prev) => [...prev, ...(data || [])])
        } else {
          setSetups(data || [])
        }

        // If less than LIMIT returned, no more
        setHasMore((data?.length || 0) === LIMIT)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [categorySlug, setups]
  )

  useEffect(() => {
    fetchSetups(0, false)
  }, [categorySlug]) // reload when category changes

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return
    fetchSetups(setups.length, true) // append
  }

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Explore workspaces that inspire productivity
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Globally. Remote. Hybrid.
          </p>
        </div>

        {/* Loading / Error / Empty states */}
        {loading && !loadingMore && (
          <div className="text-center py-12">Loading setups...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">Failed to load setups.</div>
        )}
        {!loading && !error && setups.length === 0 && (
          <div className="text-center py-12 text-gray-500">No setups found in this category.</div>
        )}

        {/* Grid */}
        {setups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {setups.map((setup) => (
              <Link key={setup.id} href={`/setups/${setup.slug}`} className="group block">
                <div className="bg-white rounded-lg overflow-hidden border border-transparent hover:border-gray-200 transition-all shadow-sm hover:shadow-md">
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full bg-gray-100">
                    {setup.cover_image_url ? (
                      <Image
                        src={setup.cover_image_url}
                        alt={setup.owner_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  {/* Text */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2ecc71] transition-colors">
                      {setup.owner_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 leading-snug">
                      {setup.short_intro || ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-semibold px-8 py-3 rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}