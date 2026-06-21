
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NewsletterForm() {
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
      // Check if it's a unique violation (duplicate email)
      if (error.code === '23505') {
        // duplicate key value violates unique constraint
        setStatus('success')
        setMessage('You are already subscribed! 🎉')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } else {
      // New subscriber
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
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          required
          disabled={status === 'loading' || status === 'success'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="whitespace-nowrap rounded-md bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-800 transition shadow-sm disabled:opacity-70"
        >
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Done!' : 'Subscribe'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-3 text-sm rounded-md px-4 py-2 transition-all duration-300 ease-in-out ${
            status === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}