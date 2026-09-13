// import { createServerSupabase } from '@/lib/supabase/server'
// import Link from 'next/link'

// export default async function BlogsPage() {
//   const supabase = await createServerSupabase()
//   const { data: blogs } = await supabase
//     .from('blogs')
//     .select('id, title, slug, short_intro, cover_image_url, published_at')
//     .eq('published', true)
//     .is('deleted_at', null)
//     .order('published_at', { ascending: false })

//   return (
//     <div className="max-w-5xl mx-auto py-12 px-4">
//       <h1 className="text-3xl font-bold mb-8">Blogs</h1>
//       <div className="grid gap-6 md:grid-cols-2">
//         {blogs?.map((b) => (
//           <Link
//             key={b.id}
//             href={`/blogs/${b.slug}`}
//             className="block bg-white rounded-xl shadow hover:shadow-md overflow-hidden"
//           >
//             {b.cover_image_url && (
//               <img src={b.cover_image_url} alt={b.title} className="w-full h-48 object-cover" />
//             )}
//             <div className="p-4">
//               <h2 className="font-bold text-lg mb-1">{b.title}</h2>
//               {b.short_intro && <p className="text-sm text-gray-600">{b.short_intro}</p>}
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }









'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SubscribeSection from '@/components/SubscribeSection'
import AllBlogsSection from '@/components/AllBlogsSection'
import Footer from '@/components/Footer'

function BlogsContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'

  return (
    <>
      <Navbar />
      <SubscribeSection variant="testimonial" />
      <AllBlogsSection categorySlug={category} />
      <Footer />
    </>
  )
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <BlogsContent />
    </Suspense>
  )
}