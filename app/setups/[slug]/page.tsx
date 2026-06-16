

// // app/setups/[slug]/page.tsx
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import Image from 'next/image'
// import Link from 'next/link'
// import { notFound } from 'next/navigation'
// import { createServerSupabase } from '@/lib/supabase/server'

// // Server component: fetch fresh data every time
// export const dynamic = 'force-dynamic'

// export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params
//   const supabase = await createServerSupabase()

//   // 1. Fetch the setup with category, author, gallery images
//   const { data: setup, error } = await supabase
//     .from('setups')
//     .select(`
//       *,
//       category:categories(name, slug),
//       author:profiles(full_name, avatar_url),
//       setup_images(id, image_url, alt_text, sort_order)
//     `)
//     .eq('slug', slug)
//     .eq('published', true)          // only show published
//     .single()

//   if (error || !setup) {
//     notFound()
//   }

//   // Sort gallery by sort_order
//   const galleryImages = (setup.setup_images || []).sort(
//     (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
//   )

//   // 2. Fetch related setups (same category, excluding current)
//   const { data: relatedSetups } = await supabase
//     .from('setups')
//     .select('id, slug, owner_name, short_intro, cover_image_url')
//     .eq('published', true)
//     .eq('category_id', setup.category_id)
//     .neq('id', setup.id)
//     .limit(3)
//     .order('published_at', { ascending: false })

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-white pt-8 pb-16">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Title & Meta */}
//           <div className="mb-8 border-b border-gray-100 pb-6">
//             <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               {setup.owner_name}&apos;s Desk Setup
//             </h1>
//             {setup.short_intro && (
//               <p className="text-lg text-gray-700">{setup.short_intro}</p>
//             )}
//             {setup.category && (
//               <Link
//                 href={`/setups?category=${setup.category.slug}`}
//                 className="text-sm text-green-600 mt-2 inline-block hover:underline"
//               >
//                 {setup.category.name}
//               </Link>
//             )}
//           </div>

//           {/* Main Post Box */}
//           <div className="border border-green-500 rounded-lg p-6 sm:p-8 mb-12">
//             {/* Cover Image */}
//             {/* {setup.cover_image_url && (
//               <div className="relative w-full aspect-[4/3] mb-8">
//                 <Image
//                   src={setup.cover_image_url}
//                   alt={setup.owner_name}
//                   fill
//                   className="object-cover rounded-md"
//                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
//                 />
//               </div>
//             )} */}

//             {/* Full Content (HTML from Tiptap) */}
//             {setup.content && (
//               <div
//                 className="prose prose-lg max-w-none text-gray-800"
//                 dangerouslySetInnerHTML={{ __html: setup.content }}
//               />
//             )}

//             {/* Gallery Images */}
//             {galleryImages.length > 0 && (
//               <div className="mt-10">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   {galleryImages.map((img: any) => (
//                     <div key={img.id} className="relative aspect-[4/3]">
//                       <Image
//                         src={img.image_url}
//                         alt={img.alt_text || 'Gallery image'}
//                         fill
//                         className="object-cover rounded-md"
//                         sizes="(max-width: 640px) 100vw, 50vw"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* CTA Boxes (static, aap chahe to newsletter connect kar sakte hain) */}
//           <div className="border border-green-200 bg-green-50/50 rounded-lg p-6 text-center mb-8">
//             <p className="text-gray-800 font-medium mb-4">
//               If you enjoyed this edition of Workspaces, please consider sending it to a friend. <span className="text-red-500">❤️</span>
//             </p>
//             <p className="text-gray-700 text-sm">
//               Want to work with me in the future? <a href="#" className="text-green-600 underline">hello@example.com</a>
//             </p>
//           </div>

//           <div className="border border-gray-200 rounded-lg p-6 text-center flex flex-col items-center gap-4">
//             <p className="text-gray-800 font-medium">
//               If you enjoyed this workspace tour, and if you&apos;re the owner, consider sending a tip.
//             </p>
//             <form className="w-full max-w-sm flex flex-col sm:flex-row gap-2">
//               <input
//                 type="email"
//                 placeholder="Enter your email..."
//                 className="flex-1 rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
//               />
//               <button className="whitespace-nowrap rounded-md bg-[#2ecc71] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#27ae60] transition">
//                 Subscribe
//               </button>
//             </form>
//           </div>
//         </div>
//       </main>

