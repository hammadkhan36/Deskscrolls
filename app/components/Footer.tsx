
// import Link from 'next/link'
// import NewsletterForm from './NewsletterForm'
// import Image from 'next/image';


// export default function Footer() {
//   return (
//     <footer
//       className="bg-[#FAFAF7] border-t border-[#E6E1D8] pt-10 pb-6"
//       style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* ── Top: Brand + Newsletter ── */}
//         <div className="flex flex-col lg:flex-row lg:justify-between gap-10 pb-10">

//           {/* Left: Wordmark, tagline, socials */}
//           <div className="flex flex-col gap-4 max-w-xs">
//             <Link href="/" className="flex items-center gap-0 select-none">
//          <Image
//             src="/favicon.svg"          // public folder ke relative path
//             alt="Desk Setups Tour"
//             width={30}               // apne hisaab se set karein
//             height={30}
//             priority                  // agar above the fold hai to
//             className="cursor-pointer"
//           />
        
//               {/* <span className="text-[17px] font-semibold tracking-[-0.3px] text-[#1E1E1E]">Desk</span>
//               <span
//                 className="text-[18px] italic text-[#BF6F4A]"
//                 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400 }}
//               >
//                 Scrolls
//               </span> */}
//             </Link>

//             <p className="text-[#6B6B6B] text-sm leading-relaxed">
//               Curated desk setup tours from designers, founders, and builders. Sent every Saturday.
//             </p>

//             {/* Social icons */}
//             <div className="flex items-center gap-4 mt-1">
//               <a href="#" className="text-[#6B6B6B] hover:text-[#D97742] transition-colors" aria-label="X (Twitter)">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
//                 </svg>
//               </a>
//               <a href="#" className="text-[#6B6B6B] hover:text-[#D97742] transition-colors" aria-label="Instagram">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
//                   <circle cx="12" cy="12" r="4"/>
//                   <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
//                 </svg>
//               </a>
//               <a href="#" className="text-[#6B6B6B] hover:text-[#D97742] transition-colors" aria-label="LinkedIn">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
//                   <circle cx="4" cy="4" r="2"/>
//                 </svg>
//               </a>
//             </div>
//           </div>

//           {/* Right: Newsletter CTA */}
//           <div className="flex-1 lg:max-w-md flex flex-col gap-3">
//             <p className="text-[13px] font-semibold uppercase tracking-widest text-[#BF6F4A]">
//               Weekly Workspace Tours
//             </p>
//             <p className="text-[#6B6B6B] text-sm leading-relaxed">
//               Get one new desk setup delivered to your inbox every Saturday morning.
//             </p>
//             <NewsletterForm />
//           </div>
//         </div>

//         {/* ── Divider ── */}
//         <div className="border-t border-[#E6E1D8] my-4" />

//         {/* ── Bottom: links + copyright ── */}
//         <div className="flex flex-col lg:flex-row justify-between items-center gap-5 text-[13px] text-[#6B6B6B]">
//           <div className="flex flex-wrap justify-center gap-5">
//             <Link href="/setups" className="hover:text-[#D97742] transition-colors">Setups</Link>
//             <Link href="/about"  className="hover:text-[#D97742] transition-colors">About</Link>
//             <Link href="/submit" className="hover:text-[#D97742] transition-colors">Submit a workspace</Link>
//             {/* <a    href="/rss"    className="hover:text-[#D97742] transition-colors">RSS</a> */}
//           </div>

//           <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-5">
//             <span className="text-xs">&copy; {new Date().getFullYear()} DeskScrolls.</span>
//             <div className="flex gap-3 text-xs">
//               <Link href="/report-abuse" className="hover:text-[#D97742] transition-colors">Report abuse</Link>
//               <Link href="/privacy"      className="hover:text-[#D97742] transition-colors">Privacy policy</Link>
//               <Link href="/terms"        className="hover:text-[#D97742] transition-colors">Terms of use</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }







import Image from 'next/image'
import Link from 'next/link'
import NewsletterForm from './NewsletterForm'
import { createServerSupabase } from '@/lib/supabase/server'

type FooterCategory = {
  name: string
  slug: string
}

