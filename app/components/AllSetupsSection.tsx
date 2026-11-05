




// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import Link from 'next/link'
// import Image from 'next/image'

// type Setup = {
//   id: string
//   slug: string
//   owner_name: string
//   short_intro: string | null
//   cover_image_url: string | null
// }

// const LIMIT = 9

// export default function AllSetupsSection({ categorySlug = 'all' }: { categorySlug?: string }) {
//   const [setups,       setSetups]       = useState<Setup[]>([])
//   const [loading,      setLoading]      = useState(true)
//   const [error,        setError]        = useState(false)
//   const [hasMore,      setHasMore]      = useState(true)
//   const [loadingMore,  setLoadingMore]  = useState(false)

//   const supabase = createClient()

//   const fetchSetups = useCallback(
//     async (from = 0, append = false) => {
//       if (append) setLoadingMore(true)
//       else setLoading(true)
//       setError(false)

//       try {
//         let query = supabase
//           .from('setups')
//           .select('id, slug, owner_name, short_intro, cover_image_url')
//           .eq('published', true)
//           .order('published_at', { ascending: false })
//           .range(from, from + LIMIT - 1)

//         if (categorySlug && categorySlug !== 'all') {
//           const { data: category } = await supabase
//             .from('categories').select('id').eq('slug', categorySlug).single()
//           if (category) {
//             query = query.eq('category_id', category.id)
//           } else {
//             setSetups(append ? setups : [])
//             setHasMore(false)
//             return
//           }
//         }

//         const { data, error } = await query
//         if (error) throw error

//         if (append) setSetups((prev) => [...prev, ...(data || [])])
//         else        setSetups(data || [])

//         setHasMore((data?.length || 0) === LIMIT)
//       } catch (err) {
//         console.error(err)
//         setError(true)
//       } finally {
//         setLoading(false)
//         setLoadingMore(false)
//       }
//     },
//     [categorySlug, setups]
//   )

//   useEffect(() => { fetchSetups(0, false) }, [categorySlug])

//   return (
//     <section className="bg-[#FAFAF7] py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">

//         {/* Header */}
//         <div className="mb-10">
//           <h2 className="text-2xl sm:text-[28px] font-bold text-[#1E1E1E]">
//             Workspaces that inspire
//           </h2>
//           <p className="text-[#6B6B6B] text-sm mt-1">Real desks. Real people. Real work.</p>
//         </div>

//         {/* States */}
//         {loading && !loadingMore && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="rounded-xl overflow-hidden border border-[#E6E1D8] animate-pulse">
//                 <div className="aspect-[4/3] bg-[#E6E1D8]" />
//                 <div className="p-4 space-y-2">
//                   <div className="h-5 bg-[#E6E1D8] rounded w-3/4" />
//                   <div className="h-4 bg-[#E6E1D8] rounded w-full" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         {error && <p className="text-center py-12 text-red-500">Failed to load setups.</p>}
//         {!loading && !error && setups.length === 0 && (
//           <p className="text-center py-12 text-[#6B6B6B]">No setups found in this category.</p>
//         )}

//         {/* Grid */}
//         {setups.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {setups.map((setup) => (
//               <Link key={setup.id} href={`/setups/${setup.slug}`} className="group block">
//                 <div className="bg-white rounded-xl overflow-hidden border border-[#E6E1D8] hover:border-[#D97742]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-200">
//                   <div className="relative aspect-[4/3] w-full bg-[#F5E6D3]">
//                     {setup.cover_image_url ? (
//                       <Image
//                         src={setup.cover_image_url}
//                         alt={setup.owner_name}
//                         fill
//                         className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
//                         sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-[#6B6B6B] text-sm">
//                         No Image
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-[15px] font-semibold text-[#1E1E1E] group-hover:text-[#D97742] transition-colors">
//                       {setup.owner_name}
//                     </h3>
//                     <p className="text-sm text-[#6B6B6B] mt-1 leading-snug line-clamp-2">
//                       {setup.short_intro || ''}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}

//         {/* Load more */}
//         {hasMore && !loading && (
//           <div className="mt-10 flex justify-center">
//             <button
//               onClick={() => fetchSetups(setups.length, true)}
//               disabled={loadingMore}
//               className="bg-[#D97742] hover:bg-[#B85C2E] text-white font-semibold px-8 py-3 rounded-md transition-colors disabled:opacity-50 text-sm"
//             >
//               {loadingMore ? 'Loading…' : 'Load more'}
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }







