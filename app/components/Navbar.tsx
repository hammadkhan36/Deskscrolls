



// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
// import { createClient } from '@/lib/supabase/client'
// import { Lora } from 'next/font/google';

// // Lora font for italic "Scrolls" — exactly like the original inline style
// const lora = Lora({
//   subsets: ['latin'],
//   // style: ['italic'],
//   weight: ['400'], // normal italic weight
//   variable: '--font-lora',
// });

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [isSetupsOpen, setIsSetupsOpen] = useState(false)
//   const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
//   const dropdownRef = useRef<HTMLLIElement>(null)

//   // Fetch categories for "Setups" dropdown
//   useEffect(() => {
//     const supabase = createClient()
//     supabase
//       .from('categories')
//       .select('name, slug')
//       .order('name')
//       .then(({ data }) => {
//         if (data) setCategories(data)
//       })
//   }, [])

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsSetupsOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   return (
//     <nav className="flex items-center justify-between px-4 py-3 md:px-8 bg-white border-b border-gray-100 relative">
//       {/* Logo - links to home */}

//        <div
//         className="nav-logo font-sans text-base font-medium tracking-[-0.3px] text-gray-900 flex items-center justify-center flex-wrap gap-0 cursor-pointer"
//         // onClick={showBrandToast}
//         title="DeskScrolls — artisanal brand identity"
//       >
//         <span className="inline-block">Desk</span>
//         {/* Bronze + Lora italic span — replaces original <em> style */}
//         <span
//           className={`${lora.className} italic text-[#b87333] inline-block`}
//         >
//           Scrolls
//         </span>
//       </div>
  
//       <Link href="/" className="flex items-center cursor-pointer">
//         <div className="border-2 border-green-500 rounded-md px-2 py-0.5 text-green-500 font-bold text-2xl shadow-[2px_4px_0px_rgba(34,197,94,0.3)]">
//           D
//         </div>
//       </Link>

//       {/* Desktop Links */}
//       <ul className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
//         {/* Setups Dropdown */}
//         <li className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setIsSetupsOpen(!isSetupsOpen)}
//             className="flex items-center gap-1 hover:text-black cursor-pointer"
//           >
//             Setups
//             <span className={`text-xs transition-transform ${isSetupsOpen ? '' : 'rotate-180'}`}>⌄</span>
//           </button>
//           {isSetupsOpen && (
//             <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 w-48">
//               <Link
//                 href="/setups"
//                 className="block px-4 py-2 text-sm hover:bg-gray-100"
//                 onClick={() => setIsSetupsOpen(false)}
//               >
//                 All Setups
//               </Link>
//               <div className="border-t border-gray-100 my-1"></div>
//               {categories.map((cat) => (
//                 <Link
//                   key={cat.slug}
//                   href={`/setups?category=${cat.slug}`}
//                   className="block px-4 py-2 text-sm hover:bg-gray-100"
//                   onClick={() => setIsSetupsOpen(false)}
//                 >
//                   {cat.name}
//                 </Link>
//               ))}
//             </div>
//           )}
//         </li>

//         <li className="cursor-pointer hover:text-black">
//           <Link href="/setups">Interviews</Link>
//         </li>
//         <li className="cursor-pointer hover:text-black">
//           <Link href="/about">About</Link>
//         </li>
//         <li className="cursor-pointer hover:text-black">
//           <Link href="/submit">Submit</Link>
//         </li>
//       </ul>

//       {/* Desktop Actions */}
//       <div className="hidden md:flex items-center gap-4">
//         {/* Search Icon (static for now) */}
//         <button className="text-gray-600 hover:text-black">
//           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <circle cx="11" cy="11" r="8"></circle>
//             <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//           </svg>
//         </button>

//         <Link href="#subscribe">
//           <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition">
//             Subscribe
//           </button>
//         </Link>
//         <Link href="/login">
//           <button className="bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-md transition">
//             Login
//           </button>
//         </Link>
//       </div>

//       {/* Mobile Hamburger */}
//       <div
//         className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
//         onClick={() => setIsMenuOpen(!isMenuOpen)}
//       >
//         <span className="w-6 h-0.5 bg-gray-700"></span>
//         <span className="w-6 h-0.5 bg-gray-700"></span>
//         <span className="w-6 h-0.5 bg-gray-700"></span>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 md:hidden flex flex-col p-6 gap-4 shadow-lg z-50">
//           <div className="flex flex-col gap-3 text-gray-600 font-medium">
//             <Link href="/setups" onClick={() => setIsMenuOpen(false)}>Setups</Link>
//             {/* Mobile category links */}
//             <div className="pl-2 border-l border-gray-200 ml-2">
//               {categories.map((cat) => (
//                 <Link
//                   key={cat.slug}
//                   href={`/setups?category=${cat.slug}`}
//                   className="block py-1 text-sm hover:text-black"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {cat.name}
//                 </Link>
//               ))}
//             </div>
//             <Link href="/setups" onClick={() => setIsMenuOpen(false)}>Interviews</Link>
//             <Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
//             <Link href="/submit" onClick={() => setIsMenuOpen(false)}>Submit</Link>
//           </div>
//           <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
//             <Link href="#subscribe" onClick={() => setIsMenuOpen(false)}>
//               <button className="bg-green-500 text-white font-medium px-4 py-2 rounded-md flex-1">Subscribe</button>
//             </Link>
//             <Link href="/login" onClick={() => setIsMenuOpen(false)}>
//               <button className="bg-black text-white font-medium px-4 py-2 rounded-md flex-1">Login</button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }








'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen]   = useState(false)
  const [isSetupsOpen, setIsSetupsOpen] = useState(false)
  const [categories, setCategories]   = useState<{ name: string; slug: string }[]>([])
  const dropdownRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('categories')
      .select('name, slug')
      .order('name')
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSetupsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav
      className="sticky top-0 z-50 bg-[#FAFAF7] border-b border-[#E6E1D8]"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">

        {/* ── Wordmark ── */}
        <Link href="/" className="flex items-center gap-0 select-none">
         <Image
            src="/favicon.svg"          // public folder ke relative path
            alt="Desk Setups Tour"
            width={40}               // apne hisaab se set karein
            height={40}
            priority                  // agar above the fold hai to
            className="cursor-pointer"
          />
         {/* <Image
            src="/D.svg"          // public folder ke relative path
            alt="Desk Setups Tour"
            width={80}               // apne hisaab se set karein
            height={80}
            priority                  // agar above the fold hai to
            className="cursor-pointer"
          /> */}
         {/* <Image
            src="/10.svg"          // public folder ke relative path
            alt="Desk Setups Tour"
            width={90}               // apne hisaab se set karein
            height={90}
            priority                  // agar above the fold hai to
            className="cursor-pointer"
          />
         <Image
            src="/6.svg"          // public folder ke relative path
            alt="Desk Setups Tour"
            width={90}               // apne hisaab se set karein
            height={90}
            priority                  // agar above the fold hai to
            className="cursor-pointer"
          />
         <Image
            src="/7.svg"          // public folder ke relative path
            alt="Desk Setups Tour"
            width={90}               // apne hisaab se set karein
            height={90}
            priority                  // agar above the fold hai to
            className="cursor-pointer"
          /> */}
          {/* <span
            className="text-[17px] font-semibold tracking-[-0.3px] text-[#1E1E1E]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Desk
          </span> */}
          {/* <span
            className="text-[18px] italic text-[#BF6F4A]"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400 }}
          >
            DeskScrolls
          </span> */}
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#1E1E1E]">

          {/* Setups dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSetupsOpen(!isSetupsOpen)}
              className="flex items-center gap-1 hover:text-[#D97742] transition-colors"
            >
              Setups
              <svg
                className={`w-3.5 h-3.5 transition-transform ${isSetupsOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isSetupsOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#FAFAF7] border border-[#E6E1D8] rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-1.5 z-50">
                <Link
                  href="/setups"
                  onClick={() => setIsSetupsOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1E1E1E] hover:bg-[#F5E6D3] hover:text-[#D97742] transition-colors"
                >
                  All Setups
                </Link>
                <div className="border-t border-[#E6E1D8] my-1" />
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    // href={`/setups?category=${cat.slug}`}
                    href={`/${cat.slug}`}
                    onClick={() => setIsSetupsOpen(false)}
                    className="block px-4 py-2 text-sm text-[#6B6B6B] hover:bg-[#F5E6D3] hover:text-[#D97742] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </li>

          <li><Link href="/setups"  className="hover:text-[#D97742] transition-colors">Interviews</Link></li>
          <li><Link href="/about"   className="hover:text-[#D97742] transition-colors">About</Link></li>
          <li><Link href="/submit"  className="hover:text-[#D97742] transition-colors">Submit</Link></li>
        </ul>

        {/* ── Desktop actions ── */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="text-[#6B6B6B] hover:text-[#1E1E1E] transition-colors p-1"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link href="#subscribe">
            <button className="text-[14px] font-semibold px-4 py-1.5 rounded-md bg-[#D97742] text-white hover:bg-[#B85C2E] transition-colors">
              Subscribe
            </button>
          </Link>

          <Link href="/login">
            <button className="text-[14px] font-semibold px-4 py-1.5 rounded-md border border-[#E6E1D8] text-[#1E1E1E] hover:border-[#D97742] hover:text-[#D97742] transition-colors bg-white">
              Login
            </button>
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 text-[#1E1E1E]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#E6E1D8] bg-[#FAFAF7] px-4 pb-5 pt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-[15px] font-medium text-[#1E1E1E]">
            <Link href="/setups" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-[#E6E1D8]">All Setups</Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/setups?category=${cat.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="py-1.5 pl-3 text-[13px] text-[#6B6B6B] hover:text-[#D97742]"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/setups" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-[#E6E1D8]">Interviews</Link>
            <Link href="/about"  onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-[#E6E1D8]">About</Link>
            <Link href="/submit" onClick={() => setIsMenuOpen(false)} className="py-2">Submit</Link>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link href="#subscribe" onClick={() => setIsMenuOpen(false)} className="flex-1">
              <button className="w-full bg-[#D97742] text-white font-semibold py-2.5 rounded-md text-[14px] hover:bg-[#B85C2E] transition-colors">
                Subscribe
              </button>
            </Link>
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex-1">
              <button className="w-full border border-[#E6E1D8] text-[#1E1E1E] font-semibold py-2.5 rounded-md text-[14px] hover:border-[#D97742] hover:text-[#D97742] transition-colors">
                Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}


