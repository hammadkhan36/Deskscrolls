// export default function Footer() {
//   return (
//     <footer className="bg-white border-t border-gray-100 pt-10 pb-6">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* --- Top Section (Desktop: 2 Cols) --- */}
//         <div className="flex flex-col lg:flex-row lg:justify-between gap-10 pb-10">
          
//           {/* Left Side: Logo, Text, Social */}
//           <div className="flex flex-col gap-4 max-w-sm">
//             {/* Logo */}
//             <div className="relative flex items-center cursor-pointer">
//               <div className="border-2 border-green-500 rounded-md px-2 py-0.5 text-green-500 font-bold text-2xl shadow-[2px_4px_0px_rgba(34,197,94,0.2)]">
//                 W
//               </div>
//             </div>

//             {/* Description */}
//             <p className="text-gray-600 text-sm font-light leading-relaxed">
//               Workspaces of inspiring creatives, sent to your inbox every Saturday morning.
//             </p>

//             {/* Social Icons */}
//             <div className="flex items-center gap-5 mt-1">
//               {/* X (Twitter) */}
//               <a href="#" className="text-gray-500 hover:text-gray-700 transition">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
//                 </svg>
//               </a>
//               {/* LinkedIn */}
//               <a href="#" className="text-gray-500 hover:text-gray-700 transition">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//                 </svg>
//               </a>
//               {/* Instagram */}
//               <a href="#" className="text-gray-500 hover:text-gray-700 transition">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
//                 </svg>
//               </a>
//               {/* YouTube */}
//               <a href="#" className="text-gray-500 hover:text-gray-700 transition">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
//                 </svg>
//               </a>
//               {/* Bluesky (Butterfly icon) */}
//               <a href="#" className="text-gray-500 hover:text-gray-700 transition">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M12 10.8c-1.344-2.48-4.536-5.24-7.872-5.24-2.832 0-4.128 2.568-4.128 5.336 0 5.616 10.176 7.704 10.176 7.704S6.384 10.176 0 5.552c1.584.896 3.312 1.672 5.016 2.336C8.6 8.985 10.8 6.016 12 2.448c1.2 3.568 3.4 6.537 6.984 7.44 1.704-.664 3.432-1.44 5.016-2.336-6.384 4.624-10.176 16.224 0 12.864 0 0 10.176-2.088 10.176-7.704 0-2.768-1.296-5.336-4.128-5.336-3.336 0-6.528 2.76-7.872 5.24z"/>
//                 </svg>
//               </a>
//             </div>
//           </div>

//           {/* Right Side: Newsletter */}
//           <div className="flex-1 lg:max-w-md w-full flex flex-col gap-4">
//             <p className="text-gray-600 text-sm font-light leading-relaxed">
//               Subscribe to the newsletter to get notified when we drop a new workspace tour every Saturday morning.
//             </p>
            
//             <form className="flex flex-col sm:flex-row gap-2">
//               <input
//                 type="email"
//                 placeholder="Enter your email..."
//                 className="flex-1 rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="whitespace-nowrap rounded-md bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-800 transition shadow-sm"
//               >
//                 Subscribe
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* --- Divider --- */}
//         <div className="border-t border-gray-200 my-6"></div>

//         {/* --- Bottom Section --- */}
//         <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          
//           {/* Links */}
//           <div className="flex flex-wrap justify-center gap-6">
//             <a href="#" className="hover:text-gray-800 transition">Spaces</a>
//             <a href="#" className="hover:text-gray-800 transition">About</a>
//             <a href="#" className="hover:text-gray-800 transition">Submit a workspace</a>
//             <a href="#" className="hover:text-gray-800 transition">RSS</a>
//           </div>

//           {/* Copyright & Beehiiv Badge */}
//           <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
//             <span className="text-xs">&copy; 2026 Workspaces.</span>
//             <div className="flex gap-3 text-xs">
//               <a href="#" className="hover:text-gray-800">Report abuse</a>
//               <a href="#" className="hover:text-gray-800">Privacy policy</a>
//               <a href="#" className="hover:text-gray-800">Terms of use</a>
//             </div>
//             <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2 py-1 text-xs">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
//                 <line x1="4" y1="22" x2="4" y2="15"></line>
//               </svg>
//               <span>Powered by beehiiv</span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </footer>
//   );
// }















import Link from 'next/link'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10 pb-10">
          {/* Left Side: Logo, Text, Social */}
          <div className="flex flex-col gap-4 max-w-sm">
            <Link href="/">
              <div className="border-2 border-green-500 rounded-md px-2 py-0.5 text-green-500 font-bold text-2xl shadow-[2px_4px_0px_rgba(34,197,94,0.2)] inline-block">
                D
              </div>
            </Link>
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              DeskScrolls – inspiring desk setups, tours & interviews, sent to your inbox every Saturday.
            </p>
            <div className="flex items-center gap-5 mt-1">
              {/* Same social SVG icons as before */}
              <a href="#" className="text-gray-500 hover:text-gray-700 transition" aria-label="X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* ... other social icons same as before ... */}
            </div>
          </div>

          {/* Right Side: Newsletter */}
          <div className="flex-1 lg:max-w-md w-full flex flex-col gap-4">
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              Subscribe to get the latest desk setup tours every Saturday morning.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/setups" className="hover:text-gray-800 transition">Setups</Link>
            <Link href="/about" className="hover:text-gray-800 transition">About</Link>
            <Link href="/submit" className="hover:text-gray-800 transition">Submit a workspace</Link>
            <a href="/rss" className="hover:text-gray-800 transition">RSS</a>
          </div>

          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
            <span className="text-xs">&copy; {new Date().getFullYear()} DeskScrolls.</span>
            <div className="flex gap-3 text-xs">
              <Link href="/report-abuse" className="hover:text-gray-800">Report abuse</Link>
              <Link href="/privacy" className="hover:text-gray-800">Privacy policy</Link>
              <Link href="/terms" className="hover:text-gray-800">Terms of use</Link>
            </div>
            <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2 py-1 text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              <span>Powered by Txtify</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}