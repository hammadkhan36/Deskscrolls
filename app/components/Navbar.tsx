// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
// import Image from 'next/image';
// import { createClient } from '@/lib/supabase/client'

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen]   = useState(false)
//   const [isSetupsOpen, setIsSetupsOpen] = useState(false)
//   const [categories, setCategories]   = useState<{ name: string; slug: string }[]>([])
//   const dropdownRef = useRef<HTMLLIElement>(null)

//   useEffect(() => {
//     const supabase = createClient()
//     supabase
//       .from('categories')
//       .select('name, slug')
//       .order('name')
//       .then(({ data }) => { if (data) setCategories(data) })
//   }, [])

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
//     <nav
//       className="sticky top-0 z-50 bg-[#FAFAF7] border-b border-[#E6E1D8]"
//       style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">

//         {/* ── Wordmark ── */}
//         <Link href="/" className="flex items-center gap-0 select-none">
//          <Image
//             src="/favicon.svg"          // public folder ke relative path
//             alt="Desk Setups Tour"
//             width={40}               // apne hisaab se set karein
//             height={40}
//             priority                  // agar above the fold hai to
//             className="cursor-pointer"
//           />
        
//         </Link>

//         {/* ── Desktop links ── */}
//         <ul className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#1E1E1E]">

//           {/* Setups dropdown */}
//           <li className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setIsSetupsOpen(!isSetupsOpen)}
//               className="flex items-center gap-1 hover:text-[#D97742] transition-colors"
//             >
//               Setups
//               <svg
//                 className={`w-3.5 h-3.5 transition-transform ${isSetupsOpen ? 'rotate-180' : ''}`}
//                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
//                 strokeLinecap="round" strokeLinejoin="round"
//               >
//                 <polyline points="6 9 12 15 18 9" />
//               </svg>
//             </button>

//             {isSetupsOpen && (
//               <div className="absolute top-full left-0 mt-2 w-48 bg-[#FAFAF7] border border-[#E6E1D8] rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-1.5 z-50">
//                 <Link
//                   href="/setups"
//                   onClick={() => setIsSetupsOpen(false)}
//                   className="block px-4 py-2 text-sm text-[#1E1E1E] hover:bg-[#F5E6D3] hover:text-[#D97742] transition-colors"
//                 >
//                   All Setups
//                 </Link>
//                 <div className="border-t border-[#E6E1D8] my-1" />
//                 {categories.map((cat) => (
//                   <Link
//                     key={cat.slug}
//                     // href={`/setups?category=${cat.slug}`}
//                     href={`/${cat.slug}`}
//                     onClick={() => setIsSetupsOpen(false)}
//                     className="block px-4 py-2 text-sm text-[#6B6B6B] hover:bg-[#F5E6D3] hover:text-[#D97742] transition-colors"
//                   >
//                     {cat.name}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </li>

//           <li><Link href="/setups"  className="hover:text-[#D97742] transition-colors">Interviews</Link></li>
//           <li><Link href="/about"   className="hover:text-[#D97742] transition-colors">About</Link></li>
//           <li><Link href="/submit"  className="hover:text-[#D97742] transition-colors">Submit</Link></li>
//         </ul>

//         {/* ── Desktop actions ── */}
//         <div className="hidden md:flex items-center gap-3">
//           <button
//             className="text-[#6B6B6B] hover:text-[#1E1E1E] transition-colors p-1"
//             aria-label="Search"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
//               fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//             </svg>
//           </button>

//           <Link href="#subscribe">
//             <button className="text-[14px] font-semibold px-4 py-1.5 rounded-md bg-[#D97742] text-white hover:bg-[#B85C2E] transition-colors">
//               Subscribe
//             </button>
//           </Link>

//           {/* <Link href="/login">
//             <button className="text-[14px] font-semibold px-4 py-1.5 rounded-md border border-[#E6E1D8] text-[#1E1E1E] hover:border-[#D97742] hover:text-[#D97742] transition-colors bg-white">
//               Login
//             </button>
//           </Link> */}
//         </div>

