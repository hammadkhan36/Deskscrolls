ya maan asa karta hon ka kisi ka desk setups ka photos use karta hon or us ka bara maan review likhta hon pr full details , owner intro or credits with social handles/backlinks likhta hon or publish karta hon or phir foran creator ko message karta hon link ka sath or permission maang lata hon agar wo pasand nahi karta ka nahi ya publish ki permission nahi ha tu maan article hata don ga 


is tarha mara paas start maan kuch setups bi aa jayin ga 

agar kisi na remove karna ka bola tu maan hata bi don ga 

jaab 15-20 setups ho jayin ga tu us ka baad haam pahla permission lan ga phir publish karan ga 

start maan thora risk latay han baad maan risk free ho jaay ga 


or jino na already kisi jagah interview dia hoa ha usa hi prefer karan ga kun ka us na pahla bi premission da di teh us na kisi webiste ko or willingly interview dia tah tu haman bi permission milna ka chances hon ga 

target audience wo han jina desksetups dakna ka shook ha , apna desk setup ready karna chahtay han, ya ideas lana chata han etcc......

Brand personality minimal rahkni ha 
Core actions jo user se karwana hai subscibe newsletter ka ha 










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
E:\Github\deskscrolls\app\page.tsx ka code 






import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DeskScrolls',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

E:\Github\deskscrolls\app\layout.tsx






/* @import "tailwindcss"; */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

E:\Github\deskscrolls\app\globals.css







/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  // plugins: [],
  plugins: [
  require('@tailwindcss/typography'),
],
}
E:\Github\deskscrolls\tailwind.config.js






'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Lora } from 'next/font/google';

// Lora font for italic "Scrolls" — exactly like the original inline style
const lora = Lora({
  subsets: ['latin'],
  // style: ['italic'],
  weight: ['400'], // normal italic weight
  variable: '--font-lora',
});

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

       <div
        className="nav-logo font-sans text-base font-medium tracking-[-0.3px] text-gray-900 flex items-center justify-center flex-wrap gap-0 cursor-pointer"
        // onClick={showBrandToast}
        title="DeskScrolls — artisanal brand identity"
      >
        <span className="inline-block">Desk</span>
        {/* Bronze + Lora italic span — replaces original <em> style */}
        <span
          className={`${lora.className} italic text-[#b87333] inline-block`}
        >
          Scrolls
        </span>
      </div>
  
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


E:\Github\deskscrolls\app\components\Navbar.tsx












