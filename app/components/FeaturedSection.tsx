


// 'use client'

// import { useEffect, useState, useCallback } from 'react'
// import { getPublishedSetups } from '@/lib/supabase/getSetups'
// import { createClient } from '@/lib/supabase/client'
// import BlogCard from './BlogCard'
// import Link from 'next/link'

// type Setup = {
//   id: string
//   slug: string
//   owner_name: string
//   short_intro: string | null
//   cover_image_url: string | null
// }



// export default function FeaturedSection({
//   categorySlug = 'all',
//   limit = 6,
// }: {
//   categorySlug?: string
//   limit?: number
// }) {
//   const [setups, setSetups] = useState<Setup[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(false)
//   const [heading, setHeading] = useState('')
//   const [intro, setIntro] = useState('')

//   const fetchSectionData = useCallback(async () => {
//   setLoading(true)
//   setError(false)
//   try {
//     const supabase = createClient()

//     // Determine which slug to fetch for heading/intro
//     const headingSlug = categorySlug === 'all' ? 'all-setups' : categorySlug

//     const [categoryRes, setupsRes] = await Promise.all([
//       supabase
//         .from('categories')
//         .select('name, description')
//         .eq('slug', headingSlug)
//         .single(),
//       getPublishedSetups(categorySlug, false),
//     ])

//     if (categoryRes.error || !categoryRes.data) {
//       // Ultimate fallback (should not happen if category exists)
//       setHeading('Featured Desk Setups')
//       setIntro('A curated selection of standout workspaces from across the Workspaces archive')
//     } else {
//       setHeading(categoryRes.data.name || 'Featured Setups')
//       setIntro(categoryRes.data.description || '')
//     }

//     if (setupsRes.error) throw setupsRes.error
//     setSetups(setupsRes.setups?.slice(0, limit) || [])
//   } catch (err) {
//     console.error(err)
//     setError(true)
//   } finally {
//     setLoading(false)
//   }
// }, [categorySlug, limit])


//   useEffect(() => {
//     fetchSectionData()
//   }, [fetchSectionData])

//   // ========== LOADING SKELETON ==========
//   if (loading) {
//     return (
//       <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white">
//         <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
//           <div className="flex-1 space-y-3">
//             {/* Heading skeleton */}
//             <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
//             {/* Intro skeleton */}
//             <div className="h-4 bg-gray-200 rounded w-full max-w-md animate-pulse"></div>
//           </div>
//           {/* View all placeholder */}
//           <div className="h-4 bg-gray-200 rounded w-16 animate-pulse hidden sm:block"></div>
//         </div>

//         {/* Card skeletons (max 3) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
//             <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
//               <div className="aspect-[4/3] bg-gray-200"></div>
//               <div className="p-4 space-y-2">
//                 <div className="h-5 bg-gray-200 rounded w-3/4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-full"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     )
//   }

//   // ========== ERROR ==========
//   if (error) {
//     return (
//       <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white text-center">
//         <p className="text-red-500 py-12">Failed to load setups. Please try again later.</p>
//       </section>
//     )
//   }

//   // ========== EMPTY ==========
//   if (setups.length === 0) {
//     return (
//       <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white text-center">
//         <p className="text-gray-500 py-12">No setups found in this category.</p>
//       </section>
//     )
//   }

//   // ========== ACTUAL CONTENT ==========
//   return (
//     <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white">
//       <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
//         <div>
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{heading}</h2>
//           {intro && <p className="text-gray-600 text-sm md:text-base mt-1">{intro}</p>}
//         </div>
//         <Link
//           href={`/setups${categorySlug && categorySlug !== 'all' ? `?category=${categorySlug}` : ''}`}
//           className="text-gray-700 font-medium hover:text-gray-900 text-sm whitespace-nowrap flex items-center gap-1"
//         >
//           View all <span className="text-lg leading-none">→</span>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {setups.map((setup, index) => (
//           <Link key={setup.id} href={`/setups/${setup.slug}`} className="block">
//             <BlogCard
//               title={setup.owner_name}
//               subtitle={setup.short_intro || ''}
//               imageUrl={setup.cover_image_url ?? undefined}
//               altText={`${setup.owner_name} desk setup`}
//               priority={index < 3}
//             />
//           </Link>
//         ))}
//       </div>
//     </section>
//   )
// }






