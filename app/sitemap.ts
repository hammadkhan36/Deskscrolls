import type { MetadataRoute } from 'next'
import { createServerSupabase } from '@/lib/supabase/server'

const siteUrl = 'https://deskscroll.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabase()

  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/setups`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/brands`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    const [
      setupsResult,
      blogsResult,
      setupCategoriesResult,
      productsResult,
      productCategoriesResult,
      brandsResult,
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
        .select('slug, created_at'),

      supabase
        .from('products')
        .select('slug, updated_at, created_at')
        .eq('published', true)
        .is('deleted_at', null),

      supabase
        .from('product_categories')
        .select('slug, updated_at, created_at')
        .eq('published', true),

      supabase
        .from('brands')
        .select('slug, updated_at, created_at')
        .eq('published', true)
        .is('deleted_at', null),
    ])

    if (setupsResult.error) {
      console.error(
        'Sitemap setups error:',
        setupsResult.error.message
      )
    }

    if (blogsResult.error) {
      console.error(
        'Sitemap blogs error:',
        blogsResult.error.message
      )
    }

    if (setupCategoriesResult.error) {
      console.error(
        'Sitemap setup categories error:',
        setupCategoriesResult.error.message
      )
    }

    if (productsResult.error) {
      console.error(
        'Sitemap products error:',
        productsResult.error.message
      )
    }

    if (productCategoriesResult.error) {
      console.error(
        'Sitemap product categories error:',
        productCategoriesResult.error.message
      )
    }

    if (brandsResult.error) {
      console.error(
        'Sitemap brands error:',
        brandsResult.error.message
      )
    }

    const setupPages: MetadataRoute.Sitemap =
      (setupsResult.data ?? [])
        .filter((setup) => setup.slug)
        .map((setup) => ({
          url: `${siteUrl}/setups/${setup.slug}`,
          lastModified: new Date(
            setup.updated_at ??
              setup.created_at ??
              Date.now()
          ),
          changeFrequency: 'monthly',
          priority: 0.8,
        }))

    const blogPages: MetadataRoute.Sitemap =
      (blogsResult.data ?? [])
        .filter((blog) => blog.slug)
        .map((blog) => ({
          url: `${siteUrl}/blogs/${blog.slug}`,
          lastModified: new Date(
            blog.updated_at ??
              blog.created_at ??
              Date.now()
          ),
          changeFrequency: 'monthly',
          priority: 0.7,
        }))

    const setupCategoryPages: MetadataRoute.Sitemap =
      (setupCategoriesResult.data ?? [])
        .filter((category) => category.slug)
        .map((category) => ({
          url: `${siteUrl}/${category.slug}`,
          lastModified: new Date(
            category.created_at ?? Date.now()
          ),
          changeFrequency: 'weekly',
          priority: 0.7,
        }))

    const productPages: MetadataRoute.Sitemap =
      (productsResult.data ?? [])
        .filter((product) => product.slug)
        .map((product) => ({
          url: `${siteUrl}/products/${product.slug}`,
          lastModified: new Date(
            product.updated_at ??
              product.created_at ??
              Date.now()
          ),
          changeFrequency: 'monthly',
          priority: 0.8,
        }))

    const productCategoryPages: MetadataRoute.Sitemap =
      (productCategoriesResult.data ?? [])
        .filter((category) => category.slug)
        .map((category) => ({
          url: `${siteUrl}/products/category/${category.slug}`,
          lastModified: new Date(
            category.updated_at ??
              category.created_at ??
              Date.now()
          ),
          changeFrequency: 'weekly',
          priority: 0.7,
        }))

    const brandPages: MetadataRoute.Sitemap =
      (brandsResult.data ?? [])
        .filter((brand) => brand.slug)
        .map((brand) => ({
          url: `${siteUrl}/brands/${brand.slug}`,
          lastModified: new Date(
            brand.updated_at ??
              brand.created_at ??
              Date.now()
          ),
          changeFrequency: 'weekly',
          priority: 0.7,
        }))

    return [
      ...staticPages,
      ...setupPages,
      ...setupCategoryPages,
      ...productPages,
      ...productCategoryPages,
      ...brandPages,
      ...blogPages,
    ]
  } catch (error) {
    console.error(
      'Failed to generate sitemap:',
      error
    )

    return staticPages
  }
}