//       {/* Related Setups */}
//       {relatedSetups && relatedSetups.length > 0 && (
//         <section className="bg-white border-t border-gray-100 py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-10">
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Setups</h2>
//               <p className="text-gray-600">More inspiring workspaces from the same category.</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {relatedSetups.map((related: any) => (
//                 <Link key={related.id} href={`/setups/${related.slug}`} className="group block">
//                   <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
//                     <div className="relative aspect-[4/3] w-full bg-gray-200">
//                       {related.cover_image_url ? (
//                         <Image
//                           src={related.cover_image_url}
//                           alt={related.owner_name}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform duration-200"
//                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
//                       )}
//                     </div>
//                     <div className="p-4">
//                       <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
//                         {related.owner_name}
//                       </h3>
//                       <p className="text-sm text-gray-500 mt-1 line-clamp-2">
//                         {related.short_intro}
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       <Footer />
//     </>
//   )
// }














// app/setups/[slug]/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import EmbedRenderer from '@/components/EmbedRenderer'

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabase()


  const { data: setup, error } = await supabase
  .from('setups')
  .select(`
    *,
    categories:setup_categories(category:categories(id, name, slug)),
    author:profiles(full_name, avatar_url),
    setup_images(id, image_url, alt_text, sort_order)
  `)
  .eq('slug', slug)
  .eq('published', true)
  .single()

  // const { data: setup, error } = await supabase
  //   .from('setups')
  //   .select(`
  //     *,
  //     category:categories(name, slug),
  //     author:profiles(full_name, avatar_url),
  //     setup_images(id, image_url, alt_text, sort_order)
  //   `)
  //   .eq('slug', slug)
  //   .eq('published', true)
  //   .single()

  if (error || !setup) notFound()

  const galleryImages = (setup.setup_images || []).sort(
    (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
  )

  const { data: relatedSetups } = await supabase
    .from('setups')
    .select('id, slug, owner_name, short_intro, cover_image_url')
    .eq('published', true)
    .eq('category_id', setup.category_id)
    .neq('id', setup.id)
    .limit(3)
    .order('published_at', { ascending: false })

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen bg-[#FAFAF7] pt-8 pb-16"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">



{/* Breadcrumb ... */}
<nav className="flex items-center gap-2 text-[13px] text-[#6B6B6B] mb-6">
  <Link href="/" className="hover:text-[#D97742] transition-colors">Home</Link>
  <span>/</span>
  <Link href="/setups" className="hover:text-[#D97742] transition-colors">Setups</Link>
  {/* Agar multiple categories hain to yahan sab dikhao */}
  {setup.categories && setup.categories.length > 0 && (
    <>
      <span>/</span>
      {setup.categories.map((cat: any) => (
        <Link
          key={cat.category.id}
          href={`/setups?category=${cat.category.slug}`}
          className="hover:text-[#D97742] transition-colors text-[#6B6B6B]"
        >
          {cat.category.name}
        </Link>
      ))}
    </>
  )}
</nav>
          {/* ── Breadcrumb ── */}
          {/* <nav className="flex items-center gap-2 text-[13px] text-[#6B6B6B] mb-6">
            <Link href="/" className="hover:text-[#D97742] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/setups" className="hover:text-[#D97742] transition-colors">Setups</Link>
            {setup.category && (
              <>
                <span>/</span>
                <Link
                  href={`/setups?category=${setup.category.slug}`}
                  className="hover:text-[#D97742] transition-colors"
                >
                  {setup.category.name}
                </Link>
              </>
            )}
          </nav> */}
{setup.categories && setup.categories.length > 0 && (
  <div className="flex gap-2 mt-2">
    {setup.categories.map((cat: any) => (
      <Link
        key={cat.category.id}
        href={`/setups?category=${cat.category.slug}`}
        className="text-xs font-semibold uppercase tracking-wider text-[#D97742] hover:text-[#B85C2E] transition-colors"
      >
        {cat.category.name}
      </Link>
    ))}
  </div>
)}


          {/* ── Title block ── */}
          <div className="mb-8 pb-6 border-b border-[#E6E1D8]">
            <h1 className="text-3xl sm:text-[36px] font-bold text-[#1E1E1E] leading-tight mb-3">
              {setup.owner_name}&apos;s Desk Setup
            </h1>
            {setup.short_intro && (
              <p className="text-[#6B6B6B] text-[16px] leading-relaxed">{setup.short_intro}</p>
            )}
            {setup.category && (
              <Link
                href={`/setups?category=${setup.category.slug}`}
                className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-[#D97742] hover:text-[#B85C2E] transition-colors"
              >
                {setup.category.name}
              </Link>
            )}
          </div>

          {/* ── Main content card ── */}
          <div className="bg-white border border-[#E6E1D8] rounded-xl p-6 sm:p-8 mb-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            {/* {setup.content && (
              <div
                className="prose prose-neutral max-w-none text-[#1E1E1E]
                  prose-headings:font-bold prose-headings:text-[#1E1E1E]
                  prose-a:text-[#D97742] hover:prose-a:text-[#B85C2E]
                  prose-blockquote:border-l-[#D97742] prose-blockquote:text-[#6B6B6B]"
                dangerouslySetInnerHTML={{ __html: setup.content }}
              />
            )} */}


            {setup.content && (
              // <div style={{ maxWidth: '540px', margin: '0 auto' }}>
  <div
  
    className="prose prose-neutral max-w-none text-[#1E1E1E]
      prose-headings:font-bold prose-headings:text-[#1E1E1E]
      prose-a:text-[#D97742] hover:prose-a:text-[#B85C2E]
      prose-blockquote:border-l-[#D97742] prose-blockquote:text-[#6B6B6B]"
  >
    <EmbedRenderer content={setup.content} />
  </div>
)}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold text-[#1E1E1E] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 gap-3">
                  {galleryImages.map((img: any) => (
                    <div key={img.id} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                      <Image
                        src={img.image_url}
                        alt={img.alt_text || 'Gallery image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Share nudge ── */}
          <div className="bg-[#F5EDE4] border border-[#E6E1D8] rounded-xl p-6 text-center mb-6">
            <p className="text-[#1E1E1E] font-medium mb-1">
              Enjoyed this setup? Share it with a friend. ❤️
            </p>
            <p className="text-[#6B6B6B] text-sm">
              Questions or collabs?{' '}
              <a href="mailto:hello@deskscrolls.com" className="text-[#D97742] hover:text-[#B85C2E] transition-colors underline underline-offset-2">
                hello@deskscrolls.com
              </a>
            </p>
          </div>

          {/* ── Inline subscribe ── */}
          <div className="bg-white border border-[#E6E1D8] rounded-xl p-6 text-center flex flex-col items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#BF6F4A]">
              Never miss a setup
            </p>
            <p className="text-[#1E1E1E] font-medium">
              Get one new workspace delivered every Saturday.
            </p>
            <form className="w-full max-w-sm flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-md border border-[#E6E1D8] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#1E1E1E] placeholder:text-[#6B6B6B] focus:border-[#D97742] focus:outline-none focus:ring-1 focus:ring-[#D97742] transition"
              />
              <button className="rounded-md bg-[#D97742] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B85C2E] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </main>

      {/* ── Related setups ── */}
      {relatedSetups && relatedSetups.length > 0 && (
        <section className="bg-white border-t border-[#E6E1D8] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-1">Related Setups</h2>
              <p className="text-[#6B6B6B] text-sm">More workspaces from the same category.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSetups.map((related: any) => (
                <Link key={related.id} href={`/setups/${related.slug}`} className="group block">
                  <div className="bg-[#FAFAF7] rounded-xl overflow-hidden border border-[#E6E1D8] hover:border-[#D97742]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-200">
                    <div className="relative aspect-[4/3] w-full bg-[#F5E6D3]">
                      {related.cover_image_url ? (
                        <Image
                          src={related.cover_image_url}
                          alt={related.owner_name}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-200"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[#6B6B6B] text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-[15px] font-semibold text-[#1E1E1E] group-hover:text-[#D97742] transition-colors">
                        {related.owner_name}
                      </h3>
                      <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2">
                        {related.short_intro}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}