'use client'

import { useEffect, useState, useCallback } from 'react'
import { getPublishedSetups } from '@/lib/supabase/getSetups'
import { createClient } from '@/lib/supabase/client'
import BlogCard from './BlogCard'
import Link from 'next/link'

type Setup = {
  id: string
  slug: string
  owner_name: string
  short_intro: string | null
  cover_image_url: string | null
}

export default function FeaturedSection({
  categorySlug = 'all',
  limit = 6,
}: {
  categorySlug?: string
  limit?: number
}) {
  const [setups,  setSetups]  = useState<Setup[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [heading, setHeading] = useState('')
  const [intro,   setIntro]   = useState('')

  const fetchSectionData = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const supabase = createClient()
      const headingSlug = categorySlug === 'all' ? 'all-setups' : categorySlug

      const [categoryRes, setupsRes] = await Promise.all([
        supabase.from('categories').select('name, description').eq('slug', headingSlug).single(),
        getPublishedSetups(categorySlug, false),
      ])

      if (categoryRes.error || !categoryRes.data) {
        setHeading('Featured Desk Setups')
        setIntro('A curated selection of standout workspaces from across the DeskScrolls archive')
      } else {
        setHeading(categoryRes.data.name || 'Featured Setups')
        setIntro(categoryRes.data.description || '')
      }

      if (setupsRes.error) throw setupsRes.error
      setSetups(setupsRes.setups?.slice(0, limit) || [])
    } catch (err: unknown) {
      console.error(err)
      setError(true)

      // Temporary: show error message
      const error = err as { message?: string; details?: string }
      setHeading('Error: ' + (error.message || error.details || 'Unknown error'))

    } finally {
      setLoading(false)
    }
  }, [categorySlug, limit])

  useEffect(() => { fetchSectionData() }, [fetchSectionData])

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <section className="px-4 py-10 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div className="space-y-3">
            <div className="h-7 bg-[#E6E1D8] rounded w-56 animate-pulse" />
            <div className="h-4 bg-[#E6E1D8] rounded w-80 animate-pulse" />
          </div>
          <div className="h-4 bg-[#E6E1D8] rounded w-14 animate-pulse hidden sm:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-[#E6E1D8] animate-pulse">
              <div className="aspect-[4/3] bg-[#E6E1D8]" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-[#E6E1D8] rounded w-3/4" />
                <div className="h-4 bg-[#E6E1D8] rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) return (
    <section className="px-4 py-10 md:px-8 max-w-7xl mx-auto text-center">
      <p className="text-red-500 py-12">Failed to load setups. Please try again later.</p>
    </section>
  )

  if (setups.length === 0) return (
    <section className="px-4 py-10 md:px-8 max-w-7xl mx-auto text-center">
      <p className="text-[#6B6B6B] py-12">No setups found in this category.</p>
    </section>
  )

  return (
    <section className="px-4 py-10 md:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
        <div>
          <h2 className="text-2xl md:text-[28px] font-bold text-[#1E1E1E]">{heading}</h2>
          {intro && <p className="text-[#6B6B6B] text-sm mt-1 max-w-xl">{intro}</p>}
        </div>
        <Link
          href={`/setups${categorySlug && categorySlug !== 'all' ? `?category=${categorySlug}` : ''}`}
          className="text-[13px] font-semibold text-[#D97742] hover:text-[#B85C2E] transition-colors whitespace-nowrap flex items-center gap-1"
        >
          View all <span className="text-base leading-none">→</span>
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setups.map((setup, index) => (
          <Link key={setup.id} href={`/setups/${setup.slug}`} className="block">
            <BlogCard
              title={setup.owner_name}
              subtitle={setup.short_intro || ''}
              imageUrl={setup.cover_image_url ?? undefined}
              altText={`${setup.owner_name} desk setup`}
              priority={index < 3}
            />
          </Link>
        ))}
      </div>
    </section>
  )
}