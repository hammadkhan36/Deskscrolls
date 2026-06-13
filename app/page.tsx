// import Image from "next/image";
// import Navbar from "./components/Navbar";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <Navbar/>
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }











'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import BlogCard from './components/BlogCard';
import Navbar from './components/Navbar';
import NewsletterSubscribe from './components/NewsletterSubscribe';
import FeaturedSection from './components/FeaturedSection';
import Footer from './components/Footer';
import SubscribeSection from './components/SubscribeSection';





export default function Home() {

   const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('categories')
      .select('name, slug')
      .then(({ data }) => {
        if (data) setCategories(data)
      })
  }, [])



  return (
    <main>
      <Navbar />
      <NewsletterSubscribe />

      {/* <BlogCard title="Benten Woodring" subtitle="Lead UI Designer" /> */}

      {/* <FeaturedSection /> */}
    
 {/* Category filter bar
      <div className="flex gap-2 px-4 pt-6 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full border ${selectedCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-full border whitespace-nowrap ${selectedCategory === cat.slug ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <FeaturedSection categorySlug={selectedCategory} limit={6} /> */}
 <FeaturedSection categorySlug="minimal-setups" limit={6} />

      {/* 1. Default Variant (Image 1) */}
      <SubscribeSection variant="default" />
      
 <FeaturedSection categorySlug="all" limit={6} />


      {/* 2. Social Proof Variant (Image 2) */}
      <SubscribeSection variant="social-proof" />

      {/* 3. Testimonial Variant (Image 3) */}
      <SubscribeSection variant="testimonial" />




      <Footer />

    </main>
  );
}