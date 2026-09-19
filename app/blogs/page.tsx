import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import SubscribeSection from '@/components/SubscribeSection'
import AllBlogsSection from '@/components/AllBlogsSection'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Desk Setup Ideas, Guides & Workspace Tips',

  description:
    'Read desk setup ideas, workspace guides, gear advice, productivity tips, and practical inspiration for building a better workspace.',

  alternates: {
    canonical: '/blogs',
  },

  openGraph: {
    type: 'website',
    url: '/blogs',
    title: 'Desk Setup Ideas, Guides & Workspace Tips',
    description:
      'Read desk setup ideas, workspace guides, gear advice, productivity tips, and practical inspiration for building a better workspace.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Desk Setup Ideas, Guides & Workspace Tips',
    description:
      'Read desk setup ideas, workspace guides, gear advice, productivity tips, and practical inspiration for building a better workspace.',
  },
}

type BlogsPageProps = {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function BlogsPage({
  searchParams,
}: BlogsPageProps) {
  const params = await searchParams
  const category = params.category || 'all'

  return (
    <>
      <Navbar />

      <main>
        <SubscribeSection variant="testimonial" />

        <AllBlogsSection categorySlug={category} />
      </main>

      <Footer />
    </>
  )
}
