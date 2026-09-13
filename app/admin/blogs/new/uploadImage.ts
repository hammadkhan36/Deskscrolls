'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/auth'

export async function uploadBlogImage(formData: FormData) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }

  const file = formData.get('file') as File
  if (!file) return { error: 'No file' }

  const supabase = await createServerSupabase()
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName)
  return { url: data.publicUrl }
}