import type { MetadataRoute } from 'next'
import { createServerSupabase } from '@/lib/supabase/server'

const siteUrl = 'https://deskscroll.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabase()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/setups`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    const [
      { data: setups },
      { data: blogs },
      { data: setupCategories },
    ] = await Promise.all([
      supabase
        .from('setups')
        .select('slug, updated_at, created_at')
        .eq('published', true),

      supabase
        .from('blogs')
        .select('slug, updated_at, created_at')
        .eq('published', true)
        .is('deleted_at', null),

      supabase
        .from('categories')
        .select('slug, updated_at'),
    ])

    const setupPages: MetadataRoute.Sitemap = (setups ?? [])
      .filter((setup) => setup.slug)
      .map((setup) => ({
        url: `${siteUrl}/setups/${setup.slug}`,
        lastModified: new Date(
          setup.updated_at ?? setup.created_at ?? Date.now()
        ),
        changeFrequency: 'monthly',
        priority: 0.8,
      }))

    const blogPages: MetadataRoute.Sitemap = (blogs ?? [])
      .filter((blog) => blog.slug)
      .map((blog) => ({
        url: `${siteUrl}/blogs/${blog.slug}`,
        lastModified: new Date(
          blog.updated_at ?? blog.created_at ?? Date.now()
        ),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))

    const categoryPages: MetadataRoute.Sitemap = (setupCategories ?? [])
      .filter((category) => category.slug)
      .map((category) => ({
        url: `${siteUrl}/${category.slug}`,
        lastModified: new Date(category.updated_at ?? Date.now()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }))

    return [
      ...staticPages,
      ...setupPages,
      ...blogPages,
      ...categoryPages,
    ]
  } catch (error) {
    console.error('Failed to generate sitemap:', error)

    return staticPages
  }
}
