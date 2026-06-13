// 'use client';

// import { useState } from 'react';

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <nav className="flex items-center justify-between px-4 py-3 md:px-8 bg-white border-b border-gray-100">
      
//       {/* --- Logo --- */}
//       <div className="relative flex items-center cursor-pointer">
//         <div className="border-2 border-green-500 rounded-md px-2 py-0.5 text-green-500 font-bold text-2xl shadow-[2px_4px_0px_rgba(34,197,94,0.3)]">
//           D
//         </div>
//       </div>

//       {/* --- Desktop Links (Hidden on Mobile) --- */}
//       <ul className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
//         <li className="flex items-center cursor-pointer hover:text-black gap-1">
//           Setups
//           <span className="text-xs transform rotate-180">⌄</span>
//         </li>
//         <li className="cursor-pointer hover:text-black">Interviews</li>
//         <li className="cursor-pointer hover:text-black">About</li>
//         <li className="cursor-pointer hover:text-black">Submit</li>
//       </ul>

//       {/* --- Desktop Actions (Hidden on Mobile) --- */}
//       <div className="hidden md:flex items-center gap-4">
//         {/* Search Icon */}
//         <button className="text-gray-600 hover:text-black">
//           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <circle cx="11" cy="11" r="8"></circle>
//             <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//           </svg>
//         </button>

//         <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition">
//           Subscribe
//         </button>
//         <button className="bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-md transition">
//           Login
//         </button>
//       </div>

//       {/* --- Mobile Hamburger Menu (Hidden on Desktop) --- */}
//       <div 
//         className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
//         onClick={() => setIsMenuOpen(!isMenuOpen)}
//       >
//         <span className="w-6 h-0.5 bg-gray-700"></span>
//         <span className="w-6 h-0.5 bg-gray-700"></span>
//         <span className="w-6 h-0.5 bg-gray-700"></span>
//       </div>

//       {/* --- Mobile Menu Dropdown (Optional) --- */}
//       {isMenuOpen && (
//         <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 md:hidden flex flex-col p-6 gap-4 shadow-lg">
//           <div className="flex flex-col gap-3 text-gray-600 font-medium">
//             <span className="cursor-pointer hover:text-black">Setups</span>
//             <span className="cursor-pointer hover:text-black">Interviews</span>
//             <span className="cursor-pointer hover:text-black">About</span>
//             <span className="cursor-pointer hover:text-black">Submit</span>
//           </div>
//           <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
//             <button className="bg-green-500 text-white font-medium px-4 py-2 rounded-md flex-1">Subscribe</button>
//             <button className="bg-black text-white font-medium px-4 py-2 rounded-md flex-1">Login</button>
//           </div>
//         </div>
//       )}

//     </nav>
//   );
// }













'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSetupsOpen, setIsSetupsOpen] = useState(false)
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const dropdownRef = useRef<HTMLLIElement>(null)

  // Fetch categories for "Setups" dropdown
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('categories')
      .select('name, slug')
      .order('name')
      .then(({ data }) => {
        if (data) setCategories(data)
      })
  }, [])

  // Close dropdown when clicking outside
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
    <nav className="flex items-center justify-between px-4 py-3 md:px-8 bg-white border-b border-gray-100 relative">
      {/* Logo - links to home */}
      <Link href="/" className="flex items-center cursor-pointer">
        <div className="border-2 border-green-500 rounded-md px-2 py-0.5 text-green-500 font-bold text-2xl shadow-[2px_4px_0px_rgba(34,197,94,0.3)]">
          D
        </div>
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
        {/* Setups Dropdown */}
        <li className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSetupsOpen(!isSetupsOpen)}
            className="flex items-center gap-1 hover:text-black cursor-pointer"
          >
            Setups
            <span className={`text-xs transition-transform ${isSetupsOpen ? '' : 'rotate-180'}`}>⌄</span>
          </button>
          {isSetupsOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 w-48">
              <Link
                href="/setups"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setIsSetupsOpen(false)}
              >
                All Setups
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/setups?category=${cat.slug}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setIsSetupsOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </li>

        <li className="cursor-pointer hover:text-black">
          <Link href="/setups">Interviews</Link>
        </li>
        <li className="cursor-pointer hover:text-black">
          <Link href="/about">About</Link>
        </li>
        <li className="cursor-pointer hover:text-black">
          <Link href="/submit">Submit</Link>
        </li>
      </ul>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-4">
        {/* Search Icon (static for now) */}
        <button className="text-gray-600 hover:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        <Link href="#subscribe">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition">
            Subscribe
          </button>
        </Link>
        <Link href="/login">
          <button className="bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-md transition">
            Login
          </button>
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <div
        className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="w-6 h-0.5 bg-gray-700"></span>
        <span className="w-6 h-0.5 bg-gray-700"></span>
        <span className="w-6 h-0.5 bg-gray-700"></span>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 md:hidden flex flex-col p-6 gap-4 shadow-lg z-50">
          <div className="flex flex-col gap-3 text-gray-600 font-medium">
            <Link href="/setups" onClick={() => setIsMenuOpen(false)}>Setups</Link>
            {/* Mobile category links */}
            <div className="pl-2 border-l border-gray-200 ml-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/setups?category=${cat.slug}`}
                  className="block py-1 text-sm hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link href="/setups" onClick={() => setIsMenuOpen(false)}>Interviews</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/submit" onClick={() => setIsMenuOpen(false)}>Submit</Link>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <Link href="#subscribe" onClick={() => setIsMenuOpen(false)}>
              <button className="bg-green-500 text-white font-medium px-4 py-2 rounded-md flex-1">Subscribe</button>
            </Link>
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <button className="bg-black text-white font-medium px-4 py-2 rounded-md flex-1">Login</button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}