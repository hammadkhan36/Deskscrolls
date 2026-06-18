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