// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Navbar from './../components/Navbar';
// import Footer from './../components/Footer';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     // Simulated login (Replace with your auth logic e.g., Supabase)
//     setTimeout(() => {
//       if (email === 'demo@example.com' && password === 'password') {
//         alert('Login successful!');
//       } else {
//         setError('Invalid email or password');
//       }
//       setLoading(false);
//     }, 1000);
//   };

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
//         <div className="w-full max-w-md">
          
//           {/* Card */}
//           <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
            
//             <div className="text-center mb-6">
//               <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
//               <p className="text-gray-500 text-sm mt-1">Sign in to your Workspaces account</p>
//             </div>

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md mb-4">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleLogin} className="space-y-4">
              
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email address
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2ecc71] focus:outline-none focus:ring-1 focus:ring-[#2ecc71]"
//                 />
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-1">
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password
//                   </label>
//                   <Link href="/forgot-password" className="text-xs text-[#2ecc71] hover:underline">
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <input
//                   id="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2ecc71] focus:outline-none focus:ring-1 focus:ring-[#2ecc71]"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white font-medium py-2.5 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </button>

//             </form>

//             <p className="mt-4 text-center text-sm text-gray-500">
//               Don't have an account?{' '}
//               <Link href="/signup" className="text-[#2ecc71] font-medium hover:underline">
//                 Sign up
//               </Link>
//             </p>
//           </div>

//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }















'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/admin')  // redirect to dashboard
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">DeskScrolls Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded" required />
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account? <Link href="/signup" className="text-blue-600 underline">Sign up</Link>
      </p>
      <p className="mt-2 text-sm text-right">
  <Link href="/forgot-password" className="text-blue-600 underline">
    Forgot Password?
  </Link>
</p>
    </div>
  )
}