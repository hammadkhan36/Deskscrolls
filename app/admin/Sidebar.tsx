// // 'use client'

// // import { useState } from 'react'
// // import Link from 'next/link'
// // import { useRouter } from 'next/navigation'
// // import { createClient } from '@/lib/supabase/client' // for logout

// // type NavLink = {
// //   href: string
// //   label: string
// //   roles: string[]
// // }

// // export default function Sidebar({ role, navLinks }: { role: string; navLinks: NavLink[] }) {
// //   const [open, setOpen] = useState(false)
// //   const supabase = createClient()
// //   const router = useRouter()

// //   const handleSignOut = async () => {
// //     await supabase.auth.signOut()
// //     router.push('/login')
// //   }

// //   return (
// //     <>
// //       {/* Hamburger button for mobile */}
// //       <button
// //         className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md md:hidden"
// //         onClick={() => setOpen(!open)}
// //       >
// //         {open ? '✕' : '☰'}
// //       </button>

// //       {/* Sidebar overlay for mobile */}
// //       {open && (
// //         <div
// //           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
// //           onClick={() => setOpen(false)}
// //         />
// //       )}

// //       {/* Sidebar */}
// //       <aside
// //         className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-200 ease-in-out ${
// //           open ? 'translate-x-0' : '-translate-x-full'
// //         } md:translate-x-0 md:static md:flex md:flex-col`}
// //       >
// //         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
// //           <div>
// //             <h2 className="text-xl font-bold">DeskScrolls</h2>
// //             <p className="text-sm text-gray-400">{role}</p>
// //           </div>
// //           {/* close button on mobile */}
// //           <button
// //             className="md:hidden p-1 hover:bg-gray-800 rounded"
// //             onClick={() => setOpen(false)}
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
// //           {navLinks
// //             .filter((link) => link.roles.includes(role))
// //             .map((link) => (
// //               <Link
// //                 key={link.href}
// //                 href={link.href}
// //                 onClick={() => setOpen(false)} // close sidebar on mobile after navigation
// //                 className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
// //               >
// //                 {link.label}
// //               </Link>
// //             ))}
// //         </nav>

// //         <div className="p-4 border-t border-gray-700">
// //           <button
// //             onClick={handleSignOut}
// //             className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 rounded"
// //           >
// //             Sign out
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Main content margin on mobile to avoid overlap with hamburger */}
// //       <div className="md:hidden h-12" />
// //     </>
// //   )
// // }















// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { createClient } from '@/lib/supabase/client'

// type NavLink = {
//   href: string
//   label: string
//   roles: string[]
// }

// export default function Sidebar({ role, navLinks }: { role: string; navLinks: NavLink[] }) {
//   const [open, setOpen] = useState(false)
//   const supabase = createClient()
//   const router = useRouter()

//   const handleSignOut = async () => {
//     await supabase.auth.signOut()
//     router.push('/login')
//   }

//   return (
//     <>
//       {/* Hamburger – only on mobile */}
//       <button
//         className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md md:hidden"
//         onClick={() => setOpen(!open)}
//         aria-label="Menu"
//       >
//         {open ? '✕' : '☰'}
//       </button>

//       {/* Overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-200 ease-in-out ${
//           open ? 'translate-x-0' : '-translate-x-full'
//         } md:translate-x-0 md:static md:flex md:flex-col`}
//       >
//         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold">DeskScrolls</h2>
//             <p className="text-sm text-gray-400">{role}</p>
//           </div>
//           <button
//             className="md:hidden p-1 hover:bg-gray-800 rounded"
//             onClick={() => setOpen(false)}
//             aria-label="Close menu"
//           >
//             ✕
//           </button>
//         </div>

//         <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//           {navLinks
//             .filter(link => link.roles.includes(role))
//             .map(link => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setOpen(false)}
//                 className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
//               >
//                 {link.label}
//               </Link>
//             ))}
//         </nav>

//         <div className="p-4 border-t border-gray-700">
//           <button
//             onClick={handleSignOut}
//             className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 rounded"
//           >
//             Sign out
//           </button>
//         </div>
//       </aside>

//       {/* Spacer for mobile (so content doesn't hide behind hamburger) */}
//       <div className="md:hidden h-12" />
//     </>
//   )
// }





















'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type NavLink = {
  href: string
  label: string
  roles: string[]
}

export default function Sidebar({ role, navLinks }: { role: string; navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Hamburger – only mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40 md:z-auto
          w-64 h-full md:h-screen
          bg-gray-900 text-white
          transform transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0  /* always visible on desktop */
          flex flex-col
        `}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">DeskScrolls</h2>
            <p className="text-sm text-gray-400">{role}</p>
          </div>
          <button
            className="md:hidden p-1 hover:bg-gray-800 rounded"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks
            .filter(link => link.roles.includes(role))
            .map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 rounded"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Spacer for mobile (prevents content hiding behind hamburger) */}
      <div className="md:hidden h-12" />
    </>
  )
}