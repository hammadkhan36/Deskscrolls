



// import Link from 'next/link'
// import NewsletterForm from './NewsletterForm'

// export default function Footer() {
//   return (
//     <footer className="bg-white border-t border-gray-100 pt-10 pb-6">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Top Section */}
//         <div className="flex flex-col lg:flex-row lg:justify-between gap-10 pb-10">
//           {/* Left Side: Logo, Text, Social */}
//           <div className="flex flex-col gap-4 max-w-sm">
//             <Link href="/">
//               <div className="border-2 border-green-500 rounded-md px-2 py-0.5 text-green-500 font-bold text-2xl shadow-[2px_4px_0px_rgba(34,197,94,0.2)] inline-block">
//                 D
//               </div>
//             </Link>
//             <p className="text-gray-600 text-sm font-light leading-relaxed">
//               DeskScrolls – inspiring desk setups, tours & interviews, sent to your inbox every Saturday.
//             </p>
//             <div className="flex items-center gap-5 mt-1">
//               {/* Same social SVG icons as before */}
//               <a href="#" className="text-gray-500 hover:text-gray-700 transition" aria-label="X (Twitter)">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
//                 </svg>
//               </a>
//               {/* ... other social icons same as before ... */}
//             </div>
//           </div>

//           {/* Right Side: Newsletter */}
//           <div className="flex-1 lg:max-w-md w-full flex flex-col gap-4">
//             <p className="text-gray-600 text-sm font-light leading-relaxed">
//               Subscribe to get the latest desk setup tours every Saturday morning.
//             </p>
//             <NewsletterForm />
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-gray-200 my-6"></div>

//         {/* Bottom Section */}
//         <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-gray-500">
//           <div className="flex flex-wrap justify-center gap-6">
//             <Link href="/setups" className="hover:text-gray-800 transition">Setups</Link>
//             <Link href="/about" className="hover:text-gray-800 transition">About</Link>
//             <Link href="/submit" className="hover:text-gray-800 transition">Submit a workspace</Link>
//             <a href="/rss" className="hover:text-gray-800 transition">RSS</a>
//           </div>

//           <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
//             <span className="text-xs">&copy; {new Date().getFullYear()} DeskScrolls.</span>
//             <div className="flex gap-3 text-xs">
//               <Link href="/report-abuse" className="hover:text-gray-800">Report abuse</Link>
//               <Link href="/privacy" className="hover:text-gray-800">Privacy policy</Link>
//               <Link href="/terms" className="hover:text-gray-800">Terms of use</Link>
//             </div>
//             <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2 py-1 text-xs">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
//                 <line x1="4" y1="22" x2="4" y2="15"></line>
//               </svg>
//               <span>Powered by Txtify</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }











import Link from 'next/link'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  return (
    <footer
      className="bg-[#FAFAF7] border-t border-[#E6E1D8] pt-10 pb-6"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top: Brand + Newsletter ── */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10 pb-10">

          {/* Left: Wordmark, tagline, socials */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/" className="flex items-center gap-0 select-none">
              <span className="text-[17px] font-semibold tracking-[-0.3px] text-[#1E1E1E]">Desk</span>
              <span
                className="text-[18px] italic text-[#BF6F4A]"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 400 }}
              >
                Scrolls
              </span>
            </Link>

            <p className="text-[#6B6B6B] text-sm leading-relaxed">
              Curated desk setup tours from designers, founders, and builders. Sent every Saturday.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-1">
              <a href="#" className="text-[#6B6B6B] hover:text-[#D97742] transition-colors" aria-label="X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-[#6B6B6B] hover:text-[#D97742] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="text-[#6B6B6B] hover:text-[#D97742] transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Newsletter CTA */}
          <div className="flex-1 lg:max-w-md flex flex-col gap-3">
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#BF6F4A]">
              Weekly Workspace Tours
            </p>
            <p className="text-[#6B6B6B] text-sm leading-relaxed">
              Get one new desk setup delivered to your inbox every Saturday morning.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-[#E6E1D8] my-4" />

        {/* ── Bottom: links + copyright ── */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-5 text-[13px] text-[#6B6B6B]">
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/setups" className="hover:text-[#D97742] transition-colors">Setups</Link>
            <Link href="/about"  className="hover:text-[#D97742] transition-colors">About</Link>
            <Link href="/submit" className="hover:text-[#D97742] transition-colors">Submit a workspace</Link>
            <a    href="/rss"    className="hover:text-[#D97742] transition-colors">RSS</a>
          </div>

          <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-5">
            <span className="text-xs">&copy; {new Date().getFullYear()} DeskScrolls.</span>
            <div className="flex gap-3 text-xs">
              <Link href="/report-abuse" className="hover:text-[#D97742] transition-colors">Report abuse</Link>
              <Link href="/privacy"      className="hover:text-[#D97742] transition-colors">Privacy policy</Link>
              <Link href="/terms"        className="hover:text-[#D97742] transition-colors">Terms of use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}