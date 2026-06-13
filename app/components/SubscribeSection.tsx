// 'use client';

// interface SubscribeSectionProps {
//   variant?: 'default' | 'social-proof' | 'testimonial';
// }

// export default function SubscribeSection({ variant = 'default' }: SubscribeSectionProps) {
//   if (variant === 'default') {
//     return (
//       <section className="bg-gray-50 py-16 px-4">
//         <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
//           <h2 className="text-2xl md:text-3xl font-semibold text-black text-center leading-snug">
//             Like these setups? There are hundreds more.
//           </h2>
//           <h3 className="text-xl md:text-2xl font-semibold text-black text-center leading-snug">
//             Join 18,800+ creators getting one new workspace every Saturday.
//           </h3>
//           <form className="w-full max-w-md flex flex-col sm:flex-row gap-2 mt-2">
//             <input
//               type="email"
//               placeholder="Email"
//               className="flex-1 rounded-md border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#2ecc71] focus:outline-none focus:ring-1 focus:ring-[#2ecc71]"
//               required
//             />
//             <button
//               type="submit"
//               className="w-full sm:w-auto rounded-md bg-[#2ecc71] px-6 py-3 text-base font-semibold text-white hover:bg-[#27ae60] transition shadow-sm"
//             >
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </section>
//     );
//   }

//   if (variant === 'social-proof') {
//     return (
//       <section className="bg-gray-50 py-16 px-4">
//         <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
//           <h2 className="text-xl md:text-2xl font-semibold text-black text-center leading-snug">
//             Join 18,800+ readers from companies like Google, Spotify, Meta, YouTube, and more.
//           </h2>
//           <form className="w-full max-w-md flex flex-col sm:flex-row gap-2">
//             <input
//               type="email"
//               placeholder="Email"
//               className="flex-1 rounded-md border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#2ecc71] focus:outline-none focus:ring-1 focus:ring-[#2ecc71]"
//               required
//             />
//             <button
//               type="submit"
//               className="w-full sm:w-auto rounded-md bg-[#2ecc71] px-6 py-3 text-base font-semibold text-white hover:bg-[#27ae60] transition shadow-sm"
//             >
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </section>
//     );
//   }

//   if (variant === 'testimonial') {
//     return (
//       <section className="bg-gray-50 py-16 px-4">
//         <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
//           <div className="text-center">
//             <p className="text-2xl md:text-3xl font-normal text-black italic leading-snug">
//               &ldquo;Workspaces is the new MTV Cribs.&rdquo;
//             </p>
//             <p className="mt-2 text-base text-gray-500 font-normal">
//               -Sam DeBrule
//             </p>
//           </div>
//           <form className="w-full max-w-md flex flex-col sm:flex-row gap-2 mt-2">
//             <input
//               type="email"
//               placeholder="Email"
//               className="flex-1 rounded-md border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#2ecc71] focus:outline-none focus:ring-1 focus:ring-[#2ecc71]"
//               required
//             />
//             <button
//               type="submit"
//               className="w-full sm:w-auto rounded-md bg-[#2ecc71] px-6 py-3 text-base font-semibold text-white hover:bg-[#27ae60] transition shadow-sm"
//             >
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </section>
//     );
//   }

//   return null;
// }












// //  {/* Example: Featured Desk Setups Section */}
// //       <FeaturedSection />

// //       {/* 1. Default Variant (Image 1) */}
// //       <SubscribeSection variant="default" />

// //       {/* 2. Social Proof Variant (Image 2) */}
// //       <SubscribeSection variant="social-proof" />

// //       {/* 3. Testimonial Variant (Image 3) */}
// //       <SubscribeSection variant="testimonial" />
















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