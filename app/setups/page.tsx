// import Navbar from './../components/Navbar';
// import SubscribeSection from './../components/SubscribeSection';
// import AllSetupsSection from './../components/AllSetupsSection';
// import Footer from './../components/Footer';

// export default function Home() {
//   return (
//     <>
//       <Navbar />
      
//       {/* Testimonial Subscribe Section (as shown in your screenshot) */}
//       <SubscribeSection variant="testimonial" />

//       {/* All Setups Grid */}
//       <AllSetupsSection />

//       <Footer />
//     </>
//   );
// }














// app/setups/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from './../components/Navbar'
import SubscribeSection from './../components/SubscribeSection'
import AllSetupsSection from './../components/AllSetupsSection'
import Footer from './../components/Footer'

function SetupsContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'

  return (
    <>
      <Navbar />
      <SubscribeSection variant="testimonial" />
      <AllSetupsSection categorySlug={category} />
      <Footer />
    </>
  )
}

export default function SetupsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <SetupsContent />
    </Suspense>
  )
}