


// // //  {/* Example: Featured Desk Setups Section */}
// // //       <FeaturedSection />

// // //       {/* 1. Default Variant (Image 1) */}
// // //       <SubscribeSection variant="default" />

// // //       {/* 2. Social Proof Variant (Image 2) */}
// // //       <SubscribeSection variant="social-proof" />

// // //       {/* 3. Testimonial Variant (Image 3) */}
// // //       <SubscribeSection variant="testimonial" />






// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'

// interface SubscribeSectionProps {
//   variant?: 'default' | 'social-proof' | 'testimonial'
// }

// export default function SubscribeSection({ variant = 'default' }: SubscribeSectionProps) {
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
//         setStatus('success')
//         setMessage('You\'re already subscribed! 🎉')
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

//     // Auto-dismiss success message after 5 seconds
//     if (status === 'success' || error?.code === '23505') {
//       setTimeout(() => {
//         setStatus('idle')
//         setMessage('')
//       }, 5000)
//     }
//   }

//   // Shared form input + button (DRY)
//   const formMarkup = (
//     <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         disabled={status === 'loading' || status === 'success'}
//         className="flex-1 rounded-md border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#2ecc71] focus:outline-none focus:ring-1 focus:ring-[#2ecc71] transition disabled:opacity-60"
//         required
//       />
//       <button
//         type="submit"
//         disabled={status === 'loading' || status === 'success'}
//         className="w-full sm:w-auto rounded-md bg-[#2ecc71] px-6 py-3 text-base font-semibold text-white hover:bg-[#27ae60] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
//       >
//         {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Done! ✓' : 'Subscribe'}
//       </button>
//     </form>
//   )

//   // Shared message banner
//   const messageBanner = message ? (
//     <div
//       className={`text-sm rounded-lg px-4 py-2.5 transition-all duration-300 ease-in-out ${
//         status === 'success'
//           ? 'bg-green-50 border border-green-200 text-green-700'
//           : 'bg-red-50 border border-red-200 text-red-700'
//       }`}
//     >
//       {message}
//     </div>
//   ) : null

//   // ========== VARIANT: DEFAULT ==========
//   if (variant === 'default') {
//     return (
//       <section className="bg-gray-50 py-16 px-4">
//         <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center leading-snug">
//             Like these setups? There are hundreds more.
//           </h2>
//           <h3 className="text-xl md:text-2xl font-semibold text-gray-800 text-center leading-snug">
//             Join 18,800+ creators getting one new workspace every Saturday.
//           </h3>
//           {formMarkup}
//           {messageBanner}
//         </div>
//       </section>
//     )
//   }

//   // ========== VARIANT: SOCIAL PROOF ==========
//   if (variant === 'social-proof') {
//     return (
//       <section className="bg-gray-50 py-16 px-4">
//         <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
//           <h2 className="text-xl md:text-2xl font-semibold text-gray-900 text-center leading-snug">
//             Join 18,800+ readers from companies like Google, Spotify, Meta, YouTube, and more.
//           </h2>
//           {formMarkup}
//           {messageBanner}
//         </div>
//       </section>
//     )
//   }

//   // ========== VARIANT: TESTIMONIAL ==========
//   if (variant === 'testimonial') {
//     return (
//       <section className="bg-gray-50 py-16 px-4">
//         <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
//           <div className="text-center">
//             <p className="text-2xl md:text-3xl font-normal text-gray-900 italic leading-snug">
//               &ldquo;Workspaces is the new MTV Cribs.&rdquo;
//             </p>
//             <p className="mt-2 text-base text-gray-500 font-normal">
//               — Sam DeBrule
//             </p>
//           </div>
//           {formMarkup}
//           {messageBanner}
//         </div>
//       </section>
//     )
//   }

//   return null
// }











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