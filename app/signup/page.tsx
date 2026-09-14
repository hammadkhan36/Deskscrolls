// // app/signup/page.tsx
// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// export default function SignupPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [fullName, setFullName] = useState('') // optional extra field
//   const [error, setError] = useState('')
//   const [message, setMessage] = useState('')
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()
//   const supabase = createClient()

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setMessage('')

//     // Signup with email + password, plus metadata (name)
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName, // stored in raw_user_meta_data
//         },
//       },
//     })

//     if (error) {
//       setError(error.message)
//       setLoading(false)
//       return
//     }

//     // If email confirmation is enabled, user will get an email.
//     // If not, the user is immediately signed in but may need to be redirected.
//     if (data.user && data.session) {
//       // Immediately signed in (confirmation disabled)
//       router.push('/admin') // or wherever you want
//     } else {
//       // Email confirmation required
//       setMessage('Signup successful! Please check your email to confirm your account.')
//     }
//     setLoading(false)
//   }

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
//       <h1 className="text-2xl font-bold mb-4">Create DeskScrolls Account</h1>

//       {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
//       {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-3">{message}</div>}

//       <form onSubmit={handleSignup} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Full Name (optional)"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           className="w-full border p-2 rounded"
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password (min. 6 characters)"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//           minLength={6}
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
//         >
//           {loading ? 'Creating account...' : 'Sign Up'}
//         </button>
//       </form>

//       <p className="mt-4 text-sm text-center">
//         Already have an account?{' '}
//         <Link href="/login" className="text-blue-600 underline">
//           Log in
//         </Link>
//       </p>
//     </div>
//   )
// }



'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push('/admin')
      router.refresh()
      return
    }

    setMessage(
      'Account created successfully. Please check your email to confirm your account.'
    )

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create your DeskScroll account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join DeskScroll and share your workspace.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-gray-900 underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
            }