export default async function Footer() {
  const supabase = await createServerSupabase()

  const [setupCategoriesResult, productCategoriesResult] =
    await Promise.all([
      supabase
        .from('categories')
        .select('name, slug')
        .order('name', { ascending: true })
        .limit(6),

      supabase
        .from('product_categories')
        .select('name, slug')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
        .limit(6),
    ])

  const setupCategories =
    (setupCategoriesResult.data ||
      []) as FooterCategory[]

  const productCategories =
    (productCategoriesResult.data ||
      []) as FooterCategory[]

  return (
    <footer
      className="border-t border-[#E6E1D8] bg-[#F4F0E9]"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label="DeskScroll homepage"
              className="inline-flex items-center gap-2"
            >
              <Image
                src="/favicon.svg"
                alt=""
                width={38}
                height={38}
              />

              <span className="text-lg font-semibold tracking-[-0.4px] text-[#1E1E1E]">
                Desk
                <span
                  className="font-normal italic text-[#BF6F4A]"
                  style={{
                    fontFamily:
                      '"Playfair Display", Georgia, serif',
                  }}
                >
                  Scroll
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#6B6B6B]">
              Real desk setups, workspace products and
              practical ideas for building a better place
              to work.
            </p>

            <Link
              href="/submit"
              className="mt-5 inline-flex rounded-md bg-[#1E1E1E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3A3A3A]"
            >
              Submit your workspace
            </Link>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-[#1E1E1E]">
              Explore
            </h2>

            <nav className="mt-4 flex flex-col gap-3 text-sm text-[#6B6B6B]">
              <Link
                href="/setups"
                className="hover:text-[#B85C2E]"
              >
                Desk Setups
              </Link>

              <Link
                href="/products"
                className="hover:text-[#B85C2E]"
              >
                Products
              </Link>

              <Link
                href="/brands"
                className="hover:text-[#B85C2E]"
              >
                Brands
              </Link>

              <Link
                href="/blogs"
                className="hover:text-[#B85C2E]"
              >
                Blog
              </Link>

              <Link
                href="/about"
                className="hover:text-[#B85C2E]"
              >
                About
              </Link>
            </nav>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold text-[#1E1E1E]">
              Setup Categories
            </h2>

            <nav className="mt-4 grid grid-cols-1 gap-3 text-sm text-[#6B6B6B]">
              {setupCategories.length > 0 ? (
                setupCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/${category.slug}`}
                    className="hover:text-[#B85C2E]"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <Link
                  href="/setups"
                  className="hover:text-[#B85C2E]"
                >
                  Browse all setups
                </Link>
              )}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold text-[#1E1E1E]">
              Product Categories
            </h2>

            <nav className="mt-4 grid grid-cols-1 gap-3 text-sm text-[#6B6B6B]">
              {productCategories.length > 0 ? (
                productCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?category=${category.slug}`}
                    className="hover:text-[#B85C2E]"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <Link
                  href="/products"
                  className="hover:text-[#B85C2E]"
                >
                  Browse all products
                </Link>
              )}
            </nav>
          </div>
        </div>

        <div
          id="footer-newsletter"
          className="mt-12 grid grid-cols-1 gap-5 rounded-2xl border border-[#DDD4C7] bg-[#FAFAF7] p-5 sm:p-7 lg:grid-cols-[1fr_440px] lg:items-center"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#BF6F4A]">
              Weekly workspace inspiration
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#1E1E1E]">
              Get new setups and workspace ideas.
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">
              A short email with featured setups, useful
              products and new articles.
            </p>
          </div>

          <NewsletterForm />
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-[#DDD4C7] pt-6 text-xs text-[#6B6B6B] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} DeskScroll. All
            rights reserved.
          </p>

          <nav className="flex flex-wrap gap-x-5 gap-y-3">
            <Link
              href="/privacy"
              className="hover:text-[#B85C2E]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="hover:text-[#B85C2E]"
            >
              Terms of Use
            </Link>

            <Link
              href="/report-abuse"
              className="hover:text-[#B85C2E]"
            >
              Report Abuse
            </Link>

            <Link
              href="/submit"
              className="hover:text-[#B85C2E]"
            >
              Submit Setup
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