//         {/* ── Mobile hamburger ── */}
//         <button
//           className="md:hidden p-2 text-[#1E1E1E]"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           aria-label="Toggle menu"
//         >
//           {isMenuOpen ? (
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//             </svg>
//           ) : (
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="3" y1="6"  x2="21" y2="6"  />
//               <line x1="3" y1="12" x2="21" y2="12" />
//               <line x1="3" y1="18" x2="21" y2="18" />
//             </svg>
//           )}
//         </button>
//       </div>

//       {/* ── Mobile menu ── */}
//       {isMenuOpen && (
//         <div className="md:hidden border-t border-[#E6E1D8] bg-[#FAFAF7] px-4 pb-5 pt-3 flex flex-col gap-3">
//           <div className="flex flex-col gap-1 text-[15px] font-medium text-[#1E1E1E]">
//             <Link href="/setups" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-[#E6E1D8]">All Setups</Link>
//             {categories.map((cat) => (
//               <Link
//                 key={cat.slug}
//                 href={`/setups?category=${cat.slug}`}
//                 onClick={() => setIsMenuOpen(false)}
//                 className="py-1.5 pl-3 text-[13px] text-[#6B6B6B] hover:text-[#D97742]"
//               >
//                 {cat.name}
//               </Link>
//             ))}
//             <Link href="/setups" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-[#E6E1D8]">Interviews</Link>
//             <Link href="/about"  onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-[#E6E1D8]">About</Link>
//             <Link href="/submit" onClick={() => setIsMenuOpen(false)} className="py-2">Submit</Link>
//           </div>
//           <div className="flex items-center gap-3 pt-2">
//             <Link href="#subscribe" onClick={() => setIsMenuOpen(false)} className="flex-1">
//               <button className="w-full bg-[#D97742] text-white font-semibold py-2.5 rounded-md text-[14px] hover:bg-[#B85C2E] transition-colors">
//                 Subscribe
//               </button>
//             </Link>
//             {/* <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex-1">
//               <button className="w-full border border-[#E6E1D8] text-[#1E1E1E] font-semibold py-2.5 rounded-md text-[14px] hover:border-[#D97742] hover:text-[#D97742] transition-colors">
//                 Login
//               </button>
//             </Link> */}
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }






'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type SetupCategory = {
  name: string
  slug: string
}

