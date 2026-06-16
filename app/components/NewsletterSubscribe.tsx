
// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'

// export default function NewsletterSubscribe() {
//   const [email, setEmail] = useState('')
//   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
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
//         // Duplicate email
//         setStatus('success')
//         setMessage('You are already subscribed! 🎉')
//         setEmail('')
//       } else {
//         setStatus('error')
//         setMessage('Something went wrong. Please try again.')
//       }
//     } else {
//       setStatus('success')
//       setMessage('Subscribed successfully! 🎉')
//       setEmail('')
//     }

//     // Auto-hide success message after 5 seconds
//     if (status === 'success') {
//       setTimeout(() => {
//         setStatus('idle')
//         setMessage('')
//       }, 5000)
//     }
//   }

//   return (
//     <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:py-24">
//       <div className="max-w-3xl mx-auto text-center">
//         {/* Title */}
//         <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//           Explore the workspaces of modern creators.
//         </h2>

//         {/* Subtitle */}
//         <p className="mt-4 text-lg leading-7 text-gray-600 sm:text-xl sm:leading-8">
//           Weekly tours of real desk setups from designers, founders, and builders. Sent every Saturday.
//         </p>

//         {/* Trust Text */}
//         <p className="mt-6 text-sm font-medium text-gray-500">
//           Join 21,000+ readers
//         </p>

//         {/* Input & Subscribe Button */}
//         <form onSubmit={handleSubmit} className="mt-6 flex max-w-md mx-auto">
//           <label htmlFor="hero-email" className="sr-only">
//             Email address
//           </label>
//           <input
//             id="hero-email"
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             disabled={status === 'loading' || status === 'success'}
//             className="min-w-0 flex-auto rounded-l-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm sm:leading-6"
//             placeholder="Email"
//           />
//           <button
//             type="submit"
//             disabled={status === 'loading' || status === 'success'}
//             className="flex-none rounded-r-md bg-[#2ecc71] px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#27ae60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ecc71] sm:px-6 sm:py-2.5 sm:text-sm disabled:opacity-70"
//           >
//             {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Done!' : 'Subscribe'}
//           </button>
//         </form>

//         {/* Message */}
//         {message && (
//           <div
//             className={`mt-4 text-sm rounded-md px-4 py-2 inline-block transition-all duration-300 ${
//               status === 'success'
//                 ? 'bg-green-50 border border-green-200 text-green-700'
//                 : 'bg-red-50 border border-red-200 text-red-700'
//             }`}
//           >
//             {message}
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }







'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NewsletterSubscribe() {
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
        setStatus('success')
        setMessage('Already subscribed — good taste! 🎉')
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

    setTimeout(() => { setStatus('idle'); setMessage('') }, 5000)
  }

  return (
    <section
      id="subscribe"
      className="bg-[#FAFAF7] border-b border-[#E6E1D8] px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Eyebrow */}
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#BF6F4A] mb-4">
          Weekly Workspace Tours
        </p>

        {/* Headline */}
        <h2
          className="text-3xl sm:text-4xl font-bold text-[#1E1E1E] leading-snug mb-3"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Explore the workspaces of modern creators.
        </h2>

        {/* Sub */}
        <p className="text-[#6B6B6B] text-[16px] leading-relaxed mb-2">
          Real desk setups from designers, founders, and builders — delivered every Saturday.
        </p>

        <p className="text-[13px] text-[#6B6B6B] mb-7">
          Join <span className="text-[#1E1E1E] font-medium">21,000+</span> readers
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
          <label htmlFor="hero-email" className="sr-only">Email address</label>
          <input
            id="hero-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            placeholder="your@email.com"
            className="min-w-0 flex-auto rounded-l-md border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#1E1E1E] placeholder:text-[#6B6B6B] focus:border-[#D97742] focus:outline-none focus:ring-1 focus:ring-[#D97742] transition disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex-none rounded-r-md bg-[#D97742] px-5 py-3 text-sm font-semibold text-white hover:bg-[#B85C2E] transition-colors disabled:opacity-70"
          >
            {status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Done ✓' : 'Subscribe'}
          </button>
        </form>

        {/* Feedback */}
        {message && (
          <div className={`mt-4 text-sm rounded-md px-4 py-2.5 inline-block ${
            status === 'success'
              ? 'bg-[#F5E6D3] border border-[#E6E1D8] text-[#B85C2E]'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </section>
  )
}