'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    const { error } = await supabase.from('newsletter_subscribers').insert({ email })

    if (error) {
      if (error.code === '23505') {
        // Duplicate email
        setStatus('success')
        setMessage('You are already subscribed! 🎉')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } else {
      setStatus('success')
      setMessage('Subscribed successfully! 🎉')
      setEmail('')
    }

    // Auto-hide success message after 5 seconds
    if (status === 'success') {
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-3xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Explore the workspaces of modern creators.
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-lg leading-7 text-gray-600 sm:text-xl sm:leading-8">
          Weekly tours of real desk setups from designers, founders, and builders. Sent every Saturday.
        </p>

        {/* Trust Text */}
        <p className="mt-6 text-sm font-medium text-gray-500">
          Join 21,000+ readers
        </p>

        {/* Input & Subscribe Button */}
        <form onSubmit={handleSubmit} className="mt-6 flex max-w-md mx-auto">
          <label htmlFor="hero-email" className="sr-only">
            Email address
          </label>
          <input
            id="hero-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className="min-w-0 flex-auto rounded-l-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm sm:leading-6"
            placeholder="Email"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex-none rounded-r-md bg-[#2ecc71] px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#27ae60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ecc71] sm:px-6 sm:py-2.5 sm:text-sm disabled:opacity-70"
          >
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Done!' : 'Subscribe'}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 text-sm rounded-md px-4 py-2 inline-block transition-all duration-300 ${
              status === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </section>
  )
}

E:\Github\deskscrolls\app\components\NewsletterSubscribe.tsx

















'use client'

import { useEffect, useState, useCallback } from 'react'
import { getPublishedSetups } from '@/lib/supabase/getSetups'
import { createClient } from '@/lib/supabase/client'
import BlogCard from './BlogCard'
import Link from 'next/link'

type Setup = {
  id: string
  slug: string
  owner_name: string
  short_intro: string | null
  cover_image_url: string | null
}



export default function FeaturedSection({
  categorySlug = 'all',
  limit = 6,
}: {
  categorySlug?: string
  limit?: number
}) {
  const [setups, setSetups] = useState<Setup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [heading, setHeading] = useState('')
  const [intro, setIntro] = useState('')

  const fetchSectionData = useCallback(async () => {
  setLoading(true)
  setError(false)
  try {
    const supabase = createClient()

    // Determine which slug to fetch for heading/intro
    const headingSlug = categorySlug === 'all' ? 'all-setups' : categorySlug

    const [categoryRes, setupsRes] = await Promise.all([
      supabase
        .from('categories')
        .select('name, description')
        .eq('slug', headingSlug)
        .single(),
      getPublishedSetups(categorySlug, false),
    ])

    if (categoryRes.error || !categoryRes.data) {
      // Ultimate fallback (should not happen if category exists)
      setHeading('Featured Desk Setups')
      setIntro('A curated selection of standout workspaces from across the Workspaces archive')
    } else {
      setHeading(categoryRes.data.name || 'Featured Setups')
      setIntro(categoryRes.data.description || '')
    }

    if (setupsRes.error) throw setupsRes.error
    setSetups(setupsRes.setups?.slice(0, limit) || [])
  } catch (err) {
    console.error(err)
    setError(true)
  } finally {
    setLoading(false)
  }
}, [categorySlug, limit])


  useEffect(() => {
    fetchSectionData()
  }, [fetchSectionData])

  // ========== LOADING SKELETON ==========
  if (loading) {
    return (
      <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div className="flex-1 space-y-3">
            {/* Heading skeleton */}
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            {/* Intro skeleton */}
            <div className="h-4 bg-gray-200 rounded w-full max-w-md animate-pulse"></div>
          </div>
          {/* View all placeholder */}
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse hidden sm:block"></div>
        </div>

        {/* Card skeletons (max 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ========== ERROR ==========
  if (error) {
    return (
      <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white text-center">
        <p className="text-red-500 py-12">Failed to load setups. Please try again later.</p>
      </section>
    )
  }

  // ========== EMPTY ==========
  if (setups.length === 0) {
    return (
      <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white text-center">
        <p className="text-gray-500 py-12">No setups found in this category.</p>
      </section>
    )
  }

  // ========== ACTUAL CONTENT ==========
  return (
    <section className="px-4 py-8 md:px-8 max-w-7xl mx-auto bg-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{heading}</h2>
          {intro && <p className="text-gray-600 text-sm md:text-base mt-1">{intro}</p>}
        </div>
        <Link
          href={`/setups${categorySlug && categorySlug !== 'all' ? `?category=${categorySlug}` : ''}`}
          className="text-gray-700 font-medium hover:text-gray-900 text-sm whitespace-nowrap flex items-center gap-1"
        >
          View all <span className="text-lg leading-none">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setups.map((setup, index) => (
          <Link key={setup.id} href={`/setups/${setup.slug}`} className="block">
            <BlogCard
              title={setup.owner_name}
              subtitle={setup.short_intro || ''}
              imageUrl={setup.cover_image_url ?? undefined}
              altText={`${setup.owner_name} desk setup`}
              priority={index < 3}
            />
          </Link>
        ))}
      </div>
    </section>
  )
}

E:\Github\deskscrolls\app\components\FeaturedSection.tsx








'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SubscribeSectionProps {
  variant?: 'default' | 'social-proof' | 'testimonial'
}

export default function SubscribeSection({ variant = 'default' }: SubscribeSectionProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    const { error } = await supabase.from('newsletter_subscribers').insert({ email })

    if (error) {
      if (error.code === '23505') {
        setStatus('success')
        setMessage('You\'re already subscribed! 🎉')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } else {
      setStatus('success')
      setMessage('Welcome aboard! 🎉')
      setEmail('')
    }

    // Auto-dismiss success message after 5 seconds
    if (status === 'success' || error?.code === '23505') {
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  // Shared form input + button (DRY)
  const formMarkup = (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading' || status === 'success'}
        className="flex-1 rounded-md border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#2ecc71] focus:outline-none focus:ring-1 focus:ring-[#2ecc71] transition disabled:opacity-60"
        required
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="w-full sm:w-auto rounded-md bg-[#2ecc71] px-6 py-3 text-base font-semibold text-white hover:bg-[#27ae60] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
      >
        {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Done! ✓' : 'Subscribe'}
      </button>
    </form>
  )

  // Shared message banner
  const messageBanner = message ? (
    <div
      className={`text-sm rounded-lg px-4 py-2.5 transition-all duration-300 ease-in-out ${
        status === 'success'
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-red-50 border border-red-200 text-red-700'
      }`}
    >
      {message}
    </div>
  ) : null

  // ========== VARIANT: DEFAULT ==========
  if (variant === 'default') {
    return (
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center leading-snug">
            Like these setups? There are hundreds more.
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 text-center leading-snug">
            Join 18,800+ creators getting one new workspace every Saturday.
          </h3>
          {formMarkup}
          {messageBanner}
        </div>
      </section>
    )
  }

  // ========== VARIANT: SOCIAL PROOF ==========
  if (variant === 'social-proof') {
    return (
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 text-center leading-snug">
            Join 18,800+ readers from companies like Google, Spotify, Meta, YouTube, and more.
          </h2>
          {formMarkup}
          {messageBanner}
        </div>
      </section>
    )
  }

  // ========== VARIANT: TESTIMONIAL ==========
  if (variant === 'testimonial') {
    return (
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-normal text-gray-900 italic leading-snug">
              &ldquo;Workspaces is the new MTV Cribs.&rdquo;
            </p>
            <p className="mt-2 text-base text-gray-500 font-normal">
              — Sam DeBrule
            </p>
          </div>
          {formMarkup}
          {messageBanner}
        </div>
      </section>
    )
  }

  return null
}



E:\Github\deskscrolls\app\components\SubscribeSection.tsx























import Link from 'next/link'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10 pb-10">
          {/* Left Side: Logo, Text, Social */}
          <div className="flex flex-col gap-4 max-w-sm">
            <Link href="/">
              <div className="border-2 border-green-500 rounded-md px-2 py-0.5 text-green-500 font-bold text-2xl shadow-[2px_4px_0px_rgba(34,197,94,0.2)] inline-block">
                D
              </div>
            </Link>
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              DeskScrolls – inspiring desk setups, tours & interviews, sent to your inbox every Saturday.
            </p>
            <div className="flex items-center gap-5 mt-1">
              {/* Same social SVG icons as before */}
              <a href="#" className="text-gray-500 hover:text-gray-700 transition" aria-label="X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* ... other social icons same as before ... */}
            </div>
          </div>

          {/* Right Side: Newsletter */}
          <div className="flex-1 lg:max-w-md w-full flex flex-col gap-4">
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              Subscribe to get the latest desk setup tours every Saturday morning.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/setups" className="hover:text-gray-800 transition">Setups</Link>
            <Link href="/about" className="hover:text-gray-800 transition">About</Link>
            <Link href="/submit" className="hover:text-gray-800 transition">Submit a workspace</Link>
            <a href="/rss" className="hover:text-gray-800 transition">RSS</a>
          </div>

          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
            <span className="text-xs">&copy; {new Date().getFullYear()} DeskScrolls.</span>
            <div className="flex gap-3 text-xs">
              <Link href="/report-abuse" className="hover:text-gray-800">Report abuse</Link>
              <Link href="/privacy" className="hover:text-gray-800">Privacy policy</Link>
              <Link href="/terms" className="hover:text-gray-800">Terms of use</Link>
            </div>
            <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2 py-1 text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              <span>Powered by Txtify</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

E:\Github\deskscrolls\app\components\Footer.tsx










'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

type Setup = {
  id: string
  slug: string
  owner_name: string
  short_intro: string | null
  cover_image_url: string | null
}

const LIMIT = 9 // cards per page

export default function AllSetupsSection({ categorySlug = 'all' }: { categorySlug?: string }) {
  const [setups, setSetups] = useState<Setup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const supabase = createClient()

  // Fetch initial setups
  const fetchSetups = useCallback(
    async (from = 0, append = false) => {
      if (append) setLoadingMore(true)
      else setLoading(true)
      setError(false)

      try {
        let query = supabase
          .from('setups')
          .select('id, slug, owner_name, short_intro, cover_image_url')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .range(from, from + LIMIT - 1)

        // Category filter
        if (categorySlug && categorySlug !== 'all') {
          // Get category id first
          const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single()

          if (category) {
            query = query.eq('category_id', category.id)
          } else {
            // If category not found, return empty
            setSetups(append ? setups : [])
            setHasMore(false)
            return
          }
        }

        const { data, error, count } = await query

        if (error) throw error

        if (append) {
          setSetups((prev) => [...prev, ...(data || [])])
        } else {
          setSetups(data || [])
        }

        // If less than LIMIT returned, no more
        setHasMore((data?.length || 0) === LIMIT)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [categorySlug, setups]
  )

  useEffect(() => {
    fetchSetups(0, false)
  }, [categorySlug]) // reload when category changes

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return
    fetchSetups(setups.length, true) // append
  }

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Explore workspaces that inspire productivity
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Globally. Remote. Hybrid.
          </p>
        </div>

        {/* Loading / Error / Empty states */}
        {loading && !loadingMore && (
          <div className="text-center py-12">Loading setups...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">Failed to load setups.</div>
        )}
        {!loading && !error && setups.length === 0 && (
          <div className="text-center py-12 text-gray-500">No setups found in this category.</div>
        )}

        {/* Grid */}
        {setups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {setups.map((setup) => (
              <Link key={setup.id} href={`/setups/${setup.slug}`} className="group block">
                <div className="bg-white rounded-lg overflow-hidden border border-transparent hover:border-gray-200 transition-all shadow-sm hover:shadow-md">
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full bg-gray-100">
                    {setup.cover_image_url ? (
                      <Image
                        src={setup.cover_image_url}
                        alt={setup.owner_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  {/* Text */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2ecc71] transition-colors">
                      {setup.owner_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 leading-snug">
                      {setup.short_intro || ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-semibold px-8 py-3 rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}


E:\Github\deskscrolls\app\components\AllSetupsSection.tsx









// app/setups/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from './../components/Navbar'
import SubscribeSection from './../components/SubscribeSection'
import AllSetupsSection from './../components/AllSetupsSection'
import Footer from './../components/Footer'

function SetupsContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'

  return (
    <>
      <Navbar />
      <SubscribeSection variant="testimonial" />
      <AllSetupsSection categorySlug={category} />
      <Footer />
    </>
  )
}

export default function SetupsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <SetupsContent />
    </Suspense>
  )
}


E:\Github\deskscrolls\app\setups\page.tsx









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

E:\Github\deskscrolls\app\setups\[slug]\page.tsx















import Navbar from './../components/Navbar';
import Footer from './../components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
          
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-10">
            About Workspaces
          </h1>

          {/* Content - Flex column */}
          <div className="flex flex-col gap-6 text-gray-800 text-[16px] leading-relaxed">
            
            {/* TL;DR Section (Green Border Left) */}
            <div className="border-l-4 border-[#2ecc71] pl-5 py-1 italic text-gray-700">
              <span className="font-bold not-italic text-[#2ecc71]">TL;DR:</span> Workspaces is an independently run archive of real desk setups and home offices gathered from interviewing creative people around the world.
            </div>
            
            {/* Italic Intro */}
            <p className="italic">
              Founded in 2020 by <span className="font-bold not-italic text-[#2ecc71]">Ryan Gilbert</span>, it has grown to feature <span className="text-[#2ecc71]">500+ real-life workspace tours</span>, reaching <span className="text-[#2ecc71]">70,000+ followers</span> across social platforms, attracting over <span className="text-[#2ecc71]">2.5 million</span> total page views, while publishing a weekly newsletter that is read by <span className="text-[#2ecc71]">21,000+ subscribers</span>.
            </p>
            
            <p>
              Workspaces is a curated collection of real desk setups and home offices from creative people around the world.
            </p>
            
            <p>
              I started Workspaces in early 2020, as remote work quickly became the default for millions of people. Around that time, I began noticing more designers, developers, founders, and creators sharing photos of their desks and workspaces online. These weren&apos;t just images posted on Twitter — they were small windows into how people were actually working day to day.
            </p>
            
            <p>
              Those moments stuck with me.
            </p>
            
            <p>
              So on <span className="text-[#2ecc71]">April 5, 2020</span>, I published the first edition of Workspaces.
            </p>
            
            <p>
              Since then, Workspaces has grown into a living archive of modern workspaces, featuring <span className="text-[#2ecc71]">500+ desk setups</span> (and counting) from people working across tech, design, writing, and creative industries. Each workspace is submitted by the person who actually uses it, offering an honest look at the desks, tools, and environments that support their work.
            </p>
            
            <p>
              Every feature on Workspaces follows the same general idea — photos of a guest&apos;s real workspace, a background into the person behind it, and the tools they rely on each and every day.
            </p>
            
            <p>
              Some setups are minimal, some are highly refined (and might cost more than my car), and many evolve over time. Together, they show the wide range of ways people build spaces that help them focus, create, and do their best work.
            </p>
            
            <p>
              Over the years, Workspaces has quietly grown into the largest collection of real workspace tours on the internet.
            </p>

            {/* Stats List */}
            <ul className="list-disc pl-5 space-y-1 marker:text-gray-400">
              <li><span className="text-[#2ecc71]">21,000+</span> newsletter subscribers</li>
              <li><span className="text-[#2ecc71]">2,500,000+</span> total web page views</li>
              <li><span className="text-[#2ecc71]">70,000+</span> followers across social platforms</li>
            </ul>
            
            <p>
              Workspaces is for anyone who cares about their work environment. Whether you&apos;re setting up your first home office, upgrading your desk, designing a creative studio, or simply curious to see how your peers work.
            </p>
            
            <p>
              New workspace tours are published weekly, continuing the same idea the project started with — documenting the spaces where modern work actually happens.
            </p>
            
            <p>
              If that sounds like your kind of thing, you can <span className="text-[#2ecc71] font-medium">subscribe to Workspaces</span> to receive new desk setups every Saturday morning.
            </p>

            {/* Signature */}
            <div className="mt-4 pt-2">
              <p className="font-script text-2xl font-bold italic text-gray-800">
                Ryan Gilbert
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

E:\Github\deskscrolls\app\about\page.js














Project: DeskScrolls — curated desk setup tours
Brand Personality: Calm, minimal, organic, trustworthy

DESIGN TOKENS (NEW THEME):
Colors:
  primary: #5A7D63 (olive green)
  primary-dark: #476451
  primary-light: #E8F0E9 (very light green for badges/bg)
  text-primary: #1A1C1A
  text-secondary: #6E726E
  background: #FFFFFF
  background-alt: #F8FAF5 (warm off-white)
  border: #DCE1DA
  accent-brand: #8B9E7C (for "Scrolls" word)

Typography:
  font-heading: 'Inter', sans-serif (weight 700 for h1-h3, 600 for h4)
  font-body: 'Inter', sans-serif (weight 400, 500 for emphasis)
  font-brand: 'Playfair Display', serif italic (weight 400) for "Scrolls"




  Using the above design tokens, generate a new tailwind.config.js extension (or direct globals.css) that applies these colors and fonts. Keep using Tailwind. Also give me the <head> links for Google Fonts (Inter, Playfair Display). Use CSS variables for colors.


  Act as a senior UI designer. Using the provided design tokens (paste again), refactor my Navbar, Footer. Homepage , blog post page, feature section and other section and components (given above) beshak thora thora kar ka kaar do lakin ui ux ka ilwaa functions karab nahi karnay. Replace all hardcoded colors with the new theme (primary, surface, border). Use Inter font for links, and Playfair Display italic for "Scrolls". Ensure the mobile menu and dropdown use the new border/bg colors. Remove old green #2ecc71 and bronze #b87333 entirely. Output the complete updated code.

  or muja css or tailwind.config.js bi redy kar ka do current global css or tailwind.config.js ka code bi given ha uppar 


yaar maan na website ko branded banana ha 