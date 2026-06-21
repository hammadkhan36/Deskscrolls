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


