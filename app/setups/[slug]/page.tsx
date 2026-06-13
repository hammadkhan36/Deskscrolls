// import Navbar from './../../components/Navbar';
// import Footer from './../../components/Footer';
// import Image from 'next/image';
// import Link from 'next/link';
// import { notFound } from 'next/navigation';
// import postsData from './../../data/posts.json'; // Aapke dummy data ka path

// // Interfaces for TypeScript
// interface PostData {
//   slug: string;
//   title: string;
//   author: string;
//   authorInfo: string;
//   date: string;
//   intro: string;
//   postLinks: { label: string; url: string }[];
//   images: string[];
//   workspaceItems: string[];
//   tools: string[];
//   qa: {
//     usefulItem: string;
//     inspiration: string;
//     biggestChallenge: string;
//   };
//   relatedPosts: {
//     title: string;
//     subtitle: string;
//     imageUrl: string;
//     slug: string;
//   }[];
// }

// // Generate Static Params for SEO (Optional, but recommended)
// export async function generateStaticParams() {
//   return postsData.posts.map((post: PostData) => ({
//     slug: post.slug,
//   }));
// }

// export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params;
  
//   // Find the specific post from JSON
//   const post = postsData.posts.find((p: PostData) => p.slug === slug);

//   // If post not found, show 404 page
//   if (!post) {
//     notFound();
//   }

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-white pt-8 pb-16">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
//           {/* Header: Title, Author */}
//           <div className="mb-8 border-b border-gray-100 pb-6">
//             <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               {post.title}
//             </h1>
//             <p className="text-lg text-gray-700">
//               {post.authorInfo}
//             </p>
//           </div>

//           {/* Main Content Box (Green Border) */}
//           <div className="border border-green-500 rounded-lg p-6 sm:p-8 mb-12">
            
//             {/* Intro Section */}
//             <div className="mb-8 text-gray-800 space-y-4">
//               <p className="text-sm text-gray-600">
//                 By day, <span className="text-green-600 font-medium">Ivan Nedyalkov</span> is an Operations Product Manager at a large online retail company.
//               </p>
//               <p className="text-sm text-gray-600">
//                 On the side, he is an indie developer and designer. He's currently working on <span className="text-green-600">Velosity</span>, an iOS app for space enthusiasts that provides detailed tracking of ongoing and upcoming space launch operations.
//               </p>
//               <p className="text-sm text-gray-600">
//                 Follow his progress below as he builds out the app and also starts his own design agency.
//               </p>
//               <div className="text-sm text-gray-600">
//                 <span className="font-medium">Posts:</span> <a href="#" className="text-green-600 underline">posts.velosity.space</a>
//               </div>
//             </div>

//             {/* Images Section */}
//             <div className="flex flex-col gap-6 mb-10">
//               {post.images.map((img, index) => (
//                 <div key={index} className="relative w-full aspect-[4/3]">
//                   <Image
//                     src={img}
//                     alt={`${post.title} setup ${index + 1}`}
//                     fill
//                     className="object-cover rounded-md"
//                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Workspace Items */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-3">Workspace Items</h2>
//               <ul className="list-disc pl-5 space-y-1 text-gray-700">
//                 {post.workspaceItems.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ul>
//             </div>

//             {/* Tools */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-3">Tools</h2>
//               <ul className="list-disc pl-5 space-y-1 text-gray-700">
//                 {post.tools.map((tool, index) => (
//                   <li key={index}>{tool}</li>
//                 ))}
//               </ul>
//             </div>

//             {/* Q&A Section */}
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   What is the most useful item in your workspace?
//                 </h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   {post.qa.usefulItem}
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   How do you spark creativity?
//                 </h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   {post.qa.inspiration}
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   What has been the biggest challenge so far in building StellarJet?
//                 </h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   {post.qa.biggestChallenge}
//                 </p>
//               </div>
//             </div>

//           </div>

//           {/* CTA Box: "If you enjoyed this edition..." */}
//           <div className="border border-green-200 bg-green-50/50 rounded-lg p-6 text-center mb-8">
//             <p className="text-gray-800 font-medium mb-4">
//               If you enjoyed this edition of Workspaces, please consider sending it to a friend. <span className="text-red-500">❤️</span>
//             </p>
//             <p className="text-gray-700 text-sm">
//               Want to work with me in the future? <a href="#" className="text-green-600 underline">hello@example.com</a>
//             </p>
//           </div>

