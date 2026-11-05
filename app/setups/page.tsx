// import type { Metadata } from 'next'
// import Navbar from './../components/Navbar'
// import SubscribeSection from './../components/SubscribeSection'
// import AllSetupsSection from './../components/AllSetupsSection'
// import Footer from './../components/Footer'

// export const metadata: Metadata = {
//   title: 'Desk Setups & Workspace Inspiration',
//   description:
//     'Explore real desk setups and workspace ideas for gaming, productivity, work from home, minimal desks, and creative spaces.',

//   alternates: {
//     canonical: '/setups',
//   },

//   openGraph: {
//     title: 'Desk Setups & Workspace Inspiration',
//     description:
//       'Explore real desk setups and workspace ideas for gaming, productivity, work from home, minimal desks, and creative spaces.',
//     url: '/setups',
//     type: 'website',
//   },

//   twitter: {
//     card: 'summary_large_image',
//     title: 'Desk Setups & Workspace Inspiration',
//     description:
//       'Explore real desk setups and workspace ideas for gaming, productivity, work from home, minimal desks, and creative spaces.',
//   },
// }

// type SetupsPageProps = {
//   searchParams: Promise<{
//     category?: string
//   }>
// }

// export default async function SetupsPage({
//   searchParams,
// }: SetupsPageProps) {
//   const params = await searchParams
//   const category = params.category || 'all'

//   return (
//     <>
//       <Navbar />

//       <main>
//         <SubscribeSection variant="testimonial" />

//         <AllSetupsSection categorySlug={category} />
//       </main>

//       <Footer />
//     </>
//   )
// }




import type { Metadata } from 'next'
import Navbar from './../components/Navbar'
import SubscribeSection from './../components/SubscribeSection'
import AllSetupsSection, {
  type SetupListItem,
} from './../components/AllSetupsSection'
import Footer from './../components/Footer'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Desk Setups & Workspace Inspiration',
  description:
    'Explore real desk setups and workspace ideas for gaming, productivity, work from home, minimal desks, and creative spaces.',
  alternates: {
    canonical: '/setups',
  },
  openGraph: {
    title: 'Desk Setups & Workspace Inspiration',
    description:
      'Explore real desk setups and workspace ideas for gaming, productivity, work from home, minimal desks, and creative spaces.',
    url: '/setups',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desk Setups & Workspace Inspiration',
    description:
      'Explore real desk setups and workspace ideas for gaming, productivity, work from home, minimal desks, and creative spaces.',
  },
}

type SetupsPageProps = {
  searchParams: Promise<{
    category?: string
  }>
}

const PAGE_SIZE = 9

async function getInitialSetups(
  categorySlug: string
) {
  const supabase =
    await createServerSupabaseClient()

  let categoryId: string | null = null

  if (categorySlug !== 'all') {
    const {
      data: category,
      error: categoryError,
    } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle()

    if (categoryError) {
      return {
        categoryId: null,
        error:
          'Could not load this setup category.',
        hasMore: false,
        setups: [] as SetupListItem[],
      }
    }

    if (!category) {
      return {
        categoryId: null,
        error: null,
        hasMore: false,
        setups: [] as SetupListItem[],
      }
    }

    categoryId = category.id
  }

  let query = supabase
    .from('setups')
    .select(
      'id, slug, owner_name, short_intro, cover_image_url'
    )
    .eq('published', true)
    .is('deleted_at', null)
    .order('published_at', {
      ascending: false,
    })
    .range(0, PAGE_SIZE - 1)

  if (categoryId) {
    query = query.eq(
      'category_id',
      categoryId
    )
  }

  const { data, error } = await query

  if (error) {
    console.error(
      'Failed to load setups:',
      error.message
    )

    return {
      categoryId,
      error:
        'Could not load setups. Please refresh the page.',
      hasMore: false,
      setups: [] as SetupListItem[],
    }
  }

  const setups =
    (data || []) as SetupListItem[]

  return {
    categoryId,
    error: null,
    hasMore: setups.length === PAGE_SIZE,
    setups,
  }
}

export default async function SetupsPage({
  searchParams,
}: SetupsPageProps) {
  const params = await searchParams
  const categorySlug =
    params.category || 'all'

  const initialData =
    await getInitialSetups(categorySlug)

  return (
    <>
      <Navbar />

      <main>
        <SubscribeSection variant="testimonial" />

        <AllSetupsSection
          key={categorySlug}
          categoryId={initialData.categoryId}
          initialError={initialData.error}
          initialHasMore={
            initialData.hasMore
          }
          initialSetups={initialData.setups}
        />
      </main>

      <Footer />
    </>
  )
}
