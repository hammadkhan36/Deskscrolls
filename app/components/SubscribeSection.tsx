
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SubscribeSectionProps {
  variant?: 'default' | 'social-proof' | 'testimonial'
}

export default function SubscribeSection({ variant = 'default' }: SubscribeSectionProps) {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
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
        setStatus('success'); setMessage('Already subscribed! 🎉'); setEmail('')
      } else {
        setStatus('error'); setMessage('Something went wrong. Please try again.')
      }
    } else {
      setStatus('success'); setMessage('Welcome aboard! 🎉'); setEmail('')
    }

    setTimeout(() => { setStatus('idle'); setMessage('') }, 5000)
  }

  const Form = (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading' || status === 'success'}
        required
        className="flex-1 rounded-md border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#1E1E1E] placeholder:text-[#6B6B6B] focus:border-[#D97742] focus:outline-none focus:ring-1 focus:ring-[#D97742] transition disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="rounded-md bg-[#D97742] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B85C2E] transition-colors disabled:opacity-70 active:scale-95"
      >
        {status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Done ✓' : 'Subscribe'}
      </button>
    </form>
  )

  const Feedback = message ? (
    <div className={`text-sm rounded-md px-4 py-2.5 inline-block ${
      status === 'success'
        ? 'bg-[#F5E6D3] border border-[#E6E1D8] text-[#B85C2E]'
        : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
      {message}
    </div>
  ) : null

  /* ── DEFAULT ── */
  if (variant === 'default') {
    return (
      <section className="bg-[#F5EDE4] border-y border-[#E6E1D8] py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl md:text-[28px] font-bold text-[#1E1E1E] leading-snug">
            Like these setups? There are hundreds more.
          </h2>
          <p className="text-[#6B6B6B] text-[16px]">
            Join <span className="text-[#1E1E1E] font-semibold">18,800+</span> creators — one new workspace every Saturday.
          </p>
          {Form}
          {Feedback}
        </div>
      </section>
    )
  }

  /* ── SOCIAL PROOF ── */
  if (variant === 'social-proof') {
    return (
      <section className="bg-[#FAFAF7] border-y border-[#E6E1D8] py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#BF6F4A]">
            Trusted by creators at
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-[#1E1E1E] leading-snug max-w-xl">
            18,800+ readers from Google, Spotify, Meta, YouTube, and more.
          </h2>
          {Form}
          {Feedback}
        </div>
      </section>
    )
  }

  /* ── TESTIMONIAL ── */
  if (variant === 'testimonial') {
    return (
      <section className="bg-[#FAFAF7] border-y border-[#E6E1D8] py-16 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">
          <div>
            <p
              className="text-2xl md:text-3xl text-[#1E1E1E] leading-snug"
              style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 400 }}
            >
              &ldquo;DeskScrolls is the new MTV Cribs.&rdquo;
            </p>
            <p className="mt-3 text-sm text-[#6B6B6B]">— Sam DeBrule</p>
          </div>
          {Form}
          {Feedback}
        </div>
      </section>
    )
  }

  return null
}