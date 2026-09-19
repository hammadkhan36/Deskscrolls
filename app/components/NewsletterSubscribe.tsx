
// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'

// export default function NewsletterSubscribe() {
//   const [email,   setEmail]   = useState('')
//   const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
//   const [message, setMessage] = useState('')
//   const supabase = createClient()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!email) return
//     setStatus('loading')
//     setMessage('')

//     const { error } = await supabase.from('newsletter_subscribers').insert({ email })

//     if (error) {
//       if (error.code === '23505') {
//         setStatus('success')
//         setMessage('Already subscribed — good taste! 🎉')
//         setEmail('')
//       } else {
//         setStatus('error')
//         setMessage('Something went wrong. Please try again.')
//       }
//     } else {
//       setStatus('success')
//       setMessage('Welcome aboard! 🎉')
//       setEmail('')
//     }

//     setTimeout(() => { setStatus('idle'); setMessage('') }, 5000)
//   }

//   return (
//     <section
//       id="subscribe"
//       className="bg-[#FAFAF7] border-b border-[#E6E1D8] px-4 py-16 sm:px-6 lg:py-24"
//     >
//       <div className="max-w-2xl mx-auto text-center">
//         {/* Eyebrow */}
//         <p className="text-[11px] font-semibold uppercase tracking-widest text-[#BF6F4A] mb-4">
//           Weekly Workspace Tours
//         </p>

//         {/* Headline */}
//         <h2
//           className="text-3xl sm:text-4xl font-bold text-[#1E1E1E] leading-snug mb-3"
//           style={{ fontFamily: 'Inter, sans-serif' }}
//         >
//           Explore the workspaces of modern creators.
//         </h2>

//         {/* Sub */}
//         <p className="text-[#6B6B6B] text-[16px] leading-relaxed mb-2">
//           Real desk setups from designers, founders, and builders — delivered every Saturday.
//         </p>

//         {/* <p className="text-[13px] text-[#6B6B6B] mb-7">
//           Join <span className="text-[#1E1E1E] font-medium">21,000+</span> readers
//         </p> */}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
//           <label htmlFor="hero-email" className="sr-only">Email address</label>
//           <input
//             id="hero-email"
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             disabled={status === 'loading' || status === 'success'}
//             placeholder="your@email.com"
//             className="min-w-0 flex-auto rounded-l-md border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#1E1E1E] placeholder:text-[#6B6B6B] focus:border-[#D97742] focus:outline-none focus:ring-1 focus:ring-[#D97742] transition disabled:opacity-60"
//           />
//           <button
//             type="submit"
//             disabled={status === 'loading' || status === 'success'}
//             className="flex-none rounded-r-md bg-[#D97742] px-5 py-3 text-sm font-semibold text-white hover:bg-[#B85C2E] transition-colors disabled:opacity-70"
//           >
//             {status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Done ✓' : 'Subscribe'}
//           </button>
//         </form>

//         {/* Feedback */}
//         {message && (
//           <div className={`mt-4 text-sm rounded-md px-4 py-2.5 inline-block ${
//             status === 'success'
//               ? 'bg-[#F5E6D3] border border-[#E6E1D8] text-[#B85C2E]'
//               : 'bg-red-50 border border-red-200 text-red-700'
//           }`}>
//             {message}
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }












'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type FormStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] =
    useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const timeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function resetMessageLater() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const normalizedEmail = email
      .trim()
      .toLowerCase()

    if (!normalizedEmail) {
      return
    }

    setStatus('loading')
    setMessage('')

    const supabase = createClient()

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: normalizedEmail,
      })

    if (error) {
      if (error.code === '23505') {
        setStatus('success')
        setMessage(
          'You are already subscribed — welcome back!'
        )
        setEmail('')
      } else {
        setStatus('error')
        setMessage(
          'Something went wrong. Please try again.'
        )
      }

      resetMessageLater()
      return
    }

    setStatus('success')
    setMessage(
      'Welcome aboard! Check your inbox for future updates.'
    )
    setEmail('')
    resetMessageLater()
  }

  const isSubmitting = status === 'loading'

  return (
    <section
      id="subscribe"
      className="scroll-mt-20 border-t border-[#E6E1D8] bg-[#F5EDE4] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BF6F4A]">
          Weekly workspace inspiration
        </p>

        <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.8px] text-[#1E1E1E] sm:text-4xl">
          Better setups, useful gear and practical ideas.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6B6B6B]">
          Get new desk setups, workspace products and
          helpful guides delivered to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <label
            htmlFor="homepage-newsletter-email"
            className="sr-only"
          >
            Email address
          </label>

          <input
            id="homepage-newsletter-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            disabled={isSubmitting}
            required
            autoComplete="email"
            placeholder="Enter your email address"
            className="min-h-12 min-w-0 flex-1 rounded-md border border-[#D9D2C7] bg-white px-4 py-3 text-base text-[#1E1E1E] outline-none transition placeholder:text-[#9A9288] focus:border-[#D97742] focus:ring-2 focus:ring-[#D97742]/20 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-12 rounded-md bg-[#D97742] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B85C2E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Subscribing…'
              : 'Subscribe'}
          </button>
        </form>

        <p className="mt-3 text-xs text-[#8A8177]">
          No spam. Unsubscribe whenever you want.
        </p>

        {message && (
          <div
            role="status"
            className={`mx-auto mt-5 max-w-xl rounded-md border px-4 py-3 text-sm ${
              status === 'success'
                ? 'border-[#E0CDBB] bg-white text-[#8F4526]'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </section>
  )
}
