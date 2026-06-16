

// 'use client'

// import { useState, useEffect } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import BlogCard from './components/BlogCard';
// import Navbar from './components/Navbar';
// import NewsletterSubscribe from './components/NewsletterSubscribe';
// import FeaturedSection from './components/FeaturedSection';
// import Footer from './components/Footer';
// import SubscribeSection from './components/SubscribeSection';





// export default function Home() {

//    const [selectedCategory, setSelectedCategory] = useState('all')
//   const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])

//   useEffect(() => {
//     const supabase = createClient()
//     supabase
//       .from('categories')
//       .select('name, slug')
//       .then(({ data }) => {
//         if (data) setCategories(data)
//       })
//   }, [])



//   return (
//     <main>
//       <Navbar />
//       <NewsletterSubscribe />

//       {/* <BlogCard title="Benten Woodring" subtitle="Lead UI Designer" /> */}

//       {/* <FeaturedSection /> */}
    
//  {/* Category filter bar
//       <div className="flex gap-2 px-4 pt-6 overflow-x-auto">
//         <button
//           onClick={() => setSelectedCategory('all')}
//           className={`px-4 py-2 rounded-full border ${selectedCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
//         >
//           All
//         </button>
//         {categories.map((cat) => (
//           <button
//             key={cat.slug}
//             onClick={() => setSelectedCategory(cat.slug)}
//             className={`px-4 py-2 rounded-full border whitespace-nowrap ${selectedCategory === cat.slug ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
//           >
//             {cat.name}
//           </button>
//         ))}
//       </div>

//       <FeaturedSection categorySlug={selectedCategory} limit={6} /> */}
//  <FeaturedSection categorySlug="minimal-setups" limit={6} />

//       {/* 1. Default Variant (Image 1) */}
//       <SubscribeSection variant="default" />
      
//  <FeaturedSection categorySlug="all" limit={6} />


//       {/* 2. Social Proof Variant (Image 2) */}
//       <SubscribeSection variant="social-proof" />

//       {/* 3. Testimonial Variant (Image 3) */}
//       <SubscribeSection variant="testimonial" />




//       <Footer />

//     </main>
//   );
// }

















// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from './components/Navbar'
import NewsletterSubscribe from './components/NewsletterSubscribe'
import FeaturedSection from './components/FeaturedSection'
import SubscribeSection from './components/SubscribeSection'
import Footer from './components/Footer'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('categories')
      .select('name, slug')
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  return (
    <main className="bg-[#FAFAF7]">
      <Navbar />
      <NewsletterSubscribe />

      {/* Minimal setups spotlight */}
      <FeaturedSection categorySlug="minimal-setups" limit={6} />

      {/* Mid-page subscribe nudge */}
      <SubscribeSection variant="default" />

      {/* All recent setups */}
      <FeaturedSection categorySlug="all" limit={6} />

      {/* Social proof */}
      <SubscribeSection variant="social-proof" />

      {/* Testimonial */}
      <SubscribeSection variant="testimonial" />

      <Footer />
    </main>
  )
}