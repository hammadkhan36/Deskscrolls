// // import BlogCard from './BlogCard';

// // // Agar aapke paas actual images hain, to yahan unke URLs daal dein
// // const featuredSetups = [
// //   {
// //     id: 1,
// //     title: "Luboš Volkov",
// //     subtitle: "Designer from Prague, Czechia",
// //     imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800&auto=format&fit=crop"
// //   },
// //   {
// //     id: 2,
// //     title: "Dinesh Dave",
// //     subtitle: "Co-founder and Creative Director at Work is Play",
// //     imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop"
// //   },
// //   {
// //     id: 3,
// //     title: "Matthew Encina",
// //     subtitle: "Content Creator, Creative Director, and Educator from Los Angeles, CA",
// //     imageUrl: "https://images.unsplash.com/photo-1486946255432-0514a16f1f8d?q=80&w=800&auto=format&fit=crop"
// //   }
// // ];

// // export default function FeaturedSection() {
// //   return (
// //     <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
// //         <div>
// //           <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
// //             Featured Desk Setups
// //           </h2>
// //           <p className="text-gray-600 text-sm md:text-base mt-1">
// //             A curated selection of standout workspaces from across the Workspaces archive
// //           </p>
// //         </div>
// //         <a 
// //           href="#" 
// //           className="text-gray-700 font-medium hover:text-gray-900 text-sm whitespace-nowrap flex items-center gap-1"
// //         >
// //           View all
// //           <span className="text-lg leading-none">→</span>
// //         </a>
// //       </div>

// //       {/* Cards Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {featuredSetups.map((setup) => (
// //           <BlogCard
// //             key={setup.id}
// //             title={setup.title}
// //             subtitle={setup.subtitle}
// //             imageUrl={setup.imageUrl}
// //             altText={`${setup.title} desk setup`}
// //           />
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }





















// // components/FeaturedSection.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import { getPublishedSetups } from '@/lib/supabase/getSetups' // or inline
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

//   useEffect(() => {
//     const fetchSetups = async () => {
//       setLoading(true)
//       setError(false)
//       try {
//         const { setups, error } = await getPublishedSetups(categorySlug, false) // or true if you want featured
//         if (error) throw error
//         setSetups(setups?.slice(0, limit) || [])
//       } catch (err) {
//         console.error(err)
//         setError(true)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchSetups()
//   }, [categorySlug, limit])

//   return (
//     <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
//         <div>
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//             Featured Desk Setups
//           </h2>
//           <p className="text-gray-600 text-sm md:text-base mt-1">
//             A curated selection of standout workspaces from across the Workspaces archive
//           </p>
//         </div>
//         <Link
//           href="/setups"
//           className="text-gray-700 font-medium hover:text-gray-900 text-sm whitespace-nowrap flex items-center gap-1"
//         >
//           View all <span className="text-lg leading-none">→</span>
//         </Link>
//       </div>

//       {/* Content */}
//       {loading && <p className="text-center py-12">Loading setups...</p>}
//       {error && <p className="text-center py-12 text-red-500">Failed to load setups.</p>}

//       {!loading && !error && setups.length === 0 && (
//         <p className="text-center py-12 text-gray-500">No setups found.</p>
//       )}

//       {!loading && !error && setups.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {setups.map((setup) => (
//             <Link key={setup.id} href={`/setups/${setup.slug}`} className="block">
//               <BlogCard
//                 title={setup.owner_name}
//                 subtitle={setup.short_intro || ''}
//                 imageUrl={setup.cover_image_url ?? undefined}
//                 altText={`${setup.owner_name} desk setup`}
//               />
//             </Link>
//           ))}
//         </div>
//       )}
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
  const [setups, setSetups] = useState<Setup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [heading, setHeading] = useState('')
  const [intro, setIntro] = useState('')

  const fetchSectionData = useCallback(async () => {
  setLoading(true)
  setError(false)
  try {
    const supabase = createClient()

    // Determine which slug to fetch for heading/intro
    const headingSlug = categorySlug === 'all' ? 'all-setups' : categorySlug

    const [categoryRes, setupsRes] = await Promise.all([
      supabase
        .from('categories')
        .select('name, description')
        .eq('slug', headingSlug)
        .single(),
      getPublishedSetups(categorySlug, false),
    ])

    if (categoryRes.error || !categoryRes.data) {
      // Ultimate fallback (should not happen if category exists)
      setHeading('Featured Desk Setups')
      setIntro('A curated selection of standout workspaces from across the Workspaces archive')
    } else {
      setHeading(categoryRes.data.name || 'Featured Setups')
      setIntro(categoryRes.data.description || '')
    }

    if (setupsRes.error) throw setupsRes.error
    setSetups(setupsRes.setups?.slice(0, limit) || [])
  } catch (err) {
    console.error(err)
    setError(true)
  } finally {
    setLoading(false)
  }
}, [categorySlug, limit])


  useEffect(() => {
    fetchSectionData()
  }, [fetchSectionData])

  // ========== LOADING SKELETON ==========
  if (loading) {
    return (
      <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div className="flex-1 space-y-3">
            {/* Heading skeleton */}
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            {/* Intro skeleton */}
            <div className="h-4 bg-gray-200 rounded w-full max-w-md animate-pulse"></div>
          </div>
          {/* View all placeholder */}
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse hidden sm:block"></div>
        </div>

        {/* Card skeletons (max 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ========== ERROR ==========
  if (error) {
    return (
      <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white text-center">
        <p className="text-red-500 py-12">Failed to load setups. Please try again later.</p>
      </section>
    )
  }

  // ========== EMPTY ==========
  if (setups.length === 0) {
    return (
      <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white text-center">
        <p className="text-gray-500 py-12">No setups found in this category.</p>
      </section>
    )
  }

  // ========== ACTUAL CONTENT ==========
  return (
    <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{heading}</h2>
          {intro && <p className="text-gray-600 text-sm md:text-base mt-1">{intro}</p>}
        </div>
        <Link
          href={`/setups${categorySlug && categorySlug !== 'all' ? `?category=${categorySlug}` : ''}`}
          className="text-gray-700 font-medium hover:text-gray-900 text-sm whitespace-nowrap flex items-center gap-1"
        >
          View all <span className="text-lg leading-none">→</span>
        </Link>
      </div>

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