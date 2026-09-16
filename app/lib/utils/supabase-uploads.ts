// lib/utils/supabase-uploads.ts
import { createClient } from '@/lib/supabase/client'

export async function uploadImage(
  file: File,
  bucket = 'setups',
  folder = 'content'
): Promise<string> {
  const supabase = createClient()   // ✅ ANDAR — lazy

  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return publicUrl
}