'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export type SetupListItem = {
  id: string
  slug: string
  owner_name: string
  short_intro: string | null
  cover_image_url: string | null
}

type AllSetupsSectionProps = {
  categoryId: string | null
  initialError?: string | null
  initialHasMore: boolean
  initialSetups: SetupListItem[]
}

const PAGE_SIZE = 9

export default function AllSetupsSection({
  categoryId,
  initialError = null,
  initialHasMore,
  initialSetups,
}: AllSetupsSectionProps) {
  const supabase = useMemo(
    () => createClient(),
    []
  )

  const [setups, setSetups] =
    useState(initialSetups)

  const [error, setError] =
    useState<string | null>(initialError)

  const [hasMore, setHasMore] =
    useState(initialHasMore)

  const [loadingMore, setLoadingMore] =
    useState(false)

  async function loadMore() {
    if (loadingMore || !hasMore) {
      return
    }

    setLoadingMore(true)
    setError(null)

    try {
      let query = supabase
        .from('setups')
        .select(
          'id, slug, owner_name, short_intro, cover_image_url'
        )
        .eq('published', true)
        .is('deleted_at', null)
        .order('published_at', {
          ascending: false,
        })
        .range(
          setups.length,
          setups.length + PAGE_SIZE - 1
        )

      if (categoryId) {
        query = query.eq(
          'category_id',
          categoryId
        )
      }

      const {
        data,
        error: queryError,
      } = await query

      if (queryError) {
        throw queryError
      }

      const nextSetups =
        (data || []) as SetupListItem[]

      setSetups((current) => {
        const existingIds = new Set(
          current.map((setup) => setup.id)
        )

        return [
          ...current,
          ...nextSetups.filter(
            (setup) =>
              !existingIds.has(setup.id)
          ),
        ]
      })

      setHasMore(
        nextSetups.length === PAGE_SIZE
      )
    } catch (loadError) {
      console.error(
        'Failed to load more setups:',
        loadError
      )

      setError(
        'Could not load more setups. Please try again.'
      )
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <section className="bg-[#FAFAF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-[#1E1E1E] sm:text-[28px]">
            Workspaces that inspire
          </h1>

          <p className="mt-1 text-sm text-[#6B6B6B]">
            Real desks. Real people. Real work.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {setups.length === 0 ? (
          <p className="rounded-xl border border-[#E6E1D8] bg-white px-5 py-12 text-center text-[#6B6B6B]">
            No setups found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {setups.map((setup) => (
              <Link
                key={setup.id}
                href={`/setups/${setup.slug}`}
                className="group block"
              >
                <article className="overflow-hidden rounded-xl border border-[#E6E1D8] bg-white transition duration-200 hover:border-[#D97742]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5E6D3]">
                    {setup.cover_image_url ? (
                      <Image
                        src={
                          setup.cover_image_url
                        }
                        alt={`${setup.owner_name}'s desk setup`}
                        fill
                        quality={75}
                        sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 36px), 405px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-[#6B6B6B]">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="text-[15px] font-semibold text-[#1E1E1E] transition-colors group-hover:text-[#D97742]">
                      {setup.owner_name}
                      &apos;s Desk Setup
                    </h2>

                    {setup.short_intro && (
                      <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#6B6B6B]">
                        {setup.short_intro}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {hasMore && setups.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-md bg-[#D97742] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B85C2E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingMore
                ? 'Loading…'
                : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