//           {/* CTA Box: "If you enjoyed this workspace tour..." */}
//           <div className="border border-gray-200 rounded-lg p-6 text-center flex flex-col items-center gap-4">
//             <p className="text-gray-800 font-medium">
//               If you enjoyed this workspace tour, and if you're the owner, consider sending a tip.
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

//       {/* Related Posts Section (Below the post content, but above footer) */}
//       <section className="bg-white border-t border-gray-100 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-10">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Setups</h2>
//             <p className="text-gray-600">More inspiring workspaces from the community.</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {post.relatedPosts.map((related, index) => (
//               <Link key={index} href={`/setups/${related.slug}`} className="group block">
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
//                   <div className="relative aspect-[4/3] w-full bg-gray-200">
//                     <Image
//                       src={related.imageUrl}
//                       alt={related.title}
//                       fill
//                       className="object-cover group-hover:scale-105 transition-transform duration-200"
//                       sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                     />
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
//                       {related.title}
//                     </h3>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {related.subtitle}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </>
//   );
// }
























// app/setups/[slug]/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

// Server component: fetch fresh data every time
export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  // 1. Fetch the setup with category, author, gallery images
  const { data: setup, error } = await supabase
    .from('setups')
    .select(`
      *,
      category:categories(name, slug),
      author:profiles(full_name, avatar_url),
      setup_images(id, image_url, alt_text, sort_order)
    `)
    .eq('slug', slug)
    .eq('published', true)          // only show published
    .single()

  if (error || !setup) {
    notFound()
  }

  // Sort gallery by sort_order
  const galleryImages = (setup.setup_images || []).sort(
    (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
  )

  // 2. Fetch related setups (same category, excluding current)
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
      <main className="min-h-screen bg-white pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title & Meta */}
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {setup.owner_name}&apos;s Desk Setup
            </h1>
            {setup.short_intro && (
              <p className="text-lg text-gray-700">{setup.short_intro}</p>
            )}
            {setup.category && (
              <Link
                href={`/setups?category=${setup.category.slug}`}
                className="text-sm text-green-600 mt-2 inline-block hover:underline"
              >
                {setup.category.name}
              </Link>
            )}
          </div>

          {/* Main Post Box */}
          <div className="border border-green-500 rounded-lg p-6 sm:p-8 mb-12">
            {/* Cover Image */}
            {/* {setup.cover_image_url && (
              <div className="relative w-full aspect-[4/3] mb-8">
                <Image
                  src={setup.cover_image_url}
                  alt={setup.owner_name}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                />
              </div>
            )} */}

            {/* Full Content (HTML from Tiptap) */}
            {setup.content && (
              <div
                className="prose prose-lg max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: setup.content }}
              />
            )}

            {/* Gallery Images */}
            {galleryImages.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {galleryImages.map((img: any) => (
                    <div key={img.id} className="relative aspect-[4/3]">
                      <Image
                        src={img.image_url}
                        alt={img.alt_text || 'Gallery image'}
                        fill
                        className="object-cover rounded-md"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Boxes (static, aap chahe to newsletter connect kar sakte hain) */}
          <div className="border border-green-200 bg-green-50/50 rounded-lg p-6 text-center mb-8">
            <p className="text-gray-800 font-medium mb-4">
              If you enjoyed this edition of Workspaces, please consider sending it to a friend. <span className="text-red-500">❤️</span>
            </p>
            <p className="text-gray-700 text-sm">
              Want to work with me in the future? <a href="#" className="text-green-600 underline">hello@example.com</a>
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 text-center flex flex-col items-center gap-4">
            <p className="text-gray-800 font-medium">
              If you enjoyed this workspace tour, and if you&apos;re the owner, consider sending a tip.
            </p>
            <form className="w-full max-w-sm flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button className="whitespace-nowrap rounded-md bg-[#2ecc71] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#27ae60] transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Related Setups */}
      {relatedSetups && relatedSetups.length > 0 && (
        <section className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Setups</h2>
              <p className="text-gray-600">More inspiring workspaces from the same category.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSetups.map((related: any) => (
                <Link key={related.id} href={`/setups/${related.slug}`} className="group block">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="relative aspect-[4/3] w-full bg-gray-200">
                      {related.cover_image_url ? (
                        <Image
                          src={related.cover_image_url}
                          alt={related.owner_name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {related.owner_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
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