const mainLinks = [
  {
    label: 'Products',
    href: '/products',
  },
  {
    label: 'Brands',
    href: '/brands',
  },
  {
    label: 'Blog',
    href: '/blogs',
  },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSetupsOpen, setIsSetupsOpen] = useState(false)
  const [isMobileSetupsOpen, setIsMobileSetupsOpen] =
    useState(false)
  const [categories, setCategories] = useState<
    SetupCategory[]
  >([])

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    let active = true

    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('name, slug')
        .order('name', { ascending: true })
        .limit(12)

      if (active) {
        setCategories(data || [])
      }
    }

    loadCategories()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSetupsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSetupsOpen(false)
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
      document.removeEventListener(
        'keydown',
        handleEscape
      )
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen
      ? 'hidden'
      : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  function closeMobileMenu() {
    setIsMenuOpen(false)
    setIsMobileSetupsOpen(false)
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b border-[#E6E1D8] bg-[#FAFAF7]/95 backdrop-blur"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="DeskScroll homepage"
          className="flex items-center gap-2"
        >
          <Image
            src="/favicon.svg"
            alt=""
            width={40}
            height={40}
            priority
          />

          <span className="hidden text-lg font-semibold tracking-[-0.4px] text-[#1E1E1E] sm:inline">
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

        <div className="hidden items-center gap-7 md:flex">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() =>
                setIsSetupsOpen((current) => !current)
              }
              aria-expanded={isSetupsOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1.5 text-sm font-medium text-[#1E1E1E] transition-colors hover:text-[#D97742]"
            >
              Setups

              <svg
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform ${
                  isSetupsOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isSetupsOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-3 w-60 overflow-hidden rounded-xl border border-[#E6E1D8] bg-[#FAFAF7] py-2 shadow-[0_14px_40px_rgba(30,30,30,0.12)]"
              >
                <Link
                  href="/setups"
                  role="menuitem"
                  onClick={() => setIsSetupsOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-[#1E1E1E] transition-colors hover:bg-[#F5E6D3] hover:text-[#B85C2E]"
                >
                  View all setups
                </Link>

                {categories.length > 0 && (
                  <>
                    <div className="mx-4 my-1 border-t border-[#E6E1D8]" />

                    <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8177]">
                      Categories
                    </p>

                    <div className="max-h-72 overflow-y-auto">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/${category.slug}`}
                          role="menuitem"
                          onClick={() =>
                            setIsSetupsOpen(false)
                          }
                          className="block px-4 py-2 text-sm text-[#6B6B6B] transition-colors hover:bg-[#F5E6D3] hover:text-[#B85C2E]"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#1E1E1E] transition-colors hover:text-[#D97742]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/about"
            className="text-sm font-medium text-[#1E1E1E] transition-colors hover:text-[#D97742]"
          >
            About
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/submit"
            className="rounded-md border border-[#D9D2C7] px-4 py-2 text-sm font-semibold text-[#1E1E1E] transition-colors hover:border-[#D97742] hover:text-[#B85C2E]"
          >
            Submit setup
          </Link>

          <Link
            href="/#subscribe"
            className="rounded-md bg-[#D97742] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#B85C2E]"
          >
            Subscribe
          </Link>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsMenuOpen((current) => !current)
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            isMenuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          className="flex h-10 w-10 items-center justify-center rounded-md text-[#1E1E1E] transition-colors hover:bg-[#F5E6D3] md:hidden"
        >
          {isMenuOpen ? (
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-[#E6E1D8] bg-[#FAFAF7] md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 pb-8 pt-4 sm:px-6">
            <button
              type="button"
              onClick={() =>
                setIsMobileSetupsOpen(
                  (current) => !current
                )
              }
              aria-expanded={isMobileSetupsOpen}
              className="flex min-h-12 w-full items-center justify-between border-b border-[#E6E1D8] py-3 text-left text-base font-semibold text-[#1E1E1E]"
            >
              Setups

              <svg
                aria-hidden="true"
                className={`h-4 w-4 transition-transform ${
                  isMobileSetupsOpen
                    ? 'rotate-180'
                    : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isMobileSetupsOpen && (
              <div className="border-b border-[#E6E1D8] bg-[#F7F3ED] px-3 py-3">
                <Link
                  href="/setups"
                  onClick={closeMobileMenu}
                  className="block rounded-md px-3 py-2.5 text-sm font-semibold text-[#1E1E1E] hover:bg-[#F5E6D3]"
                >
                  View all setups
                </Link>

                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/${category.slug}`}
                    onClick={closeMobileMenu}
                    className="block rounded-md px-3 py-2.5 text-sm text-[#6B6B6B] hover:bg-[#F5E6D3] hover:text-[#B85C2E]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="flex min-h-12 items-center border-b border-[#E6E1D8] py-3 text-base font-semibold text-[#1E1E1E]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="flex min-h-12 items-center border-b border-[#E6E1D8] py-3 text-base font-semibold text-[#1E1E1E]"
            >
              About
            </Link>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/submit"
                onClick={closeMobileMenu}
                className="flex min-h-12 items-center justify-center rounded-md border border-[#D9D2C7] px-5 py-3 text-sm font-semibold text-[#1E1E1E]"
              >
                Submit your setup
              </Link>

              <Link
                href="/#subscribe"
                onClick={closeMobileMenu}
                className="flex min-h-12 items-center justify-center rounded-md bg-[#D97742] px-5 py-3 text-sm font-semibold text-white"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
