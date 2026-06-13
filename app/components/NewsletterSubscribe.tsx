// export default function NewsletterSubscribe() {
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
//         <div className="mt-6 flex max-w-md mx-auto">
//           <label htmlFor="email" className="sr-only">
//             Email address
//           </label>
//           <input
//             id="email"
//             type="email"
//             required
//             className="min-w-0 flex-auto rounded-l-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm sm:leading-6"
//             placeholder="Email"
//           />
//           <button
//             type="submit"
//             className="flex-none rounded-r-md bg-[#2ecc71] px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#27ae60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ecc71] sm:px-6 sm:py-2.5 sm:text-sm"
//           >
//             Subscribe
//           </button>
//         </div>

//       </div>
//     </section>
//   );
// }














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